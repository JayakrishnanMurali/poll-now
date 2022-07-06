import { resolve } from "path";
import { z } from "zod";
import { createRouter } from "./context";
import Cookies from "cookies";
import { nanoid } from "nanoid";
import { createQuestionValidator } from "../../shared/create-question-validator";
import { TRPCError } from "@trpc/server";

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
  .query("get-all-my-questions", {
    async resolve({ ctx }) {
      if (!ctx.token) return [];
      return await ctx.prisma.pollQuestions.findMany({
        where: {
          ownerToken: {
            equals: ctx.token,
          },
        },
      });
    },
  })
  .query("get-by-id", {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ ctx, input }) {
      const question = await ctx.prisma.pollQuestions.findFirst({
        where: {
          id: input.id,
        },
      });

      return { question, isOwner: question?.ownerToken === ctx.token };
    },
  })
  .mutation("create", {
    input: createQuestionValidator,
    async resolve({ ctx, input }) {
      if (!ctx.token) throw new TRPCError({ code: "UNAUTHORIZED" });
      return await ctx.prisma.pollQuestions.create({
        data: {
          question: input.question,
          options: [],
          ownerToken: ctx.token,
        },
      });
    },
  });
