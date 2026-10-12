import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, Clock3 } from 'lucide-react'
import { motion } from 'framer-motion'

function OrbitalScene() {
  return (
    <div className="hero-orbital-scene" aria-hidden="true">
      <div className="orbital-grid" />
      <div className="orbital-ring ring-a"><span /></div>
      <div className="orbital-ring ring-b"><span /></div>
      <div className="orbital-ring ring-c"><span /></div>
      <div className="orbital-core"><span>AI</span><i /></div>
      <div className="orbital-node node-a">RAG</div>
      <div className="orbital-node node-b">MLOps</div>
      <div className="orbital-node node-c">LLM</div>
    </div>
  )
}

export default function HeroSpotlight({ article }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  if (!article) return null

  const handlePointerMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2
    setTilt({ x: y * -3, y: x * 4 })
  }

  return (
    <motion.div whileHover={{ y: -3 }} className="hero-story-shell">
      <article className="hero-story" onMouseMove={handlePointerMove} onMouseLeave={() => setTilt({ x: 0, y: 0 })} style={{ '--tilt-x': `${tilt.x}deg`, '--tilt-y': `${tilt.y}deg` }}>
        <div className="hero-story-art"><OrbitalScene /><span className="hero-art-label">Featured story</span><span className="hero-art-mark">AI</span></div>
        <div className="hero-story-body">
          <div className="card-kicker">{article.category} <span className="kicker-separator">/</span> {article.difficulty}</div>
          <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-ink leading-tight mt-2">{article.title}</h2>
          <p className="text-slate-600 leading-relaxed mt-3 line-clamp-3">{article.excerpt}</p>
          <div className="flex items-center justify-between gap-4 mt-6 pt-5 border-t border-slate-200"><span className="meta-line"><Clock3 size={13} /> {article.readingTime} min read</span><Link to={`/articles/${article.slug}`} className="story-link">Read story <ArrowUpRight size={16} /></Link></div>
        </div>
      </article>
    </motion.div>
  )
}
