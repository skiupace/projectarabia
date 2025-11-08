import type { UserBadgeWithMetadata } from "@/types/badges";
import { BadgeId } from "@/enum/badges";
import { MailCheck, Sparkles, Trophy, Shield } from "lucide-react";

const BADGE_ICONS = {
  [BadgeId.EMAIL_VERIFIED]: MailCheck,
  [BadgeId.EARLY_ADOPTER]: Sparkles,
  [BadgeId.TOP_CONTRIBUTOR]: Trophy,
  [BadgeId.MODERATOR]: Shield,
} as const;

function Badge({ badge }: { badge: UserBadgeWithMetadata }) {
  const Icon = BADGE_ICONS[badge.badgeId];

  return (
    <div className="relative inline-flex group">
      <div className="inline-flex text-zinc-400">
        <Icon className="w-3 h-3" />
      </div>
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-zinc-800 text-zinc-100 text-xs whitespace-nowrap rounded pointer-events-none opacity-0 group-hover:opacity-100 transition-none z-50">
        {badge.metadata.description}
      </div>
    </div>
  );
}

export function BadgeList({ badges }: { badges: UserBadgeWithMetadata[] }) {
  return (
    <div className="flex items-center gap-1">
      {badges.map((badge) => (
        <Badge key={badge.id} badge={badge} />
      ))}
    </div>
  );
}
