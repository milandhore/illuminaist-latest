import { Link } from 'react-router-dom'
import { ArrowRight, Clock3, Radio, Sparkles } from 'lucide-react'
import HeroSpotlight from '../components/home/HeroSpotlight'
import TrendingTicker from '../components/home/TrendingTicker'
import ArticleFeed from '../components/home/ArticleFeed'
import AdBanner from '../components/ads/AdBanner'
import InlineSubscribe from '../components/subscription/InlineSubscribe'
import { getPublishedArticles, getFeaturedArticle } from '../data/articles'
import { newsItems } from '../data/news'
import { motion } from 'framer-motion'

const itemVariants = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.45 } } }

export default function HomePage() {
  const articles = getPublishedArticles()
  const featured = getFeaturedArticle()
  const latest = articles.filter(a => a.slug !== featured?.slug).slice(0, 3)
  const recentNews = newsItems.slice(0, 4)

  return (
    <motion.div initial="hidden" animate="visible" className="site-shell px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      <motion.div variants={itemVariants}><AdBanner slot="header" /></motion.div>

      <motion.section variants={itemVariants} className="home-intro mt-8 mb-8 flex flex-col lg:flex-row lg:items-end justify-between gap-5">
        <div>
          <div className="eyebrow"><Sparkles size={14} /> The AI engineering brief</div>
          <h1 className="font-heading text-4xl sm:text-5xl font-extrabold text-ink tracking-tight mt-3 max-w-2xl">Build smarter. <span className="text-brand">Understand deeper.</span></h1>
          <p className="text-slate-600 max-w-2xl mt-4 text-base sm:text-lg leading-relaxed">Practical intelligence for the people building with AI — from the latest model releases to production patterns that hold up in the real world.</p>
        </div>
        <div className="home-status"><span className="status-dot" /> Updated daily <span className="text-slate-400 mx-1">·</span> Curated for builders</div>
      </motion.section>

      <motion.section variants={itemVariants} className="home-feature-grid">
        <HeroSpotlight article={featured} />
        <aside className="latest-rail">
          <div className="rail-heading"><span>Latest from IlluminAIst</span><Link to="/articles">View all <ArrowRight size={14} /></Link></div>
          <div className="divide-y divide-slate-200">
            {latest.map((article, index) => <Link key={article.slug} to={`/articles/${article.slug}`} className="latest-item group"><span className="latest-number">0{index + 1}</span><div><span className="card-kicker">{article.category}</span><h2 className="text-[17px] leading-snug font-bold text-ink group-hover:text-brand transition-colors">{article.title}</h2><span className="meta-line"><Clock3 size={12} /> {article.readingTime} min read</span></div></Link>)}
          </div>
        </aside>
      </motion.section>

      <motion.div variants={itemVariants} className="mt-8"><TrendingTicker /></motion.div>

      <motion.div variants={itemVariants} className="content-with-rail mt-12">
        <div><ArticleFeed articles={articles.slice(0, 6)} /></div>
        <aside className="side-rail">
          <AdBanner slot="sidebar" />
          <div className="side-panel mt-6"><div className="side-panel-title"><Radio size={15} /> AI news, daily</div><p>Short, useful updates on the launches, research, and policy shaping the AI ecosystem.</p><Link to="/news" className="side-link">Read the news feed <ArrowRight size={14} /></Link></div>
          <div className="side-panel mt-4"><div className="side-panel-title">Most recent news</div><div className="space-y-4 mt-4">{recentNews.slice(0, 3).map(item => <Link key={item.id} to={`/news/${item.slug}`} className="block group"><span className="card-kicker">{item.source}</span><h3 className="text-sm leading-snug font-bold text-ink group-hover:text-brand transition-colors">{item.title}</h3></Link>)}</div></div>
        </aside>
      </motion.div>

      <motion.div variants={itemVariants} className="mt-12"><InlineSubscribe /></motion.div>
      <motion.div variants={itemVariants} className="mt-10"><AdBanner slot="bottom-feed" /></motion.div>
    </motion.div>
  )
}
