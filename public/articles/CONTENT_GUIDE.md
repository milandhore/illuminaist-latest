# IlluminAIst — Content Publishing Guide

> **The fastest path to publishing:** Copy the template → write your article → register it → build → deploy.
> Total time for a practised author: **~5 minutes** of setup work.

---

## 📁 Folder Structure

Articles live in `public/articles/` organised by topic:

```
public/articles/
├── ARTICLE_TEMPLATE.html   ← Copy this to start a new article
├── CONTENT_GUIDE.md        ← You are here
│
├── ai-llms/                ← AI & LLMs: GPT, Claude, Gemini, benchmarks, architecture
├── rag-agents/             ← RAG, LangChain, LangGraph, AutoGen, agents, tool calling
├── cloud-devops/           ← Kubernetes, CI/CD, infrastructure, cloud platforms
├── mlops/                  ← Model serving, vLLM, monitoring, training pipelines
├── emerging-tech/          ← Quantum, robotics, research papers, future tech
├── tutorials/              ← Step-by-step how-to guides (any topic)
└── opinion/                ← Opinion, analysis, industry commentary
```

---

## ✍️ How to Add a New Article in 3 Steps

### Step 1 — Copy the template and write your article

1. Copy `ARTICLE_TEMPLATE.html` into the matching topic folder and rename it:
   ```
   public/articles/ai-llms/my-new-article.html
   ```
2. Open it and fill in `<title>`, `<meta name="description">`, and the body content.

The template has detailed comments explaining every HTML element and best practice.

> ✅ **Only the `<body>` content is extracted** — the site's header, nav, ads, progress bar, table of contents, and footer all wrap around it automatically.

---

### Step 2 — Register the article in `src/data/articles.js`

Open `src/data/articles.js` and add a new entry to the `articles` array. **Insert it at the TOP of the array** so it appears first (most recent first):

```js
{
  slug: 'my-new-article',         // MUST match the filename (without .html)
  topicSlug: 'ai-llms',          // MUST match the folder name exactly (see table below)
  category: 'AI & LLMs',         // Display label shown on cards (see table below)
  difficulty: 'Intermediate',     // 'Beginner' | 'Intermediate' | 'Advanced'
  title: 'Your Article Title',
  excerpt: 'One clear paragraph summary shown on article cards and in search results.',
  avatar: 'AI',                   // 2-letter initials for the author avatar circle
  author: 'IlluminAIst',
  readingTime: 8,                 // Estimated minutes (count ~200 words/min)
  publishedAt: '2026-09-27',     // ISO date (YYYY-MM-DD)
  htmlFile: true,                 // ← ALWAYS true for HTML file articles
  featured: false,                // Set true on ONE article to show it in the hero
  tags: ['GPT', 'LLM', 'RAG'],  // Optional: shown at the bottom of the article
},
```

#### Topic Folder → Category Mapping

| `topicSlug` (folder name) | `category` (display label) |
|---|---|
| `ai-llms` | `AI & LLMs` |
| `rag-agents` | `RAG & Agents` |
| `cloud-devops` | `Cloud & DevOps` |
| `mlops` | `MLOps` |
| `emerging-tech` | `Emerging Tech` |
| `tutorials` | `Tutorials` |
| `opinion` | `Opinion` |

---

### Step 3 — Build and deploy

```bash
# From the project root:
npm run build
```

This creates a `dist/` folder. Push it to GitHub and GitHub Actions will deploy automatically (via the `.github/` workflow already in the repo).

The article will be live at:
```
https://yoursite.com/#/articles/my-new-article
```

---

## 📝 Supported HTML Tags

All standard HTML is supported and styled automatically inside `.article-prose`:

| Tag | Rendered result |
|---|---|
| `<h2>` | Section heading with cyan underline |
| `<h3>` | Sub-heading in cyan text |
| `<h4>` | Small heading in slate-100 |
| `<p>` | Body paragraph, comfortable line-height |
| `<pre><code>` | Dark code block with monospace font |
| `<code>` | Inline code (cyan highlight) |
| `<blockquote>` | Pull quote with cyan left border |
| `<ul>`, `<ol>`, `<li>` | Lists with cyan bullet markers |
| `<strong>` | Bold text |
| `<a href="">` | Cyan hyperlinks |
| `<hr>` | Horizontal divider |
| `<img>` | Images (use full URL or relative to `public/`) |

---

## 🎯 What Happens Automatically on Every Article

You don't need to add any of these — the site handles them for you:

| Feature | Where it appears |
|---|---|
| **Reading progress bar** | Top of page, fills as you scroll |
| **Table of Contents** | Auto-generated from your `h2`/`h3` headings; left column on desktop, sidebar on tablet |
| **Google AdSense** | Leaderboard (top), in-article (after header), sidebar (×2), bottom |
| **Share buttons** | Twitter/X, LinkedIn, Copy Link (with ✓ feedback) |
| **Related articles** | 3 articles from the same category shown below each article |
| **Author + reading time** | Pulled from `articles.js` metadata |
| **Dark/light mode** | Toggle in the header; all prose adapts |

---

## 💡 Google AdSense Configuration

**One-time setup** (only needs to be done once, not per article):

1. Open `index.html` (project root).
2. Find the line: `src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"`
3. Replace `ca-pub-XXXXXXXXXXXXXXXX` with your **Publisher ID** from AdSense.

4. Open `src/components/ads/AdBanner.jsx`.
5. Update the `PUB_ID` constant and each `slotId` in `SLOT_CONFIG`:

```js
const PUB_ID = 'ca-pub-YOUR_REAL_PUB_ID'

const SLOT_CONFIG = {
  header:       { slotId: '1111111111', ... },   // ← your leaderboard slot ID
  sidebar:      { slotId: '2222222222', ... },   // ← your rectangle slot ID
  'in-article': { slotId: '3333333333', ... },   // ← your in-article slot ID
  'bottom-feed':{ slotId: '4444444444', ... },   // ← your billboard slot ID
}
```

> ⚠️ Ads only render on your **live domain** — they show as grey placeholder boxes on localhost. That's expected.

---

## 🖼️ Adding Images to Articles

**Option A — External URL:**
```html
<img src="https://cdn.example.com/my-image.png" alt="Description" style="max-width:100%;border-radius:8px;margin:1.5rem 0;">
```

**Option B — Local image in the repo:**
1. Place the file at: `public/articles/ai-llms/images/my-image.png`
2. Reference it: `<img src="/articles/ai-llms/images/my-image.png" alt="...">`

---

## 🚀 Deployment Checklist

Before pushing to GitHub:

- [ ] HTML file saved in the correct `public/articles/<topic>/` folder
- [ ] Filename matches the `slug` in `articles.js` (e.g. `my-article.html` → `slug: 'my-article'`)
- [ ] `htmlFile: true` is set in `articles.js`
- [ ] `topicSlug` matches the folder name exactly
- [ ] `npm run build` completes without errors
- [ ] If this is your first article, confirm AdSense `ca-pub-` ID is set in `index.html`
