import Link from "next/link";
import {
  PortableText,
  type PortableTextComponents,
} from "@portabletext/react";
import { SanityImage } from "@/components/common/SanityImage";
import { cn } from "@/lib/utils";
import type { CmsImage, RichText } from "@/types/content";
import { YouTubeEmbed } from "./YouTubeEmbed";

const components: PortableTextComponents = {
  types: {
    image: ({ value }: { value: CmsImage }) => {
      if (!value) return null;
      return (
        <figure className="my-8">
          <div className="overflow-hidden rounded-2xl border border-border bg-surface">
            <SanityImage
              image={value}
              sizes="(min-width: 1024px) 768px, 100vw"
              className="h-auto w-full object-cover"
            />
          </div>
          {value.caption ? (
            <figcaption className="mt-2 text-center text-xs text-muted-foreground">
              {value.caption}
            </figcaption>
          ) : null}
        </figure>
      );
    },
    youtube: ({ value }: { value: { url?: string; title?: string } }) => {
      if (!value?.url) return null;
      return <YouTubeEmbed url={value.url} title={value.title} />;
    },
  },
  marks: {
    link: ({
      value,
      children,
    }: {
      value?: { href?: string; blank?: boolean };
      children?: React.ReactNode;
    }) => {
      const href = value?.href ?? "#";
      const isInternal = href.startsWith("/") || href.startsWith("#");
      if (isInternal) {
        return <Link href={href}>{children}</Link>;
      }
      const openBlank = value?.blank ?? true;
      return (
        <a
          href={href}
          target={openBlank ? "_blank" : undefined}
          rel={openBlank ? "noopener noreferrer" : undefined}
        >
          {children}
        </a>
      );
    },
  },
};

interface PortableTextRendererProps {
  value: RichText | undefined;
  className?: string;
}

export function PortableTextRenderer({
  value,
  className,
}: PortableTextRendererProps) {
  if (!value || value.length === 0) return null;
  return (
    <div className={cn("rich-text", className)}>
      <PortableText value={value} components={components} />
    </div>
  );
}
