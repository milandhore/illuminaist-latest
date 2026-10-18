import { useState, useCallback, useEffect } from 'react'
import { Resend } from 'resend'
import { validateCompanyEmail, isCompanyEmail, extractDomain } from '../utils/companyEmail'
import { sitePath } from '../utils/sitePath'

/**
 * Resend Configuration (optional production email service)
 */
const RESEND_API_KEY = 'YOUR_RESEND_API_KEY'
const resend = new Resend(RESEND_API_KEY)

// ─── Storage Keys ──────────────────────────────────────────────
const KEY_STATUS = 'illuminaist_subscriber'
const KEY_SUBSCRIBERS = 'illuminaist_subscriber_list'
const KEY_ALERTS = 'illuminaist_subscriber_alerts'

// ─── Helpers ──────────────────────────────────────────────────
function getSubscriberList() {
  try {
    return JSON.parse(localStorage.getItem(KEY_SUBSCRIBERS) || '[]')
  } catch {
    return []
  }
}

function saveSubscriberLocally(email, isCompany, source = 'website') {
  const list = getSubscriberList()
  const domain = extractDomain(email)
  const existingIdx = list.findIndex(s => s.email.toLowerCase() === email.toLowerCase())
  const record = {
    email,
    domain,
    isCompany,
    source,
    subscribedAt: new Date().toISOString()
  }
  if (existingIdx >= 0) {
    list[existingIdx] = { ...list[existingIdx], ...record }
  } else {
    list.unshift(record)
  }
  try {
    localStorage.setItem(KEY_SUBSCRIBERS, JSON.stringify(list))
  } catch (e) {
    console.warn('Could not save to localStorage:', e)
  }
  return record
}

// ─── Sync with server API (if CMS or backend is active) ───────
async function syncSubscriberToServer(subscriberData) {
  try {
    const res = await fetch('/api/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(subscriberData)
    })
    if (res.ok) return await res.json()
  } catch (err) {
    // Non-blocking in dev / client-only mode
    console.debug('[IlluminAIst] Local subscriber stored:', subscriberData.email)
  }
  return null
}

// ─── Welcome Email & Content Alert Dispatcher ─────────────────
async function sendWelcomeEmail(email, isCompany) {
  const isConfigured = RESEND_API_KEY !== 'YOUR_RESEND_API_KEY'
  if (!isConfigured) {
    console.info(
      `[IlluminAIst Alert Hook] Welcome alert dispatched to ${email} (Company: ${isCompany ? 'Yes' : 'No'}). Alerts active for new Articles, eBooks, and News.`
    )
    return
  }

  const userName = email.split('@')[0]
  const htmlContent = `
    <div>
      <h1>Welcome to IlluminAIst, ${userName}! 🚀</h1>
      <p>Your subscription is active. You will receive direct alerts for every new article, free eBook release, and breaking AI news posting.</p>
      ${isCompany ? '<p><strong>✓ Company verification confirmed:</strong> All premium eBook downloads are unlocked.</p>' : ''}
      <br />
      <p>Best regards,<br/>The IlluminAIst Editorial & Engineering Team</p>
    </div>
  `

  await resend.emails.send({
    from: 'IlluminAIst <customer@illuminaist.in>',
    to: [email],
    subject: "Welcome to IlluminAIst — AI Alerts & Engineering Guides 🚀",
    html: htmlContent,
    reply_to: 'customer@illuminaist.in'
  })
}

export function useSubscription() {
  const [status, setStatus] = useState(() => {
    try {
      const stored = localStorage.getItem(KEY_STATUS)
      if (stored) {
        const parsed = JSON.parse(stored)
        return {
          subscribed: !!parsed.subscribed,
          email: parsed.email || null,
          isCompany: parsed.isCompany ?? (parsed.email ? isCompanyEmail(parsed.email) : false),
          domain: parsed.domain || (parsed.email ? extractDomain(parsed.email) : null),
          subscribedAt: parsed.subscribedAt || null,
        }
      }
    } catch {
      // fallback
    }
    return { subscribed: false, email: null, isCompany: false, domain: null, subscribedAt: null }
  })

  const [alerts, setAlerts] = useState([])

  // Load alerts feed on mount
  useEffect(() => {
    async function loadAlerts() {
      try {
        const res = await fetch(sitePath('alerts.json'))
        if (res.ok) {
          const data = await res.json()
          setAlerts(data)
          return
        }
      } catch (_) {}

      // Fallback to local stored alerts
      try {
        const stored = localStorage.getItem(KEY_ALERTS)
        if (stored) setAlerts(JSON.parse(stored))
      } catch (_) {}
    }
    loadAlerts()
  }, [])

  /**
   * Subscribe an email address.
   * If requireCompany is true, non-corporate free webmail domains are blocked.
   */
  const subscribe = useCallback(async (email, options = {}) => {
    const { requireCompany = false, source = 'general' } = options

    if (!email || typeof email !== 'string') {
      return { success: false, error: 'Please enter a valid email address.' }
    }

    const trimmed = email.trim().toLowerCase()

    if (requireCompany) {
      const compCheck = validateCompanyEmail(trimmed)
      if (!compCheck.valid) {
        return {
          success: false,
          error: compCheck.error,
          isFreeProvider: compCheck.isFreeProvider
        }
      }
    } else {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(trimmed)) {
        return { success: false, error: 'Please enter a valid email address.' }
      }
    }

    const companyValid = isCompanyEmail(trimmed)
    const domain = extractDomain(trimmed)

    try {
      const newStatus = {
        subscribed: true,
        email: trimmed,
        isCompany: companyValid,
        domain,
        subscribedAt: new Date().toISOString()
      }

      localStorage.setItem(KEY_STATUS, JSON.stringify(newStatus))
      saveSubscriberLocally(trimmed, companyValid, source)
      setStatus(newStatus)

      // Sync with server if CMS server is running
      syncSubscriberToServer({
        email: trimmed,
        domain,
        isCompany: companyValid,
        source
      })

      // Send confirmation & trigger content alert enrollment
      sendWelcomeEmail(trimmed, companyValid).catch(err => {
        console.warn('[IlluminAIst] Welcome dispatch note:', err)
      })

      return {
        success: true,
        email: trimmed,
        isCompany: companyValid,
        domain
      }
    } catch (err) {
      console.error(err)
      return { success: false, error: 'Something went wrong. Please try again.' }
    }
  }, [])

  const getSubscribers = useCallback(() => getSubscriberList(), [])

  return {
    isSubscribed: status.subscribed,
    isCompanySubscribed: status.subscribed && status.isCompany,
    email: status.email,
    companyDomain: status.domain,
    subscribedAt: status.subscribedAt,
    subscribe,
    getSubscribers,
    alerts,
  }
}
