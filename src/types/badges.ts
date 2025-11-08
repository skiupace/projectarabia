// Type definitions for badges that can be safely imported by both client and server

import type { BadgeId } from "@/enum/badges";

export type BadgeMetadata = {
  name: string;
  description: string;
};

export type UserBadgeWithMetadata = {
  id: string;
  userId: string;
  badgeId: BadgeId;
  issuedAt: string;
  metadata: BadgeMetadata;
};

export type BadgeAwardResult = {
  success: boolean;
  error?: string;
};
