import Link from "next/link";
import { ArrowUpRight, Gamepad2 } from "lucide-react";
import { SanityImage } from "@/components/common/SanityImage";
import { SpotlightCard } from "@/components/common/SpotlightCard";
import { MEMBER_TYPES, getTitle } from "@/lib/taxonomies";
import type { Member } from "@/types/content";

interface MemberCardProps {
  member: Member;
}

export function MemberCard({ member }: MemberCardProps) {
  const typeLabel = getTitle(MEMBER_TYPES, member.memberType);
  const visibleSpecialties = member.specialties.slice(0, 3);
  const extraCount = member.specialties.length - visibleSpecialties.length;

  return (
    <SpotlightCard className="group flex h-full flex-col rounded-2xl p-6">
      <div className="flex items-start gap-4">
        <div className="relative size-14 shrink-0 overflow-hidden rounded-xl border border-border bg-background transition-transform duration-300 group-hover:scale-105 group-hover:border-primary/60">
          {member.logo ? (
            <SanityImage
              image={member.logo}
              width={112}
              height={112}
              sizes="56px"
              className="size-full object-cover"
            />
          ) : (
            <span className="flex size-full items-center justify-center font-display text-lg font-extrabold text-primary">
              {member.name.slice(0, 2).toUpperCase()}
            </span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <span className="tech-tag inline-block text-primary">
            {typeLabel}
          </span>
          <h3 className="mt-1 truncate text-lg font-extrabold text-foreground transition-colors group-hover:text-primary">
            <Link
              href={`/miembros/${member.slug}`}
              className="after:absolute after:inset-0 focus-visible:outline-none"
            >
              {member.name}
            </Link>
          </h3>
        </div>
        <span
          aria-hidden
          className="flex size-8 shrink-0 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-all duration-300 group-hover:rotate-12 group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground"
        >
          <ArrowUpRight className="size-4" />
        </span>
      </div>

      <p className="mt-4 line-clamp-3 flex-1 text-sm leading-relaxed text-muted-foreground">
        {member.bio}
      </p>

      {member.featuredGame ? (
        <div className="mt-4 flex items-center gap-2 rounded-xl border border-border bg-background/70 px-3 py-2 text-xs text-muted-foreground transition-colors group-hover:border-primary/40">
          <Gamepad2 className="size-3.5 shrink-0 text-accent" aria-hidden />
          <span className="truncate font-mono text-[11px]">
            BUILD:{" "}
            <strong className="font-semibold text-foreground">
              {member.featuredGame.title}
            </strong>
          </span>
        </div>
      ) : null}

      {visibleSpecialties.length > 0 ? (
        <ul
          aria-label="Especialidades"
          className="mt-4 flex flex-wrap gap-1.5 border-t border-border/80 pt-4"
        >
          {visibleSpecialties.map((specialty) => (
            <li
              key={specialty}
              className="rounded-md border border-border/90 bg-background/60 px-2.5 py-0.5 font-mono text-[11px] text-muted-foreground"
            >
              {specialty}
            </li>
          ))}
          {extraCount > 0 ? (
            <li className="rounded-md border border-border/90 bg-background/60 px-2 py-0.5 font-mono text-[11px] text-primary">
              +{extraCount}
            </li>
          ) : null}
        </ul>
      ) : null}
    </SpotlightCard>
  );
}
