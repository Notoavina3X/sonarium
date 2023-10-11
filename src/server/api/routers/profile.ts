import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { uploadImg } from "@/utils/methods";

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
          posts: {
            where: { userId: { not: currentUserId } },
            select: {
              _count: { select: { likes: true } },
            },
          },
        },
      });

      if (profile == null) return;

      const likesCount = profile.posts.reduce(
        (sum, post) => sum + post._count.likes,
        0
      );

      return {
        id: profile.id,
        name: profile.name,
        username: profile.username,
        image: profile.image,
        followersCount: profile._count.followers,
        followsCount: profile._count.follows,
        postsCount: profile._count.posts,
        likesCount,
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
  infiniteTracks: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        limit: z.number().optional(),
        cursor: z.object({ createdAt: z.date(), id: z.string() }).optional(),
      })
    )
    .query(async ({ input: { userId, limit = 10, cursor }, ctx }) => {
      const data = await ctx.prisma.post.findMany({
        take: limit + 1,
        cursor: cursor ? { createdAt_id: cursor } : undefined,
        where: { userId, track: { not: undefined } },
        select: {
          id: true,
          track: true,
          createdAt: true,
        },
      });

      let nextCursor: typeof cursor | undefined;

      if (data.length > limit) {
        const nextItem = data.pop();
        if (nextItem != null) {
          nextCursor = { id: nextItem.id, createdAt: nextItem.createdAt };
        }
      }

      return {
        postTracks: data
          .filter((item) => !!item.track)
          .map((item) => {
            const {
              id,
              image,
              title,
              titleLowercase,
              authorId,
              author,
              url,
              source,
            } = JSON.parse(JSON.stringify(item.track));

            return {
              id: item.id,
              createdAt: item.createdAt,
              track: {
                id: id,
                image: image,
                title: title,
                titleLowercase: titleLowercase,
                authorId: authorId,
                author: author,
                url: url,
                source: source,
              },
            };
          }),
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
  update: protectedProcedure
    .input(
      z.object({
        name: z.string().nullish(),
        username: z.string().nullish(),
        image: z.string().nullish().optional(),
      })
    )
    .mutation(async ({ input: { name, username, image }, ctx }) => {
      const currentUserId = ctx.session?.user.id;

      let imageUrl = "";
      let data = {};

      if (name) data = { ...data, name };
      if (username) data = { ...data, username };
      if (image) {
        imageUrl = (await uploadImg(image)) ?? "tsisy";
        data = { ...data, image: imageUrl };
      }

      const isUpdated = await ctx.prisma.user.update({
        where: { id: currentUserId },
        data,
      });

      return {
        updatedProfile: {
          id: isUpdated.id,
          name: isUpdated.name,
          username: isUpdated.username,
          image: isUpdated.image,
        },
      };
    }),
});
