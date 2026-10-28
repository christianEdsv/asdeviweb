import Link from "next/link";
import { ArrowUpRight, Calendar, Terminal, Users } from "lucide-react";
import { Reveal } from "@/components/common/Reveal";
import { siteConfig } from "@/config/site";
import { SPECIALTIES } from "@/lib/taxonomies";
import type { Member } from "@/types/content";
import { HeroShowcaseDeck } from "./HeroShowcaseDeck";

interface HeroProps {
  memberCount: number;
  upcomingCount: number;
  featuredMembers: Member[];
}

const tickerItems = [
  ...SPECIALTIES,
  "Estudios Indie",
  "Desarrolladores Independientes",
  "Academia & Investigación",
  "Game Jams",
  "Showcases",
];

export function Hero({
  memberCount,
  upcomingCount,
  featuredMembers,
}: HeroProps) {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative isolate overflow-hidden border-b border-border"
    >
      <div className="bg-hero-glow absolute inset-0 -z-20" aria-hidden />
      <div className="bg-grid absolute inset-0 -z-10 opacity-90" aria-hidden />

      <div className="container-page pt-12 pb-16 sm:pt-18 sm:pb-22">
        {/* Barra de telemetría superior */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-border/70 pb-4">
          <div className="inline-flex items-center gap-2.5">
            <span className="pulse-dot size-2.5 rounded-full bg-gold ring-4 ring-mikado/35" />
            <span className="tech-tag font-semibold text-primary">
              {siteConfig.legalName}
            </span>
          </div>
          <div className="tech-tag flex items-center gap-4 text-muted-foreground">
            <span className="hidden sm:inline">
              EST. {siteConfig.foundingYear}
            </span>
          </div>
        </div>

        {/* Composición asimétrica: titular editorial + cartucho interactivo */}
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
          <Reveal className="lg:col-span-7">
            <h1
              id="hero-heading"
              className="text-4xl leading-[0.98] font-extrabold tracking-tight text-foreground sm:text-6xl xl:text-7xl"
            >
              IMPULSAMOS EL FUTURO DEL{" "}
              <span className="inline-block rounded-lg border-2 border-primary bg-gold px-3 py-0.5 text-gold-foreground shadow-sm">
                VIDEOJUEGO
              </span>{" "}
              <span className="text-stroke block sm:inline">EN EL SALVADOR</span>{" "}
            </h1>

            <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Conectamos estudios indie, creadores independientes y universidades
              en un mismo frente creativo: visibilidad para tus lanzamientos,
              formación abierta, showcases y representación internacional.
            </p>

            {/* Botones de acción con micro-interacción */}
            <div className="mt-8 flex flex-wrap items-center gap-3.5">
              <Link
                href="/miembros"
                className="group inline-flex items-center gap-3 rounded-full bg-primary px-6 py-3.5 text-xs font-extrabold tracking-wider text-primary-foreground uppercase shadow-glow transition-all duration-200 hover:scale-[1.02] hover:bg-foreground hover:text-background"
              >
                <Users className="size-4" aria-hidden />
                Explorar miembros ({memberCount})
                <ArrowUpRight
                  className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  aria-hidden
                />
              </Link>
              <Link
                href="/eventos"
                className="group inline-flex items-center gap-2.5 rounded-full border border-border bg-surface/90 px-6 py-3.5 text-xs font-bold tracking-wider text-foreground uppercase transition-colors hover:border-primary hover:text-primary"
              >
                <Calendar className="size-4 text-accent" aria-hidden />
                Agenda ({upcomingCount} próximos)
              </Link>
            </div>

            {/* Métricas tipo HUD */}
            <dl className="mt-12 grid grid-cols-3 gap-3 border-t border-border/80 pt-8">
              <div className="border-l-2 border-primary pl-3.5">
                <dt className="tech-tag text-muted-foreground">MIEMBROS</dt>
                <dd className="mt-1 font-display text-3xl font-extrabold text-foreground sm:text-4xl">
                  {String(memberCount).padStart(2, "0")}
                </dd>
              </div>
              <div className="border-l-2 border-gold pl-3.5">
                <dt className="tech-tag text-muted-foreground">EN AGENDA</dt>
                <dd className="mt-1 font-display text-3xl font-extrabold text-foreground sm:text-4xl">
                  {String(upcomingCount).padStart(2, "0")}
                </dd>
              </div>
            </dl>
          </Reveal>

          <Reveal delay={0.12} className="lg:col-span-5">
            <HeroShowcaseDeck members={featuredMembers} />
          </Reveal>
        </div>
      </div>

      {/* Cinta marquee infinita de especialidades */}
      <div
        aria-hidden
        className="overflow-hidden border-t border-border bg-surface/90 py-3"
      >
        <div className="animate-marquee flex items-center gap-8">
          {[...tickerItems, ...tickerItems].map((item, idx) => (
            <span
              key={`${item}-${idx}`}
              className="tech-tag inline-flex items-center gap-3 text-muted-foreground"
            >
              <Terminal className="size-3.5 text-primary" />
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
