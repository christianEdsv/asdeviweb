import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: ReactNode;
  children?: ReactNode;
  className?: string;
}

/** Cabecera común de las páginas interiores con estética editorial / HUD. */
export function PageHeader({
  eyebrow,
  title,
  description,
  children,
  className,
}: PageHeaderProps) {
  return (
    <header
      className={cn(
        "relative isolate overflow-hidden border-b border-border",
        className,
      )}
    >
      <div className="bg-hero-glow absolute inset-0 -z-20" aria-hidden />
      <div className="bg-grid absolute inset-0 -z-10 opacity-85" aria-hidden />

      <div className="container-page py-16 sm:py-22">
        {children}
        {eyebrow ? (
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/35 bg-primary/10 px-3.5 py-1">
            <span
              aria-hidden
              className="pulse-dot size-1.5 rounded-full bg-primary"
            />
            <span className="tech-tag font-semibold text-primary">
              {eyebrow}
            </span>
          </div>
        ) : null}
        <h1 className="max-w-4xl text-4xl leading-[1.03] font-extrabold text-foreground sm:text-6xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>
    </header>
  );
}
