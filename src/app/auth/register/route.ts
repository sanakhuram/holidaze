import { NextResponse } from "next/server";
import { z, ZodError } from "zod";
import { API_BASE, API_KEY } from "@/app/lib/config";

const RegisterSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z
    .string()
    .email("Invalid email")
    .regex(/@stud\.noroff\.no$/i, "Use your stud.noroff.no email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  avatar: z.object({ url: z.string().url().optional(), alt: z.string().optional() }).optional(),
  venueManager: z.boolean().optional(),
});

type Upstream = { errors?: Array<{ message?: string }>; message?: string };

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
    const parsed = RegisterSchema.parse(body);

    const upstream = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(API_KEY ? { "X-Noroff-API-Key": API_KEY } : {}),
      },
      body: JSON.stringify(parsed),
      cache: "no-store",
    });

    const payload = await readJsonSafe(upstream);

    if (!upstream.ok) {
      return NextResponse.json(
        { error: extractApiError(payload) ?? "Registration failed" },
        { status: upstream.status }
      );
    }

    return NextResponse.json({ data: { ok: true } }, { status: 201 });
  } catch (err: unknown) {
    if (err instanceof ZodError) {
      const first = err.issues[0]?.message ?? "Invalid input";
      return NextResponse.json({ error: first }, { status: 400 });
    }
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Unexpected error" }, { status: 400 });
  }
}
