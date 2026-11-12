const { GoogleGenerativeAI } = require('@google/generative-ai')

const EBOOK_PROMPT_TEMPLATE = `
# ROLE

Act as an expert author, industry researcher, subject matter expert, technical writer, editor and ebook publishing consultant.

Your task is to research, develop and write a complete, professionally structured and publication-ready enterprise ebook.

## BOOK CONFIGURATION

- Subject: [INFER FROM TITLE]
- Specific Topics: [IDENTIFY FROM THE SUBJECT]
- Book Objective: BUSINESS / EDUCATION / THOUGHT LEADERSHIP / TECHNICAL GUIDE
- Target Audience: [PROVIDED AUDIENCE]
- Industry / Domain: [INFER AND STATE ASSUMPTIONS]
- Knowledge Level: [INFER FROM AUDIENCE]
- Geographical Focus: GLOBAL UNLESS THE SUBJECT REQUIRES A SPECIFIC REGION
- Target Length: 60–100 pages, approximately 24,000–36,000 words
- Number of Chapters: 10–12
- Writing Style: PROFESSIONAL, CONVERSATIONAL, TECHNICALLY PRECISE
- Research Period: LATEST AVAILABLE
- Case Studies: REAL-WORLD WHERE VERIFIABLE, CLEARLY LABELLED HYPOTHETICAL EXAMPLES OTHERWISE

## RESEARCH AND BOOK POSITIONING

Research using credible and current academic publications, official documentation, standards, industry reports and real-world case studies. Cite working URLs. Never fabricate research, statistics, quotations or references. If a claim cannot be verified, label it as a validation item instead of presenting it as fact.

Develop seven compelling title/subtitle combinations, a recommended title and subtitle, a persuasive back-cover description, a clear value proposition, and a detailed table of contents with chapter objectives and subtopics.

## COMPLETE EBOOK

Write every chapter in detail. Each chapter should use engaging context, research-backed insights, practical applications, implementation approaches, case studies, comparison tables or frameworks where useful, meaningful diagram specifications, key takeaways and actionable recommendations. Clearly distinguish verified case studies from hypothetical examples.

## FINAL PUBLISHING PACKAGE

Include title, subtitle, back-cover description, copyright/disclaimer copy, author biography placeholder (never invented credentials), complete manuscript, references, bibliography, glossary, Kindle description, suggested keywords, publishing recommendations, and seven cover concepts with one recommended visual direction.

## EDITORIAL REVIEW

Check factual and technical accuracy, source credibility, logical flow, completeness, grammar, readability, repetition, terminology consistency and alignment with the target audience. Return a concise editorial review with issues found and corrections made.

## OUTPUT RULES

Return only valid JSON matching the schema requested in each stage. Do not use markdown code fences around JSON. Use HTML fragments for manuscript content. Keep citations as visible links with descriptive anchor text. Do not claim that the manuscript is 60–100 pages unless the word count supports the estimate; use approximately 300 words per designed page and report the estimate.
`

const MODEL_NAME = process.env.EBOOK_GEMINI_MODEL || 'gemini-2.5-flash'

function stripJsonFence(text) {
  return String(text || '')
    .trim()
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim()
}

function parseJson(text, label) {
  const cleaned = stripJsonFence(text)
  try { return JSON.parse(cleaned) } catch (error) {
    throw new Error(`${label} returned invalid JSON: ${error.message}`)
  }
}

function cleanHtml(html) {
  return String(html || '')
    .replace(/<script\b[\s\S]*?<\/script>/gi, '')
    .replace(/<style\b[\s\S]*?<\/style>/gi, '')
    .replace(/<iframe\b[\s\S]*?<\/iframe>/gi, '')
    .replace(/\s+on[a-z]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    .replace(/\s+(?:href|src)\s*=\s*("|')\s*javascript:[\s\S]*?\1/gi, '')
    .trim()
}

function plainText(html) {
  return cleanHtml(html).replace(/<[^>]*>/g, ' ').replace(/&nbsp;/gi, ' ').replace(/&amp;/gi, '&').replace(/\s+/g, ' ').trim()
}

function wordCount(text) {
  return plainText(text).split(/\s+/).filter(word => word.length > 2).length
}

function escapeHtml(value) {
  return String(value || '').replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[char]))
}

function slugify(text) {
  return String(text || '').toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '')
}

