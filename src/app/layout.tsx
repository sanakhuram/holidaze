import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./components/NavBar";
import Footer from "./components/Footer";
import { poppins } from "./fonts";
import ToastProvider from "./components/ToastProvider";
import { AuthModalProvider } from "./auth/AuthModalContext";

export const metadata: Metadata = {
  title: "Holidaze | Accommodation Booking",
  description:
    "Holidaze is a modern accommodation booking platform where users can find, book, and manage holiday venues. Venue managers can also create and manage their listings with ease.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} ${poppins.variable} min-h-screen flex flex-col bg-background text-foreground`}
      >
        <AuthModalProvider>
          <Navbar />
          <ToastProvider />
          <main className="flex-1">{children}</main>
          <Footer />
        </AuthModalProvider>
      </body>
    </html>
  );
}
