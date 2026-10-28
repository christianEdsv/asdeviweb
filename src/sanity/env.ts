/**
 * Variables de entorno de Sanity. Son públicas por diseño (`NEXT_PUBLIC_*`):
 * identifican el proyecto, pero NO otorgan acceso de escritura.
 * No se usa ningún token de API en el cliente.
 */

const rawProjectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID?.trim() ?? "";

/** Un projectId válido de Sanity usa solo minúsculas, dígitos y guiones. */
export const projectId = /^[a-z0-9-]+$/.test(rawProjectId) ? rawProjectId : "";

export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET?.trim() ?? "";

export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION?.trim() ?? "2025-02-19";

/**
 * Indica si el CMS está conectado. Si es `false`, la capa de datos devuelve
 * datos de prueba (mocks) y `/studio` muestra instrucciones de configuración.
 */
export const isSanityConfigured = Boolean(projectId && dataset);

/** Ruta donde está montado el Studio embebido. */
export const studioBasePath = "/studio";
