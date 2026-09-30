import { Download, BookOpen, Lock } from 'lucide-react'
import AdBanner from '../components/ads/AdBanner'
import InlineSubscribe from '../components/subscription/InlineSubscribe'
import { ebooks } from '../data/ebooks'
import { useSubscription } from '../hooks/useSubscription'

export default function EBooksPage() {
  const { isSubscribed } = useSubscription()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10 text-center">
        <h1 className="font-heading text-4xl font-bold gradient-text-mixed mb-3">Free eBooks</h1>
        <p className="text-slate-400 text-lg max-w-xl mx-auto">
          Practical engineering guides — free for IlluminAIst subscribers.
          {!isSubscribed && <span className="text-cyan"> Subscribe to unlock downloads.</span>}
        </p>
      </div>

      <AdBanner slot="header" className="mb-10" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {ebooks.map(book => (
          <div key={book.id} className="glass-card rounded-2xl overflow-hidden border border-slate-800 hover:border-cyan/20 transition-all duration-300 group">
            {/* Cover */}
            <div className={`relative h-48 bg-gradient-to-br ${book.coverGradient} flex items-center justify-center`}>
              <div className="text-6xl">{book.icon}</div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-6">
                <p className="text-white/60 text-xs uppercase tracking-widest font-semibold">{book.pages} Pages</p>
              </div>
            </div>

            <div className="p-6">
              <h2 className="font-heading text-xl font-bold text-slate-100 mb-1">{book.title}</h2>
              <p className="text-slate-500 text-sm mb-4">{book.subtitle}</p>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">{book.description}</p>

              {/* Topics */}
              <div className="flex flex-wrap gap-2 mb-6">
                {book.topics.map(topic => (
                  <span key={topic} className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                    {topic}
                  </span>
                ))}
              </div>

              {/* Download button */}
              {isSubscribed ? (
                <a href={book.downloadUrl} className="btn-cyan flex items-center justify-center gap-2 w-full text-sm">
                  <Download size={16} /> Download Free PDF
                </a>
              ) : (
                <button className="btn-ghost flex items-center justify-center gap-2 w-full text-sm cursor-pointer">
                  <Lock size={16} /> Subscribe to Download
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {!isSubscribed && (
        <InlineSubscribe
          title="Unlock all eBooks — free."
          subtitle="Subscribe to get instant access to all engineering guides, plus the weekly AI dispatch."
        />
      )}
    </div>
  )
}
