import { Link } from 'react-router-dom'
import { Twitter, Linkedin, Github, Rss } from 'lucide-react'

const LINKS = {
  Company: [
    { label: 'About', to: '/about' },
    { label: 'Subscribe', to: '/subscribe' },
    { label: 'Advertise', to: '#' },
    { label: 'Contact', to: '#' },
  ],
  Topics: [
    { label: 'AI & LLMs',      to: '/articles?topic=AI+%26+LLMs' },
    { label: 'RAG & Agents',   to: '/articles?topic=RAG+%26+Agents' },
    { label: 'MLOps',          to: '/articles?topic=MLOps' },
    { label: 'Emerging Tech',  to: '/articles?topic=Emerging+Tech' },
  ],
  Resources: [
    { label: 'Free eBooks', to: '/ebooks' },
    { label: 'Newsletter Archive', to: '/articles' },
    { label: 'News Feed', to: '/news' },
  ],
  Legal: [
    { label: 'Privacy Policy', to: '/privacy' },
    { label: 'Terms of Service', to: '/terms' },
  ],
}

const SOCIALS = [
  { icon: Twitter, href: '#', label: 'Twitter/X' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
  { icon: Github, href: '#', label: 'GitHub' },
  { icon: Rss, href: '#', label: 'RSS Feed' },
]

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Top grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-12">
          {/* Brand col */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <img
                src="./logo.jpg"
                alt="IlluminAIst logo"
                className="w-10 h-10 rounded-lg object-cover shadow-[0_0_12px_rgba(255,184,0,0.3)]"
              />
              <div className="leading-none">
                <span className="block font-heading font-extrabold text-lg tracking-tight text-slate-100">
                  illumin<span style={{ color: '#FFB800' }}>AI</span>st
                </span>
                <span className="block text-[9px] font-semibold tracking-[0.16em] uppercase text-slate-600 mt-0.5">
                  See Further. See Deeper.
                </span>
              </div>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed mb-4">
              Your independent guide to the AI frontier. Deep technical articles, breaking AI news, and free engineering guides — every week.
            </p>
            <div className="flex gap-3">
              {SOCIALS.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-500 hover:text-cyan hover:bg-slate-700 transition-all duration-200"
                >
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(LINKS).map(([group, items]) => (
            <div key={group}>
              <h4 className="text-slate-300 font-semibold text-sm mb-4 uppercase tracking-widest">{group}</h4>
              <ul className="space-y-2.5">
                {items.map(item => (
                  <li key={item.label}>
                    <Link
                      to={item.to}
                      className="text-slate-500 text-sm hover:text-cyan transition-colors duration-200"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-slate-800/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-600 text-xs">
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
