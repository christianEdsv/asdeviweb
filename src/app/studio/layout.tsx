import { NextStudioLayout } from "next-sanity/studio";

/**
 * Layout raíz independiente para el Studio: no hereda la navbar, el footer
 * ni los estilos del sitio público (ver `app/(site)/layout.tsx`).
 */
export default function StudioRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body style={{ margin: 0 }}>
        <NextStudioLayout>{children}</NextStudioLayout>
      </body>
    </html>
  );
}
