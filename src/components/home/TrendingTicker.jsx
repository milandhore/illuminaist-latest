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
    <div className="flex items-center gap-0 bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden">
      {/* Label */}
      <div className="flex-shrink-0 flex items-center gap-2 px-4 py-3 bg-cyan/10 border-r border-slate-800">
        <TrendingUp size={14} className="text-cyan" />
        <span className="text-cyan text-xs font-semibold uppercase tracking-widest whitespace-nowrap">Trending</span>
      </div>

      {/* Scrolling ticker */}
      <div className="ticker-wrapper flex-1 py-3">
        <div className="ticker-content">
          {doubled.map((item, i) => (
            <span key={i} className="text-slate-400 text-sm mx-8 hover:text-cyan transition-colors cursor-default">
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
