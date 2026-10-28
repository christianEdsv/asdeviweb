import type { Metadata } from "next";
import { NewsFeedView } from "@/components/news/NewsFeedView";
import { getPostsPage } from "@/data";
import { buildMetadata } from "@/lib/seo";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: "Noticias",
    description:
      "Sala de prensa de la asociación: lanzamientos, industria local, comunicados y entrevistas.",
    path: "/noticias",
  });
}

export default async function NewsPage() {
  const data = await getPostsPage({ page: 1 });
  return <NewsFeedView data={data} />;
}
