import { Link } from 'react-router-dom'
import { ArrowRight, Clock3, Radio, Sparkles, TrendingUp, Users, BookOpen, Zap, ChevronRight } from 'lucide-react'
import HeroSpotlight from '../components/home/HeroSpotlight'
import TrendingTicker from '../components/home/TrendingTicker'
import ArticleFeed from '../components/home/ArticleFeed'
import AdBanner from '../components/ads/AdBanner'
import InlineSubscribe from '../components/subscription/InlineSubscribe'
import { getPublishedArticles, getFeaturedArticle } from '../data/articles'
import { newsItems } from '../data/news'
import { motion } from 'framer-motion'

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}
const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

const STATS = [
  { icon: <BookOpen size={16} />, value: '50+', label: 'Deep-dive articles' },
  { icon: <Users size={16} />, value: '10k+', label: 'Monthly readers' },
  { icon: <TrendingUp size={16} />, value: 'Daily', label: 'AI news updates' },
  { icon: <Zap size={16} />, value: 'Free', label: 'Always & forever' },
]

const TOPIC_PILLS = [
  { label: 'AI & LLMs', emoji: '🤖', to: '/articles?topic=AI+%26+LLMs', color: 'hover:border-cyan-500/50 hover:text-cyan-400' },
  { label: 'RAG & Agents', emoji: '🔍', to: '/articles?topic=RAG+%26+Agents', color: 'hover:border-blue-500/50 hover:text-blue-400' },
  { label: 'Cloud & DevOps', emoji: '☁️', to: '/articles?topic=Cloud+%26+DevOps', color: 'hover:border-amber-500/50 hover:text-amber-400' },
  { label: 'MLOps', emoji: '⚙️', to: '/articles?topic=MLOps', color: 'hover:border-purple-500/50 hover:text-purple-400' },
  { label: 'Emerging Tech', emoji: '🔬', to: '/articles?topic=Emerging+Tech', color: 'hover:border-green-500/50 hover:text-green-400' },
]

