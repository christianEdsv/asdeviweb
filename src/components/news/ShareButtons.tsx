"use client";

import { useState } from "react";
import { Check, Link2, MessageCircle } from "lucide-react";
import {
  FacebookIcon,
  LinkedInIcon,
  XIcon,
} from "@/components/icons/brands";
import { Button } from "@/components/ui/button";

interface ShareButtonsProps {
  url: string;
  title: string;
}

export function ShareButtons({ url, title }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const targets = [
    {
      label: "Compartir en X",
      href: `https://x.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      Icon: XIcon,
    },
    {
      label: "Compartir en LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      Icon: LinkedInIcon,
    },
    {
      label: "Compartir en Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      Icon: FacebookIcon,
    },
    {
      label: "Compartir por WhatsApp",
      href: `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`,
      Icon: MessageCircle,
    },
  ];

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      // Si el navegador bloquea el portapapeles no se lanza error visible.
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="mr-1 text-xs font-medium text-muted-foreground">
        Compartir:
      </span>
      {targets.map(({ label, href, Icon }) => (
        <Button
          key={label}
          asChild
          variant="outline"
          size="icon-sm"
          className="border-border bg-surface hover:border-primary/60"
        >
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            title={label}
          >
            <Icon className="size-3.5" />
          </a>
        </Button>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleCopy}
        className="border-border bg-surface hover:border-primary/60"
      >
        {copied ? (
          <>
            <Check className="size-3.5 text-accent" aria-hidden />
            Enlace copiado
          </>
        ) : (
          <>
            <Link2 className="size-3.5" aria-hidden />
            Copiar enlace
          </>
        )}
      </Button>
    </div>
  );
}
