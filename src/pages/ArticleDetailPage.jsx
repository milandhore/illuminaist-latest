import { useParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { getArticleBySlug } from '../data/articles'
import ArticleReader from '../components/articles/ArticleReader'

/**
 * Builds the fetch URL for an HTML article.
 * - If article has topicSlug: public/articles/{topicSlug}/{slug}.html
 * - Legacy (no topicSlug):   public/articles/{slug}.html
 */
function getArticleHtmlPath(article) {
  const base = article.topicSlug
    ? `/articles/${article.topicSlug}/${article.slug}.html`
    : `/articles/${article.slug}.html`
  return base
}

export default function ArticleDetailPage() {
  const { slug } = useParams()
  const article = getArticleBySlug(slug)
  const [htmlContent, setHtmlContent] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!article?.htmlFile) return

    setLoading(true)
    setError(null)
    setHtmlContent(null)

    fetch(getArticleHtmlPath(article))
      .then(res => {
        if (!res.ok) throw new Error(`Could not load article file (${res.status}). Make sure the file exists in public/articles/${article.topicSlug || ''}/`)
        return res.text()
      })
      .then(html => {
        // Extract only the <body> content so our layout wraps around it
        const match = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i)
        setHtmlContent(match ? match[1].trim() : html)
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [article])

  if (!article) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <h1 className="font-heading text-4xl font-bold text-slate-100 mb-4">Article Not Found</h1>
        <p className="text-slate-400 mb-8">
          The article you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/articles" className="btn-cyan">Browse All Articles</Link>
      </div>
    )
  }

  const resolvedContent = article.htmlFile
    ? loading
      ? '<p style="color:#94A3B8;padding:2rem 0">Loading article…</p>'
      : error
        ? `<div style="color:#f87171;padding:2rem;border:1px dashed #f87171;border-radius:8px"><strong>⚠️ Could not load article</strong><br/><br/>${error}</div>`
        : (htmlContent ?? '')
    : article.content

  return <ArticleReader article={{ ...article, content: resolvedContent }} />
}
