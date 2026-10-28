import Link from "next/link";
import { ArrowUpRight, Calendar, MapPin, Video } from "lucide-react";
import { SanityImage } from "@/components/common/SanityImage";
import { SpotlightCard } from "@/components/common/SpotlightCard";
import {
  formatDateRange,
  formatTime,
  getDayLabel,
  getEventStatus,
  getMonthLabel,
} from "@/lib/dates";
import { portableTextToPlain } from "@/lib/jsonld";
import { EVENT_MODES, EVENT_TYPES, getTitle } from "@/lib/taxonomies";
import { cn, truncate } from "@/lib/utils";
import type { EventItem } from "@/types/content";

interface EventCardProps {
  event: EventItem;
}

export function EventCard({ event }: EventCardProps) {
  const status = getEventStatus(event.startDate, event.endDate);
  const isPast = status === "past";
  const typeLabel = getTitle(EVENT_TYPES, event.eventType);
  const modeLabel = getTitle(EVENT_MODES, event.mode);
  const summary =
    event.summary || truncate(portableTextToPlain(event.description), 160);

  return (
    <SpotlightCard
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-2xl",
        isPast && "opacity-80",
      )}
    >
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-background">
        {event.coverImage ? (
          <SanityImage
            image={event.coverImage}
            fill
            sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-108"
          />
        ) : null}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-surface via-surface/25 to-transparent"
        />

        {/* Bloque de fecha estilo entrada de festival */}
        <div
          aria-hidden
          className="absolute top-3 left-3 flex flex-col items-center rounded-xl border border-primary/50 bg-background/90 px-3 py-1.5 text-center backdrop-blur-md"
        >
          <span className="font-mono text-[10px] font-bold tracking-widest text-primary">
            {getMonthLabel(event.startDate)}
          </span>
          <span className="font-display text-xl leading-none font-extrabold text-foreground">
            {getDayLabel(event.startDate)}
          </span>
        </div>

        <div className="absolute top-3 right-3 flex flex-wrap gap-1.5">
          {status === "ongoing" ? (
            <span className="tech-tag rounded-md bg-accent px-2.5 py-1 font-bold text-accent-foreground">
              EN VIVO
            </span>
          ) : null}
          <span className="tech-tag rounded-md border border-border bg-background/90 px-2.5 py-1 font-bold text-foreground backdrop-blur-md">
            {typeLabel}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <Calendar className="size-3.5 text-primary" aria-hidden />
            <time dateTime={event.startDate}>
              {formatDateRange(event.startDate, event.endDate)} ·{" "}
              {formatTime(event.startDate)}
            </time>
          </span>
          <span className="inline-flex items-center gap-1">
            {event.mode === "online" ? (
              <Video className="size-3.5 text-cyan" aria-hidden />
            ) : (
              <MapPin className="size-3.5 text-accent" aria-hidden />
            )}
            {event.locationName
              ? `${modeLabel} · ${event.locationName}`
              : modeLabel}
          </span>
        </div>

        <h3 className="mt-3 text-xl leading-snug font-extrabold text-foreground transition-colors group-hover:text-primary">
          <Link
            href={`/eventos/${event.slug}`}
            className="after:absolute after:inset-0 focus-visible:outline-none"
          >
            {event.title}
          </Link>
        </h3>

        {summary ? (
          <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-muted-foreground">
            {summary}
          </p>
        ) : null}

        <div className="mt-5 flex items-center justify-between border-t border-border/80 pt-4">
          <span className="tech-tag font-bold text-foreground group-hover:text-primary">
            {isPast ? "ARCHIVO DEL EVENTO" : "DETALLES E INSCRIPCIÓN"}
          </span>
          <ArrowUpRight
            aria-hidden
            className="size-4 text-primary transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </div>
      </div>
    </SpotlightCard>
  );
}
