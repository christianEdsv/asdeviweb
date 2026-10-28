import Link from "next/link";
import { POST_CATEGORIES, type PostCategory } from "@/lib/taxonomies";
import { cn } from "@/lib/utils";

interface CategoryFilterProps {
  active?: PostCategory;
}

/**
 * Filtro por categoría mediante enlaces estáticos (SSG): cada categoría tiene
 * su propia ruta `/noticias/categoria/[cat]` pre-renderizada.
 */
export function CategoryFilter({ active }: CategoryFilterProps) {
  const items: { label: string; href: string; isActive: boolean }[] = [
    { label: "Todas", href: "/noticias", isActive: !active },
    ...POST_CATEGORIES.map((category) => ({
      label: category.title,
      href: `/noticias/categoria/${category.value}`,
      isActive: active === category.value,
    })),
  ];

  return (
    <nav aria-label="Categorías de noticias" className="mb-8">
      <ul className="flex flex-wrap gap-2">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={item.isActive ? "page" : undefined}
              className={cn(
                "inline-flex items-center rounded-full border px-4 py-1.5 text-xs font-semibold transition-colors",
                item.isActive
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-surface text-muted-foreground hover:border-primary/50 hover:text-foreground",
              )}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
