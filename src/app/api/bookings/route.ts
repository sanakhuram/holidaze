// src/app/api/bookings/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const BASE = process.env.NOROFF_API_URL ?? "https://v2.api.noroff.dev";
const API_KEY = process.env.NOROFF_API_KEY;

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
