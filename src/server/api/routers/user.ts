import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { CensorSensor } from 'censor-sensor';

import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";

export const UserRouter = createTRPCRouter({
  changeName: protectedProcedure
    .input(z.object({ newName: z.string().min(2)}))
    .mutation(async ({ ctx, input }) => {
      const censor = new CensorSensor();
      // Tier 1: Slurs, Tier 3: Sexual terms
      censor.disableTier(4);    // British profanity (lol)
      censor.disableTier(2);    // Common Profanity

      if (censor.isProfaneIsh(input.newName)) {
        throw new TRPCError({ code: "PARSE_ERROR", message: "New name contains profanity"})
      }

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
