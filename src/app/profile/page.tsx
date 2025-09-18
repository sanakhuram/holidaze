/* eslint-disable @next/next/no-img-element */
import { cookies } from "next/headers";
import { getProfileByName, getVenueById } from "../lib/api";
import type { Profile, VenueWithExtras } from "../lib/types";
import BookingsList from "../components/profile/BookingList";
import VenuesList from "../components/profile/VenueList";
import EditProfileButton from "../components/profile/EditProfileButton";
import CreateVenueButton from "../components/profile/CreateVenueButton";
import VenueManagerToggle from "../components/profile/VenueManagerToggle";
import VenueBookingsCard from "../components/profile/VenueBookingsCard";
import CollapsibleSection from "../components/ui/CollapsibleSection";
import HostingGuide from "../components/profile/HostingGuide";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const jar = await cookies();
  const token = jar.get("noroff_token")?.value;
  const rawUser = jar.get("holidaze_user")?.value ?? null;

  let username: string | undefined;
  try {
    username = rawUser ? JSON.parse(rawUser).name : undefined;
  } catch {
    username = undefined;
  }

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

  const bannerUrl = profile.banner?.url ?? "/default-banner.jpg";
  const avatarUrl = profile.avatar?.url ?? "/default-avatar.jpg";

  let venuesWithBookings: VenueWithExtras[] = [];
  if (profile.venueManager && profile.venues?.length) {
    venuesWithBookings = await Promise.all(
      profile.venues.map((v) => getVenueById(v.id).then((res) => res.data))
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 pt-2 pb-10">
      <div className="relative h-52 w-full overflow-hidden rounded-sm shadow-lg">
        <img
          src={bannerUrl}
          alt={profile.banner?.alt ?? `${profile.name} banner`}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="relative -mt-12 flex flex-col items-start gap-3">
        <div className="flex items-end gap-3">
          <div className="ring-wine h-24 w-24 overflow-hidden rounded-2xl shadow-lg ring-4">
            <img
              src={avatarUrl}
              alt={profile.avatar?.alt ?? `${profile.name} avatar`}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="pb-1">
            <VenueManagerToggle initial={!!profile.venueManager} />
          </div>
        </div>

        <h1 className="text-coffee flex items-center gap-2 text-2xl font-bold">
          {profile.name}
          {profile.venueManager && (
            <span className="bg-wine rounded-lg px-2 py-0.5 text-xs font-medium text-white shadow">
              Venue Manager
            </span>
          )}
        </h1>
        {profile.email && <p className="text-sm text-amber-800">{profile.email}</p>}

        <div className="mt-2 flex flex-wrap gap-3">
          {profile.venueManager && <CreateVenueButton />}
          <EditProfileButton profile={profile} />
        </div>
      </div>

      <section className="border-wine mt-6 border-b-2 p-5">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
          <div>
            <div className="text-xs text-slate-500">Email:</div>
            <div className="truncate text-sm font-medium break-words">{profile.email ?? "—"}</div>
          </div>
          <div>
            <div className="text-xs text-slate-500">Bio:</div>
            <div className="text-sm font-medium break-words whitespace-pre-wrap">
              {profile.bio || "—"}
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-500">Bookings:</div>
            <div className="text-sm font-semibold">{profile._count?.bookings ?? 0}</div>
          </div>
          <div>
            <div className="text-xs text-slate-500">Venues:</div>
            <div className="text-sm font-semibold">{profile._count?.venues ?? 0}</div>
          </div>
        </div>
      </section>

      <section className="mt-8 space-y-6">
        <HostingGuide />

        <CollapsibleSection title="My Venues" defaultOpen>
          <VenuesList venues={profile.venues ?? []} />
        </CollapsibleSection>
        <CollapsibleSection title="My Bookings">
          <BookingsList bookings={profile.bookings ?? []} />
        </CollapsibleSection>
        {profile.venueManager && (
          <CollapsibleSection title="Upcoming Bookings">
            {venuesWithBookings.length ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {venuesWithBookings.map((venue) => (
                  <VenueBookingsCard key={venue.id} venue={venue} />
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-600">You don’t manage any venues yet.</p>
            )}
          </CollapsibleSection>
        )}
      </section>
    </main>
  );
}
