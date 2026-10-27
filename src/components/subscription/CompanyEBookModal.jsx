import { useState } from 'react'
import { X, Lock, CheckCircle2, AlertCircle, Download, Building2, Sparkles, Loader2, ArrowRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSubscription } from '../../hooks/useSubscription'
import { validateCompanyEmail } from '../../utils/companyEmail'

export default function CompanyEBookModal({ open, onClose, selectedEbook, onUnlocked }) {
  const [email, setEmail]       = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)
  const [success, setSuccess]   = useState(false)
  const { subscribe }           = useSubscription()

  const handleEmailChange = (val) => {
    setEmail(val)
    if (error) setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const check = validateCompanyEmail(email)
    if (!check.valid) {
      setError(check.error)
      return
    }

    setLoading(true)
    const result = await subscribe(email, {
      requireCompany: true,
      source: `ebook_${selectedEbook?.slug || 'generic'}`
    })
    setLoading(false)

    if (result.success) {
      setSuccess(true)
      if (onUnlocked) onUnlocked(result.email)

      // Automatically trigger download
      if (selectedEbook?.downloadUrl) {
        const link = document.createElement('a')
        link.href = selectedEbook.downloadUrl
        link.download = `${selectedEbook.slug || 'ebook'}.pdf`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
    } else {
      setError(result.error || 'Failed to verify email. Please try again.')
    }
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
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md"
            onClick={handleClose}
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 20 }}
              transition={{ type: 'spring', damping: 26, stiffness: 300 }}
              className="pointer-events-auto w-full max-w-lg rounded-2xl overflow-hidden bg-white dark:bg-[#0E1626] border border-slate-200 dark:border-white/10 shadow-[0_25px_80px_rgba(0,0,0,0.4)]"
            >
              {/* Header Gradient Stripe */}
              <div className="h-1.5 w-full bg-gradient-to-r from-amber-500 via-orange-500 to-cyan-400" />

              {/* Close Button */}
              <div className="flex items-center justify-between px-6 pt-5 pb-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center gap-1">
                    <Building2 size={11} /> Enterprise Research Gating
                  </span>
                </div>
                <button
                  onClick={handleClose}
                  className="w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-all"
                >
                  <X size={15} />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 pt-2">
                {success ? (
                  <div className="text-center py-4">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4 text-emerald-500">
                      <CheckCircle2 size={36} />
                    </div>
                    <h3 className="font-heading text-2xl font-extrabold text-slate-900 dark:text-slate-100 mb-2">
                      Company Verified! 🎉
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 max-w-sm mx-auto leading-relaxed">
                      Your download of <strong className="text-slate-900 dark:text-slate-200">{selectedEbook?.title}</strong> has started automatically.
                    </p>
                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 text-left text-xs space-y-1.5 mb-6 text-slate-600 dark:text-slate-400">
                      <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold">
                        <CheckCircle2 size={13} /> All technical eBooks unlocked permanently
                      </div>
                      <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-semibold">
                        <Sparkles size={13} /> Instant subscriber alerts active for all new articles, eBooks &amp; news
                      </div>
                    </div>
                    <button
                      onClick={handleClose}
                      className="w-full py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 hover:opacity-95 transition-all shadow-md"
                    >
                      Continue Exploring
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Selected Ebook Preview */}
                    {selectedEbook && (
                      <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/5 flex items-center gap-3.5 mb-5">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 flex items-center justify-center text-2xl shrink-0">
                          {selectedEbook.icon || '📚'}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs uppercase font-bold text-amber-600 dark:text-amber-400 tracking-wider">
                            Free Engineering Guide • {selectedEbook.pages} Pages
                          </p>
                          <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                            {selectedEbook.title}
                          </h4>
                        </div>
                      </div>
                    )}

                    <h3 className="font-heading text-xl font-extrabold text-slate-900 dark:text-slate-100 mb-2 leading-snug">
                      Download with Your Work Email 🏢
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-5 leading-relaxed">
                      IlluminAIst engineering handbooks are exclusively available to verified business and engineering teams.
                      Enter your corporate/company email address to unlock instant PDF access.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                          Work / Company Email Address
                        </label>
                        <div className="relative">
                          <input
                            type="email"
                            placeholder="you@company.com"
                            value={email}
                            onChange={(e) => handleEmailChange(e.target.value)}
                            required
                            className="w-full px-4 py-3 rounded-xl text-sm bg-white dark:bg-slate-900/80 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
                          />
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 flex items-center gap-1">
                          🔒 Personal webmail (@gmail, @yahoo, @outlook, etc.) is not accepted.
                        </p>
                      </div>

                      {error && (
                        <motion.div
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs flex items-start gap-2 leading-relaxed"
                        >
                          <AlertCircle size={15} className="shrink-0 mt-0.5" />
                          <span>{error}</span>
                        </motion.div>
                      )}

                      <div className="pt-1">
                        <button
                          type="submit"
                          disabled={loading}
                          className="w-full py-3.5 rounded-xl font-bold text-sm text-slate-950 flex items-center justify-center gap-2 transition-all hover:opacity-95 disabled:opacity-60 shadow-lg shadow-amber-500/20"
                          style={{
                            background: 'linear-gradient(135deg, #e66b2c, #FFB800)',
                          }}
                        >
                          {loading ? (
                            <>
                              <Loader2 size={16} className="animate-spin" /> Verifying Company Domain…
                            </>
                          ) : (
                            <>
                              <Download size={16} /> Verify &amp; Download Free PDF
                            </>
                          )}
                        </button>
                      </div>

                      <div className="text-center pt-2">
                        <p className="text-[11px] text-slate-500 dark:text-slate-500 leading-normal">
                          By subscribing with your company email, you will also receive automatic alerts for each new technical article, free eBook, and breaking AI news. Unsubscribe anytime.
                        </p>
                      </div>
                    </form>
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
