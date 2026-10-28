# ASDEVI — Plataforma Oficial (Fase 1)

Portal institucional de la **Asociación de Desarrolladores de Videojuegos**, construido con **Next.js (App Router)**, **TypeScript estricto**, **Tailwind CSS + shadcn/ui** y **Sanity.io** embebido en `/studio`.

## Arquitectura

- **Server-First (RSC):** todas las páginas y secciones son React Server Components; `"use client"` se limita a navegación interactiva, buscador/filtros en tiempo real, carrusel, botones de compartir y Sanity Studio.
- **SSG + ISR:** todas las rutas públicas se pre-renderizan estáticamente con `generateStaticParams`, revalidación por tiempo (`revalidate = 3600`) y revalidación bajo demanda por etiquetas (`POST /api/revalidate` + `revalidateTag(tag, "max")`).
- **Dos layouts raíz aislados:** `src/app/(site)/layout.tsx` (sitio público con Navbar + Footer) y `src/app/studio/layout.tsx` (Sanity Studio sin estilos ni navegación del sitio).
- **Datos de prueba automáticos:** si `NEXT_PUBLIC_SANITY_PROJECT_ID` y `NEXT_PUBLIC_SANITY_DATASET` están vacíos, `src/data/index.ts` sirve los mocks tipados de `src/data/mock/*`.
- **Seguridad HTTP (`next.config.mjs`):** `Strict-Transport-Security`, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, CSP en el sitio público y `cdn.sanity.io` habilitado en `next/image` con formatos `avif` y `webp`.
- **SEO técnico y programático:** `generateMetadata` dinámico en cada ruta, `sitemap.xml` y `robots.txt` dinámicos (excluyendo `/studio`) e inyección de JSON-LD (`Organization`, `WebSite`, `FAQPage`, `ItemList`, `Person`, `Event`, `NewsArticle`, `BreadcrumbList`).

## Requisitos

- **Node.js ≥ 20.19** (o **≥ 22.12 LTS**).

## Desarrollo local

```bash
cp .env.example .env.local
npm install
npm run dev
```

- Sitio público: `http://localhost:3000`
- Sanity Studio: `http://localhost:3000/studio`

## Conectar Sanity.io

1. Crea un proyecto en [sanity.io/manage](https://www.sanity.io/manage).
2. En **API → CORS origins**, añade `http://localhost:3000` y el dominio de producción marcando **Allow credentials**.
3. Completa en `.env.local`:
   ```env
   NEXT_PUBLIC_SITE_URL="https://tu-dominio.org"
   NEXT_PUBLIC_SANITY_PROJECT_ID="tu_project_id"
   NEXT_PUBLIC_SANITY_DATASET="production"
   SANITY_REVALIDATE_SECRET="un_secreto_largo_y_aleatorio"
   ```
4. (Opcional) Crea un webhook en Sanity apuntando a `https://tu-dominio.org/api/revalidate` con el mismo `SANITY_REVALIDATE_SECRET` y proyección `{ "_type": _type }`.
