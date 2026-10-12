import { Link } from 'react-router-dom'
import { ArrowUpRight, Radio } from 'lucide-react'
import AdBanner from '../components/ads/AdBanner'
import { newsItems } from '../data/news'

export default function NewsPage() {
  return (
    <div className="site-shell px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
      <div className="page-intro flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8"><div><div className="eyebrow"><Radio size={13} /> Live feed</div><h1 className="font-heading text-4xl font-extrabold text-ink mt-3">AI news, without the noise.</h1><p className="text-slate-600 text-lg mt-3 max-w-2xl">The launches, research, people, and policy shaping the AI ecosystem — curated and published daily.</p></div><div className="home-status"><span className="status-dot" /> Updated every day</div></div>
      <AdBanner slot="header" className="mb-10" />
      <div className="content-with-rail">
        <div className="news-feed">{newsItems.map((item, index) => <Link key={item.id} to={`/news/${item.slug || item.id}`} className="news-story group"><div className="news-index">{String(index + 1).padStart(2, '0')}</div><div className="flex-1"><div className="card-kicker">{item.category} <span className="kicker-separator">/</span> {item.source}</div><h2 className="font-heading text-xl font-extrabold text-ink mt-2 leading-snug group-hover:text-brand transition-colors">{item.title}</h2><p className="text-slate-600 text-sm leading-relaxed mt-2 line-clamp-2">{item.excerpt}</p><div className="meta-line mt-4">Published {item.publishedAt}</div></div><ArrowUpRight size={18} className="news-arrow text-slate-300 group-hover:text-brand transition-colors" /></Link>)}</div>
        <aside className="side-rail"><AdBanner slot="sidebar" /><div className="side-panel mt-6"><div className="side-panel-title">Why follow our feed?</div><p>Our automated pipeline brings in current AI coverage and turns it into a readable, searchable brief for builders.</p><Link to="/about" className="side-link">How we publish <ArrowUpRight size={14} /></Link></div></aside>
      </div>
      <AdBanner slot="bottom-feed" className="mt-12" />
    </div>
  )
}
