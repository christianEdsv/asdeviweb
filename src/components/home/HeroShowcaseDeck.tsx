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
import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Gamepad2,
  Shuffle,
  Sparkles,
} from "lucide-react";
import { SanityImage } from "@/components/common/SanityImage";
import { MEMBER_TYPES, getTitle } from "@/lib/taxonomies";
import type { Member } from "@/types/content";

interface HeroShowcaseDeckProps {
  members: Member[];
}

const AUTOPLAY_MS = 4500;
const DECK_SIZE = 4;

/** Mezcla aleatoria Fisher-Yates sin mutar el arreglo original. */
function shuffleArray<T>(items: readonly T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = copy[i];
    copy[i] = copy[j];
    copy[j] = temp;
  }
  return copy;
}

/**
 * Cartucho estilo Super Nintendo (SNES) adaptado a Modo Claro y Modo Oscuro:
 * - Columnas laterales moldeadas con estrías horizontales y tornillos Gamebit.
 * - Etiqueta central hundida que envuelve el borde superior ("End Label").
 * - Triángulo frontal moldeado (▼) e integración cromática con los tokens del tema.
 * - Selección aleatoria de miembros al cargar + botón RND y auto-slider.
 */
export function HeroShowcaseDeck({ members }: HeroShowcaseDeckProps) {
  const [showcaseItems, setShowcaseItems] = useState<Member[]>(() =>
    members.slice(0, DECK_SIZE),
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [shuffleCount, setShuffleCount] = useState(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (members.length <= 1) return;
    const timer = window.setTimeout(() => {
      setShowcaseItems(shuffleArray(members).slice(0, DECK_SIZE));
      setActiveIndex(0);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [members]);

  const totalSlots = showcaseItems.length;

  useEffect(() => {
    if (totalSlots <= 1 || isPaused) return;
    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % totalSlots);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(timer);
  }, [totalSlots, isPaused, activeIndex, shuffleCount]);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [5, -5]), {
    stiffness: 220,
    damping: 24,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-6, 6]), {
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

  function handleShuffle() {
    setShowcaseItems(shuffleArray(members).slice(0, DECK_SIZE));
    setActiveIndex(0);
    setShuffleCount((c) => c + 1);
  }

  function handlePrev() {
    if (totalSlots <= 1) return;
    setActiveIndex((prev) => (prev - 1 + totalSlots) % totalSlots);
  }

  function handleNext() {
    if (totalSlots <= 1) return;
    setActiveIndex((prev) => (prev + 1) % totalSlots);
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
      {/* Resplandor ambiental coherente con la paleta del sitio */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-4 -z-10 rounded-3xl bg-gradient-to-tr from-primary/15 via-gold/20 to-mikado/15 blur-2xl"
      />

      <motion.div
        style={reduceMotion ? undefined : { rotateX, rotateY }}
        className="relative"
      >
        {/* CARCASA PRINCIPAL DEL CARTUCHO SNES */}
        <div className="relative overflow-hidden rounded-t-2xl rounded-b-xl border-2 border-border bg-surface-elevated shadow-[0_18px_40px_-15px_rgba(0,0,83,0.22)] dark:shadow-[0_22px_50px_-15px_rgba(0,0,0,0.75)]">
          {/* Bisel superior de plástico + etiqueta superior envolvente ("SNES End Label") */}
          <div className="grid grid-cols-12 items-stretch border-b border-border/80 bg-surface/60">
            {/* Hombro izquierdo del cartucho */}
            <div
              aria-hidden
              className="col-span-2 flex flex-col justify-center gap-1 border-r border-border px-2 py-2"
            >
              <span className="h-1 w-full rounded-full bg-border" />
              <span className="h-1 w-full rounded-full bg-border" />
            </div>

            {/* Etiqueta envolvente del lomo superior (End Label) */}
            <div className="col-span-8 flex items-center justify-between gap-2 bg-primary px-3 py-1.5 text-primary-foreground">
              <div className="flex items-center gap-2">
                <span
                  aria-hidden
                  className="pulse-dot size-2 rounded-full bg-gold"
                />
                <span className="font-mono text-[10px] font-extrabold tracking-[0.16em] uppercase">
                  SUPER ASDEVI SYSTEM
                </span>
              </div>
            </div>

            {/* Hombro derecho del cartucho */}
            <div
              aria-hidden
              className="col-span-2 flex flex-col justify-center gap-1 border-l border-border px-2 py-2"
            >
              <span className="h-1 w-full rounded-full bg-border" />
              <span className="h-1 w-full rounded-full bg-border" />
            </div>
          </div>

          {/* CUERPO INTERMEDIO: Columnas laterales estriadas SNES + Cavidad de la etiqueta */}
          <div className="grid grid-cols-12">
            {/* Columna lateral izquierda con ranuras moldeadas y tornillo Gamebit */}
            <div
              aria-hidden
              className="col-span-1 flex flex-col items-center justify-between border-r border-border bg-surface/50 py-3"
            >
              <div className="flex w-full flex-col gap-1.5 px-1">
                {Array.from({ length: 6 }).map((_, idx) => (
                  <span
                    key={idx}
                    className="h-1 w-full rounded-r-full bg-border"
                  />
                ))}
              </div>
              {/* Tornillo metálico inferior izquierdo */}
              <span className="flex size-3.5 items-center justify-center rounded-full border border-border bg-background font-mono text-[7px] text-muted-foreground shadow-inner">
                ¤
              </span>
            </div>

            {/* Cavidad central hundida para la etiqueta adhesiva principal */}
            <div className="col-span-10 p-2.5 sm:p-3.5">
              <div className="overflow-hidden rounded-xl border-2 border-border bg-surface shadow-inner">
                {/* Franja superior de controles del cartucho */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-background/90 px-3.5 py-2">
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-gold px-2 py-0.5 font-mono text-[10px] font-extrabold tracking-wider text-gold-foreground uppercase">
                      LICENSED BY ASDEVI
                    </span>
                    <span className="tech-tag hidden text-[10px] text-muted-foreground sm:inline">
                      PAL/NTSC · 16-BIT
                    </span>
                  </div>

                  {/* Controles físicos: Aleatorio (RND) y Anterior/Siguiente */}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={handleShuffle}
                      title="Orden aleatorio de miembros"
                      aria-label="Mezclar miembros aleatoriamente"
                      className="inline-flex items-center gap-1 rounded-md border border-border bg-surface-elevated px-2 py-1 font-mono text-[10px] font-bold tracking-wider text-foreground uppercase shadow-[0_2px_0_0_var(--border)] transition-all hover:border-primary hover:text-primary active:translate-y-0.5 active:shadow-none"
                    >
                      <Shuffle className="size-3 text-primary" aria-hidden />
                      <span>RND</span>
                    </button>
                    <button
                      type="button"
                      onClick={handlePrev}
                      aria-label="Miembro anterior"
                      className="inline-flex size-6 items-center justify-center rounded-md border border-border bg-surface-elevated text-foreground shadow-[0_2px_0_0_var(--border)] transition-all hover:border-primary hover:text-primary active:translate-y-0.5 active:shadow-none"
                    >
                      <ChevronLeft className="size-3.5" aria-hidden />
                    </button>
                    <button
                      type="button"
                      onClick={handleNext}
                      aria-label="Siguiente miembro"
                      className="inline-flex size-6 items-center justify-center rounded-md border border-border bg-surface-elevated text-foreground shadow-[0_2px_0_0_var(--border)] transition-all hover:border-primary hover:text-primary active:translate-y-0.5 active:shadow-none"
                    >
                      <ChevronRight className="size-3.5" aria-hidden />
                    </button>
                  </div>
                </div>

                {/* Ventana de arte de la etiqueta SNES */}
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-background">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`${current._id}-${shuffleCount}`}
                      initial={{ opacity: 0, scale: 1.04 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.97 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
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
                      {/* Brillo diagonal sutil de papel satinado de etiqueta */}
                      <div
                        aria-hidden
                        className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/8 to-white/18"
                      />
                    </motion.div>
                  </AnimatePresence>

                  {/* Insignias flotantes sobre la ilustración */}
                  <div className="absolute top-2.5 left-2.5 flex flex-wrap items-center gap-1.5">
                    <span className="tech-tag rounded-md border border-border bg-surface/92 px-2.5 py-1 font-bold text-foreground shadow-sm backdrop-blur-md">
                      {getTitle(MEMBER_TYPES, current.memberType)}
                    </span>
                    {current.featuredGame?.platform ? (
                      <span className="tech-tag rounded-md border border-gold-foreground/20 bg-gold px-2.5 py-1 font-extrabold text-gold-foreground shadow-sm">
                        {current.featuredGame.platform}
                      </span>
                    ) : null}
                  </div>
                </div>

                {/* Pie de la etiqueta del cartucho (usa los colores semánticos del tema Claro/Oscuro) */}
                <div className="border-t border-border bg-surface px-4 py-3.5">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`${current._id}-${shuffleCount}-info`}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.24 }}
                    >
                      <p className="tech-tag flex items-center gap-1.5 font-bold text-primary">
                        <Gamepad2 className="size-3.5" aria-hidden />
                        {current.featuredGame
                          ? `JUEGO DESTACADO // ${current.featuredGame.title}`
                          : "MIEMBRO OFICIAL // ASDEVI"}
                      </p>
                      <div className="mt-1 flex items-end justify-between gap-3">
                        <div className="min-w-0">
                          <h2 className="truncate text-xl font-extrabold text-foreground sm:text-2xl">
                            {current.name}
                          </h2>
                          <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                            {current.featuredGame?.description ?? current.bio}
                          </p>
                        </div>
                        <Link
                          href={`/miembros/${current.slug}`}
                          aria-label={`Ver perfil de ${current.name}`}
                          className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-primary bg-primary px-3 py-2 font-mono text-xs font-extrabold text-primary-foreground uppercase shadow-sm transition-transform hover:scale-105 active:scale-95"
                        >
                          START
                          <ArrowUpRight className="size-4" aria-hidden />
                        </Link>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Columna lateral derecha con ranuras moldeadas y tornillo Gamebit */}
            <div
              aria-hidden
              className="col-span-1 flex flex-col items-center justify-between border-l border-border bg-surface/50 py-3"
            >
              <div className="flex w-full flex-col gap-1.5 px-1">
                {Array.from({ length: 6 }).map((_, idx) => (
                  <span
                    key={idx}
                    className="h-1 w-full rounded-l-full bg-border"
                  />
                ))}
              </div>
              {/* Tornillo metálico inferior derecho */}
              <span className="flex size-3.5 items-center justify-center rounded-full border border-border bg-background font-mono text-[7px] text-muted-foreground shadow-inner">
                ¤
              </span>
            </div>
          </div>

          {/* Ranura moldeada inferior clásica de SNES con flecha ▼ central */}
          <div
            aria-hidden
            className="flex items-center justify-center gap-3 border-t border-border bg-surface/70 py-1.5"
          >
            <span className="h-1.5 w-16 rounded-full bg-border shadow-inner" />
            <span className="font-mono text-[10px] leading-none text-primary">
              ▼
            </span>
            <span className="h-1.5 w-16 rounded-full bg-border shadow-inner" />
          </div>

          {/* Selector de 4 slots en la base del cartucho */}
          <div
            role="tablist"
            aria-label="Proyectos destacados de miembros"
            className="grid grid-cols-4 border-t border-border bg-surface"
          >
            {showcaseItems.map((item, idx) => {
              const isSelected = idx === activeIndex;
              return (
                <button
                  key={`${item._id}-${idx}`}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => setActiveIndex(idx)}
                  className={`group relative flex flex-col items-start border-r border-border px-3 py-2.5 text-left transition-colors last:border-r-0 ${
                    isSelected
                      ? "bg-surface-elevated text-foreground"
                      : "text-muted-foreground hover:bg-background hover:text-foreground"
                  }`}
                >
                  {isSelected ? (
                    <span
                      aria-hidden
                      className="absolute inset-x-0 top-0 h-1 overflow-hidden bg-border"
                    >
                      <motion.span
                        key={`${item._id}-${isPaused ? "paused" : "play"}-${shuffleCount}`}
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
                  <span className="tech-tag flex items-center gap-1 text-[10px] font-bold text-primary">
                    <span
                      aria-hidden
                      className={`size-1.5 rounded-full ${
                        isSelected ? "bg-gold" : "bg-border"
                      }`}
                    />
                    0{idx + 1}
                  </span>
                  <span className="mt-0.5 w-full truncate text-xs font-extrabold">
                    {item.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Falda inferior encajable del cartucho SNES (conector de consola) */}
        <div
          aria-hidden
          className="mx-6 flex h-3.5 items-center justify-between rounded-b-xl border-x-2 border-b-2 border-border bg-surface px-4 shadow-sm"
        >
          <span className="h-1.5 w-8 rounded-full bg-border" />
          <div className="flex items-center gap-1">
            {Array.from({ length: 12 }).map((_, pinIdx) => (
              <span
                key={pinIdx}
                className={`h-2 w-1.5 rounded-xs ${
                  pinIdx % 2 === 0 ? "bg-gold" : "bg-mikado"
                }`}
              />
            ))}
          </div>
          <span className="h-1.5 w-8 rounded-full bg-border" />
        </div>
      </motion.div>

      {/* Insignia flotante inferior */}
      <div className="mt-3 flex items-center justify-between px-1 text-xs text-muted-foreground">
        <Link
          href="/miembros"
          className="tech-tag text-foreground underline decoration-primary underline-offset-4 hover:text-primary"
        >
          DIRECTORIO COMPLETO →
        </Link>
      </div>
    </div>
  );
}
