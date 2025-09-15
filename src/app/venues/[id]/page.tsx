// src/app/venues/[id]/page.tsx
import { getVenueById } from "@/app/lib/api";
import type { VenueWithExtras } from "@/app/lib/types";
import { notFound } from "next/navigation";
import MediaGallery from "../../components/bookings/MediaGallery";
import BookingSection from "../../components/bookings/BookingSection";
import FakeReviews from "@/app/components/reviews/FakeReviews";

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function VenueDetailPage(props: PageProps) {
  const { id } = await props.params;

  const res = await getVenueById(id).catch(() => null);
  if (!res?.data) notFound();

  const data = res.data as VenueWithExtras;

  return (
    <section className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-brand-brown text-3xl font-bold">{data.name}</h1>
        <p className="text-brand-brown/80 mt-2">{data.description}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-[1.2fr,1fr]">
        <MediaGallery media={data.media || []} name={data.name} />
        <BookingSection venue={data} />
      </div>
      <FakeReviews venueId={data.id} />
    </section>
  );
}

export async function generateMetadata(props: Pick<PageProps, "params">) {
  const { id } = await props.params;
  return {
    title: `Venue ${id} • Holidaze`,
    description: `Details and booking for venue ${id}`,
  };
}
