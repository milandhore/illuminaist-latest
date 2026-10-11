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

const PORT    = 3333
const ROOT    = path.resolve(__dirname, '..')
const ART_DIR = path.join(ROOT, 'public', 'articles')
const DATA_JS = path.join(ROOT, 'src', 'data', 'articles.js')
const UI_HTML = path.join(__dirname, 'cms-ui.html')

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
    cp.execSync('git add -A src/data/ public/articles/', { cwd: ROOT })
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

// ── handlers ──────────────────────────────────────────────────────────────────

async function handlePublish (req, res) {
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

    const gitResult = gitSync(slug, 'Published')
    send(res, 200, { ok: true, slug, path: 'public/articles/' + topicSlug + '/' + slug + '.html', ...gitResult })
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

    // 1) Remove from articles.js
    const before = readArticles()
    const after  = before.filter(a => a.slug !== slug)
    writeArticlesJs(after)

    // 2) Delete HTML file – try topicSlug first, then scan all folders
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

    // 3) Git push
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
  const match = src.match(/export const ebooks\s*=\s*(\[[\s\S]*\]);?/) // Greedy match
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

async function handlePublishEbook (req, res) {
  try {
    const body = await bodyJson(req)
    const { slug: rawSlug, title, subtitle, description, pages, topics, base64File, coverGradient, accentColor, icon } = body
    if (!rawSlug || !title || !base64File)
      return send(res, 400, { error: 'slug, title, and file are required' })

    const slug = slugify(rawSlug)
    const EBOOKS_DIR = path.join(ROOT, 'public', 'ebooks')
    fs.mkdirSync(EBOOKS_DIR, { recursive: true })

    const fileBuffer = Buffer.from(base64File.split(',')[1], 'base64')
    const filePath = path.join(EBOOKS_DIR, slug + '.pdf')
    fs.writeFileSync(filePath, fileBuffer)

    const existing = readEbooks().filter(e => e.slug !== slug)
    const newId = existing.length > 0 ? Math.max(...existing.map(e => e.id)) + 1 : 1
    const newEntry = {
      id: newId,
      slug, title, subtitle, description,
      topics: Array.isArray(topics) ? topics : (topics || '').split(',').map(t => t.trim()).filter(Boolean),
      pages: Number(pages) || 10,
      downloadUrl: '/ebooks/' + slug + '.pdf',
      coverGradient: coverGradient || 'from-slate-800 to-slate-900',
      accentColor: accentColor || '#ffffff',
      icon: icon || '📚'
    }
    
    writeEbooksJs([newEntry, ...existing])

    const gitResult = gitSync(slug, 'Published eBook')
    send(res, 200, { ok: true, slug, path: '/ebooks/' + slug + '.pdf', ...gitResult })
  } catch (err) {
    console.error(err)
    send(res, 500, { error: err.message })
  }
}


// ── server ────────────────────────────────────────────────────────────────────
const server = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') return send(res, 204, '')
  const { pathname } = url.parse(req.url)

  if (req.method === 'POST'   && pathname === '/api/publish')        return handlePublish(req, res)
  if (req.method === 'DELETE' && pathname === '/api/article')        return handleDelete(req, res)
  if (req.method === 'POST'   && pathname === '/api/delete')         return handleDelete(req, res)
  if (req.method === 'GET'    && pathname === '/api/articles')       return handleGetArticles(res)
  if (req.method === 'GET'    && pathname === '/api/preview')        return handlePreview(req, res)
  if (req.method === 'POST'   && pathname === '/api/purge-orphans')  return handlePurgeOrphans(req, res)
  if (req.method === 'POST'   && pathname === '/api/publish-ebook')  return handlePublishEbook(req, res)

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

server.listen(PORT, '127.0.0.1', () => {
  console.log('\n  \u2756 IlluminAIst CMS  \u2192  \x1b[36mhttp://localhost:' + PORT + '\x1b[0m\n')
  const open = process.platform === 'darwin' ? 'open' :
               process.platform === 'win32'  ? 'start' : 'xdg-open'
  cp.exec(open + ' http://localhost:' + PORT)
})
