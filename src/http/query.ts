export type QueryPrimitive = string | number | boolean;
export type QueryValue = QueryPrimitive | null | undefined | QueryPrimitive[];

export type QueryRecord = Record<string, QueryValue>;

export function buildQueryString(query?: QueryRecord): string {
  if (!query) {
    return "";
  }

  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === null) {
      continue;
    }

    if (Array.isArray(value)) {
      for (const item of value) {
        params.append(key, String(item));
      }
      continue;
    }

    params.set(key, String(value));
  }

  return params.toString();
}
