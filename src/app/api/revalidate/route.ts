import { revalidatePath, revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";
import { CACHE_TAGS } from "@/sanity/lib/fetch";

export interface SanityWebhookPayload {
  _id?: string;
  _type?: string;
  slug?: {
    current?: string;
  } | string;
}

/**
 * Endpoint seguro de On-Demand Revalidation (ISR basado en Tags).
 *
 * En Next.js 16 se pasa `{ expire: 0 }` a `revalidateTag` para expirar el Data
 * Cache de inmediato (sin servir contenido stale en la primera visita) y se
 * combina con `revalidatePath` para purgar el Full Route Cache al instante.
 */
export async function POST(req: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET?.trim();
  if (!secret) {
    return NextResponse.json(
      { message: "Unauthorized: Missing SANITY_REVALIDATE_SECRET" },
      { status: 401 },
    );
  }

  const { isValidSignature, body } = await parseBody<SanityWebhookPayload>(
    req,
    secret,
  );

  if (!isValidSignature) {
    return NextResponse.json(
      { message: "Unauthorized: Invalid webhook signature" },
      { status: 401 },
    );
  }

  if (!body?._type) {
    return NextResponse.json(
      { message: "Bad Request: Missing _type in webhook payload" },
      { status: 400 },
    );
  }

  const docType = body._type;
  const slugCurrent =
    typeof body.slug === "string"
      ? body.slug.trim()
      : body.slug?.current?.trim();

  // Expira el Data Cache de inmediato ({ expire: 0 }) sin ventana stale-while-revalidate.
  revalidateTag(docType, { expire: 0 });

  // Si se edita un autor, invalida también las noticias donde aparece referenciado.
  if (docType === "author") {
    revalidateTag(CACHE_TAGS.post, { expire: 0 });
  }

  // Purga también el Full Route Cache de la portada y la sección correspondiente.
  revalidatePath("/");
  if (docType === CACHE_TAGS.member) {
    revalidatePath("/miembros");
    if (slugCurrent) revalidatePath(`/miembros/${slugCurrent}`);
  } else if (docType === CACHE_TAGS.event) {
    revalidatePath("/eventos");
    if (slugCurrent) revalidatePath(`/eventos/${slugCurrent}`);
  } else if (docType === CACHE_TAGS.post || docType === "author") {
    revalidatePath("/noticias");
    if (slugCurrent) revalidatePath(`/noticias/${slugCurrent}`);
  } else if (docType === CACHE_TAGS.siteSettings) {
    revalidatePath("/", "layout");
    revalidatePath("/sobre-nosotros");
  }

  // Si incluye slug, invalida el tag individual y regenera el sitemap.xml.
  if (slugCurrent) {
    revalidateTag(`${docType}:${slugCurrent}`, { expire: 0 });
    revalidatePath("/sitemap.xml");
  }

  return NextResponse.json(
    {
      revalidated: true,
      now: Date.now(),
      body,
    },
    { status: 200 },
  );
}
