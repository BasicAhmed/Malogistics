import type { Metadata } from "next";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "MA Logistics — Delivered without hassle.",
  description:
    "Container transport across Southern Africa. Every load tracked, every minute accounted for, every handoff on time.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
