import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { getInfinitePosts } from "./post";

export const exploreRouter = createTRPCRouter({
  getByDefault: protectedProcedure
    .input(z.object({ term: z.string() }))
    .query(async ({ input: { term }, ctx }) => {
      const currentUserId = ctx.session?.user.id;

      const tags = await ctx.prisma.tag.findMany({
        take: 5,
        where: { name: { contains: term } },
      });

      const posts = await ctx.prisma.post.findMany({
        take: 5,
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
        where: {
          OR: [
            { description: { contains: term } },
            { tags: { some: { name: { contains: term } } } },
            { user: { username: { contains: term } } },
            { user: { name: { contains: term } } },
            { track: { path: "$.title", string_contains: term } },
            { track: { path: "$.author", string_contains: term } },
          ],
        },
        select: {
          id: true,
          description: true,
          tags: {
            select: {
              name: true,
            },
          },
          track: true,
          createdAt: true,
          sharedPost: {
            select: {
              id: true,
              description: true,
              tags: {
                select: {
                  name: true,
                },
              },
              track: true,
              createdAt: true,
              user: {
                select: {
                  id: true,
                  name: true,
                  username: true,
                  image: true,
                  followers:
                    currentUserId == null
                      ? undefined
                      : {
                          where: { id: currentUserId },
                          select: { id: true },
                        },
                },
              },
            },
          },
          _count: {
            select: {
              likes: true,
              comments: true,
              subposts: true,
              bookmarks: true,
            },
          },
          likes:
            currentUserId == null
              ? false
              : { where: { userId: currentUserId } },
          bookmarks:
            currentUserId == null
              ? false
              : { where: { userId: currentUserId } },
          user: {
            select: {
              id: true,
              name: true,
              username: true,
              image: true,
              followers:
                currentUserId == null
                  ? undefined
                  : {
                      where: { id: currentUserId },
                      select: {
                        id: true,
                      },
                    },
            },
          },
        },
      });

      const users = await ctx.prisma.user.findMany({
        take: 5,
        where: {
          OR: [{ name: { contains: term } }, { username: { contains: term } }],
        },
        select: {
          id: true,
          name: true,
          username: true,
          image: true,
          followers:
            currentUserId == null
              ? undefined
              : {
                  where: { id: currentUserId },
                  select: { id: true },
                },
        },
      });

      return {
        tags,
        posts: posts.map((item) => ({
          id: item.id,
          sharedPost: item.sharedPost
            ? {
                ...item.sharedPost,
                tags: item.sharedPost?.tags.map((tag) => tag.name),
                user: {
                  id: item.sharedPost?.user.id,
                  name: item.sharedPost?.user.name,
                  username: item.sharedPost?.user.username,
                  image: item.sharedPost?.user.image,
                  isFollowing: item.sharedPost?.user.followers.length > 0,
                },
              }
            : undefined,
          description: item.description,
          tags: item.tags.map((tag) => tag.name),
          track: item.track,
          createdAt: item.createdAt,
          user: {
            id: item.user.id,
            name: item.user.name,
            username: item.user.username,
            image: item.user.image,
            isFollowing: item.user.followers.length > 0,
          },
          isLiked: item.likes.length > 0,
          isBookmarked: item.bookmarks.length > 0,
          likeCount: item._count.likes,
          commentCount: item._count.comments,
          sharedCount: item._count.subposts,
          bookmarkCount: item._count.bookmarks,
        })),
        users: users.map((item) => ({
          id: item.id,
          name: item.name,
          username: item.username,
          image: item.image,
          isFollowing: item.followers.length > 0,
        })),
      };
    }),
  getByTags: protectedProcedure
    .input(
      z.object({
        term: z.string(),
        limit: z.number().optional(),
        cursor: z.object({ id: z.string() }).optional(),
      })
    )
    .query(async ({ input: { term, limit = 20, cursor }, ctx }) => {
      const data = await ctx.prisma.tag.findMany({
        take: limit + 1,
        cursor: cursor ?? undefined,
        where: { name: { contains: term } },
      });

      let nextCursor: typeof cursor | undefined;

      if (data.length > limit) {
        const nextItem = data.pop();
        if (nextItem != null) {
          nextCursor = { id: nextItem.id };
        }
      }

      return {
        tags: data,
        nextCursor,
      };
    }),
  getByPosts: protectedProcedure
    .input(
      z.object({
        term: z.string(),
        limit: z.number().optional(),
        cursor: z.object({ createdAt: z.date(), id: z.string() }).optional(),
      })
    )
    .query(async ({ input: { term, limit = 10, cursor }, ctx }) => {
      return await getInfinitePosts({
        limit,
        ctx,
        cursor,
        whereClause: {
          OR: [
            { description: { contains: term } },
            { tags: { some: { name: { contains: term } } } },
            { user: { username: { contains: term } } },
            { user: { name: { contains: term } } },
            { track: { path: "$.title", string_contains: term } },
            { track: { path: "$.author", string_contains: term } },
          ],
        },
      });
    }),
  getByUsers: protectedProcedure
    .input(
      z.object({
        term: z.string(),
        limit: z.number().optional(),
        cursor: z.object({ id: z.string() }).optional(),
      })
    )
    .query(async ({ input: { term, limit = 10, cursor }, ctx }) => {
      const currentUserId = ctx.session?.user.id;

      const data = await ctx.prisma.user.findMany({
        take: limit + 1,
        cursor: cursor,
        where: {
          OR: [{ name: { contains: term } }, { username: { contains: term } }],
        },
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
        users: data.map((item) => ({
          id: item.id,
          name: item.name,
          username: item.username,
          image: item.image,
          isFollowing: item.followers.length > 0,
        })),
        nextCursor,
      };
    }),
});
