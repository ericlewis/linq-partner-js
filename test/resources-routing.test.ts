import { describe, expect, it, vi } from "vitest";

import { LinqPartnerClient } from "../src/client";
import { makeResponse } from "./test-utils";

const CHAT_ID = "550e8400-e29b-41d4-a716-446655440000";
const MESSAGE_ID = "550e8400-e29b-41d4-a716-446655440001";
const SUBSCRIPTION_ID = "550e8400-e29b-41d4-a716-446655440002";
const ATTACHMENT_ID = "550e8400-e29b-41d4-a716-446655440003";

interface RouteCase {
  name: string;
  method: string;
  expectedUrl: string;
  status: number;
  invoke: (client: LinqPartnerClient) => Promise<unknown>;
}

const cases: RouteCase[] = [
  {
    name: "chats.create",
    method: "POST",
    expectedUrl: "https://api.linqapp.com/api/partner/v3/chats",
    status: 201,
    invoke: (client) =>
      client.chats.create({
        from: "+12223334444",
        to: ["+13334445555"],
        message: { parts: [{ type: "text", value: "hello" }] }
      })
  },
  {
    name: "chats.list",
    method: "GET",
    expectedUrl: "https://api.linqapp.com/api/partner/v3/chats?from=%2B12223334444&limit=20&cursor=abc",
    status: 200,
    invoke: (client) => client.chats.list({ from: "+12223334444", limit: 20, cursor: "abc" })
  },
  {
    name: "chats.get",
    method: "GET",
    expectedUrl: `https://api.linqapp.com/api/partner/v3/chats/${CHAT_ID}`,
    status: 200,
    invoke: (client) => client.chats.get(CHAT_ID)
  },
  {
    name: "chats.update",
    method: "PUT",
    expectedUrl: `https://api.linqapp.com/api/partner/v3/chats/${CHAT_ID}`,
    status: 200,
    invoke: (client) => client.chats.update(CHAT_ID, { display_name: "Updated" })
  },
  {
    name: "chats.addParticipant",
    method: "POST",
    expectedUrl: `https://api.linqapp.com/api/partner/v3/chats/${CHAT_ID}/participants`,
    status: 202,
    invoke: (client) => client.chats.addParticipant(CHAT_ID, { handle: "+14445556666" })
  },
  {
    name: "chats.removeParticipant",
    method: "DELETE",
    expectedUrl: `https://api.linqapp.com/api/partner/v3/chats/${CHAT_ID}/participants`,
    status: 202,
    invoke: (client) => client.chats.removeParticipant(CHAT_ID, { handle: "+14445556666" })
  },
  {
    name: "chats.startTyping",
    method: "POST",
    expectedUrl: `https://api.linqapp.com/api/partner/v3/chats/${CHAT_ID}/typing`,
    status: 204,
    invoke: (client) => client.chats.startTyping(CHAT_ID)
  },
  {
    name: "chats.stopTyping",
    method: "DELETE",
    expectedUrl: `https://api.linqapp.com/api/partner/v3/chats/${CHAT_ID}/typing`,
    status: 204,
    invoke: (client) => client.chats.stopTyping(CHAT_ID)
  },
  {
    name: "chats.markAsRead",
    method: "POST",
    expectedUrl: `https://api.linqapp.com/api/partner/v3/chats/${CHAT_ID}/read`,
    status: 204,
    invoke: (client) => client.chats.markAsRead(CHAT_ID)
  },
  {
    name: "chats.shareContactCard",
    method: "POST",
    expectedUrl: `https://api.linqapp.com/api/partner/v3/chats/${CHAT_ID}/share_contact_card`,
    status: 204,
    invoke: (client) => client.chats.shareContactCard(CHAT_ID)
  },
  {
    name: "messages.sendToChat",
    method: "POST",
    expectedUrl: `https://api.linqapp.com/api/partner/v3/chats/${CHAT_ID}/messages`,
    status: 202,
    invoke: (client) =>
      client.messages.sendToChat(CHAT_ID, {
        message: { parts: [{ type: "text", value: "hello" }] }
      })
  },
  {
    name: "messages.listByChat",
    method: "GET",
    expectedUrl: `https://api.linqapp.com/api/partner/v3/chats/${CHAT_ID}/messages?cursor=c1&limit=10`,
    status: 200,
    invoke: (client) => client.messages.listByChat(CHAT_ID, { cursor: "c1", limit: 10 })
  },
  {
    name: "messages.getThread",
    method: "GET",
    expectedUrl: `https://api.linqapp.com/api/partner/v3/messages/${MESSAGE_ID}/thread?cursor=t1&limit=5&order=desc`,
    status: 200,
    invoke: (client) => client.messages.getThread(MESSAGE_ID, { cursor: "t1", limit: 5, order: "desc" })
  },
  {
    name: "messages.sendVoiceMemoToChat",
    method: "POST",
    expectedUrl: `https://api.linqapp.com/api/partner/v3/chats/${CHAT_ID}/voicememo`,
    status: 202,
    invoke: (client) =>
      client.messages.sendVoiceMemoToChat(CHAT_ID, {
        from: "+12223334444",
        voice_memo_url: "https://example.com/voice.m4a"
      })
  },
  {
    name: "messages.get",
    method: "GET",
    expectedUrl: `https://api.linqapp.com/api/partner/v3/messages/${MESSAGE_ID}`,
    status: 200,
    invoke: (client) => client.messages.get(MESSAGE_ID)
  },
  {
    name: "messages.delete",
    method: "DELETE",
    expectedUrl: `https://api.linqapp.com/api/partner/v3/messages/${MESSAGE_ID}`,
    status: 204,
    invoke: (client) => client.messages.delete(MESSAGE_ID, { chat_id: CHAT_ID })
  },
  {
    name: "messages.sendReaction",
    method: "POST",
    expectedUrl: `https://api.linqapp.com/api/partner/v3/messages/${MESSAGE_ID}/reactions`,
    status: 200,
    invoke: (client) => client.messages.sendReaction(MESSAGE_ID, { operation: "add", type: "like" })
  },
  {
    name: "attachments.requestUpload",
    method: "POST",
    expectedUrl: "https://api.linqapp.com/api/partner/v3/attachments",
    status: 200,
    invoke: (client) =>
      client.attachments.requestUpload({
        filename: "file.png",
        content_type: "image/png",
        size_bytes: 1024
      })
  },
  {
    name: "attachments.get",
    method: "GET",
    expectedUrl: `https://api.linqapp.com/api/partner/v3/attachments/${ATTACHMENT_ID}`,
    status: 200,
    invoke: (client) => client.attachments.get(ATTACHMENT_ID)
  },
  {
    name: "phoneNumbers.list",
    method: "GET",
    expectedUrl: "https://api.linqapp.com/api/partner/v3/phonenumbers",
    status: 200,
    invoke: (client) => client.phoneNumbers.list()
  },
  {
    name: "webhooks.listEvents",
    method: "GET",
    expectedUrl: "https://api.linqapp.com/api/partner/v3/webhook-events",
    status: 200,
    invoke: (client) => client.webhooks.listEvents()
  },
  {
    name: "webhooks.createSubscription",
    method: "POST",
    expectedUrl: "https://api.linqapp.com/api/partner/v3/webhook-subscriptions",
    status: 201,
    invoke: (client) =>
      client.webhooks.createSubscription({
        target_url: "https://example.com/webhook",
        subscribed_events: ["message.sent"]
      })
  },
  {
    name: "webhooks.listSubscriptions",
    method: "GET",
    expectedUrl: "https://api.linqapp.com/api/partner/v3/webhook-subscriptions",
    status: 200,
    invoke: (client) => client.webhooks.listSubscriptions()
  },
  {
    name: "webhooks.getSubscription",
    method: "GET",
    expectedUrl: `https://api.linqapp.com/api/partner/v3/webhook-subscriptions/${SUBSCRIPTION_ID}`,
    status: 200,
    invoke: (client) => client.webhooks.getSubscription(SUBSCRIPTION_ID)
  },
  {
    name: "webhooks.updateSubscription",
    method: "PUT",
    expectedUrl: `https://api.linqapp.com/api/partner/v3/webhook-subscriptions/${SUBSCRIPTION_ID}`,
    status: 200,
    invoke: (client) => client.webhooks.updateSubscription(SUBSCRIPTION_ID, { is_active: true })
  },
  {
    name: "webhooks.deleteSubscription",
    method: "DELETE",
    expectedUrl: `https://api.linqapp.com/api/partner/v3/webhook-subscriptions/${SUBSCRIPTION_ID}`,
    status: 204,
    invoke: (client) => client.webhooks.deleteSubscription(SUBSCRIPTION_ID)
  }
];

describe("resource route wiring", () => {
  it.each(cases)("$name", async (testCase) => {
    const fetchMock = vi.fn(async () => makeResponse(testCase.status));

    const client = new LinqPartnerClient({
      apiKey: "test-key",
      fetch: fetchMock as unknown as typeof fetch
    });

    await testCase.invoke(client);

    expect(fetchMock).toHaveBeenCalledTimes(1);

    const call = fetchMock.mock.calls[0];
    expect(call).toBeDefined();
    const [url, init] = call as unknown as [string, RequestInit];
    expect(url).toBe(testCase.expectedUrl);
    expect(init.method).toBe(testCase.method);
  });
});
