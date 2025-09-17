// src/app/lib/pin.ts
import type { Venue } from "./types";

const PIN_EMAILS = ["SunsetRetreat@stud.noroff.no", "NordicGems@stud.noroff.no"];
const PIN_NAMES = ["SunsetRetreat", "Nordicgems"];

export function isPinnedOwner(v: Venue) {
  const email = v.owner?.email?.toLowerCase();
  const name = v.owner?.name?.toLowerCase();

  return (
    (email && PIN_EMAILS.some((p) => p.toLowerCase() === email)) ||
    (name && PIN_NAMES.some((p) => p.toLowerCase() === name))
  );
}

export function pinByOwner(venues: Venue[]) {
  const pinned: Venue[] = [];
  const others: Venue[] = [];

  for (const v of venues) {
    (isPinnedOwner(v) ? pinned : others).push(v);
  }

  return { pinned, others, all: [...pinned, ...others] };
}
