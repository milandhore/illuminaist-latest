const Parser = require('rss-parser')
const fs = require('fs')
const path = require('path')
const { GoogleGenerativeAI } = require('@google/generative-ai')

const ROOT = path.join(__dirname, '..')
const ARTICLES_FILE = path.join(ROOT, 'src', 'data', 'articles.js')
const ARTICLES_DIR = path.join(ROOT, 'public', 'articles')
const GEMINI_API_KEY = process.env.GEMINI_API_KEY
const parser = new Parser()

const TOPICS = [
  { query: 'AI engineering OR LLM engineering OR RAG OR MLOps OR AI inference', topicSlug: 'ai-llms', category: 'AI & LLMs', keywords: ['ai engineering', 'llm', 'rag', 'mlops', 'inference', 'model serving', 'evaluation'] },
  { query: 'agentic AI OR AI agents OR multi-agent OR Model Context Protocol', topicSlug: 'rag-agents', category: 'RAG & Agents', keywords: ['agentic', 'agent', 'multi-agent', 'mcp', 'tool use', 'orchestration'] },
  { query: 'enterprise AI strategy OR AI transformation OR AI governance', topicSlug: 'opinion', category: 'Opinion', keywords: ['strategy', 'enterprise', 'governance', 'transformation', 'board', 'operating model'] },
  { query: 'emerging technology AI robotics quantum computing edge intelligence', topicSlug: 'emerging-tech', category: 'Emerging Tech', keywords: ['robotics', 'quantum', 'edge', 'neuromorphic', 'spatial', 'emerging'] },
]

const REFERENCE_SOURCES = [
  { name: 'The Agentic Digest', domain: 'theagenticdigest.com' },
  { name: 'AI Weekly', domain: 'aiweekly.co' },
  { name: 'Agentic.ai News', domain: 'api.agentic.ai' },
  { name: 'VKTR Agentic AI', domain: 'vktr.com' },
  { name: 'Agentic AI Library', domain: 'agenticlibrary.net' },
]

const FREE_RSS_FEEDS = [
  // User-requested Agentic & AI publications with free direct RSS
  { name: 'AI Weekly', url: 'https://aiweekly.co/issues.rss', topicSlug: 'ai-llms' },
  { name: 'VKTR Agentic AI', url: 'https://www.vktr.com/articles.xml', topicSlug: 'rag-agents' },
  { name: 'Agentic.ai', url: 'https://agentic.ai/rss.xml', topicSlug: 'rag-agents' },

  // Genuine premier tech platforms with 100% free direct RSS
  { name: 'Bloomberg Technology', url: 'https://feeds.bloomberg.com/technology/news.rss', topicSlug: 'opinion' },
  { name: 'VentureBeat AI', url: 'https://venturebeat.com/category/ai/feed/', topicSlug: 'rag-agents' },
  { name: 'MIT Technology Review', url: 'https://www.technologyreview.com/topic/artificial-intelligence/feed', topicSlug: 'emerging-tech' },
  { name: 'InfoQ AI & Data', url: 'https://feed.infoq.com/ai-ml-data-eng/news/', topicSlug: 'ai-llms' },
]

const MAX_ARTICLES_PER_RUN = 1

function slugify(text) {
  return String(text || '').toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '')
}

function escapeHtml(value) {
  return String(value == null ? '' : value)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;')
}

function validSourceUrl(value) {
  return /^https?:\/\//i.test(String(value || '')) ? String(value) : ''
}

function sourceName(item) {
  if (item.publisherName) return item.publisherName
  if (typeof item.source === 'string' && item.source.trim()) return item.source.trim()
  if (item.source && typeof item.source.title === 'string' && item.source.title.trim()) return item.source.title.trim()
  const title = cleanText(item.title)
  const separator = title.lastIndexOf(' - ')
  return separator > -1 ? title.slice(separator + 3).trim() : 'Original source'
}

