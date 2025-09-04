// src/app/api/bookings/[id]/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";

const BASE = process.env.NOROFF_API_URL ?? "https://v2.api.noroff.dev";
const API_KEY = process.env.NOROFF_API_KEY;

const strip = <T extends object>(o: T) =>
  Object.fromEntries(Object.entries(o).filter(([, v]) => v != null)) as Partial<T>;

const DateStr = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD");
const UpdateSchema = z
  .object({
    dateFrom: DateStr.optional(),
    dateTo: DateStr.optional(),
    guests: z.coerce.number().int().min(1).optional(),
  })
  .refine((v) => v.dateFrom || v.dateTo || v.guests !== undefined, {
    message: "Provide at least one of dateFrom, dateTo, guests",
  });

type RouteCtx = { params: Promise<{ id: string }> };

export async function DELETE(_req: Request, ctx: RouteCtx) {
  const { id } = await ctx.params; 
  const jar = await cookies(); 
  const token = jar.get("noroff_token")?.value;
  if (!token) return NextResponse.json({ message: "Not authenticated" }, { status: 401 });

  const resp = await fetch(`${BASE}/holidaze/bookings/${encodeURIComponent(id)}`, {
    method: "DELETE",
    headers: {
      ...(API_KEY ? { "X-Noroff-API-Key": API_KEY } : {}),
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
    cache: "no-store",
  });

  if (resp.status === 204) return new NextResponse(null, { status: 204 });

  const data = await resp.json().catch(() => ({}));
  return NextResponse.json(
    { message: data?.message || "Cancel failed", errors: data?.errors ?? [] },
    { status: resp.status }
  );
}

export async function PUT(req: Request, ctx: RouteCtx) {
  const { id } = await ctx.params; 
  const jar = await cookies(); 
  const token = jar.get("noroff_token")?.value;
  if (!token) return NextResponse.json({ message: "Not authenticated" }, { status: 401 });

  const raw = (await req.json().catch(() => ({}))) as unknown;
  const parsed = UpdateSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      {
        message: "Invalid input",
        errors: parsed.error.issues.map((i) => ({ path: i.path.join("."), message: i.message })),
      },
      { status: 400 }
    );
  }

  const payload = strip(parsed.data);

  const resp = await fetch(`${BASE}/holidaze/bookings/${encodeURIComponent(id)}`, {
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

  const data = await resp.json().catch(() => ({}));
  return NextResponse.json(data, { status: resp.status });
}
