import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: () => undefined } as TrpcContext["res"],
  };
}

describe("admin password endpoint", () => {
  it("accepts the configured environment password without exposing it in source", async () => {
    const configuredPassword = process.env.ADMIN_PASSWORD;
    expect(configuredPassword, "ADMIN_PASSWORD must be configured securely").toBeTruthy();

    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.contact.verifyPassword({ password: configuredPassword! });

    expect(result).toEqual({ success: true });
  });
});
