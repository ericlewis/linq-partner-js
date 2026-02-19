import { describe, expect, it, vi } from "vitest";

import { LinqApiError } from "../src/http/errors";
import { HttpClient } from "../src/http/request";

describe("LinqApiError mapping", () => {
  it("maps structured error response", async () => {
    const fetchMock = vi.fn(async () =>
      new Response(
        JSON.stringify({
          error: {
            status: 400,
            code: 1002,
            message: "Phone number must be in E.164 format"
          },
          success: false,
          trace_id: "trace-123"
        }),
        {
          status: 400,
          headers: {
            "content-type": "application/json"
          }
        }
      )
    );

    const client = new HttpClient({
      apiKey: "test-key",
      fetch: fetchMock as unknown as typeof fetch
    });

    await expect(
      client.request({
        method: "GET",
        path: "/v3/chats"
      })
    ).rejects.toMatchObject({
      name: "LinqApiError",
      status: 400,
      code: 1002,
      traceId: "trace-123",
      message: "Phone number must be in E.164 format"
    } satisfies Partial<LinqApiError>);
  });

  it("maps non-json error body", async () => {
    const fetchMock = vi.fn(async () =>
      new Response("gateway exploded", {
        status: 500,
        headers: {
          "content-type": "text/plain"
        }
      })
    );

    const client = new HttpClient({
      apiKey: "test-key",
      fetch: fetchMock as unknown as typeof fetch
    });

    await expect(
      client.request({
        method: "GET",
        path: "/v3/chats"
      })
    ).rejects.toMatchObject({
      name: "LinqApiError",
      status: 500,
      message: "Linq API request failed with status 500"
    } satisfies Partial<LinqApiError>);
  });
});
