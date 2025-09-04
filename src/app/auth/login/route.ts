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

type Upstream = {
  data?: {
    accessToken?: string;
    name?: string | null;
    email?: string | null;
    avatar?: { url?: string; alt?: string } | null;
    venueManager?: boolean;
  };
  errors?: Array<{ message?: string }>;
  message?: string;
};

function extractApiError(data: unknown): string | null {
  if (data && typeof data === "object") {
    const d = data as Upstream;
    return d.errors?.[0]?.message ?? d.message ?? null;
  }
  return null;
}

async function readJsonSafe(res: Response): Promise<unknown> {
  const ct = res.headers.get("content-type") ?? "";
  if (!ct.includes("application/json")) return null;
  try {
    return await res.json();
  } catch {
    return null;
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = LoginSchema.parse(body);

    const upstream = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(API_KEY ? { "X-Noroff-API-Key": API_KEY } : {}),
      },
      body: JSON.stringify({ email, password }),
      cache: "no-store",
    });

    const payload = (await readJsonSafe(upstream)) as Upstream | null;

    if (!upstream.ok) {
      return NextResponse.json(
        { error: extractApiError(payload) ?? "Login failed" },
        { status: upstream.status, headers: { Vary: "Cookie" } }
      );
    }

    const token = payload?.data?.accessToken;
    if (!token) {
      return NextResponse.json(
        { error: "Login succeeded but no token was returned" },
        { status: 502, headers: { Vary: "Cookie" } }
      );
    }

    const p = payload?.data ?? {};
    const user = {
      name: p.name ?? null,
      email: p.email ?? null,
      avatar: p.avatar ?? null,
      venueManager: !!p.venueManager,
    };

    const res = NextResponse.json(
      { data: { ok: true } },
      { status: 200, headers: { Vary: "Cookie" } }
    );

    res.cookies.set(COOKIE_TOKEN, token, {
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    res.cookies.set(COOKIE_USER, JSON.stringify(user), {
      httpOnly: false,
      secure: isProd,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return res;
  } catch (err: unknown) {
    if (err instanceof ZodError) {
      const first = err.issues[0]?.message ?? "Invalid input";
      return NextResponse.json({ error: first }, { status: 400, headers: { Vary: "Cookie" } });
    }
    if (err instanceof Error) {
      return NextResponse.json(
        { error: err.message },
        { status: 400, headers: { Vary: "Cookie" } }
      );
    }
    return NextResponse.json(
      { error: "Unexpected error" },
      { status: 400, headers: { Vary: "Cookie" } }
    );
  }
}
