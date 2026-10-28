import { serializeJsonLd } from "@/lib/jsonld";

interface JsonLdProps {
  /** Uno o varios objetos Schema.org. */
  data: Record<string, unknown> | Record<string, unknown>[];
}

/**
 * Inyecta datos estructurados (Schema.org) renderizados en el servidor.
 * Es un Server Component: el JSON-LD llega ya en el HTML inicial.
 */
export function JsonLd({ data }: JsonLdProps) {
  const items = Array.isArray(data) ? data : [data];
  return (
    <>
      {items.map((item, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(item) }}
        />
      ))}
    </>
  );
}
