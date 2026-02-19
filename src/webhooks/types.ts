import type { components } from "../generated/openapi-types";

export interface WebhookHeaders {
  "x-webhook-event"?: string;
  "x-webhook-subscription-id"?: string;
  "x-webhook-timestamp"?: string;
  "x-webhook-signature"?: string;
}

export const SUPPORTED_WEBHOOK_EVENT_TYPES_V2026 = [
  "message.sent",
  "message.received",
  "message.read",
  "message.delivered",
  "message.failed",
  "reaction.added",
  "reaction.removed",
  "participant.added",
  "participant.removed",
  "chat.group_name_updated",
  "chat.group_icon_updated",
  "chat.group_name_update_failed",
  "chat.group_icon_update_failed",
  "chat.created",
  "chat.typing_indicator.started",
  "chat.typing_indicator.stopped"
] as const;

export type SupportedWebhookEventTypeV2026 = (typeof SUPPORTED_WEBHOOK_EVENT_TYPES_V2026)[number];

export type WebhookEventV2026 =
  | components["schemas"]["MessageSentWebhookV2"]
  | components["schemas"]["MessageReceivedWebhookV2"]
  | components["schemas"]["MessageReadWebhookV2"]
  | components["schemas"]["MessageDeliveredWebhookV2"]
  | components["schemas"]["MessageFailedWebhook"]
  | components["schemas"]["ReactionAddedWebhook"]
  | components["schemas"]["ReactionRemovedWebhook"]
  | components["schemas"]["ParticipantAddedWebhook"]
  | components["schemas"]["ParticipantRemovedWebhook"]
  | components["schemas"]["ChatGroupNameUpdatedWebhook"]
  | components["schemas"]["ChatGroupIconUpdatedWebhook"]
  | components["schemas"]["ChatGroupNameUpdateFailedWebhook"]
  | components["schemas"]["ChatGroupIconUpdateFailedWebhook"]
  | components["schemas"]["ChatCreatedWebhook"]
  | components["schemas"]["ChatTypingIndicatorStartedWebhook"]
  | components["schemas"]["ChatTypingIndicatorStoppedWebhook"];
