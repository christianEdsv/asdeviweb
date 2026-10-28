/**
 * Utilidades para URLs de YouTube. Se usa tanto en el Studio (validación)
 * como en el frontend (embed seguro con youtube-nocookie.com).
 */

const YOUTUBE_ID = /^[A-Za-z0-9_-]{11}$/;

/** Extrae el ID de un video de YouTube desde distintos formatos de URL. */
export function extractYouTubeId(rawUrl: string): string | null {
  let url: URL;
  try {
    url = new URL(rawUrl);
  } catch {
    return null;
  }

  const host = url.hostname.replace(/^www\.|^m\./, "");
  let id: string | null = null;

  if (host === "youtu.be") {
    id = url.pathname.slice(1).split("/")[0] ?? null;
  } else if (host === "youtube.com" || host === "youtube-nocookie.com") {
    if (url.pathname === "/watch") {
      id = url.searchParams.get("v");
    } else {
      const match = url.pathname.match(/^\/(?:embed|shorts|live|v)\/([^/?#]+)/);
      id = match?.[1] ?? null;
    }
  }

  return id && YOUTUBE_ID.test(id) ? id : null;
}

/** URL de embed sin cookies de seguimiento. */
export function getYouTubeEmbedUrl(id: string): string {
  return `https://www.youtube-nocookie.com/embed/${id}?rel=0`;
}
