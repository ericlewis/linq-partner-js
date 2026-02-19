import type {
  components as OpenApiComponents,
  operations as OpenApiOperations,
  paths as OpenApiPaths,
  webhooks as OpenApiWebhooks
} from "./generated/openapi-types";

export { LinqPartnerClient } from "./client";

export { LinqApiError } from "./http/errors";
export type { LinqPartnerClientOptions, RequestOptions, RetryOptions } from "./http/request";

export { parseWebhookEventV2026, isWebhookEventV2026 } from "./webhooks/parse";
export { verifyWebhookSignature } from "./webhooks/verify";
export type { ParseWebhookEventOptions } from "./webhooks/parse";
export type {
  SupportedWebhookEventTypeV2026,
  WebhookEventV2026,
  WebhookHeaders
} from "./webhooks/types";

export type { components, operations, paths, webhooks } from "./generated/openapi-types";

export const types = {} as {
  components: OpenApiComponents;
  operations: OpenApiOperations;
  paths: OpenApiPaths;
  webhooks: OpenApiWebhooks;
};
