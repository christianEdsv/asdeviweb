import type { Metadata } from "next";
import { absoluteUrl, siteConfig } from "@/config/site";
import { urlFor } from "@/sanity/lib/image";
import type { CmsImage, SeoFields } from "@/types/content";
import type { SanityImageSource } from "@sanity/image-url";

/** Imagen Open Graph por defecto (generada en `app/og/route.tsx`). */
export const DEFAULT_OG_IMAGE = "/og";

/**
 * URL absoluta de una imagen del CMS para Open Graph y JSON-LD.
 * - Sanity: recorte 1200×630 en JPG (formato compatible con redes sociales).
 * - Mock local o ausente: imagen por defecto del sitio.
 */
export function getSocialImageUrl(image?: CmsImage | null): string {
  if (image?.asset?._ref) {
    return urlFor(image as unknown as SanityImageSource)
      .width(1200)
      .height(630)
      .fit("crop")
      .format("jpg")
      .quality(80)
      .url();
  }
  return absoluteUrl(DEFAULT_OG_IMAGE);
}

/** URL absoluta de una imagen para JSON-LD (logo, portada…). */
export function getAbsoluteImageUrl(image?: CmsImage | null): string | undefined {
  if (!image) return undefined;
  if (image.asset?._ref) {
    return urlFor(image as unknown as SanityImageSource)
      .width(1200)
      .auto("format")
      .url();
  }
  if (image.mockSrc) return absoluteUrl(image.mockSrc);
  return undefined;
}

interface BuildMetadataOptions {
  /** Título de la página (se compone con la plantilla del layout). */
  title: string;
  description?: string;
  /** Ruta relativa canónica, p. ej. `/miembros/mi-estudio`. */
  path: string;
  /** Campos SEO del CMS: tienen prioridad sobre los valores por defecto. */
  seo?: SeoFields | null;
  /** Imagen representativa del contenido (portada, logo…). */
  image?: CmsImage | null;
  type?: "website" | "article" | "profile";
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  /** Usa el título tal cual, sin la plantilla "· ASDEVI". */
  absoluteTitle?: boolean;
}

/**
 * Construye el objeto `Metadata` de una página consumiendo los campos SEO del
 * CMS (`title`, `description`, `ogImage`, `canonicalUrl`, `noIndex`) con
 * valores por defecto razonables cuando no se han rellenado.
 */
export function buildMetadata({
  title,
  description,
  path,
  seo,
  image,
  type = "website",
  publishedTime,
  modifiedTime,
  authors,
  absoluteTitle = false,
}: BuildMetadataOptions): Metadata {
  const finalTitle = seo?.title?.trim() || title;
  const finalDescription =
    seo?.description?.trim() || description || siteConfig.description;
  const canonical = seo?.canonicalUrl?.trim() || absoluteUrl(path);
  const ogImage = getSocialImageUrl(seo?.ogImage ?? image);
  const ogAlt = seo?.ogImage?.alt ?? image?.alt ?? finalTitle;

  return {
    title: absoluteTitle ? { absolute: finalTitle } : finalTitle,
    description: finalDescription,
    alternates: { canonical },
    robots: seo?.noIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      type: type === "profile" ? "website" : type,
      title: finalTitle,
      description: finalDescription,
      url: canonical,
      siteName: siteConfig.name,
      locale: siteConfig.ogLocale,
      images: [{ url: ogImage, width: 1200, height: 630, alt: ogAlt }],
      ...(type === "article"
        ? { publishedTime, modifiedTime, authors }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: finalTitle,
      description: finalDescription,
      images: [ogImage],
    },
  };
}
