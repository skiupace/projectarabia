import { createId } from "@paralleldrive/cuid2";
import { users } from "./users";
import { posts } from "./posts";
import { comments } from "./comments";
import { sqliteTable, text, index } from "drizzle-orm/sqlite-core";

// Aduit log for reports, who? when? why?
export const reports = sqliteTable(
  "reports",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    postId: text("post_id").references(() => posts.id),
    commentId: text("comment_id").references(() => comments.id),
    userId: text("user_id").references(() => users.id),
    reason: text("reason").notNull(),
    createdAt: text("created_at")
      .notNull()
      .$defaultFn(() => new Date().toISOString()),
  },
  (table) => [
    index("reports_post_id_idx").on(table.postId),
    index("reports_comment_id_idx").on(table.commentId),
    index("reports_user_id_idx").on(table.userId),
    index("reports_created_at_idx").on(table.createdAt),
  ],
);
