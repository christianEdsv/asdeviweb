import { NextStudio } from "next-sanity/studio";
import config from "../../../../sanity.config";
import { isSanityConfigured } from "@/sanity/env";

export { metadata, viewport } from "next-sanity/studio";

export const dynamic = "force-static";

/** Genera únicamente la raíz `/studio`; el resto de rutas las maneja el Studio en el cliente. */
export function generateStaticParams() {
  return [{ tool: [] as string[] }];
}

export default function StudioPage() {
  if (!isSanityConfigured) {
    return <StudioSetupNotice />;
  }
  return <NextStudio config={config} />;
}

/** Instrucciones mostradas mientras no existan las variables de entorno del CMS. */
function StudioSetupNotice() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: "2rem",
        background: "#0b0d12",
        color: "#e8eaf0",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <section style={{ maxWidth: "40rem", lineHeight: 1.6 }}>
        <h1 style={{ fontSize: "1.75rem", marginBottom: "0.75rem" }}>
          Sanity Studio sin configurar
        </h1>
        <p style={{ color: "#9aa3b5" }}>
          El sitio funciona con datos de prueba. Para activar el panel de
          administración conecta tu proyecto de Sanity:
        </p>
        <ol style={{ paddingLeft: "1.25rem", marginTop: "1rem" }}>
          <li>
            Crea un proyecto en{" "}
            <a href="https://www.sanity.io/manage" style={{ color: "#a692ff" }}>
              sanity.io/manage
            </a>{" "}
            y añade este dominio en <code>API → CORS origins</code> (con
            credenciales).
          </li>
          <li>
            Copia <code>.env.example</code> a <code>.env.local</code> y define{" "}
            <code>NEXT_PUBLIC_SANITY_PROJECT_ID</code> y{" "}
            <code>NEXT_PUBLIC_SANITY_DATASET</code>.
          </li>
          <li>Reinicia el servidor y vuelve a abrir esta página.</li>
        </ol>
      </section>
    </main>
  );
}
