import type { ArbitraryTypedObject } from "@portabletext/types";
import type {
  EventMode,
  EventType,
  MemberLinkType,
  MemberType,
  PostCategory,
} from "@/lib/taxonomies";

/**
 * Tipos de dominio devueltos por la capa de datos (`src/data`).
 * Tanto las consultas GROQ como los datos de prueba (mocks) respetan
 * exactamente estas formas, de modo que las vistas no dependen del origen.
 */

/** Contenido Portable Text (bloques de texto, imágenes, videos…). */
export type RichText = ArbitraryTypedObject[];

export interface CmsImage {
  /** Referencia al asset en Sanity (ausente en imágenes mock locales). */
  asset?: { _ref: string; _type?: string };
  alt: string;
  caption?: string;
  hotspot?: { x: number; y: number; height: number; width: number };
  crop?: { top: number; bottom: number; left: number; right: number };
  /** Placeholder borroso (LQIP) generado por Sanity. */
  lqip?: string;
  width?: number;
  height?: number;
  /** Ruta local para datos de prueba (no usa el CDN de Sanity). */
  mockSrc?: string;
}

export interface SeoFields {
  title?: string;
  description?: string;
  ogImage?: CmsImage;
  canonicalUrl?: string;
  noIndex?: boolean;
}

export interface ExternalLink {
  type: MemberLinkType;
  url: string;
  label?: string;
}

export interface FeaturedGame {
  title: string;
  description?: string;
  image?: CmsImage;
  platform?: string;
  url?: string;
}

interface BaseDoc {
  _id: string;
  _updatedAt?: string;
  slug: string;
  seo?: SeoFields;
}

export interface Member extends BaseDoc {
  name: string;
  logo: CmsImage | null;
  memberType: MemberType;
  specialties: string[];
  bio: string;
  featuredGame?: FeaturedGame;
  links: ExternalLink[];
  /** Fecha de ingreso a la asociación (ISO). */
  joinedAt?: string;
}

export interface EventItem extends BaseDoc {
  title: string;
  coverImage: CmsImage | null;
  eventType: EventType;
  startDate: string;
  endDate?: string;
  mode: EventMode;
  locationName?: string;
  address?: string;
  streamUrl?: string;
  summary?: string;
  description: RichText;
  registrationUrl?: string;
}

export interface Author {
  _id: string;
  name: string;
  role?: string;
  bio?: string;
  avatar?: CmsImage | null;
}

export interface Post extends BaseDoc {
  title: string;
  publishedAt: string;
  author: Author | null;
  category: PostCategory;
  mainImage: CmsImage | null;
  excerpt: string;
  body: RichText;
}

export interface TimelineEntry {
  year: string;
  title: string;
  description: string;
}

export interface Objective {
  title: string;
  description: string;
}

export interface BoardMember {
  name: string;
  role: string;
  bio?: string;
  photo?: CmsImage | null;
  links?: ExternalLink[];
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface SiteSettings {
  email: string;
  socials: {
    discord?: string;
    x?: string;
    youtube?: string;
    instagram?: string;
    linkedin?: string;
  };
  about: {
    intro: string;
    missionSummary: string;
    mission: string;
    vision: string;
    history: TimelineEntry[];
    objectives: Objective[];
    board: BoardMember[];
    faqs: FaqItem[];
    joinIntro: string;
  };
  seo?: SeoFields;
}

export interface PostPage {
  items: Post[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
