import { integer, sqliteTable, text, index } from "drizzle-orm/sqlite-core";
import { createId } from "@paralleldrive/cuid2";
import { users } from "./users";

export const posts = sqliteTable(
  "posts",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    title: text("title").notNull(),
    url: text("url"), // optional - for link posts
    text: text("text"), // optional - for text/ask posts
    userId: text("user_id")
      .notNull()
      .references(() => users.id),
    reportCount: integer("report_count").default(0),
    flagged: integer("flagged", { mode: "boolean" }).default(false),
    hidden: integer("hidden", { mode: "boolean" }).notNull().default(false),
    votes: integer("votes").notNull().default(0), // Denormalized field for votes count
    commentCount: integer("comment_count").notNull().default(0), // Denormalized field for comment count
    createdAt: text("created_at")
      .notNull()
      .$defaultFn(() => new Date().toISOString()),
    updatedAt: text("updated_at").$defaultFn(() => new Date().toISOString()),
  },
  (table) => [
    index("posts_user_id_idx").on(table.userId),
    index("posts_created_at_idx").on(table.createdAt),
    index("posts_flagged_idx").on(table.flagged),
    index("posts_hidden_idx").on(table.hidden),
  ],
);

export type Post = typeof posts.$inferSelect;
