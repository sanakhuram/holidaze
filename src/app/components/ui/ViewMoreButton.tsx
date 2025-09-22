"use client";

import { useState } from "react";
import { ChevronsDown, ChevronsUp } from "lucide-react";

export default function ViewMoreButton({
  onExpand,
  onCollapse,
}: {
  onExpand: () => void;
  onCollapse: () => void;
}) {
  const [expanded, setExpanded] = useState(false);

  const handleClick = () => {
    if (expanded) {
      onCollapse();
    } else {
      onExpand();
    }
    setExpanded(!expanded);
  };

  return (
    <button
      onClick={handleClick}
      aria-expanded={expanded}
      aria-label={expanded ? "Collapse content" : "Expand content"}
      className="group bg-wine hover:text-coffee flex items-center justify-center rounded-full p-2 text-white shadow transition-colors duration-300 hover:bg-amber-500"
    >
      {expanded ? (
        <ChevronsUp className="h-5 w-5 transition-transform duration-300 group-hover:-translate-y-1" />
      ) : (
        <ChevronsDown className="h-5 w-5 transition-transform duration-300 group-hover:translate-y-1" />
      )}
    </button>
  );
}
