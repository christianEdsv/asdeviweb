import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { NewsFeedView } from "@/components/news/NewsFeedView";
import { POSTS_PER_PAGE, getPostSlugs, getPostsPage } from "@/data";
import { buildMetadata } from "@/lib/seo";
import {
  POST_CATEGORIES,
  getTitle,
  isValidValue,
  type PostCategory,
} from "@/lib/taxonomies";

export const revalidate = 3600;

export async function generateStaticParams() {
  const entries = await getPostSlugs();
  const params: { cat: string; n: string }[] = [];
  for (const category of POST_CATEGORIES) {
    const count = entries.filter((item) => item.category === category.value).length;
    const totalPages = Math.ceil(count / POSTS_PER_PAGE);
    for (let page = 2; page <= totalPages; page += 1) {
      params.push({ cat: category.value, n: String(page) });
    }
  }
  return params;
}

interface CategoryPaginatedProps {
  params: Promise<{ cat: string; n: string }>;
}

export async function generateMetadata({
  params,
}: CategoryPaginatedProps): Promise<Metadata> {
  const { cat, n } = await params;
  const title = getTitle(POST_CATEGORIES, cat);
  return buildMetadata({
    title: `Noticias · ${title} · Página ${n}`,
    description: `Publicaciones en ${title} (página ${n}).`,
    path: `/noticias/categoria/${cat}/pagina/${n}`,
  });
}

export default async function NewsCategoryPaginatedPage({
  params,
}: CategoryPaginatedProps) {
  const { cat, n } = await params;
  if (!isValidValue(POST_CATEGORIES, cat)) notFound();
  const category = cat as PostCategory;

  const page = Number(n);
  if (!Number.isInteger(page) || page < 1) notFound();
  if (page === 1) redirect(`/noticias/categoria/${category}`);

  const data = await getPostsPage({ page, category });
  if (page > data.totalPages) notFound();

  return <NewsFeedView data={data} category={category} />;
}
