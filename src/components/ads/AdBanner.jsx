import { useEffect, useRef } from 'react'

/**
 * Google AdSense banner component.
 *
 * To activate real ads:
 *  1. Replace YOUR_PUB_ID below with your publisher ID (ca-pub-XXXXXXXXXXXXXXXX).
 *  2. Replace each SLOT_ID with the ad unit slot IDs from your AdSense dashboard.
 *  3. Uncomment the <script> tag in index.html (the AdSense async script).
 *  4. Deploy — AdSense won't serve ads on localhost.
 *
 * In development (localhost) the placeholder UI is shown automatically
 * because AdSense only serves ads on live domains.
 */

const PUB_ID = 'ca-pub-XXXXXXXXXXXXXXXX' // ← Replace with your publisher ID

const SLOT_CONFIG = {
  // Leaderboard below the sticky nav (728×90 desktop / 320×50 mobile)
  header: {
    slotId: '1111111111', // ← Replace with your slot ID
    format: 'auto',
    fullWidthResponsive: true,
    label: '728×90 Leaderboard',
    minHeight: '90px',
  },
  // Sticky sidebar rectangle (300×250 or 300×600)
  sidebar: {
    slotId: '2222222222', // ← Replace with your slot ID
    format: 'auto',
    fullWidthResponsive: false,
    label: '300×250 Rectangle',
    minHeight: '250px',
    width: '300px',
  },
  // Between article paragraphs (fluid / full-width)
  'in-article': {
    slotId: '3333333333', // ← Replace with your slot ID
    format: 'fluid',
    fullWidthResponsive: true,
    label: 'In-Article Ad',
    minHeight: '120px',
  },
  // Billboard above footer (970×250 desktop / responsive mobile)
  'bottom-feed': {
    slotId: '4444444444', // ← Replace with your slot ID
    format: 'auto',
    fullWidthResponsive: true,
    label: '970×250 Billboard',
    minHeight: '100px',
  },
}

const IS_PRODUCTION = !window.location.hostname.includes('localhost') &&
                      !window.location.hostname.includes('127.0.0.1')

export default function AdBanner({ slot = 'header', className = '' }) {
  const adRef = useRef(null)
  const cfg = SLOT_CONFIG[slot] || SLOT_CONFIG.header

  useEffect(() => {
    if (!IS_PRODUCTION) return
    try {
      // Push the ad unit to AdSense for rendering
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch (e) {
      console.warn('AdSense push error:', e)
    }
  }, [slot])

  if (!IS_PRODUCTION) {
    // ── Development placeholder ──────────────────────────────────────────────
    return (
      <div
        className={`ad-placeholder ${className}`}
        style={{ width: cfg.width || '100%', minHeight: cfg.minHeight }}
        aria-label="Advertisement placeholder (dev mode)"
      >
        <span className="text-[10px] font-mono text-slate-600 tracking-widest uppercase">
          Advertisement
        </span>
        <span className="text-[11px] text-slate-700 mt-0.5">
          {cfg.label} · slot:{cfg.slotId}
        </span>
        <span className="text-[10px] text-slate-700 opacity-60">
          Ads served on live domain only
        </span>
      </div>
    )
  }

  // ── Production AdSense markup ────────────────────────────────────────────
  return (
    <div className={`text-center overflow-hidden ${className}`} aria-label="Advertisement">
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{
          display: 'block',
          width: cfg.width || '100%',
          minHeight: cfg.minHeight,
        }}
        data-ad-client={PUB_ID}
        data-ad-slot={cfg.slotId}
        data-ad-format={cfg.format}
        data-full-width-responsive={cfg.fullWidthResponsive ? 'true' : 'false'}
      />
    </div>
  )
}
