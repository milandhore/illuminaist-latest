# IlluminAIst

IlluminAIst is an independent AI engineering publication for builders. It is a fast, responsive React website for practical engineering articles, AI and technology news, topic discovery, engineering eBooks, and subscriber-facing content alerts.

The production site is a static Vite build. Editorial content is stored in the repository, which keeps the site deployable without a production database or always-on application server. A local CMS and optional read-only News API are included for editorial workflows and future hosting arrangements.

## Contents

- [Features](#features)
- [Technology](#technology)
- [Routes](#routes)
- [Repository structure](#repository-structure)
- [Getting started](#getting-started)
- [Available commands](#available-commands)
- [Content and publishing](#content-and-publishing)
- [Automated news updates](#automated-news-updates)
- [Local CMS](#local-cms)
- [Optional News API](#optional-news-api)
- [Configuration](#configuration)
- [Deployment](#deployment)
- [Subscriptions and eBooks](#subscriptions-and-ebooks)
- [Testing and quality checks](#testing-and-quality-checks)
- [Troubleshooting](#troubleshooting)
- [Security and privacy](#security-and-privacy)
- [Contributing](#contributing)
- [Further documentation](#further-documentation)

## Features

### Publication experience

- Responsive home page with featured content, article feed, and trending news ticker.
- Article library with topic/category metadata, difficulty levels, tags, reading time, related content, and slug-based detail pages.
- AI and technology news desk with:
  - lead story presentation;
  - latest-news rail;
  - topic filters;
  - text search across title, excerpt, source, and topic;
  - latest/oldest sorting;
  - concise summaries and metadata;
  - slug-based story pages;
  - related stories and approved local visuals;
  - empty and loading states.
- Engineering eBook page with corporate-email gating UX and downloadable PDF links when catalog entries are configured.
- About, Subscribe, Privacy, and Terms pages.
- Light/dark theme support.
- Responsive navigation, accessible labels, semantic headings, keyboard-friendly controls, and reduced-motion-aware UI patterns.
- Framer Motion page transitions and Lucide icons.
- Ad placeholders that remain non-serving during local development.

### Editorial and publishing tools

- Local CMS for publishing and deleting articles, news, and eBooks.
- File-backed article and news storage that is easy to review in Git.
- RSS ingestion from Google News for AI stories.
- Optional Gemini rewriting for concise titles, summaries, and article HTML.
- Automatic news index rebuilding from article HTML files.
- Public alert-feed JSON used by the subscriber UI.
- Optional read-only Express News API for local or server-hosted consumers.

### Delivery and operations

- Reproducible Node.js 20 installs with `npm ci --ignore-scripts` in CI.
- Pull-request and push validation through GitHub Actions.
- GitHub Pages deployment from `main`.
- Scheduled news workflow every six hours, plus manual dispatch.
- Dependabot configuration and repository ownership metadata.
- Static output that does not expose the local CMS or subscriber records.

## Technology

- React 18
- Vite
- React Router with `HashRouter`
- Tailwind CSS and project-specific CSS in `src/index.css`
- Framer Motion
- Lucide React
- Node.js built-in test runner
- Express for the optional local News API and CMS server
- `rss-parser` for RSS ingestion
- Google Generative AI SDK for optional Gemini rewriting

## Routes

The application uses hash-based routes so deep links work on repository-based GitHub Pages hosting.

| Route | Purpose |
| --- | --- |
| `/` | Home page |
| `/articles` | Article library and topic discovery |
| `/articles/:slug` | Article detail page |
| `/news` | Searchable and filterable AI/technology news desk |
| `/news/:slug` | News story detail page |
| `/ebooks` | Engineering eBook catalog and download gate |
| `/topics` | Redirects to `/articles` |
| `/about` | About page |
| `/subscribe` | Subscription page |
| `/privacy` | Privacy policy |
| `/terms` | Terms of service |

Use links such as `/#/news` for a deployed GitHub Pages URL. The helper in `src/utils/sitePath.js` resolves public assets against Vite's configured base URL.

## Repository structure

```text
.
├── .github/
│   ├── workflows/
│   │   ├── ci.yml              # Tests, build, and audit on pushes/PRs
│   │   ├── deploy.yml          # GitHub Pages deployment from main
│   │   └── update-news.yml     # Scheduled RSS/Gemini news publishing
│   └── dependabot.yml
├── docs/                       # Product, architecture, API, security, and QA docs
├── public/
│   ├── articles/               # Published article/news HTML files
│   ├── news-art/               # Approved local news visuals
│   ├── alerts.json             # Public alert feed
│   ├── 404.html                # GitHub Pages SPA fallback
│   └── _redirects, robots.txt, sitemap.xml
├── src/
│   ├── components/             # Reusable UI, layout, article, news, and subscription components
│   ├── data/                   # Static article, news, eBook, alert, and visual metadata
│   ├── email/                  # Welcome-email template
│   ├── hooks/                  # React hooks, including subscription state
│   ├── pages/                  # Route-level screens
│   └── utils/                  # Site-path and email helpers
├── tests/                      # Node structural tests
├── tools/
│   ├── cms-server.cjs          # Local editorial CMS on port 3333
│   ├── news-api.cjs            # Optional read-only News API on port 8787
│   ├── update-news.cjs         # RSS/Gemini ingestion worker
│   ├── rebuild-news.cjs        # Re-index existing news HTML files
│   └── list-models.cjs         # Gemini API preflight used by Actions
├── index.html
├── package.json
├── vite.config.js
└── vercel.json
```

## Getting started

### Requirements

- Node.js 20 or newer
- npm
- Git, if you are publishing through the repository workflow

### Install and run the site

```bash
npm ci
npm run dev
```

Open the local URL printed by Vite, normally `http://localhost:5173`.

To test the production build locally:

```bash
npm run build
npm run preview
```

The generated `dist/` directory is ignored by Git and should not be committed.

## Available commands

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Create the production build in `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run check` | Run tests, then build the production bundle |
| `npm test` | Run the Node structural test suite |
| `npm run cms` | Start the local CMS at `http://localhost:3333` |
| `npm run news:update` | Fetch RSS news, optionally rewrite with Gemini, and update files |
| `npm run news:rebuild` | Rebuild `src/data/news.js` from existing news HTML files |
| `npm run news:api` | Start the read-only News API at `http://localhost:8787` |
| `node tools/generate-ebook-pdfs.cjs` | Generate configured eBook PDF assets |

Run security/dependency checks before a release:

```bash
npm run check
npm audit --audit-level=high
git diff --check
```

## Content and publishing

The static site has no production database. Content is published by committing source files and rebuilding the site.

### Articles

- Article metadata lives in `src/data/articles.js`.
- Article HTML bodies live under `public/articles/`.
- A route-level article page resolves metadata by slug and fetches the corresponding HTML file.
- Article links should use stable, lowercase slugs.

### News

- The published story index is `src/data/news.js`.
- News article bodies live under `public/articles/news/`.
- Approved topic visuals live under `public/news-art/`.
- The React news page imports the static index directly, so a browser does not fetch live news at runtime.

### Alerts

- Editorial alert data is maintained in `src/data/alerts.json`.
- The public copy is `public/alerts.json`.
- The subscription hook loads the public feed and falls back to browser-local alerts when necessary.

### eBooks

- eBook metadata is defined in `src/data/ebooks.js`.
- Download links point to configured public assets.
- The current browser-side company-email check is a UX gate, not secure authorization. Protected or paid files require a server-side entitlement service.

## Automated news updates

The news worker in `tools/update-news.cjs` follows this pipeline:

1. Fetch the previous day's AI stories from the configured Google News RSS query.
2. Examine the top feed items.
3. Rewrite up to two stories with Gemini when `GEMINI_API_KEY` is available.
4. Fall back to concise RSS snippets if the updater is run without a Gemini key.
5. Write standalone HTML files to `public/articles/news/`.
6. Merge new metadata with the existing index and re-index `src/data/news.js`.
7. Sort stories by publication date and assign lead/latest badges.

Run it locally with:

```bash
GEMINI_API_KEY="your-key" npm run news:update
```

The key is optional for the updater itself, but the GitHub Actions workflow currently runs `tools/list-models.cjs` first. That preflight expects a valid `GEMINI_API_KEY`; an absent or invalid secret can fail the job before the updater starts.

### GitHub Actions news workflow

`.github/workflows/update-news.yml`:

- runs every six hours using the cron expression `0 */6 * * *` (UTC);
- can be started manually with **Actions → Update News Feed → Run workflow**;
- checks out `main`;
- installs dependencies;
- uses the repository secret `GEMINI_API_KEY`;
- commits changed `src/data/news.js` and `public/articles/news/` files.

Updating the secret does not run the workflow automatically. Run it manually once after changing the secret, then inspect the job logs if it fails.

### Important deployment behavior

The news workflow pushes with the default GitHub Actions token. GitHub does not generally start a second workflow from a push made by that token. Therefore, a successful news commit may appear in the repository while the Pages site still shows the previous build.

If that happens, manually run **Deploy to GitHub Pages**, or change the deployment design so the news job builds/deploys directly or triggers deployment through an approved `workflow_run`, `workflow_dispatch`, repository-dispatch, or separate deployment token mechanism.

## Local CMS

Start the CMS in a separate terminal:

```bash
npm run cms
```

Open `http://localhost:3333`. The CMS server is intentionally bound to `127.0.0.1`; do not expose it to the public internet.

The CMS supports local editorial operations for articles, news, eBooks, subscribers, alerts, and AI-generated enterprise eBook drafts. Publishing writes files into the repository and may create a local Git commit. Review the diff before pushing.

### AI eBook Studio

The CMS includes an **AI Studio** tab for the enterprise eBook workflow. Enter only a working title and target audience. The local agent then runs staged Gemini generation for:

1. Research brief, positioning, sources, table of contents, and cover directions.
2. A 10–12 chapter manuscript targeting approximately 60–100 designed pages.
3. Editorial review, references, glossary, Kindle copy, keywords, and publishing recommendations.

Set `GEMINI_API_KEY` in a local `.env` file before starting the CMS. Begin with `.env.example`:

```bash
cp .env.example .env
# edit .env and replace replace_with_your_gemini_api_key
npm run cms
```

`.env` and other `.env.*` files are ignored by Git; only `.env.example` is allowed to be committed. Shell/CI environment variables take precedence over values in `.env`. Optionally set `EBOOK_GEMINI_MODEL` to override the default `gemini-2.5-flash` model. Generation jobs are kept in the local CMS process and expose progress through polling endpoints. Export the reviewed manuscript as HTML, then use **Open eBook publisher** to upload the final PDF into the existing gated catalog workflow.

The agent preserves the prompt template in `tools/ebook-agent.cjs`. It requires source URLs, labels hypothetical examples, avoids invented author credentials, and reports the word-count-based page estimate. Human fact-checking and final design review remain required before commercial publication.

The CMS is not deployed to GitHub Pages and is not a production authentication system.

## Optional News API

The static frontend does not require the API. To run the file-backed read API:

```bash
npm run news:api
```

Default address: `http://localhost:8787`.

Available endpoints:

| Endpoint | Description |
| --- | --- |
| `GET /api/health` | Health check |
| `GET /api/news` | List stories; supports `q` and `topic` query parameters |
| `GET /api/news/lead` | Return the lead story |
| `GET /api/news/latest?limit=8` | Return the latest stories |
| `GET /api/news/topics` | Return available topics |
| `GET /api/news/status` | Return count and latest publication date |
| `GET /api/news/:slug` | Return story metadata and article HTML |

Optional environment variables are available for alternate file locations:

```bash
PORT=8787 \
NEWS_DATA_FILE=src/data/news.js \
NEWS_ARTICLES_DIR=public/articles/news \
npm run news:api
```

This API has read endpoints only. Editorial mutations remain in the local CMS boundary.

## Configuration

### Local and server-side variables

| Variable | Used by | Required | Purpose |
| --- | --- | --- | --- |
| `GEMINI_API_KEY` | `tools/update-news.cjs`, `tools/list-models.cjs`, `tools/ebook-agent.cjs` | Optional locally; required for AI eBook generation | Enables Gemini rewriting, model-list validation, and staged eBook generation |
| `EBOOK_GEMINI_MODEL` | `tools/ebook-agent.cjs` | No | Overrides the AI eBook model; default `gemini-2.5-flash` |
| `CMS_PORT` | `tools/cms-server.cjs` | No | Overrides the local CMS port; default `3333` |
| `PORT` | `tools/news-api.cjs` | No | Overrides the News API port; default `8787` |
| `NEWS_DATA_FILE` | `tools/news-api.cjs` | No | Overrides the news index path |
| `NEWS_ARTICLES_DIR` | `tools/news-api.cjs` | No | Overrides the news HTML directory |

### Browser build variable

| Variable | Used by | Purpose |
| --- | --- | --- |
| `VITE_SUBSCRIPTION_API_URL` | `src/hooks/useSubscription.js` | Optional base URL for a separately hosted subscription service |

Never put API keys or private credentials in `VITE_*` variables. Vite embeds those values into the browser bundle. The subscription service must keep its own provider credentials server-side and implement validation, CORS, rate limiting, consent, deduplication, and email delivery.

### GitHub secret setup

For the automated news workflow, create a repository secret named exactly `GEMINI_API_KEY` under **Settings → Secrets and variables → Actions**. Do not commit the key, put it in `public/`, or paste it into an issue, pull request, or chat message.

## Deployment

### GitHub Pages

The production workflow is `.github/workflows/deploy.yml`:

1. It runs on pushes to `main` or by manual dispatch.
2. It installs dependencies with Node.js 20.
3. It runs `npm run build`.
4. It uploads `dist/` as a Pages artifact.
5. It deploys through the official GitHub Pages actions.

Repository setup:

1. Push the repository to GitHub.
2. In **Settings → Pages**, select **GitHub Actions** as the publishing source.
3. Confirm the Pages environment and deployment permissions are available.
4. Push to `main` or manually run **Deploy to GitHub Pages**.

The app uses `HashRouter`, `base: './'`, `sitePath()`, and `public/404.html` so repository subpaths and route refreshes work with GitHub Pages.

### Other static hosts

The app can also be built by any static host that supports Vite output. Use:

```bash
npm ci
npm run build
```

Deploy `dist/` as the site artifact. If a host does not preserve hash routes or static asset paths, configure its fallback behavior and verify `sitePath()`-resolved URLs.

The included `vercel.json` provides a Vercel build command configuration. The CMS and News API are not started by the static build and require separate server hosting if they are needed in production.

## Subscriptions and eBooks

Without `VITE_SUBSCRIPTION_API_URL`, subscription state is intentionally stored in the visitor's browser `localStorage`. This supports the static demo experience but does not provide durable email delivery, account authentication, or secure entitlements.

The company-email check rejects common free-mail and disposable domains as a convenience gate. It does not prove ownership of a domain. Do not use it to protect confidential content.

For real subscriptions or restricted downloads, add a trusted backend that provides:

- authenticated identity and entitlement checks;
- server-side email/provider credentials;
- rate limiting and abuse controls;
- consent, unsubscribe, retention, and deletion handling;
- short-lived signed download URLs;
- safe access logging.

## Testing and quality checks

The standard validation command is:

```bash
npm run check
```

It runs the Node structural tests and creates a production Vite build. CI additionally runs:

```bash
npm audit --audit-level=high
```

Before release, manually verify:

- home, articles, article detail, news, news detail, eBooks, subscribe, privacy, and terms routes;
- direct route loading and refreshes on a repository-path deployment;
- article and news HTML files resolve correctly;
- mobile, tablet, desktop, light mode, dark mode, keyboard navigation, and reduced motion;
- no `.env`, API key, subscriber record, or CMS endpoint is present in `dist/`;
- GitHub Pages is configured to publish from Actions and the custom domain/DNS is correct, if used.

## Troubleshooting

### The local site does not show newly fetched news

The frontend imports `src/data/news.js`; it does not fetch the RSS feed in the browser. Run the updater locally, confirm that it changed `src/data/news.js` or added files under `public/articles/news/`, then reload the Vite page.

### The GitHub news workflow fails immediately

Check the first failing step in the Actions log. The current workflow runs `tools/list-models.cjs` before `tools/update-news.cjs`. Confirm that:

- the secret is named `GEMINI_API_KEY`;
- it is configured in the correct repository;
- the key is valid for the Gemini API;
- the workflow has permission to read repository secrets;
- the RSS endpoint and Gemini API are reachable from the GitHub runner.

### The workflow succeeds but no new commit appears

The workflow only commits when the staged files differ. Confirm that the RSS feed returned items newer or different from the existing index. A successful run may legitimately print `No changes to commit.`

### The repository has new news but the live Pages site is old

Run **Deploy to GitHub Pages** manually. The automated news commit uses `GITHUB_TOKEN`, which normally does not trigger a separate push-based workflow. See [Important deployment behavior](#important-deployment-behavior).

### GitHub Pages shows a blank screen or broken assets

Confirm that Pages publishes through GitHub Actions, the deployment ran from `main`, and the build uses repository-safe asset paths. Keep application links hash-based, for example `/#/articles` and `/#/news`.

### Subscription state disappears or no email is delivered

That is expected without `VITE_SUBSCRIPTION_API_URL`: the static build stores only local browser state. Configure a separately hosted subscription service for durable records and email delivery.

### The CMS must be exposed publicly

Do not expose the local CMS as-is. It is bound to localhost and is not designed as a production authentication boundary. Use a separate authenticated editorial service before adding public access.

## Security and privacy

The public bundle must contain only editorial content and client-side UI. It must not contain:

- API keys or provider credentials;
- private subscriber records;
- passwords or access tokens;
- server-side authorization decisions.

The repository ignores `.env`, `dist/`, logs, and subscriber data. Review `SECURITY.md` before reporting or fixing a vulnerability. Report suspected vulnerabilities privately to `security@illuminaist.com` rather than opening a public issue.

## Contributing

1. Create a focused branch.
2. Install dependencies with `npm ci`.
3. Make the smallest appropriate change.
4. Add or update a structural/behavior test when changing publishing or validation logic.
5. Run `npm run check`, `npm audit --audit-level=high`, and `git diff --check`.
6. Review the diff for secrets, personal data, unsafe HTML, incorrect source attribution, and accidental changes to `public/`.
7. Open a pull request describing the user-visible change, security/privacy impact, and verification performed.

Pull requests run CI. Production deployment is restricted to `main`.

## Further documentation

The `docs/` directory is the detailed project reference:

- [`docs/README.md`](docs/README.md) — documentation index and source-of-truth note
- [`docs/1-PRD.md`](docs/1-PRD.md) — product requirements and non-goals
- [`docs/2-DESIGN.md`](docs/2-DESIGN.md) — design and accessibility guidance
- [`docs/3-ARCHITECTURE.md`](docs/3-ARCHITECTURE.md) — application architecture
- [`docs/4-DATABASE.md`](docs/4-DATABASE.md) — data and storage model
- [`docs/5-API.md`](docs/5-API.md) — optional subscription API contract
- [`docs/8-Setup.md`](docs/8-Setup.md) — setup notes
- [`docs/10-Feature-Development.md`](docs/10-Feature-Development.md) — feature workflow
- [`docs/11-Authentication-and-Security.md`](docs/11-Authentication-and-Security.md) — security boundaries
- [`docs/13-Integrations.md`](docs/13-Integrations.md) — hosting and integration notes
- [`docs/14-Testing-and-QA.md`](docs/14-Testing-and-QA.md) — QA checklist
- [`docs/15-Debugging.md`](docs/15-Debugging.md) — focused debugging guide
- [`docs/news-architecture.md`](docs/news-architecture.md) — News data, API, and persistence architecture
- [`docs/news-implementation-status.md`](docs/news-implementation-status.md) — News implementation handoff
- [`CONTRIBUTING.md`](CONTRIBUTING.md) — contribution rules
- [`SECURITY.md`](SECURITY.md) — security policy

