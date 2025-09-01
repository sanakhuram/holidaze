"use client";

export default function Loader() {
    return (
        <span
            className="
        relative inline-block w-12 h-12
        rounded-full
        border-4 
        border-amber-500
        animate-spin
        "
            style={{
                borderImage: "linear-gradient(to right, #6f4e37, #722f37) 1",
                borderStyle: "solid",
            }}
            aria-label="Loading"
            role="status"
        >
            <span className="absolute inset-0 rounded-full blur-sm " />
        </span>
    );
}
