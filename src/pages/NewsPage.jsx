import { Link } from 'react-router-dom'
import { Zap } from 'lucide-react'
import Badge from '../components/ui/Badge'
import AdBanner from '../components/ads/AdBanner'
import { newsItems } from '../data/news'

export default function NewsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-2">
          <Zap size={14} className="text-cyan" fill="currentColor" />
          <span className="text-cyan text-xs font-semibold uppercase tracking-widest">Live Feed</span>
        </div>
        <h1 className="font-heading text-4xl font-bold gradient-text-mixed mb-3">AI News</h1>
        <p className="text-slate-400 text-lg">Breaking developments from across the AI ecosystem — curated daily.</p>
      </div>

      <AdBanner slot="header" className="mb-10" />

      <div className="space-y-4">
        {newsItems.map(item => (
          <Link
            key={item.id}
            to={`/news/${item.slug || item.id}`}
            className="glass-card rounded-xl p-6 flex gap-5 items-start group transition-all duration-300 hover:border-cyan/20 block"
          >
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <Badge color={item.badgeColor}>{item.badge}</Badge>
                <span className="text-slate-600 text-xs">{item.source}</span>
              </div>
              <h2 className="font-heading text-lg font-bold text-slate-100 mb-2 group-hover:text-cyan transition-colors leading-snug">
                {item.title}
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed">{item.excerpt}</p>
            </div>
          </Link>
        ))}
      </div>

      <AdBanner slot="bottom-feed" className="mt-12" />
    </div>
  )
}
