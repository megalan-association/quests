import { z } from "zod";

import {
  adminProcedure,
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
      },
      _sum: {
        points: true,
      },
    });

    const totalTasksPoints = await ctx.db.task.aggregate({
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
      },
    });

    const totalTasks = await ctx.db.task.count();

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
      return;
    }),
});
