#!/usr/bin/env node
const fs = require('fs')
const path = require('path')

const ROOT = path.resolve(__dirname, '..')
const NEWS_JS = path.join(ROOT, 'src', 'data', 'news.js')
const NEWS_DIR = path.join(ROOT, 'public', 'articles', 'news')
const seedFile = process.argv[2] ? path.resolve(process.argv[2]) : path.join(__dirname, 'latest-ai-news.json')
const seed = JSON.parse(fs.readFileSync(seedFile, 'utf8'))

function slugify(text) {
  return String(text).toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '')
}

function escapeHtml(value) {
  return String(value == null ? '' : value)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;')
}

function readNews() {
  const source = fs.readFileSync(NEWS_JS, 'utf8')
  const match = source.match(/export const newsItems\s*=\s*(\[[\s\S]*?\])\s*;?\s*$/)
  return match ? JSON.parse(match[1]) : []
}

function writeNews(items) {
  const source = fs.readFileSync(NEWS_JS, 'utf8')
  const updated = source.replace(
    /export const newsItems\s*=\s*\[[\s\S]*?\]\s*;?\s*$/,
    'export const newsItems = ' + JSON.stringify(items, null, 2) + ';\n'
  )
  fs.writeFileSync(NEWS_JS, updated, 'utf8')
}

function makeHtml(item) {
  const body = item.body.split(/\n\s*\n/).map(paragraph => `<p>${escapeHtml(paragraph)}</p>`).join('\n')
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${escapeHtml(item.title)} | IlluminAIst</title>
  <meta name="description" content="${escapeHtml(item.excerpt)}">
</head>
<body>
  <h2>${escapeHtml(item.title)}</h2>
  <p><strong>${escapeHtml(item.excerpt)}</strong></p>
  ${body}
  <p><strong>Source:</strong> <a href="${escapeHtml(item.sourceUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(item.source)}</a></p>
</body>
</html>
`
}

const existing = readNews()
const seedItems = seed.map(item => ({ ...item, slug: slugify(item.title) }))
const seedSlugs = new Set(seedItems.map(item => item.slug))
const retained = existing.filter(item => !seedSlugs.has(item.slug))
const maxId = retained.reduce((max, item) => Math.max(max, Number(item.id) || 0), 0)

fs.mkdirSync(NEWS_DIR, { recursive: true })
const imported = seedItems.map((item, index) => ({
  title: item.title,
  excerpt: item.excerpt,
  source: item.source,
  sourceUrl: item.sourceUrl,
  slug: item.slug,
  htmlPath: `/articles/news/${item.slug}.html`,
  publishedAt: item.publishedAt,
  category: item.category,
  id: maxId + index + 1,
  badge: index === 0 ? 'Breaking' : 'Latest',
  badgeColor: index === 0 ? 'cyan' : 'amber'
}))

for (const item of seedItems) {
  fs.writeFileSync(path.join(NEWS_DIR, `${item.slug}.html`), makeHtml(item), 'utf8')
}

writeNews([...imported, ...retained])
console.log(`Imported ${imported.length} concise AI news stories into news.js and ${NEWS_DIR}`)
