// src/app/api/auth/login/route.ts
import { NextResponse } from "next/server";
import { z, ZodError } from "zod";
import { API_BASE, API_KEY, COOKIE_TOKEN, COOKIE_USER } from "@/app/lib/config";

const isProd = process.env.NODE_ENV === "production";

const LoginSchema = z.object({
  email: z
    .string()
    .email("Invalid email")
    .regex(/@stud\.noroff\.no$/i, "Use your stud.noroff.no email"),
  password: z.string().min(1, "Password is required"),
});

async function readJsonSafe(res: Response) {
  try {
    return res.headers.get("content-type")?.includes("application/json") ? await res.json() : null;
  } catch {
    return null;
  }
}

/**
 *
 * @param req -Incoming request containing JSON body with email and password
 * @returns - JSON response with success status or error message
 */

export async function POST(req: Request) {
  try {
    const { email, password } = LoginSchema.parse(await req.json());

    const upstream = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(API_KEY ? { "X-Noroff-API-Key": API_KEY } : {}),
      },
      body: JSON.stringify({ email, password }),
      cache: "no-store",
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const payload = (await readJsonSafe(upstream)) as any;

    if (!upstream.ok)
      return NextResponse.json(
        { error: payload?.errors?.[0]?.message ?? payload?.message ?? "Login failed" },
        { status: upstream.status }
      );

    const { accessToken, name, email: userEmail, avatar, venueManager } = payload?.data ?? {};
    if (!accessToken)
      return NextResponse.json({ error: "Login succeeded but no token returned" }, { status: 502 });

    const user = { name, email: userEmail, avatar, venueManager: !!venueManager };

    const res = NextResponse.json({ data: { ok: true } });
    const cookieOptions = {
      secure: isProd,
      sameSite: "lax" as const,
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    };

    res.cookies.set(COOKIE_TOKEN, accessToken, { ...cookieOptions, httpOnly: true });
    res.cookies.set(COOKIE_USER, JSON.stringify(user), { ...cookieOptions, httpOnly: false });

    return res;
  } catch (err) {
    if (err instanceof ZodError)
      return NextResponse.json(
        { error: err.issues[0]?.message ?? "Invalid input" },
        { status: 400 }
      );
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unexpected error" },
      { status: 400 }
    );
  }
}
