import { useState, useCallback, useEffect } from 'react'
import { validateCompanyEmail, isCompanyEmail, extractDomain } from '../utils/companyEmail'
import { sitePath } from '../utils/sitePath'

// ─── Storage Keys ──────────────────────────────────────────────
const KEY_STATUS = 'illuminaist_subscriber'
const KEY_ALERTS = 'illuminaist_subscriber_alerts'
const SUBSCRIPTION_API_URL = String(import.meta.env.VITE_SUBSCRIPTION_API_URL || '').replace(/\/+$/, '')

// ─── Helpers ──────────────────────────────────────────────────
// The static GitHub Pages build stores only the visitor's local status. A real
// subscription service can be enabled with VITE_SUBSCRIPTION_API_URL; secrets
// must remain on that server and must never be placed in VITE_* variables.
async function syncSubscriberToServer(subscriberData) {
  if (!SUBSCRIPTION_API_URL) return null

  try {
    const res = await fetch(`${SUBSCRIPTION_API_URL}/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(subscriberData),
      credentials: 'omit',
      signal: AbortSignal.timeout(5000)
    })
    if (res.ok) return await res.json()
  } catch (err) {
    console.warn('[IlluminAIst] Subscription service unavailable; local status retained.')
  }
  return null
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
      setStatus(newStatus)

      // Optional server sync. The static build remains fully functional without it.
      syncSubscriberToServer({
        email: trimmed,
        domain,
        isCompany: companyValid,
        source
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

  return {
    isSubscribed: status.subscribed,
    isCompanySubscribed: status.subscribed && status.isCompany,
    email: status.email,
    companyDomain: status.domain,
    subscribedAt: status.subscribedAt,
    subscribe,
    alerts,
  }
}
