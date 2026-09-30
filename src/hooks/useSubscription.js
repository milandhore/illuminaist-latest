import { useState, useCallback } from 'react'
import { Resend } from 'resend'

/**
 * ════════════════════════════════════════════════════════════
 * Resend Configuration
 * ─────────────────────────────────────────────────────────────
 * 1. Sign up at https://resend.com
 * 2. Create an API Key in the dashboard
 * 3. Verify your domain (e.g., illuminaist.in) to send emails from it
 * 4. Fill in the RESEND_API_KEY below.
 * 
 * NOTE: Using Resend directly in a React frontend is generally 
 * not recommended due to exposing your API key and potential CORS 
 * limitations. For production, consider moving this logic to a 
 * backend API route or serverless function.
 * ════════════════════════════════════════════════════════════
 */
const RESEND_API_KEY = 'YOUR_RESEND_API_KEY' // ← e.g. 're_123456789'
const resend = new Resend(RESEND_API_KEY)

// ─── localStorage keys ────────────────────────────────────────
const KEY_STATUS = 'illuminaist_subscriber'
const KEY_SUBSCRIBERS = 'illuminaist_subscriber_list'

// ─── Subscriber list helpers ──────────────────────────────────
function getSubscriberList() {
  try {
    return JSON.parse(localStorage.getItem(KEY_SUBSCRIBERS) || '[]')
  } catch { return [] }
}

function saveSubscriber(email) {
  const list = getSubscriberList()
  const exists = list.find(s => s.email === email)
  if (!exists) {
    list.push({ email, subscribedAt: new Date().toISOString() })
    localStorage.setItem(KEY_SUBSCRIBERS, JSON.stringify(list))
  }
}

// ─── Send welcome email via Resend ──────────────────────────
async function sendWelcomeEmail(email) {
  const isConfigured = RESEND_API_KEY !== 'YOUR_RESEND_API_KEY'

  if (!isConfigured) {
    console.info(
      '[IlluminAIst] Resend not configured yet.\n' +
      'Open src/hooks/useSubscription.js and fill in your\n' +
      'RESEND_API_KEY.'
    )
    return
  }

  const userName = email.split('@')[0]

  // Note: For advanced HTML templates, you might want to fetch your 
  // src/email/welcome-email-template.html content or define it here.
  const htmlContent = `
    <div>
      <h1>Welcome to IlluminAIst, ${userName}! 🚀</h1>
      <p>You're at the AI frontier.</p>
      <br />
      <p>Best regards,<br/>The IlluminAIst Team</p>
      <hr />
      <small><a href="https://illuminaist.com/#/unsubscribe?email=${encodeURIComponent(email)}">Unsubscribe</a></small>
    </div>
  `

  await resend.emails.send({
    from: 'IlluminAIst <customer@illuminaist.in>', // Note: This domain must be verified in Resend
    to: [email],
    subject: "Welcome to IlluminAIst — You're at the AI frontier 🚀",
    html: htmlContent,
    reply_to: 'customer@illuminaist.in'
  })
}

// ─── Hook ────────────────────────────────────────────────────
export function useSubscription() {
  const [status, setStatus] = useState(() => {
    try {
      const stored = localStorage.getItem(KEY_STATUS)
      return stored ? JSON.parse(stored) : { subscribed: false, email: null }
    } catch {
      return { subscribed: false, email: null }
    }
  })

  const subscribe = useCallback(async (email) => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return { success: false, error: 'Please enter a valid email address.' }
    }

    try {
      // 1. Save to localStorage (frontend state + subscriber list)
      const newStatus = { subscribed: true, email, subscribedAt: new Date().toISOString() }
      localStorage.setItem(KEY_STATUS, JSON.stringify(newStatus))
      saveSubscriber(email)
      setStatus(newStatus)

      // 2. Send welcome email (non-blocking — don't fail subscribe if email fails)
      sendWelcomeEmail(email).catch(err =>
        console.warn('[IlluminAIst] Welcome email failed:', err)
      )

      return { success: true }
    } catch (err) {
      return { success: false, error: 'Something went wrong. Please try again.' }
    }
  }, [])

  /**
   * Returns all subscribers stored in localStorage.
   * Useful for admin/export purposes.
   */
  const getSubscribers = useCallback(() => getSubscriberList(), [])

  return {
    isSubscribed: status.subscribed,
    email: status.email,
    subscribedAt: status.subscribedAt,
    subscribe,
    getSubscribers,
  }
}
