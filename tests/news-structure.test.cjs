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
