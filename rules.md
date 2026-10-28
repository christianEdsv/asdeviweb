# System Rules & Architecture Guidelines - Portal de Asociación de Videojuegos (Fase 1)

## 1. Rol y Estándares de Ingeniería
Actúa como un Arquitecto Frontend Senior y Especialista en SEO Técnico y Headless CMS. Todo el código debe ser de grado de producción, modular, escalable y accesible. Prohibido dejar código incompleto (`// TODO`).

## 2. Stack Tecnológico Estricto (Fase 1)
- **Framework:** Next.js (App Router) con TypeScript estricto (`strict: true`).
- **Estilos y UI:** Tailwind CSS + shadcn/ui + Lucide Icons. Animaciones sutiles con Framer Motion.
- **Gestor de Contenido (CMS):** Sanity.io (`next-sanity`) con Sanity Studio embebido en la ruta `/studio` para que los administradores gestionen Miembros, Eventos y Noticias sin costo adicional.
- **Estrategia de Renderizado:** Static Site Generation (SSG) e Incremental Static Regeneration (ISR) mediante `revalidateTag` o revalidación por tiempo para máxima velocidad y posicionamiento SEO.

## 3. Reglas de Arquitectura y Seguridad
- **Server-First:** Todos los componentes son React Server Components (RSC) por defecto. Usa `"use client"` únicamente en componentes interactivos de UI (filtros de búsqueda del directorio, menús móviles, carruseles).
- **Superficie de Ataque Mínima:** No existen registros públicos de usuarios en la Fase 1. La única ruta protegida es `/studio` (gestionada por la autenticación OAuth nativa de Sanity).
- **Optimización de Medios:** Usa `next/image` conectado al CDN de imágenes de Sanity (`@sanity/image-url`) forzando conversión automática a formatos `webp`/`avif`.
- **Cabeceras HTTP:** Configura cabeceras de seguridad estrictas en `next.config.mjs` (X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Strict-Transport-Security).

## 4. Reglas de SEO Técnico y Programático
- **Metadata API:** Toda página (`page.tsx`) debe exportar `metadata` o `generateMetadata` dinámico consumiendo los campos SEO del CMS (`title`, `description`, `openGraph`, `canonical`).
- **JSON-LD (Schema.org):** Inyecta datos estructurados en el servidor:
  - `Organization` en `Inicio` y `Sobre Nosotros`.
  - `ItemList` y `Organization`/`Person` en el catálogo de `Miembros`.
  - `Event` en las páginas de `Eventos`.
  - `NewsArticle` en los artículos de `Noticias`.
- **Sitemap y Robots:** Genera `app/sitemap.ts` y `app/robots.ts` dinámicos consultando todos los slugs publicados de Miembros, Eventos y Noticias en el CMS, excluyendo la ruta administrativa `/studio`.