import { z } from "zod";

import { adminProcedure, createTRPCRouter } from "~/server/api/trpc";

export const TaskRouter = createTRPCRouter({
  create: adminProcedure
    .input(
      z.object({
        name: z.string().min(1),
        description: z.string().min(0).default(""),
        activated: z.boolean().default(false),
        points: z.number().default(100),
        societies: z.array(z.object({ id: z.number().min(1) })).min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.task.create({
        data: {
          name: input.name,
          description: input.description,
          activated: input.activated,
          points: input.points,
          completedUsers: { connect: { id: ctx.session.user.id } },
          societies: { connect: input.societies },
        },
      });
    }),

  edit: adminProcedure
    .input(
      z.object({
        id: z.number().min(1),
        name: z.string().min(1),
        description: z.string().min(0).default(""),
        activated: z.boolean().default(false),
        points: z.number().default(100),
        societies: z.array(z.object({ id: z.string().min(1) })).min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.task.update({
        where: { id: input.id },
        data: {
          name: input.name,
          description: input.description,
          points: input.points,
        },
      });
    }),

  activate: adminProcedure
    .input(z.object({ id: z.number().min(0) }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.task.update({
        where: { id: input.id },
        data: { activated: true },
      });
    }),

  deactivate: adminProcedure
    .input(z.object({ id: z.number().min(0) }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.task.update({
        where: { id: input.id },
        data: { activated: false },
      });
    }),

  complete: adminProcedure
    .input(z.object({ userId: z.number().min(0), taskId: z.number().min(0) }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.user.update({
        where: { id: input.userId },
        data: {
          completedTasks: { connect: { id: input.taskId } },
        },
      });
    }),
});
