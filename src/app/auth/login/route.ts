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

function errorResponse(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status, headers: { Vary: "Cookie" } });
}

async function readJsonSafe(res: Response) {
  if (!res.headers.get("content-type")?.includes("application/json")) return null;
  try {
    return await res.json();
  } catch {
    return null;
  }
}

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

    const payload = (await readJsonSafe(upstream)) as Upstream | null;

    if (!upstream.ok)
      return errorResponse(
        payload?.errors?.[0]?.message ?? payload?.message ?? "Login failed",
        upstream.status
      );

    const { accessToken, name, email: userEmail, avatar, venueManager } = payload?.data ?? {};
    if (!accessToken) return errorResponse("Login succeeded but no token was returned", 502);

    const user = { name, email: userEmail, avatar, venueManager: !!venueManager };

    const res = NextResponse.json({ data: { ok: true } }, { headers: { Vary: "Cookie" } });

    const baseCookie = {
      secure: isProd,
      sameSite: "lax" as const,
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    };

    res.cookies.set(COOKIE_TOKEN, accessToken, { ...baseCookie, httpOnly: true });
    res.cookies.set(COOKIE_USER, JSON.stringify(user), { ...baseCookie, httpOnly: false });

    return res;
  } catch (err) {
    if (err instanceof ZodError)
      return errorResponse(err.issues[0]?.message ?? "Invalid input", 400);
    if (err instanceof Error) return errorResponse(err.message, 400);
    return errorResponse("Unexpected error", 400);
  }
}
