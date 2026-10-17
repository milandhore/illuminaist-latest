# IlluminAIst News Redesign — Phase 2 Architecture

## Frontend

- React + React Router remain the presentation layer.
- News route components own page composition; reusable story, visual, metadata, search, and state components stay under `src/components/news/`.
- Static builds continue to work without an API. The current generated `src/data/news.js` remains the safe publishing fallback.
- A future API adapter can replace the data import without changing page components.

## Backend

- `tools/news-api.cjs` provides a small read API for local/CMS hosting.
- The existing RSS/Gemini updater remains the ingestion worker.
- Article HTML remains file-backed and is served only by known slug paths.
- Production hosting may move the same contracts to a serverless function without changing clients.

## Persistence

The current deployment is file-backed to preserve the existing static publishing model:

- `src/data/news.js`: published story index
- `public/articles/news/*.html`: article bodies
- `public/news-art/*`: approved local artwork
- Git history: audit trail and rollback mechanism

When volume or editorial concurrency requires a database, migrate the documented entities from `docs/news-discovery.md` into PostgreSQL. No database is introduced prematurely into the static site.

## Authentication

- Public News reads require no authentication.
- Ingestion credentials stay server-side as environment variables.
- Admin mutation endpoints are intentionally not exposed by the read API. Existing CMS authentication remains the boundary for editorial writes.

## API contracts

- `GET /api/health`
- `GET /api/news`
- `GET /api/news/lead`
- `GET /api/news/latest`
- `GET /api/news/topics`
- `GET /api/news/:slug`
- `GET /api/news/status`

All list responses return `{ items, total, lastUpdatedAt }`. Story responses return `{ item }`.

## Deployment

- Static frontend: existing Vite output and current hosting configuration.
- Scheduled ingestion: `.github/workflows/update-news.yml`.
- Optional API: Node/Express process or serverless equivalent.
- Environment variables: `GEMINI_API_KEY`; optional `PORT`, `NEWS_DATA_FILE`, and `NEWS_ARTICLES_DIR`.

## Testing strategy

- Node built-in tests for data normalization, API response shape, and source-file safety.
- `npm run build` for route/component compilation.
- `git diff --check` for whitespace regressions.
- Manual responsive QA at desktop, tablet, and mobile breakpoints.
- Future browser E2E coverage should verify search, filters, direct slugs, and article loading.
