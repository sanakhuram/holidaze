import { MapPin } from "lucide-react";

export default function MapCard({
  hasCoords,
  lat,
  lng,
  query,
  label,
}: {
  hasCoords: boolean;
  lat?: number;
  lng?: number;
  query: string;
  label: string;
}) {
  const src = hasCoords
    ? (() => {
        const p = 0.02, L = (lng as number) - p, R = (lng as number) + p, B = (lat as number) - p, T = (lat as number) + p;
        const qs = new URLSearchParams({
          layer: "mapnik",
          marker: `${lat},${lng}`,
          bbox: `${L},${B},${R},${T}`,
        });
        return `https://www.openstreetmap.org/export/embed.html?${qs.toString()}`;
      })()
    : `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;

  return (
    <div className="mt-6">
      <div className="mb-2 flex items-center gap-2 text-amber-200/80">
        <MapPin className="h-4 w-4" />
        <span className="text-sm">{label}</span>
      </div>
      <div className="overflow-hidden rounded-lg border border-amber-600/25">
        <iframe
          title="Map"
          src={src}
          className="h-56 w-full"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </div>
  );
}
