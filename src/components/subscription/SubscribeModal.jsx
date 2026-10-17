import { useState } from 'react'
import { X, Mail, CheckCircle, Loader2, Sparkles, Building2, Bell } from 'lucide-react'
import { useSubscription } from '../../hooks/useSubscription'
import { isCompanyEmail } from '../../utils/companyEmail'
import { motion, AnimatePresence } from 'framer-motion'

export default function SubscribeModal({ open, onClose }) {
  const [email, setEmail]     = useState('')
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const { subscribe }         = useSubscription()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const result = await subscribe(email, { source: 'header_modal' })
    setLoading(false)
    if (result.success) setSuccess(true)
    else setError(result.error)
  }

  const handleClose = () => {
    setError('')
    setSuccess(false)
    setEmail('')
    onClose()
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 350, damping: 28 }}
              className="subscribe-modal pointer-events-auto w-full max-w-md rounded-2xl overflow-hidden bg-white dark:bg-[#0E1626] border border-slate-200 dark:border-white/10 shadow-[0_30px_80px_rgba(0,0,0,0.4)]"
            >
              {/* Top accent bar */}
              <div className="h-1 w-full bg-gradient-to-r from-[#e66b2c] via-[#FFB800] to-[#00F0FF]" />

              {/* Header */}
              <div className="flex items-start justify-between p-6 pb-2">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400"
                    >
                      <Bell size={13} />
                    </div>
                    <span className="text-amber-600 dark:text-amber-400 text-[10px] font-black uppercase tracking-widest">
                      Engineering Dispatch &amp; Alerts
                    </span>
                  </div>
                  <h2 className="subscribe-modal__heading font-heading text-2xl font-extrabold text-slate-900 dark:text-slate-100 leading-snug">
                    Stay at the AI<br />Frontier 🚀
                  </h2>
                </div>
                <button
                  onClick={handleClose}
                  className="w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-all mt-0.5"
                >
                  <X size={15} />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 pt-2">
                {success ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-4"
                  >
                    <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4 text-emerald-500">
                      <CheckCircle size={30} />
                    </div>
                    <p className="text-slate-900 dark:text-slate-100 font-bold text-xl mb-1">You're Subscribed! 🎉</p>
                    <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 leading-relaxed">
                      Instant alerts are now active for every new article, free eBook release, and AI news posting.
                    </p>
                    <button
                      onClick={handleClose}
                      className="w-full py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-sm font-semibold hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-all"
                    >
                      Back to Browsing
                    </button>
                  </motion.div>
                ) : (
                  <>
                    <p className="subscribe-modal__sub text-slate-600 dark:text-slate-400 text-xs sm:text-sm mb-4 leading-relaxed">
                      Receive immediate alerts for each new technical article, research eBook release, and breaking AI news item. Free forever.
                    </p>

                    <div className="mb-4 p-3 rounded-xl bg-amber-500/5 dark:bg-amber-400/5 border border-amber-500/15 text-xs text-slate-600 dark:text-slate-400 flex items-center gap-2">
                      <Building2 size={16} className="text-amber-500 shrink-0" />
                      <span>Use your <strong>company/work email</strong> to automatically unlock all eBook PDF downloads.</span>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-3">
                      <input
                        id="modal-email"
                        type="email"
                        placeholder="name@company.com"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="w-full rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 bg-white dark:bg-white/5 border border-slate-300 dark:border-white/10 focus:outline-none focus:border-amber-500 transition-all"
                        required
                      />
                      {error && <p className="text-red-500 text-xs">{error}</p>}
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2.5 rounded-xl text-sm font-bold text-slate-950 flex items-center justify-center gap-2 transition-all hover:opacity-95 disabled:opacity-60 shadow-md shadow-amber-500/20"
                        style={{ background: 'linear-gradient(135deg, #e66b2c, #FFB800)' }}
                      >
                        {loading
                          ? <><Loader2 size={14} className="animate-spin" /> Enrolling…</>
                          : <><Sparkles size={14} /> Subscribe &amp; Enable Alerts</>
                        }
                      </button>
                    </form>
                    <p className="text-slate-500 dark:text-slate-500 text-[11px] mt-3 text-center">
                      No spam. Unsubscribe anytime. Alerts dispatched for each posting.
                    </p>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
