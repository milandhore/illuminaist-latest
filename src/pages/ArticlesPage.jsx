import { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, X, ChevronDown, ChevronUp } from 'lucide-react'
import ArticleCard from '../components/articles/ArticleCard'
import AdBanner from '../components/ads/AdBanner'
import { getPublishedArticles } from '../data/articles'

// ── Topic definitions ──────────────────────────────────────────────────────
// Each topicSlug maps to a display name (category) that matches articles.js
const TOPICS = [
  { label: 'All Topics',    category: 'All',           emoji: '✦',  color: 'from-slate-700/60 to-slate-800/40', border: 'border-slate-700', hoverBorder: 'hover:border-slate-500' },
  { label: 'AI & LLMs',     category: 'AI & LLMs',     emoji: '🤖', color: 'from-cyan/20 to-cyan/5',            border: 'border-cyan/20',   hoverBorder: 'hover:border-cyan/50' },
  { label: 'RAG & Agents',  category: 'RAG & Agents',  emoji: '🔍', color: 'from-blue-500/20 to-blue-500/5',   border: 'border-blue-500/20', hoverBorder: 'hover:border-blue-400/50' },
  { label: 'Cloud & DevOps',category: 'Cloud & DevOps',emoji: '☁️', color: 'from-amber/20 to-amber/5',         border: 'border-amber/20',  hoverBorder: 'hover:border-amber/50' },
  { label: 'MLOps',         category: 'MLOps',         emoji: '⚙️', color: 'from-purple-500/20 to-purple-500/5',border: 'border-purple-500/20', hoverBorder: 'hover:border-purple-400/50' },
  { label: 'Emerging Tech', category: 'Emerging Tech', emoji: '🔬', color: 'from-green-500/20 to-green-500/5', border: 'border-green-500/20', hoverBorder: 'hover:border-green-400/50' },
  { label: 'Tutorials',     category: 'Tutorials',     emoji: '📚', color: 'from-indigo-500/20 to-indigo-500/5',border: 'border-indigo-500/20', hoverBorder: 'hover:border-indigo-400/50' },
  { label: 'Opinion',       category: 'Opinion',       emoji: '💬', color: 'from-rose-500/20 to-rose-500/5',   border: 'border-rose-500/20', hoverBorder: 'hover:border-rose-400/50' },
]

const ALL_DIFFICULTIES = ['All', 'Beginner', 'Intermediate', 'Advanced']

