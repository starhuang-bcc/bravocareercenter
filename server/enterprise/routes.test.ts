import { beforeAll, afterAll, it, expect, vi } from "vitest";
import express from "express";
import type { Server } from "node:http";
import { hashPassword } from "./store";
import { emptyPlatform } from "../../shared/enterprise";
const fake = vi.hoisted(() => ({
  state: {
    accounts: [] as any[],
    companies: [],
    talents: [],
    months: [],
    demands: [],
    audit: [],
  },
  sessions: new Map<string, string>(),
}));
vi.mock("./store", async importOriginal => {
  const original = await importOriginal<typeof import("./store")>();
  return {
    ...original,
    bootstrap: vi.fn(async () => {}),
    readState: vi.fn(async () => fake.state),
    changeState: vi.fn(async (fn: any) => fn(fake.state)),
    saveSession: vi.fn(async (t: string, id: string) => {
      fake.sessions.set(t, id);
    }),
    sessionAccount: vi.fn(async (t: string) => fake.sessions.get(t)),
    deleteSession: vi.fn(async (t: string) => {
      fake.sessions.delete(t);
    }),
  };
});
import { enterpriseRouter } from "./routes";
let server: Server, origin: string;
beforeAll(async () => {
  Object.assign(fake.state, emptyPlatform());
  fake.state.accounts.push({
    id: "admin",
    name: "admin",
    email: "admin@example.com",
    role: "admin",
    passwordHash: hashPassword("correct-password"),
    active: true,
  });
  const app = express();
  app.use(express.json());
  app.use("/api/enterprise", enterpriseRouter);
  server = await new Promise<Server>(resolve => {
    const s = app.listen(0, "127.0.0.1", () => resolve(s));
  });
  const addr = server.address() as { port: number };
  origin = `http://127.0.0.1:${addr.port}`;
});
afterAll(() => new Promise<void>(resolve => server.close(() => resolve())));
it("does not expose state to unauthenticated requests", async () => {
  const r = await fetch(origin + "/api/enterprise/state");
  expect(r.status).toBe(401);
  expect(r.headers.get("cache-control")).toBe("no-store");
});
it("rejects mutations from other sites", async () => {
  const r = await fetch(origin + "/api/enterprise/action", {
    method: "POST",
    headers: {
      origin: "https://evil.example",
      "content-type": "application/json",
    },
    body: JSON.stringify({ op: "company", input: { name: "x" } }),
  });
  expect(r.status).toBe(403);
});
it("rejects incorrect login credentials", async () => {
  const r = await fetch(origin + "/api/enterprise/login", {
    method: "POST",
    headers: { origin, "content-type": "application/json" },
    body: JSON.stringify({ email: "admin@example.com", password: "wrong" }),
  });
  expect(r.status).toBe(401);
});
it("creates an HttpOnly session and scopes subsequent reads", async () => {
  const r = await fetch(origin + "/api/enterprise/login", {
    method: "POST",
    headers: { origin, "content-type": "application/json" },
    body: JSON.stringify({
      email: "admin@example.com",
      password: "correct-password",
    }),
  });
  expect(r.status).toBe(200);
  const cookie = r.headers.get("set-cookie")!;
  expect(cookie).toContain("HttpOnly");
  expect(cookie).toContain("SameSite=Strict");
  const state = await fetch(origin + "/api/enterprise/state", {
    headers: { cookie: cookie.split(";")[0] },
  });
  expect(state.status).toBe(200);
  const body = await state.json();
  expect(body.accounts[0].passwordHash).toBeUndefined();
});
