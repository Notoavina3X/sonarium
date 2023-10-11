import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";

export const notificationRouter = createTRPCRouter({
  getCount: protectedProcedure.query(async ({ ctx }) => {
    const currentUserId = ctx.session?.user.id;

    const data = await ctx.prisma.notification.findMany({
      where: { userId: currentUserId, isRead: false },
      select: {
        id: true,
      },
    });

    return data.length;
  }),
  infiniteNotif: protectedProcedure
    .input(
      z.object({
        limit: z.number().optional(),
        cursor: z.object({ id: z.string(), createdAt: z.date() }).optional(),
      })
    )
    .query(async ({ input: { limit = 10, cursor }, ctx }) => {
      const currentUserId = ctx.session?.user.id;

      const data = await ctx.prisma.notification.findMany({
        take: limit + 1,
        cursor: cursor ? { createdAt_id: cursor } : undefined,
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
        where: { userId: currentUserId },
        select: {
          id: true,
          message: true,
          author: {
            select: {
              username: true,
              image: true,
            },
          },
          content: true,
          isRead: true,
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
        notifications: data.map((item) => ({
          id: item.id,
          message: item.message,
          createdAt: item.createdAt,
          isRead: item.isRead,
          author: item.author ?? null,
          content: JSON.parse(JSON.stringify(item.content)),
        })),
        nextCursor,
      };
    }),
  create: protectedProcedure
    .input(
      z.object({
        userId: z.string().optional(),
        text: z.string().optional().nullable(),
        content: z.object({
          id: z.string(),
          type: z.string(),
          postId: z.string(),
        }),
      })
    )
    .mutation(async ({ input: { userId, text, content }, ctx }) => {
      const currentUserId = ctx.session?.user.id;

      const fields = {
        authorId: currentUserId,
        message: text ?? "",
        content,
      };

      const followers = await ctx.prisma.user.findMany({
        where: {
          id: { not: currentUserId },
          followers: { some: { id: currentUserId } },
        },
        select: {
          id: true,
        },
      });

      let notifications;

      if (content.type == "post" && followers.length > 0) {
        notifications = await ctx.prisma.notification.createMany({
          data: followers.map((follower) => ({
            userId: follower.id,
            ...fields,
          })),
        });
      } else {
        if (userId) {
          notifications = await ctx.prisma.notification.create({
            data: { ...fields, userId },
          });
        }
      }

      return { notifications };
    }),
  read: protectedProcedure
    .input(
      z.object({ id: z.string().optional(), readAll: z.boolean().optional() })
    )
    .mutation(async ({ input: { id, readAll }, ctx }) => {
      let notification;

      if (!id && readAll) {
        notification = await ctx.prisma.notification.updateMany({
          where: { userId: ctx.session.user.id },
          data: {
            isRead: true,
          },
        });
      } else {
        notification = await ctx.prisma.notification.update({
          where: { id },
          data: {
            isRead: true,
          },
        });
      }

      return {
        readed: !!notification,
      };
    }),
});
