"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Route } from "next";
import { MapPinned, LogIn, UserPlus } from "lucide-react";
import { GiPalmTree } from "react-icons/gi";
import { FaUmbrellaBeach } from "react-icons/fa";

export default function Navbar() {
    const [open, setOpen] = useState(false);

    return (
        <nav className="sticky top-0 z-50 bg-gradient-to-r from-coffee to-wine text-amber-600 shadow-md shadow-amber-900/40">
            <div className="container mx-auto flex items-center justify-between p-4">
                <Link href={"/" as Route} className="flex items-center gap-2 font-bold text-xl">
                    <Image
                        src="/logo.png"
                        alt="Holidaze logo"
                        width={40}
                        height={40}
                        className="rounded-full"
                        priority
                    />
                    <span>Holidaze</span>
                </Link>

                <div className="hidden md:flex items-center gap-6">
                    <Link href={"/venues" as Route} className="inline-flex items-center gap-1 hover:underline">
                        <MapPinned className="h-4 w-4" />
                        Venues
                    </Link>

                    <Link href={"/login" as Route} className="inline-flex items-center gap-1 hover:underline">
                        <LogIn className="h-4 w-4" />
                        Login
                    </Link>

                    <Link href={"/register" as Route} className="inline-flex items-center gap-1 hover:underline">
                        <UserPlus className="h-4 w-4" />
                        Register
                    </Link>
                </div>

                <button
                    type="button"
                    onClick={() => setOpen((v) => !v)}
                    aria-expanded={open}
                    aria-controls="mobile-menu"
                    aria-label="Toggle menu"
                    className="md:hidden inline-flex items-center justify-center rounded-md p-1.5 hover:bg-white/10"
                >
                    {open ? <FaUmbrellaBeach className="h-6 w-6" /> : <GiPalmTree className="h-6 w-6" />}
                </button>
            </div>

            {open && (
                <div
                    id="mobile-menu"
                    className="md:hidden border-t border-white/10 bg-gradient-to-r from-coffee/95 to-wine/95 px-4 py-3 space-y-3 text-base"
                >
                    <Link
                        href={"/venues" as Route}
                        className="flex items-center gap-2 hover:underline"
                        onClick={() => setOpen(false)}
                    >
                        <MapPinned className="h-5 w-5" />
                        Venues
                    </Link>

                    <Link
                        href={"/login" as Route}
                        className="flex items-center gap-2 hover:underline"
                        onClick={() => setOpen(false)}
                    >
                        <LogIn className="h-5 w-5" />
                        Login
                    </Link>

                    <Link
                        href={"/register" as Route}
                        className="flex items-center gap-2 hover:underline"
                        onClick={() => setOpen(false)}
                    >
                        <UserPlus className="h-5 w-5" />
                        Register
                    </Link>
                </div>
            )}
        </nav>
    );
}
