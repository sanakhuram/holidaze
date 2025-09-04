// src/app/venues/[id]/page.tsx
import { getVenueById } from "@/app/lib/api";
import type { VenueWithExtras } from "@/app/lib/types";
import { notFound } from "next/navigation";

import MediaGallery from "../../components/MediaGallery";
import BookingSection from "@/app/components/BookingSection";

type Props = { params: { id: string } };

export default async function VenueDetailPage({ params }: Props) {
  let data: VenueWithExtras;
  try {
    const res = await getVenueById(params.id);
    data = res.data;
  } catch {
    notFound();
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-brand-brown">{data.name}</h1>
        <p className="mt-2 text-brand-brown/80">{data.description}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-[1.2fr,1fr]">
        <MediaGallery media={data.media || []} name={data.name} />
        <BookingSection venue={data} />
      </div>
    </section>
  );
}
