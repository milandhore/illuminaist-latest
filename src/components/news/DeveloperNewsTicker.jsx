import { Code2, Radio, ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { getNewsLabel, getNewsTitle } from '../../data/newsCopy'
import { getNewsVisual } from '../../data/newsVisuals'

export default function DeveloperNewsTicker({ items = [] }) {
  const stories = items.slice(0, 10)

  if (!stories.length) return null

  return (
    <section className="developer-pulse" aria-label="Developer news scroll">
      <div className="developer-pulse__header">
        <div className="developer-pulse__title">
          <span className="developer-pulse__live-dot" aria-hidden="true" />
          <Code2 size={15} />
          <strong>Developer Pulse</strong>
          <span className="developer-pulse__divider" aria-hidden="true" />
          <span>What builders are watching</span>
        </div>
        <span className="developer-pulse__hint"><Radio size={12} /> Scroll · hover to pause</span>
      </div>

      <div className="developer-pulse__viewport">
        <div className="developer-pulse__track">
          {[...stories, ...stories].map((item, index) => {
            const visual = getNewsVisual(item)
            const isDuplicate = index >= stories.length

            return (
              <Link
                key={`${item.id}-${index}`}
                to={`/news/${item.slug || item.id}`}
                className="developer-pulse__item"
                aria-hidden={isDuplicate}
                tabIndex={isDuplicate ? -1 : undefined}
              >
                <span className={`developer-pulse__badge developer-pulse__badge--${item.badge === 'Breaking' ? 'breaking' : 'quick'}`}>
                  {getNewsLabel(item)}
                </span>
                <span className="developer-pulse__copy">
                  <strong>{getNewsTitle(item)}</strong>
                  <small>{visual.topic} · {item.publishedAt}</small>
                </span>
                <ArrowUpRight size={14} aria-hidden="true" />
              </Link>
            )
          })}
        </div>
      </div>

      <div className="developer-pulse__footer">
        <span><span className="developer-pulse__signal" aria-hidden="true" /> LIVE INDEX</span>
        <span>{items.length} developer stories in this briefing</span>
      </div>
    </section>
  )
}
