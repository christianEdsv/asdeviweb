import { UserIcon } from "lucide-react";
import { defineField, defineType } from "sanity";
import {
  MEMBER_TYPES,
  SPECIALTIES,
  getTitle,
} from "@/lib/taxonomies";

export const memberType = defineType({
  name: "member",
  title: "Miembro",
  type: "document",
  icon: UserIcon,
  groups: [
    { name: "main", title: "Perfil", default: true },
    { name: "featured", title: "Juego destacado" },
    { name: "links", title: "Enlaces" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "name",
      title: "Nombre del estudio o desarrollador",
      type: "string",
      group: "main",
      validation: (Rule) => Rule.required().min(2).max(80),
    }),
    defineField({
      name: "slug",
      title: "Slug (URL)",
      type: "slug",
      group: "main",
      description: "Dirección única del perfil: /miembros/<slug>",
      options: { source: "name", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "logo",
      title: "Logo / Avatar",
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
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "memberType",
      title: "Tipo de miembro",
      type: "string",
      group: "main",
      options: {
        list: MEMBER_TYPES.map(({ title, value }) => ({ title, value })),
        layout: "radio",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "specialties",
      title: "Especialidades",
      type: "array",
      group: "main",
      of: [{ type: "string" }],
      options: {
        list: SPECIALTIES.map((title) => ({ title, value: title })),
      },
      validation: (Rule) => Rule.unique(),
    }),
    defineField({
      name: "customSpecialties",
      title: "Otras especialidades",
      type: "array",
      group: "main",
      description: "Etiquetas libres para especialidades que no estén en la lista.",
      of: [{ type: "string" }],
      options: { layout: "tags" },
      validation: (Rule) => Rule.unique(),
    }),
    defineField({
      name: "bio",
      title: "Biografía corta",
      type: "text",
      rows: 4,
      group: "main",
      validation: (Rule) => Rule.required().min(20).max(400),
    }),
    defineField({
      name: "joinedAt",
      title: "Fecha de ingreso",
      type: "date",
      group: "main",
    }),
    defineField({
      name: "order",
      title: "Orden manual (opcional)",
      type: "number",
      group: "main",
      description: "Número menor = aparece primero. Si se omite se ordena alfabéticamente.",
    }),
    defineField({
      name: "featuredGame",
      title: "Juego destacado (opcional)",
      type: "object",
      group: "featured",
      fields: [
        defineField({
          name: "title",
          title: "Título del juego",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "description",
          title: "Descripción breve",
          type: "text",
          rows: 3,
          validation: (Rule) => Rule.max(300),
        }),
        defineField({
          name: "image",
          title: "Imagen / Capsule art",
          type: "image",
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
          name: "platform",
          title: "Plataformas",
          type: "string",
          description: "Ejemplo: PC (Steam), Switch, iOS / Android",
        }),
        defineField({
          name: "url",
          title: "Enlace al juego",
          type: "url",
          validation: (Rule) => Rule.uri({ scheme: ["https", "http"] }),
        }),
      ],
    }),
    defineField({
      name: "links",
      title: "Enlaces (web, Steam, itch.io, redes)",
      type: "array",
      group: "links",
      of: [{ type: "externalLink" }],
    }),
    defineField({ name: "seo", title: "SEO", type: "seo", group: "seo" }),
  ],
  orderings: [
    {
      title: "Nombre (A-Z)",
      name: "nameAsc",
      by: [{ field: "name", direction: "asc" }],
    },
    {
      title: "Orden manual",
      name: "manualOrder",
      by: [
        { field: "order", direction: "asc" },
        { field: "name", direction: "asc" },
      ],
    },
  ],
  preview: {
    select: { title: "name", type: "memberType", media: "logo" },
    prepare({ title, type, media }) {
      return {
        title,
        subtitle: type ? getTitle(MEMBER_TYPES, type) : "Sin tipo",
        media,
      };
    },
  },
});
