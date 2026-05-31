import { TURNSTILE_SITEKEY } from '../config'

// Reads the current Cloudflare Turnstile token (empty string if disabled/unavailable).
// The forms call this on submit and include it in the Web3Forms payload.
export function getTurnstileToken() {
  if (!TURNSTILE_SITEKEY) return ''
  try {
    return window.turnstile?.getResponse?.() || ''
  } catch {
    return ''
  }
}