export default function ArticlesPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [query, setQuery]               = useState('')
  const [activeDifficulty, setActiveDifficulty] = useState('All')
  const [topicsExpanded, setTopicsExpanded]     = useState(false)

  // Read ?topic= from URL and map it to the matching TOPICS entry
  const urlTopic = searchParams.get('topic') || 'All'
  const activeTopic = TOPICS.find(t => t.category === urlTopic) || TOPICS[0]

  // Sync URL → state when navigating from footer links etc.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [urlTopic])

  const setActiveTopic = (topic) => {
    if (topic.category === 'All') {
      searchParams.delete('topic')
    } else {
      searchParams.set('topic', topic.category)
    }
    setSearchParams(searchParams, { replace: true })
  }

  const filtered = useMemo(() => {
    const publishedArticles = getPublishedArticles()
    return publishedArticles.filter(a => {
      const matchesQuery =
        !query.trim() ||
        a.title.toLowerCase().includes(query.toLowerCase()) ||
        a.excerpt.toLowerCase().includes(query.toLowerCase()) ||
        (a.category || '').toLowerCase().includes(query.toLowerCase())
      const matchesTopic = activeTopic.category === 'All' || a.category === activeTopic.category
      const matchesDiff  = activeDifficulty === 'All' || a.difficulty === activeDifficulty
      return matchesQuery && matchesTopic && matchesDiff
    })
  }, [query, activeTopic, activeDifficulty])

  const hasFilter = activeTopic.category !== 'All' || activeDifficulty !== 'All' || query.trim()

  const clearAll = () => {
    setQuery('')
    setActiveDifficulty('All')
    searchParams.delete('topic')
    setSearchParams(searchParams, { replace: true })
  }

  // Count articles per topic for live counts
  const countFor = (category) => {
    const publishedArticles = getPublishedArticles()
    return category === 'All'
      ? publishedArticles.length
      : publishedArticles.filter(a => a.category === category).length
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

      {/* Page header */}
      <div className="mb-8">
        <h1 className="font-heading text-4xl font-extrabold mb-3" style={{ background: 'linear-gradient(135deg, #00F0FF, #FFB800)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Articles</h1>
        <p className="text-slate-400 text-lg">
          Deep technical writing on AI, LLMs, MLOps, and emerging technology.
        </p>
      </div>

      {/* Top ad */}
      <AdBanner slot="header" className="mb-10" />

      {/* ── TOPIC CARDS ─────────────────────────────────────────────────────── */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-heading">Browse by Topic</h2>
          {/* Mobile: collapse/expand toggle */}
          <button
            onClick={() => setTopicsExpanded(o => !o)}
            className="md:hidden flex items-center gap-1.5 text-slate-400 text-xs font-medium hover:text-slate-200 transition-colors"
          >
            {topicsExpanded ? <><ChevronUp size={14} /> Hide</> : <><ChevronDown size={14} /> Show all</>}
          </button>
        </div>

        {/* Grid — 4 cols desktop, 2 cols mobile. On mobile hide bottom row unless expanded */}
        <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3`}>
          {TOPICS.map((topic) => {
            const isActive   = activeTopic.category === topic.category
            const count      = countFor(topic.category)
            const isHiddenMobile = !topicsExpanded && TOPICS.indexOf(topic) >= 4

            return (
              <button
                key={topic.category}
                id={`topic-${topic.category.replace(/\s+/g,'').replace(/&/g,'and')}`}
                onClick={() => setActiveTopic(topic)}
                className={`
                  ${isHiddenMobile ? 'hidden md:flex' : 'flex'}
                  flex-col items-start gap-1.5 p-4 rounded-xl border bg-gradient-to-br
                  text-left cursor-pointer transition-all duration-200 group
                  ${topic.color} ${topic.border} ${topic.hoverBorder}
                  ${isActive
                    ? 'ring-2 ring-cyan/60 shadow-[0_0_18px_rgba(0,240,255,0.15)] scale-[1.02]'
                    : 'hover:scale-[1.01] hover:shadow-lg opacity-80 hover:opacity-100'
                  }
                `}
              >
                <span className="text-2xl leading-none">{topic.emoji}</span>
                <div className="w-full">
                  <p className={`font-heading font-bold text-sm leading-snug transition-colors ${isActive ? 'text-cyan' : 'text-slate-200 group-hover:text-slate-100'}`}>
                    {topic.label}
                  </p>
                  <p className="text-slate-500 text-xs mt-0.5">{count} article{count !== 1 ? 's' : ''}</p>
                </div>
              </button>
            )
          })}
        </div>

        {/* Mobile expand button when collapsed */}
        {!topicsExpanded && (
          <button
            onClick={() => setTopicsExpanded(true)}
            className="md:hidden mt-2 w-full text-center text-xs text-slate-500 hover:text-slate-300 py-1.5 border border-dashed border-slate-800 rounded-lg transition-colors"
          >
            Show more topics ↓
          </button>
        )}
      </section>

      {/* ── SEARCH + DIFFICULTY FILTER BAR ──────────────────────────────────── */}
      <div className="rounded-2xl p-4 mb-8 bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-none">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">

          {/* Search */}
          <div className="relative flex-1 w-full">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none" />
            <input
              id="article-search"
              type="search"
              placeholder={`Search ${activeTopic.label === 'All Topics' ? 'all articles' : activeTopic.label}…`}
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-4 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-600 text-sm focus:outline-none focus:border-amber-500/50 dark:focus:border-cyan/50 focus:ring-1 focus:ring-amber-500/30 dark:ring-cyan/30 transition-all"
            />
          </div>

          {/* Difficulty chips */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] uppercase tracking-widest text-slate-500 dark:text-slate-600 font-semibold hidden sm:inline">Level</span>
            {ALL_DIFFICULTIES.map(diff => (
              <button
                key={diff}
                onClick={() => setActiveDifficulty(diff)}
                className={`px-3 h-8 rounded-lg text-xs font-medium border transition-all duration-200 ${
                  activeDifficulty === diff
                    ? 'bg-amber-500/15 border-amber-500/50 text-amber-600 dark:text-amber-400 font-semibold'
                    : 'bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-500 hover:text-slate-900 dark:hover:text-slate-300'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>

          {/* Clear all */}
          {hasFilter && (
            <button
              onClick={clearAll}
              className="flex items-center gap-1.5 px-3 h-8 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 text-xs whitespace-nowrap transition-colors"
            >
              <X size={12} /> Clear
            </button>
          )}
        </div>
      </div>

      {/* ── Active topic banner ──────────────────────────────────────────────── */}
      {activeTopic.category !== 'All' && (
        <div className="flex items-center gap-3 mb-6 px-1">
          <span className="text-xl">{activeTopic.emoji}</span>
          <div>
            <span className="text-slate-200 font-semibold">{activeTopic.label}</span>
            <span className="text-slate-500 text-sm ml-2">
              — {filtered.length} article{filtered.length !== 1 ? 's' : ''}
              {activeDifficulty !== 'All' ? ` · ${activeDifficulty}` : ''}
              {query.trim() ? ` matching "${query}"` : ''}
            </span>
          </div>
          <button
            onClick={() => setActiveTopic(TOPICS[0])}
            className="ml-auto text-slate-600 hover:text-slate-400 transition-colors"
            title="Clear topic filter"
          >
            <X size={15} />
          </button>
        </div>
      )}

      {/* ── Article grid ─────────────────────────────────────────────────────── */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(article => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      ) : (
        <div className="text-center py-24 glass-card rounded-2xl">
          <div className="text-5xl mb-4">🔍</div>
          <h3 className="font-heading text-xl font-bold text-slate-200 mb-2">No articles found</h3>
          <p className="text-slate-500 text-sm mb-6">
            {hasFilter
              ? 'Try a different keyword, topic, or difficulty level.'
              : 'Check back soon — new articles are published weekly.'}
          </p>
          {hasFilter && (
            <button onClick={clearAll} className="btn-cyan text-sm">Clear All Filters</button>
          )}
        </div>
      )}

      {/* Bottom ad */}
      <AdBanner slot="bottom-feed" className="mt-12" />
    </div>
  )
}
