import Link from "next/link";
import { ArrowDownRight } from "lucide-react";
import { BrandLogo } from "@/components/common/BrandLogo";
import { mainNav, siteConfig } from "@/config/site";
import { MobileNav } from "./MobileNav";
import { NavLinks } from "./NavLinks";
import { ThemeToggle } from "./ThemeToggle";

/**
 * Barra de navegación tipo "Command Dock" suspendida con glassmorphism,
 * píldora activa animada (Framer Motion) y botón destacado de Contacto
 * con scroll suave hacia `#contacto`.
 */
export function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/70 backdrop-blur-xl supports-[backdrop-filter]:bg-background/55">
      <nav
        aria-label="Principal"
        className="container-page flex h-18 items-center justify-between gap-4"
      >
        <Link
          href="/"
          className="group flex items-center gap-3 rounded-lg focus-visible:outline-offset-4"
        >
          <BrandLogo
            priority
            className="h-11 transition-transform duration-300 group-hover:scale-105"
          />
          <span className="flex flex-col">
            <span className="flex items-center gap-2 font-display text-lg leading-none font-extrabold tracking-tight text-foreground">
              {siteConfig.name}
              <span className="tech-tag hidden rounded border border-gold bg-gold px-1.5 py-0.5 text-[10px] font-bold text-gold-foreground sm:inline-block">
                ASOCIACIÓN
              </span>
            </span>
            {/* 
            <span className="mt-1 hidden font-mono text-[8px] tracking-widest text-muted-foreground uppercase sm:block">
              ASOCIACIÓN SALVADOREÑA DE DESARROLLADORES DE VIDEOJUEGOS
            </span>
            */}
          </span>
        </Link>

        <NavLinks items={mainNav} />

        <div className="flex items-center gap-2.5">
          <ThemeToggle />
          <a
            href="#contacto"
            className="group relative hidden items-center gap-2 overflow-hidden rounded-full border border-primary bg-primary px-4 py-2 text-xs font-extrabold tracking-wider text-primary-foreground uppercase shadow-glow transition-transform duration-200 hover:scale-[1.03] active:scale-[0.98] sm:inline-flex"
          >
            <span
              aria-hidden
              className="size-1.5 rounded-full bg-primary-foreground transition-transform group-hover:scale-125"
            />
            Contacto
            <ArrowDownRight
              className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:translate-y-0.5"
              aria-hidden
            />
          </a>
          <MobileNav items={mainNav} />
        </div>
      </nav>
    </header>
  );
}
