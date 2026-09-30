import { Link } from 'react-router-dom'
import { Clock, ArrowRight, Zap } from 'lucide-react'
import Badge from '../ui/Badge'

export default function HeroSpotlight({ article }) {
  if (!article) return null

  return (
    <div className="relative overflow-hidden rounded-2xl glass-card border border-cyan/10 group cursor-pointer">
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan/5 via-transparent to-amber/5 pointer-events-none" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative p-8 md:p-12">
        <div className="flex items-center gap-2 mb-6">
          <div className="flex items-center gap-1.5 bg-cyan/10 border border-cyan/30 rounded-full px-3 py-1">
            <Zap size={12} className="text-cyan" fill="currentColor" />
            <span className="text-cyan text-xs font-semibold tracking-wide uppercase">Featured</span>
          </div>
          <Badge color="amber">{article.category}</Badge>
        </div>

        <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-slate-100 mb-5 leading-tight group-hover:text-cyan transition-colors duration-300 max-w-3xl">
          {article.title}
        </h1>

        <p className="text-slate-400 text-lg leading-relaxed mb-8 max-w-2xl">
          {article.excerpt}
        </p>

        <div className="flex flex-wrap items-center gap-6">
          {/* Meta */}
          <div className="flex items-center gap-1.5 text-slate-500 text-sm">
            <Clock size={14} />
            <span>{article.readingTime} min read</span>
          </div>

          {/* CTA */}
          <Link
            to={`/articles/${article.slug}`}
            className="ml-auto flex items-center gap-2 btn-cyan text-sm"
          >
            Read Article <ArrowRight size={16} />
          </Link>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-slate-800/50">
          {article.tags?.map(tag => (
            <span key={tag} className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
