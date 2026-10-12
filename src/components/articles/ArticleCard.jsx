import { Link } from 'react-router-dom'
import { ArrowUpRight, Clock3 } from 'lucide-react'
import { motion } from 'framer-motion'

export default function ArticleCard({ article }) {
  return (
    <motion.div whileHover={{ y: -4 }} transition={{ type: 'spring', stiffness: 400, damping: 28 }} className="h-full">
      <Link to={`/articles/${article.slug}`} className="editorial-card group h-full">
        <div className="card-art"><span>{article.category === 'AI & LLMs' ? 'AI' : article.category?.split(' ')[0]}</span></div>
        <div className="p-5 flex flex-col h-[calc(100%-112px)]">
          <div className="card-kicker">{article.category} <span className="kicker-separator">/</span> {article.difficulty}</div>
          <h3 className="font-heading text-lg font-extrabold text-ink leading-snug mt-2 line-clamp-3 group-hover:text-brand transition-colors">{article.title}</h3>
          <p className="text-slate-600 text-sm leading-relaxed line-clamp-2 mt-3 flex-grow">{article.excerpt}</p>
          <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-200"><span className="meta-line"><Clock3 size={12} /> {article.readingTime} min read</span><ArrowUpRight size={16} className="text-slate-400 group-hover:text-brand transition-colors" /></div>
        </div>
      </Link>
    </motion.div>
  )
}
