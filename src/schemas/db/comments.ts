import { integer, sqliteTable, text, index } from "drizzle-orm/sqlite-core";
import { createId } from "@paralleldrive/cuid2";
import { users } from "./users";
import { posts } from "./posts";

export const comments = sqliteTable(
  "comments",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    postId: text("post_id")
      .notNull()
      .references(() => posts.id),
    parentId: text("parent_id"), // null for top-level, self-referencing for nested
    userId: text("user_id")
      .notNull()
      .references(() => users.id),
    text: text("text").notNull(),
    votes: integer("votes").notNull().default(0), // Denormalized field for votes count
    createdAt: text("created_at")
      .notNull()
      .$defaultFn(() => new Date().toISOString()),
    reportCount: integer("report_count").default(0),
    flagged: integer("flagged", { mode: "boolean" }).default(false),
    hidden: integer("hidden", { mode: "boolean" }).default(false),
    updatedAt: text("updated_at").$defaultFn(() => new Date().toISOString()),
  },
  (table) => [
    index("comments_post_id_idx").on(table.postId),
    index("comments_parent_id_idx").on(table.parentId),
    index("comments_user_id_idx").on(table.userId),
    index("comments_created_at_idx").on(table.createdAt),
    index("comments_flagged_idx").on(table.flagged),
  ],
);

export type Comment = typeof comments.$inferSelect;
