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
import BackToVenues from "../components/ui/BackToVenues";

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
      <section className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="mb-4 text-2xl font-bold">My Profile</h1>
        <p className="text-coffee">
          You’re not logged in (or we can’t find your username). Please sign in again.
        </p>
      </section>
    );
  }

  let profile: Profile;
  try {
    profile = await getProfileByName(username, token);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "unknown error";
    return (
      <section className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="mb-4 text-2xl font-bold">My Profile</h1>
        <p className="text-red-600">Failed to load profile: {msg}</p>
      </section>
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

  const upcomingBookings = (profile.bookings ?? []).filter(
    (b) => new Date(b.dateFrom).getTime() >= Date.now()
  ).length;

  return (
    <main className="mx-auto max-w-6xl px-4 pt-2 pb-10">
      <BackToVenues className="m-4 inline-block" />
      <div className="relative h-56 w-full overflow-hidden rounded-sm shadow-lg sm:h-64 md:h-72 lg:h-80">
        <img
          src={bannerUrl}
          alt={profile.banner?.alt ?? `${profile.name} banner`}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="relative -mt-10 flex flex-col gap-3">
        <div className="mb-4 flex w-full items-end justify-between gap-3">
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

          <div className="flex flex-wrap gap-3">
            <div className="hidden gap-3 sm:flex">
              {profile.venueManager && <CreateVenueButton />}
              <EditProfileButton profile={profile} />
            </div>

            <div className="flex gap-3 sm:hidden">
              {profile.venueManager && <CreateVenueButton iconOnly />}
              <EditProfileButton profile={profile} iconOnly />
            </div>
          </div>
        </div>

        <h1 className="text-coffee mb-1 flex items-center gap-2 text-2xl font-bold">
          {profile.name}
          {profile.venueManager && (
            <span className="bg-wine rounded-lg px-2 py-0.5 text-xs font-medium text-white shadow">
              Venue Manager
            </span>
          )}
        </h1>

        {profile.email && <p className="text-sm text-amber-800">{profile.email}</p>}
      </div>

      <section className="border-wine mt-6 border-b-2 p-5">

        <div className="grid gap-6 sm:hidden">
          <div>
            <div className="text-xs text-slate-600">Email:</div>
            <div className="truncate text-sm font-medium break-words">{profile.email ?? "—"}</div>
          </div>

          <div>
            <div className="text-xs text-slate-600">Bio:</div>
            <div className="text-sm font-medium break-words whitespace-pre-wrap">
              {profile.bio || "—"}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <div className="text-xs text-slate-600">Bookings:</div>
              <div className="text-sm font-semibold">{upcomingBookings}</div>
            </div>
            <div>
              <div className="text-xs text-slate-600">Venues:</div>
              <div className="text-sm font-semibold">{profile._count?.venues ?? 0}</div>
            </div>
          </div>
        </div>

        <div className="hidden grid-cols-1 gap-6 sm:grid sm:grid-cols-2 md:grid-cols-4">
          <div>
            <div className="text-xs text-slate-600">Email:</div>
            <div className="truncate text-sm font-medium break-words">{profile.email ?? "—"}</div>
          </div>
          <div>
            <div className="text-xs text-slate-600">Bio:</div>
            <div className="text-sm font-medium break-words whitespace-pre-wrap">
              {profile.bio || "—"}
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-600">Bookings:</div>
            <div className="text-sm font-semibold">{upcomingBookings}</div>
          </div>
          <div>
            <div className="text-xs text-slate-600">Venues:</div>
            <div className="text-sm font-semibold">{profile._count?.venues ?? 0}</div>
          </div>
        </div>
      </section>

      <section className="mt-8 space-y-6">
        <HostingGuide />

        <CollapsibleSection title="My Venues" defaultOpen icon="circleChevron">
          <VenuesList venues={profile.venues ?? []} isVenueManager={profile.venueManager} />
        </CollapsibleSection>

        <CollapsibleSection title="My Bookings" icon="arrow">
          <BookingsList bookings={profile.bookings ?? []} />
        </CollapsibleSection>

        {profile.venueManager && (
          <CollapsibleSection title="Upcoming Bookings" icon="plus">
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
