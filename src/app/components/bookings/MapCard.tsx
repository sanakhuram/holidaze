import { MapPin } from "lucide-react";

/**
 * Displays a map for a location using coordinates or a query string.
 *
 * @param hasCoords - Whether latitude and longitude are provided.
 * @param lat - Latitude of the location (required if `hasCoords` is true).
 * @param lng - Longitude of the location (required if `hasCoords` is true).
 * @param query - Text query for the location (used if coordinates are not provided).
 * @param label - Label displayed above the map.
 *
 * @remarks
 * - If `hasCoords` is true, generates an OpenStreetMap iframe centered on the coordinates.
 * - Otherwise, falls back to Google Maps iframe using the `query`.
 * - Includes basic styling with border and rounded corners.
 */

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
        const p = 0.02,
          L = (lng as number) - p,
          R = (lng as number) + p,
          B = (lat as number) - p,
          T = (lat as number) + p;
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
      <div className="mb-2 flex items-center gap-2 font-bold text-amber-800">
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
