import { z } from "zod";

import {
  adminProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";

export const RoomRouter = createTRPCRouter({
  getRoomList: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.room.findMany();
  }),
});
