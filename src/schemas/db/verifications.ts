import { nanoid } from "nanoid";
import { index, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { users } from "./users";

export const verifications = sqliteTable(
  "verifications",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => nanoid()),
    userId: text("user_id")
      .notNull()
      .references(() => users.id),
    token: text("token").notNull().unique(),
    createdAt: text("created_at")
      .notNull()
      .$defaultFn(() => new Date().toISOString()),
  },
  (table) => [
    index("verifications_token_idx").on(table.token),
    index("verifications_user_id_idx").on(table.userId),
  ],
);

export type Verification = typeof verifications.$inferSelect;
