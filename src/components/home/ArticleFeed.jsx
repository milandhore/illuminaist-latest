import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import ArticleCard from '../articles/ArticleCard'

const TOPIC_FILTERS = [
  { label: 'All', category: 'All' },
  { label: 'AI & LLMs', category: 'AI & LLMs' },
  { label: 'RAG & Agents', category: 'RAG & Agents' },
  { label: 'Cloud & DevOps', category: 'Cloud & DevOps' },
  { label: 'Emerging Tech', category: 'Emerging Tech' },
]

export default function ArticleFeed({ articles }) {
  return (
    <section>
      <div className="section-header"><div><div className="eyebrow">Knowledge base</div><h2 className="section-title">Latest articles</h2></div><Link to="/articles" className="section-link">Browse all <ArrowRight size={14} /></Link></div>
      <div className="topic-pills mb-6">{TOPIC_FILTERS.map(({ label, category }) => <Link key={category} to={category === 'All' ? '/articles' : `/articles?topic=${encodeURIComponent(category)}`} className="topic-pill">{label}</Link>)}</div>
      {articles.length === 0 ? <p className="text-slate-500 text-center py-16">No articles yet — check back soon.</p> : <div className="grid grid-cols-1 md:grid-cols-2 gap-5">{articles.map(article => <ArticleCard key={article.slug} article={article} />)}</div>}
    </section>
  )
}
