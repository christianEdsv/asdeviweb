import { absoluteUrl, siteConfig } from "@/config/site";
import { portableTextToPlain } from "@/lib/jsonld";
import { getAbsoluteImageUrl } from "@/lib/seo";
import { MEMBER_TYPES, POST_CATEGORIES, getTitle } from "@/lib/taxonomies";
import type {
  EventItem,
  Member,
  Post,
  SiteSettings,
} from "@/types/content";

/** Constructores de datos estructurados Schema.org (JSON-LD). */

type JsonLdObject = Record<string, unknown>;

const ORGANIZATION_ID = `${siteConfig.url}/#organization`;
const WEBSITE_ID = `${siteConfig.url}/#website`;

function socialLinks(settings?: SiteSettings): string[] {
  const socials = settings?.socials ?? siteConfig.socials;
  return Object.values(socials).filter(
    (value): value is string => typeof value === "string" && value.length > 0,
  );
}

/** Referencia mínima a la organización (para `publisher`, `organizer`, etc.). */
function organizationRef(): JsonLdObject {
  return { "@type": "Organization", "@id": ORGANIZATION_ID, name: siteConfig.legalName };
}

/** `Organization` de la asociación (Inicio y Sobre Nosotros). */
export function organizationJsonLd(settings?: SiteSettings): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORGANIZATION_ID,
    name: siteConfig.legalName,
    alternateName: siteConfig.name,
    url: siteConfig.url,
    logo: absoluteUrl(siteConfig.logo),
    description: siteConfig.description,
    foundingDate: String(siteConfig.foundingYear),
    email: settings?.email ?? siteConfig.email,
    sameAs: socialLinks(settings),
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: settings?.email ?? siteConfig.email,
      availableLanguage: ["es"],
    },
  };
}

export function websiteJsonLd(): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: siteConfig.url,
    name: siteConfig.name,
    description: siteConfig.description,
    inLanguage: siteConfig.locale,
    publisher: { "@id": ORGANIZATION_ID },
  };
}

export function faqJsonLd(faqs: { question: string; answer: string }[]): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}

export function breadcrumbJsonLd(
  items: { name: string; path: string }[],
): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

function memberEntity(member: Member): JsonLdObject {
  const isPerson = member.memberType === "desarrollador-independiente";
  const url = absoluteUrl(`/miembros/${member.slug}`);
  const image = getAbsoluteImageUrl(member.logo);
  return {
    "@type": isPerson ? "Person" : "Organization",
    "@id": `${url}#${isPerson ? "person" : "organization"}`,
    name: member.name,
    url,
    description: member.bio,
    ...(image ? { image } : {}),
    ...(member.specialties.length > 0 ? { knowsAbout: member.specialties } : {}),
    ...(member.links.length > 0 ? { sameAs: member.links.map((link) => link.url) } : {}),
    memberOf: organizationRef(),
    ...(isPerson ? {} : { additionalType: getTitle(MEMBER_TYPES, member.memberType) }),
  };
}

/** Perfil individual: `Organization` o `Person` según el tipo de miembro. */
export function memberJsonLd(member: Member): JsonLdObject {
  return { "@context": "https://schema.org", ...memberEntity(member) };
}

/** Catálogo de miembros: `ItemList` de `Organization`/`Person`. */
export function memberListJsonLd(members: Member[]): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Directorio de miembros",
    numberOfItems: members.length,
    itemListElement: members.map((member, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: absoluteUrl(`/miembros/${member.slug}`),
      item: memberEntity(member),
    })),
  };
}

const ATTENDANCE_MODE = {
  presencial: "https://schema.org/OfflineEventAttendanceMode",
  online: "https://schema.org/OnlineEventAttendanceMode",
  hibrido: "https://schema.org/MixedEventAttendanceMode",
} as const;

/** `Event` de Schema.org para la página de detalle del evento. */
export function eventJsonLd(event: EventItem): JsonLdObject {
  const url = absoluteUrl(`/eventos/${event.slug}`);
  const physical =
    event.mode !== "online" && event.locationName
      ? {
          "@type": "Place",
          name: event.locationName,
          address: event.address
            ? { "@type": "PostalAddress", streetAddress: event.address }
            : event.locationName,
        }
      : null;
  const virtual =
    event.mode !== "presencial" && event.streamUrl
      ? { "@type": "VirtualLocation", url: event.streamUrl }
      : null;
  const locations = [physical, virtual].filter(Boolean);
  const image = getAbsoluteImageUrl(event.coverImage);
  const description =
    event.summary || portableTextToPlain(event.description) || undefined;

  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    url,
    ...(description ? { description } : {}),
    startDate: event.startDate,
    ...(event.endDate ? { endDate: event.endDate } : {}),
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: ATTENDANCE_MODE[event.mode],
    ...(locations.length === 1
      ? { location: locations[0] }
      : locations.length > 1
        ? { location: locations }
        : {}),
    ...(image ? { image: [image] } : {}),
    organizer: organizationRef(),
    ...(event.registrationUrl
      ? {
          offers: {
            "@type": "Offer",
            url: event.registrationUrl,
            availability: "https://schema.org/InStock",
          },
        }
      : {}),
  };
}

/** `NewsArticle` de Schema.org para artículos de noticias. */
export function newsArticleJsonLd(post: Post): JsonLdObject {
  const url = absoluteUrl(`/noticias/${post.slug}`);
  const image = getAbsoluteImageUrl(post.mainImage);
  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: post.title.slice(0, 110),
    description: post.excerpt,
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    datePublished: post.publishedAt,
    dateModified: post.publishedAt > (post._updatedAt ?? "") ? post.publishedAt : (post._updatedAt ?? post.publishedAt),
    articleSection: getTitle(POST_CATEGORIES, post.category),
    inLanguage: siteConfig.locale,
    ...(image ? { image: [image] } : {}),
    author: post.author
      ? { "@type": "Person", name: post.author.name }
      : organizationRef(),
    publisher: {
      "@type": "Organization",
      "@id": ORGANIZATION_ID,
      name: siteConfig.legalName,
      logo: { "@type": "ImageObject", url: absoluteUrl(siteConfig.logo) },
    },
  };
}
