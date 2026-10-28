import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  Clock,
  ExternalLink,
  MapPin,
  Ticket,
  Video,
} from "lucide-react";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { SanityImage } from "@/components/common/SanityImage";
import { PortableTextRenderer } from "@/components/portable-text/PortableTextRenderer";
import { JsonLd } from "@/components/seo/JsonLd";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getEventBySlug, getEventSlugs } from "@/data";
import {
  formatDateRange,
  formatTime,
  getEventStatus,
} from "@/lib/dates";
import { portableTextToPlain } from "@/lib/jsonld";
import { eventJsonLd } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";
import { EVENT_MODES, EVENT_TYPES, getTitle } from "@/lib/taxonomies";

export const revalidate = 3600;

export async function generateStaticParams() {
  const entries = await getEventSlugs();
  return entries.map(({ slug }) => ({ slug }));
}

interface EventDetailProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: EventDetailProps): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) {
    return buildMetadata({ title: "Evento no encontrado", path: `/eventos/${slug}` });
  }
  return buildMetadata({
    title: event.title,
    description:
      event.summary || portableTextToPlain(event.description).slice(0, 160),
    path: `/eventos/${event.slug}`,
    seo: event.seo,
    image: event.coverImage,
  });
}

export default async function EventDetailPage({ params }: EventDetailProps) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) notFound();

  const status = getEventStatus(event.startDate, event.endDate);
  const typeLabel = getTitle(EVENT_TYPES, event.eventType);
  const modeLabel = getTitle(EVENT_MODES, event.mode);

  return (
    <>
      <JsonLd data={eventJsonLd(event)} />

      <article className="pb-20">
        <header className="relative isolate overflow-hidden border-b border-border/60">
          <div className="bg-hero-glow absolute inset-0 -z-20" aria-hidden />
          <div className="bg-grid absolute inset-0 -z-10 opacity-70" aria-hidden />

          <div className="container-page py-12 sm:py-16">
            <Breadcrumbs
              items={[
                { name: "Eventos", path: "/eventos" },
                { name: event.title, path: `/eventos/${event.slug}` },
              ]}
            />

            <div className="flex flex-wrap items-center gap-2">
              <Badge className="bg-primary/15 text-primary-soft">
                {typeLabel}
              </Badge>
              <Badge variant="outline">{modeLabel}</Badge>
              {status === "ongoing" ? (
                <Badge className="bg-accent text-accent-foreground">
                  En curso
                </Badge>
              ) : null}
              {status === "past" ? (
                <Badge variant="secondary">Evento finalizado</Badge>
              ) : null}
            </div>

            <h1 className="mt-4 max-w-3xl text-3xl font-bold text-foreground sm:text-5xl">
              {event.title}
            </h1>

            {event.summary ? (
              <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
                {event.summary}
              </p>
            ) : null}
          </div>
        </header>

        <div className="container-page mt-12 grid gap-10 lg:grid-cols-12">
          {/* Contenido */}
          <div className="space-y-8 lg:col-span-8">
            {event.coverImage ? (
              <div className="overflow-hidden rounded-2xl border border-border bg-surface">
                <SanityImage
                  image={event.coverImage}
                  priority
                  sizes="(min-width: 1024px) 768px, 100vw"
                  className="aspect-[16/9] w-full object-cover"
                />
              </div>
            ) : null}

            <PortableTextRenderer value={event.description} />
          </div>

          {/* Ficha del evento */}
          <aside className="space-y-6 lg:col-span-4">
            <div className="rounded-2xl border border-border bg-surface p-6">
              <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-foreground">
                Detalles del evento
              </h2>

              <dl className="mt-5 space-y-4 text-sm">
                <div className="flex gap-3">
                  <Calendar
                    className="mt-0.5 size-4 shrink-0 text-primary-soft"
                    aria-hidden
                  />
                  <div>
                    <dt className="text-xs text-muted-foreground">Fecha</dt>
                    <dd className="font-medium text-foreground">
                      <time dateTime={event.startDate}>
                        {formatDateRange(event.startDate, event.endDate)}
                      </time>
                    </dd>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Clock
                    className="mt-0.5 size-4 shrink-0 text-primary-soft"
                    aria-hidden
                  />
                  <div>
                    <dt className="text-xs text-muted-foreground">Horario</dt>
                    <dd className="font-medium text-foreground">
                      {formatTime(event.startDate)}
                      {event.endDate ? ` – ${formatTime(event.endDate)}` : ""}
                    </dd>
                  </div>
                </div>

                {event.locationName ? (
                  <div className="flex gap-3">
                    <MapPin
                      className="mt-0.5 size-4 shrink-0 text-accent"
                      aria-hidden
                    />
                    <div>
                      <dt className="text-xs text-muted-foreground">Lugar</dt>
                      <dd className="font-medium text-foreground">
                        {event.locationName}
                      </dd>
                      {event.address ? (
                        <dd className="text-xs text-muted-foreground">
                          {event.address}
                        </dd>
                      ) : null}
                    </div>
                  </div>
                ) : null}

                {event.streamUrl ? (
                  <div className="flex gap-3">
                    <Video
                      className="mt-0.5 size-4 shrink-0 text-accent"
                      aria-hidden
                    />
                    <div>
                      <dt className="text-xs text-muted-foreground">
                        Transmisión / sala online
                      </dt>
                      <dd>
                        <a
                          href={event.streamUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 font-medium text-primary-soft hover:text-accent"
                        >
                          Abrir enlace
                          <ExternalLink className="size-3.5" aria-hidden />
                        </a>
                      </dd>
                    </div>
                  </div>
                ) : null}
              </dl>

              {event.registrationUrl && status !== "past" ? (
                <Button asChild size="lg" className="mt-6 w-full shadow-glow">
                  <a
                    href={event.registrationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Ticket className="size-4" aria-hidden />
                    Inscribirme al evento
                    <ExternalLink className="size-3.5" aria-hidden />
                  </a>
                </Button>
              ) : null}
            </div>

            <Link
              href="/eventos"
              className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary-soft"
            >
              <ArrowLeft className="size-4" aria-hidden />
              Volver a Eventos
            </Link>
          </aside>
        </div>
      </article>
    </>
  );
}
