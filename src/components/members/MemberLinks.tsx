import { ExternalLink as ExternalLinkIcon, Globe } from "lucide-react";
import {
  DiscordIcon,
  InstagramIcon,
  ItchIcon,
  LinkedInIcon,
  SteamIcon,
  XIcon,
  YouTubeIcon,
} from "@/components/icons/brands";
import { MEMBER_LINK_TYPES, getTitle } from "@/lib/taxonomies";
import type { ExternalLink } from "@/types/content";

const ICON_BY_TYPE = {
  web: Globe,
  steam: SteamIcon,
  itch: ItchIcon,
  x: XIcon,
  youtube: YouTubeIcon,
  instagram: InstagramIcon,
  linkedin: LinkedInIcon,
  discord: DiscordIcon,
  other: ExternalLinkIcon,
} as const;

export function MemberLinks({ links }: { links: ExternalLink[] }) {
  if (links.length === 0) return null;

  return (
    <ul className="flex flex-wrap gap-2.5" aria-label="Enlaces del miembro">
      {links.map((link) => {
        const Icon = ICON_BY_TYPE[link.type] ?? ExternalLinkIcon;
        const label = link.label || getTitle(MEMBER_LINK_TYPES, link.type);
        return (
          <li key={`${link.type}-${link.url}`}>
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-3.5 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary/60 hover:bg-surface-elevated"
            >
              <Icon className="size-4 text-primary-soft" aria-hidden />
              <span>{label}</span>
              <ExternalLinkIcon
                className="size-3.5 text-muted-foreground"
                aria-hidden
              />
            </a>
          </li>
        );
      })}
    </ul>
  );
}
