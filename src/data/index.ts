import "server-only";
import { isSanityConfigured } from "@/sanity/env";
import { CACHE_TAGS, sanityFetch } from "@/sanity/lib/fetch";
import {
  eventBySlugQuery,
  eventSlugsQuery,
  eventsQuery,
  latestMembersQuery,
  latestPostsQuery,
  memberBySlugQuery,
  memberSlugsQuery,
  membersQuery,
  postBySlugQuery,
  postSlugsQuery,
  postsPageQuery,
  relatedPostsQuery,
  siteSettingsQuery,
} from "@/sanity/lib/queries";
import type { PostCategory } from "@/lib/taxonomies";
import { getEventStatus } from "@/lib/dates";
import type {
  EventItem,
  Member,
  Post,
  PostPage,
  SiteSettings,
} from "@/types/content";
import { mockEvents } from "./mock/events";
import { mockMembers } from "./mock/members";
import { mockPosts } from "./mock/posts";
import { mockSettings } from "./mock/settings";

/**
 * Capa de datos única para las vistas. Si el CMS está configurado consulta
 * Sanity (con caché por etiquetas + ISR); si no, devuelve datos de prueba con
 * las mismas formas. Las páginas no conocen el origen de los datos.
 */

export const POSTS_PER_PAGE = 9;

// ── Ajustes del sitio ───────────────────────────────────────────────────────

type CmsSettings = Partial<Omit<SiteSettings, "about" | "socials">> & {
  socials?: Partial<SiteSettings["socials"]> | null;
  about?: Partial<{ [K in keyof SiteSettings["about"]]: SiteSettings["about"][K] | null }> | null;
};

function isFilled<T>(value: T | null | undefined): value is T {
  if (value === null || value === undefined) return false;
  if (typeof value === "string") return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  return true;
}

/** Rellena con los valores por defecto cualquier campo vacío del CMS. */
function mergeSettings(cms: CmsSettings | null): SiteSettings {
  if (!cms) return mockSettings;
  const about = { ...mockSettings.about };
  for (const key of Object.keys(about) as (keyof SiteSettings["about"])[]) {
    const value = cms.about?.[key];
    if (isFilled(value)) {
      (about as Record<string, unknown>)[key] = value;
    }
  }
  const socials = { ...mockSettings.socials };
  for (const key of Object.keys(socials) as (keyof SiteSettings["socials"])[]) {
    const value = cms.socials?.[key];
    if (isFilled(value)) socials[key] = value;
  }
  return {
    email: isFilled(cms.email) ? cms.email : mockSettings.email,
    socials,
    about,
    seo: cms.seo ?? undefined,
  };
}

export async function getSiteSettings(): Promise<SiteSettings> {
  if (!isSanityConfigured) return mockSettings;
  const cms = await sanityFetch<CmsSettings | null>({
    query: siteSettingsQuery,
    tags: [CACHE_TAGS.siteSettings],
  });
  return mergeSettings(cms);
}

// ── Miembros ────────────────────────────────────────────────────────────────

export async function getMembers(): Promise<Member[]> {
  if (!isSanityConfigured) return mockMembers;
  return sanityFetch<Member[]>({ query: membersQuery, tags: [CACHE_TAGS.member] });
}

export async function getLatestMembers(limit = 8): Promise<Member[]> {
  if (!isSanityConfigured) {
    return [...mockMembers]
      .sort((a, b) => (b.joinedAt ?? "").localeCompare(a.joinedAt ?? ""))
      .slice(0, limit);
  }
  return sanityFetch<Member[]>({
    query: latestMembersQuery,
    params: { limit },
    tags: [CACHE_TAGS.member],
  });
}

export async function getMemberBySlug(slug: string): Promise<Member | null> {
  if (!isSanityConfigured) {
    return mockMembers.find((member) => member.slug === slug) ?? null;
  }
  return sanityFetch<Member | null>({
    query: memberBySlugQuery,
    params: { slug },
    tags: [CACHE_TAGS.member, `${CACHE_TAGS.member}:${slug}`],
  });
}

export interface SlugEntry {
  slug: string;
  _updatedAt?: string;
}

export async function getMemberSlugs(): Promise<SlugEntry[]> {
  if (!isSanityConfigured) {
    return mockMembers.map(({ slug }) => ({ slug }));
  }
  return sanityFetch<SlugEntry[]>({ query: memberSlugsQuery, tags: [CACHE_TAGS.member] });
}

