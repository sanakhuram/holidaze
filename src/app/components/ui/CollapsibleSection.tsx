//src/app/components/ui/CollapsibleSection.tsx
"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

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
        <div className="rounded-2xl border border-amber-500 p-5">
            <button
                onClick={() => setOpen((prev) => !prev)}
                className="mb-3 flex w-full items-center justify-between text-lg font-semibold text-left"
            >
                <span>{title}</span>
                {open ? (
                    <ChevronDown className="h-5 w-5 text-amber-600" />
                ) : (
                    <ChevronRight className="h-5 w-5 text-amber-600" />
                )}
            </button>

            {open && <div className="space-y-4">{children}</div>}
        </div>
    );
}
