import { describe, expect, it, vi } from "vitest";

import { LinqPartnerClient } from "../src/client";
import { makeResponse } from "./test-utils";

describe("cursor pagination helpers", () => {
  it("iterates chats.listAll until next_cursor is null", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        makeResponse(200, {
          chats: [{ id: "chat-1" }],
          next_cursor: "cursor-2"
        })
      )
      .mockResolvedValueOnce(
        makeResponse(200, {
          chats: [{ id: "chat-2" }],
          next_cursor: null
        })
      );

    const client = new LinqPartnerClient({
      apiKey: "test-key",
      fetch: fetchMock as unknown as typeof fetch
    });

    const ids: string[] = [];

    for await (const chat of client.chats.listAll({ from: "+12223334444" })) {
      ids.push((chat as { id: string }).id);
    }

    expect(ids).toEqual(["chat-1", "chat-2"]);

    const firstUrl = fetchMock.mock.calls[0]?.[0] as string;
    const secondUrl = fetchMock.mock.calls[1]?.[0] as string;

    expect(firstUrl).toContain("/v3/chats?from=%2B12223334444");
    expect(secondUrl).toContain("cursor=cursor-2");
  });

  it("iterates messages.listAllByChat", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        makeResponse(200, {
          messages: [{ id: "msg-1" }],
          next_cursor: "next"
        })
      )
      .mockResolvedValueOnce(
        makeResponse(200, {
          messages: [{ id: "msg-2" }],
          next_cursor: null
        })
      );

    const client = new LinqPartnerClient({
      apiKey: "test-key",
      fetch: fetchMock as unknown as typeof fetch
    });

    const ids: string[] = [];

    for await (const message of client.messages.listAllByChat("chat-123")) {
      ids.push((message as { id: string }).id);
    }

    expect(ids).toEqual(["msg-1", "msg-2"]);
    expect((fetchMock.mock.calls[1]?.[0] as string).includes("cursor=next")).toBe(true);
  });

  it("iterates messages.listAllThreadMessages", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        makeResponse(200, {
          messages: [{ id: "thread-1" }],
          next_cursor: "more"
        })
      )
      .mockResolvedValueOnce(
        makeResponse(200, {
          messages: [{ id: "thread-2" }],
          next_cursor: null
        })
      );

    const client = new LinqPartnerClient({
      apiKey: "test-key",
      fetch: fetchMock as unknown as typeof fetch
    });

    const ids: string[] = [];

    for await (const message of client.messages.listAllThreadMessages("msg-123")) {
      ids.push((message as { id: string }).id);
    }

    expect(ids).toEqual(["thread-1", "thread-2"]);
    expect((fetchMock.mock.calls[1]?.[0] as string).includes("cursor=more")).toBe(true);
  });
});
