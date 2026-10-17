import { useState } from 'react'

export default function NewsVisual({ slide, className = '', alt = '', priority = false }) {
  const [imageFailed, setImageFailed] = useState(false)
  const showImage = Boolean(slide?.image) && !imageFailed

  return (
    <div
      className={`news-visual news-visual--${slide?.key || 'default'} ${className}`}
      style={{
        '--news-tone-a': slide?.colors?.[0] || '#10243e',
        '--news-tone-b': slide?.colors?.[1] || '#2c7184',
        '--news-tone-c': slide?.colors?.[2] || '#e66b2c',
        '--news-hue': `${((slide?.variant || 0) % 7) * 9}deg`,
        '--news-orbit': `${((slide?.variant || 0) % 5) * 7 - 14}deg`,
      }}
    >
      {showImage ? (
        <img src={slide.image} alt={alt} loading={priority ? 'eager' : 'lazy'} onError={() => setImageFailed(true)} />
      ) : (
        <div className="news-visual__fallback" aria-hidden="true">
          <small>{slide?.label || 'AI briefing'}</small>
        </div>
      )}
      <div className="news-visual__veil" />
    </div>
  )
}
