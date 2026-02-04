import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "http://localhost:3000";

  const staticPages = [
    { url: `${baseUrl}/en`, priority: 1.0 },
    { url: `${baseUrl}/ar`, priority: 1.0 },
    { url: `${baseUrl}/en/shop`, priority: 0.9 },
    { url: `${baseUrl}/ar/shop`, priority: 0.9 },
    { url: `${baseUrl}/en/categories`, priority: 0.8 },
    { url: `${baseUrl}/ar/categories`, priority: 0.8 },
  ];

  return [
    ...staticPages.map((p) => ({
      ...p,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
    })),
  ];
}
