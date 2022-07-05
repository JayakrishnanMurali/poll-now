import { resolve } from "path";
import { z } from "zod";
import { createRouter } from "./context";

export const questionRouter = createRouter()
  .query("get-all", {
    async resolve({ ctx }) {
      return await ctx.prisma.pollQuestions.findMany();
    },
  })
  .mutation("create", {
    input: z.object({
      question: z.string().min(5).max(600),
    }),
    async resolve({ ctx, input }) {
      return await ctx.prisma.pollQuestions.create({
        data: {
          question: input.question,
        },
      });
    },
  });
