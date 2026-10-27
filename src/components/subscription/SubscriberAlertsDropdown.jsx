import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Bell, Sparkles, BookOpen, Newspaper, FileText, CheckCircle2, ChevronRight, Zap } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSubscription } from '../../hooks/useSubscription'

export default function SubscriberAlertsDropdown({ onSubscribeClick }) {
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef(null)
  const { isSubscribed, isCompanySubscribed, email, alerts } = useSubscription()

  useEffect(() => {
    function onOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onOutside)
    return () => document.removeEventListener('mousedown', onOutside)
  }, [])

  const getIcon = (type) => {
    switch (type) {
      case 'ebook':
        return <BookOpen size={14} className="text-cyan-500 dark:text-cyan-400" />
      case 'article':
        return <FileText size={14} className="text-amber-500 dark:text-amber-400" />
      case 'news':
        return <Zap size={14} className="text-emerald-500 dark:text-emerald-400" />
      default:
        return <Sparkles size={14} className="text-amber-500 dark:text-amber-400" />
    }
  }

  const getBadgeCls = (type) => {
    switch (type) {
      case 'ebook':
        return 'bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border-cyan-500/20'
      case 'article':
        return 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20'
      case 'news':
        return 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20'
      default:
        return 'bg-slate-500/10 text-slate-700 dark:text-slate-300 border-slate-500/20'
    }
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(o => !o)}
        aria-label="Subscriber alerts"
        className={`relative p-2 rounded-lg border transition-all duration-200 flex items-center justify-center ${
          open
            ? 'border-amber-400 bg-amber-400/10 text-amber-500 dark:text-amber-400'
            : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:border-slate-300 dark:hover:border-slate-700 bg-white/60 dark:bg-slate-900/60'
        }`}
      >
        <Bell size={16} />
        {/* Pulsing notification dot */}
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500 text-[8px] font-bold text-slate-950 items-center justify-center">
            {alerts?.length || 4}
          </span>
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.96 }}
            transition={{ duration: 0.16 }}
            className="subscriber-alerts-dropdown absolute right-0 mt-2 w-[340px] sm:w-[380px] rounded-2xl overflow-hidden z-50 bg-white dark:bg-[#0f1423] border border-slate-200 dark:border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.6)] backdrop-blur-xl"
          >
            {/* Top header */}
            <div className="px-4 py-3.5 border-b border-slate-100 dark:border-white/5 bg-slate-50/80 dark:bg-white/[0.02] flex items-center justify-between">
              <div>
                <p className="text-[11px] font-black uppercase tracking-widest text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                  <Bell size={12} /> Subscriber Alerts Dispatch
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Real-time alerts for articles, eBooks &amp; news
                </p>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live
              </span>
            </div>

            {/* Subscription status card */}
            <div className="p-3 bg-amber-500/[0.04] dark:bg-amber-400/[0.04] border-b border-slate-100 dark:border-white/5">
              {isSubscribed ? (
                <div className="flex items-start gap-2 text-xs">
                  <CheckCircle2 size={15} className="text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      Subscribed as <span className="font-mono text-amber-600 dark:text-amber-400">{email}</span>
                    </span>
                    {!isCompanySubscribed && (
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        General subscriber • Alerts active
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      Not subscribed yet
                    </span>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Enter company email to get alerts &amp; eBooks
                    </p>
                  </div>
                  <button
                    onClick={() => { setOpen(false); onSubscribeClick?.() }}
                    className="px-2.5 py-1 rounded-lg text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-500 to-amber-400 hover:opacity-90 shrink-0"
                  >
                    Subscribe
                  </button>
                </div>
              )}
            </div>

            {/* Alerts List */}
            <div className="max-h-[300px] overflow-y-auto divide-y divide-slate-100 dark:divide-white/5">
              {alerts && alerts.length > 0 ? (
                alerts.map((alert) => (
                  <Link
                    key={alert.id}
                    to={alert.url || (alert.type === 'ebook' ? '/ebooks' : alert.type === 'article' ? `/articles/${alert.slug}` : '/news')}
                    onClick={() => setOpen(false)}
                    className="block p-3.5 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group"
                  >
                    <div className="flex items-start gap-2.5">
                      <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 shrink-0 mt-0.5">
                        {getIcon(alert.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border ${getBadgeCls(alert.type)}`}>
                            {alert.type} Alert
                          </span>
                          <span className="text-[10px] text-slate-400 dark:text-slate-500">
                            {new Date(alert.timestamp || Date.now()).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors line-clamp-1">
                          {alert.title}
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5 leading-relaxed">
                          {alert.excerpt}
                        </p>
                      </div>
                      <ChevronRight size={13} className="text-slate-400 dark:text-slate-600 group-hover:text-amber-500 dark:group-hover:text-amber-400 shrink-0 mt-1" />
                    </div>
                  </Link>
                ))
              ) : (
                <div className="p-6 text-center text-xs text-slate-500">
                  No active alerts yet.
                </div>
              )}
            </div>

            {/* Bottom info */}
            <div className="p-2.5 bg-slate-50 dark:bg-black/30 border-t border-slate-100 dark:border-white/5 text-center text-[10px] text-slate-500 dark:text-slate-400 flex items-center justify-between px-3">
              <span>Automatic email dispatch enabled</span>
              <Link
                to="/ebooks"
                onClick={() => setOpen(false)}
                className="text-amber-600 dark:text-amber-400 hover:underline font-semibold"
              >
                Browse eBooks →
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
