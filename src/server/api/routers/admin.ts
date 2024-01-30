import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  adminProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";

export const AdminRouter = createTRPCRouter({
  joinSociety: protectedProcedure
    .input(z.object({ id: z.number().min(0) }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          societies: { connect: { id: input.id } },
        },
      });
    }),

  leaveSociety: adminProcedure
    .input(z.object({ id: z.number().min(0) }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          societies: { disconnect: { id: input.id } },
        },
      });
    }),

  getSocietyName: protectedProcedure
    .input(z.object({ token: z.string().min(0) }))
    .query(async ({ ctx, input }) => {
      return ctx.db.society.findFirst({
        where: {
          joinToken: input.token,
        },
        select: {
          name: true,
          id: true,
          image: true,
        },
      });
    }),
});
