import { describe, expect, it } from "vitest";

import { parseWebhookEventV2026 } from "../src/webhooks/parse";
import { SUPPORTED_WEBHOOK_EVENT_TYPES_V2026 } from "../src/webhooks/types";

describe("parseWebhookEventV2026", () => {
  it("parses all supported 2026 event types", () => {
    for (const eventType of SUPPORTED_WEBHOOK_EVENT_TYPES_V2026) {
      const parsed = parseWebhookEventV2026({
        api_version: "v3",
        webhook_version: "2026-02-03",
        event_type: eventType,
        event_id: "550e8400-e29b-41d4-a716-446655440000",
        created_at: "2026-02-05T19:52:18.101Z",
        trace_id: "trace-1",
        partner_id: "partner-1",
        data: {}
      });

      expect(parsed.event_type).toBe(eventType);
    }
  });

  it("throws on unsupported webhook version", () => {
    expect(() =>
      parseWebhookEventV2026({
        api_version: "v3",
        webhook_version: "2025-01-01",
        event_type: "message.sent",
        event_id: "550e8400-e29b-41d4-a716-446655440000",
        created_at: "2026-02-05T19:52:18.101Z",
        trace_id: "trace-1",
        partner_id: "partner-1",
        data: {}
      })
    ).toThrow("Unsupported webhook version");
  });

  it("throws on unexpected event type", () => {
    expect(() =>
      parseWebhookEventV2026(
        {
          api_version: "v3",
          webhook_version: "2026-02-03",
          event_type: "message.sent",
          event_id: "550e8400-e29b-41d4-a716-446655440000",
          created_at: "2026-02-05T19:52:18.101Z",
          trace_id: "trace-1",
          partner_id: "partner-1",
          data: {}
        },
        { expectedEventType: "reaction.added" }
      )
    ).toThrow("Webhook event type mismatch");
  });
});
