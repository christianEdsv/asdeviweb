import type { Metadata } from "next";
import { Calendar, Newspaper } from "lucide-react";
import { EmptyState } from "@/components/common/EmptyState";
import { Reveal } from "@/components/common/Reveal";
import { SectionHeading } from "@/components/common/SectionHeading";
import { EventCard } from "@/components/events/EventCard";
import { Hero } from "@/components/home/Hero";
import { MembersCarousel } from "@/components/home/MembersCarousel";
import { MissionSummary } from "@/components/home/MissionSummary";
import { PostCard } from "@/components/news/PostCard";
import { JsonLd } from "@/components/seo/JsonLd";
import { siteConfig } from "@/config/site";
import {
  getEvents,
  getLatestMembers,
  getLatestPosts,
  getMembers,
  getSiteSettings,
  splitEvents,
} from "@/data";
import { organizationJsonLd, websiteJsonLd } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: `${siteConfig.name} · ${siteConfig.legalName}`,
    description: siteConfig.description,
    path: "/",
    absoluteTitle: true,
  });
}

export default async function HomePage() {
  const [settings, allMembers, latestMembers, allEvents, latestPosts] =
    await Promise.all([
      getSiteSettings(),
      getMembers(),
      getLatestMembers(8),
      getEvents(),
      getLatestPosts(3),
    ]);

  const { upcoming } = splitEvents(allEvents);
  const upcomingSlice = upcoming.slice(0, 3);

  return (
    <>
      <JsonLd data={[organizationJsonLd(settings), websiteJsonLd()]} />

      <Hero
        memberCount={allMembers.length}
        upcomingCount={upcoming.length}
        featuredMembers={allMembers}
      />

      <MissionSummary missionSummary={settings.about.missionSummary} />

      {/* Últimos miembros integrados */}
      <section
        aria-labelledby="home-members-heading"
        className="border-b border-border py-20 sm:py-28"
      >
        <div className="container-page">
          <SectionHeading
            id="home-members-heading"
            index="02"
            eyebrow="DIRECTORIO OFICIAL DE LA ASOCIACIÓN"
            title="Estudios y perfiles recién integrados"
            description="Explora los estudios indie, desarrolladores independientes y aliados académicos de la asociación."
            action={{
              label: `Ver los ${allMembers.length} miembros`,
              href: "/miembros",
            }}
          />
          <Reveal>
            <MembersCarousel members={latestMembers} />
          </Reveal>
        </div>
      </section>

      {/* Próximos eventos */}
      <section
        aria-labelledby="home-events-heading"
        className="border-b border-border bg-surface/40 py-20 sm:py-28"
      >
        <div className="container-page">
          <SectionHeading
            id="home-events-heading"
            index="03"
            eyebrow="CALENDARIO"
            title="Próximos eventos en agenda"
            description="Showcases, game jams, talleres técnicos y encuentros con la comunidad."
            action={{ label: "Agenda completa", href: "/eventos" }}
          />
          {upcomingSlice.length === 0 ? (
            <EmptyState
              icon={Calendar}
              title="No hay eventos próximos programados"
              description="Pronto anunciaremos nuevas fechas. Mientras tanto puedes revisar el archivo de eventos pasados."
            />
          ) : (
            <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {upcomingSlice.map((event, idx) => (
                <li key={event._id}>
                  <Reveal delay={idx * 0.08} className="h-full">
                    <EventCard event={event} />
                  </Reveal>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* Últimas noticias */}
      <section aria-labelledby="home-news-heading" className="py-20 sm:py-28">
        <div className="container-page">
          <SectionHeading
            id="home-news-heading"
            index="04"
            eyebrow="SALA DE PRENSA"
            title="Últimas noticias y lanzamientos"
            description="Lanzamientos de miembros, comunicados oficiales, entrevistas y reportes del sector."
            action={{ label: "Ir a Noticias", href: "/noticias" }}
          />
          {latestPosts.length === 0 ? (
            <EmptyState
              icon={Newspaper}
              title="Aún no hay noticias publicadas"
            />
          ) : (
            <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {latestPosts.map((post, idx) => (
                <li key={post._id}>
                  <Reveal delay={idx * 0.08} className="h-full">
                    <PostCard post={post} />
                  </Reveal>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </>
  );
}
