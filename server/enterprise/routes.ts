import { Router } from "express";
import { createHash, randomBytes, randomUUID } from "node:crypto";
import { parse } from "cookie";
import { z } from "zod";
import {
  bootstrap,
  changeState,
  deleteSession,
  hashPassword,
  readState,
  saveSession,
  sessionAccount,
  verifyPassword,
} from "./store";
import { audit, mutate, requireRole, view } from "./service";
const cookie = "bravo_enterprise_session";
const digest = (t: string) => createHash("sha256").update(t).digest("hex");
const attempts = new Map<string, { count: number; reset: number }>();
export const enterpriseRouter = Router();
let boot: Promise<void> | undefined;
enterpriseRouter.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "GET") {
    const origin = req.get("origin");
    const expected =
      process.env.ENTERPRISE_ORIGIN ||
      `${process.env.NODE_ENV === "production" || req.secure ? "https" : "http"}://${req.get("host")}`;
    if (!origin || origin !== expected) {
      res.status(403).json({ error: "請從企業平台頁面操作" });
      return;
    }
  }
  next();
});
enterpriseRouter.use(async (_req, res, next) => {
  try {
    boot ??= bootstrap();
    await boot;
    next();
  } catch {
    boot = undefined;
    res.status(503).json({ error: "企業平台資料庫尚未就緒，請聯絡 BRAVO" });
  }
});
enterpriseRouter.post("/login", async (req, res) => {
  try {
    const p = z
      .object({
        email: z.string().email().max(320),
        password: z.string().min(1).max(200),
      })
      .parse(req.body);
    const key = (req.ip || "") + ":" + p.email.toLowerCase();
    const now = Date.now();
    if (attempts.size > 10000)
      attempts.forEach((v, k) => {
        if (v.reset < now) attempts.delete(k);
      });
    const attempt = attempts.get(key);
    if (attempt && attempt.reset > now && attempt.count >= 8) {
      res.status(429).json({ error: "嘗試次數過多，請稍後再試" });
      return;
    }
    attempts.set(key, {
      count: attempt && attempt.reset > now ? attempt.count + 1 : 1,
      reset: attempt && attempt.reset > now ? attempt.reset : now + 900000,
    });
    const s = await readState();
    const a = s.accounts.find(
      a => a.active && a.email === p.email.toLowerCase()
    );
    if (!a || !verifyPassword(p.password, a.passwordHash)) {
      res.status(401).json({ error: "帳號或密碼錯誤" });
      return;
    }
    attempts.delete(key);
    const token = randomBytes(32).toString("hex");
    await saveSession(digest(token), a.id);
    res.cookie(cookie, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/api/enterprise",
      maxAge: 8 * 3600000,
    });
    res.json({ ok: true });
  } catch {
    res.status(400).json({ error: "無法登入，請檢查資料" });
  }
});
enterpriseRouter.use(async (req, res, next) => {
  try {
    const token = parse(req.headers.cookie || "")[cookie];
    const id = token ? await sessionAccount(digest(token)) : undefined;
    const s = await readState();
    const a = s.accounts.find(a => a.id === id && a.active);
    if (!a) {
      res.status(401).json({ error: "請先登入" });
      return;
    }
    res.locals.account = a;
    next();
  } catch {
    res.status(503).json({ error: "資料庫暫時無法連線" });
  }
});
enterpriseRouter.get("/state", async (_req, res) => {
  try {
    res.json(view(await readState(), res.locals.account));
  } catch {
    res.status(503).json({ error: "無法讀取資料" });
  }
});
enterpriseRouter.post("/logout", async (req, res) => {
  try {
    const token = parse(req.headers.cookie || "")[cookie];
    if (token) await deleteSession(digest(token));
    res.clearCookie(cookie, { path: "/api/enterprise" });
    res.json({ ok: true });
  } catch {
    res.status(503).json({ error: "無法登出，請稍後再試" });
  }
});
enterpriseRouter.post("/action", async (req, res) => {
  try {
    const p = z.object({ op: z.string(), input: z.unknown() }).parse(req.body);
    await changeState(s => {
      const a = s.accounts.find(
        a => a.id === res.locals.account.id && a.active
      );
      if (!a) throw Error("無權限");
      mutate(s, a, p.op, p.input);
    });
    res.json({ ok: true });
  } catch (e) {
    res.status(400).json({
      error:
        e instanceof z.ZodError
          ? "欄位格式錯誤"
          : e instanceof Error
            ? e.message
            : "無法儲存",
    });
  }
});
enterpriseRouter.post("/account", async (req, res) => {
  try {
    requireRole(res.locals.account, "admin");
    const p = z
      .object({
        email: z.string().email().max(320),
        name: z.string().trim().min(1).max(100),
        password: z.string().min(12).max(200),
        role: z.enum(["company", "talent"]),
        companyId: z.string(),
        talentId: z.string().optional(),
      })
      .parse(req.body);
    await changeState(s => {
      if (s.accounts.some(a => a.email === p.email.toLowerCase()))
        throw Error("Email 已使用");
      if (!s.companies.some(c => c.id === p.companyId))
        throw Error("廠商不存在");
      if (
        p.role === "talent" &&
        !s.talents.some(t => t.id === p.talentId && t.companyId === p.companyId)
      )
        throw Error("人才與廠商不相符");
      s.accounts.push({
        id: randomUUID(),
        email: p.email.toLowerCase(),
        name: p.name,
        role: p.role,
        companyId: p.companyId,
        talentId: p.role === "talent" ? p.talentId : undefined,
        passwordHash: hashPassword(p.password),
        active: true,
      });
      audit(s, res.locals.account, "建立帳號", p.email);
    });
    res.json({ ok: true });
  } catch (e) {
    res.status(400).json({
      error:
        e instanceof z.ZodError
          ? "欄位格式錯誤（密碼至少 12 字元）"
          : e instanceof Error
            ? e.message
            : "無法建立",
    });
  }
});

enterpriseRouter.post("/password", async (req, res) => {
  try {
    const p = z
      .object({
        oldPassword: z.string().max(200),
        password: z.string().min(12).max(200),
      })
      .parse(req.body);
    await changeState(s => {
      const a = s.accounts.find(
        a => a.id === res.locals.account.id && a.active
      );
      if (!a || !verifyPassword(p.oldPassword, a.passwordHash))
        throw Error("原密碼錯誤");
      a.passwordHash = hashPassword(p.password);
      audit(s, a, "變更密碼", a.id);
    });
    res.json({ ok: true });
  } catch (e) {
    res.status(400).json({
      error:
        e instanceof z.ZodError
          ? "新密碼至少 12 字元"
          : e instanceof Error
            ? e.message
            : "無法變更密碼",
    });
  }
});
enterpriseRouter.post("/account-status", async (req, res) => {
  try {
    requireRole(res.locals.account, "admin");
    const p = z.object({ id: z.string(), active: z.boolean() }).parse(req.body);
    await changeState(s => {
      const a = s.accounts.find(a => a.id === p.id);
      if (!a || a.role === "admin") throw Error("不可停用管理員");
      a.active = p.active;
      audit(s, res.locals.account, "帳號狀態", a.id);
    });
    res.json({ ok: true });
  } catch (e) {
    res
      .status(400)
      .json({ error: e instanceof Error ? e.message : "無法儲存" });
  }
});
