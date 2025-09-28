// src/app/lib/api.ts
import { API_BASE, API_KEY } from "@/app/lib/config";
import type { Paged, Venue, VenueWithExtras, Profile } from "../lib/types";

if (!API_BASE) {
  throw new Error("Missing NEXT_PUBLIC_API_BASE");
}

type UpstreamError = { message?: string; errors?: Array<{ message?: string }> };

function extractErrorMessage(data: unknown): string | null {
  if (data && typeof data === "object") {
    const d = data as UpstreamError;
    return d.errors?.[0]?.message ?? d.message ?? null;
  }
  return null;
}

async function readJsonSafe(res: Response): Promise<unknown> {
  const ct = res.headers.get("content-type") ?? "";
  if (!ct.includes("application/json")) return null;
  try {
    return await res.json();
  } catch {
    return null;
  }
}

function buildHeaders(init?: HeadersInit): Headers {
  const headers = new Headers(init);
  if (!headers.has("Accept")) headers.set("Accept", "application/json");
  if (API_KEY && !headers.has("X-Noroff-API-Key")) {
    headers.set("X-Noroff-API-Key", API_KEY);
  }
  return headers;
}

/**
 * Fetch data from the API.
 *
 * @param path - Relative API path.
 * @param init - Optional fetch initialization options.
 * @returns Parsed JSON response of type T.
 * @throws Error if the response is not OK, with message including HTTP status and upstream error.
 */

export async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = buildHeaders(init.headers);

  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers,
    cache: "no-store",
  });

  if (!res.ok) {
    const payload = await readJsonSafe(res);
    const detail = extractErrorMessage(payload) ?? (await res.text().catch(() => ""));
    const suffix = detail ? ` — ${detail}` : "";
    throw new Error(`${res.status} ${res.statusText}${suffix}`);
  }

  return (await res.json()) as T;
}

function qs(params: Record<string, string | number | boolean | null | undefined>) {
  const s = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && String(v).length > 0) s.set(k, String(v));
  }
  return s.toString();
}

const DEFAULT_SORT = { sort: "created", sortOrder: "desc" } as const;

export function getVenues(page = 1, limit = 24, search?: string) {
  const hasQ = !!search?.trim();
  const path = hasQ ? "/holidaze/venues/search" : "/holidaze/venues";
  const query = qs({
    q: hasQ ? search : undefined,
    page,
    limit,
    ...DEFAULT_SORT,
    _owner: true,
  });
  return api<Paged<Venue>>(`${path}?${query}`);
}

export const searchVenues = (q: string, page = 1, limit = 24) => getVenues(page, limit, q);
export const getVenueById = (id: string) =>
  api<{ data: VenueWithExtras }>(
    `/holidaze/venues/${encodeURIComponent(id)}?_owner=true&_bookings=true`
  );

/**
 * Fetch a profile by name.
 *
 * @param name - Profile name to fetch.
 * @param token - Bearer token for authentication.
 * @returns Profile data including venues and bookings.
 */

export async function getProfileByName(name: string, token: string) {
  return api<{ data: Profile }>(
    `/holidaze/profiles/${encodeURIComponent(name)}?_venues=true&_bookings=true&_venueBookings=true`,
    { headers: { Authorization: `Bearer ${token}` } }
  ).then((r) => r.data);
}
