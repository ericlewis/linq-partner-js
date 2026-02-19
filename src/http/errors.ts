import type { components } from "../generated/openapi-types";

type ErrorResponse = components["schemas"]["ErrorResponse"];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export class LinqApiError extends Error {
  public readonly status: number;
  public readonly code: number | undefined;
  public readonly traceId: string | undefined;
  public readonly rawBody: unknown;

  public constructor(args: {
    message: string;
    status: number;
    code: number | undefined;
    traceId: string | undefined;
    rawBody: unknown;
  }) {
    super(args.message);
    this.name = "LinqApiError";
    this.status = args.status;
    this.code = args.code;
    this.traceId = args.traceId;
    this.rawBody = args.rawBody;
  }
}

function getErrorMessage(status: number, parsedBody: unknown): string {
  if (isRecord(parsedBody)) {
    const error = parsedBody["error"];
    if (isRecord(error) && typeof error["message"] === "string") {
      return error["message"];
    }

    if (typeof parsedBody["message"] === "string") {
      return parsedBody["message"];
    }
  }

  return `Linq API request failed with status ${status}`;
}

function getErrorCode(parsedBody: unknown): number | undefined {
  if (!isRecord(parsedBody)) {
    return undefined;
  }

  const error = parsedBody["error"];
  if (!isRecord(error)) {
    return undefined;
  }

  return typeof error["code"] === "number" ? error["code"] : undefined;
}

function getTraceId(parsedBody: unknown): string | undefined {
  if (!isRecord(parsedBody)) {
    return undefined;
  }

  return typeof parsedBody["trace_id"] === "string" ? parsedBody["trace_id"] : undefined;
}

export function parseErrorBody(rawBody: string): unknown {
  if (!rawBody) {
    return undefined;
  }

  try {
    return JSON.parse(rawBody) as ErrorResponse;
  } catch {
    return rawBody;
  }
}

export function toLinqApiError(response: Response, rawBody: string): LinqApiError {
  const parsedBody = parseErrorBody(rawBody);

  return new LinqApiError({
    message: getErrorMessage(response.status, parsedBody),
    status: response.status,
    code: getErrorCode(parsedBody),
    traceId: getTraceId(parsedBody),
    rawBody: parsedBody
  });
}
