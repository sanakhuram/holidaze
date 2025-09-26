// src/app/api/bookings/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const BASE = process.env.NOROFF_API_URL ?? "https://v2.api.noroff.dev";
const API_KEY = process.env.NOROFF_API_KEY;
/**
 * POST /api/bookings
 *
 * Creates a new booking in the Holidaze system.
 * Requires the user to be authenticated (token stored in cookies).
 *
 * @param req - Request object containing the booking payload as JSON
 * @returns JSON response from Noroff API with booking details or error message
 *
 */
export async function POST(req: Request) {
  const jar = await cookies();
  const token = jar.get("noroff_token")?.value;
  if (!token) return NextResponse.json({ message: "Not authenticated" }, { status: 401 });

  const body = await req.json();
  const up = await fetch(`${BASE}/holidaze/bookings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(API_KEY ? { "X-Noroff-API-Key": API_KEY } : {}),
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  const data = await up.json().catch(() => ({}));
  return NextResponse.json(data, { status: up.status });
}
