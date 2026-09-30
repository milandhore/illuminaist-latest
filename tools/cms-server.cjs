#!/usr/bin/env node
/**
 * IlluminAIst CMS Server
 * Run: npm run cms  →  open http://localhost:3333
 */
const http   = require('http')
const fs     = require('fs')
const path   = require('path')
const url    = require('url')

const PORT    = 3333
const ROOT    = path.resolve(__dirname, '..')
const ART_DIR = path.join(ROOT, 'public', 'articles')
const DATA_JS = path.join(ROOT, 'src', 'data', 'articles.js')
const UI_HTML = path.join(__dirname, 'cms-ui.html')

// ── helpers ───────────────────────────────────────────────────────────────────
function readArticles() {
  const src = fs.readFileSync(DATA_JS, 'utf8')
  const match = src.match(/export const articles\s*=\s*(\[[\s\S]*?\])\n(?=export const)/)
  if (!match) return []
  try { return eval(match[1]) } catch (_) { return [] }
}

function writeArticlesJs(arr) {
  const src = fs.readFileSync(DATA_JS, 'utf8')
  const updated = src.replace(
    /export const articles\s*=\s*\[[\s\S]*?\]\n(?=export const)/,
    'export const articles = ' + JSON.stringify(arr, null, 2) + '\n'
  )
  fs.writeFileSync(DATA_JS, updated, 'utf8')
}

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '')
}

function bodyJson(req) {
  return new Promise((res, rej) => {
    let data = ''
    req.on('data', c => (data += c))
    req.on('end', () => { try { res(JSON.parse(data)) } catch (e) { rej(e) } })
    req.on('error', rej)
  })
}

function send(res, status, body, type = 'application/json') {
  const payload = typeof body === 'string' ? body : JSON.stringify(body)
  res.writeHead(status, {
    'Content-Type': type,
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  })
  res.end(payload)
}

// ── handlers ──────────────────────────────────────────────────────────────────
async function handlePublish(req, res) {
  try {
    const body = await bodyJson(req)
    const { slug: rawSlug, topicSlug, category, difficulty, title,
            excerpt, avatar, author, readingTime, publishedAt,
            featured, tags, htmlContent, status } = body

    if (!rawSlug || !topicSlug || !htmlContent || !title)
      return send(res, 400, { error: 'slug, topicSlug, title and htmlContent are required' })

    const slug = slugify(rawSlug)
    const dir  = path.join(ART_DIR, topicSlug)
    fs.mkdirSync(dir, { recursive: true })

    const descSafe = (excerpt || '').replace(/"/g, '&quot;')
    const htmlFull = [
      '<!DOCTYPE html>',
      '<html lang="en">',
      '<head>',
      '  <meta charset="UTF-8">',
      '  <title>' + title + ' | IlluminAIst</title>',
      '  <meta name="description" content="' + descSafe + '">',
      '</head>',
      '<body>',
      htmlContent,
      '</body>',
      '</html>',
    ].join('\n')

    fs.writeFileSync(path.join(dir, slug + '.html'), htmlFull, 'utf8')

    const existing = readArticles().filter(a => a.slug !== slug)
    const newEntry = {
      slug, topicSlug, category, difficulty, title, excerpt,
      avatar:      avatar || 'AI',
      author:      author || 'IlluminAIst',
      readingTime: Number(readingTime) || 5,
      publishedAt,
      htmlFile:    true,
      featured:    !!featured,
      status:      status || 'published',
      tags:        Array.isArray(tags) ? tags : (tags || '').split(',').map(t => t.trim()).filter(Boolean),
    }
    writeArticlesJs([newEntry, ...existing])
    send(res, 200, { ok: true, slug, path: 'public/articles/' + topicSlug + '/' + slug + '.html' })
  } catch (err) {
    console.error(err)
    send(res, 500, { error: err.message })
  }
}

async function handleDelete(req, res) {
  try {
    const body = await bodyJson(req)
    const { slug, topicSlug } = body
    if (!slug) return send(res, 400, { error: 'slug required' })
    writeArticlesJs(readArticles().filter(a => a.slug !== slug))
    if (topicSlug) {
      const fp = path.join(ART_DIR, topicSlug, slug + '.html')
      if (fs.existsSync(fp)) fs.unlinkSync(fp)
    }
    send(res, 200, { ok: true })
  } catch (err) {
    send(res, 500, { error: err.message })
  }
}

function handleGetArticles(res) {
  try { send(res, 200, readArticles()) }
  catch (err) { send(res, 500, { error: err.message }) }
}

function handlePreview(req, res) {
  const parsed = url.parse(req.url, true)
  const { slug, topicSlug } = parsed.query
  if (!slug || !topicSlug) return send(res, 400, 'missing slug/topicSlug', 'text/plain')
  const fp = path.join(ART_DIR, topicSlug, slug + '.html')
  if (!fs.existsSync(fp)) return send(res, 404, 'not found', 'text/plain')
  send(res, 200, fs.readFileSync(fp, 'utf8'), 'text/html')
}

// ── server ────────────────────────────────────────────────────────────────────
const server = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') return send(res, 204, '')
  const { pathname } = url.parse(req.url)
  if (req.method === 'POST'   && pathname === '/api/publish')  return handlePublish(req, res)
  if (req.method === 'DELETE' && pathname === '/api/article')  return handleDelete(req, res)
  if (req.method === 'GET'    && pathname === '/api/articles') return handleGetArticles(res)
  if (req.method === 'GET'    && pathname === '/api/preview')  return handlePreview(req, res)
  if (req.method === 'GET'    && (pathname === '/' || pathname === '/index.html')) {
    try {
      const html = fs.readFileSync(UI_HTML, 'utf8')
      return send(res, 200, html, 'text/html; charset=utf-8')
    } catch (e) {
      return send(res, 500, 'UI file not found: ' + e.message, 'text/plain')
    }
  }
  send(res, 404, { error: 'not found' })
})

server.listen(PORT, '127.0.0.1', () => {
  console.log('\n  \u2756 IlluminAIst CMS  \u2192  \x1b[36mhttp://localhost:' + PORT + '\x1b[0m\n')
  const open = process.platform === 'darwin' ? 'open' :
               process.platform === 'win32'  ? 'start' : 'xdg-open'
  require('child_process').exec(open + ' http://localhost:' + PORT)
})
