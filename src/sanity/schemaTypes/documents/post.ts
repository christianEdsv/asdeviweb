import { FileText as DocumentTextIcon } from "lucide-react";
import { defineField, defineType } from "sanity";
import {
  POST_CATEGORIES,
  RESERVED_POST_SLUGS,
  getTitle,
} from "@/lib/taxonomies";

export const postType = defineType({
  name: "post",
  title: "Noticia",
  type: "document",
  icon: DocumentTextIcon,
  groups: [
    { name: "main", title: "Noticia", default: true },
    { name: "content", title: "Contenido" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Título",
      type: "string",
      group: "main",
      validation: (Rule) => Rule.required().min(8).max(140),
    }),
    defineField({
      name: "slug",
      title: "Slug (URL)",
      type: "slug",
      group: "main",
      description: "Dirección única: /noticias/<slug>",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) =>
        Rule.required().custom((value) => {
          const current = value?.current;
          if (
            current &&
            (RESERVED_POST_SLUGS as readonly string[]).includes(current)
          ) {
            return `"${current}" es una palabra reservada del sitio. Usa otro slug.`;
          }
          return true;
        }),
    }),
    defineField({
      name: "publishedAt",
      title: "Fecha de publicación",
      type: "datetime",
      group: "main",
      initialValue: () => new Date().toISOString(),
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "author",
      title: "Autor",
      type: "reference",
      group: "main",
      to: [{ type: "author" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "category",
      title: "Categoría",
      type: "string",
      group: "main",
      options: {
        list: POST_CATEGORIES.map(({ title, value }) => ({ title, value })),
        layout: "radio",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "mainImage",
      title: "Imagen principal",
      type: "image",
      group: "main",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Texto alternativo",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
        defineField({ name: "caption", title: "Pie de imagen", type: "string" }),
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "excerpt",
      title: "Extracto",
      type: "text",
      rows: 3,
      group: "content",
      description: "Se muestra en tarjetas y se usa como meta descripción (SEO).",
      validation: (Rule) => Rule.required().min(40).max(220),
    }),
    defineField({
      name: "body",
      title: "Cuerpo de la noticia",
      type: "postBody",
      group: "content",
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({ name: "seo", title: "SEO", type: "seo", group: "seo" }),
  ],
  orderings: [
    {
      title: "Fecha de publicación (reciente primero)",
      name: "publishedAtDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      category: "category",
      date: "publishedAt",
      author: "author.name",
      media: "mainImage",
    },
    prepare({ title, category, date, author, media }) {
      return {
        title,
        subtitle: [
          category ? getTitle(POST_CATEGORIES, category) : null,
          author,
          date ? new Date(date).toLocaleDateString("es") : null,
        ]
          .filter(Boolean)
          .join(" · "),
        media,
      };
    },
  },
});
