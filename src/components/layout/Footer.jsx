import { Link } from 'react-router-dom'
import { Twitter, Linkedin, Github, Rss, ArrowUpRight, Zap } from 'lucide-react'
import { sitePath } from '../../utils/sitePath'

const LINKS = {
  Company: [
    { label: 'About',     to: '/about' },
    { label: 'Subscribe', to: '/subscribe' },
    { label: 'Advertise', to: '#' },
    { label: 'Contact',   to: '#' },
  ],
  Topics: [
    { label: 'AI & LLMs',     to: '/articles?topic=AI+%26+LLMs' },
    { label: 'RAG & Agents',  to: '/articles?topic=RAG+%26+Agents' },
    { label: 'MLOps',         to: '/articles?topic=MLOps' },
    { label: 'Emerging Tech', to: '/articles?topic=Emerging+Tech' },
  ],
  Resources: [
    { label: 'Free eBooks',         to: '/ebooks' },
    { label: 'Newsletter Archive',  to: '/articles' },
    { label: 'News Feed',           to: '/news' },
  ],
  Legal: [
    { label: 'Privacy Policy',    to: '/privacy' },
    { label: 'Terms of Service',  to: '/terms' },
  ],
}

const SOCIALS = [
  { icon: Twitter,  href: '#', label: 'Twitter/X' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
  { icon: Github,   href: '#', label: 'GitHub' },
  { icon: Rss,      href: '#', label: 'RSS Feed' },
]

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 mt-24" style={{ background: '#0a0e18' }}>
      {/* Top glow line */}
      <div className="h-px w-full" style={{ background: 'linear-gradient(90deg, transparent, rgba(0,240,255,0.3), rgba(255,184,0,0.3), transparent)' }} />

      <div className="site-shell px-4 sm:px-6 lg:px-8 py-16">
        {/* Top grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-12">
          {/* Brand col */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative">
                <img
                  src={sitePath('logo.jpg')}
                  alt="IlluminAIst logo"
                  className="w-11 h-11 rounded-xl object-cover"
                  style={{ boxShadow: '0 0 20px rgba(230,107,44,0.3)' }}
                />
                <div className="absolute inset-0 rounded-xl ring-1 ring-white/10" />
              </div>
              <div className="leading-none">
                <span className="block font-heading font-extrabold text-xl tracking-tight text-slate-100">
                  illumin<span style={{ color: '#e66b2c' }}>AI</span>st
                </span>
                <span className="block text-[9px] font-bold tracking-[0.16em] uppercase text-slate-600 mt-0.5">
                  See Further. Think Deeper.
                </span>
              </div>
            </div>

            <p className="text-slate-500 text-sm leading-relaxed mb-5">
              Your independent guide to the AI frontier. Deep technical articles, breaking AI news, and free engineering guides — every week.
            </p>

            {/* Socials */}
            <div className="flex gap-2">
              {SOCIALS.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-8 h-8 rounded-lg border border-slate-800 flex items-center justify-center text-slate-600 hover:text-cyan-400 hover:border-slate-700 transition-all duration-200"
                >
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(LINKS).map(([group, items]) => (
            <div key={group}>
              <h4 className="text-slate-300 font-bold text-xs mb-4 uppercase tracking-widest">{group}</h4>
              <ul className="space-y-2.5">
                {items.map(item => (
                  <li key={item.label}>
                    <Link
                      to={item.to}
                      className="text-slate-500 text-sm hover:text-slate-200 transition-colors duration-200 flex items-center gap-1 group"
                    >
                      {item.label}
                      {item.to === '#' && (
                        <ArrowUpRight size={11} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter mini-CTA */}
        <div className="rounded-xl border border-slate-800 bg-[#0f1525] p-6 mb-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-heading font-extrabold text-slate-100 text-lg flex items-center gap-2">
              <Zap size={16} className="text-amber-400" />
              Stay ahead of the AI curve
            </p>
            <p className="text-slate-500 text-sm mt-1">Join thousands of engineers getting the weekly briefing.</p>
          </div>
          <Link
            to="/subscribe"
            className="flex-shrink-0 px-5 py-2.5 rounded-lg text-sm font-bold text-[#0B0F19] transition-all duration-200 hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #e66b2c, #FFB800)', boxShadow: '0 4px 16px rgba(230,107,44,0.3)' }}
          >
            Subscribe free →
          </Link>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-slate-800/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-700 text-xs">
            © {new Date().getFullYear()} IlluminAIst. All rights reserved. Content is for informational purposes only.
          </p>
          <p className="text-slate-700 text-xs">
            Built with React + Vite + Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  )
}
