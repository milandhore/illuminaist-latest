import { TrendingUp } from 'lucide-react'

const ITEMS = [
  '🔥 GPT-4o vs Claude 3.5 — Architecture Teardown',
  '⚡ MCP Protocol: The New Standard for Tool Calling',
  '🚀 RAG Pipelines in Production — Complete Guide',
  '🤖 AutoGen Multi-Agent Systems Deep Dive',
  '📊 LLM Benchmarks: MMLU, HumanEval, and Beyond',
  '☁️ Deploying LLMs on Kubernetes with vLLM',
  '🔬 AlphaFold 3.5 — What It Means for Drug Discovery',
  '🛡️ EU AI Act: Compliance Checklist for Engineers',
]

export default function TrendingTicker() {
  const doubled = [...ITEMS, ...ITEMS]

  return (
    <div className="trending-strip flex items-center gap-0 bg-white border border-slate-200 rounded-md overflow-hidden">
      {/* Label */}
      <div className="flex-shrink-0 flex items-center gap-2 px-4 py-3 bg-brand-soft border-r border-slate-200">
        <TrendingUp size={14} className="text-brand" />
        <span className="text-brand text-xs font-semibold uppercase tracking-widest whitespace-nowrap">Trending</span>
      </div>

      {/* Scrolling ticker */}
      <div className="ticker-wrapper flex-1 py-3">
        <div className="ticker-content">
          {doubled.map((item, i) => (
            <span key={i} className="text-slate-500 text-sm mx-8 hover:text-brand transition-colors cursor-default">
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
