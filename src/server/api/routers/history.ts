import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";

export const historyRouter = createTRPCRouter({
  getHistory: protectedProcedure
    .input(z.object({ term: z.string().optional() }))
    .query(async ({ input: { term }, ctx }) => {
      const currentUserId = ctx.session?.user.id;

      const whereClause = term?.length
        ? { userId: currentUserId, term: { contains: term } }
        : { userId: currentUserId };

      const data = await ctx.prisma.history.findMany({
        take: 5,
        where: whereClause,
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      });

      return data;
    }),
  create: protectedProcedure
    .input(z.object({ term: z.string() }))
    .mutation(async ({ input: { term }, ctx }) => {
      const currentUserId = ctx.session?.user.id;

      const newHistory = await ctx.prisma.history.upsert({
        where: { userId_term: { userId: currentUserId, term } },
        create: {
          userId: currentUserId,
          term,
        },
        update: {
          createdAt: new Date(),
        },
      });

      return { newHistory };
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input: { id }, ctx }) => {
      const currentUserId = ctx.session?.user.id;

      const deletedHistory = await ctx.prisma.history.delete({
        where: { id, userId: currentUserId },
      });

      return { deletedHistory };
    }),
});
