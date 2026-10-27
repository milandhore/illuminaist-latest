const SENSATIONAL_PREFIX = /^(warning|grave warning|breaking news|the ai nightmare unfolds|the ai time bomb|the ai black box)\s*[:—-]\s*/i

const ACRONYMS = ['AI', 'AI RMF', 'ABC', 'API', 'Arm', 'AWS', 'BCMA', 'CEO', 'Google', 'LLM', 'Meta', 'NIST', 'OpenAI', 'RAG']

function restoreAcronyms(text) {
  return ACRONYMS.reduce((result, acronym) => result.replace(new RegExp(`\\b${acronym}\\b`, 'gi'), acronym), text)
}

function normalizeHeadline(text) {
  const clean = text.replace(/\s+/g, ' ').trim()
  if (!clean || !/^[A-Z0-9\s:&'’(),.!?\-]+$/.test(clean)) return clean
  return restoreAcronyms(clean.charAt(0) + clean.slice(1).toLowerCase())
}

function truncate(text, limit) {
  if (text.length <= limit) return text
  return `${text.slice(0, limit).replace(/\s+\S*$/, '').trim()}…`
}

export function getNewsTitle(item = {}) {
  let title = normalizeHeadline(String(item.title || 'AI news update'))
    .replace(SENSATIONAL_PREFIX, '')
    .replace(/\s*[|｜]\s*.*$/, '')
    .trim()

  if (title.length > 72 && title.includes(':')) {
    const [lead, detail] = title.split(/:\s*/, 2)
    title = `${lead}: ${truncate(detail, 27)}`
  }

  return truncate(title, 72)
}

export function getNewsSummary(item = {}) {
  const text = String(item.excerpt || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  return truncate(text || 'A concise look at the latest forces shaping artificial intelligence.', 84)
}

export function getNewsLabel(item = {}) {
  return item.badge === 'Breaking' ? 'Breaking' : 'Quick read'
}
