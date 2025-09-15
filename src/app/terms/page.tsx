"use client";

import { FormEvent } from "react";
import { toast } from "react-hot-toast";

export default function TermsPage() {
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    toast.success("Your inquiry has been sent.");
    (e.target as HTMLFormElement).reset();
  }

  return (
    <main className="bg-background rounded-2xl border-[30px] border-transparent p-8 [border-image:linear-gradient(to_right,var(--coffee),var(--wine))_1]">
      <div className="text-foreground/90 m-10 mx-auto max-w-5xl text-sm leading-relaxed">
        <h1 className="text-coffee mb-8 text-center text-2xl font-bold">Terms & Conditions</h1>

        <p>
          Welcome to Holidaze. By registering, booking, or hosting with us, you agree to the
          following Terms & Conditions. These ensure that Holidaze remains a safe and reliable
          platform for customers, visitors, and venue managers.
        </p>

        <aside className="float-right mb-4 ml-6 w-full max-w-xs">
          <p className="text-coffee mb-3 text-center font-medium">For inquiry contact us</p>
          <div className="from-coffee to-wine rounded-2xl bg-gradient-to-r p-[2px] shadow-lg">
            <div className="rounded-2xl px-6 py-6">
              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  className="bg-background rounded border border-gray-300 p-2 text-sm text-gray-800 placeholder:text-gray-500 focus:border-amber-500 focus:outline-none"
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  className="bg-background rounded border border-gray-300 p-2 text-sm text-gray-800 placeholder:text-gray-500 focus:border-amber-500 focus:outline-none"
                  required
                />
                <textarea
                  name="message"
                  rows={3}
                  placeholder="Your Message"
                  className="bg-background rounded border border-gray-300 p-2 text-sm text-gray-800 placeholder:text-gray-500 focus:border-amber-500 focus:outline-none"
                  required
                />
                <button
                  type="submit"
                  className="rounded bg-amber-700 px-4 py-2 text-white shadow hover:bg-amber-600"
                >
                  Send Inquiry
                </button>
              </form>
            </div>
          </div>
        </aside>

        <h2 className="text-coffee mt-4 text-base font-semibold">1. General Use</h2>
        <p>
          Users must be at least 18 years old to create an account. All information provided in your
          profile must be accurate and kept up to date. Misuse of the platform may result in account
          suspension or removal.
        </p>

        <h2 className="text-coffee mt-4 text-base font-semibold">2. Customer Responsibilities</h2>
        <p>
          Customers may browse and book venues through Holidaze. Bookings must be paid in full at
          the time of reservation unless otherwise stated. Cancellations and refunds are subject to
          the cancellation policy listed on each venue’s page. Customers are responsible for
          respecting venue rules and leaving venues in the same condition as found.
        </p>

        <h2 className="text-coffee mt-4 text-base font-semibold">
          3. Venue Manager Responsibilities
        </h2>
        <p>
          Venue managers must provide accurate descriptions, pricing, and availability. Photos
          uploaded must be genuine representations of the venue. Venue managers are responsible for
          managing bookings, responding to inquiries, and maintaining the property in a safe
          condition. Holidaze may remove venues that fail to meet quality or safety standards.
        </p>

        <h2 className="text-coffee mt-4 text-base font-semibold">4. Payments and Fees</h2>
        <p>
          All payments are processed securely through Holidaze’s providers. Venue managers may be
          charged a service fee per booking. Customers agree to pay the full amount shown at
          checkout.
        </p>

        <h2 className="text-coffee mt-4 text-base font-semibold">5. Cancellations and Refunds</h2>
        <p>
          Each venue sets its own cancellation policy. Refunds are processed according to the booked
          venue’s rules. Holidaze cannot override these policies.
        </p>

        <h2 className="text-coffee mt-4 text-base font-semibold">6. Liability</h2>
        <p>
          Holidaze acts only as an intermediary. We are not responsible for disputes, accidents, or
          damages. Venue managers must ensure safe accommodations; customers are responsible for
          their conduct.
        </p>

        <h2 className="text-coffee mt-4 text-base font-semibold">7. Account Termination</h2>
        <p>
          Holidaze reserves the right to suspend or terminate accounts that violate these Terms &
          Conditions, provide false information, or misuse the platform.
        </p>

        <h2 className="text-coffee mt-4 text-base font-semibold">8. Acknowledgment</h2>
        <p>
          By creating an account, booking, or listing a venue, you acknowledge that you have read,
          understood, and agreed to these Terms & Conditions.
        </p>

        {/* Clear float so later content doesn’t wrap weirdly */}
        <div className="clear-both"></div>
      </div>
    </main>
  );
}
