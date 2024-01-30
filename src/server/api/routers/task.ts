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
        societies: z.array(z.object({ id: z.string().min(1) })).min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.task.create({
        data: {
          name: input.name,
          description: input.description,
          activated: input.activated,
          points: input.points,
          User: { connect: { id: ctx.session.user.id } },
          societies: { connect: [{ id: 0 }, { id: 1 }, { id: 2 }] },
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
    .query(({ ctx, input }) => {
      return ctx.db.task.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
          description: input.description,
          activated: input.activated,
          points: input.points,
        },
      });
    }),

  activate: adminProcedure
    .input(z.object({ id: z.number().min(0) }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.task.update({
        where: {
          id: input.id,
        },
        data: {
          activated: true,
        },
      });
      return true;
    }),

  deactivate: adminProcedure
    .input(z.object({ id: z.number().min(0) }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.task.update({
        where: {
          id: input.id,
        },
        data: {
          activated: false,
        },
      });
      return true;
    }),
});
