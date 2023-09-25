import { createTRPCRouter } from "@/server/api/trpc";
import { profileRouter } from "./routers/profile";
import { postRouter } from "./routers/post";
import { commentRouter } from "./routers/comment";
import { tagRouter } from "./routers/tag";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  profile: profileRouter,
  post: postRouter,
  comment: commentRouter,
  tag: tagRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
