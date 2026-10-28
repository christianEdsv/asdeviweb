import { defineField, defineType } from "sanity";

/**
 * Campos SEO reutilizables. Alimentan `generateMetadata` (title, description,
 * Open Graph y canonical) en cada página pública.
 */
export const seoType = defineType({
  name: "seo",
  title: "SEO",
  type: "object",
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({
      name: "title",
      title: "Título SEO",
      type: "string",
      description:
        "Opcional. Si se deja vacío se usa el título del contenido. Recomendado: hasta 60 caracteres.",
      validation: (Rule) => Rule.max(70).warning("Se recomienda máximo 60-70 caracteres."),
    }),
    defineField({
      name: "description",
      title: "Meta descripción",
      type: "text",
      rows: 3,
      description: "Opcional. Recomendado: entre 120 y 160 caracteres.",
      validation: (Rule) =>
        Rule.max(200).warning("Se recomienda máximo 160 caracteres."),
    }),
    defineField({
      name: "ogImage",
      title: "Imagen para redes (Open Graph)",
      type: "image",
      description: "Opcional. Recomendado: 1200 × 630 px.",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Texto alternativo",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),
    defineField({
      name: "canonicalUrl",
      title: "URL canónica",
      type: "url",
      description:
        "Solo si el contenido se publicó originalmente en otra dirección. Déjalo vacío en el resto de casos.",
      validation: (Rule) => Rule.uri({ scheme: ["http", "https"] }),
    }),
    defineField({
      name: "noIndex",
      title: "Ocultar de buscadores (noindex)",
      type: "boolean",
      initialValue: false,
    }),
  ],
});
