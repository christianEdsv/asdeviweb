import { extractYouTubeId, getYouTubeEmbedUrl } from "@/lib/youtube";

interface YouTubeEmbedProps {
  url: string;
  title?: string;
}

/**
 * Reproduce un video de YouTube usando `youtube-nocookie.com` (coincide con
 * `frame-src` de la CSP configurada en `next.config.mjs`).
 */
export function YouTubeEmbed({ url, title = "Video de YouTube" }: YouTubeEmbedProps) {
  const id = extractYouTubeId(url);
  if (!id) return null;

  return (
    <figure className="my-8">
      <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-border bg-surface shadow-lg">
        <iframe
          src={getYouTubeEmbedUrl(id)}
          title={title}
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="absolute inset-0 size-full border-0"
        />
      </div>
      {title ? (
        <figcaption className="mt-2 text-center text-xs text-muted-foreground">
          {title}
        </figcaption>
      ) : null}
    </figure>
  );
}
