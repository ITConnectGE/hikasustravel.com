// First-touch marketing attribution for Web3Forms inquiries.
//
// The site submits Web3Forms via a JSON fetch (see submitWeb3Form.js), not a
// native <form> POST, so attribution is injected into the submission payload
// rather than into hidden inputs. The values are read at submit time, which
// inherently covers modals, dynamically mounted forms, client-side navigation
// and immediate submits.
//
// First-touch values are stored for 90 days and never overwritten on later
// visits (internal navigation, direct returns, new campaigns, language switch).
//
// Cookies are first-party and hold no personal data — only the acquisition
// source, the original external referrer, and the first landing path.
//
// NOTE: these values are client-set and can be spoofed by a technical visitor;
// treat them as marketing signal only, not verified server-side data.

const COOKIE_DAYS = 90
const C_SOURCE = 'hikasus_first_source'
const C_REFERRER = 'hikasus_first_referrer'
const C_LANDING = 'hikasus_first_landing'

// Guard so the module is safe to import during the Node prerender/SSG build,
// where `document`/`window` do not exist.
const hasDom = () => typeof document !== 'undefined' && typeof window !== 'undefined'

function getCookie(name) {
  if (!hasDom()) return ''
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const match = document.cookie.match(new RegExp('(?:^|;\\s*)' + escaped + '=([^;]*)'))
  if (!match) return ''
  try {
    return decodeURIComponent(match[1])
  } catch {
    return match[1]
  }
}

function setCookie(name, value, days) {
  if (!hasDom()) return
  const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString()
  const secure = window.location.protocol === 'https:' ? ';Secure' : ''
  document.cookie =
    name + '=' + encodeURIComponent(value) + ';expires=' + expires + ';path=/;SameSite=Lax' + secure
}

function normalizeHostname(hostname) {
  return hostname.toLowerCase().replace(/^www\./, '')
}

// A referrer on the site's own domain is internal navigation, not an
// acquisition source, so it must never replace the stored first-touch value.
function isInternalReferrer(referrer) {
  if (!referrer || !hasDom()) return false
  try {
    return normalizeHostname(new URL(referrer).hostname) === normalizeHostname(window.location.hostname)
  } catch {
    return false
  }
}

function readableReferrerSource(referrer) {
  try {
    const host = normalizeHostname(new URL(referrer).hostname)
    if (host === 'google.com' || host.startsWith('google.')) return 'Google'
    if (host === 'bing.com') return 'Bing'
    if (host === 'tripadvisor.com' || host.includes('tripadvisor.')) return 'TripAdvisor'
    if (host === 'instagram.com' || host === 'l.instagram.com') return 'Instagram'
    if (host === 'facebook.com' || host === 'm.facebook.com' || host === 'l.facebook.com') return 'Facebook'
    if (host === 'youtube.com' || host === 'youtu.be') return 'YouTube'
    if (host === 't.co' || host === 'twitter.com' || host === 'x.com') return 'X / Twitter'
    return host
  } catch {
    return referrer || 'Direct / none'
  }
}

// The attribution implied by the CURRENT page load (used to seed first-touch).
function getCurrentAttribution() {
  const params = new URLSearchParams(window.location.search)
  const utmSource = params.get('utm_source')
  const utmMedium = params.get('utm_medium')
  const utmCampaign = params.get('utm_campaign')

  const rawReferrer = document.referrer || ''
  const externalReferrer = rawReferrer && !isInternalReferrer(rawReferrer) ? rawReferrer : ''

  let source = 'Direct / none'
  if (utmSource) {
    source = [utmSource, utmMedium, utmCampaign].filter(Boolean).join(' / ')
  } else if (externalReferrer) {
    source = readableReferrerSource(externalReferrer)
  }

  return {
    source,
    referrer: externalReferrer || 'none',
    landing: window.location.pathname + window.location.search,
  }
}

// Capture first-touch on the first eligible load. Each value is written only if
// absent, so the original attribution survives every later visit until the
// 90-day cookie expires. Call once, as early as possible, on the client.
export function initFirstTouchAttribution() {
  if (!hasDom()) return
  const current = getCurrentAttribution()
  if (!getCookie(C_SOURCE)) setCookie(C_SOURCE, current.source, COOKIE_DAYS)
  if (!getCookie(C_REFERRER)) setCookie(C_REFERRER, current.referrer, COOKIE_DAYS)
  if (!getCookie(C_LANDING)) setCookie(C_LANDING, current.landing, COOKIE_DAYS)
}

// The stored first-touch values as Web3Forms email fields. Field NAMES are the
// user-facing labels and are identical across all languages. Falls back to the
// current page's values if the cookies are missing (e.g. cookies disabled), so
// a submission is never sent with empty attribution.
export function getAttributionFields() {
  if (!hasDom()) {
    return { Source: 'Direct / none', Referrer: 'none', 'Landing Page': '' }
  }
  const current = getCurrentAttribution()
  return {
    Source: getCookie(C_SOURCE) || current.source,
    Referrer: getCookie(C_REFERRER) || current.referrer,
    'Landing Page': getCookie(C_LANDING) || current.landing,
  }
}
