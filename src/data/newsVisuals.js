const VISUAL_LIBRARY = {
  security: {
    topic: 'AI Safety',
    label: 'AI safety',
    mark: '◎',
    image: '/news-art/cybersecurity-network.png',
    colors: ['#0b1f39', '#0b7890', '#f0a24b'],
    captions: ['Signals worth watching', 'The new security perimeter', 'Where models meet risk'],
  },
  healthcare: {
    topic: 'Healthcare AI',
    label: 'Healthcare AI',
    mark: '+',
    image: '/news-art/healthcare-ai.png',
    colors: ['#dceff5', '#4bb8c4', '#f1a15b'],
    captions: ['AI in the care loop', 'Precision has a price', 'The human checkpoint'],
  },
  education: {
    topic: 'Education',
    label: 'Education',
    mark: '∿',
    colors: ['#f2c99d', '#6587a6', '#2b3e5d'],
    captions: ['Learning in public', 'The classroom changes shape', 'A new study habit'],
  },
  policy: {
    topic: 'Policy & Power',
    label: 'Policy & power',
    mark: '◌',
    colors: ['#f1e7d8', '#9d6b5a', '#24395a'],
    captions: ['Rules for the next era', 'Power, measured in policy', 'The governance gap'],
  },
  markets: {
    topic: 'Markets',
    label: 'Markets',
    mark: '↗',
    image: '/news-art/ai-markets.png',
    colors: ['#dce6f2', '#4a7092', '#e28b49'],
    captions: ['The signal behind the spend', 'AI meets the balance sheet', 'A market in motion'],
  },
  research: {
    topic: 'Research',
    label: 'Research',
    mark: '✦',
    colors: ['#efe5d2', '#716c9c', '#253b5c'],
    captions: ['Inside the lab', 'The next useful breakthrough', 'Evidence over theatre'],
  },
  people: {
    topic: 'People & Work',
    label: 'People & work',
    mark: '◒',
    colors: ['#f0ddd2', '#b46f61', '#304866'],
    captions: ['The human side of AI', 'Work, redesigned', 'What stays distinctly human'],
  },
}

const TOPIC_RULES = [
  ['healthcare', /health|medical|surgery|gastric|symptom|epidemiolog|precancer/i],
  ['education', /education|classroom|academic|student|school|georgia tech/i],
  ['policy', /policy|politic|government|trump|justice dept|civilian control|regulation/i],
  ['markets', /stock|investment|bubble|money|corporate|market|arm|marvell/i],
  ['research', /research|academia|nist|model|evaluator|framework|protocol/i],
  ['people', /whistleblower|people|ethic|examen|trust|safety culture/i],
]

function getVisualKey(item = {}) {
  const text = `${item.title || ''} ${item.excerpt || ''}`
  return TOPIC_RULES.find(([, pattern]) => pattern.test(text))?.[0] || 'security'
}

function hashString(value = '') {
  return [...value].reduce((hash, character) => ((hash << 5) - hash + character.charCodeAt(0)) | 0, 0) >>> 0
}

const UNIQUE_IMAGE_SLOTS = { markets: 1, healthcare: 2, security: 3 }

export function getNewsVisual(item) {
  const key = getVisualKey(item)
  const visual = VISUAL_LIBRARY[key]
  const variant = hashString(item.slug || item.title || key) % 11
  const showImage = Boolean(visual.image) && item.id === UNIQUE_IMAGE_SLOTS[key]
  const gallery = Array.from({ length: 7 }, (_, index) => ({
    id: `${item.slug || item.id || 'story'}-${index}`,
    key,
    topic: visual.topic,
    label: visual.label,
    mark: visual.mark,
    image: index === 0 && showImage ? visual.image : undefined,
    variant: (variant + index) % 11,
    colors: visual.colors.map((color, colorIndex) => visual.colors[(colorIndex + index + variant) % visual.colors.length]),
    caption: visual.captions[index % visual.captions.length],
  }))

  return { ...visual, key, gallery }
}

export function getNewsTopics(items = []) {
  return [...new Set(items.map(getNewsVisual).map(visual => visual.topic))]
}
