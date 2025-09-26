// src/app/api/profile/update/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { noroffFetch, strip } from "../../_utils/noroff";

async function getUsernameFromCookies(): Promise<string | null> {
  const jar = await cookies();
  const rawUser = jar.get("holidaze_user")?.value;
  if (!rawUser) return null;

  try {
    const user = JSON.parse(rawUser);
    return user?.name ?? null;
  } catch {
    return null;
  }
}

export async function PATCH(req: Request) {
  try {
    const username = await getUsernameFromCookies();
    if (!username) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
    }

    const body = await req.json();

    const payload = strip({
      bio: body.bio,
      avatar: body.avatar ? { url: body.avatar.url || "", alt: body.avatar.alt || "" } : undefined,
      banner: body.banner ? { url: body.banner.url || "", alt: body.banner.alt || "" } : undefined,
      venueManager: typeof body.venueManager === "boolean" ? body.venueManager : undefined,
    });

    const { resp, data } = await noroffFetch(`/holidaze/profiles/${encodeURIComponent(username)}`, {
      method: "PUT",
      json: payload,
    });

    if (!resp.ok) {
      console.log("Noroff API error:", data);
      return NextResponse.json(
        { message: data.message || "Update failed", errors: data.errors ?? [] },
        { status: resp.status }
      );
    }

    return NextResponse.json(data);
  } catch (err: unknown) {
    return NextResponse.json(
      { message: err instanceof Error ? err.message : "Unexpected error" },
      { status: 500 }
    );
  }
}

export const POST = PATCH;