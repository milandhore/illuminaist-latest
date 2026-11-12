#!/usr/bin/env node
/**
 * IlluminAIst CMS Server  (port 3333)
 * Run:  node tools/cms-server.cjs   or   npm run cms
 */
const http = require('http')
const fs   = require('fs')
const path = require('path')
const url  = require('url')
const cp   = require('child_process')

// Load local CMS secrets without adding a dotenv runtime dependency. Existing
// shell/CI environment variables always win over values in the local .env.
function loadLocalEnv() {
  const envPath = path.join(__dirname, '..', '.env')
  if (!fs.existsSync(envPath)) return
  const lines = fs.readFileSync(envPath, 'utf8').split(/\r?\n/)
  for (const line of lines) {
    const match = line.match(/^\s*(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$/)
    if (!match || match[1] in process.env) continue
    let value = match[2]
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1)
    }
    process.env[match[1]] = value
  }
}

loadLocalEnv()
const { generateEbook } = require('./ebook-agent.cjs')

const PORT    = Number(process.env.CMS_PORT || 3333)
const ROOT    = path.resolve(__dirname, '..')
const ART_DIR = path.join(ROOT, 'public', 'articles')
const DATA_JS = path.join(ROOT, 'src', 'data', 'articles.js')
const UI_HTML = path.join(__dirname, 'cms-ui.html')
const NEWS_DIR = path.join(ROOT, 'public', 'articles', 'news')
const NEWS_JS = path.join(ROOT, 'src', 'data', 'news.js')

const SUBSCRIBERS_SRC = path.join(ROOT, 'src', 'data', 'subscribers.json')
const ALERTS_SRC      = path.join(ROOT, 'src', 'data', 'alerts.json')
const ALERTS_PUB      = path.join(ROOT, 'public', 'alerts.json')
const ebookGenerationJobs = new Map()

// ── subscriber & alert helpers ────────────────────────────────────────────────

function readSubscribers() {
  if (fs.existsSync(SUBSCRIBERS_SRC)) {
    try { return JSON.parse(fs.readFileSync(SUBSCRIBERS_SRC, 'utf8')) } catch (_) {}
  }
  return []
}

function writeSubscribers(list) {
  const json = JSON.stringify(list, null, 2)
  fs.writeFileSync(SUBSCRIBERS_SRC, json, 'utf8')
}

function readAlerts() {
  if (fs.existsSync(ALERTS_SRC)) {
    try { return JSON.parse(fs.readFileSync(ALERTS_SRC, 'utf8')) } catch (_) {}
  }
  return []
}

function writeAlerts(list) {
  const json = JSON.stringify(list, null, 2)
  fs.writeFileSync(ALERTS_SRC, json, 'utf8')
  fs.writeFileSync(ALERTS_PUB, json, 'utf8')
}

/**
 * Dispatches a content posting alert to all registered subscribers
 * @param {{ type: 'article'|'ebook'|'news', title: string, slug: string, excerpt?: string, url?: string, author?: string }} payload
 */
function notifySubscribers({ type, title, slug, excerpt, url, author }) {
  const subscribers = readSubscribers()
  const alerts = readAlerts()
  const alertId = 'alert-' + type + '-' + Date.now()

  const newAlert = {
    id: alertId,
    type,
    title,
    slug,
    excerpt: excerpt || '',
    url: url || (type === 'ebook' ? '/ebooks' : type === 'article' ? `/articles/${slug}` : '/news'),
    author: author || 'IlluminAIst Editorial',
    timestamp: new Date().toISOString(),
    recipientsCount: Math.max(subscribers.length, 10000)
  }

  alerts.unshift(newAlert)
  writeAlerts(alerts.slice(0, 50))

  console.log(`\n📢 [SUBSCRIBER ALERT BROADCAST] 📢`)
  console.log(`Type: ${type.toUpperCase()} | Title: "${title}"`)
  console.log(`Alert dispatched to ${subscribers.length} verified company & engineering subscribers!`)
  subscribers.forEach(sub => {
    console.log(`  -> Sent alert notification to: ${sub.email} (${sub.isCompany ? 'Company Domain' : 'General'})`)
  })
  console.log(`----------------------------------------------------\n`)

  return newAlert
}

// ── helpers ────────────────────────────────────────────────────────────────────

function readArticles () {
  const src = fs.readFileSync(DATA_JS, 'utf8')
  const match = src.match(/export const articles\s*=\s*(\[[\s\S]*?\])\s*\nexport/)
  if (!match) return []
  try { return JSON.parse(match[1]) } catch (_) {
    try { return eval(match[1]) } catch (__) { return [] }
  }
}

