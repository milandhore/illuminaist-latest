import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import InlineSubscribe from '../components/subscription/InlineSubscribe'
import PageAdLayout from '../components/ads/PageAdLayout'

export default function AboutPage() {
  return (
    <PageAdLayout>
      <header className="mb-12 text-center">
        <h1 className="font-heading text-5xl font-bold gradient-text-mixed mb-5">About IlluminAIst</h1>
        <p className="text-slate-400 text-xl leading-relaxed">
          Illuminating the Frontier of Intelligent Systems
        </p>
      </header>

      <div className="article-prose space-y-8 mb-16">
        <p>We are living through the most rapid technological acceleration in human history. Foundation models, autonomous agent networks, multimodal reasoning, and quantum architectures are reshaping industries overnight.</p>

        <p>Yet, as the pace of development quickens, the signal-to-noise ratio has never been lower.</p>

        <p><strong>IlluminAIst</strong> was founded to cut through the marketing hype and illuminate the engineering realities, architectural paradigms, and strategic impacts of frontier artificial intelligence and emerging technologies.</p>

        <p>It is an independent publication and a hands-on product build, created to keep the focus on practical ideas, clear reasoning, and useful engineering work.</p>

        <h2>Our Mission</h2>
        <p>To equip engineers, architects, researchers, and technology leaders with the technical depth and strategic clarity required to build, govern, and scale the next generation of intelligent systems.</p>

        <h2>What We Cover</h2>
        <ul>
          <li><strong>Autonomous Agents &amp; Orchestration:</strong> Stateful workflows, multi-agent coordination frameworks (LangGraph, AutoGen), tool-use standards, and the Model Context Protocol (MCP).</li>
          <li><strong>Frontier Models &amp; Efficient Compute:</strong> Reasoning models, dynamic sampling, parameter-efficient fine-tuning (PEFT), alignment methodologies (RLHF, DPO), and inference optimization at the silicon level.</li>
          <li><strong>Production Data &amp; Knowledge Retrieval:</strong> Advanced Retrieval-Augmented Generation (RAG), vector graph indexing, hybrid search architectures, and automated evaluation frameworks (RAGAS).</li>
          <li><strong>Emerging &amp; Frontier Tech:</strong> Neuromorphic computing, quantum algorithms, robotics and embodied AI, edge intelligence, and distributed cloud topologies.</li>
          <li><strong>AI Safety, Governance &amp; Alignment:</strong> Red-teaming protocols, deterministic agent guardrails, data sovereignty, and ethical deployment standards.</li>
        </ul>

        <h2>Our Editorial Philosophy</h2>
        <ul>
          <li><strong>Code and Architecture Over Hype:</strong> We analyze systems at the schema, pipeline, and benchmark level—not press release claims.</li>
          <li><strong>Builder-Centric Insights:</strong> Every analysis is grounded in practical feasibility, deployment trade-offs, and latency/cost economics.</li>
          <li><strong>Independent &amp; Open:</strong> We foster rigorous debate and champion open standards, transparent benchmarks, and reproducible research.</li>
        </ul>

        <h2>Join the Community</h2>
        <p>Whether you are designing production AI infrastructure, leading an enterprise transformation, or tracking the future of compute, IlluminAIst is your compass.</p>
        <ul>
          <li><Link to="/articles">Explore our publications</Link></li>
          <li>Join our community discussions on LinkedIn and Discord</li>
          <li><Link to="/subscribe">Subscribe to our weekly dispatch</Link></li>
        </ul>
      </div>

      <div className="mb-16 pt-6 border-t border-slate-200 dark:border-slate-800/70 flex items-center justify-center sm:justify-end gap-3">
        <div className="hidden sm:block w-px h-10 bg-gradient-to-b from-transparent via-amber-400/70 to-transparent" />
        <div className="text-left">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-600 mb-1">
            Designed &amp; engineered by
          </p>
          <a
            href="https://www.milanoutlook.com/"
            target="_blank"
            rel="noreferrer"
            aria-label="Visit Milan Dhore's portfolio"
            className="group inline-flex items-center gap-2 text-sm font-heading font-extrabold text-slate-700 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
          >
            Milan Dhore
            <span className="rounded-full border border-slate-300 dark:border-slate-700 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-slate-500 group-hover:border-amber-500/50 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
              View portfolio
            </span>
            <ArrowUpRight size={13} className="text-amber-500 dark:text-amber-400" />
          </a>
        </div>
      </div>

      <InlineSubscribe />
    </PageAdLayout>
  )
}
