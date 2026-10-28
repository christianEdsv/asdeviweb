import { Newspaper } from "lucide-react";
import { Breadcrumbs, type Crumb } from "@/components/common/Breadcrumbs";
import { EmptyState } from "@/components/common/EmptyState";
import { PageHeader } from "@/components/common/PageHeader";
import { CategoryFilter } from "@/components/news/CategoryFilter";
import { Pagination } from "@/components/news/Pagination";
import { PostCard } from "@/components/news/PostCard";
import { POST_CATEGORIES, getTitle, type PostCategory } from "@/lib/taxonomies";
import type { PostPage } from "@/types/content";

interface NewsFeedViewProps {
  data: PostPage;
  category?: PostCategory;
}

export function NewsFeedView({ data, category }: NewsFeedViewProps) {
  const categoryTitle = category
    ? getTitle(POST_CATEGORIES, category)
    : undefined;
  const basePath = category
    ? `/noticias/categoria/${category}`
    : "/noticias";

  const crumbs: Crumb[] = [{ name: "Noticias", path: "/noticias" }];
  if (categoryTitle && category) {
    crumbs.push({ name: categoryTitle, path: basePath });
  }
  if (data.page > 1) {
    crumbs.push({
      name: `Página ${data.page}`,
      path: `${basePath}/pagina/${data.page}`,
    });
  }

  return (
    <>
      <PageHeader
        eyebrow="Sala de prensa"
        title={categoryTitle ? `Noticias · ${categoryTitle}` : "Noticias y comunicados"}
        description="Lanzamientos de nuestros miembros, entrevistas, reportes de la industria local y anuncios oficiales de la asociación."
      >
        <Breadcrumbs items={crumbs} />
      </PageHeader>

      <section className="py-14 sm:py-20" aria-label="Listado de noticias">
        <div className="container-page">
          <CategoryFilter active={category} />

          {data.items.length === 0 ? (
            <EmptyState
              icon={Newspaper}
              title="No hay noticias en esta categoría"
              description="Selecciona otra categoría para explorar más publicaciones."
            />
          ) : (
            <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {data.items.map((post) => (
                <li key={post._id}>
                  <PostCard post={post} />
                </li>
              ))}
            </ul>
          )}

          <Pagination
            page={data.page}
            totalPages={data.totalPages}
            basePath={basePath}
          />
        </div>
      </section>
    </>
  );
}
