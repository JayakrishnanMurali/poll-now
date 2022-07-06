import { resolve } from "path";
import { z } from "zod";
import { createRouter } from "./context";
import Cookies from "cookies";
import { nanoid } from "nanoid";

export const questionRouter = createRouter()
  .middleware(async ({ ctx, next }) => {
    if (!ctx.req?.cookies["poll-token"]) {
      const req: any = ctx.req;
      const res: any = ctx.res;
      const cookies = new Cookies(req, res);

      const random = nanoid();

      cookies.set("poll-token", random, { sameSite: "strict" });
      return next();
    }
    return next();
  })
  .query("get-all", {
    async resolve({ ctx }) {
      return await ctx.prisma.pollQuestions.findMany();
    },
  })
  .query("get-by-id", {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ ctx, input }) {
      return await ctx.prisma.pollQuestions.findFirst({
        where: {
          id: input.id,
        },
      });
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
          options: [],
        },
      });
    },
  });
