"use client";

import type { HTMLAttributes, MouseEvent } from "react";
import { cn } from "@/lib/utils";

interface SpotlightCardProps extends HTMLAttributes<HTMLElement> {
  as?: "article" | "div" | "li" | "section";
}

/**
 * Superficie interactiva que proyecta un foco radial (`--spot-x`, `--spot-y`)
 * siguiendo el puntero y activa esquinas técnicas estilo visor HUD.
 */
export function SpotlightCard({
  as: Comp = "article",
  className,
  children,
  onMouseMove,
  ...props
}: SpotlightCardProps) {
  function handleMove(event: MouseEvent<HTMLElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty(
      "--spot-x",
      `${event.clientX - rect.left}px`,
    );
    event.currentTarget.style.setProperty(
      "--spot-y",
      `${event.clientY - rect.top}px`,
    );
    onMouseMove?.(event);
  }

  return (
    <Comp
      onMouseMove={handleMove}
      className={cn("spotlight-card hud-corners", className)}
      {...props}
    >
      {children}
    </Comp>
  );
}
