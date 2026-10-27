import { useMemo } from 'react'
import { getNewsVisual } from '../../data/newsVisuals'
import NewsVisual from './NewsVisual'

export default function NewsGallery({ item }) {
  const visual = useMemo(() => getNewsVisual(item), [item])
  const activeSlide = visual.gallery[0]

  return (
    <section className="news-gallery" aria-label={`${item.title} featured image`}>
      <div className="news-gallery__stage">
        <NewsVisual slide={activeSlide} priority alt={`${item.title} — ${activeSlide.caption}`} className="news-gallery__image" />
        <div className="news-gallery__caption">
          <span>{visual.topic}</span>
          <strong>{activeSlide.caption}</strong>
        </div>
      </div>
    </section>
  )
}
