import { useState, useEffect, useRef } from 'react'
import { List } from 'lucide-react'

/**
 * TableOfContents
 * Parses h2/h3 headings from the rendered article and builds a sticky TOC.
 * Highlights the active heading as the user scrolls.
 *
 * @param {string} htmlContent — the raw HTML string of the article body
 */
export default function TableOfContents({ htmlContent }) {
  const [headings, setHeadings] = useState([])
  const [activeId, setActiveId] = useState(null)
  const observerRef = useRef(null)

  // Parse headings from HTML string and inject IDs into DOM after render
  useEffect(() => {
    if (!htmlContent) return

    // Extract headings from raw HTML using a temporary DOM parser
    const parser = new DOMParser()
    const doc = parser.parseFromString(htmlContent, 'text/html')
    const nodes = doc.querySelectorAll('h2, h3')

    const parsed = Array.from(nodes).map((node, i) => {
      const id = `toc-heading-${i}-${node.textContent.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 60)}`
      return {
        id,
        text: node.textContent.trim(),
        level: parseInt(node.tagName[1], 10),
      }
    })
    setHeadings(parsed)
  }, [htmlContent])

  // After headings are parsed, inject IDs into the real rendered DOM
  useEffect(() => {
    if (!headings.length) return

    const proseEl = document.querySelector('.article-prose')
    if (!proseEl) return

    const realNodes = proseEl.querySelectorAll('h2, h3')
    realNodes.forEach((node, i) => {
      if (headings[i]) node.id = headings[i].id
    })

    // Intersection observer to track active heading
    observerRef.current?.disconnect()
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) setActiveId(entry.target.id)
        })
      },
      { rootMargin: '-20% 0% -60% 0%', threshold: 0 }
    )

    realNodes.forEach(node => obs.observe(node))
    observerRef.current = obs
    return () => obs.disconnect()
  }, [headings])

  if (!headings.length) return null

  return (
    <nav aria-label="Table of contents" className="text-sm">
      <div className="flex items-center gap-2 mb-4 text-slate-500 dark:text-slate-400">
        <List size={14} />
        <span className="font-semibold text-xs uppercase tracking-widest">Contents</span>
      </div>
      <ul className="space-y-1.5 border-l-2 border-slate-200 dark:border-slate-800">
        {headings.map(({ id, text, level }) => (
          <li key={id} className={level === 3 ? 'pl-6' : 'pl-3'}>
            <a
              href={`#${id}`}
              onClick={e => {
                e.preventDefault()
                document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
              }}
              className={`block py-0.5 transition-all duration-200 leading-snug ${
                activeId === id
                  ? 'text-amber-600 dark:text-cyan font-semibold -ml-[2px] border-l-2 border-amber-500 dark:border-cyan pl-[9px]'
                  : 'text-slate-600 dark:text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
