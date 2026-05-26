import { Database } from "bun:sqlite";
import { drizzle } from "drizzle-orm/bun-sqlite";
import config from "./config";
import * as schema from "./schema";

const sqlite = new Database(config.DB_PATH);
sqlite.run("PRAGMA journal_mode=WAL");

sqlite.run(`
  CREATE TABLE IF NOT EXISTS urls (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    short_code TEXT UNIQUE NOT NULL,
    original_url TEXT NOT NULL,
    expires_at TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )
`);

export const db = drizzle(sqlite, { schema });
