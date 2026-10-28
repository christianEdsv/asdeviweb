"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, Users, X } from "lucide-react";
import { EmptyState } from "@/components/common/EmptyState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MEMBER_TYPES, SPECIALTIES, type MemberType } from "@/lib/taxonomies";
import { cn, normalizeText } from "@/lib/utils";
import type { Member } from "@/types/content";
import { MemberCard } from "./MemberCard";

interface MembersDirectoryProps {
  members: Member[];
}

export function MembersDirectory({ members }: MembersDirectoryProps) {
  const [query, setQuery] = useState("");
  const [selectedType, setSelectedType] = useState<MemberType | "all">("all");
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("all");

  const deferredQuery = useDeferredValue(query);

  const specialties = useMemo(() => {
    const set = new Set<string>(SPECIALTIES);
    for (const member of members) {
      for (const spec of member.specialties) set.add(spec);
    }
    return Array.from(set);
  }, [members]);

  const filtered = useMemo(() => {
    const q = normalizeText(deferredQuery);
    return members.filter((member) => {
      if (selectedType !== "all" && member.memberType !== selectedType) {
        return false;
      }
      if (
        selectedSpecialty !== "all" &&
        !member.specialties.includes(selectedSpecialty)
      ) {
        return false;
      }
      if (!q) return true;
      const haystack = normalizeText(
        [
          member.name,
          member.bio,
          member.featuredGame?.title ?? "",
          ...member.specialties,
        ].join(" "),
      );
      return haystack.includes(q);
    });
  }, [members, deferredQuery, selectedType, selectedSpecialty]);

  const hasActiveFilters =
    query.trim().length > 0 ||
    selectedType !== "all" ||
    selectedSpecialty !== "all";

  function clearFilters() {
    setQuery("");
    setSelectedType("all");
    setSelectedSpecialty("all");
  }

  return (
    <div className="space-y-8">
      {/* Consola de búsqueda y filtros */}
      <div
        role="search"
        aria-label="Filtrar miembros"
        className="hud-corners space-y-5 rounded-2xl border border-border bg-surface p-6"
      >
        <div className="grid gap-4 lg:grid-cols-12 lg:items-center">
          <div className="relative lg:col-span-5">
            <label htmlFor="member-search" className="sr-only">
              Buscar por nombre, especialidad o juego
            </label>
            <Search
              aria-hidden
              className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-primary"
            />
            <Input
              id="member-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar estudio, dev, especialidad o juego…"
              className="h-11 border-border bg-background pl-10 font-mono text-xs"
            />
          </div>

          <div
            role="group"
            aria-label="Tipo de miembro"
            className="flex flex-wrap gap-1.5 lg:col-span-7 lg:justify-end"
          >
            <FilterChip
              active={selectedType === "all"}
              onClick={() => setSelectedType("all")}
            >
              Todos ({members.length})
            </FilterChip>
            {MEMBER_TYPES.map((type) => (
              <FilterChip
                key={type.value}
                active={selectedType === type.value}
                onClick={() => setSelectedType(type.value)}
              >
                {type.title}
              </FilterChip>
            ))}
          </div>
        </div>

        {/* Filtro por especialidad */}
        <div
          role="group"
          aria-label="Especialidad"
          className="flex flex-wrap items-center gap-1.5 border-t border-border/80 pt-4"
        >
          <span className="tech-tag mr-2 text-muted-foreground">
            TAG // ESPECIALIDAD:
          </span>
          <FilterChip
            size="sm"
            active={selectedSpecialty === "all"}
            onClick={() => setSelectedSpecialty("all")}
          >
            Todas
          </FilterChip>
          {specialties.map((spec) => (
            <FilterChip
              key={spec}
              size="sm"
              active={selectedSpecialty === spec}
              onClick={() =>
                setSelectedSpecialty((current) =>
                  current === spec ? "all" : spec,
                )
              }
            >
              {spec}
            </FilterChip>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
          <p aria-live="polite" className="tech-tag">
            RESULTADOS:{" "}
            <strong className="font-bold text-primary">
              {String(filtered.length).padStart(2, "0")}
            </strong>{" "}
            / {String(members.length).padStart(2, "0")} PERFILES
          </p>
          {hasActiveFilters ? (
            <button
              type="button"
              onClick={clearFilters}
              className="tech-tag inline-flex items-center gap-1 font-bold text-accent hover:text-primary"
            >
              <X className="size-3.5" aria-hidden />
              RESETEAR FILTROS
            </button>
          ) : null}
        </div>
      </div>

      {/* Resultados con animación de reordenamiento */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No encontramos miembros con esos filtros"
          description="Prueba con otro término de búsqueda o restablece los filtros."
        >
          {hasActiveFilters ? (
            <Button variant="outline" size="sm" onClick={clearFilters}>
              Mostrar todos los miembros
            </Button>
          ) : null}
        </EmptyState>
      ) : (
        <motion.ul layout className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((member) => (
              <motion.li
                key={member._id}
                layout
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              >
                <MemberCard member={member} />
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      )}
    </div>
  );
}

interface FilterChipProps {
  active: boolean;
  onClick: () => void;
  size?: "sm" | "md";
  children: React.ReactNode;
}

function FilterChip({
  active,
  onClick,
  size = "md",
  children,
}: FilterChipProps) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "rounded-full border font-mono transition-all duration-200",
        size === "sm"
          ? "px-2.5 py-1 text-[11px]"
          : "px-3.5 py-1.5 text-xs font-bold",
        active
          ? "border-primary bg-primary text-primary-foreground shadow-sm"
          : "border-border bg-background/70 text-muted-foreground hover:border-primary/50 hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}
