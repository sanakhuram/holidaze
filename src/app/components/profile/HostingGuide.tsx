"use client";

import CollapsibleSection from "../ui/CollapsibleSection";

export default function HostingGuide() {
    return (
        <CollapsibleSection title="Hosting Guide">
            <div className="space-y-3 text-sm text-slate-700 leading-relaxed">
                <p>
                    Ready to become a host? Creating a venue is quick and easy! Here’s
                    what you’ll need:
                </p>
                <ol className="list-decimal list-inside space-y-1">
                    <li>
                        <strong>Details:</strong> Add your venue’s name, description, and
                        location.
                    </li>
                    <li>
                        <strong>Photos:</strong> Upload clear, high-quality images that show
                        off your venue.
                    </li>
                    <li>
                        <strong>Pricing & Guests:</strong> Set a nightly price and max guest
                        capacity.
                    </li>
                    <li>
                        <strong>Amenities:</strong> Highlight what makes your venue special
                        (Wi-Fi, parking, breakfast, etc.).
                    </li>
                </ol>
                <p>
                    Once published, your venue will be visible to travelers, and you’ll be
                    able to manage bookings right from your profile. 🎉
                </p>
            </div>
        </CollapsibleSection>
    );
}
