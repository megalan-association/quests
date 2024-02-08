import { Session } from "next-auth";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { db } from "~/server/db";

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

  leaderboard: publicProcedure.query(async ({ ctx }) => {
    const leaderboard = await ctx.db.$queryRaw<
      {
        id: number;
        name: string | null;
        image: string | null;
        points: number;
      }[]
    >`
    select
        u.id,
        u.name,
        u.image,
        sum(t.points) as points
    from
        "User" u
        join "_TaskToUser" ttu on ttu."B" = u.id
        join "Task" t on ttu."A" = t.id
    group by
        u.id, points
    order by
        points desc;
    `;

    return leaderboard;
  }),
});

export const ssrStatus = async (session: Session) => {
  const completedPoints = await db.task.aggregate({
    where: {
      completedUsers: {
        some: {
          id: session.user.id,
        },
      },
      activated: true,
    },
    _sum: {
      points: true,
    },
  });

  const totalTasksPoints = await db.task.aggregate({
    where: {
      activated: true,
    },
    _sum: {
      points: true,
    },
  });

  const completedTasks = await db.task.count({
    where: {
      completedUsers: {
        some: {
          id: session.user.id,
        },
      },
      activated: true,
    },
  });

  const totalTasks = await db.task.count({
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
}

export const ssrLeaderboard = async () => {
  const leaderboard = await db.$queryRaw<
      {
        id: number;
        name: string | null;
        image: string | null;
        points: number;
      }[]
    >`
    select
        u.id,
        u.name,
        u.image,
        sum(t.points) as points
    from
        "User" u
        join "_TaskToUser" ttu on ttu."B" = u.id
        join "Task" t on ttu."A" = t.id
    group by
        u.id, points
    order by
        points desc;
    `;

    return leaderboard;
}