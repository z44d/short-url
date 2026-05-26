# short-url

A minimal URL shortener built with [Bun](https://bun.sh), [Hono](https://hono.dev), and SQLite.

## Features

- Shorten long URLs with optional expiry (1 day, 7 days, 30 days, or custom date)
- Redirect via short codes (HTTP 302)
- Clean web UI served at the root
- REST API (`POST /api/shorten`)
- Expired links return HTTP 410
- SQLite persistence via Drizzle ORM

## Prerequisites

- [Bun](https://bun.sh) v1.3.11+ — install with `curl -fsSL https://bun.sh/install | bash`
- Docker (optional, for containerized runs)

## Quick Start

```bash
bun install
bun run dev
```

Visit [http://localhost:3000](http://localhost:3000).

## Scripts

| Command             | Description                       |
|---------------------|-----------------------------------|
| `bun run dev`       | Start dev server with auto-reload |
| `bun run start`     | Start production server           |
| `bun run lint`      | Format and lint with Biome        |
| `bun run db:generate` | Generate Drizzle migrations    |
| `bun run db:migrate`  | Apply Drizzle migrations       |

## Environment Variables

| Variable      | Default     | Description                   |
|---------------|-------------|-------------------------------|
| `PORT`        | `3000`      | Server port                   |
| `DB_PATH`     | `urls.db`   | Path to SQLite database file  |
| `CODE_LENGTH` | `6`         | Length of generated short codes|

## API

### `POST /api/shorten`

```json
{ "url": "https://example.com/very/long/url", "ttl": 86400 }
```

Optional `ttl` is the lifetime in seconds. Omit for no expiry.

Returns:

```json
{ "short_code": "abc123", "expires_at": null }
```

### `GET /s/:code`

Redirects (302) to the original URL. Returns 404 if not found, 410 if expired.

## Docker

### Using pre-builded docker image
```bash
docker run -p 3000:3000 \
  --env CODE_LENGTH=6 \
  -v shorturl_data:/app/data \
  ghcr.io/z44d/short-url
```
The app will be available at http://localhost:3000

### Using Docker compose (source)
```bash
docker compose up --build
```

The app will be available at [http://localhost:8080](http://localhost:8080).

The `docker-compose.yml` maps container port `3000` to host port `8080` and mounts a named volume for persistent SQLite storage.
