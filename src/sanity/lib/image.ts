import {
  createImageUrlBuilder,
  type SanityImageSource,
} from "@sanity/image-url";
import { dataset, projectId } from "@/sanity/env";
import type { CmsImage } from "@/types/content";

const builder = createImageUrlBuilder({
  projectId: projectId || "missing-project-id",
  dataset: dataset || "production",
});

/** Ancho máximo de origen que se pide al CDN (Next.js reduce después). */
const MAX_SOURCE_WIDTH = 2400;

/** Builder de URLs del CDN de Sanity (`cdn.sanity.io`). */
export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

/**
 * Resuelve la URL de una imagen del CMS lista para `next/image`.
 * - Imágenes mock locales: se devuelven tal cual.
 * - Imágenes de Sanity: `auto('format')` para servir webp/avif cuando el
 *   navegador lo soporta, respetando recorte y hotspot definidos en el Studio.
 */
export function resolveImageSrc(image: CmsImage): string | null {
  if (image.mockSrc) return image.mockSrc;
  if (!image.asset?._ref) return null;
  return urlFor(image as unknown as SanityImageSource)
    .width(MAX_SOURCE_WIDTH)
    .fit("max")
    .auto("format")
    .url();
}
