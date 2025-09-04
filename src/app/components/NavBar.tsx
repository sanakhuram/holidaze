"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { MapPinned, LogIn, LogOut, UserPlus } from "lucide-react";
import { GiPalmTree } from "react-icons/gi";
import { FaUmbrellaBeach } from "react-icons/fa";
import { useAuthModal } from "../auth/AuthModalContext";
import { useSession } from "@/hooks/useSession";
import clsx from "clsx";
import type { Route } from "next";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { openAuth } = useAuthModal();
  const { authenticated, user, refresh } = useSession();

  const logout = async () => {
    await fetch("/auth/logout", { method: "POST" });
    await refresh();
    router.refresh();
  };

  const initial = (user?.name || user?.email || "").trim().charAt(0).toUpperCase() || "🙂";

  const isActive = (href: string) => pathname === href;

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-coffee to-wine text-amber-600 shadow-md shadow-amber-900/40">
      <div className="container mx-auto flex items-center justify-between p-4">
        <Link href={"/" as Route} className="flex items-center gap-2 text-2xl font-bold">
          <Image
            src="/logo.png"
            alt="Holidaze Logo"
            width={40}
            height={40}
            className="rounded-full"
            priority
          />
          <span>Holidaze</span>
          <span className="sr-only">Home</span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <Link
            href={"/venues" as Route}
            aria-current={isActive("/venues") ? "page" : undefined}
            className={clsx(
              "inline-flex items-center gap-1 hover:underline",
              isActive("/venues") && "font-semibold underline"
            )}
          >
            <MapPinned className="h-4 w-4" />
            Venues
          </Link>

          {authenticated ? (
            <>
              <Link
                href={"/profile" as Route}
                className="flex items-center gap-2 text-sm opacity-95 hover:underline"
              >
                <div className="grid h-7 w-7 place-items-center rounded-full bg-amber-200/10 border border-amber-200/30">
                  <span className="font-semibold">{initial}</span>
                </div>
                <span className="truncate max-w-[12rem]">
                  Hi, {user?.name || user?.email || "there"}
                </span>
              </Link>

              <button
                onClick={logout}
                className="inline-flex items-center gap-1 hover:underline"
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => openAuth("login")}
                className="inline-flex items-center gap-1 hover:underline"
                aria-haspopup="dialog"
                title="Login"
              >
                <LogIn className="h-4 w-4" />
                Login
              </button>
              <button
                onClick={() => openAuth("register")}
                className="inline-flex items-center gap-1 hover:underline"
                aria-haspopup="dialog"
                title="Register"
              >
                <UserPlus className="h-4 w-4" />
                Register
              </button>
            </>
          )}
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label="Toggle menu"
          className="md:hidden inline-flex items-center justify-center rounded-md p-1.5 hover:bg-white/5"
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
            aria-current={isActive("/venues") ? "page" : undefined}
            className="flex items-center gap-2"
            onClick={() => setOpen(false)}
          >
            <MapPinned className="h-5 w-5" />
            Venues
          </Link>

          {authenticated ? (
            <>
              <Link
                href={"/profile" as Route}
                className="flex items-center gap-2 text-sm opacity-95"
                onClick={() => setOpen(false)}
              >
                <div className="grid h-7 w-7 place-items-center rounded-full bg-amber-200/10 border border-amber-200/30">
                  <span className="font-semibold">{initial}</span>
                </div>
                <span className="truncate max-w-[60%]">
                  {user?.name || user?.email || "Signed in"}
                </span>
              </Link>
              <button
                onClick={async () => {
                  setOpen(false);
                  await logout();
                }}
                className="flex items-center gap-2"
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  setOpen(false);
                  openAuth("login");
                }}
                className="flex items-center gap-2"
                aria-haspopup="dialog"
                title="Login"
              >
                <LogIn className="h-5 w-5" />
                Login
              </button>
              <button
                onClick={() => {
                  setOpen(false);
                  openAuth("register");
                }}
                className="flex items-center gap-2"
                aria-haspopup="dialog"
                title="Register"
              >
                <UserPlus className="h-5 w-5" />
                Register
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
