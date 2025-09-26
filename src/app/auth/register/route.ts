// src/app/api/auth/register/route.ts
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

async function readJsonSafe(res: Response) {
  try {
    return res.headers.get("content-type")?.includes("application/json") ? await res.json() : null;
  } catch {
    return null;
  }
}
function errorResponse(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

/**
 *
 * @param req -Incoming request containing JSON body of type `RegisterSchema`
 * @returns - JSON response with success status or error message
 */

export async function POST(req: Request) {
  try {
    const parsed = RegisterSchema.parse(await req.json());

    const upstream = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(API_KEY ? { "X-Noroff-API-Key": API_KEY } : {}),
      },
      body: JSON.stringify(parsed),
      cache: "no-store",
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const payload = (await readJsonSafe(upstream)) as any;

    if (!upstream.ok) {
      const msg = payload?.errors?.[0]?.message ?? payload?.message ?? "Registration failed";
      return errorResponse(msg, upstream.status);
    }

    return NextResponse.json({ data: { ok: true } }, { status: 201 });
  } catch (err) {
    if (err instanceof ZodError)
      return errorResponse(err.issues[0]?.message ?? "Invalid input", 400);
    return errorResponse(err instanceof Error ? err.message : "Unexpected error", 400);
  }
}
