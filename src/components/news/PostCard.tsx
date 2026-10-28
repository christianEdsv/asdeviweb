import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SanityImage } from "@/components/common/SanityImage";
import { SpotlightCard } from "@/components/common/SpotlightCard";
import { formatDate } from "@/lib/dates";
import { POST_CATEGORIES, getTitle } from "@/lib/taxonomies";
import type { Post } from "@/types/content";

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const categoryLabel = getTitle(POST_CATEGORIES, post.category);

  return (
    <SpotlightCard className="group flex h-full flex-col overflow-hidden rounded-2xl">
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-background">
        {post.mainImage ? (
          <SanityImage
            image={post.mainImage}
            fill
            sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-108"
          />
        ) : null}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent"
        />
        <span className="tech-tag absolute top-3 left-3 rounded-md border border-primary/40 bg-background/90 px-2.5 py-1 font-bold text-primary backdrop-blur-md">
          {categoryLabel}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center gap-2 font-mono text-[11px] text-muted-foreground">
          <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
          {post.author ? (
            <>
              <span aria-hidden>{"//"}</span>
              <span className="truncate">{post.author.name}</span>
            </>
          ) : null}
        </div>

        <h3 className="mt-2.5 line-clamp-2 text-xl leading-snug font-extrabold text-foreground transition-colors group-hover:text-primary">
          <Link
            href={`/noticias/${post.slug}`}
            className="after:absolute after:inset-0 focus-visible:outline-none"
          >
            {post.title}
          </Link>
        </h3>

        <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-muted-foreground">
          {post.excerpt}
        </p>

        <div className="mt-5 flex items-center justify-between border-t border-border/80 pt-4">
          <span className="tech-tag font-bold text-foreground group-hover:text-primary">
            LEER NOTA COMPLETA
          </span>
          <ArrowUpRight
            aria-hidden
            className="size-4 text-primary transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </div>
      </div>
    </SpotlightCard>
  );
}
