import { Link } from 'react-router-dom'

const TOPICS = [
  { name: 'AI & LLMs', count: 24, emoji: '🤖', color: 'from-cyan/20 to-cyan/5 border-cyan/20' },
  { name: 'RAG & Agents', count: 18, emoji: '🔍', color: 'from-blue-500/20 to-blue-500/5 border-blue-500/20' },
  { name: 'Cloud & DevOps', count: 15, emoji: '☁️', color: 'from-amber/20 to-amber/5 border-amber/20' },
  { name: 'MLOps', count: 12, emoji: '⚙️', color: 'from-purple-500/20 to-purple-500/5 border-purple-500/20' },
  { name: 'Emerging Tech', count: 9, emoji: '🔬', color: 'from-green-500/20 to-green-500/5 border-green-500/20' },
  { name: 'Research', count: 11, emoji: '📄', color: 'from-pink-500/20 to-pink-500/5 border-pink-500/20' },
  { name: 'Tutorials', count: 20, emoji: '📚', color: 'from-indigo-500/20 to-indigo-500/5 border-indigo-500/20' },
  { name: 'Opinion', count: 7, emoji: '💬', color: 'from-rose-500/20 to-rose-500/5 border-rose-500/20' },
]

const TAGS = ['GPT-4o', 'Claude', 'RAG', 'LangChain', 'Pinecone', 'MLOps', 'Kubernetes', 'vLLM', 'MCP', 'AutoGen', 'LangGraph', 'Llama', 'LoRA', 'RLHF', 'Transformers', 'Embeddings', 'Vector DB', 'FAISS', 'Qdrant', 'Weaviate', 'Cohere', 'Mistral', 'OpenAI', 'Anthropic', 'Hugging Face', 'PyTorch', 'TensorFlow', 'CUDA']

export default function TopicsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="font-heading text-4xl font-bold gradient-text-mixed mb-3">Topics</h1>
        <p className="text-slate-400 text-lg">Browse articles by subject area or technology tag.</p>
      </div>

      {/* Category cards */}
      <section className="mb-16">
        <h2 className="section-heading mb-6">Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {TOPICS.map(topic => (
            <Link
              key={topic.name}
              to="/articles"
              className={`glass-card bg-gradient-to-br ${topic.color} rounded-xl p-5 border hover:scale-[1.02] transition-transform duration-200 group`}
            >
              <div className="text-3xl mb-3">{topic.emoji}</div>
              <h3 className="font-heading font-bold text-slate-100 text-sm mb-1 group-hover:text-cyan transition-colors">{topic.name}</h3>
              <p className="text-slate-500 text-xs">{topic.count} articles</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Tag cloud */}
      <section>
        <h2 className="section-heading mb-6">Tag Cloud</h2>
        <div className="flex flex-wrap gap-2">
          {TAGS.map(tag => (
            <Link
              key={tag}
              to="/articles"
              className="px-3 py-1.5 rounded-full text-sm bg-slate-800 text-slate-400 border border-slate-700 hover:text-cyan hover:border-cyan/40 hover:bg-slate-700/60 transition-all duration-200"
            >
              #{tag}
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
