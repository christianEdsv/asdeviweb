import { defineField, defineType } from "sanity";
import { MEMBER_LINK_TYPES } from "@/lib/taxonomies";

/** Enlace externo (web, Steam, itch.io, redes sociales…). */
export const externalLinkType = defineType({
  name: "externalLink",
  title: "Enlace externo",
  type: "object",
  fields: [
    defineField({
      name: "type",
      title: "Tipo",
      type: "string",
      options: {
        list: MEMBER_LINK_TYPES.map(({ title, value }) => ({ title, value })),
        layout: "dropdown",
      },
      initialValue: "web",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "url",
      title: "URL",
      type: "url",
      validation: (Rule) =>
        Rule.required().uri({ scheme: ["https", "http"] }),
    }),
    defineField({
      name: "label",
      title: "Etiqueta (opcional)",
      type: "string",
      description: "Texto personalizado para el botón. Si se omite se usa el nombre del tipo.",
    }),
  ],
  preview: {
    select: { type: "type", url: "url", label: "label" },
    prepare({ type, url, label }) {
      const typeTitle =
        MEMBER_LINK_TYPES.find((item) => item.value === type)?.title ?? type;
      return { title: label || typeTitle, subtitle: url };
    },
  },
});
