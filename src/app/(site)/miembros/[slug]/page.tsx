import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, Gamepad2 } from "lucide-react";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { SanityImage } from "@/components/common/SanityImage";
import { SectionHeading } from "@/components/common/SectionHeading";
import { MemberCard } from "@/components/members/MemberCard";
import { MemberLinks } from "@/components/members/MemberLinks";
import { JsonLd } from "@/components/seo/JsonLd";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getMemberBySlug, getMemberSlugs, getMembers } from "@/data";
import { formatDate } from "@/lib/dates";
import { memberJsonLd } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";
import { MEMBER_TYPES, getTitle } from "@/lib/taxonomies";

export const revalidate = 3600;

export async function generateStaticParams() {
  const entries = await getMemberSlugs();
  return entries.map(({ slug }) => ({ slug }));
}

interface MemberDetailProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: MemberDetailProps): Promise<Metadata> {
  const { slug } = await params;
  const member = await getMemberBySlug(slug);
  if (!member) {
    return buildMetadata({ title: "Miembro no encontrado", path: `/miembros/${slug}` });
  }
  return buildMetadata({
    title: member.name,
    description: member.bio,
    path: `/miembros/${member.slug}`,
    seo: member.seo,
    image: member.featuredGame?.image ?? member.logo,
    type: "profile",
  });
}

export default async function MemberDetailPage({ params }: MemberDetailProps) {
  const { slug } = await params;
  const [member, allMembers] = await Promise.all([
    getMemberBySlug(slug),
    getMembers(),
  ]);
  if (!member) notFound();

  const typeLabel = getTitle(MEMBER_TYPES, member.memberType);
  const related = allMembers
    .filter(
      (item) =>
        item.slug !== member.slug &&
        (item.memberType === member.memberType ||
          item.specialties.some((spec) => member.specialties.includes(spec))),
    )
    .slice(0, 3);

  return (
    <>
      <JsonLd data={memberJsonLd(member)} />

      <article className="pb-20">
        {/* Cabecera del perfil */}
        <header className="relative isolate overflow-hidden border-b border-border/60">
          <div className="bg-hero-glow absolute inset-0 -z-20" aria-hidden />
          <div className="bg-grid absolute inset-0 -z-10 opacity-70" aria-hidden />

          <div className="container-page py-12 sm:py-16">
            <Breadcrumbs
              items={[
                { name: "Miembros", path: "/miembros" },
                { name: member.name, path: `/miembros/${member.slug}` },
              ]}
            />

            <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
              <div className="relative size-24 shrink-0 overflow-hidden rounded-2xl border border-border bg-surface shadow-lg sm:size-28">
                {member.logo ? (
                  <SanityImage
                    image={member.logo}
                    width={224}
                    height={224}
                    sizes="112px"
                    priority
                    className="size-full object-cover"
                  />
                ) : (
                  <span className="flex size-full items-center justify-center font-display text-3xl font-bold text-primary-soft">
                    {member.name.slice(0, 2).toUpperCase()}
                  </span>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge className="bg-primary/15 text-primary-soft">
                    {typeLabel}
                  </Badge>
                  {member.joinedAt ? (
                    <span className="text-xs text-muted-foreground">
                      Miembro desde {formatDate(member.joinedAt)}
                    </span>
                  ) : null}
                </div>
                <h1 className="mt-2 text-3xl font-bold text-foreground sm:text-5xl">
                  {member.name}
                </h1>
              </div>
            </div>
          </div>
        </header>

        <div className="container-page mt-12 grid gap-10 lg:grid-cols-12">
          {/* Columna principal */}
          <div className="space-y-10 lg:col-span-8">
            <section aria-labelledby="bio-heading">
              <h2
                id="bio-heading"
                className="text-xs font-semibold uppercase tracking-[0.18em] text-accent"
              >
                Sobre el perfil
              </h2>
              <p className="mt-3 text-lg leading-relaxed text-foreground/90">
                {member.bio}
              </p>
            </section>

            {member.featuredGame ? (
              <section
                aria-labelledby="featured-game-heading"
                className="overflow-hidden rounded-2xl border border-border bg-surface"
              >
                {member.featuredGame.image ? (
                  <div className="relative aspect-[16/9] w-full bg-background">
                    <SanityImage
                      image={member.featuredGame.image}
                      fill
                      sizes="(min-width: 1024px) 720px, 100vw"
                      className="object-cover"
                    />
                  </div>
                ) : null}
                <div className="p-6 sm:p-8">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-accent">
                    <Gamepad2 className="size-4" aria-hidden />
                    <span className="font-semibold uppercase tracking-wider">
                      Juego destacado
                    </span>
                    {member.featuredGame.platform ? (
                      <Badge variant="outline" className="ml-auto">
                        {member.featuredGame.platform}
                      </Badge>
                    ) : null}
                  </div>
                  <h2
                    id="featured-game-heading"
                    className="mt-2 text-2xl font-bold text-foreground"
                  >
                    {member.featuredGame.title}
                  </h2>
                  {member.featuredGame.description ? (
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {member.featuredGame.description}
                    </p>
                  ) : null}
                  {member.featuredGame.url ? (
                    <div className="mt-5">
                      <Button asChild size="sm">
                        <a
                          href={member.featuredGame.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Ver página del juego
                          <ExternalLink className="size-3.5" aria-hidden />
                        </a>
                      </Button>
                    </div>
                  ) : null}
                </div>
              </section>
            ) : null}
          </div>

          {/* Ficha lateral */}
          <aside className="space-y-6 lg:col-span-4">
            {member.specialties.length > 0 ? (
              <div className="rounded-2xl border border-border bg-surface p-6">
                <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-foreground">
                  Especialidades
                </h2>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {member.specialties.map((specialty) => (
                    <li key={specialty}>
                      <Badge
                        variant="outline"
                        className="border-border bg-background/60 text-xs text-foreground"
                      >
                        {specialty}
                      </Badge>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {member.links.length > 0 ? (
              <div className="rounded-2xl border border-border bg-surface p-6">
                <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-foreground">
                  Enlaces oficiales
                </h2>
                <MemberLinks links={member.links} />
              </div>
            ) : null}

            <Link
              href="/miembros"
              className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary-soft"
            >
              <ArrowLeft className="size-4" aria-hidden />
              Volver al directorio
            </Link>
          </aside>
        </div>

        {related.length > 0 ? (
          <section
            aria-labelledby="related-members-heading"
            className="container-page mt-20 border-t border-border/60 pt-14"
          >
            <SectionHeading
              id="related-members-heading"
              eyebrow="Comunidad"
              title="Otros miembros afines"
              action={{ label: "Ver directorio completo", href: "/miembros" }}
            />
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <li key={item._id}>
                  <MemberCard member={item} />
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </article>
    </>
  );
}
