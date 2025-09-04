// src/app/api/profile/update/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const BASE = process.env.NOROFF_API_URL ?? "https://v2.api.noroff.dev";
const API_KEY = process.env.NOROFF_API_KEY;

function b64urlDecode(str: string) {
    const pad = (s: string) => s + "===".slice((s.length + 3) % 4);
    const s = pad(str).replace(/-/g, "+").replace(/_/g, "/");
    return Buffer.from(s, "base64").toString("utf8");
}
function isObj(v: unknown): v is Record<string, unknown> {
    return !!v && typeof v === "object";
}
function isStr(v: unknown): v is string {
    return typeof v === "string";
}

async function getUsernameFromCookies() {
    const jar = await cookies();
    const rawUser = jar.get("holidaze_user")?.value ?? null;
    if (rawUser) {
        try {
            const u = JSON.parse(rawUser);
            if (u?.name) return u.name as string;
        } catch { }
    }
    const token = jar.get("noroff_token")?.value ?? null;
    if (!token) return null;
    try {
        const [, payload] = token.split(".");
        const json = JSON.parse(b64urlDecode(payload));
        return json?.name ?? null;
    } catch {
        return null;
    }
}

export async function PATCH(req: Request) {
    try {
        const jar = await cookies();
        const token = jar.get("noroff_token")?.value;
        const name = await getUsernameFromCookies();
        if (!token || !name) {
            return NextResponse.json(
                { message: "Not authenticated or missing username" },
                { status: 401 }
            );
        }

        const body: unknown = await req.json();

        const payload: Record<string, unknown> = {};
        if (isObj(body)) {
            if (isStr(body.bio)) payload.bio = body.bio;

            if (isObj(body.avatar)) {
                payload.avatar = {
                    url: isStr(body.avatar.url) ? body.avatar.url : "",
                    alt: isStr(body.avatar.alt) ? body.avatar.alt : "",
                };
            }
            if (isObj(body.banner)) {
                payload.banner = {
                    url: isStr(body.banner.url) ? body.banner.url : "",
                    alt: isStr(body.banner.alt) ? body.banner.alt : "",
                };
            }
            if (typeof body.venueManager === "boolean") {
                payload.venueManager = body.venueManager;
            }
        }

        const up = await fetch(`${BASE}/holidaze/profiles/${encodeURIComponent(name)}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                ...(API_KEY ? { "X-Noroff-API-Key": API_KEY } : {}),
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
            },
            body: JSON.stringify(payload),
            cache: "no-store",
        });

        const data = await up.json().catch(() => ({}));
        if (!up.ok) {
            return NextResponse.json(
                { message: data?.message || "Update failed", errors: data?.errors ?? [] },
                { status: up.status }
            );
        }

        return NextResponse.json(data, { status: 200 });
    } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : "Unexpected error";
        return NextResponse.json({ message: msg }, { status: 500 });
    }
}

export const POST = PATCH;
