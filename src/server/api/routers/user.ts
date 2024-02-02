import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";

export const UserRouter = createTRPCRouter({
  changeName: protectedProcedure
    .input(z.object({ newName: z.string().min(0) }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          name: input.newName, 
        },
      });
    }),
});
