import { createHmac } from "node:crypto";

import { describe, expect, it } from "vitest";

import { verifyWebhookSignature } from "../src/webhooks/verify";

describe("verifyWebhookSignature", () => {
  it("returns true for valid signature", async () => {
    const signingSecret = "super-secret";
    const payload = JSON.stringify({ hello: "world" });
    const timestamp = Math.floor(Date.now() / 1000).toString();

    const signature = createHmac("sha256", signingSecret)
      .update(`${timestamp}.${payload}`)
      .digest("hex");

    const result = await verifyWebhookSignature({
      signingSecret,
      payload,
      timestamp,
      signature
    });

    expect(result).toBe(true);
  });

  it("returns false for invalid signature", async () => {
    const result = await verifyWebhookSignature({
      signingSecret: "super-secret",
      payload: "{}",
      timestamp: Math.floor(Date.now() / 1000).toString(),
      signature: "deadbeef"
    });

    expect(result).toBe(false);
  });

  it("returns false for stale timestamp", async () => {
    const signingSecret = "super-secret";
    const payload = "{}";
    const timestamp = "100";

    const signature = createHmac("sha256", signingSecret)
      .update(`${timestamp}.${payload}`)
      .digest("hex");

    const result = await verifyWebhookSignature({
      signingSecret,
      payload,
      timestamp,
      signature,
      now: 1_000,
      toleranceSeconds: 60
    });

    expect(result).toBe(false);
  });
});
