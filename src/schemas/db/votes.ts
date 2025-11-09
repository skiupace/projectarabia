import {
  integer,
  sqliteTable,
  text,
  uniqueIndex,
  index,
} from "drizzle-orm/sqlite-core";
import { nanoid } from "nanoid";
import { users } from "./users";
import { posts } from "./posts";
import { comments } from "./comments";

export const votes = sqliteTable(
  "votes",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => nanoid()),
    userId: text("user_id")
      .notNull()
      .references(() => users.id),
    postId: text("post_id").references(() => posts.id), // null if voting on comment
    commentId: text("comment_id").references(() => comments.id), // null if voting on post
    value: integer("value").notNull(), // 1 for upvote, -1 for downvote
    createdAt: text("created_at")
      .notNull()
      .$defaultFn(() => new Date().toISOString()),
    updatedAt: text("updated_at").$defaultFn(() => new Date().toISOString()),
  },
  (table) => [
    // Ensure a user can only vote once per post
    uniqueIndex("unique_user_post").on(table.userId, table.postId),
    // Ensure a user can only vote once per comment
    uniqueIndex("unique_user_comment").on(table.userId, table.commentId),
    // Additional indexes for lookups
    index("votes_post_id_idx").on(table.postId),
    index("votes_comment_id_idx").on(table.commentId),
    index("votes_user_id_idx").on(table.userId),
  ],
);

export type Vote = Omit<
  typeof votes.$inferSelect,
  "createdAt" | "updatedAt" | "id"
>;
