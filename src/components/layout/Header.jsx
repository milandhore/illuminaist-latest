import { useState, useEffect, useRef } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Menu, X, Search, ChevronDown, PenLine, ArrowUpRight, Sparkles, Zap } from 'lucide-react'
import ThemeToggle from '../ui/ThemeToggle'
import SubscriberAlertsDropdown from '../subscription/SubscriberAlertsDropdown'
import { motion, AnimatePresence } from 'framer-motion'
import { sitePath } from '../../utils/sitePath'

const TOPIC_SUBMENU = [
  { label: 'AI & LLMs',     description: 'Foundation models, prompting & architectures', to: '/articles?topic=AI+%26+LLMs',        icon: '🤖' },
  { label: 'RAG & Agents',  description: 'Retrieval systems, tool calling & workflows',   to: '/articles?topic=RAG+%26+Agents',    icon: '🔍' },
  { label: 'Cloud & DevOps',description: 'Deploying, containerising & serving LLMs',      to: '/articles?topic=Cloud+%26+DevOps',  icon: '☁️' },
  { label: 'MLOps',         description: 'Observability, evals & production pipelines',   to: '/articles?topic=MLOps',             icon: '⚙️' },
  { label: 'Emerging Tech', description: 'New paradigms, reasoning models & protocols',   to: '/articles?topic=Emerging+Tech',     icon: '🔬' },
]

