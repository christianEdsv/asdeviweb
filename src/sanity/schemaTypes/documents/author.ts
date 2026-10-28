import { UsersIcon } from "lucide-react";
import { defineField, defineType } from "sanity";

/** Autor de noticias (referenciado desde `post`). */
export const authorType = defineType({
  name: "author",
  title: "Autor",
  type: "document",
  icon: UsersIcon,
  fields: [
    defineField({
      name: "name",
      title: "Nombre",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "role", title: "Cargo o rol", type: "string" }),
    defineField({
      name: "avatar",
      title: "Foto",
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
      name: "bio",
      title: "Biografía corta",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.max(300),
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "role", media: "avatar" },
  },
});