export default function HomePage() {
  const articles = getPublishedArticles()
  const featured = getFeaturedArticle()
  const latest = articles.filter(a => a.slug !== featured?.slug).slice(0, 4)
  const recentNews = newsItems.slice(0, 4)

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={stagger}
      className="min-h-screen"
    >
      {/* ── HERO INTRO ─────────────────────────────────────────────────── */}
      <motion.section
        variants={fadeUp}
        className="relative overflow-hidden px-4 sm:px-6 lg:px-8 pt-10 pb-8"
      >
        {/* Background ambient glow */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="absolute top-0 left-1/4 w-[600px] h-[400px] rounded-full opacity-10"
            style={{ background: 'radial-gradient(ellipse, #00F0FF 0%, transparent 70%)', filter: 'blur(80px)' }} />
          <div className="absolute top-0 right-1/4 w-[500px] h-[350px] rounded-full opacity-8"
            style={{ background: 'radial-gradient(ellipse, #FFB800 0%, transparent 70%)', filter: 'blur(100px)' }} />
        </div>

        <div className="site-shell relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
            <div>
              <div className="inline-flex items-center gap-2 bg-amber-400/10 border border-amber-400/20 text-amber-400 text-[11px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-4">
                <Sparkles size={12} /> The AI Engineering Brief
              </div>
              <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-none mb-4">
                <span className="text-slate-100">Build smarter.</span>
                <br />
                <span style={{ background: 'linear-gradient(90deg, #00F0FF 0%, #FFB800 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  Understand deeper.
                </span>
              </h1>
              <p className="text-slate-400 max-w-xl text-base sm:text-lg leading-relaxed">
                Practical intelligence for builders working with AI — from the latest model releases to production patterns that hold up in the real world.
              </p>
            </div>

            {/* Live status */}
            <div className="flex items-center gap-2 bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 px-4 py-2.5 rounded-lg text-sm font-semibold text-slate-600 dark:text-slate-400 shadow-sm dark:shadow-none whitespace-nowrap flex-shrink-0">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
              Updated daily · Curated for builders
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            {STATS.map(s => (
              <div key={s.label} className="flex items-center gap-3 bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 hover:border-slate-300 dark:hover:border-slate-700 shadow-sm dark:shadow-none transition-colors">
                <span className="text-amber-500 dark:text-amber-400">{s.icon}</span>
                <div>
                  <p className="text-slate-900 dark:text-slate-100 font-extrabold text-lg font-heading leading-none">{s.value}</p>
                  <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">{s.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Topic pills */}
          <div className="flex flex-wrap gap-2 mb-2">
            <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider self-center mr-1">Browse:</span>
            {TOPIC_PILLS.map(t => (
              <Link
                key={t.to}
                to={t.to}
                className={`inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] px-3 py-1.5 rounded-full shadow-sm dark:shadow-none transition-all duration-200 ${t.color}`}
              >
                <span>{t.emoji}</span> {t.label}
              </Link>
            ))}
          </div>
        </div>
      </motion.section>

      <div className="site-shell px-4 sm:px-6 lg:px-8">
        {/* ── AD BANNER ─────────────────────────────────────────── */}
        <motion.div variants={fadeUp}><AdBanner slot="header" /></motion.div>

        {/* ── FEATURE GRID ──────────────────────────────────────── */}
        <motion.section variants={fadeUp} className="home-feature-grid mt-8">
          <HeroSpotlight article={featured} />

          {/* Latest rail — theme-aware card */}
          <aside className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] shadow-sm dark:shadow-none overflow-hidden flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
                <span className="font-heading font-extrabold text-sm text-slate-900 dark:text-slate-200 flex items-center gap-2">
                  <Sparkles size={13} className="text-amber-500 dark:text-amber-400" />
                  Latest from IlluminAIst
                </span>
                <Link to="/articles" className="text-amber-600 dark:text-amber-400 text-xs font-bold flex items-center gap-1 hover:text-amber-500 dark:hover:text-amber-300 transition-colors">
                  View all <ArrowRight size={12} />
                </Link>
              </div>
              <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {latest.map((article, index) => (
                  <Link
                    key={article.slug}
                    to={`/articles/${article.slug}`}
                    className="flex items-start gap-3 px-5 py-4 group hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors"
                  >
                    <span className="font-heading font-black text-slate-400 dark:text-slate-700 text-lg leading-none w-6 flex-shrink-0 group-hover:text-amber-500 dark:group-hover:text-amber-400 transition-colors">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <div className="min-w-0">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-amber-600 dark:text-amber-500 block mb-1">
                        {article.category}
                      </span>
                      <h2 className="text-[14px] leading-snug font-bold text-slate-800 dark:text-slate-300 group-hover:text-amber-600 dark:group-hover:text-white transition-colors line-clamp-2">
                        {article.title}
                      </h2>
                      <span className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-600 mt-1.5">
                        <Clock3 size={10} /> {article.readingTime} min read
                      </span>
                    </div>
                    <ChevronRight size={14} className="text-slate-400 dark:text-slate-700 group-hover:text-amber-500 dark:group-hover:text-amber-400 transition-colors flex-shrink-0 mt-1" />
                  </Link>
                ))}
              </div>
            </div>
            <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40">
              <Link to="/articles" className="text-center w-full block text-xs font-bold text-slate-600 dark:text-slate-500 hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
                Browse all articles →
              </Link>
            </div>
          </aside>
        </motion.section>

        {/* ── TRENDING TICKER ───────────────────────────────────── */}
        <motion.div variants={fadeUp} className="mt-8">
          <TrendingTicker />
        </motion.div>

        {/* ── CONTENT + SIDEBAR ─────────────────────────────────── */}
        <motion.div variants={fadeUp} className="content-with-rail mt-12">
          <div>
            {/* Section heading */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading text-2xl font-extrabold text-slate-100 flex items-center gap-3">
                <span className="w-1 h-7 rounded-full" style={{ background: 'linear-gradient(to bottom, #00F0FF, #FFB800)' }} />
                Latest Articles
              </h2>
              <Link to="/articles" className="text-amber-400 text-sm font-bold flex items-center gap-1 hover:text-amber-300 transition-colors">
                View all <ArrowRight size={14} />
              </Link>
            </div>
            <ArticleFeed articles={articles.slice(0, 6)} />
          </div>

          {/* Sidebar */}
          <aside className="side-rail space-y-5">
            <AdBanner slot="sidebar" />

            {/* AI News panel */}
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] shadow-sm dark:shadow-none overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
                <Radio size={14} className="text-amber-500 dark:text-amber-400" />
                <span className="font-heading font-extrabold text-sm text-slate-900 dark:text-slate-200">AI News, Daily</span>
              </div>
              <div className="p-5">
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4">
                  Short, useful updates on the launches, research, and policy shaping the AI ecosystem.
                </p>
                <Link to="/news" className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 text-xs font-bold hover:text-amber-500 dark:hover:text-amber-300 transition-colors">
                  Read the news feed <ArrowRight size={12} />
                </Link>
              </div>
            </div>

            {/* Recent news */}
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] shadow-sm dark:shadow-none overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800">
                <span className="font-heading font-extrabold text-sm text-slate-900 dark:text-slate-200">Most Recent News</span>
              </div>
              <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {recentNews.slice(0, 3).map(item => (
                  <Link key={item.id} to={`/news/${item.slug}`} className="block px-5 py-3.5 group hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-600 block mb-1">{item.source}</span>
                    <h3 className="text-xs font-bold text-slate-700 dark:text-slate-400 group-hover:text-amber-600 dark:group-hover:text-slate-200 transition-colors leading-snug line-clamp-2">
                      {item.title}
                    </h3>
                  </Link>
                ))}
              </div>
              <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-800">
                <Link to="/news" className="text-xs font-bold text-slate-600 dark:text-slate-500 hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
                  More news →
                </Link>
              </div>
            </div>

            {/* Topic navigator */}
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] shadow-sm dark:shadow-none overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800">
                <span className="font-heading font-extrabold text-sm text-slate-900 dark:text-slate-200">Browse by Topic</span>
              </div>
              <div className="p-4 flex flex-col gap-1.5">
                {TOPIC_PILLS.map(t => (
                  <Link
                    key={t.to}
                    to={t.to}
                    className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-600 dark:text-slate-400 border border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all ${t.color}`}
                  >
                    <span className="text-base">{t.emoji}</span>
                    {t.label}
                    <ChevronRight size={13} className="ml-auto opacity-40" />
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </motion.div>

        {/* ── NEWSLETTER SUBSCRIBE ──────────────────────────────── */}
        <motion.div variants={fadeUp} className="mt-14">
          <InlineSubscribe />
        </motion.div>

        {/* ── BOTTOM AD ─────────────────────────────────────────── */}
        <motion.div variants={fadeUp} className="mt-10 mb-8">
          <AdBanner slot="bottom-feed" />
        </motion.div>
      </div>
    </motion.div>
  )
}
