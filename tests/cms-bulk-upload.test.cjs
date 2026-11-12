const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')

const { validateArticlePayload, sanitizeArticleHtml } = require('../tools/cms-server.cjs')

const validArticle = {
  fileName: 'article.html',
  slug: 'reliable-agent-workflows',
  topicSlug: 'rag-agents',
  category: 'RAG & Agents',
  difficulty: 'Advanced',
  title: 'Reliable Agent Workflows for Production Teams',
  excerpt: 'A practical guide to routing, retries, observability, and recovery for production agent workflows.',
  htmlContent: '<h2>Architecture</h2><p>Production agent workflows need explicit routing, retries, observability, and recovery so teams can operate them safely and reliably over time.</p>',
}

test('CMS exposes bulk upload endpoint and multi-file input', () => {
  const serverSource = fs.readFileSync(path.join(__dirname, '..', 'tools/cms-server.cjs'), 'utf8')
  const uiSource = fs.readFileSync(path.join(__dirname, '..', 'tools/cms-ui.html'), 'utf8')
  const legacyPortalSource = fs.readFileSync(path.join(__dirname, '..', 'tools/cms-portal.cjs'), 'utf8')
  assert.match(serverSource, /\/api\/publish-bulk/)
  assert.match(uiSource, /id="fileInput"[^>]+multiple/)
  assert.match(uiSource, /pre-flight validation/)
  assert.match(legacyPortalSource, /id="uploadFile"[^>]+multiple/)
  assert.match(legacyPortalSource, /upload\.array\('files', 100\)/)
})

test('bulk article validation accepts complete content and rejects incomplete metadata', () => {
  const accepted = validateArticlePayload(validArticle)
  assert.equal(accepted.ok, true)
  assert.equal(accepted.payload.slug, 'reliable_agent_workflows')

  const rejected = validateArticlePayload({ ...validArticle, title: '', htmlContent: '<p>Too short</p>' })
  assert.equal(rejected.ok, false)
  assert.match(rejected.errors.join(' '), /title is required/)
  assert.match(rejected.errors.join(' '), /at least 20 words/)
})

test('article HTML sanitization removes executable markup before publishing', () => {
  const safe = sanitizeArticleHtml('<p onclick="alert(1)">Read</p><script>alert(1)</script><a href="javascript:alert(1)">link</a>')
  assert.doesNotMatch(safe, /<script|onclick=|javascript:/i)
})
