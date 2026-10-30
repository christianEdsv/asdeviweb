import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/config/site";
import { getEventSlugs, getMemberSlugs, getPostSlugs } from "@/data";
import { POST_CATEGORIES } from "@/lib/taxonomies";

export const dynamic = "force-static";
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [members, events, posts] = await Promise.all([
    getMemberSlugs(),
    getEventSlugs(),
    getPostSlugs(),
  ]);

  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), lastModified: now, changeFrequency: "daily", priority: 1 },
    {
      url: absoluteUrl("/sobre-nosotros"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: absoluteUrl("/miembros"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: absoluteUrl("/eventos"),
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: absoluteUrl("/noticias"),
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    ...POST_CATEGORIES.map((category) => ({
      url: absoluteUrl(`/noticias/categoria/${category.value}`),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];

  const memberRoutes: MetadataRoute.Sitemap = members.map((item) => ({
    url: absoluteUrl(`/miembros/${item.slug}`),
    lastModified: item._updatedAt ? new Date(item._updatedAt) : now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const eventRoutes: MetadataRoute.Sitemap = events.map((item) => ({
    url: absoluteUrl(`/eventos/${item.slug}`),
    lastModified: item._updatedAt ? new Date(item._updatedAt) : now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const postRoutes: MetadataRoute.Sitemap = posts.map((item) => ({
    url: absoluteUrl(`/noticias/${item.slug}`),
    lastModified: item._updatedAt ? new Date(item._updatedAt) : now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...memberRoutes, ...eventRoutes, ...postRoutes];
}
