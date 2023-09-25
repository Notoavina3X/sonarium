import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
  type createTRPCContext,
} from "@/server/api/trpc";
import { type Prisma } from "@prisma/client";
import { type inferAsyncReturnType } from "@trpc/server";

export const commentRouter = createTRPCRouter({
  infiniteComment: protectedProcedure
    .input(
      z.object({
        postId: z.string(),
        limit: z.number().optional(),
        cursor: z
          .object({
            createdAt: z.date(),
            userId: z.string(),
            postId: z.string(),
          })
          .optional(),
      })
    )
    .query(async ({ input: { postId, limit = 20, cursor }, ctx }) => {
      return await getInfiniteComments({
        whereClause: { parentId: null },
        postId,
        limit,
        cursor,
        ctx,
      });
    }),
  infiniteReplies: protectedProcedure
    .input(
      z.object({
        postId: z.string(),
        parentId: z.string(),
        limit: z.number().optional(),
        cursor: z
          .object({
            createdAt: z.date(),
            userId: z.string(),
            postId: z.string(),
          })
          .optional(),
      })
    )
    .query(async ({ input: { postId, parentId, limit = 3, cursor }, ctx }) => {
      return await getInfiniteComments({
        whereClause: { parentId },
        postId,
        limit,
        cursor,
        ctx,
      });
    }),
  createComment: protectedProcedure
    .input(
      z.object({
        postId: z.string(),
        content: z.string(),
        tags: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ input: { postId, content, tags }, ctx }) => {
      const data: {
        userId: string;
        postId: string;
        content: string;
        tags?: {
          connectOrCreate: {
            where: { name: string };
            create: { name: string };
          }[];
        };
      } = {
        userId: ctx.session.user.id,
        postId,
        content,
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

      const comment = await ctx.prisma.comment.create({ data });

      return comment;
    }),
  replyComment: protectedProcedure
    .input(
      z.object({
        postId: z.string(),
        parentId: z.string(),
        content: z.string(),
        tags: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ input: { postId, parentId, content, tags }, ctx }) => {
      const data: {
        userId: string;
        postId: string;
        parentId: string;
        content: string;
        tags?: {
          connectOrCreate: {
            where: { name: string };
            create: { name: string };
          }[];
        };
      } = {
        userId: ctx.session.user.id,
        postId,
        content,
        parentId,
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

      const comment = await ctx.prisma.comment.create({ data });

      return comment;
    }),
  toggleLike: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input: { id }, ctx }) => {
      const data = { userId: ctx.session?.user.id, commentId: id };

      const existingLike = await ctx.prisma.commentLike.findUnique({
        where: {
          userId_commentId: data,
        },
      });

      if (existingLike == null) {
        await ctx.prisma.commentLike.create({ data });
        return { addedLike: true };
      } else {
        await ctx.prisma.commentLike.delete({
          where: { userId_commentId: data },
        });
        return { addedLike: false };
      }
    }),
});

async function getInfiniteComments({
  whereClause,
  postId,
  ctx,
  limit,
  cursor,
}: {
  whereClause?: Prisma.CommentWhereInput;
  postId: string;
  limit: number;
  cursor: { createdAt: Date; userId: string; postId: string } | undefined;
  ctx: inferAsyncReturnType<typeof createTRPCContext>;
}) {
  const currentUserId = ctx.session?.user.id;
  const data = await ctx.prisma.comment.findMany({
    take: limit + 1,
    cursor: cursor ? { createdAt_userId_postId: cursor } : undefined,
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    where: { postId, ...whereClause },
    select: {
      id: true,
      content: true,
      tags: {
        select: {
          name: true,
        },
      },
      createdAt: true,
      userId: true,
      postId: true,
      parentId: true,
      _count: {
        select: {
          commentLikes: true,
          replies: true,
        },
      },
      commentLikes:
        currentUserId == null ? false : { where: { userId: currentUserId } },
      user: {
        select: {
          id: true,
          name: true,
          username: true,
          image: true,
        },
      },
    },
  });

  let nextCursor: typeof cursor | undefined;

  if (data.length > limit) {
    const nextItem = data.pop();
    if (nextItem != null) {
      nextCursor = {
        createdAt: nextItem.createdAt,
        userId: nextItem.userId,
        postId: nextItem.postId,
      };
    }
  }

  return {
    comments: data.map((item) => ({
      id: item.id,
      userId: item.userId,
      postId: item.postId,
      parentId: item.parentId,
      content: item.content,
      tags: item.tags.map((tag) => tag.name),
      createdAt: item.createdAt,
      user: item.user,
      isLiked: item.commentLikes.length > 0,
      likeCount: item._count.commentLikes,
      repliesCount: item._count.replies,
    })),
    nextCursor,
  };
}
