import { useState } from 'react'
import { Download, BookOpen, Lock, CheckCircle2, Building2, Sparkles, ShieldCheck } from 'lucide-react'
import AdBanner from '../components/ads/AdBanner'
import InlineSubscribe from '../components/subscription/InlineSubscribe'
import CompanyEBookModal from '../components/subscription/CompanyEBookModal'
import { ebooks } from '../data/ebooks'
import { useSubscription } from '../hooks/useSubscription'

export default function EBooksPage() {
  const { isCompanySubscribed, email, companyDomain } = useSubscription()
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedBook, setSelectedBook] = useState(null)

  const handleDownloadClick = (e, book) => {
    if (!isCompanySubscribed) {
      e.preventDefault()
      setSelectedBook(book)
      setModalOpen(true)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Top Hero */}
      <div className="mb-10 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 mb-4">
          <Building2 size={13} /> Enterprise Engineering Handbooks
        </div>
        <h1 className="font-heading text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-slate-100 mb-4 tracking-tight">
          Free Engineering eBooks &amp; Guides
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg leading-relaxed">
          Comprehensive, production-tested architectures and playbooks.
          Free for engineers with a valid company email subscription.
        </p>

        {/* Company verification status badge */}
        <div className="mt-4 flex justify-center">
          {isCompanySubscribed ? (
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
              <ShieldCheck size={15} /> Company Verified ({companyDomain || email}) • All eBooks Unlocked
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 text-xs font-semibold">
              <Lock size={13} className="text-amber-500" /> Downloads strictly gated behind valid corporate email IDs
            </div>
          )}
        </div>
      </div>

      <AdBanner slot="header" className="mb-10" />

      {/* eBook Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {ebooks.map(book => (
          <div
            key={book.id}
            className="group rounded-2xl overflow-hidden bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 hover:border-amber-500/40 dark:hover:border-amber-400/30 transition-all duration-300 shadow-sm hover:shadow-xl flex flex-col"
          >
            {/* Cover header */}
            <div className={`relative h-52 bg-gradient-to-br ${book.coverGradient} flex items-center justify-center p-6 text-center overflow-hidden`}>
              <div className="text-6xl drop-shadow-md transform group-hover:scale-105 transition-transform duration-300">
                {book.icon}
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

              {/* Badges on cover */}
              <div className="absolute top-4 left-4">
                <span className="px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest bg-black/50 text-white backdrop-blur-md border border-white/10">
                  {book.pages} Pages
                </span>
              </div>
              <div className="absolute top-4 right-4">
                {isCompanySubscribed ? (
                  <span className="px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest bg-emerald-500/80 text-white backdrop-blur-md flex items-center gap-1">
                    <CheckCircle2 size={11} /> Unlocked
                  </span>
                ) : (
                  <span className="px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest bg-amber-500/80 text-slate-950 backdrop-blur-md flex items-center gap-1 font-bold">
                    <Lock size={10} /> Work Email
                  </span>
                )}
              </div>

              <div className="absolute bottom-4 left-6 right-6 text-left">
                <p className="text-white/80 text-xs font-semibold uppercase tracking-wider">{book.subtitle}</p>
              </div>
            </div>

            {/* Body */}
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <h2 className="font-heading text-xl font-bold text-slate-900 dark:text-slate-100 mb-1.5 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                  {book.title}
                </h2>
                <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold mb-3">{book.subtitle}</p>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-6">
                  {book.description}
                </p>

                {/* Topics pills */}
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {book.topics.map(topic => (
                    <span
                      key={topic}
                      className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700 font-medium"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>

              {/* Download or Unlock Button */}
              <div>
                {isCompanySubscribed ? (
                  <a
                    href={book.downloadUrl}
                    download={`${book.slug}.pdf`}
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-bold text-sm text-slate-950 transition-all hover:opacity-95 shadow-md shadow-amber-500/20"
                    style={{ background: 'linear-gradient(135deg, #e66b2c, #FFB800)' }}
                  >
                    <Download size={16} /> Download Free PDF (Company Verified ✓)
                  </a>
                ) : (
                  <button
                    onClick={(e) => handleDownloadClick(e, book)}
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-bold text-sm text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 hover:border-amber-500 dark:hover:border-amber-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-all cursor-pointer"
                  >
                    <Lock size={15} className="text-amber-500" /> Download PDF (Company Email Required)
                  </button>
                )}
                <p className="text-[11px] text-center text-slate-500 dark:text-slate-500 mt-2">
                  {isCompanySubscribed
                    ? 'Instant direct download. PDF ready.'
                    : 'Personal emails (Gmail, Yahoo, etc.) are excluded.'}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom callout */}
      {!isCompanySubscribed && (
        <InlineSubscribe
          title="Unlock All Engineering eBooks."
          subtitle="Corporate email verification grants unrestricted access to all current and future engineering handbooks, plus real-time dispatch alerts on every new article and news release."
        />
      )}

      {/* Modal for Gated Downloads */}
      <CompanyEBookModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        selectedEbook={selectedBook}
      />
    </div>
  )
}
