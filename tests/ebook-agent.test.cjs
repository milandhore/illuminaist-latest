const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')

const { EBOOK_PROMPT_TEMPLATE, cleanHtml, slugify, wordCount } = require('../tools/ebook-agent.cjs')

test('AI eBook agent uses the supplied enterprise publishing prompt shape', () => {
  assert.match(EBOOK_PROMPT_TEMPLATE, /RESEARCH AND BOOK POSITIONING/)
  assert.match(EBOOK_PROMPT_TEMPLATE, /60–100 pages/)
  assert.match(EBOOK_PROMPT_TEMPLATE, /Never fabricate research/)
  assert.match(EBOOK_PROMPT_TEMPLATE, /FINAL PUBLISHING PACKAGE/)
})

test('AI eBook agent sanitizes generated HTML and estimates words', () => {
  const html = cleanHtml('<h2>Architecture</h2><script>alert(1)</script><p onclick="bad()">A practical enterprise guide with enough words to count correctly.</p>')
  assert.doesNotMatch(html, /script|onclick/i)
  assert.ok(wordCount(html) >= 8)
})

test('AI eBook agent creates stable CMS slugs', () => {
  assert.equal(slugify('The Enterprise AI Operating Model'), 'the_enterprise_ai_operating_model')
})

test('CMS exposes asynchronous AI eBook generation endpoints', () => {
  const source = fs.readFileSync(path.join(__dirname, '..', 'tools', 'cms-server.cjs'), 'utf8')
  const ui = fs.readFileSync(path.join(__dirname, '..', 'tools', 'cms-ui.html'), 'utf8')
  assert.match(source, /\/api\/generate-ebook/)
  assert.match(source, /ebookGenerationJobs|ebook-generation/)
  assert.match(ui, /id="tab-btn-ai-studio"/)
  assert.match(ui, /startEbookGeneration\(\)/)
})
