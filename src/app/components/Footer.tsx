"use client";

import Link from "next/link";
import Image from "next/image";
import type { Route } from "next";
import { toast } from "react-hot-toast";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-coffee to-wine text-amber-600 pt-12 pb-8 px-6">
      <div className="container mx-auto grid gap-10 md:grid-cols-4">
        {/* Brand */}
        <div className="flex flex-col items-start">
          <Image
            src="/logo.png"
            alt="Holidaze Logo"
            width={95}
            height={95}
            className="rounded-full mb-4"
            priority
          />
          <h2 className="text-2xl font-bold mb-2 text-amber-600">Holidaze</h2>
          <p className="text-sm/6 opacity-90">
            Escape, Explore, Enjoy. Your next adventure starts here.
          </p>
        </div>
        <div>
          <h3 className="font-semibold text-xl mb-4 text-amber-600">Links</h3>
          <ul className="space-y-2">
            <li>
              <Link href={"/" as Route} className="hover:underline">
                Home
              </Link>
            </li>
            <li>
              <Link href={"/venues" as Route} className="hover:underline">
                Venues
              </Link>
            </li>
            <li>
              <Link href={"/about" as Route} className="hover:underline">
                About Us
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4 text-amber-600">Contact</h3>
          <ul className="space-y-2 text-sm">
            <li>Email: support@holidaze.com</li>
            <li>Phone: +123 456 7890</li>
            <li>Location: 123 Seaside Ave, Trondheim</li>
          </ul>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4 text-amber-600">Subscribe</h3>
          <p className="text-sm mb-4 opacity-90">
            Join our newsletter to get the latest deals and travel tips!
          </p>
          <form
            className="flex flex-col space-y-2"
            onSubmit={(e) => {
              e.preventDefault();
              toast.success("Subscribed! Check your inbox for a confirmation.");
            }}
          >
            <input
              type="email"
              placeholder="Your email address"
              className="p-2 rounded bg-white text-coffee placeholder:text-coffee/60 focus:outline-none"
              required
            />
            <button
              type="submit"
              className="p-2 bg-amber-700 text-white rounded hover:bg-amber-600 transition"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      <div className="text-center text-xs mt-12 opacity-90">
        © {new Date().getFullYear()} Holidaze 🌴. All rights reserved.
      </div>
    </footer>
  );
}
