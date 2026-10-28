import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { NewsFeedView } from "@/components/news/NewsFeedView";
import { POSTS_PER_PAGE, getPostSlugs, getPostsPage } from "@/data";
import { buildMetadata } from "@/lib/seo";

export const revalidate = 3600;

export async function generateStaticParams() {
  const entries = await getPostSlugs();
  const totalPages = Math.ceil(entries.length / POSTS_PER_PAGE);
  const params: { n: string }[] = [];
  for (let page = 2; page <= totalPages; page += 1) {
    params.push({ n: String(page) });
  }
  return params;
}

interface NewsPageNumberProps {
  params: Promise<{ n: string }>;
}

export async function generateMetadata({
  params,
}: NewsPageNumberProps): Promise<Metadata> {
  const { n } = await params;
  return buildMetadata({
    title: `Noticias · Página ${n}`,
    description: `Archivo de noticias de la asociación (página ${n}).`,
    path: `/noticias/pagina/${n}`,
  });
}

export default async function NewsPaginatedPage({ params }: NewsPageNumberProps) {
  const { n } = await params;
  const page = Number(n);
  if (!Number.isInteger(page) || page < 1) notFound();
  if (page === 1) redirect("/noticias");

  const data = await getPostsPage({ page });
  if (page > data.totalPages) notFound();

  return <NewsFeedView data={data} />;
}
