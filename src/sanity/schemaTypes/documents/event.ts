import { CalendarIcon } from "lucide-react";
import { defineField, defineType } from "sanity";
import {
  EVENT_MODES,
  EVENT_TYPES,
  getTitle,
} from "@/lib/taxonomies";

export const eventType = defineType({
  name: "event",
  title: "Evento",
  type: "document",
  icon: CalendarIcon,
  groups: [
    { name: "main", title: "Evento", default: true },
    { name: "where", title: "Modalidad y lugar" },
    { name: "content", title: "Descripción" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Título",
      type: "string",
      group: "main",
      validation: (Rule) => Rule.required().min(4).max(120),
    }),
    defineField({
      name: "slug",
      title: "Slug (URL)",
      type: "slug",
      group: "main",
      description: "Dirección única: /eventos/<slug>",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "coverImage",
      title: "Imagen de portada",
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
      name: "eventType",
      title: "Tipo de evento",
      type: "string",
      group: "main",
      options: {
        list: EVENT_TYPES.map(({ title, value }) => ({ title, value })),
        layout: "radio",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "startDate",
      title: "Fecha y hora de inicio",
      type: "datetime",
      group: "main",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "endDate",
      title: "Fecha y hora de fin",
      type: "datetime",
      group: "main",
      validation: (Rule) =>
        Rule.custom((endDate, context) => {
          const startDate = (context.document as { startDate?: string } | undefined)
            ?.startDate;
          if (!endDate || !startDate) return true;
          return new Date(endDate) >= new Date(startDate)
            ? true
            : "La fecha de fin no puede ser anterior a la de inicio.";
        }),
    }),
    defineField({
      name: "mode",
      title: "Modalidad",
      type: "string",
      group: "where",
      options: {
        list: EVENT_MODES.map(({ title, value }) => ({ title, value })),
        layout: "radio",
      },
      initialValue: "presencial",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "locationName",
      title: "Nombre del lugar",
      type: "string",
      group: "where",
      description: "Ejemplo: Centro de Convenciones, Sala 2",
      hidden: ({ document }) => document?.mode === "online",
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const mode = (context.document as { mode?: string } | undefined)?.mode;
          return (mode === "presencial" || mode === "hibrido") && !value
            ? "Indica el lugar para eventos presenciales o híbridos."
            : true;
        }),
    }),
    defineField({
      name: "address",
      title: "Dirección",
      type: "string",
      group: "where",
      hidden: ({ document }) => document?.mode === "online",
    }),
    defineField({
      name: "streamUrl",
      title: "Enlace de transmisión / sala virtual",
      type: "url",
      group: "where",
      description: "YouTube, Twitch, Zoom, Discord, etc.",
      hidden: ({ document }) => document?.mode === "presencial",
      validation: (Rule) =>
        Rule.uri({ scheme: ["https", "http"] }).custom((value, context) => {
          const mode = (context.document as { mode?: string } | undefined)?.mode;
          return (mode === "online" || mode === "hibrido") && !value
            ? "Indica el enlace para eventos online o híbridos."
            : true;
        }),
    }),
    defineField({
      name: "summary",
      title: "Resumen corto",
      type: "text",
      rows: 3,
      group: "content",
      description: "Se usa en tarjetas y como meta descripción por defecto.",
      validation: (Rule) => Rule.max(200),
    }),
    defineField({
      name: "description",
      title: "Descripción",
      type: "blockContent",
      group: "content",
    }),
    defineField({
      name: "registrationUrl",
      title: "Enlace de inscripción",
      type: "url",
      group: "content",
      description: "Eventbrite, Google Forms, etc.",
      validation: (Rule) => Rule.uri({ scheme: ["https", "http"] }),
    }),
    defineField({ name: "seo", title: "SEO", type: "seo", group: "seo" }),
  ],
  orderings: [
    {
      title: "Fecha de inicio (más reciente primero)",
      name: "startDateDesc",
      by: [{ field: "startDate", direction: "desc" }],
    },
    {
      title: "Fecha de inicio (más antiguo primero)",
      name: "startDateAsc",
      by: [{ field: "startDate", direction: "asc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      type: "eventType",
      mode: "mode",
      start: "startDate",
      media: "coverImage",
    },
    prepare({ title, type, mode, start, media }) {
      const date = start ? new Date(start).toLocaleDateString("es") : "Sin fecha";
      return {
        title,
        subtitle: [
          type ? getTitle(EVENT_TYPES, type) : null,
          mode ? getTitle(EVENT_MODES, mode) : null,
          date,
        ]
          .filter(Boolean)
          .join(" · "),
        media,
      };
    },
  },
});
