import type { Metadata } from "next";
import { Mail, Sparkles } from "lucide-react";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { PageHeader } from "@/components/common/PageHeader";
import { Reveal } from "@/components/common/Reveal";
import { SanityImage } from "@/components/common/SanityImage";
import { SectionHeading } from "@/components/common/SectionHeading";
import { DiscordIcon } from "@/components/icons/brands";
import { MemberLinks } from "@/components/members/MemberLinks";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getSiteSettings } from "@/data";
import { faqJsonLd, organizationJsonLd } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return buildMetadata({
    title: "Sobre Nosotros",
    description: settings.about.intro,
    path: "/sobre-nosotros",
    seo: settings.seo,
  });
}

export default async function AboutPage() {
  const settings = await getSiteSettings();
  const { about, email, socials } = settings;

  return (
    <>
      <JsonLd data={[organizationJsonLd(settings), faqJsonLd(about.faqs)]} />

      <PageHeader
        eyebrow="Sobre la asociación"
        title="Construimos comunidad e industria alrededor del videojuego"
        description={about.intro}
      >
        <Breadcrumbs items={[{ name: "Sobre Nosotros", path: "/sobre-nosotros" }]} />
      </PageHeader>

      {/* Misión y visión */}
      <section
        aria-labelledby="mision-vision-heading"
        className="border-b border-border/60 py-16 sm:py-24"
      >
        <div className="container-page">
          <h2 id="mision-vision-heading" className="sr-only">
            Misión y visión
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            <Reveal>
              <div className="h-full rounded-2xl border border-border bg-surface p-8">
                <Badge className="bg-primary/15 text-primary-soft">Misión</Badge>
                <h3 className="mt-4 text-2xl font-bold text-foreground">
                  Por qué existimos
                </h3>
                <p className="mt-3 text-base leading-relaxed text-muted-foreground">
                  {about.mission}
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.08}>
              <div className="h-full rounded-2xl border border-border bg-surface p-8">
                <Badge className="bg-accent/15 text-accent">Visión</Badge>
                <h3 className="mt-4 text-2xl font-bold text-foreground">
                  Hacia dónde vamos
                </h3>
                <p className="mt-3 text-base leading-relaxed text-muted-foreground">
                  {about.vision}
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Objetivos del gremio */}
      <section
        aria-labelledby="objectives-heading"
        className="border-b border-border/60 bg-surface/30 py-16 sm:py-24"
      >
        <div className="container-page">
          <SectionHeading
            id="objectives-heading"
            eyebrow="Objetivos"
            title="Líneas de trabajo del gremio"
            description="Cinco frentes concretos para impulsar a quienes desarrollan videojuegos."
          />
          <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {about.objectives.map((objective, idx) => (
              <li
                key={objective.title}
                className="flex flex-col rounded-2xl border border-border bg-surface p-6"
              >
                <span className="font-display text-xs font-bold tracking-widest text-accent">
                  0{idx + 1}
                </span>
                <h3 className="mt-2 text-lg font-bold text-foreground">
                  {objective.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {objective.description}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Historia */}
      <section
        aria-labelledby="history-heading"
        className="border-b border-border/60 py-16 sm:py-24"
      >
        <div className="container-page">
          <SectionHeading
            id="history-heading"
            eyebrow="Trayectoria"
            title="Nuestra historia"
            description="De reuniones informales entre desarrolladores a una asociación constituida."
          />
          <ol className="relative ml-3 border-l border-border pl-6 sm:ml-4 sm:pl-8">
            {about.history.map((entry, idx) => (
              <li key={`${entry.year}-${entry.title}`} className="mb-10 last:mb-0">
                <span
                  aria-hidden
                  className="absolute -left-2 flex size-4 items-center justify-center rounded-full border-2 border-primary bg-background"
                />
                <span className="inline-block rounded-md bg-primary/15 px-2.5 py-0.5 font-display text-xs font-bold text-primary-soft">
                  {entry.year}
                </span>
                <h3 className="mt-2 text-xl font-bold text-foreground">
                  {entry.title}
                </h3>
                <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                  {entry.description}
                </p>
                {idx === about.history.length - 1 ? null : <span className="sr-only">—</span>}
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Junta directiva */}
      <section
        aria-labelledby="board-heading"
        className="border-b border-border/60 bg-surface/30 py-16 sm:py-24"
      >
        <div className="container-page">
          <SectionHeading
            id="board-heading"
            eyebrow="Gobernanza"
            title="Junta directiva y equipo organizador"
            description="Representantes elegidos por la asamblea de miembros para coordinar el trabajo de la asociación."
          />
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {about.board.map((person) => (
              <li
                key={person.name}
                className="flex flex-col rounded-2xl border border-border bg-surface p-6"
              >
                <div className="relative size-16 overflow-hidden rounded-2xl border border-border bg-background">
                  {person.photo ? (
                    <SanityImage
                      image={person.photo}
                      width={128}
                      height={128}
                      sizes="64px"
                      className="size-full object-cover"
                    />
                  ) : (
                    <span className="flex size-full items-center justify-center font-display text-lg font-bold text-primary-soft">
                      {person.name.slice(0, 2).toUpperCase()}
                    </span>
                  )}
                </div>
                <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-accent">
                  {person.role}
                </p>
                <h3 className="mt-1 text-lg font-bold text-foreground">
                  {person.name}
                </h3>
                {person.bio ? (
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {person.bio}
                  </p>
                ) : null}
                {person.links && person.links.length > 0 ? (
                  <div className="mt-4 pt-3">
                    <MemberLinks links={person.links} />
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Convocatorias + FAQ */}
      <section
        id="unirse"
        aria-labelledby="faq-heading"
        className="scroll-mt-20 py-16 sm:py-24"
      >
        <div className="container-page">
          <div className="mb-14 rounded-2xl border border-primary/40 bg-gradient-to-br from-primary/15 via-surface to-surface p-8 sm:p-10">
            <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
              <div className="max-w-2xl">
                <p className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                  <Sparkles className="size-3.5" aria-hidden />
                  Convocatorias de ingreso
                </p>
                <h2 className="mt-2 text-2xl font-bold text-foreground sm:text-3xl">
                  ¿Quieres sumar tu estudio o perfil al directorio?
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {about.joinIntro}
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button asChild>
                  <a href={`mailto:${email}?subject=Consulta%20sobre%20convocatoria%20de%20miembros`}>
                    <Mail className="size-4" aria-hidden />
                    Escribir al comité
                  </a>
                </Button>
                {socials.discord ? (
                  <Button asChild variant="outline">
                    <a
                      href={socials.discord}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <DiscordIcon className="size-4" />
                      Entrar al Discord
                    </a>
                  </Button>
                ) : null}
              </div>
            </div>
          </div>

          <div id="faq" className="scroll-mt-20">
            <SectionHeading
              id="faq-heading"
              eyebrow="Preguntas frecuentes"
              title="Cómo funciona la membresía"
              description="Respuestas claras sobre requisitos, futuras convocatorias y participación en eventos."
            />
            <Accordion
              type="single"
              collapsible
              className="rounded-2xl border border-border bg-surface px-6"
            >
              {about.faqs.map((faq, idx) => (
                <AccordionItem key={faq.question} value={`faq-${idx}`}>
                  <AccordionTrigger className="py-5 text-base font-semibold text-foreground hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="pb-5 text-sm leading-relaxed text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>
    </>
  );
}
