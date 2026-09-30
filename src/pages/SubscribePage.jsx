import InlineSubscribe from '../components/subscription/InlineSubscribe'

export default function SubscribePage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h1 className="font-heading text-4xl font-bold gradient-text-mixed mb-4">Join the IlluminAIst Community</h1>
        <p className="text-slate-400 text-lg">Weekly deep-dives on LLMs, RAG, MLOps, and agentic AI — written for engineers. Always free.</p>
      </div>

      <InlineSubscribe
        title="Your weekly AI briefing."
        subtitle="Every Sunday, a handpicked digest of the week's most important AI developments, practical tutorials, and free resources."
      />

      {/* Benefits */}
      <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { emoji: '📰', title: 'Weekly Dispatch', desc: 'Curated digest of the most important AI news and research every Sunday.' },
          { emoji: '📚', title: 'Free eBooks', desc: 'Instant access to our library of practical engineering guides.' },
          { emoji: '🔔', title: 'Early Access', desc: 'Be the first to know about new deep-dive articles and content drops.' },
        ].map(b => (
          <div key={b.title} className="glass-card rounded-xl p-5 text-center border border-slate-800">
            <div className="text-3xl mb-3">{b.emoji}</div>
            <h3 className="font-heading font-bold text-slate-200 mb-2">{b.title}</h3>
            <p className="text-slate-500 text-sm">{b.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
