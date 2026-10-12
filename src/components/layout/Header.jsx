import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Menu, X, Search, ChevronDown, PenLine, ArrowUpRight } from 'lucide-react'
import ThemeToggle from '../ui/ThemeToggle'
import { motion, AnimatePresence } from 'framer-motion'

const PRIMARY_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'News', to: '/news' },
  { label: 'About', to: '/about' },
]

const LEARN_LINKS = [
  { label: 'Articles', description: 'Deep technical guides for builders', to: '/articles' },
  { label: 'Topics', description: 'Browse the AI knowledge map', to: '/topics' },
  { label: 'eBooks', description: 'Free long-form engineering guides', to: '/ebooks' },
]

const TOPIC_LINKS = [
  { label: 'AI & LLMs', to: '/articles?topic=AI+%26+LLMs' },
  { label: 'RAG & Agents', to: '/articles?topic=RAG+%26+Agents' },
  { label: 'Cloud & DevOps', to: '/articles?topic=Cloud+%26+DevOps' },
  { label: 'MLOps', to: '/articles?topic=MLOps' },
  { label: 'Security & Governance', to: '/articles?topic=Emerging+Tech' },
]

export default function Header({ onSubscribeClick }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [learnOpen, setLearnOpen] = useState(false)

  const closeMenus = () => {
    setMobileOpen(false)
    setLearnOpen(false)
  }

  return (
    <header className="site-header sticky top-0 z-50">
      <div className="header-utility">
        <div className="site-shell flex items-center justify-between h-8 px-4 sm:px-6 lg:px-8 text-[10px] sm:text-[11px] uppercase tracking-[0.14em]">
          <span className="hidden sm:block">The independent AI engineering community</span>
          <span className="sm:ml-auto">New: daily AI news &amp; practical guides</span>
        </div>
      </div>

      <div className="header-main">
        <div className="site-shell px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[76px]">
            <Link to="/" onClick={closeMenus} className="brand-lockup flex items-center gap-3 group flex-shrink-0">
              <div className="relative w-11 h-11 flex-shrink-0"><img src="/logo.jpg" alt="IlluminAIst logo" className="w-11 h-11 rounded-xl object-cover object-center shadow-sm group-hover:shadow-md transition-shadow duration-300" /></div>
              <div className="leading-none">
                <span className="block font-heading font-extrabold text-[22px] tracking-[-0.04em] text-ink">illumin<span className="text-brand">AI</span>st</span>
                <span className="hidden sm:block text-[9px] font-bold tracking-[0.16em] uppercase text-slate-500 mt-1">AI engineering, decoded</span>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-1 ml-8">
              <div className="relative">
                <button onClick={() => setLearnOpen(open => !open)} aria-expanded={learnOpen} className={`px-3 py-2 rounded-md text-sm font-semibold transition-all duration-200 flex items-center gap-1.5 ${learnOpen ? 'text-brand bg-brand-soft' : 'text-slate-600 hover:text-ink hover:bg-slate-100'}`}>
                  Learn <ChevronDown size={14} className={`transition-transform ${learnOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {learnOpen && <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="learn-menu absolute top-full left-0 mt-3 w-[360px] bg-white border border-slate-200 rounded-lg shadow-xl p-3">
                    <div className="px-3 py-2 mb-1"><p className="eyebrow">Explore the knowledge base</p><p className="text-xs text-slate-500 mt-1">Everything you need to build with AI.</p></div>
                    {LEARN_LINKS.map(link => <Link key={link.to} to={link.to} onClick={closeMenus} className="learn-menu-item group"><span><span className="block text-sm font-bold text-ink group-hover:text-brand">{link.label}</span><span className="block text-xs text-slate-500 mt-0.5">{link.description}</span></span><ArrowUpRight size={15} className="text-slate-300 group-hover:text-brand" /></Link>)}
                    <div className="border-t border-slate-100 mt-2 pt-3 px-3"><p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400 mb-2">Popular topics</p><div className="flex flex-wrap gap-1.5">{TOPIC_LINKS.map(link => <Link key={link.label} to={link.to} onClick={closeMenus} className="topic-menu-pill">{link.label}</Link>)}</div></div>
                  </motion.div>}
                </AnimatePresence>
              </div>
              {PRIMARY_LINKS.map(link => <NavLink key={link.to} to={link.to} end={link.to === '/'} className={({ isActive }) => `px-3 py-2 rounded-md text-sm font-semibold transition-all duration-200 ${isActive ? 'text-brand bg-brand-soft' : 'text-slate-600 hover:text-ink hover:bg-slate-100'}`}>{link.label}</NavLink>)}
            </nav>

            <div className="flex items-center gap-2 sm:gap-3">
              <button className="header-search hidden sm:flex" aria-label="Search articles"><Search size={17} /><span>Search</span></button>
              <ThemeToggle />
              <button onClick={onSubscribeClick} className="hidden sm:flex btn-brand text-sm items-center gap-2"><PenLine size={14} /> Join free</button>
              <button className="md:hidden w-9 h-9 flex items-center justify-center text-slate-600 hover:text-brand" onClick={() => setMobileOpen(o => !o)} aria-label="Toggle menu">{mobileOpen ? <X size={20} /> : <Menu size={20} />}</button>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2, ease: 'easeInOut' }} className="md:hidden border-t border-slate-200 bg-white overflow-hidden">
          <nav className="px-4 py-3 flex flex-col gap-1">
            <p className="px-3 pt-1 pb-2 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">Main menu</p>
            <NavLink to="/" end onClick={closeMenus} className={({ isActive }) => `px-3 py-2.5 rounded-lg text-sm font-semibold ${isActive ? 'text-brand bg-brand-soft' : 'text-slate-600 hover:bg-slate-100'}`}>Home</NavLink>
            <NavLink to="/news" onClick={closeMenus} className={({ isActive }) => `px-3 py-2.5 rounded-lg text-sm font-semibold ${isActive ? 'text-brand bg-brand-soft' : 'text-slate-600 hover:bg-slate-100'}`}>News</NavLink>
            <div className="border-t border-slate-100 mt-2 pt-3"><p className="px-3 pb-1 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">Learn</p>{LEARN_LINKS.map(link => <Link key={link.to} to={link.to} onClick={closeMenus} className="block px-3 py-2.5 text-sm font-semibold text-slate-600 hover:text-brand">{link.label}<span className="block text-xs font-normal text-slate-400 mt-0.5">{link.description}</span></Link>)}</div>
            <NavLink to="/about" onClick={closeMenus} className={({ isActive }) => `px-3 py-2.5 rounded-lg text-sm font-semibold ${isActive ? 'text-brand bg-brand-soft' : 'text-slate-600 hover:bg-slate-100'}`}>About</NavLink>
            <button onClick={() => { closeMenus(); onSubscribeClick?.() }} className="btn-brand mt-2 text-sm w-full">Join the community</button>
          </nav>
        </motion.div>}
      </AnimatePresence>
    </header>
  )
}
