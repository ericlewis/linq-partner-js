export function makeResponse(status: number, body?: unknown): Response {
  if (status === 204 || status === 205) {
    return new Response(null, { status });
  }

  const payload = body === undefined ? {} : body;
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      "content-type": "application/json"
    }
  });
}

export function getCall(fetchMock: { mock: { calls: unknown[][] } }): { url: string; init: RequestInit } {
  const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
  return { url, init };
}
