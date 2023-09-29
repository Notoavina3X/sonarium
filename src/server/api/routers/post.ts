import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
  type createTRPCContext,
} from "@/server/api/trpc";
import { type Prisma } from "@prisma/client";
import { type inferAsyncReturnType } from "@trpc/server";

export const postRouter = createTRPCRouter({
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input: { id }, ctx }) => {
      const currentUserId = ctx.session?.user.id;

      const post = await ctx.prisma.post.findUnique({
        where: { id },
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
                      ? false
                      : { where: { id: currentUserId } },
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
                  ? false
                  : { where: { id: currentUserId } },
            },
          },
        },
      });

      if (post == null) return;

      return {
        id: post.id,
        sharedPost: post.sharedPost
          ? {
              ...post.sharedPost,
              tags: post.sharedPost.tags.map((tag) => tag.name),
              user: {
                id: post.sharedPost.user.id,
                name: post.sharedPost.user.name,
                username: post.sharedPost.user.username,
                image: post.sharedPost.user.image,
                isFollowing: post.sharedPost?.user.followers.length > 0,
              },
            }
          : undefined,
        description: post.description,
        tags: post.tags.map((tag) => tag.name),
        track: post.track,
        createdAt: post.createdAt,
        user: {
          id: post.user.id,
          name: post.user.name,
          username: post.user.username,
          image: post.user.image,
          isFollowing: post.user.followers.length > 0,
        },
        isLiked: post.likes.length > 0,
        isBookmarked: post.bookmarks.length > 0,
        likeCount: post._count.likes,
        commentCount: post._count.comments,
        sharedCount: post._count.subposts,
        bookmarkCount: post._count.bookmarks,
      };
    }),
  infiniteProfileFeed: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        limit: z.number().optional(),
        cursor: z.object({ id: z.string(), createdAt: z.date() }).optional(),
      })
    )
    .query(async ({ input: { limit = 10, userId, cursor }, ctx }) => {
      return await getInfinitePosts({
        limit,
        ctx,
        cursor,
        whereClause: { userId },
      });
    }),
  infiniteFeed: publicProcedure
    .input(
      z.object({
        onlyFollowing: z.boolean().optional(),
        onlyBookmarked: z.boolean().optional(),
        limit: z.number().optional(),
        cursor: z.object({ id: z.string(), createdAt: z.date() }).optional(),
      })
    )
    .query(
      async ({
        input: {
          limit = 10,
          onlyBookmarked = false,
          onlyFollowing = false,
          cursor,
        },
        ctx,
      }) => {
        const currentUserId = ctx.session?.user.id;

        let condition;
        if (currentUserId == null) condition = undefined;
        else {
          if (onlyFollowing)
            condition = {
              user: { followers: { some: { id: currentUserId } } },
            };
          if (onlyBookmarked)
            condition = { bookmarks: { some: { userId: currentUserId } } };
        }

        return await getInfinitePosts({
          limit,
          ctx,
          cursor,
          whereClause: condition,
        });
      }
    ),
  create: protectedProcedure
    .input(
      z.object({
        description: z.string().optional(),
        tags: z.array(z.string()).optional(),
        track: z
          .object({
            id: z.string(),
            image: z.string(),
            title: z.string(),
            titleLowercase: z.string(),
            authorId: z.string(),
            author: z.string(),
            url: z.string(),
            source: z.string(),
          })
          .optional()
          .nullish(),
      })
    )
    .mutation(async ({ input: { description, tags, track }, ctx }) => {
      const data: {
        userId: string;
        description: string | undefined;
        tags?: {
          connectOrCreate: {
            where: { name: string };
            create: { name: string };
          }[];
        };
        track:
          | {
              id: string;
              image: string;
              title: string;
              titleLowercase: string;
              authorId: string;
              author: string;
              url: string;
              source: string;
            }
          | undefined;
      } = {
        userId: ctx.session.user.id,
        description,
        track: track !== null ? track : undefined,
      };

      if (tags && tags.length > 0) {
        data.tags = {
          connectOrCreate: tags.map((tag) => {
            return {
              where: { name: tag },
              create: { name: tag },
            };
          }),
        };
      }

      const post = await ctx.prisma.post.create({ data });

      return post;
    }),
  share: protectedProcedure
    .input(
      z.object({
        description: z.string().optional(),
        tags: z.array(z.string()).optional(),
        postId: z.string(),
      })
    )
    .mutation(async ({ input: { description, tags, postId }, ctx }) => {
      const data: {
        userId: string;
        description: string | undefined;
        tags?: {
          connectOrCreate: {
            where: { name: string };
            create: { name: string };
          }[];
        };
        sharedId: string;
      } = {
        userId: ctx.session.user.id,
        description,
        sharedId: postId,
      };

      if (tags && tags.length > 0) {
        data.tags = {
          connectOrCreate: tags.map((tag) => {
            return {
              where: { name: tag },
              create: { name: tag },
            };
          }),
        };
      }

      const shared = await ctx.prisma.post.create({
        data,
      });

      return shared;
    }),
  toggleLike: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input: { id }, ctx }) => {
      const data = { postId: id, userId: ctx.session?.user.id };

      const existingLike = await ctx.prisma.like.findUnique({
        where: { userId_postId: data },
      });

      if (existingLike == null) {
        await ctx.prisma.like.create({ data });
        return { addedLike: true };
      } else {
        await ctx.prisma.like.delete({ where: { userId_postId: data } });
        return { addedLike: false };
      }
    }),
  toggleBookmark: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input: { id }, ctx }) => {
      const data = { postId: id, userId: ctx.session?.user.id };

      const existingBookmark = await ctx.prisma.bookmark.findUnique({
        where: { userId_postId: data },
      });

      if (existingBookmark == null) {
        await ctx.prisma.bookmark.create({ data });
        return { addedBookmark: true };
      } else {
        await ctx.prisma.bookmark.delete({ where: { userId_postId: data } });
        return { addedBookmark: false };
      }
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input: { id }, ctx }) => {
      const deletedPost = await ctx.prisma.post.delete({ where: { id } });

      await ctx.prisma.notification.updateMany({
        where: { content: { equals: id, path: "postId" } },
        data: {
          content: {
            id: "",
            type: "post",
            postId: "",
          },
          isRead: true,
        },
      });

      return {
        isDeleted: !!deletedPost,
      };
    }),
});

async function getInfinitePosts({
  whereClause,
  ctx,
  limit,
  cursor,
}: {
  whereClause?: Prisma.PostWhereInput;
  limit: number;
  cursor: { id: string; createdAt: Date } | undefined;
  ctx: inferAsyncReturnType<typeof createTRPCContext>;
}) {
  const currentUserId = ctx.session?.user.id;

  const data = await ctx.prisma.post.findMany({
    take: limit + 1,
    cursor: cursor ? { createdAt_id: cursor } : undefined,
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    where: whereClause,
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
        currentUserId == null ? false : { where: { userId: currentUserId } },
      bookmarks:
        currentUserId == null ? false : { where: { userId: currentUserId } },
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
                },
        },
      },
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
    posts: data.map((item) => ({
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
    nextCursor,
  };
}
