import type { Metadata } from "next";
import "../styles/globals.css";

const SITE_URL = "https://malogisticsza.com";
const TITLE = "MA Logistics — Freight Forwarding, Southern Africa";
const DESCRIPTION =
  "Freight forwarding across South Africa and the SADC corridor. Competitive rates, real dispatchers, and shipment tracking from pickup to delivery.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: "%s · MA Logistics",
  },
  description: DESCRIPTION,
  keywords: [
    "freight forwarding South Africa",
    "logistics Germiston",
    "cross border freight SADC",
    "road freight Johannesburg",
    "container transport Southern Africa",
  ],
  authors: [{ name: "MA Logistics" }],
  generator: "Nino Techy",
  alternates: { canonical: "/" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: SITE_URL,
    siteName: "MA Logistics",
    locale: "en_ZA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
  },
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
