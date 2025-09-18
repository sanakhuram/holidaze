"use client";
import { Toaster } from "react-hot-toast";

export default function ToastProvider() {
  return (
    <Toaster
      position="top-center"
      gutter={10}
      toastOptions={{
        duration: 3500,
        className: "backdrop-blur-sm shadow-lg",
        style: {
          background: "var(--background)",
          color: "var(--foreground)",
          border: "1px solid var(--wine)",
          borderRadius: "0.75rem",
          padding: "0.75rem 1rem",
        },
        success: {
          iconTheme: {
            primary: "var(--wine)",
            secondary: "var(--background)",
          },
        },
        error: {
          style: {
            border: "1px solid crimson",
            color: "crimson",
            background: "var(--background)",
          },
        },
      }}
      containerStyle={{ zIndex: 60 }}
    />
  );
}