function sourceList(items = []) {
  const seen = new Set()
  return items.filter(item => {
    const url = String(item?.url || item?.sourceUrl || '').trim()
    if (!url || seen.has(url)) return false
    seen.add(url)
    return true
  })
}

function normalizePlan(plan, title, audience) {
  const toc = Array.isArray(plan.tableOfContents) ? plan.tableOfContents : []
  const chapters = toc.slice(0, 12).map((chapter, index) => ({
    number: Number(chapter.number) || index + 1,
    title: String(chapter.title || `Chapter ${index + 1}`),
    objective: String(chapter.objective || ''),
    subtopics: Array.isArray(chapter.subtopics) ? chapter.subtopics : [],
    wordTarget: Math.max(1800, Number(chapter.wordTarget) || 2500)
  }))
  while (chapters.length < 10) {
    const n = chapters.length + 1
    chapters.push({ number: n, title: `Implementation and operating model`, objective: 'Translate the subject into an executable enterprise practice.', subtopics: ['Operating model', 'Metrics', 'Risks and next steps'], wordTarget: 2200 })
  }
  const targetWords = Math.max(24000, Math.min(36000, chapters.reduce((sum, chapter) => sum + chapter.wordTarget, 0)))
  return {
    subject: plan.subject || title,
    audience,
    specificTopics: Array.isArray(plan.specificTopics) ? plan.specificTopics : [],
    industry: plan.industry || 'Enterprise technology and digital transformation',
    knowledgeLevel: plan.knowledgeLevel || 'Intermediate',
    geographicalFocus: plan.geographicalFocus || 'Global',
    targetLength: '60–100 pages',
    targetWords,
    numberOfChapters: chapters.length,
    writingStyle: plan.writingStyle || 'Professional and conversational',
    caseStudies: plan.caseStudies || 'Mixed; verified examples labelled separately from hypotheses',
    titleOptions: Array.isArray(plan.titleOptions) ? plan.titleOptions.slice(0, 7) : [],
    recommendedTitle: plan.recommendedTitle || title,
    recommendedSubtitle: plan.recommendedSubtitle || 'An enterprise field guide for informed action',
    backCoverDescription: plan.backCoverDescription || '',
    valueProposition: plan.valueProposition || '',
    tableOfContents: chapters,
    researchBrief: sourceList(Array.isArray(plan.researchBrief) ? plan.researchBrief : []),
    coverConcepts: Array.isArray(plan.coverConcepts) ? plan.coverConcepts.slice(0, 7) : [],
    recommendedCover: plan.recommendedCover || {},
    assumptions: Array.isArray(plan.assumptions) ? plan.assumptions : []
  }
}

