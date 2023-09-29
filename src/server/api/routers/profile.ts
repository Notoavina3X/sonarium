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
      const currentUserId = ctx.session?.user.id;
      const profile = await ctx.prisma.user.findUnique({
        where: { username },
        select: {
          id: true,
          name: true,
          username: true,
          image: true,
          _count: { select: { followers: true, follows: true, posts: true } },
          followers:
            currentUserId == null
              ? undefined
              : { where: { id: currentUserId } },
        },
      });

      if (profile == null) return;

      return {
        id: profile.id,
        name: profile.name,
        username: profile.username,
        image: profile.image,
        followersCount: profile._count.followers,
        followsCount: profile._count.follows,
        postsCount: profile._count.posts,
        isFollowing: profile.followers.length > 0,
      };
    }),
  toggleFollow: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ input: { userId }, ctx }) => {
      const currentUserId = ctx.session?.user.id;

      const existingFollow = await ctx.prisma.user.findFirst({
        where: { id: userId, followers: { some: { id: currentUserId } } },
      });

      let addedFollow;
      if (existingFollow == null) {
        await ctx.prisma.user.update({
          where: { id: userId },
          data: { followers: { connect: { id: currentUserId } } },
        });
        addedFollow = true;
      } else {
        await ctx.prisma.user.update({
          where: { id: userId },
          data: { followers: { disconnect: { id: currentUserId } } },
        });
        addedFollow = false;
      }

      return { addedFollow };
    }),
  infiniteFollowing: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        limit: z.number().optional(),
        cursor: z.object({ id: z.string() }).optional(),
      })
    )
    .query(async ({ input: { userId, limit = 20, cursor }, ctx }) => {
      const currentUserId = ctx.session?.user.id;

      const data = await ctx.prisma.user.findMany({
        take: limit + 1,
        cursor: cursor,
        where: { follows: { some: { id: userId } } },
        select: {
          id: true,
          name: true,
          username: true,
          image: true,
          followers:
            currentUserId == null ? false : { where: { id: currentUserId } },
        },
      });

      let nextCursor: typeof cursor | undefined;

      if (data.length > limit) {
        const nextItem = data.pop();
        if (nextItem != null) {
          nextCursor = { id: nextItem.id };
        }
      }

      return {
        following: data.map((item) => ({
          id: item.id,
          name: item.name,
          username: item.username,
          image: item.image,
          isFollowing: item.followers.length > 0,
        })),
        nextCursor,
      };
    }),
  infiniteFollowers: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        limit: z.number().optional(),
        cursor: z.object({ id: z.string() }).optional(),
      })
    )
    .query(async ({ input: { userId, limit = 20, cursor }, ctx }) => {
      const currentUserId = ctx.session?.user.id;

      const data = await ctx.prisma.user.findMany({
        take: limit + 1,
        cursor: cursor,
        where: { followers: { some: { id: userId } } },
        select: {
          id: true,
          name: true,
          username: true,
          image: true,
          followers:
            currentUserId == null ? false : { where: { id: currentUserId } },
        },
      });

      let nextCursor: typeof cursor | undefined;

      if (data.length > limit) {
        const nextItem = data.pop();
        if (nextItem != null) {
          nextCursor = { id: nextItem.id };
        }
      }

      return {
        followers: data.map((item) => ({
          id: item.id,
          name: item.name,
          username: item.username,
          image: item.image,
          isFollowing: item.followers.length > 0,
        })),
        nextCursor,
      };
    }),
  getSuggestions: protectedProcedure.query(async ({ ctx }) => {
    const currentUserId = ctx.session?.user.id;

    const data = await ctx.prisma.user.findMany({
      take: 3,
      where: {
        NOT: { id: currentUserId },
        followers: { none: { id: currentUserId } },
      },
      select: {
        id: true,
        name: true,
        username: true,
        image: true,
        _count: {
          select: {
            followers: true,
          },
        },
      },
      orderBy: {
        followers: {
          _count: "desc",
        },
      },
    });

    return data.map((item) => ({
      id: item.id,
      name: item.name,
      username: item.username,
      image: item.image,
      isFollowing: false,
    }));
  }),
});
