"use client";

import { useEffect, useState, type MouseEvent } from "react";
import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { ArrowUpRight, Disc3, Gamepad2, Sparkles } from "lucide-react";
import { SanityImage } from "@/components/common/SanityImage";
import { MEMBER_TYPES, getTitle } from "@/lib/taxonomies";
import type { Member } from "@/types/content";

interface HeroShowcaseDeckProps {
  members: Member[];
}

const AUTOPLAY_MS = 4500;

/**
 * Consola / Cartucho interactivo de portada:
 * - Rotación automática tipo slider con barra de progreso y pausa al pasar el cursor.
 * - Inclinación 3D suave siguiendo el cursor (Framer Motion springs).
 * - Selector en vivo de estudios y juegos destacados con transición cruzada.
 */
export function HeroShowcaseDeck({ members }: HeroShowcaseDeckProps) {
  const showcaseItems = members
    .filter((m) => m.featuredGame)
    .concat(members.filter((m) => !m.featuredGame))
    .slice(0, 4);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const reduceMotion = useReducedMotion();
  const totalSlots = showcaseItems.length;

  useEffect(() => {
    if (totalSlots <= 1 || isPaused) return;
    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % totalSlots);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(timer);
  }, [totalSlots, isPaused, activeIndex]);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [6, -6]), {
    stiffness: 220,
    damping: 24,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-7, 7]), {
    stiffness: 220,
    damping: 24,
  });

  function handleMouseEnter() {
    setIsPaused(true);
  }

  function handleMouseMove(event: MouseEvent<HTMLDivElement>) {
    if (reduceMotion) return;
    const rect = event.currentTarget.getBoundingClientRect();
    mouseX.set((event.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((event.clientY - rect.top) / rect.height - 0.5);
  }

  function handleMouseLeave() {
    setIsPaused(false);
    mouseX.set(0);
    mouseY.set(0);
  }

  const current = showcaseItems[activeIndex] ?? showcaseItems[0];
  if (!current) return null;

  const visual = current.featuredGame?.image ?? current.logo;

  return (
    <div
      className="relative"
      style={{ perspective: "1200px" }}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={() => setIsPaused(false)}
    >
      {/* Halo decorativo detrás del cartucho */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-4 -z-10 rounded-3xl bg-gradient-to-tr from-primary/20 via-accent/15 to-cyan/15 blur-2xl"
      />

      <motion.div
        style={reduceMotion ? undefined : { rotateX, rotateY }}
        className="hud-corners relative overflow-hidden rounded-2xl border border-border bg-surface/95 shadow-2xl"
      >
        {/* Barra superior tipo terminal / dev-kit */}
        <div className="flex items-center justify-between border-b border-border bg-background/80 px-4 py-2.5">
          <div className="flex items-center gap-2">
            <span className="pulse-dot size-2 rounded-full bg-primary" />
            <span className="tech-tag text-primary">
              STUDIO // 0{activeIndex + 1}
            </span>
          </div>
          <span className="tech-tag flex items-center gap-1.5 text-muted-foreground">
            <Disc3 className="size-3.5 animate-spin text-accent" aria-hidden />
            MIEMBROS ACTIVOS
          </span>
        </div>

        {/* Visor de proyecto con transición AnimatePresence */}
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-background">
          <AnimatePresence mode="wait">
            <motion.div
              key={current._id}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0"
            >
              {visual ? (
                <SanityImage
                  image={visual}
                  fill
                  priority
                  sizes="(min-width: 1024px) 520px, 100vw"
                  className="object-cover"
                />
              ) : null}
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-surface via-surface/35 to-transparent"
              />
            </motion.div>
          </AnimatePresence>

          {/* Etiqueta flotante superior */}
          <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5">
            <span className="tech-tag rounded-md border border-border/80 bg-background/85 px-2.5 py-1 text-foreground backdrop-blur-md">
              {getTitle(MEMBER_TYPES, current.memberType)}
            </span>
            {current.featuredGame?.platform ? (
              <span className="tech-tag rounded-md bg-primary px-2.5 py-1 font-bold text-primary-foreground">
                {current.featuredGame.platform}
              </span>
            ) : null}
          </div>

          {/* Información superpuesta inferior */}
          <div className="absolute inset-x-0 bottom-0 p-5">
            <AnimatePresence mode="wait">
              <motion.div
                key={current._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.28 }}
              >
                <p className="tech-tag flex items-center gap-1.5 text-primary">
                  <Gamepad2 className="size-3.5" aria-hidden />
                  {current.featuredGame
                    ? `PROYECTO // ${current.featuredGame.title}`
                    : "PERFIL DESTACADO"}
                </p>
                <div className="mt-1 flex items-end justify-between gap-3">
                  <div>
                    <h2 className="text-2xl font-extrabold text-foreground">
                      {current.name}
                    </h2>
                    <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                      {current.featuredGame?.description ?? current.bio}
                    </p>
                  </div>
                  <Link
                    href={`/miembros/${current.slug}`}
                    aria-label={`Ver perfil de ${current.name}`}
                    className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-transform hover:scale-105"
                  >
                    <ArrowUpRight className="size-5" aria-hidden />
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Selector de slots del cartucho */}
        <div
          role="tablist"
          aria-label="Proyectos destacados de miembros"
          className="grid grid-cols-4 border-t border-border bg-background/60"
        >
          {showcaseItems.map((item, idx) => {
            const isSelected = idx === activeIndex;
            return (
              <button
                key={item._id}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => setActiveIndex(idx)}
                className={`group relative flex flex-col items-start border-r border-border px-3 py-3 text-left transition-colors last:border-r-0 ${
                  isSelected
                    ? "bg-surface-elevated text-foreground"
                    : "text-muted-foreground hover:bg-surface hover:text-foreground"
                }`}
              >
                {isSelected ? (
                  <span
                    aria-hidden
                    className="absolute inset-x-0 top-0 h-0.5 overflow-hidden bg-border"
                  >
                    <motion.span
                      key={`${item._id}-${isPaused ? "paused" : "play"}`}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: isPaused ? 0.35 : 1 }}
                      transition={{
                        duration: isPaused ? 0.25 : AUTOPLAY_MS / 1000,
                        ease: "linear",
                      }}
                      className="block h-full w-full origin-left bg-primary"
                    />
                  </span>
                ) : null}
                <span className="tech-tag text-[10px] text-primary">
                  0{idx + 1}
                </span>
                <span className="mt-0.5 w-full truncate text-xs font-bold">
                  {item.name}
                </span>
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Insignia flotante inferior */}
      <div className="mt-3 flex items-center justify-between px-1 text-xs text-muted-foreground">
        <span className="tech-tag flex items-center gap-1.5">
          <Sparkles className="size-3.5 text-primary" aria-hidden />
          PASA EL CURSOR O CAMBIA DE SLOT
        </span>
        <Link
          href="/miembros"
          className="tech-tag text-foreground underline decoration-primary underline-offset-4 hover:text-primary"
        >
          CATÁLOGO COMPLETO →
        </Link>
      </div>
    </div>
  );
}
