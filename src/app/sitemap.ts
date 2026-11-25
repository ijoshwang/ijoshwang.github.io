import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-11-25");

  return [
    {
      url: "https://ijoshwang.github.io/",
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: "https://ijoshwang.github.io/projects/",
      lastModified,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: "https://ijoshwang.github.io/career/",
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];
}
