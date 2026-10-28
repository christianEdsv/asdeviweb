import { Settings as CogIcon } from "lucide-react";
import { defineArrayMember, defineField, defineType } from "sanity";

const httpUrl = { scheme: ["https", "http"] };

/**
 * Ajustes globales (singleton, `_id: "siteSettings"`): contacto, redes y
 * contenido de la página «Sobre Nosotros».
 */
export const siteSettingsType = defineType({
  name: "siteSettings",
  title: "Ajustes del sitio",
  type: "document",
  icon: CogIcon,
  groups: [
    { name: "contact", title: "Contacto y redes", default: true },
    { name: "about", title: "Sobre Nosotros" },
    { name: "board", title: "Junta directiva" },
    { name: "faq", title: "Preguntas frecuentes" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "email",
      title: "Correo oficial",
      type: "string",
      group: "contact",
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: "socials",
      title: "Redes sociales",
      type: "object",
      group: "contact",
      fields: [
        defineField({ name: "discord", title: "Discord", type: "url", validation: (Rule) => Rule.uri(httpUrl) }),
        defineField({ name: "x", title: "X (Twitter)", type: "url", validation: (Rule) => Rule.uri(httpUrl) }),
        defineField({ name: "youtube", title: "YouTube", type: "url", validation: (Rule) => Rule.uri(httpUrl) }),
        defineField({ name: "instagram", title: "Instagram", type: "url", validation: (Rule) => Rule.uri(httpUrl) }),
        defineField({ name: "linkedin", title: "LinkedIn", type: "url", validation: (Rule) => Rule.uri(httpUrl) }),
      ],
    }),
    defineField({
      name: "aboutIntro",
      title: "Introducción",
      type: "text",
      rows: 3,
      group: "about",
      description: "Frase de apertura de la página Sobre Nosotros.",
    }),
    defineField({
      name: "missionSummary",
      title: "Resumen de la misión (Inicio)",
      type: "text",
      rows: 3,
      group: "about",
      validation: (Rule) => Rule.max(280),
    }),
    defineField({ name: "mission", title: "Misión", type: "text", rows: 4, group: "about" }),
    defineField({ name: "vision", title: "Visión", type: "text", rows: 4, group: "about" }),
    defineField({
      name: "history",
      title: "Historia (línea de tiempo)",
      type: "array",
      group: "about",
      of: [
        defineArrayMember({
          type: "object",
          name: "timelineEntry",
          fields: [
            defineField({ name: "year", title: "Año", type: "string", validation: (Rule) => Rule.required() }),
            defineField({ name: "title", title: "Hito", type: "string", validation: (Rule) => Rule.required() }),
            defineField({ name: "description", title: "Descripción", type: "text", rows: 3 }),
          ],
          preview: { select: { title: "title", subtitle: "year" } },
        }),
      ],
    }),
    defineField({
      name: "objectives",
      title: "Objetivos del gremio",
      type: "array",
      group: "about",
      of: [
        defineArrayMember({
          type: "object",
          name: "objective",
          fields: [
            defineField({ name: "title", title: "Objetivo", type: "string", validation: (Rule) => Rule.required() }),
            defineField({ name: "description", title: "Descripción", type: "text", rows: 3 }),
          ],
          preview: { select: { title: "title", subtitle: "description" } },
        }),
      ],
    }),
    defineField({
      name: "joinIntro",
      title: "Texto «Cómo unirse»",
      type: "text",
      rows: 3,
      group: "about",
      description: "Explica el estado de las convocatorias de ingreso.",
    }),
    defineField({
      name: "board",
      title: "Junta directiva / equipo organizador",
      type: "array",
      group: "board",
      of: [
        defineArrayMember({
          type: "object",
          name: "boardMember",
          fields: [
            defineField({ name: "name", title: "Nombre", type: "string", validation: (Rule) => Rule.required() }),
            defineField({ name: "role", title: "Cargo", type: "string", validation: (Rule) => Rule.required() }),
            defineField({
              name: "photo",
              title: "Foto",
              type: "image",
              options: { hotspot: true },
              fields: [
                defineField({ name: "alt", title: "Texto alternativo", type: "string", validation: (Rule) => Rule.required() }),
              ],
            }),
            defineField({ name: "bio", title: "Biografía corta", type: "text", rows: 3, validation: (Rule) => Rule.max(280) }),
            defineField({ name: "links", title: "Enlaces", type: "array", of: [{ type: "externalLink" }] }),
          ],
          preview: { select: { title: "name", subtitle: "role", media: "photo" } },
        }),
      ],
    }),
    defineField({
      name: "faqs",
      title: "Preguntas frecuentes",
      type: "array",
      group: "faq",
      of: [
        defineArrayMember({
          type: "object",
          name: "faq",
          fields: [
            defineField({ name: "question", title: "Pregunta", type: "string", validation: (Rule) => Rule.required() }),
            defineField({ name: "answer", title: "Respuesta", type: "text", rows: 4, validation: (Rule) => Rule.required() }),
          ],
          preview: { select: { title: "question", subtitle: "answer" } },
        }),
      ],
    }),
    defineField({ name: "seo", title: "SEO (Sobre Nosotros)", type: "seo", group: "seo" }),
  ],
  preview: {
    prepare: () => ({ title: "Ajustes del sitio" }),
  },
});
