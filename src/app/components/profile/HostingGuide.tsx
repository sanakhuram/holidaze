"use client";

import CollapsibleSection from "../ui/CollapsibleSection";

export default function HostingGuide() {
  return (
    <CollapsibleSection title="Hosting Guide" icon="plus" defaultOpen>
      <div className="space-y-3 text-sm leading-relaxed text-slate-700">
        <p>
          Want to start hosting? First, make sure you’re a{" "}
          <span className="text-coffee font-semibold">Venue Manager</span>. You can enable this by
          editing your profile, or just use the quick toggle on your profile page. 🔑
        </p>

        <p>
          Once you’re a Venue Manager, creating a venue is quick and easy! Here’s what you’ll need:
        </p>

        <ol className="list-inside list-decimal space-y-1 text-slate-800">
          <li>
            <span className="text-wine font-semibold">Details:</span> Add your venue’s name,
            description, and location.
          </li>
          <li>
            <span className="text-wine font-semibold">Photos:</span> Upload high-quality images that
            show off your venue.
          </li>
          <li>
            <span className="text-wine font-semibold">Pricing & Guests:</span> Set a nightly price
            and max guest capacity.
          </li>
          <li>
            <span className="text-wine font-semibold">Amenities:</span> Highlight what makes your
            venue special (Wi-Fi, parking, breakfast, etc.).
          </li>
        </ol>

        <p>
          Once published, your venue will be visible to travelers, and you’ll be able to manage
          bookings right from your profile. 🎉
        </p>
      </div>
    </CollapsibleSection>
  );
}
