import { useState } from 'react'
import { X, Mail, CheckCircle, Loader2 } from 'lucide-react'
import { useSubscription } from '../../hooks/useSubscription'

export default function SubscribeModal({ open, onClose }) {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const { subscribe } = useSubscription()

  if (!open) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const result = await subscribe(email)
    setLoading(false)
    if (result.success) {
      setSuccess(true)
    } else {
      setError(result.error)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:justify-end p-4 sm:p-6 pointer-events-none">
      <div className="pointer-events-auto w-full max-w-sm glass-card rounded-2xl border border-cyan/20 shadow-2xl shadow-cyan/10 animate-slide-in-up sm:animate-slide-in-right">
        {/* Header */}
        <div className="flex items-start justify-between p-6 pb-0">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-6 h-6 rounded bg-gradient-to-br from-cyan to-cyan-700 flex items-center justify-center">
                <Mail size={12} className="text-obsidian" />
              </div>
              <span className="text-cyan text-xs font-semibold uppercase tracking-widest">Free Newsletter</span>
            </div>
            <h2 className="font-heading text-xl font-bold text-slate-100">Stay at the AI Frontier</h2>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-200 transition-colors mt-1">
            <X size={18} />
          </button>
        </div>

        <div className="p-6">
          {success ? (
            <div className="text-center py-4">
              <CheckCircle size={40} className="text-cyan mx-auto mb-3" />
              <p className="text-slate-200 font-semibold mb-1">You're in!</p>
              <p className="text-slate-400 text-sm">Welcome to the IlluminAIst community. Check your inbox for a welcome email.</p>
              <button onClick={onClose} className="btn-ghost mt-4 text-sm w-full">Close</button>
            </div>
          ) : (
            <>
              <p className="text-slate-400 text-sm mb-5">
                Weekly deep-dives on LLMs, RAG, MLOps, and agentic AI — written for engineers. Free forever.
              </p>
              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan/60 focus:ring-1 focus:ring-cyan/30 transition-all"
                  required
                />
                {error && <p className="text-red-400 text-xs">{error}</p>}
                <button type="submit" disabled={loading} className="btn-cyan w-full text-sm flex items-center justify-center gap-2">
                  {loading ? <><Loader2 size={14} className="animate-spin" /> Subscribing…</> : 'Get Free Access'}
                </button>
              </form>
              <p className="text-slate-600 text-[11px] mt-3 text-center">No spam. Unsubscribe anytime.</p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
