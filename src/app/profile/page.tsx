/* eslint-disable @next/next/no-img-element */
// src/app/profile/page.tsx
import { cookies } from "next/headers";
import { getProfileByName } from "../lib/api";
import type { Profile } from "../lib/types";

export const dynamic = "force-dynamic";

function Img({
    src,
    alt,
    className,
}: {
    src?: string | null;
    alt?: string;
    className?: string;
}) {
    return <img src={src ?? ""} alt={alt ?? ""} className={className} />;
}

export default async function ProfilePage() {
    const jar = await cookies();
    const token = jar.get("noroff_token")?.value;
    const rawUser = jar.get("holidaze_user")?.value ?? null;

    const username = rawUser
        ? (() => {
            try {
                return (JSON.parse(rawUser) as { name?: string })?.name;
            } catch {
                return undefined;
            }
        })()
        : undefined;

    if (!token || !username) {
        return (
            <main className="mx-auto max-w-6xl px-4 py-10">
                <h1 className="mb-4 text-2xl font-bold">My Profile</h1>
                <p className="text-slate-600">
                    You’re not logged in (or we can’t find your username). Please sign in again.
                </p>
            </main>
        );
    }

    let profile: Profile;
    try {
        profile = await getProfileByName(username, token);
    } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : "unknown error";
        return (
            <main className="mx-auto max-w-6xl px-4 py-10">
                <h1 className="mb-4 text-2xl font-bold">My Profile</h1>
                <p className="text-red-600">Failed to load profile: {msg}</p>
            </main>
        );
    }

    const bannerUrl = profile.banner?.url ?? undefined;
    const avatarUrl = profile.avatar?.url ?? undefined;

    return (
        <main className="mx-auto max-w-6xl px-4 pb-10 pt-2">

            <div className="relative h-52 w-full overflow-hidden rounded-sm shadow-lg">
                <Img
                    src={bannerUrl}
                    alt={profile.banner?.alt ?? `${profile.name} banner`}
                    className="h-full w-full object-cover"
                />
            </div>

            <div className="relative -mt-12 flex flex-col items-start gap-3">

                <div className="h-24 w-24 overflow-hidden rounded-2xl ring-4 ring-wine shadow-lg">
                    <Img
                        src={avatarUrl}
                        alt={profile.avatar?.alt ?? `${profile.name} avatar`}
                        className="h-full w-full object-cover"
                    />
                </div>

                <h1 className="flex items-center gap-2 text-2xl font-bold text-coffee">
                    {profile.name}
                    {profile.venueManager && (
                        <span className="rounded-lg bg-wine px-2 py-0.5 text-xs font-medium text-white shadow">
                            Venue Manager
                        </span>
                    )}
                </h1>

                {profile.email && (
                    <p className="text-sm text-amber-800">{profile.email}</p>
                )}

                <div className="mt-2 flex flex-wrap gap-3">
                    {profile.venueManager && (
                        <button
                            type="button"
                            className="rounded-md bg-amber-600 px-4 py-2 text-sm font-medium text-white shadow hover:opacity-90"
                            aria-disabled="true"
                        >
                            + Create venue
                        </button>
                    )}
                    <button
                        type="button"
                        className="rounded-md bg-wine px-4 py-2 text-sm font-medium text-white shadow hover:opacity-90"
                        aria-disabled="true"
                    >
                        Edit Profile
                    </button>
                </div>
            </div>
            <section className="mt-6 border-b-2 border-wine p-5">
                <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
                    <div className="min-w-0">
                        <div className="text-xs text-slate-500">Email:</div>
                        <div className="text-sm font-medium break-words truncate">
                            {profile.email ?? "—"}
                        </div>
                    </div>

                    <div className="min-w-0">
                        <div className="text-xs text-slate-500">Bio:</div>
                        <div className="text-sm font-medium whitespace-pre-wrap break-words">
                            {profile.bio || "—"}
                        </div>
                    </div>

                    <div className="min-w-0">
                        <div className="text-xs text-slate-500">Bookings:</div>
                        <div className="text-sm font-semibold">
                            {profile._count?.bookings ?? 0}
                        </div>
                    </div>

                    <div className="min-w-0">
                        <div className="text-xs text-slate-500">Venues:</div>
                        <div className="text-sm font-semibold">
                            {profile._count?.venues ?? 0}
                        </div>
                    </div>
                </div>
            </section>


        </main>
    );
}
