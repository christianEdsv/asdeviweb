import Link from "next/link";
import { ArrowUpRight, Compass, Cpu, Layers, Radio } from "lucide-react";
import { Reveal } from "@/components/common/Reveal";
import { SpotlightCard } from "@/components/common/SpotlightCard";

interface MissionSummaryProps {
  missionSummary: string;
}

const pillars = [
  {
    code: "MOD // 01",
    Icon: Radio,
    accent: "text-primary",
    title: "Alcance y visibilidad",
    description:
      "Llevamos los juegos y perfiles locales ante prensa, festivales, publishers y tiendas digitales.",
  },
  {
    code: "MOD // 02",
    Icon: Cpu,
    accent: "text-accent",
    title: "Laboratorio y oficio",
    description:
      "Talleres, jams y espacios de co-desarrollo para fortalecer la industria local.",
  },
  {
    code: "MOD // 03",
    Icon: Layers,
    accent: "text-cyan",
    title: "Voz gremial y alianzas",
    description:
      "Vinculación con universidades, centros culturales y programas públicos de fomento creativo.",
  },
] as const;

export function MissionSummary({ missionSummary }: MissionSummaryProps) {
  return (
    <section
      aria-labelledby="mission-heading"
      className="border-b border-border py-20 sm:py-28"
    >
      <div className="container-page">
        {/* Bento Grid asimétrico */}
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Bloque principal de manifiesto */}
          <Reveal className="lg:col-span-7">
            <SpotlightCard
              as="div"
              className="flex h-full flex-col justify-between rounded-2xl p-8 sm:p-10"
            >
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1">
                  <Compass className="size-3.5 text-primary" aria-hidden />
                  <span className="tech-tag font-semibold text-primary">
                    01 // MANIFIESTO DE LA ASOCIACIÓN
                  </span>
                </div>
                <h2
                  id="mission-heading"
                  className="mt-5 text-3xl leading-[1.06] font-extrabold text-foreground sm:text-5xl"
                >
                  Hacer videojuegos no debería ser una aventura en solitario.
                </h2>
                <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                  {missionSummary}
                </p>
              </div>

              <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-border/80 pt-6">
                <span className="tech-tag text-muted-foreground">
                  GOBERNANZA ABIERTA · SIN FINES DE LUCRO
                </span>
                <Link
                  href="/sobre-nosotros"
                  className="group inline-flex items-center gap-2 text-xs font-extrabold tracking-wider text-primary uppercase hover:text-foreground"
                >
                  Conocer historia, junta y FAQ
                  <ArrowUpRight
                    className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    aria-hidden
                  />
                </Link>
              </div>
            </SpotlightCard>
          </Reveal>

          {/* Tarjeta lateral de impacto visual */}
          <Reveal delay={0.08} className="lg:col-span-5">
            <div className="bg-dots relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-primary/40 bg-surface p-8 sm:p-10">
              <div
                aria-hidden
                className="pointer-events-none absolute -top-16 -right-16 size-56 rounded-full bg-primary/20 blur-3xl"
              />
              <div className="flex items-center justify-between">
                <span className="tech-tag rounded bg-primary px-2.5 py-1 font-bold text-primary-foreground">
                  ECOSISTEMA CREATIVO
                </span>
                <span className="tech-tag text-muted-foreground">
                  [3 PERFILES]
                </span>
              </div>

              <div className="my-8 space-y-4">
                <div className="rounded-xl border border-border bg-background/85 p-4 backdrop-blur-sm">
                  <p className="tech-tag text-primary">01 · ESTUDIOS INDIE</p>
                  <p className="mt-1 text-sm font-medium text-foreground">
                    Equipos con catálogo propio, co-desarrollo y propiedad
                    intelectual original.
                  </p>
                </div>
                <div className="rounded-xl border border-border bg-background/85 p-4 backdrop-blur-sm">
                  <p className="tech-tag text-accent">
                    02 · DESARROLLADORES INDEPENDIENTES
                  </p>
                  <p className="mt-1 text-sm font-medium text-foreground">
                    Solo-devs, especialistas freelance y creadores de
                    herramientas.
                  </p>
                </div>
                <div className="rounded-xl border border-border bg-background/85 p-4 backdrop-blur-sm">
                  <p className="tech-tag text-cyan">03 · ACADÉMICOS Y ALIADOS</p>
                  <p className="mt-1 text-sm font-medium text-foreground">
                    Universidades e investigadores del sector.
                  </p>
                </div>
              </div>

              <Link
                href="/sobre-nosotros#unirse"
                className="inline-flex items-center justify-between rounded-xl border border-border bg-background px-4 py-3 text-xs font-bold tracking-wider text-foreground uppercase transition-colors hover:border-primary hover:text-primary"
              >
                <span>¿Cómo sumarse en próximas convocatorias?</span>
                <ArrowUpRight className="size-4" aria-hidden />
              </Link>
            </div>
          </Reveal>
        </div>

        {/* Tres módulos operativos debajo */}
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {pillars.map(({ code, Icon, accent, title, description }, index) => (
            <Reveal key={title} delay={index * 0.08}>
              <SpotlightCard
                as="div"
                className="flex h-full flex-col justify-between rounded-2xl p-6 sm:p-7"
              >
                <div className="flex items-center justify-between">
                  <span className="tech-tag text-muted-foreground">{code}</span>
                  <span
                    className={`flex size-10 items-center justify-center rounded-xl border border-border bg-background ${accent}`}
                  >
                    <Icon className="size-5" aria-hidden />
                  </span>
                </div>
                <div className="mt-8">
                  <h3 className="text-xl font-bold text-foreground">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {description}
                  </p>
                </div>
              </SpotlightCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
