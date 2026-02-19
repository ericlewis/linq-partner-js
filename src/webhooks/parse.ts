import {
  SUPPORTED_WEBHOOK_EVENT_TYPES_V2026,
  type SupportedWebhookEventTypeV2026,
  type WebhookEventV2026
} from "./types";

export interface ParseWebhookEventOptions {
  expectedEventType?: SupportedWebhookEventTypeV2026;
}

const SUPPORTED_EVENT_SET = new Set<string>(SUPPORTED_WEBHOOK_EVENT_TYPES_V2026);

export function parseWebhookEventV2026(payload: unknown, options: ParseWebhookEventOptions = {}): WebhookEventV2026 {
  if (!isRecord(payload)) {
    throw new Error("Invalid webhook payload: expected an object");
  }

  const webhookVersion = payload.webhook_version;
  if (webhookVersion !== "2026-02-03") {
    throw new Error(`Unsupported webhook version: ${String(webhookVersion)}`);
  }

  const eventType = payload.event_type;
  if (typeof eventType !== "string" || !SUPPORTED_EVENT_SET.has(eventType)) {
    throw new Error(`Unsupported webhook event type: ${String(eventType)}`);
  }

  if (options.expectedEventType && eventType !== options.expectedEventType) {
    throw new Error(`Webhook event type mismatch: expected ${options.expectedEventType}, got ${eventType}`);
  }

  if (!("data" in payload)) {
    throw new Error("Invalid webhook payload: missing data field");
  }

  return payload as WebhookEventV2026;
}

export function isWebhookEventV2026(payload: unknown): payload is WebhookEventV2026 {
  try {
    parseWebhookEventV2026(payload);
    return true;
  } catch {
    return false;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
