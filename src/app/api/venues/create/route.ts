// src/app/api/venues/create/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const BASE = process.env.NOROFF_API_URL ?? "https://v2.api.noroff.dev";
const API_KEY = process.env.NOROFF_API_KEY;

type Media = { url: string; alt?: string };
type Meta = { wifi?: boolean; parking?: boolean; breakfast?: boolean; pets?: boolean };
type Location = {
  address?: string | null;
  city?: string | null;
  zip?: string | null;
  country?: string | null;
  continent?: string | null;
  lat?: number;
  lng?: number;
};

type CreateVenueBody = {
  name: string;
  description: string;
  media?: Media[];
  price: number;
  maxGuests: number;
  rating?: number;
  meta?: Meta;
  location?: Location;
};

const isStr = (v: unknown): v is string => typeof v === "string";
const isNum = (v: unknown): v is number => typeof v === "number" && !Number.isNaN(v);
const isMedia = (a: unknown): a is Media[] =>
  Array.isArray(a) && a.every((x) => x && typeof x.url === "string");

function pickMessage(data: unknown): string | undefined {
  if (typeof data === "string") return data;
  if (data && typeof data === "object") {
    const m = (data as Record<string, unknown>).message;
    if (typeof m === "string") return m;
  }
  return undefined;
}
function pickErrors(data: unknown): unknown[] {
  if (data && typeof data === "object") {
    const e = (data as Record<string, unknown>).errors;
    if (Array.isArray(e)) return e;
  }
  return [];
}

export async function POST(req: Request) {
  try {
    const jar = await cookies();
    const token = jar.get("noroff_token")?.value;
    if (!token) return NextResponse.json({ message: "Not authenticated" }, { status: 401 });

    let raw: unknown;
    try {
      raw = await req.json();
    } catch {
      return NextResponse.json({ message: "Body must be valid JSON" }, { status: 400 });
    }
    const body = raw as Partial<CreateVenueBody>;

    const errors: string[] = [];
    if (!isStr(body.name) || !body.name.trim()) errors.push("name is required");
    if (!isStr(body.description) || !body.description.trim())
      errors.push("description is required");
    if (!isNum(body.price) || body.price < 0) errors.push("price must be a positive number");
    if (!isNum(body.maxGuests) || body.maxGuests < 1) errors.push("maxGuests must be >= 1");
    if (body.media && !isMedia(body.media)) errors.push("media must be an array of { url, alt? }");
    if (errors.length)
      return NextResponse.json({ message: "Invalid input", errors }, { status: 400 });

    const payload = {
      name: body.name!,
      description: body.description!,
      media: body.media ?? [],
      price: Number(body.price),
      maxGuests: Number(body.maxGuests),
      rating: isNum(body.rating) ? Number(body.rating) : 0,
      meta: body.meta ?? {},
      location: {
        address: isStr(body.location?.address) ? body.location!.address : null,
        city: isStr(body.location?.city) ? body.location!.city : null,
        zip: isStr(body.location?.zip) ? body.location!.zip : null,
        country: isStr(body.location?.country) ? body.location!.country : null,
        continent: isStr(body.location?.continent) ? body.location!.continent : null,
        lat: isNum(body.location?.lat) ? body.location!.lat! : 0,
        lng: isNum(body.location?.lng) ? body.location!.lng! : 0,
      },
    };

    const up = await fetch(`${BASE}/holidaze/venues`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(API_KEY ? { "X-Noroff-API-Key": API_KEY } : {}),
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    const text = await up.text();
    let data: unknown;
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }

    if (!up.ok) {
      const msg = pickMessage(data) ?? "Create failed";
      return NextResponse.json({ message: msg, errors: pickErrors(data) }, { status: up.status });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unexpected server error";
    return NextResponse.json({ message: msg }, { status: 500 });
  }
}
