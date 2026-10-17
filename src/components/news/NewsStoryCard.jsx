import { ArrowUpRight, Clock3 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { getNewsVisual } from '../../data/newsVisuals'
import NewsVisual from './NewsVisual'
import { getNewsLabel, getNewsSummary, getNewsTitle } from '../../data/newsCopy'

export default function NewsStoryCard({ item, compact = false }) {
  const visual = getNewsVisual(item)
  const slide = visual.gallery[0]
  const hasImage = Boolean(slide.image)

  return (
    <Link to={`/news/${item.slug || item.id}`} className={`news-story-card group ${compact ? 'news-story-card--compact' : ''}`}>
      {hasImage ? (
        <NewsVisual slide={slide} alt="" className="news-story-card__visual" />
      ) : (
        <div
          className="news-story-card__topic-strip"
          style={{
            '--news-topic-color': slide.colors[1],
          }}
          aria-hidden="true"
        />
      )}
      <div className="news-story-card__body">
        <div className="news-card-kicker"><span className={`news-card-status news-card-status--${item.badge === 'Breaking' ? 'breaking' : 'quick'}`}>{getNewsLabel(item)}</span>{visual.topic}</div>
        <h3>{getNewsTitle(item)}</h3>
        {!compact && <p>{getNewsSummary(item)}</p>}
        <div className="news-card-meta"><Clock3 size={12} /> {item.publishedAt} <ArrowUpRight size={15} className="news-story-card__arrow" /></div>
      </div>
    </Link>
  )
}
