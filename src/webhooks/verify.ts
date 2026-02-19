const ENCODER = new TextEncoder();

export const DEFAULT_WEBHOOK_TOLERANCE_SECONDS = 300;

export interface VerifyWebhookSignatureInput {
  signingSecret: string;
  payload: string | Uint8Array;
  timestamp: string | number;
  signature: string;
  toleranceSeconds?: number;
  now?: number | Date;
}

export async function verifyWebhookSignature(input: VerifyWebhookSignatureInput): Promise<boolean> {
  if (!input.signingSecret) {
    throw new Error("`signingSecret` is required");
  }
  if (!input.signature) {
    throw new Error("`signature` is required");
  }

  const timestamp = normalizeTimestamp(input.timestamp);
  if (timestamp === null) {
    return false;
  }

  const nowSeconds = normalizeNow(input.now);
  const toleranceSeconds = input.toleranceSeconds ?? DEFAULT_WEBHOOK_TOLERANCE_SECONDS;

  if (Math.abs(nowSeconds - timestamp) > toleranceSeconds) {
    return false;
  }

  const payloadBytes = typeof input.payload === "string" ? ENCODER.encode(input.payload) : input.payload;
  const signedMessage = ENCODER.encode(`${timestamp}.${new TextDecoder().decode(payloadBytes)}`);
  const expectedSignature = await hmacSha256Hex(input.signingSecret, signedMessage);

  const expectedBytes = hexToBytes(expectedSignature);
  const receivedBytes = hexToBytes(input.signature);

  if (!expectedBytes || !receivedBytes) {
    return false;
  }

  return timingSafeEqual(expectedBytes, receivedBytes);
}

function normalizeTimestamp(timestamp: string | number): number | null {
  const value = typeof timestamp === "string" ? Number(timestamp) : timestamp;
  if (!Number.isFinite(value)) {
    return null;
  }
  return Math.floor(value);
}

function normalizeNow(now?: number | Date): number {
  if (now instanceof Date) {
    return Math.floor(now.getTime() / 1000);
  }

  if (typeof now === "number") {
    return Math.floor(now);
  }

  return Math.floor(Date.now() / 1000);
}

async function hmacSha256Hex(secret: string, data: Uint8Array): Promise<string> {
  if (globalThis.crypto?.subtle) {
    const key = await globalThis.crypto.subtle.importKey(
      "raw",
      ENCODER.encode(secret) as unknown as BufferSource,
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );

    const signature = await globalThis.crypto.subtle.sign("HMAC", key, data as unknown as BufferSource);
    return bytesToHex(new Uint8Array(signature));
  }

  const { createHmac } = await import("node:crypto");
  return createHmac("sha256", secret).update(data).digest("hex");
}

function bytesToHex(bytes: Uint8Array): string {
  let hex = "";

  for (const byte of bytes) {
    hex += byte.toString(16).padStart(2, "0");
  }

  return hex;
}

function hexToBytes(value: string): Uint8Array | null {
  if (!/^[0-9a-fA-F]+$/.test(value) || value.length % 2 !== 0) {
    return null;
  }

  const bytes = new Uint8Array(value.length / 2);

  for (let i = 0; i < value.length; i += 2) {
    const byte = Number.parseInt(value.slice(i, i + 2), 16);
    if (Number.isNaN(byte)) {
      return null;
    }
    bytes[i / 2] = byte;
  }

  return bytes;
}

function timingSafeEqual(left: Uint8Array, right: Uint8Array): boolean {
  const maxLength = Math.max(left.length, right.length);
  let mismatch = left.length ^ right.length;

  for (let index = 0; index < maxLength; index += 1) {
    const leftByte = left[index] ?? 0;
    const rightByte = right[index] ?? 0;
    mismatch |= leftByte ^ rightByte;
  }

  return mismatch === 0;
}
