import { NextResponse } from "next/server";
import { z } from "zod";
import { noroffFetch, strip } from "../../_utils/noroff";

const s = z.string().trim().optional().nullable();
const n = z.coerce.number().optional().nullable();
const b = z.boolean().optional();

const Media = z.object({ url: s, alt: s });
const UpdateSchema = z.object({
  name: s,
  description: s,
  price: n,
  maxGuests: n,
  rating: n,
  media: z.array(Media).optional(),
  meta: z.object({ wifi: b, parking: b, breakfast: b, pets: b }).optional(),
  location: z
    .object({
      address: s,
      city: s,
      zip: s,
      country: s,
      continent: s,
      lat: n,
      lng: n,
    })
    .optional(),
});

type RouteCtx = { params: Promise<{ id: string }> };

export async function PUT(req: Request, ctx: RouteCtx) {
  const { id } = await ctx.params;
  const json = (await req.json().catch(() => ({}))) as unknown;

  const parsed = UpdateSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      {
        message: "Invalid input",
        errors: parsed.error.issues.map((i) => ({ path: i.path.join("."), message: i.message })),
      },
      { status: 400 }
    );
  }

  const v = parsed.data;
  const payload: Record<string, unknown> = strip({
    name: v.name ?? undefined,
    description: v.description ?? undefined,
    price: v.price ?? undefined,
    maxGuests: v.maxGuests ?? undefined,
    rating: v.rating ?? undefined,
    meta: v.meta ? strip(v.meta) : undefined,
    location: v.location ? strip(v.location) : undefined,
    media: v.media
      ? v.media
          .filter((m) => (m.url ?? "").length > 0)
          .map((m) => strip({ url: m.url ?? undefined, alt: m.alt ?? undefined }))
      : undefined,
  });

  const { resp, data } = await noroffFetch(`/holidaze/venues/${encodeURIComponent(id)}`, {
    method: "PUT",
    json: payload,
  });

  return NextResponse.json(data, { status: resp.status });
}

export async function DELETE(_req: Request, ctx: RouteCtx) {
  const { id } = await ctx.params;
  const { resp, data } = await noroffFetch(`/holidaze/venues/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });

  if (resp.status === 204) return new NextResponse(null, { status: 204 });
  return NextResponse.json(data, { status: resp.status });
}
