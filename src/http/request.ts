import { toLinqApiError } from "./errors";
import { interpolatePath, type PathParamsRecord } from "./path";
import { buildQueryString, type QueryRecord } from "./query";

export interface RetryOptions {
  retries?: number;
  baseDelayMs?: number;
  maxDelayMs?: number;
  retryOnStatuses?: number[];
}

export interface RequestOptions {
  signal?: AbortSignal;
  timeoutMs?: number;
  headers?: HeadersInit;
  retry?: RetryOptions;
}

export interface LinqPartnerClientOptions {
  apiKey: string;
  baseUrl?: string;
  fetch?: typeof globalThis.fetch;
  timeoutMs?: number;
  retry?: RetryOptions;
}

export interface ApiRequestConfig {
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  path: string;
  pathParams?: PathParamsRecord | undefined;
  query?: QueryRecord | undefined;
  body?: unknown;
  headers?: HeadersInit | undefined;
  requestOptions?: RequestOptions | undefined;
}

const DEFAULT_BASE_URL = "https://api.linqapp.com/api/partner";
const DEFAULT_TIMEOUT_MS = 30_000;
const DEFAULT_RETRY_OPTIONS: Required<RetryOptions> = {
  retries: 0,
  baseDelayMs: 250,
  maxDelayMs: 2_000,
  retryOnStatuses: [408, 429, 500, 502, 503, 504]
};

export class HttpClient {
  private readonly apiKey: string;
  private readonly baseUrl: string;
  private readonly fetchImpl: typeof globalThis.fetch;
  private readonly defaultTimeoutMs: number;
  private readonly retryOptions: Required<RetryOptions>;

  public constructor(options: LinqPartnerClientOptions) {
    if (!options.apiKey?.trim()) {
      throw new Error("`apiKey` is required");
    }

    const resolvedFetch = options.fetch ?? globalThis.fetch;

    if (typeof resolvedFetch !== "function") {
      throw new Error("No fetch implementation available. Pass `fetch` in LinqPartnerClient options.");
    }

    this.apiKey = options.apiKey;
    this.baseUrl = normalizeBaseUrl(options.baseUrl ?? DEFAULT_BASE_URL);
    // Some runtimes require fetch to be invoked with the global object as `this`.
    this.fetchImpl = resolvedFetch.bind(globalThis) as typeof globalThis.fetch;
    this.defaultTimeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
    this.retryOptions = {
      ...DEFAULT_RETRY_OPTIONS,
      ...(options.retry ?? {})
    };
  }

  public async request<T>(config: ApiRequestConfig): Promise<T> {
    const path = interpolatePath(config.path, config.pathParams);
    const queryString = buildQueryString(config.query);
    const url = `${this.baseUrl}${path}${queryString ? `?${queryString}` : ""}`;

    const retryOptions = {
      ...this.retryOptions,
      ...(config.requestOptions?.retry ?? {})
    };

    let attempt = 0;

    while (true) {
      try {
        return await this.executeOnce<T>(url, config, config.requestOptions);
      } catch (error) {
        const canRetry = shouldRetry(error, retryOptions, attempt);
        if (!canRetry) {
          throw error;
        }

        attempt += 1;
        await sleep(backoffDelay(attempt, retryOptions.baseDelayMs, retryOptions.maxDelayMs));
      }
    }
  }

  private async executeOnce<T>(url: string, config: ApiRequestConfig, requestOptions?: RequestOptions): Promise<T> {
    const headers = new Headers();
    headers.set("accept", "application/json");
    headers.set("authorization", `Bearer ${this.apiKey}`);

    if (config.headers) {
      applyHeaders(headers, config.headers);
    }
    if (requestOptions?.headers) {
      applyHeaders(headers, requestOptions.headers);
    }

    const init: RequestInit = {
      method: config.method,
      headers
    };

    if (config.body !== undefined) {
      if (!headers.has("content-type")) {
        headers.set("content-type", "application/json");
      }
      init.body = JSON.stringify(config.body);
    }

    const response = await this.fetchWithTimeout(url, init, requestOptions);

    if (response.ok) {
      if (response.status === 204 || response.status === 205) {
        return undefined as T;
      }

      const contentType = response.headers.get("content-type") ?? "";
      if (contentType.includes("application/json")) {
        return (await response.json()) as T;
      }

      const text = await response.text();
      if (!text) {
        return undefined as T;
      }

      try {
        return JSON.parse(text) as T;
      } catch {
        return text as T;
      }
    }

    const rawBody = await response.text();
    throw toLinqApiError(response, rawBody);
  }

  private async fetchWithTimeout(url: string, init: RequestInit, requestOptions?: RequestOptions): Promise<Response> {
    const timeoutMs = requestOptions?.timeoutMs ?? this.defaultTimeoutMs;
    const abortController = new AbortController();

    let didTimeout = false;

    const onAbort = () => {
      abortController.abort(requestOptions?.signal?.reason);
    };

    if (requestOptions?.signal) {
      if (requestOptions.signal.aborted) {
        abortController.abort(requestOptions.signal.reason);
      } else {
        requestOptions.signal.addEventListener("abort", onAbort, { once: true });
      }
    }

    const timeoutHandle = setTimeout(() => {
      didTimeout = true;
      abortController.abort();
    }, timeoutMs);

    try {
      return await this.fetchImpl(url, {
        ...init,
        signal: abortController.signal
      });
    } catch (error) {
      if (didTimeout) {
        throw new Error(`Request timed out after ${timeoutMs}ms`);
      }
      throw error;
    } finally {
      clearTimeout(timeoutHandle);
      requestOptions?.signal?.removeEventListener("abort", onAbort);
    }
  }
}

function shouldRetry(error: unknown, retryOptions: Required<RetryOptions>, attempt: number): boolean {
  if (attempt >= retryOptions.retries) {
    return false;
  }

  if (error instanceof Error && error.name !== "LinqApiError") {
    return true;
  }

  if (typeof error === "object" && error !== null && "status" in error) {
    const status = (error as { status?: unknown }).status;
    return typeof status === "number" && retryOptions.retryOnStatuses.includes(status);
  }

  return false;
}

function backoffDelay(attempt: number, baseDelayMs: number, maxDelayMs: number): number {
  const delay = baseDelayMs * Math.pow(2, attempt - 1);
  return Math.min(delay, maxDelayMs);
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function normalizeBaseUrl(baseUrl: string): string {
  return baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
}

function applyHeaders(target: Headers, headers: HeadersInit): void {
  if (headers instanceof Headers) {
    headers.forEach((value, key) => {
      target.set(key, value);
    });
    return;
  }

  if (Array.isArray(headers)) {
    for (const [key, value] of headers) {
      target.set(key, value);
    }
    return;
  }

  for (const [key, value] of Object.entries(headers)) {
    if (value !== undefined) {
      target.set(key, value);
    }
  }
}
