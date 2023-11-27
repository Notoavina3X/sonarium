import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";

export const tagRouter = createTRPCRouter({
  getTop: publicProcedure
    .input(z.object({ limit: z.number().optional() }))
    .query(async ({ input: { limit = 3 }, ctx }) => {
      const data = await ctx.prisma.tag.findMany({
        take: limit,
        select: {
          id: true,
          name: true,
          _count: {
            select: {
              posts: true,
            },
          },
        },
      });

      return {
        tags: data
          .map((tag) => ({
            id: tag.id,
            name: tag.name,
            postsCount: tag._count.posts,
          }))
          .sort((a, b) => b.postsCount - a.postsCount),
      };
    }),
});
