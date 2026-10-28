import { defineField, defineType } from "sanity";
import { extractYouTubeId } from "@/lib/youtube";

/** Video de YouTube embebido dentro de un cuerpo de Portable Text. */
export const youtubeType = defineType({
  name: "youtube",
  title: "Video de YouTube",
  type: "object",
  fields: [
    defineField({
      name: "url",
      title: "URL del video",
      type: "url",
      description: "Ejemplo: https://www.youtube.com/watch?v=XXXXXXXXXXX",
      validation: (Rule) =>
        Rule.required()
          .uri({ scheme: ["https"] })
          .custom((value) =>
            !value || extractYouTubeId(value)
              ? true
              : "Introduce una URL válida de YouTube (youtube.com o youtu.be).",
          ),
    }),
    defineField({
      name: "title",
      title: "Título descriptivo",
      type: "string",
      description: "Describe el video para lectores de pantalla (accesibilidad).",
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { title: "title", url: "url" },
    prepare({ title, url }) {
      return { title: title || "Video de YouTube", subtitle: url };
    },
  },
});
