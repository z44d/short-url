import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const urls = sqliteTable("urls", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  shortCode: text("short_code").unique().notNull(),
  originalUrl: text("original_url").notNull(),
  expiresAt: text("expires_at"),
  createdAt: text("created_at").notNull(),
});
