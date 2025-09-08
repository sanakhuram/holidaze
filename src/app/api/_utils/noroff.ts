// src/app/api/_utils/noroff.ts
import { cookies } from "next/headers";

const BASE = process.env.NOROFF_API_URL ?? "https://v2.api.noroff.dev";
const API_KEY = process.env.NOROFF_API_KEY;

export async function getAuthHeaders() {
  const jar = await cookies();
  const token = jar.get("noroff_token")?.value;
  if (!token) throw new Error("Not authenticated");

  return {
    ...(API_KEY ? { "X-Noroff-API-Key": API_KEY } : {}),
    Authorization: `Bearer ${token}`,
    Accept: "application/json",
  };
}

export type NoroffResponse = {
  message?: string;
  errors?: Array<{ path?: string; message?: string }>;
  [key: string]: unknown;
};

export async function noroffFetch(
  path: string,
  options: RequestInit & { json?: unknown } = {}
): Promise<{ resp: Response; data: NoroffResponse }> {
  const headers = await getAuthHeaders();
  const init: RequestInit = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...headers,
      ...(options.headers ?? {}),
    },
    cache: "no-store",
    body: options.json ? JSON.stringify(options.json) : options.body,
  };

  const resp = await fetch(`${BASE}${path}`, init);
  let data: NoroffResponse = {};
  try {
    if (resp.status !== 204) data = await resp.json();
  } catch {
    /* ignore */
  }
  return { resp, data };
}

export const strip = <T extends object>(o: T) =>
  Object.fromEntries(Object.entries(o).filter(([, v]) => v != null)) as Partial<T>;
