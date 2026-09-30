import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import ThemeToggle from '../ui/ThemeToggle'

const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Articles', to: '/articles' },
  { label: 'News', to: '/news' },
  { label: 'eBooks', to: '/ebooks' },
  { label: 'About', to: '/about' },
]

export default function Header({ onSubscribeClick }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 glass-card border-b border-slate-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* ── Logo + wordmark + slogan ─────────────────────────────── */}
          <Link to="/" className="flex items-center gap-3 group flex-shrink-0">
            {/* Logo mark */}
            <div className="relative w-10 h-10 flex-shrink-0">
              <img
                src="./logo.jpg"
                alt="IlluminAIst logo"
                className="w-10 h-10 rounded-lg object-cover object-center shadow-[0_0_14px_rgba(255,184,0,0.35)] group-hover:shadow-[0_0_22px_rgba(255,184,0,0.55)] transition-shadow duration-300"
              />
            </div>

            {/* Wordmark + slogan stacked */}
            <div className="leading-none">
              <span className="block font-heading font-extrabold text-xl tracking-tight" style={{ color: '#1a1f3a' }}>
                <span style={{ color: '#1a1f3a' }}>illumin</span>
                <span style={{ color: '#FFB800' }}>AI</span>
                <span style={{ color: '#1a1f3a' }}>st</span>
              </span>
              {/* Apply dark-mode aware colour via Tailwind */}
              <span className="hidden sm:block text-[9px] font-semibold tracking-[0.18em] uppercase text-slate-500 dark:text-slate-500 mt-0.5 group-hover:text-amber transition-colors duration-200">
                See Further. See Deeper.
              </span>
            </div>
          </Link>

          {/* ── Desktop nav ─────────────────────────────────────────── */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'text-amber bg-amber/10'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* ── Right actions ────────────────────────────────────────── */}
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <button
              onClick={onSubscribeClick}
              className="hidden sm:block btn-amber text-sm"
            >
              Free Access
            </button>
            {/* Mobile hamburger */}
            <button
              className="md:hidden w-9 h-9 flex items-center justify-center text-slate-400 hover:text-amber"
              onClick={() => setMobileOpen(o => !o)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile drawer ────────────────────────────────────────────── */}
      {mobileOpen && (
        <div className="md:hidden border-t border-slate-800 bg-card-dark/95 backdrop-blur-xl animate-fade-in">
          <nav className="px-4 py-3 flex flex-col gap-1">
            {NAV_LINKS.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive ? 'text-amber bg-amber/10' : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <button
              onClick={() => { setMobileOpen(false); onSubscribeClick?.() }}
              className="btn-amber mt-2 text-sm w-full"
            >
              Get Free Access
            </button>
          </nav>
        </div>
      )}
    </header>
  )
}
