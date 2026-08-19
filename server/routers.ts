import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { notifyOwner } from "./_core/notification";
import { ENV } from "./_core/env";
import { sendEmail } from "./_core/emailService";
import {
  createContactSubmission,
  getDefaultReplyTemplate,
  getContactSubmissions,
  createConsultationRequest,
} from "./db";
import { getDb } from "./db";
import { eq } from "drizzle-orm";
import { contactSubmissions } from "../drizzle/schema";

const ADMIN_PASSWORD = "star6688";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie("app_session_id", { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  contact: router({
    list: publicProcedure
      .input(
        z.object({
          category: z.string().optional(),
          keyword: z.string().optional(),
          password: z.string().optional(),
        })
      )
      .query(async ({ input }) => {
        // Verify password for accessing submissions
        if (!input.password || input.password !== ADMIN_PASSWORD) {
          return [];
        }

        const filters: any = {};
        
        // Filter by category if provided
        if (input.category && input.category !== "all") {
          // Search by category in the keyword field since category is stored as a string
          filters.keyword = input.category;
        }
        
        // Add keyword search if provided
        if (input.keyword) {
          filters.keyword = input.keyword;
        }
        
        return await getContactSubmissions(filters);
      }),
    delete: publicProcedure
      .input(
        z.object({
          ids: z.array(z.number()),
          password: z.string(),
        })
      )
      .mutation(async ({ input }) => {
        // Verify password
        if (input.password !== ADMIN_PASSWORD) {
          throw new Error("密碼錯誤");
        }

        try {
          const db = await getDb();
          if (!db) {
            throw new Error("資料庫連接失敗");
          }
          
          // Delete submissions by IDs
          for (const id of input.ids) {
            await db
              .delete(contactSubmissions)
              .where(eq(contactSubmissions.id, id));
          }
          
          return {
            success: true,
            message: `已刪除 ${input.ids.length} 條記錄`,
          };
        } catch (error) {
          console.error("[Contact] Failed to delete submissions:", error);
          throw new Error("刪除失敗");
        }
      }),
    deleteMultiple: publicProcedure
      .input(
        z.object({
          ids: z.array(z.number()).min(1, "至少選擇一條記錄"),
          password: z.string(),
        })
      )
      .mutation(async ({ input }) => {
        // Verify password
        if (input.password !== ADMIN_PASSWORD) {
          throw new Error("密碼錯誤");
        }

        if (input.ids.length === 0) {
          throw new Error("請選擇至少一條記錄");
        }

        try {
          const db = await getDb();
          if (!db) {
            throw new Error("資料庫連接失敗");
          }
          
          // Delete each submission by ID
          let deletedCount = 0;
          for (const id of input.ids) {
            await db
              .delete(contactSubmissions)
              .where(eq(contactSubmissions.id, id));
            deletedCount++;
          }
          
          console.log(`[Contact] Successfully deleted ${deletedCount} submissions`);
          
          return {
            success: true,
            deletedCount: deletedCount,
            message: `已成功刪除 ${deletedCount} 條記錄`,
          };
        } catch (error) {
          console.error("[Contact] Failed to delete multiple submissions:", error);
          throw new Error("批量刪除失敗");
        }
      }),
    verifyPassword: publicProcedure
      .input(z.object({ password: z.string() }))
      .mutation(async ({ input }) => {
        const isValid = input.password === ADMIN_PASSWORD;
        return { success: isValid };
      }),
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
        console.log("[Contact] Form submission received:", {
          category: input.category,
          lastName: input.lastName,
          firstName: input.firstName,
          email: input.email,
          phone: input.phone,
          subject: input.subject,
          messageLength: input.message.length,
        });

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
          console.log("[Contact] Successfully saved submission to database");
        } catch (error) {
          console.error("[Contact] Failed to save submission to database:", error);
        }

        // Send notification to owner via Manus platform
        let notifySuccess = false;
        try {
          notifySuccess = await notifyOwner({
            title: `新聯絡表單提交 - ${categoryName}`,
            content,
            toOpenId: ENV.ownerOpenId || undefined,
          });
          console.log(`[Contact] Notification sent: ${notifySuccess}`);
        } catch (error) {
          console.error("[Contact] Failed to send notification:", error);
        }

        // Send auto-reply to submitter
        let autoReplySuccess = false;
        try {
          const defaultTemplate = await getDefaultReplyTemplate();
          const replyContent = defaultTemplate?.content || "感謝您的詢問，我們會盡快回覆";
          
          // Send auto-reply as a notification with submitter's email in content
          autoReplySuccess = await notifyOwner({
            title: `自動回覆已發送給 ${input.email}`,
            content: `
**收件人**: ${input.email}
**主旨**: 築夢人生涯諮詢服務 - 感謝您的聯繫

${replyContent}
            `,
          });
          console.log(`[Contact] Auto-reply sent: ${autoReplySuccess}`);
        } catch (error) {
          console.error("[Contact] Failed to send auto-reply:", error);
        }

        const success = notifySuccess;

        return {
          success,
          message: success ? "訊息已送出，感謝您的聯繫！" : "訊息發送失敗，請稍後重試。",
        };
      }),
  }),

  consultations: router({
    submit: publicProcedure
      .input(
        z.object({
          name: z.string().trim().min(2, "請填寫姓名").max(128),
          email: z.string().trim().email("請填寫有效 Email").max(320),
          phone: z.string().trim().min(6, "請填寫有效電話").max(32),
          serviceType: z.enum(["career", "dream"]),
          consultationMode: z.enum(["online", "in_person"]),
          preferredTimes: z
            .array(
              z.enum([
                "平日白天 10:00–17:00",
                "平日晚上 18:00–21:00",
                "假日白天 10:00–17:00",
                "假日晚上 18:00–21:00",
              ]),
            )
            .min(1, "請至少選擇一個偏好諮詢時段")
            .max(4),
          message: z.string().trim().max(2000).optional(),
        }),
      )
      .mutation(async ({ input }) => {
        const service = input.serviceType === "career" ? "職涯諮詢" : "築夢諮詢";
        const mode = input.consultationMode === "online" ? "線上（Google Meet）" : "現場諮詢";
        const created = await createConsultationRequest({
          name: input.name,
          email: input.email,
          phone: input.phone,
          serviceType: input.serviceType,
          consultationMode: input.consultationMode,
          preferredTime: input.preferredTimes.join("、"),
          message: input.message || null,
          status: "new",
        });

        if (!created) {
          throw new Error("系統暫時無法保存預約，請稍後再試");
        }

        let notified = false;
        const emailContent = [
          `**新預約申請通知**`,
          ``,
          `**服務項目**：${service}`,
          `**姓名**：${input.name}`,
          `**Email**：${input.email}`,
          `**電話**：${input.phone}`,
          `**諮詢方式**：${mode}`,
          `**偏好時段**：${input.preferredTimes.join("、")}`,
          `**討論主題**：${input.message || "未填寫"}`,
          `**申請編號**：${created.id}`,
        ].join("\n");

        try {
          // Send email to career@bravocareercenter.com
          await sendEmail({
            to: "career@bravocareercenter.com",
            subject: `新的${service}預約申請 - ${input.name}`,
            content: emailContent,
          });

          notified = await notifyOwner({
            title: `新的${service}預約申請 - ${input.name}`,
            content: emailContent,
            toOpenId: ENV.ownerOpenId || undefined,
          });
        } catch (error) {
          console.error("[Consultations] Failed to send notification or email:", error);
        }

        return { success: true, requestId: created.id, notified } as const;
      }),
  }),
});

export type AppRouter = typeof appRouter;
