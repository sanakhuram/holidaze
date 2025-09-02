import { NextResponse } from "next/server";
import { COOKIE_TOKEN, COOKIE_USER } from "@/app/lib/config";

export async function POST() {
  const res = NextResponse.json({ data: { ok: true } });
  res.cookies.set(COOKIE_TOKEN, "", { path: "/", maxAge: 0 });
  res.cookies.set(COOKIE_USER, "", { path: "/", maxAge: 0 });
  return res;
}
