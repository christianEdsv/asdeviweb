import type { RichText } from "@/types/content";

/**
 * Serializa un objeto JSON-LD de forma segura para inyectarlo en un <script>.
 * Se escapa `<` para evitar cierres de etiqueta (XSS), y los separadores de
 * línea Unicode, según la guía de Next.js.
 */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

/** Extrae el texto plano de un cuerpo Portable Text (para descripciones). */
export function portableTextToPlain(blocks: RichText | undefined): string {
  if (!blocks) return "";
  return blocks
    .map((block) => {
      if (block._type !== "block" || !Array.isArray(block.children)) return "";
      return (block.children as unknown[])
        .map((child) =>
          typeof (child as { text?: unknown }).text === "string"
            ? (child as { text: string }).text
            : "",
        )
        .join("");
    })
    .filter(Boolean)
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}
