import { Link } from 'react-router-dom'
import { Clock, ArrowRight } from 'lucide-react'
import Badge from '../ui/Badge'
import { articles } from '../../data/articles'

const DIFFICULTY_COLOR = { Beginner: 'green', Intermediate: 'cyan', Advanced: 'amber' }

/**
 * RelatedArticles
 * Shows up to 3 articles from the same category (excluding the current one).
 * Falls back to showing the most recent articles if none share the category.
 */
export default function RelatedArticles({ currentSlug, category }) {
  // Same category first, then fill with latest
  const sameCategory = articles.filter(
    a => a.slug !== currentSlug && a.category === category
  )
  const others = articles.filter(
    a => a.slug !== currentSlug && a.category !== category
  )
  const related = [...sameCategory, ...others].slice(0, 3)

  if (!related.length) return null

  return (
    <section className="mt-16 pt-10 border-t border-slate-800">
      <h2 className="section-heading mb-8">Related Articles</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {related.map(article => (
          <Link
            key={article.slug}
            to={`/articles/${article.slug}`}
            className="article-card block group"
          >
            {/* Gradient accent top bar */}
            <div className="h-0.5 w-full bg-gradient-to-r from-cyan via-cyan-700 to-transparent opacity-60 group-hover:opacity-100 transition-opacity" />

            <div className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <Badge color="cyan" className="text-[10px]">{article.category}</Badge>
                <Badge color={DIFFICULTY_COLOR[article.difficulty] || 'slate'} className="text-[10px]">
                  {article.difficulty}
                </Badge>
              </div>

              <h3 className="font-heading text-sm font-bold text-slate-100 mb-2 leading-snug group-hover:text-cyan transition-colors duration-200 line-clamp-2">
                {article.title}
              </h3>

              <p className="text-slate-500 text-xs leading-relaxed line-clamp-2 mb-4">
                {article.excerpt}
              </p>

              <div className="flex items-center justify-between pt-3 border-t border-slate-800/60">
                <div className="flex items-center gap-1.5 text-slate-600 text-[10px]">
                  <Clock size={10} />
                  <span>{article.readingTime}m read</span>
                </div>
                <ArrowRight
                  size={14}
                  className="text-slate-600 group-hover:text-cyan group-hover:translate-x-0.5 transition-all duration-200"
                />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
