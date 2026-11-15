const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')

const root = path.join(__dirname, '..')

test('news foundation files exist', () => {
  for (const file of ['src/pages/NewsPage.jsx', 'src/pages/NewsDetailPage.jsx', 'src/data/news.js', 'tools/update-news.cjs']) {
    assert.equal(fs.existsSync(path.join(root, file)), true, `${file} should exist`)
  }
})

test('news data has concise publishable metadata', () => {
  const source = fs.readFileSync(path.join(root, 'src/data/news.js'), 'utf8')
  const match = source.match(/export const newsItems = ([\s\S]*);\s*$/)
  assert.ok(match, 'news data should export newsItems')
  const items = JSON.parse(match[1])
  assert.ok(items.length > 0)
  for (const item of items.slice(0, 10)) {
    assert.ok(item.slug)
    assert.ok(item.title && item.title.length <= 240)
    assert.ok(item.excerpt && item.excerpt.length <= 240)
    assert.ok(item.publishedAt)
  }
})

test('news API source has read endpoints', () => {
  const source = fs.readFileSync(path.join(root, 'tools/news-api.cjs'), 'utf8')
  for (const endpoint of ['/api/health', '/api/news', '/api/news/lead', '/api/news/latest', '/api/news/topics']) {
    assert.match(source, new RegExp(endpoint.replaceAll('/', '\\/')))
  }
})

test('news automation supports RSS fallback and preserves source URLs', () => {
  const updater = fs.readFileSync(path.join(root, 'tools/update-news.cjs'), 'utf8')
  const workflow = fs.readFileSync(path.join(root, '.github/workflows/update-news.yml'), 'utf8')

  assert.match(updater, /No GEMINI_API_KEY found, returning fallback snippet/)
  assert.match(updater, /sourceUrl:/)
  assert.match(updater, /Source:<\/strong>/)
  assert.match(updater, /validSourceUrl\(item\.link\)/)
  assert.match(workflow, /GEMINI_API_KEY is not configured; the updater will use RSS fallback content\./)
})

test('article automation targets current engineering and strategy topics', () => {
  const updater = fs.readFileSync(path.join(root, 'tools/update-articles.cjs'), 'utf8')
  const workflow = fs.readFileSync(path.join(root, '.github/workflows/update-articles.yml'), 'utf8')

  for (const phrase of ['AI engineering', 'agentic AI', 'enterprise AI strategy', 'emerging technology']) {
    assert.ok(updater.toLowerCase().includes(phrase.toLowerCase()), `article updater should include ${phrase}`)
  }
  assert.match(updater, /export const articles/)
  assert.match(updater, /sourceAttribution/)
  assert.match(updater, /REFERENCE_SOURCES/)
  assert.match(updater, /theagenticdigest\.com/)
  assert.match(updater, /agenticlibrary\.net/)
  assert.match(updater, /buildEditorialDiagram/)
  assert.match(updater, /<svg/)
  assert.match(updater, /path\.join\(ROOT, 'public', 'articles'\)/)
  assert.match(workflow, /schedule:/)
  assert.match(workflow, /node tools\/update-articles\.cjs/)
  assert.match(updater, /skipping article publication to protect editorial quality/)
  assert.match(updater, /wordCount < 450/)
})
