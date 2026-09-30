import { useState } from 'react'
import { Mail, CheckCircle, Loader2 } from 'lucide-react'
import { useSubscription } from '../../hooks/useSubscription'

export default function InlineSubscribe({ title = 'Get the weekly AI dispatch — free.', subtitle = 'Deep technical articles, breaking AI news, and free guides for engineers.' }) {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { isSubscribed, subscribe } = useSubscription()
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const result = await subscribe(email)
    setLoading(false)
    if (result.success) setSuccess(true)
    else setError(result.error)
  }

  if (isSubscribed || success) {
    return (
      <div className="glass-card rounded-2xl border border-cyan/20 p-8 text-center">
        <CheckCircle size={36} className="text-cyan mx-auto mb-3" />
        <p className="font-heading text-xl font-bold text-slate-100 mb-2">You're subscribed!</p>
        <p className="text-slate-400 text-sm">Thanks for joining the IlluminAIst community.</p>
      </div>
    )
  }

  return (
    <div className="relative overflow-hidden glass-card rounded-2xl border border-cyan/15 p-8 md:p-12">
      <div className="absolute inset-0 bg-gradient-to-br from-cyan/5 via-transparent to-amber/5 pointer-events-none" />
      <div className="relative text-center max-w-lg mx-auto">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan to-cyan-700 flex items-center justify-center mx-auto mb-5 shadow-[0_0_25px_rgba(0,240,255,0.4)]">
          <Mail size={22} className="text-obsidian" />
        </div>
        <h2 className="font-heading text-2xl md:text-3xl font-bold text-slate-100 mb-3">{title}</h2>
        <p className="text-slate-400 mb-8">{subtitle}</p>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan/60 transition-all"
            required
          />
          <button type="submit" disabled={loading} className="btn-cyan flex items-center justify-center gap-2 whitespace-nowrap">
            {loading ? <Loader2 size={14} className="animate-spin" /> : null}
            Subscribe Free
          </button>
        </form>
        {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
        <p className="text-slate-600 text-xs mt-4">No spam. Unsubscribe anytime.</p>
      </div>
    </div>
  )
}
