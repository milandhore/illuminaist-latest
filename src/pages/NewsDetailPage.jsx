import { useParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { newsItems } from '../data/news'
import AdBanner from '../components/ads/AdBanner'
import Badge from '../components/ui/Badge'
import { ArrowLeft } from 'lucide-react'

export default function NewsDetailPage() {
  const { slug } = useParams()
  // Try to find the item in news.js to get title/badge info
  const newsItem = newsItems.find(item => item.slug === slug || item.id.toString() === slug)
  
  const [htmlContent, setHtmlContent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // If we don't have a slug, we can't fetch anything
    if (!slug) return

    setLoading(true)
    setError(null)
    setHtmlContent(null)

    // The script saves HTML in /public/articles/news/{slug}.html
    fetch(`/articles/news/${slug}.html`)
      .then(res => {
        if (!res.ok) throw new Error(`Could not load news article (${res.status}).`)
        return res.text()
      })
      .then(html => {
        // Extract body content if we have a full HTML document
        const match = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i)
        setHtmlContent(match ? match[1].trim() : html)
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [slug])

  if (error || (!loading && !htmlContent && !newsItem)) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <h1 className="font-heading text-4xl font-bold text-slate-100 mb-4">News Not Found</h1>
        <p className="text-slate-400 mb-8">
          The news article you're looking for doesn't exist or has been removed.
        </p>
        <Link to="/news" className="btn-cyan">Back to News Feed</Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Top Ad */}
      <AdBanner slot="news-top" className="mb-10" />

      <div className="mb-8">
        <Link to="/news" className="inline-flex items-center gap-2 text-slate-400 hover:text-cyan transition-colors text-sm mb-6 font-medium">
          <ArrowLeft size={16} /> Back to News
        </Link>
        {newsItem && (
          <>
            <div className="flex items-center gap-3 mb-4">
              <Badge color={newsItem.badgeColor}>{newsItem.badge}</Badge>
              <span className="text-cyan text-sm font-semibold">{newsItem.source}</span>
            </div>
            <h1 className="font-heading text-3xl md:text-5xl font-bold text-slate-100 mb-6 leading-tight max-w-4xl">
              {newsItem.title}
            </h1>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-10">
        <article className="glass-panel p-8 md:p-12 rounded-3xl relative overflow-hidden">
          {/* Background effects */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10">
            {loading ? (
              <div className="flex flex-col gap-4 py-10 animate-pulse">
                <div className="h-4 bg-slate-800 rounded w-3/4"></div>
                <div className="h-4 bg-slate-800 rounded w-full"></div>
                <div className="h-4 bg-slate-800 rounded w-5/6"></div>
                <div className="h-4 bg-slate-800 rounded w-full mt-4"></div>
                <div className="h-4 bg-slate-800 rounded w-4/6"></div>
              </div>
            ) : (
              <div 
                className="article-prose"
                dangerouslySetInnerHTML={{ __html: htmlContent }} 
              />
            )}
          </div>
        </article>

        {/* Right Sidebar Ad */}
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <AdBanner slot="news-sidebar" className="h-[600px] w-full bg-slate-900/50 flex flex-col items-center justify-center border border-slate-800/50 rounded-2xl" />
          </div>
        </aside>
      </div>

      {/* Bottom Ad */}
      <AdBanner slot="news-bottom" className="mt-12" />
    </div>
  )
}
