import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "@/sanity/env";

/**
 * Cliente de solo lectura. Para ISR con revalidación por etiquetas se evita
 * el CDN de la API (`useCdn: false`) y así la revalidación obtiene siempre
 * contenido fresco desde Content Lake.
 */
export const client = createClient({
  projectId: projectId || "missing-project-id",
  dataset: dataset || "production",
  apiVersion,
  useCdn: false,
  perspective: "published",
});
