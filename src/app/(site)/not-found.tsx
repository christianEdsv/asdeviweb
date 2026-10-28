import Link from "next/link";
import { Gamepad2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="container-page flex min-h-[65vh] flex-col items-center justify-center py-20 text-center">
      <div className="mb-5 flex size-14 items-center justify-center rounded-2xl bg-primary/15 text-primary-soft">
        <Gamepad2 className="size-7" aria-hidden />
      </div>
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
        Error 404
      </p>
      <h1 className="mt-2 text-3xl font-bold text-foreground sm:text-4xl">
        Página no encontrada
      </h1>
      <p className="mt-3 max-w-md text-sm text-muted-foreground">
        El contenido que buscas no existe o ha cambiado de dirección.
      </p>
      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <Button asChild>
          <Link href="/">Volver al inicio</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/miembros">Ver directorio de miembros</Link>
        </Button>
      </div>
    </section>
  );
}
