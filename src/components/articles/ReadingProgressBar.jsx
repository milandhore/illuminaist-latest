import { useState, useEffect } from 'react'

/**
 * ReadingProgressBar — thin cyan/amber gradient bar that shows scroll progress
 * through the article. Mounts below the sticky nav via fixed positioning.
 */
export default function ReadingProgressBar() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const update = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      setProgress(docHeight > 0 ? Math.min(100, (scrollTop / docHeight) * 100) : 0)
    }

    window.addEventListener('scroll', update, { passive: true })
    update()
    return () => window.removeEventListener('scroll', update)
  }, [])

  return (
    <div
      aria-hidden="true"
      className="fixed top-16 left-0 right-0 z-40 h-[3px] bg-slate-800/60"
    >
      <div
        className="h-full transition-all duration-100 ease-out"
        style={{
          width: `${progress}%`,
          background: 'linear-gradient(90deg, #00F0FF 0%, #FFB800 100%)',
          boxShadow: '0 0 8px rgba(0,240,255,0.5)',
        }}
      />
    </div>
  )
}
