import Link from "next/link";
import { ArrowUpRight, Mail } from "lucide-react";
import { BrandLogo } from "@/components/common/BrandLogo";
import {
  DiscordIcon,
  InstagramIcon,
  LinkedInIcon,
  XIcon,
  YouTubeIcon,
} from "@/components/icons/brands";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { quickLinks, siteConfig } from "@/config/site";
import { POST_CATEGORIES } from "@/lib/taxonomies";
import type { SiteSettings } from "@/types/content";
import { ContactForm } from "./ContactForm";

interface FooterProps {
  settings: SiteSettings;
}

export function Footer({ settings }: FooterProps) {
  const { email, socials } = settings;
  const socialItems = [
    { key: "discord", label: "Discord", href: socials.discord, Icon: DiscordIcon },
    { key: "x", label: "X (Twitter)", href: socials.x, Icon: XIcon },
    { key: "youtube", label: "YouTube", href: socials.youtube, Icon: YouTubeIcon },
    { key: "instagram", label: "Instagram", href: socials.instagram, Icon: InstagramIcon },
    { key: "linkedin", label: "LinkedIn", href: socials.linkedin, Icon: LinkedInIcon },
  ].filter(
    (item): item is typeof item & { href: string } =>
      typeof item.href === "string" && item.href.length > 0,
  );

  const year = new Date().getFullYear();

  return (
    <footer
      id="contacto"
      className="scroll-mt-16 border-t border-border bg-surface/60"
    >
      {/* Bloque de contacto directo */}
      <div className="container-page py-14 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              Contacto
            </p>
            <h2 className="mt-2 text-2xl font-bold text-foreground sm:text-3xl">
              ¿Hablamos? Escríbenos o únete a la comunidad
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Para consultas de prensa, alianzas institucionales, patrocinios o
              dudas sobre futuras convocatorias de miembros.
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              <Button asChild>
                <a href={`mailto:${email}`}>
                  <Mail className="size-4" aria-hidden />
                  {email}
                </a>
              </Button>
              {socials.discord ? (
                <Button asChild variant="outline">
                  <a
                    href={socials.discord}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <DiscordIcon className="size-4" />
                    Comunidad en Discord
                    <ArrowUpRight className="size-3.5" aria-hidden />
                  </a>
                </Button>
              ) : null}
            </div>
          </div>

          <div className="lg:col-span-7">
            <ContactForm email={email} />
          </div>
        </div>

        <Separator className="my-12 bg-border/80" />

        {/* Navegación del pie y redes */}
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Link href="/" className="inline-flex items-center gap-3">
              <BrandLogo className="h-11" />
              <span className="font-display text-lg font-bold text-foreground">
                {siteConfig.name}
              </span>
            </Link>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
              {siteConfig.description}
            </p>

            {socialItems.length > 0 ? (
              <ul
                aria-label="Redes sociales"
                className="mt-5 flex flex-wrap items-center gap-2"
              >
                {socialItems.map(({ key, label, href, Icon }) => (
                  <li key={key}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      title={label}
                      className="flex size-10 items-center justify-center rounded-xl border border-border bg-surface text-muted-foreground transition-colors hover:border-primary/60 hover:bg-surface-elevated hover:text-foreground"
                    >
                      <Icon className="size-4" />
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          <div className="lg:col-span-4">
            <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-foreground">
              Enlaces rápidos
            </h3>
            <ul className="mt-4 grid grid-cols-2 gap-2.5 text-sm">
              {quickLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-muted-foreground transition-colors hover:text-primary-soft"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-foreground">
              Sala de prensa
            </h3>
            <ul className="mt-4 flex flex-col gap-2.5 text-sm">
              {POST_CATEGORIES.map((category) => (
                <li key={category.value}>
                  <Link
                    href={`/noticias/categoria/${category.value}`}
                    className="text-muted-foreground transition-colors hover:text-primary-soft"
                  >
                    {category.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator className="my-8 bg-border/60" />

        <div className="flex flex-col justify-between gap-2 text-xs text-muted-foreground sm:flex-row">
          <p>
            © {year} {siteConfig.legalName} ({siteConfig.name}). Todos los
            derechos reservados.
          </p>
          <p>Hecho por y para la comunidad de desarrollo de videojuegos.</p>
        </div>
      </div>
    </footer>
  );
}
