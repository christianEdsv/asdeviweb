import type { Metadata } from "next";
import { Calendar } from "lucide-react";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { EmptyState } from "@/components/common/EmptyState";
import { PageHeader } from "@/components/common/PageHeader";
import { SectionHeading } from "@/components/common/SectionHeading";
import { EventCard } from "@/components/events/EventCard";
import { getEvents, splitEvents } from "@/data";
import { buildMetadata } from "@/lib/seo";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: "Eventos",
    description:
      "Agenda de showcases, game jams, charlas, talleres y encuentros organizados por la asociación.",
    path: "/eventos",
  });
}

export default async function EventsPage() {
  const allEvents = await getEvents();
  const { upcoming, past } = splitEvents(allEvents);

  return (
    <>
      <PageHeader
        eyebrow="Agenda comunitaria"
        title="Eventos de la asociación"
        description="Showcases para probar juegos locales, game jams abiertas, talleres técnicos y noches de networking."
      >
        <Breadcrumbs items={[{ name: "Eventos", path: "/eventos" }]} />
      </PageHeader>

      <div className="container-page space-y-20 py-14 sm:py-20">
        {/* Próximos eventos */}
        <section aria-labelledby="upcoming-events-heading">
          <SectionHeading
            id="upcoming-events-heading"
            eyebrow="En agenda"
            title="Próximos eventos"
            description="Inscríbete y participa en las siguientes actividades."
          />
          {upcoming.length === 0 ? (
            <EmptyState
              icon={Calendar}
              title="Por ahora no hay eventos próximos"
              description="Anunciaremos las nuevas fechas en esta sección y en nuestro Discord."
            />
          ) : (
            <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {upcoming.map((event) => (
                <li key={event._id}>
                  <EventCard event={event} />
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Eventos pasados */}
        {past.length > 0 ? (
          <section
            aria-labelledby="past-events-heading"
            className="border-t border-border/60 pt-16"
          >
            <SectionHeading
              id="past-events-heading"
              eyebrow="Archivo"
              title="Eventos pasados"
              description="Registro histórico de actividades realizadas por la asociación."
            />
            <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {past.map((event) => (
                <li key={event._id}>
                  <EventCard event={event} />
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </div>
    </>
  );
}
