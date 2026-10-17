# IlluminAIst News Redesign — Phase 3–8 Handoff

## Phase 3 — Foundation

Completed:

- Preserved the existing Vite/React application and routes.
- Added `npm run news:api`, `npm run news:update`, `npm run news:rebuild`, and `npm test`.
- Added a read-only Express News API with health, lead, latest, topics, status, list, and slug endpoints.
- Added GitHub Actions CI for tests and production builds.
- Added daily News refresh workflow using the existing RSS/Gemini pipeline.

## Phase 4 — Frontend

Completed:

- News landing page with lead story, latest stream, topic filters, search, sorting, cards, concise summaries, and empty states.
- Story detail page with readable metadata, quick-read label, article content, related stories, and dark-mode support.
- Relevant-image-only presentation: approved local artwork is shown; missing assets use restrained topic color instead of generic repeated artwork.
- Static article hero/carousel removed to keep the reading experience focused.
- Existing global header, footer, theme toggle, and non-News pages remain outside the redesign scope.

## Phase 5 — Backend

Completed:

- File-backed read API implemented in `tools/news-api.cjs`.
- Existing article HTML and generated story index remain the source of truth.
- Slug lookup, filtering, topics, latest stories, and health/status responses are implemented.

Remaining for a larger production installation:

- PostgreSQL persistence, editorial accounts, and mutation endpoints.

## Phase 6 — Integrations

Completed:

- Existing RSS ingestion and optional Gemini summarization retained.
- Daily scheduled refresh workflow added.
- Local editorial image library and deterministic topic mapping retained.

Required deployment configuration:

- Add `GEMINI_API_KEY` to repository secrets if AI rewriting is enabled.
- Configure the hosting service to run `npm run news:api` only if API-backed reads are desired.

## Phase 7 — Testing

Completed:

- Node tests cover News foundation files, metadata shape, and API endpoint presence.
- Production Vite build passes.
- JavaScript syntax validation passes for the News API and updater.
- Diff whitespace validation passes.

## Phase 8 — UX validation

Completed:

- Responsive CSS includes desktop, tablet, and mobile layouts.
- Dark-mode News palette improves article and control contrast.
- Cards avoid generic repeated images and expose concise labels/summaries.
- Direct slug loading remains file-backed and supported.

Recommended next iteration:

- Add Playwright browser tests against the deployed site.
- Connect the React page to `/api/news` behind a feature flag when the API runtime is deployed.
- Add editorial review before automated summaries are published.
