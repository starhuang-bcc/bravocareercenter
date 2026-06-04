import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { notifyOwner } from "./_core/notification";
import { sendEmail } from "./_core/emailService";
import { ENV } from "./_core/env";
import {
  createContactSubmission,
  getDefaultReplyTemplate,
} from "./db";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  contact: router({
    submit: publicProcedure
      .input(
        z.object({
          category: z.string(),
          lastName: z.string().min(1),
          firstName: z.string().min(1),
          email: z.string().email(),
          phone: z.string().optional(),
          subject: z.string().optional(),
          message: z.string().min(1),
        })
      )
      .mutation(async ({ input }) => {
        const categoryLabel: Record<string, string> = {
          "1": "求才企業",
          "2": "合作詢問",
          "3": "測驗結果應用與生涯諮詢",
          "4": "申訴反應",
          "5": "其他事項",
        };

        const categoryName = categoryLabel[input.category] || "未分類";

        const content = `
**新聯絡表單提交**

**諮詢類別**: ${categoryName}
**姓名**: ${input.lastName}${input.firstName}
**Email**: ${input.email}
**電話**: ${input.phone || "未提供"}
**主旨**: ${input.subject || "未提供"}

**訊息內容**:
${input.message}
        `;

        // Save to database
        try {
          await createContactSubmission({
            category: input.category,
            lastName: input.lastName,
            firstName: input.firstName,
            email: input.email,
            phone: input.phone,
            subject: input.subject,
            message: input.message,
            status: "new",
          });
        } catch (error) {
          console.error("[Contact] Failed to save submission to database:", error);
        }

        // Send email to company email address
        const emailSuccess = ENV.companyEmail
          ? await sendEmail({
              to: ENV.companyEmail,
              subject: `新聯絡表單提交 - ${categoryName}`,
              content,
            })
          : false;

        // Also notify owner via platform notification
        const notifySuccess = await notifyOwner({
          title: `新聯絡表單提交 - ${categoryName}`,
          content,
        });

        // Send auto-reply email to the submitter
        let autoReplySuccess = false;
        try {
          const defaultTemplate = await getDefaultReplyTemplate();
          const replyContent = defaultTemplate?.content || "感謝您的詢問，我們會盡快回覆";
          
          autoReplySuccess = await sendEmail({
            to: input.email,
            subject: "築夢人生涯諮詢服務 - 感謝您的聯繫",
            content: replyContent,
          });
        } catch (error) {
          console.error("[Contact] Failed to send auto-reply email:", error);
        }

        const success = emailSuccess || notifySuccess;

        return {
          success,
          message: success ? "訊息已送出，感謝您的聯繫！" : "訊息發送失敗，請稍後重試。",
        };
      }),
  }),
});

export type AppRouter = typeof appRouter;
