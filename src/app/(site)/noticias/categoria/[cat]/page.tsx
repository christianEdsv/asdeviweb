import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NewsFeedView } from "@/components/news/NewsFeedView";
import { getPostsPage } from "@/data";
import { buildMetadata } from "@/lib/seo";
import {
  POST_CATEGORIES,
  getTitle,
  isValidValue,
  type PostCategory,
} from "@/lib/taxonomies";

export const revalidate = 3600;

export function generateStaticParams() {
  return POST_CATEGORIES.map(({ value }) => ({ cat: value }));
}

interface CategoryPageProps {
  params: Promise<{ cat: string }>;
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { cat } = await params;
  const title = getTitle(POST_CATEGORIES, cat);
  return buildMetadata({
    title: `Noticias · ${title}`,
    description: `Publicaciones en la categoría ${title}.`,
    path: `/noticias/categoria/${cat}`,
  });
}

export default async function NewsCategoryPage({ params }: CategoryPageProps) {
  const { cat } = await params;
  if (!isValidValue(POST_CATEGORIES, cat)) notFound();
  const category = cat as PostCategory;

  const data = await getPostsPage({ page: 1, category });
  return <NewsFeedView data={data} category={category} />;
}
