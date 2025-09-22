"use client";

import Link from "next/link";
import Image from "next/image";
import type { Route } from "next";
import { toast } from "react-hot-toast";
import { FaGithub, FaLinkedin, FaGlobe } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="from-coffee to-wine bg-gradient-to-r px-6 pt-12 pb-8 text-amber-600">
      <div className="container mx-auto grid gap-10 md:grid-cols-4">
        <div className="flex flex-col items-start">
          <Image
            src="/logo.png"
            alt="Holidaze Logo"
            width={95}
            height={95}
            style={{ height: "auto", width: "auto" }}
            className="mb-4 rounded-full"
            priority
          />
          <h2 className="mb-2 text-2xl font-bold text-amber-600">Holidaze</h2>
          <p className="text-sm/6 opacity-90">
            Escape, Explore, Enjoy. Your next adventure starts here.
          </p>
        </div>

        <div>
          <h3 className="mb-4 text-xl font-semibold text-amber-600">Links</h3>
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
            <li>
              <Link href={"/terms" as Route} className="hover:underline">
                Terms & Conditions
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-xl font-semibold text-amber-600">Contact</h3>
          <ul className="space-y-2 text-sm">
            <li>Email: support@holidaze.com</li>
            <li>Phone: +123 456 7890</li>
            <li>Location: 123 Seaside Ave, Trondheim</li>
          </ul>

          <div className="mt-4 flex space-x-4 text-2xl text-amber-600">
            <Link
              href="https://github.com/sanakhuram"
              target="_blank"
              aria-label="GitHub"
              className="hover:text-white"
            >
              <FaGithub />
            </Link>
            <Link
              href="https://skhuram.netlify.app/"
              target="_blank"
              aria-label="Portfolio"
              className="hover:text-white"
            >
              <FaGlobe />
            </Link>
            <Link
              href="https://www.linkedin.com/in/sana-khuram-157ba02b7/"
              target="_blank"
              aria-label="LinkedIn"
              className="hover:text-white"
            >
              <FaLinkedin />
            </Link>
          </div>
        </div>
        <div>
          <h3 className="mb-4 text-xl font-semibold text-amber-600">Subscribe</h3>
          <p className="mb-4 text-sm opacity-90">
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
              className="text-coffee placeholder:text-coffee/60 rounded bg-white p-2 focus:outline-none"
              required
            />
            <button
              type="submit"
              className="rounded bg-amber-700 p-2 text-white transition hover:bg-amber-600"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      <div className="mt-12 text-center text-xs opacity-90">
        © {new Date().getFullYear()} Holidaze 🌴. Build with 🧡 by{" "}
        <a href="mailto:sana.khuram.baig@gmail.com" className="font-semibold hover:underline">
          Sana Khuram
        </a>
        .
      </div>
    </footer>
  );
}
