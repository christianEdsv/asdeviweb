import { ImageIcon, PlayIcon } from "lucide-react";
import { defineArrayMember, defineField, defineType } from "sanity";

/** Configuración común de bloques de texto enriquecido. */
const textBlock = defineArrayMember({
  type: "block",
  styles: [
    { title: "Párrafo", value: "normal" },
    { title: "Título (H2)", value: "h2" },
    { title: "Subtítulo (H3)", value: "h3" },
    { title: "Encabezado (H4)", value: "h4" },
    { title: "Cita", value: "blockquote" },
  ],
  lists: [
    { title: "Viñetas", value: "bullet" },
    { title: "Numerada", value: "number" },
  ],
  marks: {
    decorators: [
      { title: "Negrita", value: "strong" },
      { title: "Cursiva", value: "em" },
      { title: "Código", value: "code" },
    ],
    annotations: [
      {
        name: "link",
        type: "object",
        title: "Enlace",
        fields: [
          defineField({
            name: "href",
            type: "url",
            title: "URL",
            validation: (Rule) =>
              Rule.required().uri({
                scheme: ["http", "https", "mailto", "tel"],
                allowRelative: true,
              }),
          }),
          defineField({
            name: "blank",
            type: "boolean",
            title: "Abrir en pestaña nueva",
            initialValue: true,
          }),
        ],
      },
    ],
  },
});

const imageBlock = defineArrayMember({
  type: "image",
  icon: ImageIcon,
  options: { hotspot: true },
  fields: [
    defineField({
      name: "alt",
      type: "string",
      title: "Texto alternativo",
      description: "Obligatorio: describe la imagen para accesibilidad y SEO.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "caption", type: "string", title: "Pie de imagen" }),
  ],
});

/** Texto enriquecido con imágenes (descripción de eventos). */
export const blockContentType = defineType({
  name: "blockContent",
  title: "Contenido enriquecido",
  type: "array",
  of: [textBlock, imageBlock],
});

/** Texto enriquecido con imágenes y videos de YouTube (cuerpo de noticias). */
export const postBodyType = defineType({
  name: "postBody",
  title: "Cuerpo de la noticia",
  type: "array",
  of: [
    textBlock,
    imageBlock,
    defineArrayMember({ type: "youtube", icon: PlayIcon }),
  ],
});
