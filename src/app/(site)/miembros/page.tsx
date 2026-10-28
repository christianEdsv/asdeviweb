import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { PageHeader } from "@/components/common/PageHeader";
import { MembersDirectory } from "@/components/members/MembersDirectory";
import { JsonLd } from "@/components/seo/JsonLd";
import { getMembers } from "@/data";
import { memberListJsonLd } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: "Directorio de Miembros",
    description:
      "Catálogo de estudios indie, desarrolladores independientes y aliados académicos que integran la asociación.",
    path: "/miembros",
  });
}

export default async function MembersPage() {
  const members = await getMembers();

  return (
    <>
      <JsonLd data={memberListJsonLd(members)} />

      <PageHeader
        eyebrow="Directorio oficial"
        title="Miembros de la asociación"
        description="Filtra por tipo de miembro o especialidad y encuentra estudios, profesionales independientes e instituciones aliadas."
      >
        <Breadcrumbs items={[{ name: "Miembros", path: "/miembros" }]} />
      </PageHeader>

      <section className="py-14 sm:py-20" aria-label="Catálogo de miembros">
        <div className="container-page">
          <MembersDirectory members={members} />
        </div>
      </section>
    </>
  );
}
