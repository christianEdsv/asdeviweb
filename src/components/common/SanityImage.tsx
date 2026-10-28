import Image from "next/image";
import { resolveImageSrc } from "@/sanity/lib/image";
import { cn } from "@/lib/utils";
import type { CmsImage } from "@/types/content";

interface SanityImageProps {
  image: CmsImage;
  sizes?: string;
  priority?: boolean;
  /** Rellena el contenedor padre (que debe tener `position: relative` y tamaño). */
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
  /** Imagen puramente decorativa: se oculta a lectores de pantalla. */
  decorative?: boolean;
}

/**
 * Imagen del CMS conectada a `next/image`:
 * - Sanity: URL del CDN con `@sanity/image-url` (`auto=format`), optimizada
 *   después por Next.js a AVIF/WebP.
 * - Mock local: ruta de `/public`.
 * Respeta el hotspot definido en el Studio y usa LQIP como placeholder.
 */
export function SanityImage({
  image,
  sizes,
  priority = false,
  fill = false,
  width,
  height,
  className,
  decorative = false,
}: SanityImageProps) {
  const src = resolveImageSrc(image);
  if (!src) return null;

  const alt = decorative ? "" : image.alt;
  const objectPosition = image.hotspot
    ? `${(image.hotspot.x * 100).toFixed(1)}% ${(image.hotspot.y * 100).toFixed(1)}%`
    : undefined;

  const shared = {
    src,
    sizes,
    priority,
    className: cn(className),
    style: objectPosition ? { objectPosition } : undefined,
    ...(image.lqip
      ? { placeholder: "blur" as const, blurDataURL: image.lqip }
      : {}),
  };

  if (fill) {
    return <Image {...shared} alt={alt} fill />;
  }

  return (
    <Image
      {...shared}
      alt={alt}
      width={width ?? image.width ?? 1200}
      height={height ?? image.height ?? 675}
    />
  );
}
