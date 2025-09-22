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
      className="group bg-wine hover:text-coffee flex items-center gap-2 rounded-full px-3 py-2 text-white shadow transition-colors duration-300 hover:bg-amber-500"
    >
      {expanded ? (
        <>
          <ChevronsUp className="h-5 w-5 transition-transform duration-300 group-hover:-translate-y-1" />
          <span>Collapse</span>
        </>
      ) : (
        <>
          <ChevronsDown className="h-5 w-5 transition-transform duration-300 group-hover:translate-y-1" />
          <span>View More</span>
        </>
      )}
    </button>
  );
}
