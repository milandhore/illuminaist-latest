import InlineSubscribe from '../components/subscription/InlineSubscribe'

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <header className="mb-12 text-center">
        <h1 className="font-heading text-5xl font-bold gradient-text-mixed mb-5">About IlluminAIst</h1>
        <p className="text-slate-400 text-xl leading-relaxed">
          An independent AI & emerging technology publication for engineers, researchers, and founders navigating the frontier.
        </p>
      </header>

      <div className="article-prose space-y-8 mb-16">
        <h2>Our Mission</h2>
        <p>IlluminAIst exists to cut through the AI hype and deliver <strong>deep, technically accurate content</strong> that actually helps engineers build better systems. We cover LLMs, RAG pipelines, MLOps, agentic AI, and the broader technology landscape — with an emphasis on practical, production-grade knowledge.</p>

        <h2>What We Publish</h2>
        <ul>
          <li><strong>Deep-dive articles</strong> — 10–20 minute reads with code examples, benchmarks, and architecture teardowns</li>
          <li><strong>Breaking AI news</strong> — curated from primary sources (research papers, company blogs, regulatory filings)</li>
          <li><strong>Free engineering guides</strong> — downloadable eBooks covering RAG, MLOps, and more</li>
          <li><strong>Weekly newsletter</strong> — a curated digest of the week's most important AI developments</li>
        </ul>

        <h2>Editorial Standards</h2>
        <p>Every article on IlluminAIst is written or reviewed by practitioners with hands-on experience. We do not publish press releases, paid editorial, or affiliate-driven "best of" lists. All opinions are our own.</p>

        <h2>Advertising</h2>
        <p>IlluminAIst is supported by display advertising. We use clearly labelled ad placements that do not affect editorial decisions. If you're interested in advertising with us, <a href="mailto:ads@illuminaist.com">get in touch</a>.</p>
      </div>

      <InlineSubscribe />
    </div>
  )
}
