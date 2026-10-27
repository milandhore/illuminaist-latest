/**
 * Company / Corporate Email Validation Utilities
 * Used to enforce that downloads & enterprise resources are gated
 * strictly behind verified business/company email IDs.
 */

export const FREE_EMAIL_DOMAINS = new Set([
  'gmail.com', 'googlemail.com',
  'yahoo.com', 'ymail.com', 'rocketmail.com', 'yahoo.co.uk', 'yahoo.co.in', 'yahoo.fr', 'yahoo.ca',
  'hotmail.com', 'hotmail.co.uk', 'hotmail.fr', 'hotmail.it', 'hotmail.es',
  'outlook.com', 'live.com', 'msn.com', 'windowslive.com',
  'icloud.com', 'me.com', 'mac.com',
  'aol.com', 'aim.com',
  'zoho.com', 'zohomail.com',
  'proton.me', 'protonmail.com', 'pm.me',
  'mail.com', 'email.com', 'usa.com',
  'gmx.com', 'gmx.net', 'gmx.de',
  'yandex.com', 'yandex.ru',
  'tutanota.com', 'tutamail.com', 'tuta.io',
  'fastmail.com', 'inbox.com', 'rediffmail.com',
  'tempmail.com', 'temp-mail.org', 'guerrillamail.com', 'mailinator.com',
  '10minutemail.com', 'throwawaymail.com', 'sharklasers.com', 'dispostable.com',
  'getnada.com', 'fakemailgenerator.com', 'mohmal.com'
])

export function extractDomain(email) {
  if (!email || typeof email !== 'string') return ''
  const parts = email.trim().toLowerCase().split('@')
  return parts.length === 2 ? parts[1].trim() : ''
}

export function isValidEmailFormat(email) {
  if (!email || typeof email !== 'string') return false
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())
}

export function isCompanyEmail(email) {
  if (!isValidEmailFormat(email)) return false
  const domain = extractDomain(email)
  if (!domain) return false
  return !FREE_EMAIL_DOMAINS.has(domain)
}

/**
 * Validates whether an email is a legitimate company email address.
 * @param {string} email
 * @returns {{ valid: boolean, error?: string, domain?: string, isFreeProvider?: boolean }}
 */
export function validateCompanyEmail(email) {
  if (!email || !email.trim()) {
    return { valid: false, error: 'Please enter your work/company email address.' }
  }
  const cleanEmail = email.trim().toLowerCase()
  if (!isValidEmailFormat(cleanEmail)) {
    return { valid: false, error: 'Please enter a valid corporate email format (e.g. name@company.com).' }
  }
  const domain = extractDomain(cleanEmail)
  if (FREE_EMAIL_DOMAINS.has(domain)) {
    return {
      valid: false,
      error: `Work email required. Free domains (@${domain}) are not accepted for eBook downloads. Please use your official corporate email.`,
      isFreeProvider: true,
      domain
    }
  }
  return { valid: true, domain }
}