// ── Eventos ─────────────────────────────────────────────────────────────────

export async function getEvents(): Promise<EventItem[]> {
  if (!isSanityConfigured) {
    return [...mockEvents].sort((a, b) => a.startDate.localeCompare(b.startDate));
  }
  return sanityFetch<EventItem[]>({ query: eventsQuery, tags: [CACHE_TAGS.event] });
}

export async function getEventBySlug(slug: string): Promise<EventItem | null> {
  if (!isSanityConfigured) {
    return mockEvents.find((event) => event.slug === slug) ?? null;
  }
  return sanityFetch<EventItem | null>({
    query: eventBySlugQuery,
    params: { slug },
    tags: [CACHE_TAGS.event, `${CACHE_TAGS.event}:${slug}`],
  });
}

export async function getEventSlugs(): Promise<SlugEntry[]> {
  if (!isSanityConfigured) {
    return mockEvents.map(({ slug }) => ({ slug }));
  }
  return sanityFetch<SlugEntry[]>({ query: eventSlugsQuery, tags: [CACHE_TAGS.event] });
}

/**
 * Separa eventos en próximos (incluye los que están en curso, ordenados por
 * fecha ascendente) y pasados (más reciente primero).
 */
export function splitEvents(
  events: EventItem[],
  now: Date = new Date(),
): { upcoming: EventItem[]; past: EventItem[] } {
  const upcoming: EventItem[] = [];
  const past: EventItem[] = [];
  for (const event of events) {
    const status = getEventStatus(event.startDate, event.endDate, now);
    (status === "past" ? past : upcoming).push(event);
  }
  upcoming.sort((a, b) => a.startDate.localeCompare(b.startDate));
  past.sort((a, b) => b.startDate.localeCompare(a.startDate));
  return { upcoming, past };
}

// ── Noticias ────────────────────────────────────────────────────────────────

function sortPostsDesc(posts: Post[]): Post[] {
  return [...posts].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export async function getPostsPage(options: {
  page: number;
  category?: PostCategory;
  pageSize?: number;
}): Promise<PostPage> {
  const { page, category, pageSize = POSTS_PER_PAGE } = options;
  const start = (page - 1) * pageSize;
  const end = start + pageSize;

  let items: Post[];
  let total: number;

  if (!isSanityConfigured) {
    const filtered = sortPostsDesc(mockPosts).filter(
      (post) => !category || post.category === category,
    );
    total = filtered.length;
    items = filtered.slice(start, end);
  } else {
    const result = await sanityFetch<{ items: Post[]; total: number }>({
      query: postsPageQuery,
      params: { category: category ?? "", start, end },
      tags: [CACHE_TAGS.post],
    });
    items = result.items;
    total = result.total;
  }

  return {
    items,
    total,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  };
}

export async function getLatestPosts(limit = 3): Promise<Post[]> {
  if (!isSanityConfigured) return sortPostsDesc(mockPosts).slice(0, limit);
  return sanityFetch<Post[]>({
    query: latestPostsQuery,
    params: { limit },
    tags: [CACHE_TAGS.post],
  });
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  if (!isSanityConfigured) {
    return mockPosts.find((post) => post.slug === slug) ?? null;
  }
  return sanityFetch<Post | null>({
    query: postBySlugQuery,
    params: { slug },
    tags: [CACHE_TAGS.post, `${CACHE_TAGS.post}:${slug}`],
  });
}

export async function getRelatedPosts(
  post: Pick<Post, "slug" | "category">,
  limit = 3,
): Promise<Post[]> {
  if (!isSanityConfigured) {
    return sortPostsDesc(mockPosts)
      .filter((item) => item.category === post.category && item.slug !== post.slug)
      .slice(0, limit);
  }
  return sanityFetch<Post[]>({
    query: relatedPostsQuery,
    params: { category: post.category, slug: post.slug, limit },
    tags: [CACHE_TAGS.post],
  });
}

export interface PostSlugEntry extends SlugEntry {
  category: PostCategory;
}

export async function getPostSlugs(): Promise<PostSlugEntry[]> {
  if (!isSanityConfigured) {
    return mockPosts.map(({ slug, category }) => ({ slug, category }));
  }
  return sanityFetch<PostSlugEntry[]>({ query: postSlugsQuery, tags: [CACHE_TAGS.post] });
}
