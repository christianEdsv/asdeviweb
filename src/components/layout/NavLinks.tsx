"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { NavItem } from "@/config/site";

interface NavLinksProps {
  items: readonly NavItem[];
}

export function NavLinks({ items }: NavLinksProps) {
  const pathname = usePathname() ?? "/";

  return (
    <ul className="hidden items-center gap-0.5 rounded-full border border-border/90 bg-surface/90 p-1 backdrop-blur-xl md:flex">
      {items.map((item) => {
        const isActive =
          item.href === "/"
            ? pathname === "/"
            : pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <li key={item.href} className="relative">
            {isActive ? (
              <motion.span
                layoutId="nav-active-pill"
                aria-hidden
                transition={{ type: "spring", stiffness: 420, damping: 32 }}
                className="absolute inset-0 rounded-full bg-primary"
              />
            ) : null}
            <Link
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "relative z-10 block rounded-full px-4 py-1.5 text-xs font-bold tracking-wide transition-colors",
                isActive
                  ? "text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
