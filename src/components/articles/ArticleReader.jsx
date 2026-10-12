import { useState, useEffect } from 'react'
import { Clock, Share2, Twitter, Linkedin, Link2, ArrowLeft, CheckCheck } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import Badge from '../ui/Badge'
import AdBanner from '../ads/AdBanner'
import ReadingProgressBar from './ReadingProgressBar'
import TableOfContents from './TableOfContents'
import RelatedArticles from './RelatedArticles'

export default function ArticleReader({ article }) {
  const [copied, setCopied] = useState(false)
  const location = useLocation()

  useEffect(() => {
    document.title = `${article.title} | IlluminAIst`
    const description = document.querySelector('meta[name="description"]')
    if (description && article.excerpt) description.setAttribute('content', article.excerpt)
    return () => {
      document.title = 'IlluminAIst — AI Engineering Articles, News & Practical Guides'
    }
  }, [article.title, article.excerpt])

  useEffect(() => {
    // Handle initial hash in URL if present
    if (location.hash) {
      const id = location.hash.substring(1)
      const el = document.getElementById(id)
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }, 100)
      }
    }
  }, [location.hash, article])

  useEffect(() => {
    // Handle clicks on internal hash links (e.g. from uploaded HTML TOCs)
    const handleHashClick = (e) => {
      const target = e.target.closest('a')
      if (!target) return
      
      const href = target.getAttribute('href')
      if (href && href.startsWith('#')) {
        e.preventDefault()
        const id = href.substring(1)
        const element = document.getElementById(id)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' })
          window.history.pushState(null, '', href)
        }
      }
    }

    const proseEl = document.querySelector('.article-prose')
    if (proseEl) {
      proseEl.addEventListener('click', handleHashClick)
      return () => proseEl.removeEventListener('click', handleHashClick)
    }
  }, [article.content])

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const twitterHref = `https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(window.location.href)}`
  const linkedinHref = `https://linkedin.com/shareArticle?title=${encodeURIComponent(article.title)}&url=${encodeURIComponent(window.location.href)}`

  return (
    <>
      {/* Scroll progress bar — fixed just below the sticky header */}
      <ReadingProgressBar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* ── TOP AD (Leaderboard) ─────────────────────────────────────────── */}
        <AdBanner slot="header" className="mb-8" />

        <Link
          to="/articles"
          className="inline-flex items-center gap-2 text-slate-500 hover:text-cyan text-sm mb-8 transition-colors group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
          Back to Articles
        </Link>

        {/* ── Three-column layout: TOC | article | sidebar ─────────────────── */}
        <div className="grid grid-cols-1 xl:grid-cols-[220px_1fr_280px] lg:grid-cols-[1fr_280px] gap-10">

          {/* ── LEFT: Table of Contents (desktop only) ─────────────────────── */}
          <aside className="hidden xl:block">
            <div className="sticky top-24">
              <div className="glass-card rounded-xl p-5">
                <TableOfContents htmlContent={article.content} />
              </div>
            </div>
          </aside>

          {/* ── MAIN ARTICLE CONTENT ──────────────────────────────────────── */}
          <article>
            {/* Article header */}
            <header className="mb-10">
              <div className="flex items-center gap-2 mb-5 flex-wrap">
                <Badge color="cyan">{article.category}</Badge>
                <Badge color="amber">{article.difficulty}</Badge>
              </div>

              <h1 className="font-heading text-3xl md:text-4xl font-bold text-slate-100 leading-tight mb-6">
                {article.title}
              </h1>

              <p className="text-slate-400 text-lg leading-relaxed mb-8">{article.excerpt}</p>

              {/* Meta bar */}
              <div className="flex flex-wrap items-center gap-6 py-5 border-y border-slate-800">
                <div className="flex items-center gap-1 text-slate-500 text-sm">
                  <Clock size={12} /> {article.readingTime} min read
                </div>

                {/* Share buttons */}
                <div className="ml-auto flex items-center gap-2">
                  <span className="text-slate-600 text-sm flex items-center gap-1.5">
                    <Share2 size={13} /> Share
                  </span>
                  <a
                    href={twitterHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Share on Twitter"
                    title="Share on Twitter"
                    className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-500 hover:text-cyan hover:bg-slate-700 transition-all duration-200"
                  >
                    <Twitter size={14} />
                  </a>
                  <a
                    href={linkedinHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Share on LinkedIn"
                    title="Share on LinkedIn"
                    className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-500 hover:text-cyan hover:bg-slate-700 transition-all duration-200"
                  >
                    <Linkedin size={14} />
                  </a>
                  <button
                    onClick={copyLink}
                    aria-label="Copy link"
                    title={copied ? 'Copied!' : 'Copy link'}
                    className={`w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center transition-all duration-200 ${
                      copied ? 'text-cyan' : 'text-slate-500 hover:text-cyan hover:bg-slate-700'
                    }`}
                  >
                    {copied ? <CheckCheck size={14} /> : <Link2 size={14} />}
                  </button>
                </div>
              </div>
            </header>

            {/* ── IN-ARTICLE AD (after header, before body) ─────────────── */}
            <AdBanner slot="in-article" className="mb-10" />

            {/* Article body */}
            <div
              className="article-prose"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />

            {/* Tags */}
            {article.tags?.length > 0 && (
              <div className="mt-12 pt-8 border-t border-slate-800">
                <p className="text-slate-500 text-sm mb-3">Filed under:</p>
                <div className="flex flex-wrap gap-2">
                  {article.tags.map(tag => (
                    <span
                      key={tag}
                      className="text-xs px-3 py-1 rounded-full bg-slate-800 text-slate-400 border border-slate-700 hover:text-cyan hover:border-cyan/40 transition-colors cursor-pointer"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* ── BOTTOM AD ─────────────────────────────────────────────── */}
            <AdBanner slot="bottom-feed" className="mt-12" />

            {/* ── RELATED ARTICLES ──────────────────────────────────────── */}
            <RelatedArticles currentSlug={article.slug} category={article.category} />
          </article>

          {/* ── RIGHT SIDEBAR ─────────────────────────────────────────────── */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-6">
              {/* Sidebar ad */}
              <AdBanner slot="sidebar" />

              {/* Mobile TOC (shown as card in sidebar on lg but not xl) */}
              <div className="xl:hidden glass-card rounded-xl p-5">
                <TableOfContents htmlContent={article.content} />
              </div>

              {/* Second sidebar ad */}
              <AdBanner slot="sidebar" />
            </div>
          </aside>
        </div>
      </div>
    </>
  )
}
