import { randomBytes } from "node:crypto";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import config from "./config";
import { db } from "./db";
import { urls } from "./schema";

const app = new Hono();

const generateCode = () =>
  randomBytes(16).toHex().slice(0, config.CODE_LENGTH);
app.post("/api/shorten", async (c) => {
  const { url, ttl } = await c.req.json();

  if (!url || typeof url !== "string") {
    return c.json({ error: "URL is required" }, 400);
  }

  try {
    new URL(url);
  } catch {
    return c.json({ error: "Invalid URL" }, 400);
  }

  let code = generateCode();
  while (true) {
    const existing = db
      .select()
      .from(urls)
      .where(eq(urls.shortCode, code))
      .get();
    if (!existing) break;
    code = generateCode();
  }

  const t = Number(ttl);
  const expiresAt =
    t > 0 ? new Date(Date.now() + t * 1000).toISOString() : null;

  db.insert(urls)
    .values({
      shortCode: code,
      originalUrl: url,
      expiresAt,
      createdAt: new Date().toISOString(),
    })
    .run();

  return c.json({ short_code: code, expires_at: expiresAt });
});

app.get("/s/:code", async (c) => {
  const code = c.req.param("code");

  const row = db.select().from(urls).where(eq(urls.shortCode, code)).get();

  if (!row) {
    return c.html("<h1>404 - Not Found</h1>", 404);
  }

  if (row.expiresAt && new Date(row.expiresAt) < new Date()) {
    return c.html("<h1>410 - This link has expired</h1>", 410);
  }

  return c.redirect(row.originalUrl);
});

app.get("/*", serveStatic({ root: "./src/public" }));

export default {
  port: Number(process.env.PORT ?? "3000"),
  fetch: app.fetch,
};