export default function Header({ onSubscribeClick }) {
  const [mobileOpen, setMobileOpen]                   = useState(false)
  const [learnOpen, setLearnOpen]                     = useState(false)
  const [mobileLearnExpanded, setMobileLearnExpanded] = useState(true)
  const [scrolled, setScrolled]                       = useState(false)
  const learnRef  = useRef(null)
  const location  = useLocation()

  const closeMenus = () => { setMobileOpen(false); setLearnOpen(false) }

  useEffect(() => {
    const onOutside = (e) => {
      if (learnRef.current && !learnRef.current.contains(e.target)) setLearnOpen(false)
    }
    document.addEventListener('mousedown', onOutside)
    return () => document.removeEventListener('mousedown', onOutside)
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const isLearnActive =
    location.pathname.startsWith('/topics') ||
    (location.pathname === '/articles' && new URLSearchParams(location.search).has('topic'))

  const navCls = ({ isActive }) =>
    `px-3 py-2 rounded-md text-sm font-semibold transition-all duration-200 ${
      isActive
        ? 'text-amber-600 dark:text-amber-400 bg-amber-500/10'
        : 'text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-slate-100 hover:bg-slate-100/80 dark:hover:bg-slate-800/60'
    }`

  const mobileCls = ({ isActive }) =>
    `px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
      isActive
        ? 'text-amber-600 dark:text-amber-400 bg-amber-500/10'
        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-950 dark:hover:text-white'
    }`

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 dark:bg-[#0B0F19]/95 border-b border-slate-200/80 dark:border-white/[0.06] shadow-sm dark:shadow-[0_4px_30px_rgba(0,0,0,0.5)] backdrop-blur-md'
          : 'bg-white/90 dark:bg-[#0B0F19]/90 border-b border-slate-200/60 dark:border-white/[0.06] backdrop-blur-md'
      }`}
    >
      {/* Utility bar */}
      <div className="bg-amber-500/10 dark:bg-[rgba(230,107,44,0.12)] border-b border-amber-500/15 dark:border-[rgba(230,107,44,0.15)]">
        <div className="site-shell flex items-center justify-between h-8 px-4 sm:px-6 lg:px-8 text-[10px] sm:text-[11px] uppercase tracking-[0.14em] text-slate-600 dark:text-slate-400 font-medium">
          <span className="hidden sm:flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            The independent AI engineering community
          </span>
          <span className="sm:ml-auto flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-medium">
            <Zap size={10} /> Alerts active: daily AI news, articles &amp; practical guides
          </span>
        </div>
      </div>

      {/* Main header */}
      <div className="site-shell px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[72px]">

          {/* Brand */}
          <Link to="/" onClick={closeMenus} className="flex items-center gap-3 group flex-shrink-0">
            <div className="relative w-10 h-10 flex-shrink-0">
              <img
                src={sitePath('logo.jpg')}
                alt="IlluminAIst logo"
                className="w-10 h-10 rounded-xl object-cover object-center transition-all duration-300 group-hover:shadow-[0_0_20px_rgba(230,107,44,0.5)]"
              />
              <div className="absolute inset-0 rounded-xl ring-1 ring-slate-900/10 dark:ring-white/10 group-hover:ring-amber-400/40 transition-all duration-300" />
            </div>
            <div className="leading-none">
              <span className="block font-heading font-extrabold text-[22px] tracking-[-0.04em] text-slate-900 dark:text-slate-100">
                illumin<span style={{ color: '#e66b2c' }}>AI</span>st
              </span>
              <span className="hidden sm:block text-[9px] font-bold tracking-[0.16em] uppercase text-slate-500 dark:text-slate-500 mt-0.5">
                See Further. Think Deeper.
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-0.5 ml-8">
            <NavLink to="/" end className={navCls}>Home</NavLink>
            <NavLink to="/news" className={navCls}>News</NavLink>

            {/* Learn dropdown */}
            <div className="relative" ref={learnRef}>
              <button
                onClick={() => setLearnOpen(o => !o)}
                aria-expanded={learnOpen}
                className={`px-3 py-2 rounded-md text-sm font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                  learnOpen || isLearnActive
                    ? 'text-amber-600 dark:text-amber-400 bg-amber-500/10'
                    : 'text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-slate-100 hover:bg-slate-100/80 dark:hover:bg-slate-800/60'
                }`}
              >
                Learn
                <ChevronDown size={14} className={`transition-transform duration-200 ${learnOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {learnOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.97 }}
                    transition={{ duration: 0.18 }}
                    className="absolute top-full left-0 mt-2 w-[380px] rounded-2xl overflow-hidden z-50 bg-white dark:bg-[#0f1423] border border-slate-200 dark:border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.14)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.6),0_0_0_1px_rgba(0,240,255,0.05)] backdrop-blur-2xl"
                  >
                    <div className="px-4 pt-4 pb-3 border-b border-slate-100 dark:border-white/5 bg-slate-50/70 dark:bg-white/[0.02]">
                      <p className="text-[10px] font-black uppercase tracking-widest text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                        <Sparkles size={10} /> Browse by Topic
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Curated technical guides across the AI stack</p>
                    </div>

                    <div className="py-1.5">
                      {TOPIC_SUBMENU.map(topic => (
                        <Link
                          key={topic.to}
                          to={topic.to}
                          onClick={closeMenus}
                          className="flex items-center justify-between gap-3 px-4 py-3 group hover:bg-slate-100/80 dark:hover:bg-white/5 transition-colors"
                        >
                          <span className="flex items-start gap-3">
                            <span className="text-lg select-none mt-0.5">{topic.icon}</span>
                            <span>
                              <span className="block text-sm font-bold text-slate-800 dark:text-slate-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                                {topic.label}
                              </span>
                              <span className="block text-xs text-slate-500 dark:text-slate-400 mt-0.5 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors">
                                {topic.description}
                              </span>
                            </span>
                          </span>
                          <ArrowUpRight size={14} className="text-slate-400 dark:text-slate-600 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors flex-shrink-0" />
                        </Link>
                      ))}
                    </div>

                    <div className="border-t border-slate-100 dark:border-white/5 px-4 py-3 flex items-center justify-between bg-slate-50/70 dark:bg-black/25">
                      <Link to="/ebooks" onClick={closeMenus} className="text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 flex items-center gap-1.5 transition-colors">
                        📚 Free eBooks &amp; Guides
                      </Link>
                      <Link to="/articles" onClick={closeMenus} className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 transition-colors">
                        All Articles →
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <NavLink to="/articles" className={navCls}>Articles</NavLink>
            <NavLink to="/ebooks" className={navCls}>Ebook</NavLink>
            <NavLink to="/about" className={navCls}>About</NavLink>
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              to="/articles"
              className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-slate-700 text-xs font-semibold transition-all duration-200 bg-white/60 dark:bg-slate-900/40"
              aria-label="Search articles"
            >
              <Search size={14} /> Search
            </Link>

            {/* Subscriber Alerts Dispatch Bell */}
            <SubscriberAlertsDropdown onSubscribeClick={onSubscribeClick} />

            <ThemeToggle />

            <button
              onClick={onSubscribeClick}
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200 text-slate-950 hover:opacity-90 active:scale-95"
              style={{
                background: 'linear-gradient(135deg, #e66b2c, #FFB800)',
                boxShadow: '0 4px 16px rgba(230,107,44,0.35)',
              }}
            >
              <PenLine size={13} /> Join free
            </button>

            <button
              className="md:hidden w-9 h-9 flex items-center justify-center text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-slate-100 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white/60 dark:bg-slate-900/40 transition-all"
              onClick={() => setMobileOpen(o => !o)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeInOut' }}
            className="md:hidden overflow-hidden bg-white/95 dark:bg-[#0b0f19]/95 backdrop-blur-2xl border-t border-slate-200/80 dark:border-white/10 shadow-xl"
          >
            <nav className="px-4 py-4 flex flex-col gap-1">
              <p className="px-3 pt-1 pb-2 text-[10px] font-black uppercase tracking-[0.14em] text-slate-500 dark:text-slate-500">Menu</p>

              <NavLink to="/" end onClick={closeMenus} className={mobileCls}>Home</NavLink>
              <NavLink to="/news" onClick={closeMenus} className={mobileCls}>News</NavLink>

              {/* Learn mobile accordion */}
              <div className="rounded-lg overflow-hidden border border-slate-100 dark:border-transparent">
                <button
                  onClick={() => setMobileLearnExpanded(e => !e)}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <span>Learn (Topics)</span>
                  <ChevronDown
                    size={15}
                    className={`transition-transform duration-200 ${mobileLearnExpanded ? 'rotate-180 text-amber-600 dark:text-amber-400' : 'text-slate-400 dark:text-slate-600'}`}
                  />
                </button>
                {mobileLearnExpanded && (
                  <div className="pl-3 pr-2 py-2 space-y-0.5 rounded-lg mb-1 bg-slate-50/80 dark:bg-white/[0.03] border border-slate-100 dark:border-white/5">
                    {TOPIC_SUBMENU.map(topic => (
                      <Link
                        key={topic.to}
                        to={topic.to}
                        onClick={closeMenus}
                        className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-white dark:hover:bg-white/5 rounded-lg transition-colors"
                      >
                        <span className="text-sm">{topic.icon}</span>
                        <span>{topic.label}</span>
                      </Link>
                    ))}
                    <Link
                      to="/ebooks"
                      onClick={closeMenus}
                      className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-white dark:hover:bg-white/5 rounded-lg border-t border-slate-200/60 dark:border-white/5 mt-1 pt-2 transition-colors"
                    >
                      <span className="text-sm">📚</span>
                      <span>Free eBooks &amp; Guides</span>
                    </Link>
                  </div>
                )}
              </div>

              <NavLink to="/articles" onClick={closeMenus} className={mobileCls}>Articles</NavLink>
              <NavLink to="/ebooks" onClick={closeMenus} className={mobileCls}>Ebook</NavLink>
              <NavLink to="/about" onClick={closeMenus} className={mobileCls}>About</NavLink>

              <button
                onClick={() => { closeMenus(); onSubscribeClick?.() }}
                className="mt-3 w-full py-2.5 rounded-lg text-sm font-bold text-slate-950 transition-all duration-200 hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #e66b2c, #FFB800)' }}
              >
                Join the community
              </button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
