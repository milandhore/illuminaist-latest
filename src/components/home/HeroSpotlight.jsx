import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, Clock3, Zap, TrendingUp, Star } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { sitePath } from '../../utils/sitePath'

function IlluminAIstOrb() {
  return (
    <div className="hero-orbital-scene" aria-hidden="true">
      {/* Animated grid */}
      <div className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'linear-gradient(rgba(0,240,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,240,255,0.3) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          transform: 'rotateX(60deg) rotateZ(-10deg)',
          transformOrigin: 'center center',
          maskImage: 'linear-gradient(to bottom, transparent, black 30%, transparent)',
        }}
      />

      {/* Glow orb center */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(230,107,44,0.6) 0%, rgba(0,240,255,0.2) 50%, transparent 70%)', filter: 'blur(20px)' }}
      />

      {/* Logo orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
        style={{ animation: 'coreFloat 4s ease-in-out infinite' }}>
        <div className="w-20 h-20 rounded-full border-2 border-white/20 overflow-hidden shadow-2xl flex items-center justify-center"
          style={{ background: 'radial-gradient(circle at 35% 28%, #ffb178, #e66b2c 40%, #852f11 100%)', boxShadow: '0 0 40px rgba(230,107,44,0.5), 0 0 80px rgba(0,240,255,0.2)' }}>
          <img src={sitePath('logo.jpg')} alt="IlluminAIst" className="w-full h-full object-cover" />
        </div>
      </div>

      {/* Orbital rings */}
      <div className="orbital-ring ring-a"><span /></div>
      <div className="orbital-ring ring-b"><span /></div>
      <div className="orbital-ring ring-c"><span /></div>

      {/* Floating nodes */}
      <div className="orbital-node node-a">RAG</div>
      <div className="orbital-node node-b">MLOps</div>
      <div className="orbital-node node-c">LLM</div>
    </div>
  )
}

const DIFFICULTY_COLORS = {
  Beginner: { text: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/20' },
  Intermediate: { text: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-400/20' },
  Advanced: { text: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-400/20' },
}

export default function HeroSpotlight({ article }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [hovered, setHovered] = useState(false)

  if (!article) return null

  const diff = DIFFICULTY_COLORS[article.difficulty] || DIFFICULTY_COLORS.Intermediate

  const handlePointerMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2
    setTilt({ x: y * -3, y: x * 4 })
  }

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className="hero-story-shell relative"
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
    >
      <article
        className="hero-story relative overflow-hidden rounded-xl border transition-all duration-300"
        onMouseMove={handlePointerMove}
        onMouseLeave={() => { setTilt({ x: 0, y: 0 }); setHovered(false) }}
        style={{
          '--tilt-x': `${tilt.x}deg`,
          '--tilt-y': `${tilt.y}deg`,
          borderColor: hovered ? 'rgba(0,240,255,0.35)' : undefined,
        }}
      >
        {/* Left: Orbital art */}
        <div className="hero-story-art relative" style={{ background: 'linear-gradient(145deg, #0d1b2e 0%, #162040 50%, #2a1200 100%)' }}>
          <IlluminAIstOrb />

          {/* Featured badge */}
          <div className="absolute top-4 left-4 z-20">
            <span className="flex items-center gap-1.5 bg-amber-500/90 text-[#0B0F19] text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-md">
              <Star size={10} fill="currentColor" /> Featured
            </span>
          </div>

          {/* Trending badge */}
          {article.trending && (
            <div className="absolute top-4 right-4 z-20">
              <span className="flex items-center gap-1 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full">
                <TrendingUp size={9} /> Trending
              </span>
            </div>
          )}

          {/* Gradient fade to body */}
          <div className="hero-story__fade absolute inset-y-0 right-0 w-12" />
        </div>

        {/* Right: Article info */}
        <div className="hero-story-body flex flex-col justify-between" style={{ padding: '28px 28px 24px' }}>
          {/* Category + Difficulty */}
          <div>
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-500 dark:text-amber-400 flex items-center gap-1.5">
                <Zap size={10} /> {article.category}
              </span>
              <span className="text-slate-400 dark:text-slate-700">·</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${diff.text} ${diff.bg} ${diff.border}`}>
                {article.difficulty}
              </span>
            </div>

            {/* Title */}
            <h2 className="hero-story__title font-heading text-2xl sm:text-3xl font-extrabold leading-tight mb-3 transition-colors">
              {article.title}
            </h2>

            {/* Excerpt */}
            <p className="hero-story__excerpt leading-relaxed line-clamp-3 text-sm sm:text-base">
              {article.excerpt}
            </p>

            {/* Tags */}
            {article.tags?.slice(0, 3).length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-4">
                {article.tags.slice(0, 3).map(tag => (
                  <span key={tag} className="hero-story__tag text-[10px] px-2 py-0.5 rounded-md">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="hero-story__footer flex items-center justify-between gap-4 mt-6 pt-5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-slate-300 dark:border-slate-700">
                <img src={sitePath('logo.jpg')} alt="IlluminAIst" className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="hero-story__author text-xs font-bold">IlluminAIst</p>
                <p className="hero-story__meta text-xs flex items-center gap-1">
                  <Clock3 size={10} /> {article.readingTime} min read
                </p>
              </div>
            </div>

            <motion.div whileHover={{ x: 3 }}>
              <Link
                to={`/articles/${article.slug}`}
                className="hero-story__cta flex items-center gap-2 text-sm font-bold text-amber-600 dark:text-amber-400 hover:text-amber-500 dark:hover:text-amber-300 transition-colors group"
              >
                Read story
                <span className="w-7 h-7 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center group-hover:bg-amber-500/20 transition-colors">
                  <ArrowUpRight size={14} />
                </span>
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Animated glow border */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 rounded-xl pointer-events-none"
              style={{ boxShadow: 'inset 0 0 0 1px rgba(0,240,255,0.2), 0 0 60px rgba(0,240,255,0.05)' }}
            />
          )}
        </AnimatePresence>
      </article>
    </motion.div>
  )
}
