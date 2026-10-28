import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface SectionHeadingProps {
  eyebrow?: string;
  index?: string;
  title: string;
  description?: ReactNode;
  /** Enlace "Ver todo" a la derecha del título. */
  action?: { label: string; href: string };
  as?: "h1" | "h2";
  className?: string;
  id?: string;
}

export function SectionHeading({
  eyebrow,
  index,
  title,
  description,
  action,
  as: Heading = "h2",
  className,
  id,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "mb-10 flex flex-col gap-5 border-b border-border/80 pb-6 sm:flex-row sm:items-end sm:justify-between",
        className,
      )}
    >
      <div className="max-w-2xl">
        {eyebrow ? (
          <div className="mb-3 inline-flex items-center gap-2.5">
            <span
              aria-hidden
              className="pulse-dot size-2 rounded-full bg-primary"
            />
            {index ? (
              <span className="tech-tag text-muted-foreground">[{index}]</span>
            ) : null}
            <p className="tech-tag font-semibold text-primary">{eyebrow}</p>
          </div>
        ) : null}
        <Heading
          id={id}
          className="text-3xl leading-[1.06] font-extrabold text-foreground sm:text-5xl"
        >
          {title}
        </Heading>
        {description ? (
          <p className="mt-3 text-base leading-relaxed text-muted-foreground sm:text-lg">
            {description}
          </p>
        ) : null}
      </div>
      {action ? (
        <Link
          href={action.href}
          className="group inline-flex shrink-0 items-center gap-2 self-start rounded-full border border-border bg-surface px-4 py-2 text-xs font-bold tracking-wider text-foreground uppercase transition-all hover:border-primary hover:bg-primary hover:text-primary-foreground sm:self-end"
        >
          {action.label}
          <ArrowUpRight
            className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            aria-hidden
          />
        </Link>
      ) : null}
    </div>
  );
}
