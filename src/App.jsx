import { useState, useEffect, lazy, Suspense } from 'react'
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/layout/Layout'
import SubscribeModal from './components/subscription/SubscribeModal'
import HomePage from './pages/HomePage'
import { useSubscription } from './hooks/useSubscription'

const ArticlesPage = lazy(() => import('./pages/ArticlesPage'))
const ArticleDetailPage = lazy(() => import('./pages/ArticleDetailPage'))
const NewsPage = lazy(() => import('./pages/NewsPage'))
const EBooksPage = lazy(() => import('./pages/EBooksPage'))
const AboutPage = lazy(() => import('./pages/AboutPage'))
const SubscribePage = lazy(() => import('./pages/SubscribePage'))
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'))
const TermsPage = lazy(() => import('./pages/TermsPage'))

// Loading fallback component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[50vh]">
    <div className="w-8 h-8 border-2 border-cyan border-t-transparent rounded-full animate-spin"></div>
  </div>
)

export default function App() {
  const [modalOpen, setModalOpen] = useState(false)

  // Always call hooks at the top level — never conditionally
  const { isSubscribed } = useSubscription()

  // Exit-intent: show modal after 4s on first visit if not subscribed
  useEffect(() => {
    if (isSubscribed) return

    const timer = setTimeout(() => {
      const onMouseLeave = (e) => {
        if (e.clientY <= 0) {
          setModalOpen(true)
          document.removeEventListener('mouseleave', onMouseLeave)
        }
      }
      document.addEventListener('mouseleave', onMouseLeave)
      return () => document.removeEventListener('mouseleave', onMouseLeave)
    }, 4000)

    return () => clearTimeout(timer)
  }, [isSubscribed])

  return (
    <HashRouter>
      <Layout onSubscribeClick={() => setModalOpen(true)}>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/articles" element={<ArticlesPage />} />
            <Route path="/articles/:slug" element={<ArticleDetailPage />} />
            <Route path="/news" element={<NewsPage />} />
            <Route path="/ebooks" element={<EBooksPage />} />
            <Route path="/topics" element={<Navigate to="/articles" replace />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/subscribe" element={<SubscribePage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/terms" element={<TermsPage />} />
          </Routes>
        </Suspense>
      </Layout>

      <SubscribeModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </HashRouter>
  )
}
