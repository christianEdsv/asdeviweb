import "server-only";
import { client } from "@/sanity/lib/client";

/** Etiquetas base de caché para revalidación bajo demanda (`revalidateTag`). */
export const CACHE_TAGS = {
  member: "member",
  event: "event",
  post: "post",
  siteSettings: "siteSettings",
} as const;

export type BaseCacheTag = (typeof CACHE_TAGS)[keyof typeof CACHE_TAGS];

/** Soporta tags por colección (`'post'`) y por documento específico (`'post:mi-slug'`). */
export type CacheTag = BaseCacheTag | `${BaseCacheTag}:${string}`;

/**
 * Fallback de seguridad en producción (segundos) en caso de que el webhook de
 * Sanity no dispare o esté pendiente de configuración.
 */
export const PROD_FALLBACK_REVALIDATE_SECONDS = 30;

interface SanityFetchOptions {
  query: string;
  params?: Record<string, unknown>;
  tags: CacheTag[];
  revalidate?: number | false;
}

/**
 * Wrapper centralizado sobre `client.fetch` de `next-sanity` optimizado para
 * actualización inmediata:
 * - En desarrollo (`NODE_ENV !== "production"`): usa `cache: "no-store"` para
 *   que cualquier cambio publicado en `/studio` se refleje al instante en
 *   `localhost` sin necesitar túnel de webhook.
 * - En producción: etiqueta cada consulta con `next.tags` para invalidación
 *   instantánea vía webhook (`revalidateTag(tag, { expire: 0 })`) más un
 *   fallback ISR corto de 30s.
 */
export async function sanityFetch<T>({
  query,
  params = {},
  tags,
  revalidate = PROD_FALLBACK_REVALIDATE_SECONDS,
}: SanityFetchOptions): Promise<T> {
  if (process.env.NODE_ENV !== "production") {
    return client.fetch<T>(query, params, {
      cache: "no-store",
    });
  }

  return client.fetch<T>(query, params, {
    next: {
      tags,
      revalidate,
    },
  });
}
