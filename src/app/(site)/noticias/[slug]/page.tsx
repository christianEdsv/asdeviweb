import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { SanityImage } from "@/components/common/SanityImage";
import { SectionHeading } from "@/components/common/SectionHeading";
import { PostCard } from "@/components/news/PostCard";
import { ShareButtons } from "@/components/news/ShareButtons";
import { PortableTextRenderer } from "@/components/portable-text/PortableTextRenderer";
import { JsonLd } from "@/components/seo/JsonLd";
import { Badge } from "@/components/ui/badge";
import { absoluteUrl } from "@/config/site";
import { getPostBySlug, getPostSlugs, getRelatedPosts } from "@/data";
import { formatDate } from "@/lib/dates";
import { newsArticleJsonLd } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";
import { POST_CATEGORIES, getTitle } from "@/lib/taxonomies";

export const revalidate = 3600;

export async function generateStaticParams() {
  const entries = await getPostSlugs();
  if (entries.length === 0) return [{ slug: "proximamente" }];
  return entries.map(({ slug }) => ({ slug }));
}

interface PostDetailProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PostDetailProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) {
    return buildMetadata({ title: "Noticia no encontrada", path: `/noticias/${slug}` });
  }
  return buildMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/noticias/${post.slug}`,
    seo: post.seo,
    image: post.mainImage,
    type: "article",
    publishedTime: post.publishedAt,
    modifiedTime: post._updatedAt ?? post.publishedAt,
    authors: post.author ? [post.author.name] : undefined,
  });
}

export default async function PostDetailPage({ params }: PostDetailProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const related = await getRelatedPosts(post, 3);
  const categoryLabel = getTitle(POST_CATEGORIES, post.category);
  const shareUrl = absoluteUrl(`/noticias/${post.slug}`);

  return (
    <>
      <JsonLd data={newsArticleJsonLd(post)} />

      <article className="pb-20">
        <header className="relative isolate overflow-hidden border-b border-border/60">
          <div className="bg-hero-glow absolute inset-0 -z-20" aria-hidden />
          <div className="bg-grid absolute inset-0 -z-10 opacity-70" aria-hidden />

          <div className="container-page py-12 sm:py-16">
            <Breadcrumbs
              items={[
                { name: "Noticias", path: "/noticias" },
                {
                  name: categoryLabel,
                  path: `/noticias/categoria/${post.category}`,
                },
                { name: post.title, path: `/noticias/${post.slug}` },
              ]}
            />

            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              <Link href={`/noticias/categoria/${post.category}`}>
                <Badge className="bg-primary/15 text-primary-soft hover:bg-primary/25">
                  {categoryLabel}
                </Badge>
              </Link>
              <time dateTime={post.publishedAt}>
                {formatDate(post.publishedAt)}
              </time>
            </div>

            <h1 className="mt-4 max-w-3xl text-3xl font-bold text-foreground sm:text-5xl">
              {post.title}
            </h1>

            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              {post.excerpt}
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-border/60 pt-6">
              {post.author ? (
                <div className="flex items-center gap-3">
                  {post.author.avatar ? (
                    <div className="relative size-10 overflow-hidden rounded-full border border-border">
                      <SanityImage
                        image={post.author.avatar}
                        width={80}
                        height={80}
                        sizes="40px"
                        className="size-full object-cover"
                      />
                    </div>
                  ) : null}
                  <div className="text-xs">
                    <p className="font-semibold text-foreground">
                      {post.author.name}
                    </p>
                    {post.author.role ? (
                      <p className="text-muted-foreground">{post.author.role}</p>
                    ) : null}
                  </div>
                </div>
              ) : <span />}

              <ShareButtons url={shareUrl} title={post.title} />
            </div>
          </div>
        </header>

        <div className="container-page mt-12">
          <div className="mx-auto max-w-3xl">
            {post.mainImage ? (
              <figure className="mb-10">
                <div className="overflow-hidden rounded-2xl border border-border bg-surface">
                  <SanityImage
                    image={post.mainImage}
                    priority
                    sizes="(min-width: 1024px) 768px, 100vw"
                    className="aspect-[16/9] w-full object-cover"
                  />
                </div>
                {post.mainImage.caption ? (
                  <figcaption className="mt-2 text-center text-xs text-muted-foreground">
                    {post.mainImage.caption}
                  </figcaption>
                ) : null}
              </figure>
            ) : null}

            <PortableTextRenderer value={post.body} />

            <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-8">
              <Link
                href="/noticias"
                className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary-soft"
              >
                <ArrowLeft className="size-4" aria-hidden />
                Volver a Noticias
              </Link>
              <ShareButtons url={shareUrl} title={post.title} />
            </div>
          </div>
        </div>

        {related.length > 0 ? (
          <section
            aria-labelledby="related-news-heading"
            className="container-page mt-20 border-t border-border/60 pt-14"
          >
            <SectionHeading
              id="related-news-heading"
              eyebrow="Relacionadas"
              title="Más en esta categoría"
              action={{
                label: `Ver todo en ${categoryLabel}`,
                href: `/noticias/categoria/${post.category}`,
              }}
            />
            <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <li key={item._id}>
                  <PostCard post={item} />
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </article>
    </>
  );
}
