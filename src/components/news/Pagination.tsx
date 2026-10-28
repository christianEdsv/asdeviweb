import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  page: number;
  totalPages: number;
  /** Ruta de la primera página, p. ej. `/noticias` o `/noticias/categoria/lanzamientos`. */
  basePath: string;
}

function hrefForPage(basePath: string, target: number): string {
  return target <= 1 ? basePath : `${basePath}/pagina/${target}`;
}

/**
 * Paginación estática (SSG) con elipsis cuando hay muchas páginas.
 */
export function Pagination({ page, totalPages, basePath }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = buildPageList(page, totalPages);
  const prevHref = page > 1 ? hrefForPage(basePath, page - 1) : null;
  const nextHref = page < totalPages ? hrefForPage(basePath, page + 1) : null;

  return (
    <nav
      aria-label="Paginación de noticias"
      className="mt-12 flex items-center justify-center gap-1.5"
    >
      {prevHref ? (
        <Link
          href={prevHref}
          rel="prev"
          aria-label="Página anterior"
          className="inline-flex h-9 items-center gap-1 rounded-lg border border-border bg-surface px-3 text-xs font-medium text-foreground transition-colors hover:border-primary/60 hover:bg-surface-elevated"
        >
          <ChevronLeft className="size-4" aria-hidden />
          Anterior
        </Link>
      ) : (
        <span
          aria-disabled="true"
          className="inline-flex h-9 items-center gap-1 rounded-lg border border-border/50 bg-surface/40 px-3 text-xs font-medium text-muted-foreground/50"
        >
          <ChevronLeft className="size-4" aria-hidden />
          Anterior
        </span>
      )}

      <ul className="flex items-center gap-1">
        {pages.map((entry, idx) =>
          entry === "ellipsis" ? (
            <li
              key={`ellipsis-${idx}`}
              aria-hidden
              className="px-2 text-xs text-muted-foreground"
            >
              …
            </li>
          ) : (
            <li key={entry}>
              <Link
                href={hrefForPage(basePath, entry)}
                aria-current={entry === page ? "page" : undefined}
                aria-label={`Página ${entry}`}
                className={cn(
                  "inline-flex size-9 items-center justify-center rounded-lg border text-xs font-semibold transition-colors",
                  entry === page
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-surface text-muted-foreground hover:border-primary/50 hover:text-foreground",
                )}
              >
                {entry}
              </Link>
            </li>
          ),
        )}
      </ul>

      {nextHref ? (
        <Link
          href={nextHref}
          rel="next"
          aria-label="Página siguiente"
          className="inline-flex h-9 items-center gap-1 rounded-lg border border-border bg-surface px-3 text-xs font-medium text-foreground transition-colors hover:border-primary/60 hover:bg-surface-elevated"
        >
          Siguiente
          <ChevronRight className="size-4" aria-hidden />
        </Link>
      ) : (
        <span
          aria-disabled="true"
          className="inline-flex h-9 items-center gap-1 rounded-lg border border-border/50 bg-surface/40 px-3 text-xs font-medium text-muted-foreground/50"
        >
          Siguiente
          <ChevronRight className="size-4" aria-hidden />
        </span>
      )}
    </nav>
  );
}

function buildPageList(
  current: number,
  total: number,
): (number | "ellipsis")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const set = new Set<number>([1, total, current, current - 1, current + 1]);
  const sorted = Array.from(set)
    .filter((n) => n >= 1 && n <= total)
    .sort((a, b) => a - b);

  const result: (number | "ellipsis")[] = [];
  for (let i = 0; i < sorted.length; i += 1) {
    const value = sorted[i]!;
    const prev = sorted[i - 1];
    if (prev !== undefined && value - prev > 1) {
      result.push("ellipsis");
    }
    result.push(value);
  }
  return result;
}
