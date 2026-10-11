import { Link } from 'react-router-dom'
import { Clock, ArrowRight } from 'lucide-react'
import Badge from '../ui/Badge'
import { motion } from 'framer-motion'

const DIFFICULTY_COLOR = { Beginner: 'green', Intermediate: 'cyan', Advanced: 'amber' }

export default function ArticleCard({ article }) {
  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="h-full"
    >
      <Link to={`/articles/${article.slug}`} id={`article-card-${article.slug}`} className="article-card block group h-full">
        {/* Card gradient top bar */}
        <div className="h-1 w-full bg-gradient-to-r from-cyan via-cyan-700 to-transparent opacity-60 group-hover:opacity-100 transition-opacity" />

        <div className="p-6 flex flex-col h-[calc(100%-4px)]">
          {/* Category + difficulty */}
          <div className="flex items-center gap-2 mb-4">
            <Badge color="cyan" className="text-[10px]">{article.category}</Badge>
            <Badge color={DIFFICULTY_COLOR[article.difficulty] || 'slate'} className="text-[10px]">
              {article.difficulty}
            </Badge>
          </div>

          {/* Title */}
          <h3 className="font-heading text-lg font-bold text-slate-100 mb-3 leading-snug group-hover:text-cyan transition-colors duration-200 line-clamp-2">
            {article.title}
          </h3>

          {/* Excerpt */}
          <p className="text-slate-400 text-sm leading-relaxed line-clamp-3 mb-5 flex-grow">
            {article.excerpt}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800/60 mt-auto">
            <div className="flex items-center gap-1 text-slate-600 text-xs">
              <Clock size={12} />
              <span>{article.readingTime} min read</span>
            </div>
            <ArrowRight size={16} className="text-slate-600 group-hover:text-cyan group-hover:translate-x-1 transition-all duration-200" />
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
