// src/app/venues/[id]/page.tsx
import { getVenueById } from "@/app/lib/api";
import type { VenueWithExtras } from "@/app/lib/types";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import MediaGallery from "../../components/bookings/MediaGallery";
import BookingSection from "../../components/bookings/BookingSection";
import FakeReviews from "@/app/components/reviews/VenueReviews";
import BackToVenues from "@/app/components/ui/BackButton";

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

/**
 *
 * @param props - Props containing params promise which resolves to venue ID
 * @returns - The venue detail page component displaying venue info, media gallery, and booking section
 */

export default async function VenueDetailPage(props: PageProps) {
  const { id } = await props.params;
  const jar = await cookies();
  const token = jar.get("noroff_token")?.value;
  const authenticated = !!token;

  const res = await getVenueById(id).catch(() => null);
  if (!res?.data) notFound();

  const data = res.data as VenueWithExtras;

  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <BackToVenues className="mb-6 inline-block" />
      <div className="mb-8">
        <h1 className="text-brand-brown text-3xl font-bold">{data.name}</h1>
        <p className="text-brand-brown/80 mt-3">{data.description}</p>
      </div>

      <div className="grid gap-8 md:grid-cols-[1.2fr,1fr]">
        <MediaGallery media={data.media || []} name={data.name} />
        <BookingSection venue={data} authenticated={authenticated} />
      </div>

      <div className="mt-10">
        <FakeReviews venueId={data.id} />
      </div>
    </section>
  );
}

/**
 *
 * @param props - Props containing params promise which resolves to venue ID
 * @returns - Metadata object for the venue detail page
 */

export async function generateMetadata(props: Pick<PageProps, "params">) {
  const { id } = await props.params;
  return {
    title: `Venue ${id} • Holidaze`,
    description: `Details and booking for venue ${id}`,
  };
}
