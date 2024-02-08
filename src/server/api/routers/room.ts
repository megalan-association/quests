import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { db } from "~/server/db";

export const RoomRouter = createTRPCRouter({
  getRoomList: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.room.findMany();
  }),

  // for client side rendering
  getRoomData: protectedProcedure
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
          id: true,
          name: true,
          image: true,
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
        info: { id: room.id, name: room.name, image: room.image },
        societies: room.societies,
        completedTasks,
        incompleteTasks,
      };
    }),
});

// turned this into a function for Server Side Rendering
export const getRoomData = async (roomId: number, userId: number) => {
  // .input(z.object({ roomId: z.number().min(1) }))
  // .query(async ({ ctx, input }) => {
  const room = await db.room.findFirstOrThrow({
    where: {
      id: roomId,
    },
    select: {
      societies: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
      id: true,
      image: true,
      name: true,
    },
  });

  const completedTasks = await db.task.findMany({
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
          id: userId,
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

  const incompleteTasks = await db.task.findMany({
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
          id: userId,
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
    info: { id: room.id, name: room.name, image: room.image },
    societies: room.societies,
    completedTasks,
    incompleteTasks,
  };
};

export type roomData = {
  info: { id: number; name: string; image: string | null };
  societies: roomSocieties[];
  completedTasks: roomTask[];
  incompleteTasks: roomTask[];
};

export type roomTask = {
  id: number;
  name: string;
  societies: {
    id: number;
    name: string;
    image: string | null;
  }[];
  description: string;
  points: number;
  activated?: boolean;
};

export type roomSocieties = {
  id: number;
  name: string;
  image: string | null;
};
