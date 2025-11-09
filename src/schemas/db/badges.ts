import { sqliteTable, text, index } from "drizzle-orm/sqlite-core";
import { nanoid } from "nanoid";
import { users } from "./users";

// Table to store which user has which badge (badge ID is just text, metadata comes from BADGE_METADATA)
export const userBadges = sqliteTable(
  "user_badges",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => nanoid()),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    badgeId: text("badge_id").notNull(), // Just a text field - no foreign key needed
    issuedAt: text("issued_at")
      .notNull()
      .$defaultFn(() => new Date().toISOString()),
  },
  (table) => [
    index("user_badges_user_id_idx").on(table.userId),
    index("user_badges_badge_id_idx").on(table.badgeId),
  ],
);

export type UserBadge = typeof userBadges.$inferSelect;
