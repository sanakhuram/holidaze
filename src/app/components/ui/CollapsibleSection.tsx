"use client";

import { useState } from "react";
import clsx from "clsx";

import {
  CircleChevronDown,
  CircleChevronUp,
  ArrowDownCircle,
  ArrowUpCircle,
  PlusCircle,
  MinusCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

type IconVariant = "circleChevron" | "arrow" | "plus" | "chevron";

export default function CollapsibleSection({
  title,
  children,
  defaultOpen = false,
  icon = "circleChevron",
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  icon?: IconVariant;
}) {
  const [open, setOpen] = useState(defaultOpen);

  const renderIcon = () => {
    switch (icon) {
      case "arrow":
        return open ? (
          <ArrowUpCircle className="h-6 w-6 text-indigo-500 transition-transform duration-300" />
        ) : (
          <ArrowDownCircle className="h-6 w-6 text-amber-600 transition-transform duration-300" />
        );
      case "plus":
        return open ? (
          <MinusCircle className="h-6 w-6 text-rose-500 transition-transform duration-300" />
        ) : (
          <PlusCircle className="h-6 w-6 text-pink-800 transition-transform duration-300" />
        );
      case "chevron":
        return open ? (
          <ChevronUp className="h-6 w-6 text-sky-500 transition-transform duration-300" />
        ) : (
          <ChevronDown className="h-6 w-6 text-amber-600 transition-transform duration-300" />
        );
      case "circleChevron":
      default:
        return open ? (
          <CircleChevronUp className="h-6 w-6 text-pink-800 transition-transform duration-300" />
        ) : (
          <CircleChevronDown className="h-6 w-6 text-amber-600 transition-transform duration-300" />
        );
    }
  };

  return (
    <div className="bg-wine-50/40 rounded-xl border border-amber-500/50 shadow-sm">
      <button
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-controls={`${title.replace(/\s+/g, "-")}-content`}
        className="group text-coffee flex w-full items-center justify-between rounded-t-xl px-5 py-3 text-left font-semibold transition-colors hover:bg-amber-100/60"
      >
        <span>{title}</span>
        {renderIcon()}
      </button>

      {open && (
        <div
          id={`${title.replace(/\s+/g, "-")}-content`}
          className={clsx(
            "overflow-hidden transition-all duration-300 ease-in-out",
            open ? "max-h-[90vh] opacity-100" : "max-h-0 opacity-0"
          )}
        >
          <div className="px-5 py-4">
            <div className="max-h-[75vh] overflow-x-hidden overflow-y-auto">
              <div className="grid gap-4">{children}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
