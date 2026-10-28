/**
 * Configuración central del sitio.
 * Todos los datos de la asociación (nombre, correo, redes) se editan aquí
 * y se reutilizan en Navbar, Footer, metadata y JSON-LD.
 */

export const siteConfig = {
  name: "ASDEVI",
  legalName: "Asociación salvadoreña de Desarrolladores de Videojuegos",
  tagline: "Conectamos talento. Impulsamos industria.",
  description:
    "Asociación de Desarrolladores de Videojuegos: conectamos estudios indie, desarrolladores independientes y aliados académicos para fortalecer la industria de El Salvador.",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(
    /\/$/,
    "",
  ),
  locale: "es",
  ogLocale: "es_ES",
  timeZone: "America/Mexico_City",
  foundingYear: 2026,
  email: "contacto@asdevi.org",
  ogImage: "/og-default.svg",
  logo: "/logo.svg",
  socials: {
    discord: "https://discord.gg/asdevi",
    x: "https://x.com/asdevi",
    youtube: "https://www.youtube.com/@asdevi",
    instagram: "https://www.instagram.com/asdevi",
    linkedin: "https://www.linkedin.com/company/asdevi",
  },
} as const;

export type SocialNetwork = keyof typeof siteConfig.socials;

export interface NavItem {
  label: string;
  href: string;
}

export const mainNav: readonly NavItem[] = [
  { label: "Inicio", href: "/" },
  { label: "Sobre Nosotros", href: "/sobre-nosotros" },
  { label: "Miembros", href: "/miembros" },
  { label: "Eventos", href: "/eventos" },
  { label: "Noticias", href: "/noticias" },
];

export const quickLinks: readonly NavItem[] = [
  ...mainNav,
  { label: "Cómo unirse", href: "/sobre-nosotros#unirse" },
  { label: "Preguntas frecuentes", href: "/sobre-nosotros#faq" },
];

/** Construye una URL absoluta a partir de una ruta relativa del sitio. */
export function absoluteUrl(path = "/"): string {
  if (/^https?:\/\//i.test(path)) return path;
  return `${siteConfig.url}${path.startsWith("/") ? path : `/${path}`}`;
}
