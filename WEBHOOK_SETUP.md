# Configuración de On-Demand Revalidation (Webhook de Sanity.io)

Este documento describe cómo conectar **Sanity Studio** con el endpoint seguro `/api/revalidate` para que cualquier cambio publicado en **Miembros (`member`)**, **Eventos (`event`)**, **Noticias (`post`)**, **Autores (`author`)** o **Configuración (`siteSettings`)** actualice el sitio en producción al instante mediante **ISR basado en Tags**.

---

## 1. Generar y configurar `SANITY_REVALIDATE_SECRET`

1. Genera un secreto aleatorio seguro (por ejemplo, de 32 bytes en hexadecimal):
   ```bash
   openssl rand -hex 32
   ```
2. Añádelo a tus variables de entorno en producción (Vercel / servidor) y en tu `.env.local`:
   ```env
   SANITY_REVALIDATE_SECRET="pega_aqui_tu_secreto_generado"
   ```

---

## 2. Crear el Webhook en el panel de Sanity.io

1. Ingresa a [sanity.io/manage](https://www.sanity.io/manage) y selecciona tu proyecto.
2. Ve a la pestaña **API** → sección **Webhooks** → haz clic en **Create webhook**.
3. Completa los campos exactamente con la siguiente configuración:

| Campo | Valor |
| :--- | :--- |
| **Name** | `Next.js On-Demand Revalidation (ISR)` |
| **URL** | `https://tu-dominio.org/api/revalidate` |
| **Dataset** | `production` |
| **Trigger on** | ✅ **Create**, ✅ **Update**, ✅ **Delete** |
| **Filter (GROQ)** | `_type in ["member", "event", "post", "author", "siteSettings"]` |
| **Projection (GROQ)** | Ver bloque inferior |
| **Status** | ✅ **Enable webhook** |
| **HTTP method** | `POST` |
| **Secret** | *(El mismo valor exacto definido en `SANITY_REVALIDATE_SECRET`)* |

### Proyección GROQ exacta (pegar en el campo *Projection*)

```groq
{
  _id,
  _type,
  slug
}
```

> El endpoint `/api/revalidate` lee `body._type` y `body.slug.current` (también soporta `"slug": slug.current` si prefieres proyectarlo como string plano).

---

## 3. Qué invalida cada publicación

Cuando Sanity dispara el webhook firmado hacia `POST /api/revalidate`:

1. **Verificación de firma HMAC:** `parseBody` de `next-sanity/webhook` valida la cabecera `sanity-webhook-signature` usando `SANITY_REVALIDATE_SECRET`. Si falta el secreto o la firma no coincide, responde `401 Unauthorized`.
2. **Invalidación de listados y portada:** ejecuta `revalidateTag(body._type, "max")`, actualizando `/` y los índices (`/miembros`, `/eventos`, `/noticias`).
3. **Invalidación de detalle individual y Sitemap:** si el documento incluye `slug.current`, ejecuta además `revalidateTag("${_type}:${slug.current}", "max")` y `revalidatePath("/sitemap.xml")` para reflejar de inmediato el cambio tanto en la vista individual como en el SEO programático.
