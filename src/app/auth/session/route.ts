// src/app/auth/session/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { COOKIE_TOKEN, COOKIE_USER } from "@/app/lib/config";

export async function GET() {
  const jar = await cookies();
  const token = jar.get(COOKIE_TOKEN)?.value ?? null;
  const raw = jar.get(COOKIE_USER)?.value ?? null;

  let user: unknown = null;
  if (raw) {
    try {
      user = JSON.parse(raw);
    } catch {
      /* ignore */
    }
  }

  return NextResponse.json({ authenticated: !!token, user });
}