function cleanText(value) {
  return String(value || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
}

function conciseTitle(value) {
  const title = cleanText(value).replace(/\s+-\s+[^-]+$/, '').trim()
  return title.length <= 120 ? title : `${title.slice(0, 116).replace(/\s+\S*$/, '').trim()}…`
}

function excerpt(value) {
  const clean = cleanText(value)
  return clean.length <= 240 ? clean : `${clean.slice(0, 236).replace(/\s+\S*$/, '').trim()}…`
}

function plainText(html) {
  return cleanText(html).replace(/&nbsp;/gi, ' ')
}

function readingTime(html) {
  const words = plainText(html).split(/\s+/).filter(word => word.length > 2).length
  return Math.max(3, Math.ceil(words / 220))
}

function sanitizeHtml(html) {
  return String(html || '')
    .replace(/^```html\s*/i, '').replace(/\s*```$/i, '')
    .replace(/<script\b[\s\S]*?<\/script>/gi, '')
    .replace(/<style\b[\s\S]*?<\/style>/gi, '')
    .replace(/<iframe\b[\s\S]*?<\/iframe>/gi, '')
    .replace(/\s+on[a-z]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    .replace(/\s+(?:href|src)\s*=\s*(['"])\s*javascript:[\s\S]*?\1/gi, '')
    .trim()
}

function readArticles() {
  const source = fs.readFileSync(ARTICLES_FILE, 'utf8')
  const match = source.match(/export const articles\s*=\s*(\[[\s\S]*?\])\s*\n(?=export)/)
  if (!match) throw new Error('Could not parse src/data/articles.js')
  return { source, items: JSON.parse(match[1]) }
}

function writeArticles(source, items) {
  const updated = source.replace(
    /export const articles\s*=\s*\[[\s\S]*?\]\s*\n(?=export)/,
    `export const articles = ${JSON.stringify(items, null, 2)}\n`
  )
  fs.writeFileSync(ARTICLES_FILE, updated, 'utf8')
}

function topicFor(item, fallback) {
  const text = `${item.title || ''} ${item.contentSnippet || ''}`.toLowerCase()
  const match = TOPICS
    .map(topic => ({ topic, score: topic.keywords.reduce((score, keyword) => score + (text.includes(keyword) ? 1 : 0), 0) }))
    .sort((a, b) => b.score - a.score)[0]
  return match?.score > 0 ? match.topic : fallback
}

function sourceAttribution(source, sourceUrl) {
  if (!sourceUrl) return ''
  return `<p><strong>Source:</strong> <a href="${escapeHtml(sourceUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(source)}</a></p>`
}

function buildEditorialDiagram(topic) {
  const lanes = {
    'AI & LLMs': ['Data & context', 'Model layer', 'Evaluation', 'Production'],
    'RAG & Agents': ['Goal', 'Plan & tools', 'Memory', 'Verify & act'],
    Opinion: ['Signal', 'Strategic choice', 'Governance', 'Measure value'],
    'Emerging Tech': ['Research', 'Prototype', 'Validate', 'Adopt carefully'],
  }
  const labels = lanes[topic.category] || lanes['AI & LLMs']
  const boxes = labels.map((label, index) => {
    const x = 24 + index * 186
    const arrow = index < labels.length - 1
      ? `<path d="M${x + 142} 71h28l-8-6m8 6-8 6" fill="none" stroke="#e66b2c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`
      : ''
    return `${arrow}<rect x="${x}" y="36" width="142" height="70" rx="12" fill="#111827" stroke="#334155"/><text x="${x + 71}" y="65" text-anchor="middle" fill="#f1f5f9" font-family="Inter,Arial,sans-serif" font-size="12" font-weight="700">${escapeHtml(label)}</text><text x="${x + 71}" y="85" text-anchor="middle" fill="#94a3b8" font-family="Inter,Arial,sans-serif" font-size="9">stage ${index + 1}</text>`
  }).join('')
  return `<figure style="margin:2rem 0;padding:1rem;border:1px solid rgba(148,163,184,.22);border-radius:16px;background:#0b0f19"><svg viewBox="0 0 768 142" role="img" aria-label="${escapeHtml(topic.category)} article workflow diagram" style="display:block;width:100%;height:auto"><text x="24" y="18" fill="#fbbf24" font-family="Inter,Arial,sans-serif" font-size="10" font-weight="800" letter-spacing="1.4">ILLUMINAIST EDITORIAL FRAMEWORK</text>${boxes}</svg><figcaption style="margin:.7rem 0 0;color:#94a3b8;font:500 12px/1.5 Inter,Arial,sans-serif">A practical way to think about the ${escapeHtml(topic.category)} topic covered in this article.</figcaption></figure>`
}

function fallbackArticle(item, topic) {
  const title = conciseTitle(item.title)
  const summary = cleanText(item.contentSnippet || item.content || 'The latest development is worth tracking for teams building and governing AI systems.')
  const sourceUrl = validSourceUrl(item.link)
  const html = [
    `<h2>${escapeHtml(title)}</h2>`,
    `<p>${escapeHtml(summary)}</p>`,
    `<h2>Why this matters for ${escapeHtml(topic.category)}</h2>`,
    '<p>This development is a useful signal for builders and technology leaders. The practical question is how the underlying idea changes system design, operating decisions, evaluation, or responsible deployment.</p>',
    '<h2>Questions for builders</h2>',
    '<ul><li>What capability or constraint is changing?</li><li>Which production assumptions should teams revisit?</li><li>What evidence is still needed before adoption?</li></ul>',
    sourceAttribution(sourceName(item), sourceUrl),
  ].join('\n')
  return { title, excerpt: excerpt(summary), html: sanitizeHtml(html), sourceUrl }
}

async function generateArticle(item, topic) {
  if (!GEMINI_API_KEY) {
    console.warn('No GEMINI_API_KEY found; skipping article publication to protect editorial quality.')
    return null
  }

  const prompt = `
You are the editorial engine for IlluminAIst, an independent publication for AI engineers, architects, researchers, and technology leaders.

Create one rigorous, useful article based only on the supplied source context. The article must focus on practical implications for ${topic.category}, with emphasis on AI engineering, Agentic AI, AI strategy, or emerging technology as relevant.

Do not invent facts, quotes, benchmarks, dates, product capabilities, or sources. Clearly distinguish reported facts from analysis. Avoid hype, clickbait, sales language, and unsupported predictions. Do not claim to have performed research beyond the supplied context.

Return ONLY valid JSON with exactly these keys:
{"title":"string","excerpt":"20-240 character summary","difficulty":"Beginner|Intermediate|Advanced","tags":["3-8 concise tags"],"html":"HTML using h2/h3, p, ul, li, and strong elements only"}

Requirements:
- 700-1200 words when the source context supports it; otherwise write a shorter but honest analysis.
- Include a clear opening summary, 3-5 section headings, practical implications, trade-offs or open questions, and a concise conclusion.
- Use normal headline capitalization and keep the title under 120 characters.
- Do not include markdown fences or a source link; the publisher will append the verified source attribution.

Topic lane: ${topic.category}
Source title: ${item.title}
Source publisher: ${sourceName(item)}
Source context: ${cleanText(item.contentSnippet || item.content || '')}
Source URL: ${item.link || ''}
`

  try {
    const model = new GoogleGenerativeAI(GEMINI_API_KEY).getGenerativeModel({ model: 'gemini-2.5-flash' })
    const result = await model.generateContent(prompt)
    const text = result.response.text().trim().replace(/^```json\s*/i, '').replace(/\s*```$/i, '')
    const parsed = JSON.parse(text)
    const html = sanitizeHtml(parsed.html)
    const wordCount = plainText(html).split(/\s+/).filter(word => word.length > 2).length
    const headingCount = (html.match(/<h[2-3]\b/gi) || []).length
    const paragraphCount = (html.match(/<p\b/gi) || []).length
    if (!parsed.title || !html || wordCount < 450 || headingCount < 3 || paragraphCount < 5) {
      throw new Error('Generated article failed minimum content validation')
    }
    return {
      title: conciseTitle(parsed.title),
      excerpt: excerpt(parsed.excerpt || plainText(html)),
      html: `${html}\n${buildEditorialDiagram(topic)}\n${sourceAttribution(sourceName(item), validSourceUrl(item.link))}`,
      difficulty: ['Beginner', 'Intermediate', 'Advanced'].includes(parsed.difficulty) ? parsed.difficulty : 'Advanced',
      tags: Array.isArray(parsed.tags) ? parsed.tags.map(cleanText).filter(Boolean).slice(0, 8) : [],
      sourceUrl: validSourceUrl(item.link),
    }
  } catch (error) {
    console.error(`Gemini article generation failed for "${item.title}":`, error.message)
    return null
  }
}

async function collectCandidates() {
  const feedPromises = FREE_RSS_FEEDS.map(async feedConfig => {
    try {
      const feed = await parser.parseURL(feedConfig.url)
      const defaultTopic = TOPICS.find(t => t.topicSlug === feedConfig.topicSlug) || TOPICS[0]
      return (feed.items || []).map(item => ({
        ...item,
        publisherName: feedConfig.name,
        topic: defaultTopic,
      }))
    } catch (err) {
      console.warn(`Could not fetch RSS feed for ${feedConfig.name} (${feedConfig.url}):`, err.message)
      return []
    }
  })

  const results = await Promise.all(feedPromises)
  const seen = new Set()
  return results.flat()
    .filter(item => {
      const key = slugify(item.title)
      if (!key || seen.has(key)) return false
      seen.add(key)
      return true
    })
    .sort((a, b) => new Date(b.isoDate || b.pubDate || 0) - new Date(a.isoDate || a.pubDate || 0))
}

async function updateArticles() {
  const { source, items: existing } = readArticles()
  const existingSlugs = new Set(existing.map(item => item.slug))
  const existingTitles = new Set(existing.map(item => cleanText(item.title).toLowerCase()))
  const candidates = await collectCandidates()
  const publishedAt = new Date().toISOString().split('T')[0]
  let published = 0

  for (const item of candidates) {
    if (published >= MAX_ARTICLES_PER_RUN) break
    const topic = topicFor(item, item.topic)
    const title = conciseTitle(item.title)
    const slug = slugify(title)
    if (!slug || existingSlugs.has(slug) || existingTitles.has(title.toLowerCase())) continue

    console.log(`Generating article: ${title}`)
    const generated = await generateArticle(item, topic)
    if (!generated) continue

    const topicDir = path.join(ARTICLES_DIR, topic.topicSlug)
    fs.mkdirSync(topicDir, { recursive: true })
    const htmlFile = path.join(topicDir, `${slug}.html`)
    const html = `<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <title>${escapeHtml(generated.title)} | IlluminAIst</title>\n  <meta name="description" content="${escapeHtml(generated.excerpt)}">\n</head>\n<body>\n${generated.html}\n</body>\n</html>\n`
    fs.writeFileSync(htmlFile, html, 'utf8')

    const entry = {
      slug, topicSlug: topic.topicSlug, category: topic.category, difficulty: generated.difficulty,
      title: generated.title, excerpt: generated.excerpt, avatar: 'AI', author: 'IlluminAIst',
      readingTime: readingTime(generated.html), publishedAt, htmlFile: true,
      featured: false, trending: false, status: 'published', tags: generated.tags,
      sourceUrl: generated.sourceUrl || undefined,
    }
    writeArticles(source, [entry, ...existing])
    existing.unshift(entry)
    existingSlugs.add(slug)
    existingTitles.add(title.toLowerCase())
    published += 1
    console.log(`Published ${topic.category} article at ${htmlFile}`)
  }

  if (!published) console.log('No new article was published.')
}

if (require.main === module) {
  updateArticles().catch(error => {
    console.error('Article update failed:', error)
    process.exitCode = 1
  })
}

module.exports = { collectCandidates, updateArticles }