function buildManuscript(plan, chapters, packageData) {
  const tocHtml = plan.tableOfContents.map(chapter => `<li><strong>Chapter ${chapter.number}: ${escapeHtml(chapter.title)}</strong> — ${escapeHtml(chapter.objective)}</li>`).join('')
  const researchHtml = sourceList(plan.researchBrief.concat(packageData.references || [])).map(source => {
    const label = source.title || source.source || source.url
    return `<li><a href="${escapeHtml(source.url)}">${escapeHtml(label)}</a>${source.note ? ` — ${escapeHtml(source.note)}` : ''}</li>`
  }).join('')
  const glossaryHtml = (packageData.glossary || []).map(item => `<dt><strong>${escapeHtml(item.term)}</strong></dt><dd>${escapeHtml(item.definition)}</dd>`).join('')
  const chapterHtml = chapters.map(chapter => `
    <section class="ebook-chapter" id="chapter-${chapter.number}">
      <h2>Chapter ${chapter.number}: ${escapeHtml(chapter.title)}</h2>
      ${cleanHtml(chapter.html)}
      ${chapter.takeaways?.length ? `<h3>Key takeaways</h3><ul>${chapter.takeaways.map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ul>` : ''}
    </section>`).join('\n')

  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escapeHtml(plan.recommendedTitle)} | IlluminAIst</title>
<meta name="description" content="${escapeHtml(plan.backCoverDescription)}">
<style>body{font-family:Arial,sans-serif;line-height:1.65;max-width:820px;margin:0 auto;padding:48px;color:#172033}h1,h2,h3{font-family:Georgia,serif;line-height:1.2}h1{font-size:42px;margin-bottom:8px}h2{margin-top:56px;border-bottom:2px solid #0ea5e9;padding-bottom:8px}h3{margin-top:32px}a{color:#0369a1}li{margin-bottom:8px}.frontmatter{color:#475569;border-left:4px solid #0ea5e9;padding:16px 20px;background:#f0f9ff}.ebook-chapter{break-before:page}</style></head><body>
<header><p>ILLUMINAIst Enterprise Research Series</p><h1>${escapeHtml(plan.recommendedTitle)}</h1><h2 style="border:0;margin:0">${escapeHtml(plan.recommendedSubtitle)}</h2><p>${escapeHtml(plan.backCoverDescription)}</p></header>
<section class="frontmatter"><p><strong>Audience:</strong> ${escapeHtml(plan.audience)}</p><p><strong>Estimated length:</strong> ${plan.estimatedPages || Math.round((packageData.totalWordCount || 0) / 300)} pages · ${packageData.totalWordCount || 0} words</p><p><strong>Disclaimer:</strong> This publication is educational and does not replace legal, security, financial or professional advice. Verify time-sensitive claims and implementation details before acting.</p></section>
<section><h2>Table of contents</h2><ol>${tocHtml}</ol></section>
<section><h2>Introduction</h2>${cleanHtml(packageData.introduction || '<p>This guide explains why the subject matters and how enterprise teams can act with discipline.</p>')}</section>
${chapterHtml}
<section><h2>Conclusion</h2>${cleanHtml(packageData.conclusion || '')}</section>
<section><h2>References and bibliography</h2><ul>${researchHtml || '<li>Research sources to be validated during editorial review.</li>'}</ul></section>
<section><h2>Glossary</h2><dl>${glossaryHtml}</dl></section>
<section><h2>About the author</h2><p>IlluminAIst Editorial is an independent technology publication. Replace this placeholder with verified author credentials before publication.</p></section>
</body></html>`
}

async function generateJson(model, prompt, label, maxOutputTokens) {
  const result = await model.generateContent({
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: { responseMimeType: 'application/json', temperature: 0.35, maxOutputTokens }
  })
  return parseJson((await result.response).text(), label)
}

async function generateEbook({ title, audience, onUpdate = () => {} }) {
  const key = process.env.GEMINI_API_KEY
  if (!key) throw new Error('GEMINI_API_KEY is required for AI eBook generation. Add it to the CMS server environment and restart the server.')

  const genAI = new GoogleGenerativeAI(key)
  const model = genAI.getGenerativeModel({ model: MODEL_NAME })
  const intake = `User intake — title: ${title}\nTarget audience: ${audience}`

  onUpdate({ stage: 'research', progress: 8, message: 'Building research brief and book position…' })
  const planRaw = await generateJson(model, `${EBOOK_PROMPT_TEMPLATE}\n${intake}\n\nSTAGE 1 — RESEARCH AND POSITIONING\nReturn JSON with exactly these keys: subject, specificTopics, industry, knowledgeLevel, geographicalFocus, writingStyle, caseStudies, titleOptions (7 objects with title and subtitle), recommendedTitle, recommendedSubtitle, backCoverDescription, valueProposition, tableOfContents (10–12 objects with number, title, objective, subtopics, wordTarget), researchBrief (objects with claim, title, url, note, verifiedOrNeedsValidation), coverConcepts (7 objects with name, visualDirection, palette, typography, illustration), recommendedCover, assumptions. Preserve the user’s title as the primary title unless a minor editorial refinement is clearly justified.`, 'research and positioning', 7000)
  const plan = normalizePlan(planRaw, title, audience)

  const chapters = []
  for (let index = 0; index < plan.tableOfContents.length; index += 1) {
    const chapter = plan.tableOfContents[index]
    const progress = 12 + Math.round(((index + 1) / plan.tableOfContents.length) * 68)
    onUpdate({ stage: 'manuscript', progress, message: `Writing chapter ${index + 1} of ${plan.tableOfContents.length}: ${chapter.title}` })
    const previous = chapters.map(item => ({ number: item.number, title: item.title, summary: item.summary })).slice(-3)
    const chapterRaw = await generateJson(model, `${EBOOK_PROMPT_TEMPLATE}\n${intake}\n\nBOOK PLAN:\n${JSON.stringify(plan)}\n\nPREVIOUS CHAPTER CONTEXT:\n${JSON.stringify(previous)}\n\nSTAGE 2 — WRITE CHAPTER ${chapter.number}\nWrite a substantial chapter of approximately ${chapter.wordTarget} words for the target audience. Use HTML fragments only (h3, h4, p, ul, ol, table, blockquote, pre, code). Include practical enterprise guidance, a clearly labelled verified or hypothetical case study when relevant, at least one framework/table or diagram specification where useful, and a short action checklist. Return JSON with exactly these keys: number, title, summary, html, takeaways (array), sources (array of objects with title, url, note), wordCount. Never invent a source URL.`, `chapter ${chapter.number}`, 8500)
    chapters.push({ ...chapterRaw, number: chapter.number, title: chapter.title, html: cleanHtml(chapterRaw.html), wordCount: wordCount(chapterRaw.html) })
  }

  onUpdate({ stage: 'editorial-review', progress: 84, message: 'Running editorial review and assembling publishing package…' })
  const allSources = sourceList(plan.researchBrief.concat(chapters.flatMap(chapter => Array.isArray(chapter.sources) ? chapter.sources : [])))
  const packageData = await generateJson(model, `${EBOOK_PROMPT_TEMPLATE}\n${intake}\n\nBOOK PLAN:\n${JSON.stringify(plan)}\n\nCHAPTER SUMMARIES:\n${JSON.stringify(chapters.map(chapter => ({ number: chapter.number, title: chapter.title, summary: chapter.summary, wordCount: chapter.wordCount })))}\n\nAVAILABLE SOURCES (use only these URLs unless you can verify a new official URL):\n${JSON.stringify(allSources)}\n\nSTAGE 3 — FINAL PACKAGE AND EDITORIAL REVIEW\nReturn JSON with exactly these keys: introduction (HTML fragment), conclusion (HTML fragment), references (array of objects with title, url, note), glossary (array of term and definition), kindleDescription, keywords (array), publishingRecommendations (array), editorialReview (object with factualAccuracy, citationQuality, flow, audienceFit, issuesFound array, correctionsMade array), copyrightPage (HTML fragment), totalWordCount, estimatedPages. Do not invent author credentials. Keep verified examples separate from hypothetical examples.`, 'final package', 8000)

  const manuscriptHtml = buildManuscript(plan, chapters, packageData)
  const totalWordCount = wordCount(manuscriptHtml)
  const estimatedPages = Math.round(totalWordCount / 300)
  const finalBook = {
    ...plan,
    title: plan.recommendedTitle,
    subtitle: plan.recommendedSubtitle,
    slug: slugify(plan.recommendedTitle),
    description: plan.backCoverDescription,
    pages: estimatedPages,
    topics: plan.specificTopics,
    chapters,
    package: { ...packageData, totalWordCount, estimatedPages },
    manuscriptHtml,
    generatedAt: new Date().toISOString(),
    model: MODEL_NAME
  }
  onUpdate({ stage: 'complete', progress: 100, message: `Draft complete — ${totalWordCount.toLocaleString()} words, approximately ${estimatedPages} pages.`, result: finalBook })
  return finalBook
}

module.exports = { EBOOK_PROMPT_TEMPLATE, generateEbook, cleanHtml, plainText, wordCount, slugify }
