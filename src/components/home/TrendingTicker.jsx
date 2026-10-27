import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { TrendingUp } from 'lucide-react'
import { getPublishedArticles } from '../../data/articles'
import { newsItems } from '../../data/news'

/**
 * Returns a contextual emoji for an article or news item based on content, category, or tags.
 */
export function getTrendingEmoji(item) {
  if (item?.trendingEmoji) return item.trendingEmoji
  if (item?.emoji) return item.emoji
  if (item?.badge === 'Breaking') return '🚨'
  if (item?.badge === 'Latest') return '⚡'

  const searchStr = `${item?.category || ''} ${item?.title || ''} ${(item?.tags || []).join(' ')}`.toLowerCase()

  if (searchStr.includes('mcp') || searchStr.includes('protocol') || searchStr.includes('tool calling')) return '⚡'
  if (searchStr.includes('rag') || searchStr.includes('retrieval') || searchStr.includes('pinecone') || searchStr.includes('vector')) return '🚀'
  if (searchStr.includes('framework') || searchStr.includes('autogen') || searchStr.includes('crewai') || searchStr.includes('langgraph') || searchStr.includes('multi-agent')) return '🤖'
  if (searchStr.includes('security') || searchStr.includes('threat') || searchStr.includes('sandbox') || searchStr.includes('governance')) return '🛡️'
  if (searchStr.includes('memory') || searchStr.includes('graphrag') || searchStr.includes('storage')) return '🧠'
  if (searchStr.includes('benchmark') || searchStr.includes('eval') || searchStr.includes('roi')) return '📊'
  if (searchStr.includes('ux') || searchStr.includes('trust') || searchStr.includes('design') || searchStr.includes('transparency')) return '✨'
  if (searchStr.includes('kubernetes') || searchStr.includes('cloud') || searchStr.includes('deploy') || searchStr.includes('docker')) return '☁️'
  if (searchStr.includes('buy vs build') || searchStr.includes('playbook') || searchStr.includes('guide')) return '💡'
  if (searchStr.includes('stock') || searchStr.includes('bubble') || searchStr.includes('warning') || searchStr.includes('peril')) return '⚠️'

  return '🔥'
}
export default function TrendingTicker({ items: customItems, maxItems = 12, includeNews = true }) {
  // Auto-populate items dynamically if customItems is not provided
  const tickerItems = useMemo(() => {
    if (Array.isArray(customItems) && customItems.length > 0) {
      return customItems.map((it, idx) => {
        if (typeof it === 'string') {
          return { id: `custom-${idx}`, title: it, url: null, emoji: null }
        }
        return {
          id: it.id || `custom-${idx}`,
          title: it.trendingTitle || it.title,
          url: it.url || (it.slug ? `/articles/${it.slug}` : null),
          emoji: it.emoji || getTrendingEmoji(it),
        }
      })
    }

    const pool = []

    // 1. Published articles
    const published = getPublishedArticles()
    const markedTrending = published.filter(a => a.trending)
    const otherArticles = published.filter(a => !a.trending)
    const sortedArticles = [...markedTrending, ...otherArticles]

    sortedArticles.forEach(a => {
      pool.push({
        id: `article-${a.slug}`,
        title: a.trendingTitle || a.title,
        url: `/articles/${a.slug}`,
        emoji: getTrendingEmoji(a),
        type: 'article',
      })
    })

    // 2. Fresh breaking/latest AI news items
    if (includeNews && Array.isArray(newsItems) && newsItems.length > 0) {
      const topNews = newsItems.slice(0, 3)
      topNews.forEach(n => {
        pool.push({
          id: `news-${n.slug || n.id}`,
          title: n.trendingTitle || n.title,
          url: `/news/${n.slug}`,
          emoji: getTrendingEmoji(n),
          type: 'news',
        })
      })
    }

    return pool.slice(0, maxItems)
  }, [customItems, maxItems, includeNews])

  // Repeat items to ensure smooth continuous marquee scroll across all resolutions
  const displayItems = useMemo(() => {
    if (!tickerItems || tickerItems.length === 0) return []
    let base = [...tickerItems]
    while (base.length < 8) {
      base = [...base, ...tickerItems]
    }
    return [...base, ...base]
  }, [tickerItems])

  if (!displayItems.length) return null

  return (
    <div className="trending-strip flex items-center gap-0 rounded-xl overflow-hidden border">
      {/* Label */}
      <div className="trending-label flex-shrink-0 flex items-center gap-2 px-3 sm:px-4 py-3 select-none z-10 border-r">
        <TrendingUp size={14} className="text-amber-500 dark:text-amber-400 flex-shrink-0" />
        <span className="text-amber-500 dark:text-amber-400 text-xs font-bold uppercase tracking-widest whitespace-nowrap">
          Trending
        </span>
      </div>

      {/* Scrolling ticker */}
      <div className="ticker-wrapper flex-1 py-3 overflow-hidden">
        <div
          className="ticker-content flex items-center"
          style={{ animationDuration: `${Math.max(28, (displayItems.length / 2) * 4)}s` }}
        >
          {displayItems.map((item, i) => {
            const content = (
              <>
                {item.emoji && <span className="text-base select-none mr-2">{item.emoji}</span>}
                <span className="ticker-item-title transition-colors">
                  {item.title}
                </span>
              </>
            )

            if (item.url) {
              return (
                <Link
                  key={`${item.id}-${i}`}
                  to={item.url}
                  className="ticker-link text-sm mx-6 whitespace-nowrap cursor-pointer inline-flex items-center font-medium"
                >
                  {content}
                </Link>
              )
            }

            return (
              <span
                key={`${item.id}-${i}`}
                className="ticker-link text-sm mx-6 whitespace-nowrap cursor-default inline-flex items-center font-medium"
              >
                {content}
              </span>
            )
          })}
        </div>
      </div>
    </div>
  )
}
