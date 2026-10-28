import { defineQuery } from "groq";

/**
 * Consultas GROQ. Las proyecciones devuelven exactamente las formas definidas
 * en `src/types/content.ts`. Los arrays se normalizan con `coalesce` para
 * evitar valores `null` en las vistas.
 */

const imageFields = /* groq */ `{
  asset,
  alt,
  caption,
  hotspot,
  crop,
  "lqip": asset->metadata.lqip,
  "width": asset->metadata.dimensions.width,
  "height": asset->metadata.dimensions.height
}`;

const seoFields = /* groq */ `seo{
  title,
  description,
  ogImage ${imageFields},
  canonicalUrl,
  noIndex
}`;

/** Portable Text: se enriquecen las imágenes embebidas con sus dimensiones. */
const portableTextFields = /* groq */ `[]{
  ...,
  _type == "image" => {
    ...,
    "lqip": asset->metadata.lqip,
    "width": asset->metadata.dimensions.width,
    "height": asset->metadata.dimensions.height
  }
}`;

const memberFields = /* groq */ `
  _id,
  _updatedAt,
  name,
  "slug": slug.current,
  "logo": logo ${imageFields},
  memberType,
  "specialties": array::unique(coalesce(specialties, []) + coalesce(customSpecialties, [])),
  bio,
  featuredGame{
    title,
    description,
    "image": image ${imageFields},
    platform,
    url
  },
  "links": coalesce(links[]{ type, url, label }, []),
  joinedAt,
  ${seoFields}
`;

const eventFields = /* groq */ `
  _id,
  _updatedAt,
  title,
  "slug": slug.current,
  "coverImage": coverImage ${imageFields},
  eventType,
  startDate,
  endDate,
  mode,
  locationName,
  address,
  streamUrl,
  summary,
  "description": coalesce(description${portableTextFields}, []),
  registrationUrl,
  ${seoFields}
`;

const postFields = /* groq */ `
  _id,
  _updatedAt,
  title,
  "slug": slug.current,
  publishedAt,
  "author": author->{
    _id,
    name,
    role,
    bio,
    "avatar": avatar ${imageFields}
  },
  category,
  "mainImage": mainImage ${imageFields},
  excerpt,
  "body": coalesce(body${portableTextFields}, []),
  ${seoFields}
`;

// ── Miembros ────────────────────────────────────────────────────────────────
export const membersQuery = defineQuery(`
  *[_type == "member" && defined(slug.current)]
    | order(coalesce(order, 9999) asc, name asc) { ${memberFields} }
`);

export const latestMembersQuery = defineQuery(`
  *[_type == "member" && defined(slug.current)]
    | order(coalesce(joinedAt, _createdAt) desc)[0...$limit] { ${memberFields} }
`);

export const memberBySlugQuery = defineQuery(`
  *[_type == "member" && slug.current == $slug][0] { ${memberFields} }
`);

export const memberSlugsQuery = defineQuery(`
  *[_type == "member" && defined(slug.current)] { "slug": slug.current, _updatedAt }
`);

// ── Eventos ─────────────────────────────────────────────────────────────────
// Se traen todos y se separan en próximos/pasados en el servidor para que la
// clave de caché no dependa de la fecha actual.
export const eventsQuery = defineQuery(`
  *[_type == "event" && defined(slug.current)]
    | order(startDate asc) { ${eventFields} }
`);

export const eventBySlugQuery = defineQuery(`
  *[_type == "event" && slug.current == $slug][0] { ${eventFields} }
`);

export const eventSlugsQuery = defineQuery(`
  *[_type == "event" && defined(slug.current)] { "slug": slug.current, _updatedAt }
`);

// ── Noticias ────────────────────────────────────────────────────────────────
export const postsPageQuery = defineQuery(`
  {
    "items": *[_type == "post" && defined(slug.current) && ($category == "" || category == $category)]
      | order(publishedAt desc)[$start...$end] { ${postFields} },
    "total": count(*[_type == "post" && defined(slug.current) && ($category == "" || category == $category)])
  }
`);

export const latestPostsQuery = defineQuery(`
  *[_type == "post" && defined(slug.current)]
    | order(publishedAt desc)[0...$limit] { ${postFields} }
`);

export const postBySlugQuery = defineQuery(`
  *[_type == "post" && slug.current == $slug][0] { ${postFields} }
`);

export const relatedPostsQuery = defineQuery(`
  *[_type == "post" && defined(slug.current) && category == $category && slug.current != $slug]
    | order(publishedAt desc)[0...$limit] { ${postFields} }
`);

export const postSlugsQuery = defineQuery(`
  *[_type == "post" && defined(slug.current)] { "slug": slug.current, category, _updatedAt }
`);

// ── Ajustes del sitio (singleton) ───────────────────────────────────────────
export const siteSettingsQuery = defineQuery(`
  *[_id == "siteSettings"][0] {
    email,
    "socials": socials{ discord, x, youtube, instagram, linkedin },
    "about": {
      "intro": aboutIntro,
      "missionSummary": missionSummary,
      "mission": mission,
      "vision": vision,
      "history": coalesce(history[]{ year, title, description }, []),
      "objectives": coalesce(objectives[]{ title, description }, []),
      "board": coalesce(board[]{
        name,
        role,
        bio,
        "photo": photo ${imageFields},
        "links": coalesce(links[]{ type, url, label }, [])
      }, []),
      "faqs": coalesce(faqs[]{ question, answer }, []),
      "joinIntro": joinIntro
    },
    ${seoFields}
  }
`);
