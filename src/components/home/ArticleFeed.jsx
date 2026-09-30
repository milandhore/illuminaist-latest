import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import ArticleCard from '../articles/ArticleCard'

// Clicking a topic tag navigates to the Articles page pre-filtered by that topic.
const TOPIC_FILTERS = [
  { label: 'All',            category: 'All' },
  { label: 'AI & LLMs',     category: 'AI & LLMs' },
  { label: 'RAG & Agents',  category: 'RAG & Agents' },
  { label: 'Cloud & DevOps',category: 'Cloud & DevOps' },
  { label: 'Emerging Tech',  category: 'Emerging Tech' },
]

export default function ArticleFeed({ articles }) {
  return (
    <section>
      {/* Heading + topic shortcuts */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <h2 className="section-heading">Latest Articles</h2>

        {/* Topic shortcut links — navigate to /articles?topic=... */}
        <div className="flex flex-wrap gap-2">
          {TOPIC_FILTERS.map(({ label, category }) => (
            <Link
              key={category}
              to={category === 'All' ? '/articles' : `/articles?topic=${encodeURIComponent(category)}`}
              className="px-3 py-1 rounded-full text-xs font-medium border border-slate-700 bg-slate-800/50 text-slate-400 hover:text-cyan hover:border-cyan/40 hover:bg-cyan/5 transition-all duration-200"
            >
              {label}
            </Link>
          ))}
        </div>
      </div>

      {/* Article cards */}
      {articles.length === 0 ? (
        <p className="text-slate-500 text-center py-16">No articles yet — check back soon.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map(article => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      )}

      {/* Browse all CTA */}
      <div className="mt-10 text-center">
        <Link
          to="/articles"
          className="inline-flex items-center gap-2 btn-ghost text-sm group"
        >
          Browse all articles
          <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </section>
  )
}
