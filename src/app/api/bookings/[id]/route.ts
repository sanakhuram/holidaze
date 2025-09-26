// src/app/api/bookings/[id]/route.ts
import { NextResponse } from "next/server";
import { z } from "zod";
import { noroffFetch } from "../../_utils/noroff";

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
  const { resp, data } = await noroffFetch(`/holidaze/bookings/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
  return resp.status === 204
    ? new NextResponse(null, { status: 204 })
    : NextResponse.json(data, { status: resp.status });
}

export async function PUT(req: Request, ctx: RouteCtx) {
  const { id } = await ctx.params;
  const raw = await req.json();
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

  const { resp, data } = await noroffFetch(`/holidaze/bookings/${encodeURIComponent(id)}`, {
    method: "PUT",
    json: parsed.data,
  });

  return NextResponse.json(data, { status: resp.status });
}
