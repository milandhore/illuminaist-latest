import { Link } from 'react-router-dom'
import { ArrowUpRight, Clock3, TrendingUp } from 'lucide-react'
import { motion } from 'framer-motion'

const CATEGORY_CONFIG = {
  'AI & LLMs':      { emoji: '🤖', gradient: 'from-cyan-500/20 via-blue-500/10 to-transparent',     badge: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/30',     accent: '#0099a8' },
  'RAG & Agents':   { emoji: '🔍', gradient: 'from-blue-500/20 via-indigo-500/10 to-transparent',   badge: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30',     accent: '#2563EB' },
  'Cloud & DevOps': { emoji: '☁️', gradient: 'from-amber-500/20 via-yellow-500/10 to-transparent', badge: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30', accent: '#b45309' },
  'MLOps':          { emoji: '⚙️', gradient: 'from-purple-500/20 via-violet-500/10 to-transparent', badge: 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/30', accent: '#7C3AED' },
  'Emerging Tech':  { emoji: '🔬', gradient: 'from-green-500/20 via-emerald-500/10 to-transparent', badge: 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/30',  accent: '#15803D' },
  'Tutorials':      { emoji: '📚', gradient: 'from-indigo-500/20 via-blue-500/10 to-transparent',   badge: 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-500/30', accent: '#4338CA' },
  'Opinion':        { emoji: '💬', gradient: 'from-rose-500/20 via-pink-500/10 to-transparent',     badge: 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/30',      accent: '#BE123C' },
}

// Dark accent values for glows / "Read" link in dark mode
const CATEGORY_ACCENT_DARK = {
  'AI & LLMs':      '#00F0FF',
  'RAG & Agents':   '#60A5FA',
  'Cloud & DevOps': '#FFB800',
  'MLOps':          '#A78BFA',
  'Emerging Tech':  '#34D399',
  'Tutorials':      '#818CF8',
  'Opinion':        '#FB7185',
}

const DIFFICULTY_BADGE = {
  'Beginner':     'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20',
  'Intermediate': 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20',
  'Advanced':     'bg-red-500/10   text-red-700   dark:text-red-400   border-red-500/20',
}

export default function ArticleCard({ article, featured = false }) {
  const cat      = CATEGORY_CONFIG[article.category] || CATEGORY_CONFIG['AI & LLMs']
  const diffBadge = DIFFICULTY_BADGE[article.difficulty] || DIFFICULTY_BADGE['Intermediate']

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
      className="h-full group"
    >
      <Link
        to={`/articles/${article.slug}`}
        className="article-new-card block h-full rounded-xl overflow-hidden transition-all duration-300 relative"
      >
        {/* Gradient art header */}
        <div className={`article-new-card__art relative h-32 bg-gradient-to-br ${cat.gradient} overflow-hidden flex items-center justify-between px-5`}>
          {/* Dot-grid pattern */}
          <div className="absolute inset-0 opacity-10 article-new-card__pattern"
            style={{ backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

          {/* Big emoji */}
          <div className="relative z-10 text-5xl select-none drop-shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6">
            {cat.emoji}
          </div>

          {/* Category acronym watermark */}
          <span className="relative z-10 font-heading font-black text-6xl opacity-10 select-none leading-none article-new-card__watermark">
            {article.category === 'AI & LLMs' ? 'AI' : article.category?.split(' ')[0]}
          </span>

          {/* Trending badge */}
          {article.trending && (
            <div className="absolute top-3 right-3 flex items-center gap-1 bg-amber-500/20 border border-amber-500/30 text-amber-700 dark:text-amber-400 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full">
              <TrendingUp size={9} /> Trending
            </div>
          )}

          {/* Bottom fade into card body */}
          <div className="article-new-card__fade absolute bottom-0 left-0 right-0 h-8" />
        </div>

        {/* Content body */}
        <div className="p-5 flex flex-col" style={{ minHeight: featured ? '220px' : '190px' }}>
          {/* Badges row */}
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${cat.badge}`}>
              {article.category}
            </span>
            {article.difficulty && (
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${diffBadge}`}>
                {article.difficulty}
              </span>
            )}
          </div>

          {/* Title — adapts per theme via CSS class */}
          <h3 className="article-new-card__title font-heading text-[17px] font-extrabold leading-snug line-clamp-2 mb-2 transition-colors">
            {article.title}
          </h3>

          {/* Excerpt */}
          <p className="article-new-card__excerpt text-sm leading-relaxed line-clamp-2 flex-grow mb-4">
            {article.excerpt}
          </p>

          {/* Tags */}
          {article.tags?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {article.tags.slice(0, 2).map(tag => (
                <span key={tag} className="article-new-card__tag text-[10px] px-2 py-0.5 rounded-md font-medium">
                  {tag}
                </span>
              ))}
              {article.tags.length > 2 && (
                <span className="article-new-card__tag-more text-[10px] px-1 py-0.5">+{article.tags.length - 2}</span>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="article-new-card__footer flex items-center justify-between pt-3 mt-auto">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full overflow-hidden article-new-card__avatar flex-shrink-0">
                <img src="/logo.jpg" alt="IlluminAIst" className="w-full h-full object-cover" />
              </div>
              <span className="article-new-card__meta flex items-center gap-1.5 text-xs font-medium">
                <Clock3 size={11} /> {article.readingTime} min read
              </span>
            </div>
            <span className="article-new-card__cta flex items-center gap-1 text-xs font-bold transition-colors duration-200">
              Read <ArrowUpRight size={13} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </span>
          </div>
        </div>

        {/* Hover glow ring */}
        <div className="article-new-card__glow absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </Link>
    </motion.div>
  )
}
