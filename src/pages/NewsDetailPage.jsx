import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, ArrowUpRight, Clock3, Share2 } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import AdBanner from '../components/ads/AdBanner'
import NewsStoryCard from '../components/news/NewsStoryCard'
import { getNewsVisual } from '../data/newsVisuals'
import { getNewsLabel, getNewsSummary, getNewsTitle } from '../data/newsCopy'
import { newsItems } from '../data/news'
import { sitePath } from '../utils/sitePath'

const dateFormatter = new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })

export default function NewsDetailPage() {
  const { slug } = useParams()
  const newsItem = newsItems.find(item => item.slug === slug || item.id.toString() === slug)
  const [htmlContent, setHtmlContent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const visual = newsItem ? getNewsVisual(newsItem) : null
  const relatedItems = useMemo(() => newsItem ? newsItems.filter(item => item.slug !== newsItem.slug).slice(0, 3) : [], [newsItem])

  useEffect(() => {
    if (!newsItem) return
    document.title = `${getNewsTitle(newsItem)} | IlluminAIst News`
    const description = document.querySelector('meta[name="description"]')
    if (description && newsItem.excerpt) description.setAttribute('content', getNewsSummary(newsItem))
    return () => { document.title = 'IlluminAIst — AI Engineering Articles, News & Practical Guides' }
  }, [newsItem])

  useEffect(() => {
    if (!slug) return undefined

    setLoading(true)
    setError(null)
    setHtmlContent(null)

    // The script saves HTML in /public/articles/news/{slug}.html
    const articleSlug = newsItem?.slug || slug
    fetch(sitePath(`articles/news/${articleSlug}.html`))
      .then(res => {
        if (!res.ok) throw new Error(`Could not load news article (${res.status}).`)
        return res.text()
      })
      .then(html => {
        // Extract body content if we have a full HTML document
        const match = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i)
        setHtmlContent(match ? match[1].trim() : html)
      })
      .catch(fetchError => setError(fetchError.message))
      .finally(() => setLoading(false))
    return undefined
  }, [slug])

  if (error || (!loading && !htmlContent && !newsItem)) {
    return <div className="news-experience"><div className="news-shell news-error-state"><h1>News not found</h1><p>The story you’re looking for doesn’t exist or has been removed.</p><Link to="/news" className="news-primary-button">Back to News</Link></div></div>
  }

  if (!newsItem) return <div className="news-experience"><div className="news-shell news-detail-skeleton" /></div>

  return (
    <div className="news-experience news-detail-page">
      <div className="news-shell">
        <Link to="/news" className="news-back-link"><ArrowLeft size={16} /> Back to the briefing</Link>
        <div className="news-detail-layout">
          <article className="news-article">
            <header className="news-article-header">
              <div className="news-card-kicker"><span className={`news-card-status news-card-status--${newsItem.badge === 'Breaking' ? 'breaking' : 'quick'}`}>{getNewsLabel(newsItem)}</span>{visual.topic}</div>
              <h1>{getNewsTitle(newsItem)}</h1>
              <p className="news-article-dek">{getNewsSummary(newsItem)}</p>
              <div className="news-article-meta">
                <span><Clock3 size={14} /> Published {dateFormatter.format(new Date(newsItem.publishedAt))}</span>
                <span>IlluminAIst editorial desk</span>
                <button type="button" onClick={() => navigator.share?.({ title: getNewsTitle(newsItem), url: window.location.href })} className="news-share-button"><Share2 size={14} /> Share</button>
              </div>
            </header>

            <AdBanner slot="in-article" className="news-inline-ad" />
            {loading ? (
              <div className="news-article-loading" aria-label="Loading article"><span /><span /><span /><span /><span /></div>
            ) : (
              <div className="article-prose news-article-prose" dangerouslySetInnerHTML={{ __html: htmlContent }} />
            )}
            <AdBanner slot="news-bottom" className="news-inline-ad news-inline-ad--bottom" />
          </article>

          <aside className="news-detail-rail">
            <div className="news-detail-rail__intro"><span className="news-section-kicker">Keep reading</span><h2>More from the desk</h2><p>Related context from the latest AI briefing.</p></div>
            {relatedItems.map(item => <NewsStoryCard key={item.id} item={item} compact />)}
            <Link to="/news" className="news-rail-link">Browse all news <ArrowUpRight size={14} /></Link>
          </aside>
        </div>
      </div>
    </div>
  )
}
