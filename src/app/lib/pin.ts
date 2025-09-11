// src/app/lib/pin.ts
import type { Venue } from "./types";

const PIN_EMAIL = "SunsetRetreat@stud.noroff.no";
const PIN_NAME = "SunsetRetreat";

export function isPinnedOwner(v: Venue) {
  const email = v.owner?.email?.toLowerCase();
  const name = v.owner?.name?.toLowerCase();
  return email === PIN_EMAIL.toLowerCase() || name === PIN_NAME.toLowerCase();
}

export function pinByOwner(venues: Venue[]) {
  const pinned: Venue[] = [];
  const others: Venue[] = [];
  for (const v of venues) (isPinnedOwner(v) ? pinned : others).push(v);
  return { pinned, others, all: [...pinned, ...others] };
}
