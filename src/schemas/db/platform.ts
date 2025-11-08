import { sqliteTable, text, index } from "drizzle-orm/sqlite-core";
import { createId } from "@paralleldrive/cuid2";

// This table is used to show banners in the platform when changes occur.
// Types: "new_feature", "new_terms"
export const platform = sqliteTable(
  "platform",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    updateType: text("update_type")
      .notNull()
      .$type<"new_feature" | "new_terms">(),
    metadata: text("metadata", { mode: "json" }).notNull(), // parsed JSON for relevant metadata
    startAnnounceDate: text("start_announce_date").notNull(), // ISO string
    endAnnounceDate: text("end_announce_date").notNull(), // ISO string
  },
  (table) => [
    index("platform_update_type_idx").on(table.updateType),
    index("platform_start_date_idx").on(table.startAnnounceDate),
    index("platform_end_date_idx").on(table.endAnnounceDate),
  ],
);
