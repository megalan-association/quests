import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const ProgressRouter = createTRPCRouter({
  status: protectedProcedure.query(async ({ ctx }) => {
    const completedPoints = await ctx.db.task.aggregate({
      where: {
        completedUsers: {
          some: {
            id: ctx.session.user.id,
          },
        },
        activated: true,
      },
      _sum: {
        points: true,
      },
    });

    const totalTasksPoints = await ctx.db.task.aggregate({
      where: {
        activated: true,
      },
      _sum: {
        points: true,
      },
    });

    const completedTasks = await ctx.db.task.count({
      where: {
        completedUsers: {
          some: {
            id: ctx.session.user.id,
          },
        },
        activated: true,
      },
    });

    const totalTasks = await ctx.db.task.count({
      where: {
        activated: true,
      },
    });

    return {
      completedPoints: completedPoints._sum.points,
      totalTasksPoints: totalTasksPoints._sum.points,
      completedTasks,
      totalTasks,
    };
  }),

  roomStatus: protectedProcedure
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

      const completedPoints = await ctx.db.task.aggregate({
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
        _sum: {
          points: true,
        },
      });

      const totalTasksPoints = await ctx.db.task.aggregate({
        where: {
          societies: {
            some: {
              id: {
                in: room.societies.map((s) => s.id),
              },
            },
          },
          activated: true,
        },
        _sum: {
          points: true,
        },
      });

      const completedTasks = await ctx.db.task.count({
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
      });

      const totalTasks = await ctx.db.task.count({
        where: {
          societies: {
            some: {
              id: {
                in: room.societies.map((s) => s.id),
              },
            },
          },
          activated: true,
        },
      });

      return {
        completedPoints: completedPoints._sum.points,
        totalTasksPoints: totalTasksPoints._sum.points,
        completedTasks,
        totalTasks,
      };
    }),
});
