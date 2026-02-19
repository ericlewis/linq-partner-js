import { describe, expect, it, vi } from "vitest";

import { HttpClient } from "../src/http/request";
import { makeResponse } from "./test-utils";

describe("HttpClient", () => {
  it("sends auth header and query parameters", async () => {
    const fetchMock = vi.fn(async () => makeResponse(200, { ok: true }));
    const client = new HttpClient({
      apiKey: "test-key",
      fetch: fetchMock as unknown as typeof fetch
    });

    await client.request<{ ok: boolean }>({
      method: "GET",
      path: "/v3/chats",
      query: {
        from: "+12223334444",
        limit: 20
      }
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const call = fetchMock.mock.calls[0];
    expect(call).toBeDefined();
    const [url, init] = call as unknown as [string, RequestInit];

    expect(url).toBe("https://api.linqapp.com/api/partner/v3/chats?from=%2B12223334444&limit=20");
    expect(init.method).toBe("GET");

    const headers = new Headers(init.headers);
    expect(headers.get("authorization")).toBe("Bearer test-key");
    expect(headers.get("accept")).toBe("application/json");
  });

  it("returns undefined on 204 responses", async () => {
    const fetchMock = vi.fn(async () => makeResponse(204));
    const client = new HttpClient({
      apiKey: "test-key",
      fetch: fetchMock as unknown as typeof fetch
    });

    const result = await client.request<void>({
      method: "POST",
      path: "/v3/chats/abc/read"
    });

    expect(result).toBeUndefined();
  });

  it("throws on request timeout", async () => {
    const fetchMock = vi.fn((_url: string, init?: RequestInit) => {
      return new Promise<Response>((_resolve, reject) => {
        const signal = init?.signal;
        if (!signal) {
          return;
        }

        if (signal.aborted) {
          reject(new Error("aborted"));
          return;
        }

        signal.addEventListener(
          "abort",
          () => {
            reject(new Error("aborted"));
          },
          { once: true }
        );
      });
    });

    const client = new HttpClient({
      apiKey: "test-key",
      fetch: fetchMock as unknown as typeof fetch
    });

    await expect(
      client.request({
        method: "GET",
        path: "/v3/chats",
        requestOptions: {
          timeoutMs: 10
        }
      })
    ).rejects.toThrow("Request timed out after 10ms");
  });
});
