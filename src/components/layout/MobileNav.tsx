"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mail, Menu } from "lucide-react";
import { BrandLogo } from "@/components/common/BrandLogo";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { siteConfig, type NavItem } from "@/config/site";

interface MobileNavProps {
  items: readonly NavItem[];
}

export function MobileNav({ items }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname() ?? "/";

  return (
    <div className="md:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            aria-label="Abrir menú de navegación"
            className="border-border/80 bg-surface/60"
          >
            <Menu className="size-5" aria-hidden />
          </Button>
        </SheetTrigger>
        <SheetContent
          side="right"
          className="flex w-80 flex-col border-border bg-surface px-6 py-6"
        >
          <SheetHeader className="p-0 text-left">
            <SheetTitle className="flex items-center gap-2.5 text-lg font-bold text-foreground">
              <BrandLogo className="h-9" />
              {siteConfig.name}
            </SheetTitle>
            <SheetDescription className="text-xs text-muted-foreground">
              {siteConfig.legalName}
            </SheetDescription>
          </SheetHeader>

          <nav aria-label="Navegación móvil" className="mt-6 flex-1">
            <ul className="flex flex-col gap-1">
              {items.map((item) => {
                const isActive =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname === item.href ||
                      pathname.startsWith(`${item.href}/`);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      aria-current={isActive ? "page" : undefined}
                      className={cn(
                        "flex items-center justify-between rounded-xl px-3.5 py-2.5 text-base font-medium transition-colors",
                        isActive
                          ? "bg-primary/15 text-primary-soft"
                          : "text-foreground hover:bg-surface-elevated",
                      )}
                    >
                      {item.label}
                      {isActive ? (
                        <span
                          aria-hidden
                          className="size-1.5 rounded-full bg-accent"
                        />
                      ) : null}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <Button asChild size="lg" className="w-full">
            <a
              href="#contacto"
              onClick={() => setOpen(false)}
              className="gap-2"
            >
              <Mail className="size-4" aria-hidden />
              Contacto
            </a>
          </Button>
        </SheetContent>
      </Sheet>
    </div>
  );
}
