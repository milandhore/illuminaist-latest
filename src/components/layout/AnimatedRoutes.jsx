import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const HomePage = lazy(() => import('../../pages/HomePage'))
const ArticlesPage = lazy(() => import('../../pages/ArticlesPage'))
const ArticleDetailPage = lazy(() => import('../../pages/ArticleDetailPage'))
const NewsPage = lazy(() => import('../../pages/NewsPage'))
const NewsDetailPage = lazy(() => import('../../pages/NewsDetailPage'))
const EBooksPage = lazy(() => import('../../pages/EBooksPage'))
const AboutPage = lazy(() => import('../../pages/AboutPage'))
const SubscribePage = lazy(() => import('../../pages/SubscribePage'))
const PrivacyPage = lazy(() => import('../../pages/PrivacyPage'))
const TermsPage = lazy(() => import('../../pages/TermsPage'))

// Loading fallback component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[50vh]">
    <div className="w-8 h-8 border-2 border-cyan border-t-transparent rounded-full animate-spin"></div>
  </div>
)

const pageVariants = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
  exit: { opacity: 0, y: -15, transition: { duration: 0.3, ease: "easeIn" } }
}

const PageWrapper = ({ children }) => (
  <motion.div
    variants={pageVariants}
    initial="initial"
    animate="animate"
    exit="exit"
  >
    {children}
  </motion.div>
)

export default function AnimatedRoutes() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Suspense fallback={<PageLoader />}><PageWrapper><HomePage /></PageWrapper></Suspense>} />
        <Route path="/articles" element={<Suspense fallback={<PageLoader />}><PageWrapper><ArticlesPage /></PageWrapper></Suspense>} />
        <Route path="/articles/:slug" element={<Suspense fallback={<PageLoader />}><PageWrapper><ArticleDetailPage /></PageWrapper></Suspense>} />
        <Route path="/news" element={<Suspense fallback={<PageLoader />}><PageWrapper><NewsPage /></PageWrapper></Suspense>} />
        <Route path="/news/:slug" element={<Suspense fallback={<PageLoader />}><PageWrapper><NewsDetailPage /></PageWrapper></Suspense>} />
        <Route path="/ebooks" element={<Suspense fallback={<PageLoader />}><PageWrapper><EBooksPage /></PageWrapper></Suspense>} />
        <Route path="/topics" element={<Navigate to="/articles" replace />} />
        <Route path="/about" element={<Suspense fallback={<PageLoader />}><PageWrapper><AboutPage /></PageWrapper></Suspense>} />
        <Route path="/subscribe" element={<Suspense fallback={<PageLoader />}><PageWrapper><SubscribePage /></PageWrapper></Suspense>} />
        <Route path="/privacy" element={<Suspense fallback={<PageLoader />}><PageWrapper><PrivacyPage /></PageWrapper></Suspense>} />
        <Route path="/terms" element={<Suspense fallback={<PageLoader />}><PageWrapper><TermsPage /></PageWrapper></Suspense>} />
      </Routes>
    </AnimatePresence>
  )
}
