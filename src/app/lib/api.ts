// src/app/lib/api.ts
import type { Venue, VenueWithExtras  } from "./type";

const BASE = process.env.NEXT_PUBLIC_API_BASE;
const API_KEY = process.env.NOROFF_API_KEY;

if (!BASE) throw new Error("Missing NEXT_PUBLIC_API_BASE");

async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  if (API_KEY) headers.set("X-Noroff-API-Key", API_KEY);
  headers.set("Accept", "application/json");

  const res = await fetch(`${BASE}${path}`, { ...init, headers, cache: "no-store" });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json() as Promise<T>;
}

export async function getVenues(): Promise<Venue[]> {
  const res = await api<{ data: Venue[] }>("/holidaze/venues?_owner=true");
  return res.data;
}
export async function searchVenues(q: string): Promise<Venue[]> {
  const res = await api<{ data: Venue[] }>(
    `/holidaze/venues/search?q=${encodeURIComponent(q)}&_owner=true`
  );
  return res.data;
}

export async function getVenueById(id: string): Promise<VenueWithExtras> {
  const res = await api<{ data: VenueWithExtras }>(
    `/holidaze/venues/${encodeURIComponent(id)}?_owner=true&_bookings=true`
  );
  return res.data;
}
