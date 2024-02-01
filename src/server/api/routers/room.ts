import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const RoomRouter = createTRPCRouter({
  getRoomList: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.room.findMany();
  }),

  getRoomStatus: protectedProcedure
    .input(z.object({ roomId: z.number().min(1) }))
    .query(async ({ ctx, input }) => {
      const room = await ctx.db.room.findFirstOrThrow({
        where: {
          id: input.roomId,
        },
        select: {
          societies: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      });

      const completedTasks = await ctx.db.task.findMany({
        select: {
          id: true,
          name: true,
          description: true,
          points: true,
          societies: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
        where: {
          completedUsers: {
            some: {
              id: ctx.session.user.id,
            },
          },
          societies: {
            some: {
              id: {
                in: room.societies.map((s) => s.id),
              },
            },
          },
          activated: true,
        },
        distinct: ["id"],
      });

      const incompleteTasks = await ctx.db.task.findMany({
        select: {
          id: true,
          name: true,
          description: true,
          points: true,
          societies: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
        where: {
          completedUsers: {
            none: {
              id: ctx.session.user.id,
            },
          },
          societies: {
            some: {
              id: {
                in: room.societies.map((s) => s.id),
              },
            },
          },
          activated: true,
        },
        distinct: ["id"],
      });

      return {
        societies: room.societies,
        completedTasks,
        incompleteTasks,
      };
    }),
});
