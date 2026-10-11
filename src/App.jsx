import { useState, useEffect } from 'react'
import { HashRouter } from 'react-router-dom'
import Layout from './components/layout/Layout'
import SubscribeModal from './components/subscription/SubscribeModal'
import AnimatedRoutes from './components/layout/AnimatedRoutes'
import { useSubscription } from './hooks/useSubscription'

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
        <AnimatedRoutes />
      </Layout>

      <SubscribeModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </HashRouter>
  )
}