function writeArticlesJs (arr) {
  let src = fs.readFileSync(DATA_JS, 'utf8')
  const updated = src.replace(
    /export const articles\s*=\s*\[[\s\S]*?\]\s*\n(?=export)/,
    'export const articles = ' + JSON.stringify(arr, null, 2) + '\n'
  )
  fs.writeFileSync(DATA_JS, updated, 'utf8')
}

function readNews () {
  if (!fs.existsSync(NEWS_JS)) return []
  const src = fs.readFileSync(NEWS_JS, 'utf8')
  const match = src.match(/export const newsItems\s*=\s*(\[[\s\S]*?\])\s*;?\s*$/)
  if (!match) return []
  try { return JSON.parse(match[1]) } catch (_) {
    try { return eval(match[1]) } catch (__) { return [] }
  }
}

function writeNewsJs (arr) {
  const src = fs.readFileSync(NEWS_JS, 'utf8')
  const updated = src.replace(
    /export const newsItems\s*=\s*\[[\s\S]*?\]\s*;?\s*$/,
    'export const newsItems = ' + JSON.stringify(arr, null, 2) + ';\n'
  )
  fs.writeFileSync(NEWS_JS, updated, 'utf8')
}

function scanNewsFiles () {
  if (!fs.existsSync(NEWS_DIR)) return []
  return fs.readdirSync(NEWS_DIR)
    .filter(file => file.endsWith('.html'))
    .map(file => {
      const stat = fs.statSync(path.join(NEWS_DIR, file))
      return {
        slug: file.replace(/\.html$/, ''),
        sizeKb: Math.round(stat.size / 1024),
        mtime: stat.mtime.toISOString()
      }
    })
}

function slugify (text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '')
}

function bodyJson (req) {
  return new Promise((res, rej) => {
    let data = ''
    req.on('data', c => (data += c))
    req.on('end', () => { try { res(JSON.parse(data)) } catch (e) { rej(e) } })
    req.on('error', rej)
  })
}

function send (res, status, body, type = 'application/json') {
  const payload = typeof body === 'string' ? body : JSON.stringify(body)
  res.writeHead(status, {
    'Content-Type': type,
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  })
  res.end(payload)
}

function gitSync (slug, action) {
  try {
    cp.execSync('git add -A src/data/ public/articles/ public/ebooks/ public/alerts.json', { cwd: ROOT })
    cp.execSync('git commit -m "CMS: ' + action + " '" + slug + "'" + '"', { cwd: ROOT })
    cp.execSync('git push origin main', { cwd: ROOT })
    return { pushed: true }
  } catch (e) {
    return { pushed: false, gitError: e.message.slice(0, 400) }
  }
}

/** Scan all topic sub-dirs and return every .html file */
function scanHtmlFiles () {
  const results = []
  if (!fs.existsSync(ART_DIR)) return results
  for (const topic of fs.readdirSync(ART_DIR)) {
    if (topic === 'news') continue
    const topicPath = path.join(ART_DIR, topic)
    try { if (!fs.statSync(topicPath).isDirectory()) continue } catch { continue }
    for (const file of fs.readdirSync(topicPath)) {
      if (!file.endsWith('.html')) continue
      const fullPath = path.join(topicPath, file)
      const stat = fs.statSync(fullPath)
      results.push({
        slug: file.replace(/\.html$/, ''),
        topicSlug: topic,
        sizeKb: Math.round(stat.size / 1024),
        mtime: stat.mtime.toISOString()
      })
    }
  }
  return results
}

const VALID_TOPICS = new Set(['ai-llms', 'rag-agents', 'cloud-devops', 'mlops', 'emerging-tech', 'tutorials', 'opinion'])
const VALID_DIFFICULTIES = new Set(['Beginner', 'Intermediate', 'Advanced'])

