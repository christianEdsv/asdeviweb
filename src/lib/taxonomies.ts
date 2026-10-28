/**
 * Taxonomías compartidas entre los esquemas de Sanity y las vistas públicas.
 * Los valores (`value`) son estables y se guardan en el CMS; los títulos
 * (`title`) son lo que ven los usuarios.
 */

export interface Taxonomy<V extends string = string> {
  value: V;
  title: string;
}

export const MEMBER_TYPES = [
  { value: "estudio-indie", title: "Estudio Indie" },
  { value: "desarrollador-independiente", title: "Desarrollador Independiente" },
  { value: "academico-aliado", title: "Académico/Aliado" },
] as const satisfies readonly Taxonomy[];
export type MemberType = (typeof MEMBER_TYPES)[number]["value"];

/** Especialidades sugeridas: el valor almacenado es el propio título. */
export const SPECIALTIES = [
  "Programación",
  "Arte 2D/3D",
  "Audio",
  "Game Design",
  "Narrativa",
  "QA",
  "Producción",
  "Marketing y Comunidad",
  "Educación e Investigación",
] as const;

export const MEMBER_LINK_TYPES = [
  { value: "web", title: "Sitio web" },
  { value: "steam", title: "Steam" },
  { value: "itch", title: "itch.io" },
  { value: "x", title: "X (Twitter)" },
  { value: "youtube", title: "YouTube" },
  { value: "instagram", title: "Instagram" },
  { value: "linkedin", title: "LinkedIn" },
  { value: "discord", title: "Discord" },
  { value: "other", title: "Otro" },
] as const satisfies readonly Taxonomy[];
export type MemberLinkType = (typeof MEMBER_LINK_TYPES)[number]["value"];

export const EVENT_TYPES = [
  { value: "showcase", title: "Showcase" },
  { value: "game-jam", title: "Game Jam" },
  { value: "charla-taller", title: "Charla/Taller" },
  { value: "networking", title: "Networking" },
] as const satisfies readonly Taxonomy[];
export type EventType = (typeof EVENT_TYPES)[number]["value"];

export const EVENT_MODES = [
  { value: "presencial", title: "Presencial" },
  { value: "online", title: "Online" },
  { value: "hibrido", title: "Híbrido" },
] as const satisfies readonly Taxonomy[];
export type EventMode = (typeof EVENT_MODES)[number]["value"];

export const POST_CATEGORIES = [
  { value: "industria-local", title: "Industria Local" },
  { value: "lanzamientos", title: "Lanzamientos" },
  { value: "comunicados", title: "Comunicados" },
  { value: "entrevistas", title: "Entrevistas" },
] as const satisfies readonly Taxonomy[];
export type PostCategory = (typeof POST_CATEGORIES)[number]["value"];

type AnyTaxonomy = readonly Taxonomy[];

export function getTitle(list: AnyTaxonomy, value: string): string {
  return list.find((item) => item.value === value)?.title ?? value;
}

export function isValidValue(list: AnyTaxonomy, value: string): boolean {
  return list.some((item) => item.value === value);
}

/** Slugs que no pueden usarse como slug de noticia (rutas reservadas). */
export const RESERVED_POST_SLUGS = ["pagina", "categoria"] as const;
