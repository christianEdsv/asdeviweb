"use client";

import { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { MemberCard } from "@/components/members/MemberCard";
import { Button } from "@/components/ui/button";
import type { Member } from "@/types/content";

interface MembersCarouselProps {
  members: Member[];
}

export function MembersCarousel({ members }: MembersCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
  });
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(members.length > 1);

  useEffect(() => {
    if (!emblaApi) return;
    const handleSelect = () => {
      setCanPrev(emblaApi.canScrollPrev());
      setCanNext(emblaApi.canScrollNext());
    };
    emblaApi.on("init", handleSelect);
    emblaApi.on("select", handleSelect);
    emblaApi.on("reInit", handleSelect);
    return () => {
      emblaApi.off("init", handleSelect);
      emblaApi.off("select", handleSelect);
      emblaApi.off("reInit", handleSelect);
    };
  }, [emblaApi]);

  return (
    <div
      role="region"
      aria-roledescription="carrusel"
      aria-label="Últimos miembros integrados"
    >
      <div className="overflow-hidden" ref={emblaRef}>
        <ul className="-ml-6 flex">
          {members.map((member) => (
            <li
              key={member._id}
              className="min-w-0 shrink-0 grow-0 basis-full pl-6 sm:basis-1/2 lg:basis-1/3"
            >
              <MemberCard member={member} />
            </li>
          ))}
        </ul>
      </div>

      {members.length > 3 ? (
        <div className="mt-6 flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            onClick={() => emblaApi?.scrollPrev()}
            disabled={!canPrev}
            aria-label="Miembro anterior"
            className="border-border bg-surface"
          >
            <ChevronLeft className="size-4" aria-hidden />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            onClick={() => emblaApi?.scrollNext()}
            disabled={!canNext}
            aria-label="Miembro siguiente"
            className="border-border bg-surface"
          >
            <ChevronRight className="size-4" aria-hidden />
          </Button>
        </div>
      ) : null}
    </div>
  );
}
