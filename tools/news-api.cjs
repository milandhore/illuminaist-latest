const express = require('express')
const fs = require('fs')
const path = require('path')

const app = express()
const port = Number(process.env.PORT || 8787)
const root = path.join(__dirname, '..')
const dataFile = process.env.NEWS_DATA_FILE || path.join(root, 'src', 'data', 'news.js')
const articlesDir = process.env.NEWS_ARTICLES_DIR || path.join(root, 'public', 'articles', 'news')

function readItems() {
  const source = fs.readFileSync(dataFile, 'utf8')
  const match = source.match(/export const newsItems = ([\s\S]*);\s*$/)
  return match ? JSON.parse(match[1]) : []
}

function payload(items) {
  return { items, total: items.length, lastUpdatedAt: items[0]?.publishedAt || null }
}

app.use(express.json())
app.get('/api/health', (_req, res) => res.json({ ok: true, service: 'news-api' }))
app.get('/api/news/topics', (_req, res) => {
  const topics = [...new Set(readItems().map(item => item.category || 'AI News'))]
  res.json({ items: topics, total: topics.length })
})
app.get('/api/news/status', (_req, res) => {
  const items = readItems()
  res.json({ ok: true, total: items.length, lastUpdatedAt: items[0]?.publishedAt || null })
})
app.get('/api/news/lead', (_req, res) => res.json({ item: readItems()[0] || null }))
app.get('/api/news/latest', (req, res) => {
  const limit = Math.min(Math.max(Number(req.query.limit) || 8, 1), 50)
  res.json(payload(readItems().slice(0, limit)))
})
app.get('/api/news/:slug', (req, res) => {
  const item = readItems().find(story => story.slug === req.params.slug)
  if (!item) return res.status(404).json({ error: 'Story not found' })
  const articlePath = path.join(articlesDir, `${item.slug}.html`)
  const html = fs.existsSync(articlePath) ? fs.readFileSync(articlePath, 'utf8') : null
  return res.json({ item, html })
})
app.get('/api/news', (req, res) => {
  const query = String(req.query.q || '').trim().toLowerCase()
  const topic = String(req.query.topic || '').trim().toLowerCase()
  const items = readItems().filter(item => {
    const haystack = `${item.title} ${item.excerpt} ${item.source}`.toLowerCase()
    return (!query || haystack.includes(query)) && (!topic || String(item.category || '').toLowerCase() === topic)
  })
  res.json(payload(items))
})

app.listen(port, () => console.log(`News API listening on http://localhost:${port}`))
