"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import clsx from "clsx";

export default function CollapsibleSection({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="rounded-xl border border-amber-300 bg-wine-50/40 shadow-sm">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="text-coffee flex w-full items-center justify-between rounded-t-xl px-5 py-3 text-left font-semibold transition-colors hover:bg-amber-100/60"
      >
        <span>{title}</span>
        <ChevronDown
          className={clsx(
            "h-5 w-5 text-amber-600 transition-transform duration-200",
            open ? "rotate-180" : "rotate-0"
          )}
        />
      </button>
      <div
        className={clsx(
          "overflow-hidden transition-all duration-300 ease-in-out",
          open ? "max-h-screen px-5 py-4 opacity-100" : "max-h-0 px-5 opacity-0"
        )}
      >
        {open && <div className="grid gap-4">{children}</div>}
      </div>
    </div>
  );
}
