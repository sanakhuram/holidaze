import Image from "next/image";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { getProfileByName } from "@/app/lib/api";
import type { Profile } from "@/app/lib/types";
import VenuesList from "@/app/components/profile/VenueList";
import BookingsList from "@/app/components/profile/BookingList";
import CollapsibleSection from "@/app/components/ui/CollapsibleSection";
import BackToVenues from "@/app/components/ui/BackToVenues";

type Params = { name: string };

export default async function ProfileDetailPage({ params }: { params: Params }) {
  const { name } = await params;

  const jar = await cookies();
  const token = jar.get("noroff_token")?.value;

  if (!token) notFound();

  let profile: Profile | null = null;
  try {
    profile = await getProfileByName(name, token);
  } catch {
    notFound();
  }

  if (!profile) notFound();

  const bannerUrl = profile.banner?.url ?? "/default-banner.jpg";
  const avatarUrl = profile.avatar?.url ?? "/default-avatar.jpg";
  const now = new Date();
  const activeBookings = profile.bookings?.filter((b) => new Date(b.dateTo) >= now) ?? [];

  return (
    <main className="mx-auto max-w-6xl px-4 pt-2 pb-10">
      <BackToVenues className="m-4 inline-block" />
      <div className="relative h-52 w-full overflow-hidden rounded-sm shadow-lg">
        <Image
          src={bannerUrl}
          alt={profile.banner?.alt ?? `${profile.name} banner`}
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
      </div>

      <div className="relative -mt-12 flex flex-col items-start gap-3">
        <div className="flex items-end gap-3">
          <div className="ring-wine relative h-24 w-24 overflow-hidden rounded-2xl shadow-lg ring-4">
            <Image
              src={avatarUrl}
              alt={profile.avatar?.alt ?? `${profile.name} avatar`}
              fill
              sizes="96px"
              className="object-cover"
            />
          </div>
        </div>

        <h1 className="text-coffee flex items-center gap-2 text-2xl font-bold">{profile.name}</h1>

        {profile.bio && <p className="text-sm text-amber-800">{profile.bio}</p>}
      </div>

      <section className="border-wine mt-6 border-b-2 p-5">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <div>
            <div className="text-xs text-slate-800">Email:</div>
            <div className="text-sm font-medium">{profile.email ?? "—"}</div>
          </div>
          <div>
            <div className="text-xs text-slate-800">Bookings:</div>
            <div className="text-sm font-medium">{activeBookings.length}</div>
          </div>
          <div>
            <div className="text-xs text-slate-800">Venues:</div>
            <div className="text-sm font-medium">{profile._count?.venues ?? 0}</div>
          </div>
        </div>
      </section>

      <div className="mt-8 space-y-6">
        <CollapsibleSection title="Venues" defaultOpen>
          <VenuesList venues={profile.venues ?? []} readonly />
        </CollapsibleSection>

        <CollapsibleSection title="Bookings" defaultOpen>
          <BookingsList bookings={activeBookings} readonly />
        </CollapsibleSection>
      </div>
    </main>
  );
}
