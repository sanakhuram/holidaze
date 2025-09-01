// src/app/lib/api.ts
import type { Paged, Venue, VenueWithExtras, Profile } from "./types";

const BASE = process.env.NEXT_PUBLIC_API_BASE;
const API_KEY = process.env.NOROFF_API_KEY;

if (!BASE) {
  throw new Error("Missing NEXT_PUBLIC_API_BASE");
}

export async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  if (API_KEY) headers.set("X-Noroff-API-Key", API_KEY);
  headers.set("Accept", "application/json");

  const res = await fetch(`${BASE}${path}`, { ...init, headers, cache: "no-store" });

  if (!res.ok) {
    const ct = res.headers.get("content-type") ?? "";
    let detail = "";
    try {
      if (ct.includes("application/json")) {
        const j = await res.json();
        detail = j?.errors?.[0]?.message ?? j?.message ?? "";
      } else {
        detail = await res.text();
      }
    } catch {}
    throw new Error(`${res.status} ${res.statusText}${detail ? ` — ${detail}` : ""}`);
  }

  return res.json() as Promise<T>;
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

export async function getProfileByName(name: string, token: string) {
  return api<{ data: Profile }>(
    `/holidaze/profiles/${encodeURIComponent(name)}?_venues=true&_bookings=true`,
    { headers: { Authorization: `Bearer ${token}` } }
  ).then((r) => r.data);
}
