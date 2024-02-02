import { TaskRouter } from "~/server/api/routers/task";
import { createTRPCRouter } from "~/server/api/trpc";
import { AdminRouter } from "./routers/admin";
import { RoomRouter } from "./routers/room";
import { ProgressRouter } from "./routers/progress";
import { UserRouter } from "./routers/user";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  task: TaskRouter,
  admin: AdminRouter,
  room: RoomRouter,
  progress: ProgressRouter,
  user: UserRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
