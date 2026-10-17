# IlluminAIst News Redesign — Phase 1 Discovery

Status: Discovery complete; implementation intentionally not started.

Reference reviewed: [Bloomberg Technology](https://www.bloomberg.com/technology). The reference establishes a broad technology-news experience with a section header, topic navigation, lead stories, topic-led content groups, explainers, video/audio modules, and a time-ordered “more news” stream. This document translates those patterns into original IlluminAIst product requirements without copying Bloomberg branding, source code, assets, or proprietary services.

## Sitemap

### Primary routes

- `/news` — technology and AI news landing page
- `/news/:slug` — story detail page
- `/news/topic/:topic` — filtered topic landing page
- `/news/search?q=` — search results

### Supporting routes

- `/news/explainers` — concise background pieces
- `/news/videos` — video/audio editorial items, when available
- `/news/archive/:date` — optional date archive
- `/subscribe` — existing subscription flow

The first release can keep topic filtering and search within `/news` to avoid unnecessary route complexity.

## Feature inventory

### Landing page

- News masthead with publication promise and current update time.
- Topic navigation: AI, Big Tech, Cybersecurity, Startups, Research, Policy, Healthcare, and Markets.
- Lead package: one dominant story plus two supporting stories.
- Latest stream: chronological, compact, fast-scanning story list.
- Topic sections with a lead card and supporting cards.
- Explainers module for evergreen context.
- Optional media module for video/audio with duration and play affordances.
- Search, topic filtering, sort/order, and empty states.
- Low-interruption ad slots below major editorial packages.
- Daily refresh indicator and “new since last visit” treatment.

### Story detail

- Topic label, concise headline, dek, source, published/updated time, and reading time.
- Key-points summary before the full article.
- Article body with related stories and source attribution.
- Share, save/bookmark, and “next story” actions.
- Responsive typography and accessible reading width.

### Editorial operations

- RSS/API ingestion for approved sources.
- Deduplication by canonical URL and normalized title.
- Fact-first title and summary normalization.
- Topic classification and relevance scoring.
- Image selection with source rights/attribution metadata.
- Scheduled daily refresh plus manual refresh.
- Failed-ingestion visibility and safe fallback to the last successful dataset.

## User journeys

### Scan the latest news

1. User opens `/news`.
2. Sees the lead package and latest-update time.
3. Scans compact latest stories by time and topic.
4. Opens a story or filters to a topic.

### Find a topic

1. User selects a topic such as AI or Cybersecurity.
2. Page updates without losing the current scroll position.
3. Results retain lead, latest, and supporting-card hierarchy.
4. Empty state suggests adjacent topics or a broader search.

### Read a story quickly

1. User opens a headline.
2. Key points and source/time metadata appear before long-form content.
3. User can share, save, or move to the next story.

### Return for daily updates

1. Scheduled ingestion refreshes the dataset daily.
2. The page shows the last successful refresh time.
3. New stories receive a “New” or “Breaking” label only when supported by source timing.
4. Existing URLs remain stable through slug preservation.

## UI component inventory

### Global/reused

- Site header/footer and theme toggle.
- Responsive container and page shell.
- Ad slot placeholder.
- Accessible button, link, badge, timestamp, and loading skeleton primitives.

### News-specific

- `NewsMasthead`
- `NewsTopicNav`
- `LeadStoryPackage`
- `SupportingStoryCard`
- `LatestNewsList`
- `NewsTopicSection`
- `ExplainerCard`
- `MediaStoryCard`
- `QuickReadSummary`
- `StoryMeta`
- `StoryActions`
- `RelatedStories`
- `NewsSearchControls`
- `RefreshStatus`
- `NewsErrorState`

### Responsive behavior

- Desktop: lead package and latest stream in a two-column composition.
- Tablet: lead package remains dominant; topic sections use two columns.
- Mobile: one-column stream, sticky topic navigation only if it does not obstruct reading, and touch-friendly actions.

## Data entities

### Story

- `id`
- `slug`
- `title`
- `dek`
- `quickSummary`
- `bodyHtml` or trusted rich-text blocks
- `topic`
- `tags[]`
- `sourceId`
- `canonicalUrl`
- `imageId`
- `publishedAt`
- `updatedAt`
- `readingTimeMinutes`
- `status`: draft, published, archived, failed
- `priority`: lead, supporting, latest, standard
- `isBreaking`
- `createdAt`

### Source

- `id`
- `name`
- `domain`
- `feedUrl`
- `sourceType`: rss, api, manual
- `attributionText`
- `active`

### Topic

- `id`
- `slug`
- `name`
- `description`
- `displayOrder`
- `accentColor`

### MediaAsset

- `id`
- `url`
- `altText`
- `caption`
- `credit`
- `license`
- `width`
- `height`
- `topic`

### IngestionRun

- `id`
- `startedAt`
- `completedAt`
- `status`
- `itemsFetched`
- `itemsPublished`
- `itemsSkipped`
- `errorSummary`

### User preference (optional later)

- `userId`
- `followedTopics[]`
- `savedStoryIds[]`
- `lastSeenAt`

## API requirements

### Public read API

- `GET /api/news?topic=&q=&sort=&page=&limit=`
- `GET /api/news/lead`
- `GET /api/news/latest?limit=`
- `GET /api/news/topics`
- `GET /api/news/:slug`
- `GET /api/news/:slug/related`
- `GET /api/news/status` — last successful refresh and item count

### Protected editorial API

- `POST /api/admin/ingestion/run`
- `POST /api/admin/stories`
- `PATCH /api/admin/stories/:id`
- `POST /api/admin/media`
- `GET /api/admin/ingestion/runs`

### API behavior

- Stable pagination and deterministic ordering.
- Cache public GET responses for a short period.
- Return `lastUpdatedAt` and `source` metadata.
- Validate and sanitize article HTML before serving.
- Never expose ingestion secrets or provider credentials to the browser.

## Integration requirements

- RSS parser or licensed news API for ingestion.
- Optional LLM summarization service for concise title/dek/quick-read generation; generated copy must be validated and reviewed by rules.
- Object storage/CDN for approved editorial images.
- Scheduled job runner (GitHub Actions, cron, or hosted worker).
- Analytics for story impressions, clicks, search usage, topic selection, and reading depth.
- Error monitoring for ingestion and client failures.
- Existing IlluminAIst subscription, theme, header, footer, and ad systems remain unchanged.

## Non-goals and guardrails

- No Bloomberg code, CSS, logo, typography, proprietary images, trademarks, or private APIs.
- No scraping behind authentication or paywalls.
- No automatic publication of unverified/generated claims without source attribution and validation.
- No replacement of existing non-News routes during the News redesign.

## Phase 1 acceptance criteria

- Sitemap, feature inventory, user journeys, component inventory, entities, API requirements, and integration requirements are documented.
- Reference-derived behaviors are separated from original IlluminAIst branding and implementation.
- Phase 2 can make concrete architecture and schema decisions without needing to rediscover the product surface.
