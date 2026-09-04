import type { MetadataRoute } from "next";
import { CORRIDORS } from "@/lib/corridors";

const SITE_URL = "https://malogistics.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/track`, changeFrequency: "monthly", priority: 0.5 },
    ...CORRIDORS.map((c) => ({
      url: `${SITE_URL}/routes/${c.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
