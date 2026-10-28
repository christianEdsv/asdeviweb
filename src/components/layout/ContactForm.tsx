"use client";

import type { FormEvent } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ContactFormProps {
  email: string;
}

/**
 * Formulario de contacto ligero. Para mantener una superficie de ataque
 * mínima en la Fase 1 no expone ningún endpoint de envío: construye un
 * enlace `mailto:` con asunto y cuerpo codificados y abre el cliente de correo.
 */
export function ContactForm({ email }: ContactFormProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const subject =
      String(data.get("subject") ?? "").trim() || "Contacto desde la web";
    const message = String(data.get("message") ?? "").trim();

    const body = name ? `${message}\n\n— ${name}` : message;
    const href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = href;
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 rounded-2xl border border-border bg-surface p-5"
    >
      <p className="text-sm font-semibold text-foreground">
        Envíanos un mensaje rápido
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className="sr-only">
            Tu nombre o estudio
          </label>
          <Input
            id="contact-name"
            name="name"
            placeholder="Tu nombre o estudio"
            autoComplete="name"
            maxLength={80}
            className="bg-background/70"
          />
        </div>
        <div>
          <label htmlFor="contact-subject" className="sr-only">
            Asunto
          </label>
          <Input
            id="contact-subject"
            name="subject"
            placeholder="Asunto (prensa, alianza, duda…)"
            required
            maxLength={120}
            className="bg-background/70"
          />
        </div>
      </div>
      <div>
        <label htmlFor="contact-message" className="sr-only">
          Mensaje
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={3}
          maxLength={1500}
          placeholder="Cuéntanos en qué podemos ayudarte…"
          className="w-full rounded-md border border-input bg-background/70 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
        />
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
        <p className="text-xs text-muted-foreground">
          Abrirá tu aplicación de correo hacia{" "}
          <span className="text-foreground">{email}</span>.
        </p>
        <Button type="submit" size="sm">
          <Send className="size-3.5" aria-hidden />
          Redactar correo
        </Button>
      </div>
    </form>
  );
}