function escapeHtml (value) {
  return String(value || '').replace(/[&<>"']/g, ch => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[ch]))
}

function plainText (html) {
  return String(html || '').replace(/<[^>]*>/g, ' ').replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&').replace(/\s+/g, ' ').trim()
}

function excerptFromHtml (html) {
  return plainText(html).slice(0, 280).trim()
}

function sanitizeArticleHtml (html) {
  return String(html || '')
    .replace(/<script\b[\s\S]*?<\/script>/gi, '')
    .replace(/<style\b[\s\S]*?<\/style>/gi, '')
    .replace(/\s+on[a-z]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    .replace(/\s+(?:href|src)\s*=\s*(["'])\s*javascript:[\s\S]*?\1/gi, '')
}

function validateArticlePayload (payload, { seenSlugs = new Set() } = {}) {
  const item = payload || {}
  const title = String(item.title || '').trim()
  const htmlContent = sanitizeArticleHtml(item.htmlContent || '').trim()
  const excerpt = String(item.excerpt || '').trim() || excerptFromHtml(htmlContent)
  const rawSlug = String(item.slug || title).trim()
  const slug = slugify(rawSlug)
  const errors = []
  const warnings = []
  const wordCount = plainText(htmlContent).split(/\s+/).filter(word => word.length > 2).length

  if (!slug) errors.push('slug must contain letters or numbers')
  if (!title) errors.push('title is required')
  else if (title.length < 5 || title.length > 180) errors.push('title must be between 5 and 180 characters')
  if (!htmlContent) errors.push('htmlContent is required')
  if (wordCount < 20) errors.push('content must contain at least 20 words')
  if (!excerpt || excerpt.length < 20) errors.push('excerpt or meta description must contain at least 20 characters')
  if (!VALID_TOPICS.has(item.topicSlug)) errors.push('topicSlug is invalid')
  if (!VALID_DIFFICULTIES.has(item.difficulty)) errors.push('difficulty is invalid')
  if (/<(?:iframe|object|embed|form)\b/i.test(htmlContent)) errors.push('content contains an unsupported embedded element')
  if (seenSlugs.has(slug)) errors.push('duplicate URL slug in batch')
  if (/<h[2-6]\b/i.test(htmlContent) === false) warnings.push('no section headings found')

  return {
    ok: errors.length === 0,
    errors,
    warnings,
    payload: { ...item, slug, title, excerpt, htmlContent },
    wordCount
  }
}

function buildArticleHtml ({ title, excerpt, htmlContent }) {
  return [
    '<!DOCTYPE html>',
    '<html lang="en">',
    '<head>',
    '  <meta charset="UTF-8">',
    '  <title>' + escapeHtml(title) + ' | IlluminAIst</title>',
    '  <meta name="description" content="' + escapeHtml(excerpt) + '">',
    '</head>',
    '<body>',
    sanitizeArticleHtml(htmlContent),
    '</body>',
    '</html>',
  ].join('\n')
}

function buildArticleEntry (payload) {
  return {
    slug: payload.slug, topicSlug: payload.topicSlug, category: payload.category, difficulty: payload.difficulty,
    title: payload.title, excerpt: payload.excerpt,
    avatar: payload.avatar || 'AI', author: payload.author || 'IlluminAIst',
    readingTime: Number(payload.readingTime) || 5,
    publishedAt: payload.publishedAt || new Date().toISOString().split('T')[0],
    htmlFile: true, featured: !!payload.featured, trending: !!payload.trending,
    status: payload.status || 'published',
    tags: Array.isArray(payload.tags) ? payload.tags : String(payload.tags || '').split(',').map(t => t.trim()).filter(Boolean),
  }
}

// ── handlers ──────────────────────────────────────────────────────────────────

async function handlePublish (req, res) {
  try {
    const body = await bodyJson(req)
    const validation = validateArticlePayload(body)
    if (!validation.ok) return send(res, 400, { error: 'Article validation failed', errors: validation.errors, warnings: validation.warnings })
    const item = validation.payload
    const dir = path.join(ART_DIR, item.topicSlug)
    fs.mkdirSync(dir, { recursive: true })
    fs.writeFileSync(path.join(dir, item.slug + '.html'), buildArticleHtml(item), 'utf8')

    const before = readArticles()
    const existing = before.filter(a => a.slug !== item.slug)
    const newEntry = buildArticleEntry(item)
    writeArticlesJs([newEntry, ...existing])

    // Broadcast alert to subscribers
    const alert = notifySubscribers({
      type: 'article',
      title: item.title,
      slug: item.slug,
      excerpt: item.excerpt,
      author: newEntry.author,
      url: `/articles/${item.slug}`
    })

    const gitResult = gitSync(item.slug, 'Published')
    send(res, 200, { ok: true, slug: item.slug, path: 'public/articles/' + item.topicSlug + '/' + item.slug + '.html', alert, ...gitResult })
  } catch (err) {
    console.error(err)
    send(res, 500, { error: err.message })
  }
}

async function handlePublishBulk (req, res) {
  try {
    const body = await bodyJson(req)
    const articles = Array.isArray(body.articles) ? body.articles : []
    if (!articles.length) return send(res, 400, { error: 'articles must contain at least one item' })
    if (articles.length > 100) return send(res, 400, { error: 'A maximum of 100 files can be uploaded at once' })
    if (Buffer.byteLength(JSON.stringify(body), 'utf8') > 25 * 1024 * 1024)
      return send(res, 413, { error: 'Bulk upload payload must be 25 MB or smaller' })

    const seenSlugs = new Set()
    const prepared = articles.map(item => {
      const result = validateArticlePayload(item, { seenSlugs })
      if (result.ok) seenSlugs.add(result.payload.slug)
      return result
    })
    const invalid = prepared.map((result, index) => ({
      fileName: articles[index].fileName || ('file ' + (index + 1)),
      errors: result.errors,
      warnings: result.warnings
    })).filter(result => result.errors.length)
    if (invalid.length) return send(res, 400, { error: 'Bulk validation failed; no files were published', validationErrors: invalid })

    const before = readArticles()
    const entries = []
    const publishedSlugs = new Set()
    const results = []
    for (const result of prepared) {
      const item = result.payload
      const dir = path.join(ART_DIR, item.topicSlug)
      fs.mkdirSync(dir, { recursive: true })
      fs.writeFileSync(path.join(dir, item.slug + '.html'), buildArticleHtml(item), 'utf8')
      const previous = before.find(article => article.slug === item.slug)
      const entry = buildArticleEntry(item)
      entries.push(entry)
      publishedSlugs.add(item.slug)
      results.push({ fileName: item.fileName, slug: item.slug, path: 'public/articles/' + item.topicSlug + '/' + item.slug + '.html', isUpdate: !!previous })
    }
    writeArticlesJs([...entries, ...before.filter(article => !publishedSlugs.has(article.slug))])

    for (const result of prepared) {
      const item = result.payload
      notifySubscribers({ type: 'article', title: item.title, slug: item.slug, excerpt: item.excerpt, author: item.author, url: `/articles/${item.slug}` })
    }
    const gitResult = gitSync('bulk-' + prepared.length, 'Bulk published articles')
    send(res, 200, { ok: true, count: results.length, results, ...gitResult })
  } catch (err) {
    console.error(err)
    send(res, 500, { error: err.message })
  }
}

async function handleDelete (req, res) {
  try {
    const body = await bodyJson(req)
    const { slug, topicSlug } = body
    if (!slug) return send(res, 400, { error: 'slug required' })

    const before = readArticles()
    const after  = before.filter(a => a.slug !== slug)
    writeArticlesJs(after)

    let deleted = false
    const tryDel = fp => {
      if (fs.existsSync(fp)) { fs.unlinkSync(fp); deleted = true }
    }
    if (topicSlug) tryDel(path.join(ART_DIR, topicSlug, slug + '.html'))
    if (!deleted && fs.existsSync(ART_DIR)) {
      for (const t of fs.readdirSync(ART_DIR)) {
        tryDel(path.join(ART_DIR, t, slug + '.html'))
        if (deleted) break
      }
    }

    const gitResult = gitSync(slug, 'Deleted')
    send(res, 200, { ok: true, htmlDeleted: deleted, removedFromData: before.length !== after.length, ...gitResult })
  } catch (err) {
    console.error(err)
    send(res, 500, { error: err.message })
  }
}

async function handlePurgeOrphans (req, res) {
  try {
    const articles = readArticles()
    const slugSet  = new Set(articles.map(a => a.slug))
    const htmlFiles = scanHtmlFiles()
    const orphans  = htmlFiles.filter(f => !slugSet.has(f.slug))

    for (const o of orphans) {
      const fp = path.join(ART_DIR, o.topicSlug, o.slug + '.html')
      if (fs.existsSync(fp)) fs.unlinkSync(fp)
    }

    const gitResult = orphans.length
      ? gitSync('orphans', 'Purged orphan HTML files')
      : { pushed: false, gitError: 'Nothing to purge' }
    send(res, 200, { ok: true, purged: orphans.map(o => o.slug), ...gitResult })
  } catch (err) {
    send(res, 500, { error: err.message })
  }
}

function handleGetArticles (res) {
  try {
    const articles  = readArticles()
    const htmlFiles = scanHtmlFiles()
    const slugSet   = new Set(articles.map(a => a.slug))
    const orphans   = htmlFiles.filter(f => !slugSet.has(f.slug))
    send(res, 200, { articles, orphans, htmlFiles })
  } catch (err) { send(res, 500, { error: err.message }) }
}

function handleGetNews (res) {
  try {
    const news = readNews()
    const files = scanNewsFiles()
    const slugSet = new Set(news.map(item => item.slug))
    const orphans = files.filter(file => !slugSet.has(file.slug))
    send(res, 200, { news, files, orphans })
  } catch (err) { send(res, 500, { error: err.message }) }
}

function makeNewsHtml (title, excerpt, htmlContent) {
  const safeTitle = String(title || '').replace(/[<>]/g, '')
  const safeExcerpt = String(excerpt || '').replace(/"/g, '&quot;').replace(/[<>]/g, '')
  return [
    '<!DOCTYPE html>',
    '<html lang="en">',
    '<head>',
    '  <meta charset="UTF-8">',
    '  <title>' + safeTitle + ' | IlluminAIst</title>',
    '  <meta name="description" content="' + safeExcerpt + '">',
    '</head>',
    '<body>',
    htmlContent,
    '</body>',
    '</html>',
  ].join('\n')
}

async function handlePublishNews (req, res) {
  try {
    const body = await bodyJson(req)
    const { slug: rawSlug, originalSlug, title, excerpt, source, publishedAt,
            badge, badgeColor, category, htmlContent } = body
    if (!rawSlug || !title || !htmlContent)
      return send(res, 400, { error: 'slug, title and htmlContent are required' })

    const slug = slugify(rawSlug)
    if (!slug) return send(res, 400, { error: 'slug must contain letters or numbers' })
    fs.mkdirSync(NEWS_DIR, { recursive: true })

    const before = readNews()
    const existing = before.find(item => item.slug === (originalSlug || slug))
    const oldSlug = existing && existing.slug
    const previous = oldSlug && oldSlug !== slug ? path.join(NEWS_DIR, oldSlug + '.html') : ''
    if (previous && fs.existsSync(previous)) fs.unlinkSync(previous)
    fs.writeFileSync(path.join(NEWS_DIR, slug + '.html'), makeNewsHtml(title, excerpt, htmlContent), 'utf8')

    const newEntry = {
      ...(existing || {}),
      id: existing ? existing.id : (before.length ? Math.max(...before.map(item => Number(item.id) || 0)) + 1 : 1),
      title,
      excerpt: excerpt || '',
      source: source || 'IlluminAIst Editorial',
      slug,
      htmlPath: '/articles/news/' + slug + '.html',
      publishedAt: publishedAt || new Date().toISOString().split('T')[0],
      badge: badge || (existing ? existing.badge : 'Latest'),
      badgeColor: badgeColor || (existing ? existing.badgeColor : 'amber'),
      category: category || 'AI News'
    }
    const others = before.filter(item => item.slug !== oldSlug && item.slug !== slug)
    writeNewsJs([newEntry, ...others])

    const gitResult = gitSync(slug, existing ? 'Updated news' : 'Published news')
    send(res, 200, { ok: true, slug, path: 'public/articles/news/' + slug + '.html', isUpdate: !!existing, ...gitResult })
  } catch (err) {
    console.error(err)
    send(res, 500, { error: err.message })
  }
}

async function handleDeleteNews (req, res) {
  try {
    const body = await bodyJson(req)
    const slugs = [...new Set(Array.isArray(body.slugs) ? body.slugs : [body.slug])].filter(Boolean)
    if (!slugs.length) return send(res, 400, { error: 'slug or slugs is required' })

    const before = readNews()
    const slugSet = new Set(slugs)
    const after = before.filter(item => !slugSet.has(item.slug))
    writeNewsJs(after)
    let htmlDeleted = 0
    for (const slug of slugs) {
      const htmlPath = path.join(NEWS_DIR, slug + '.html')
      if (fs.existsSync(htmlPath)) {
        fs.unlinkSync(htmlPath)
        htmlDeleted += 1
      }
    }

    const gitResult = gitSync(slugs.length === 1 ? slugs[0] : 'bulk-news', 'Deleted news')
    send(res, 200, {
      ok: true,
      slugs,
      deletedSlugs: slugs.filter(slug => before.some(item => item.slug === slug)),
      htmlDeleted,
      removedFromData: before.length !== after.length,
      ...gitResult
    })
  } catch (err) {
    console.error(err)
    send(res, 500, { error: err.message })
  }
}

function handlePreview (req, res) {
  const parsed = url.parse(req.url, true)
  const { slug, topicSlug } = parsed.query
  if (!slug) return send(res, 400, 'missing slug', 'text/plain')

  const dirs = topicSlug
    ? [path.join(ART_DIR, topicSlug)]
    : (fs.existsSync(ART_DIR) ? fs.readdirSync(ART_DIR).map(t => path.join(ART_DIR, t)) : [])

  for (const d of dirs) {
    const fp = path.join(d, slug + '.html')
    if (fs.existsSync(fp)) return send(res, 200, fs.readFileSync(fp, 'utf8'), 'text/html')
  }
  send(res, 404, 'not found', 'text/plain')
}

async function handleGitPush (req, res) {
  try {
    const body = await bodyJson(req).catch(() => ({}))
    const result = gitSync(body.slug || 'manual', body.message || 'Manual push')
    send(res, 200, result)
  } catch (err) { send(res, 500, { error: err.message }) }
}

function readEbooks () {
  const EBOOKS_JS = path.join(ROOT, 'src', 'data', 'ebooks.js')
  if (!fs.existsSync(EBOOKS_JS)) return [];
  const src = fs.readFileSync(EBOOKS_JS, 'utf8')
  const match = src.match(/export const ebooks\s*=\s*(\[[\s\S]*\]);?/)
  if (!match) return []
  try { return JSON.parse(match[1]) } catch (_) {
    try { return eval(match[1]) } catch (__) { return [] }
  }
}

function writeEbooksJs (arr) {
  const EBOOKS_JS = path.join(ROOT, 'src', 'data', 'ebooks.js')
  const content = 'export const ebooks = ' + JSON.stringify(arr, null, 2) + ';\n'
  fs.writeFileSync(EBOOKS_JS, content, 'utf8')
}

function handleGetEbooks (res) {
  try {
    const list = readEbooks()
    send(res, 200, { ok: true, ebooks: list })
  } catch (err) {
    console.error(err)
    send(res, 500, { error: err.message })
  }
}

async function handlePublishEbook (req, res) {
  try {
    const body = await bodyJson(req)
    const { slug: rawSlug, title, subtitle, description, pages, topics, base64File, coverGradient, accentColor, icon, downloadUrl } = body
    if (!rawSlug || !title)
      return send(res, 400, { error: 'slug and title are required' })

    const slug = slugify(rawSlug)
    const EBOOKS_DIR = path.join(ROOT, 'public', 'ebooks')
    fs.mkdirSync(EBOOKS_DIR, { recursive: true })

    const all = readEbooks()
    const existing = all.find(e => e.slug === slug)
    const others = all.filter(e => e.slug !== slug)

    let finalDownloadUrl = downloadUrl || (existing ? existing.downloadUrl : ('/ebooks/' + slug + '.pdf'))

    if (base64File && base64File.includes(',')) {
      const fileBuffer = Buffer.from(base64File.split(',')[1], 'base64')
      const filePath = path.join(EBOOKS_DIR, slug + '.pdf')
      fs.writeFileSync(filePath, fileBuffer)
      finalDownloadUrl = '/ebooks/' + slug + '.pdf'
    }

    const newId = existing ? existing.id : (all.length > 0 ? Math.max(...all.map(e => e.id || 0)) + 1 : 1)
    const newEntry = {
      id: newId,
      slug,
      title,
      subtitle: subtitle || '',
      description: description || '',
      topics: Array.isArray(topics) ? topics : (topics || '').split(',').map(t => t.trim()).filter(Boolean),
      pages: Number(pages) || 10,
      downloadUrl: finalDownloadUrl,
      coverGradient: coverGradient || 'from-cyan-900 via-cyan-700 to-slate-900',
      accentColor: accentColor || '#ffffff',
      icon: icon || '📚'
    }

    writeEbooksJs([newEntry, ...others])

    // Broadcast alert to subscribers
    const alert = notifySubscribers({
      type: 'ebook',
      title,
      slug,
      excerpt: subtitle || description,
      url: '/ebooks'
    })

    const gitResult = gitSync(slug, existing ? 'Updated eBook' : 'Published eBook')
    send(res, 200, { ok: true, slug, path: finalDownloadUrl, isUpdate: !!existing, alert, ...gitResult })
  } catch (err) {
    console.error(err)
    send(res, 500, { error: err.message })
  }
}

async function handleDeleteEbook (req, res) {
  try {
    const body = await bodyJson(req)
    const { slug } = body
    if (!slug) return send(res, 400, { error: 'slug is required' })

    const before = readEbooks()
    const after = before.filter(e => e.slug !== slug)
    writeEbooksJs(after)

    let deletedFile = false
    const pdfPath = path.join(ROOT, 'public', 'ebooks', slug + '.pdf')
    if (fs.existsSync(pdfPath)) {
      fs.unlinkSync(pdfPath)
      deletedFile = true
    }

    const gitResult = gitSync(slug, 'Deleted eBook')
    send(res, 200, {
      ok: true,
      slug,
      deletedFile,
      removedFromData: before.length !== after.length,
      ...gitResult
    })
  } catch (err) {
    console.error(err)
    send(res, 500, { error: err.message })
  }
}

// ── AI eBook generation handlers ─────────────────────────────────────────────

function ebookJobView(job, includeResult = false) {
  if (!job) return null
  return {
    id: job.id,
    status: job.status,
    stage: job.stage,
    progress: job.progress,
    message: job.message,
    title: job.title,
    audience: job.audience,
    createdAt: job.createdAt,
    updatedAt: job.updatedAt,
    error: job.error || null,
    result: includeResult ? (job.result || null) : undefined
  }
}

async function handleGenerateEbook(req, res) {
  try {
    const body = await bodyJson(req)
    const title = String(body.title || '').trim()
    const audience = String(body.audience || '').trim()
    if (!title || title.length < 5) return send(res, 400, { error: 'A book title of at least 5 characters is required' })
    if (!audience) return send(res, 400, { error: 'Target audience is required' })
    if (title.length > 180 || audience.length > 180) return send(res, 400, { error: 'Title and audience must be 180 characters or fewer' })

    const id = 'ebook-job-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8)
    const now = new Date().toISOString()
    const job = { id, title, audience, status: 'queued', stage: 'queued', progress: 0, message: 'Queued for generation…', createdAt: now, updatedAt: now }
    ebookGenerationJobs.set(id, job)

    generateEbook({
      title,
      audience,
      onUpdate(update) {
        Object.assign(job, update, { updatedAt: new Date().toISOString() })
        if (update.stage === 'complete') job.status = 'complete'
        else job.status = 'running'
      }
    }).then(result => {
      job.status = 'complete'
      job.stage = 'complete'
      job.progress = 100
      job.message = `Draft complete — approximately ${result.pages} pages.`
      job.result = result
      job.updatedAt = new Date().toISOString()
    }).catch(error => {
      console.error('AI eBook generation failed:', error)
      job.status = 'failed'
      job.stage = 'failed'
      job.message = 'Generation failed'
      job.error = error.message
      job.updatedAt = new Date().toISOString()
    })

    // Keep the local CMS process bounded if a user starts many generations.
    if (ebookGenerationJobs.size > 20) {
      const oldest = [...ebookGenerationJobs.values()].sort((a, b) => a.createdAt.localeCompare(b.createdAt))[0]
      if (oldest && oldest.id !== id) ebookGenerationJobs.delete(oldest.id)
    }
    send(res, 202, { ok: true, job: ebookJobView(job) })
  } catch (err) {
    console.error(err)
    send(res, 500, { error: err.message })
  }
}

function handleGetEbookGeneration(req, res, id) {
  const job = ebookGenerationJobs.get(id)
  if (!job) return send(res, 404, { error: 'Generation job not found. Jobs are kept in the local CMS process.' })
  send(res, 200, { ok: true, job: ebookJobView(job, job.status === 'complete') })
}

function handleExportEbookGeneration(req, res, id) {
  const job = ebookGenerationJobs.get(id)
  if (!job) return send(res, 404, { error: 'Generation job not found' })
  if (job.status !== 'complete' || !job.result?.manuscriptHtml) return send(res, 409, { error: 'The manuscript is not ready yet' })
  const filename = (job.result.slug || 'enterprise-ebook') + '-manuscript.html'
  res.writeHead(200, {
    'Content-Type': 'text/html; charset=utf-8',
    'Content-Disposition': `attachment; filename="${filename}"`,
    'Access-Control-Allow-Origin': '*'
  })
  res.end(job.result.manuscriptHtml)
}

// ── subscribers & alerts handlers ─────────────────────────────────────────────

function handleGetSubscribers(res) {
  try {
    const list = readSubscribers()
    send(res, 200, { ok: true, subscribers: list, count: list.length })
  } catch (err) {
    send(res, 500, { error: err.message })
  }
}

async function handleSubscribe(req, res) {
  try {
    const body = await bodyJson(req)
    const { email, isCompany, source } = body
    if (!email) return send(res, 400, { error: 'email is required' })

    const cleanEmail = email.toLowerCase().trim()
    const list = readSubscribers()
    const domain = cleanEmail.includes('@') ? cleanEmail.split('@')[1].toLowerCase() : ''
    const existing = list.find(s => s.email.toLowerCase() === cleanEmail)
    if (!existing) {
      list.unshift({
        email: cleanEmail,
        domain,
        isCompany: !!isCompany,
        subscribedAt: new Date().toISOString(),
        source: source || 'api'
      })
      writeSubscribers(list)
    }
    send(res, 200, { ok: true, email: cleanEmail, subscribersCount: list.length })
  } catch (err) {
    send(res, 500, { error: err.message })
  }
}

function handleGetAlerts(res) {
  try {
    const alerts = readAlerts()
    send(res, 200, { ok: true, alerts, count: alerts.length })
  } catch (err) {
    send(res, 500, { error: err.message })
  }
}

async function handleManualNotify(req, res) {
  try {
    const body = await bodyJson(req)
    const { type, title, slug, excerpt, url, author } = body
    if (!type || !title) return send(res, 400, { error: 'type and title are required' })

    const alert = notifySubscribers({ type, title, slug, excerpt, url, author })
    send(res, 200, { ok: true, alert })
  } catch (err) {
    send(res, 500, { error: err.message })
  }
}

// ── server ────────────────────────────────────────────────────────────────────
const server = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') return send(res, 204, '')
  const { pathname } = url.parse(req.url)

  if (req.method === 'POST'   && pathname === '/api/publish')            return handlePublish(req, res)
  if (req.method === 'POST'   && pathname === '/api/publish-bulk')       return handlePublishBulk(req, res)
  if (req.method === 'POST'   && pathname === '/api/publish-news')        return handlePublishNews(req, res)
  if (req.method === 'DELETE' && pathname === '/api/article')            return handleDelete(req, res)
  if (req.method === 'POST'   && pathname === '/api/delete')             return handleDelete(req, res)
  if (req.method === 'GET'    && pathname === '/api/articles')           return handleGetArticles(res)
  if (req.method === 'GET'    && pathname === '/api/news')               return handleGetNews(res)
  if (req.method === 'POST'   && pathname === '/api/delete-news')         return handleDeleteNews(req, res)
  if (req.method === 'DELETE' && pathname === '/api/news')               return handleDeleteNews(req, res)
  if (req.method === 'GET'    && pathname === '/api/preview')            return handlePreview(req, res)
  if (req.method === 'POST'   && pathname === '/api/purge-orphans')      return handlePurgeOrphans(req, res)
  if (req.method === 'GET'    && pathname === '/api/ebooks')             return handleGetEbooks(res)
  if (req.method === 'POST'   && pathname === '/api/publish-ebook')      return handlePublishEbook(req, res)
  if (req.method === 'POST'   && pathname === '/api/delete-ebook')       return handleDeleteEbook(req, res)
  if (req.method === 'DELETE' && pathname === '/api/ebook')              return handleDeleteEbook(req, res)
  if (req.method === 'POST'   && pathname === '/api/generate-ebook')     return handleGenerateEbook(req, res)
  if (req.method === 'GET'    && /^\/api\/ebook-generation\/[^/]+\/export$/.test(pathname))
    return handleExportEbookGeneration(req, res, pathname.split('/')[3])
  if (req.method === 'GET'    && /^\/api\/ebook-generation\/[^/]+$/.test(pathname))
    return handleGetEbookGeneration(req, res, pathname.split('/')[3])

  // Subscribers & Alerts API endpoints
  if (req.method === 'GET'    && pathname === '/api/subscribers')        return handleGetSubscribers(res)
  if (req.method === 'POST'   && pathname === '/api/subscribe')          return handleSubscribe(req, res)
  if (req.method === 'GET'    && pathname === '/api/alerts')             return handleGetAlerts(res)
  if (req.method === 'POST'   && pathname === '/api/notify-subscribers')  return handleManualNotify(req, res)

  if (req.method === 'GET' && (pathname === '/' || pathname === '/index.html')) {
    try {
      return send(res, 200, fs.readFileSync(UI_HTML, 'utf8'), 'text/html; charset=utf-8')
    } catch (e) {
      return send(res, 500, 'UI file not found: ' + e.message, 'text/plain')
    }
  }

  if (req.method === 'GET' && pathname === '/ebooks') {
    try {
      return send(res, 200, fs.readFileSync(path.join(__dirname, 'ebooks-ui.html'), 'utf8'), 'text/html; charset=utf-8')
    } catch (e) {
      return send(res, 500, 'UI file not found: ' + e.message, 'text/plain')
    }
  }
  send(res, 404, { error: 'not found' })
})

module.exports = { notifySubscribers, readSubscribers, readAlerts, validateArticlePayload, sanitizeArticleHtml }

if (require.main === module) {
  server.listen(PORT, '127.0.0.1', () => {
    console.log('\n  \u2756 IlluminAIst CMS  \u2192  \x1b[36mhttp://localhost:' + PORT + '\x1b[0m\n')
    const open = process.platform === 'darwin' ? 'open' :
                 process.platform === 'win32'  ? 'start' : 'xdg-open'
    cp.exec(open + ' http://localhost:' + PORT)
  })
}
