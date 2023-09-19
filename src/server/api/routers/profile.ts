import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";

export const profileRouter = createTRPCRouter({
  getByUsername: publicProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ input: { username }, ctx }) => {
      const currentUserUsername = ctx.session?.user.username;
      const profile = await ctx.prisma.user.findUnique({
        where: { username },
        select: {
          name: true,
          username: true,
          image: true,
          _count: { select: { followers: true, follows: true, posts: true } },
          followers:
            currentUserUsername == null
              ? undefined
              : { where: { username: currentUserUsername } },
        },
      });

      if (profile == null) return;

      return {
        name: profile.name,
        username: profile.username,
        image: profile.image,
        followersCount: profile._count.followers,
        followsCount: profile._count.follows,
        postsCount: profile._count.posts,
        isFollowing: profile.followers.length > 0,
      };
    }),
});
