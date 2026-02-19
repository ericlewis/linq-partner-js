import { LinqPartnerClient, parseWebhookEventV2026, type components } from "../src";

const client = new LinqPartnerClient({
  apiKey: "test-api-key",
  fetch: globalThis.fetch
});

type Chat = components["schemas"]["Chat"];
type Message = components["schemas"]["Message"];

async function usageSmoke(): Promise<{ chat?: Chat; message?: Message }> {
  const chats = await client.chats.list({ from: "+12223334444", limit: 10 });
  const chat = chats.chats[0];

  if (!chat) {
    return {};
  }

  const message = await client.messages.get("550e8400-e29b-41d4-a716-446655440001");

  const parsedWebhook = parseWebhookEventV2026({
    api_version: "v3",
    webhook_version: "2026-02-03",
    event_type: "message.sent",
    event_id: "550e8400-e29b-41d4-a716-446655440000",
    created_at: "2026-02-05T19:52:18.101Z",
    trace_id: "trace-1",
    partner_id: "partner-1",
    data: {}
  });

  void parsedWebhook;

  return { chat, message };
}

void usageSmoke;
