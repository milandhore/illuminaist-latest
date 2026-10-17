import { useState } from 'react'
import { Mail, CheckCircle, Loader2, Sparkles, Zap, Shield, Users, Building2 } from 'lucide-react'
import { useSubscription } from '../../hooks/useSubscription'
import { isCompanyEmail } from '../../utils/companyEmail'

const PERKS = [
  { icon: <Zap size={13} />,     text: 'Real-time content alerts' },
  { icon: <Sparkles size={13} />, text: 'Free eBooks & guides' },
  { icon: <Shield size={13} />,  text: 'Company email verified' },
  { icon: <Users size={13} />,   text: '10k+ engineers' },
]

export default function InlineSubscribe({
  title    = 'Stay ahead of the AI curve.',
  subtitle = 'Deep technical articles, breaking AI news, and free guides — with real-time dispatch alerts for every new posting.',
}) {
  const [email, setEmail]     = useState('')
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const { isSubscribed, subscribe } = useSubscription()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const result = await subscribe(email, { source: 'inline_subscribe' })
    setLoading(false)
    if (result.success) setSuccess(true)
    else setError(result.error)
  }

  if (isSubscribed || success) {
    return (
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f1525] p-10 text-center shadow-md">
        <div className="w-14 h-14 rounded-full bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center mx-auto mb-4">
          <CheckCircle size={28} className="text-emerald-500 dark:text-emerald-400" />
        </div>
        <p className="font-heading text-2xl font-extrabold text-slate-900 dark:text-slate-100 mb-2">You're in! 🎉</p>
        <p className="text-slate-600 dark:text-slate-400 text-sm max-w-md mx-auto leading-relaxed">
          Welcome to IlluminAIst. You are registered to receive instant alerts whenever an article, eBook, or breaking news item is posted.
        </p>
      </div>
    )
  }

  return (
    <div
      className="subscribe-inline relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/40 shadow-sm"
    >
      {/* Ambient glows */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #FFB800, transparent 70%)', filter: 'blur(40px)' }} />
        <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full opacity-8"
          style={{ background: 'radial-gradient(circle, #00F0FF, transparent 70%)', filter: 'blur(50px)' }} />
      </div>

      {/* Top glow line */}
      <div className="h-px w-full" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,184,0,0.5), rgba(0,240,255,0.3), transparent)' }} />

      <div className="relative p-8 md:p-12">
        <div className="max-w-2xl mx-auto text-center">
          {/* Icon */}
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-6"
            style={{ background: 'linear-gradient(135deg, rgba(230,107,44,0.2), rgba(255,184,0,0.15))', border: '1px solid rgba(255,184,0,0.3)', boxShadow: '0 0 30px rgba(230,107,44,0.15)' }}
          >
            <Mail size={22} className="text-amber-500 dark:text-amber-400" />
          </div>

          {/* Heading */}
          <h2 className="subscribe-inline__heading font-heading text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-slate-100 mb-3 leading-tight">
            {title}
          </h2>
          <p className="subscribe-inline__sub text-slate-600 dark:text-slate-400 text-base leading-relaxed mb-8 max-w-lg mx-auto">{subtitle}</p>

          {/* Perks row */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {PERKS.map(p => (
              <span key={p.text} className="subscribe-inline__perk flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-400 bg-slate-100/80 dark:bg-white/5 px-3 py-1.5 rounded-full border border-slate-200/60 dark:border-white/5">
                <span className="text-amber-500 dark:text-amber-400">{p.icon}</span>
                {p.text}
              </span>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              id="newsletter-email"
              type="email"
              placeholder="name@company.com (for eBooks & alerts)"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="subscribe-input flex-1 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 bg-white dark:bg-white/5 border border-slate-300 dark:border-white/10 focus:outline-none focus:border-amber-500 transition-all duration-200"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-slate-950 whitespace-nowrap transition-all duration-200 hover:opacity-95 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed shadow-md"
              style={{
                background: 'linear-gradient(135deg, #e66b2c, #FFB800)',
                boxShadow: '0 4px 20px rgba(230,107,44,0.4)',
              }}
            >
              {loading ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
              Subscribe Free
            </button>
          </form>

          {error && (
            <p className="text-red-500 dark:text-red-400 text-xs mt-3 flex items-center justify-center gap-1">
              {error}
            </p>
          )}
          <p className="text-slate-500 dark:text-slate-500 text-xs mt-4">
            No spam. Work emails unlock instant eBook downloads. Alerts dispatched on each new posting.
          </p>
        </div>
      </div>
    </div>
  )
}
