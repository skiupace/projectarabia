import {
  integer,
  sqliteTable,
  text,
  real,
  index,
} from "drizzle-orm/sqlite-core";
import { users } from "./users";

export const userStatus = sqliteTable(
  "user_status",
  {
    userId: text("user_id")
      .primaryKey()
      .references(() => users.id, { onDelete: "cascade" }),

    // --- Identity & Role ---
    verified: integer("verified", { mode: "boolean" }).notNull().default(false),
    role: text("role").notNull().default("user").$type<"user" | "moderator">(), // "user" | "moderator"

    // --- Reputation ---
    karma: real("karma").notNull().default(0), // float for smooth decay updates
    karmaLastUpdated: text("karma_last_updated")
      .notNull()
      .$defaultFn(() => new Date().toISOString()),

    // --- Moderation ---
    mutedUntil: text("muted_until"), // ISO string or null
    bannedUntil: text("banned_until"), // ISO string or null
    muteReason: text("mute_reason"),
    banReason: text("ban_reason"),

    // --- Audit ---
    createdAt: text("created_at")
      .notNull()
      .$defaultFn(() => new Date().toISOString()),
    updatedAt: text("updated_at")
      .notNull()
      .$defaultFn(() => new Date().toISOString()),
  },
  (table) => [
    index("user_status_karma_idx").on(table.karma),
    index("user_status_role_idx").on(table.role),
    index("user_status_verified_idx").on(table.verified),
  ],
);

export type UserStatus = typeof userStatus.$inferSelect;
