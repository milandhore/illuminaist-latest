import { useState } from 'react'
import ArticleCard from '../articles/ArticleCard'

const TOPIC_FILTERS = [
  { label: 'All', category: 'All', emoji: '✦' },
  { label: 'AI & LLMs', category: 'AI & LLMs', emoji: '🤖' },
  { label: 'RAG & Agents', category: 'RAG & Agents', emoji: '🔍' },
  { label: 'Cloud & DevOps', category: 'Cloud & DevOps', emoji: '☁️' },
  { label: 'Emerging Tech', category: 'Emerging Tech', emoji: '🔬' },
]

export default function ArticleFeed({ articles }) {
  const [active, setActive] = useState('All')

  const filtered = active === 'All'
    ? articles
    : articles.filter(a => a.category === active)

  return (
    <section>
      {/* Inline filter tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {TOPIC_FILTERS.map(({ label, category, emoji }) => (
          <button
            key={category}
            onClick={() => setActive(category)}
            className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border transition-all duration-200 ${
              active === category
                ? 'bg-amber-400/15 border-amber-400/40 text-amber-400'
                : 'border-slate-800 text-slate-500 hover:border-slate-600 hover:text-slate-300 bg-transparent'
            }`}
          >
            <span>{emoji}</span> {label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-slate-500 text-center py-16">No articles yet — check back soon.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filtered.map(article => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      )}
    </section>
  )
}
