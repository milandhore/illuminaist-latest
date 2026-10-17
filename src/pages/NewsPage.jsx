import { Fragment, useMemo, useState } from 'react'
import { ArrowUpRight, CalendarDays, Search, SlidersHorizontal, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import AdBanner from '../components/ads/AdBanner'
import NewsStoryCard from '../components/news/NewsStoryCard'
import NewsVisual from '../components/news/NewsVisual'
import { getNewsTopics, getNewsVisual } from '../data/newsVisuals'
import { getNewsLabel, getNewsSummary, getNewsTitle } from '../data/newsCopy'
import { newsItems } from '../data/news'

export default function NewsPage() {
  const [query, setQuery] = useState('')
  const [topic, setTopic] = useState('All')
  const [sort, setSort] = useState('latest')
  const topics = useMemo(() => getNewsTopics(newsItems), [])

  const filteredItems = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return newsItems
      .filter(item => {
        const visual = getNewsVisual(item)
        const haystack = `${item.title} ${item.excerpt} ${item.source} ${visual.topic}`.toLowerCase()
        return (!needle || haystack.includes(needle)) && (topic === 'All' || visual.topic === topic)
      })
      .sort((a, b) => {
        const result = new Date(a.publishedAt) - new Date(b.publishedAt)
        return sort === 'latest' ? -result : result
      })
  }, [query, topic, sort])

  const featured = filteredItems[0]
  const feedItems = filteredItems.slice(1)
  const featuredVisual = featured ? getNewsVisual(featured) : null

  return (
    <div className="news-experience">
      <div className="news-shell">
        <header className="news-page-header">
          <div>
            <div className="news-eyebrow"><Sparkles size={13} /> IlluminAIst technology desk</div>
            <h1>AI &amp; technology</h1>
            <p>News, analysis, and explainers on the systems, companies, and ideas reshaping how we work.</p>
          </div>
          <div className="news-date-pill"><CalendarDays size={14} /> {new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date())}</div>
        </header>

        <div className="news-controls" role="search">
          <label className="news-search">
            <Search size={17} />
            <span className="sr-only">Search news</span>
            <input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search the briefing" />
          </label>
          <label className="news-sort">
            <SlidersHorizontal size={15} />
            <span className="sr-only">Sort news</span>
            <select value={sort} onChange={event => setSort(event.target.value)}>
              <option value="latest">Latest first</option>
              <option value="oldest">Oldest first</option>
            </select>
          </label>
        </div>

        <nav className="news-channel-nav" aria-label="Technology news sections">
          <button type="button" className={topic === 'All' ? 'is-active' : ''} onClick={() => setTopic('All')}>Latest</button>
          {topics.map(itemTopic => <button type="button" key={itemTopic} className={topic === itemTopic ? 'is-active' : ''} onClick={() => setTopic(itemTopic)}>{itemTopic}</button>)}
        </nav>

        <AdBanner slot="header" className="news-feed-ad news-feed-ad--top" />

        {featured ? (
          <>
            <section className="news-lead-grid" aria-label="Featured news">
              <Link to={`/news/${featured.slug || featured.id}`} className="news-feature-card group">
                <div className="news-feature-card__media">
                  <NewsVisual slide={featuredVisual.gallery[0]} priority alt={getNewsTitle(featured)} className="news-feature-card__image" />
                  <div className="news-feature-card__media-copy">
                    <span>Today’s lead</span>
                    <strong>{getNewsTitle(featured)}</strong>
                  </div>
                </div>
                <div className="news-feature-card__body">
                  <div className="news-card-kicker"><span className="news-card-status news-card-status--breaking">{getNewsLabel(featured)}</span> Featured story <span>/</span> {featuredVisual.topic}</div>
                  <h2>{getNewsTitle(featured)}</h2>
                  <p>{getNewsSummary(featured)}</p>
                  <div className="news-feature-card__footer"><span>Published {featured.publishedAt}</span><span className="news-read-link">Read story <ArrowUpRight size={15} /></span></div>
                </div>
              </Link>

              <aside className="news-latest-rail">
                <div className="news-section-heading"><div><span className="news-section-kicker">Fresh from the desk</span><h2>Latest</h2></div><span className="news-count">{filteredItems.length} stories</span></div>
                <div className="news-latest-list" aria-label="Daily news scroll">
                  {filteredItems.slice(0, 5).map((item, index) => (
                    <Link to={`/news/${item.slug || item.id}`} key={item.id} className="news-latest-item group">
                      <span className="news-latest-number">{String(index + 1).padStart(2, '0')}</span>
                      <span><strong>{getNewsTitle(item)}</strong><small>{getNewsVisual(item).topic} · {item.publishedAt}</small></span>
                      <ArrowUpRight size={15} />
                    </Link>
                  ))}
                </div>
              </aside>
            </section>

            <section className="news-feed-section">
                <div className="news-section-heading news-section-heading--feed"><div><span className="news-section-kicker">More technology news</span><h2>More to explore</h2><p className="news-section-deck">The latest developments, decoded in a few minutes.</p></div><span className="news-count">{feedItems.length} more</span></div>
              {feedItems.length ? (
                <div className="news-card-grid">
                  {feedItems.map((item, index) => (
                    <Fragment key={item.id}>
                      <NewsStoryCard item={item} />
                      {(index === 5 || index === 14 || index === 23) && <AdBanner slot="bottom-feed" className="news-feed-ad news-feed-ad--between" />}
                    </Fragment>
                  ))}
                </div>
              ) : <div className="news-empty-state">That’s the whole briefing for this filter. Try another topic or search.</div>}
            </section>
          </>
        ) : (
          <div className="news-empty-state news-empty-state--large">No stories match “{query || topic}”. Try a broader search.</div>
        )}

        <AdBanner slot="bottom-feed" className="news-low-interruption-ad" />
      </div>
    </div>
  )
}
