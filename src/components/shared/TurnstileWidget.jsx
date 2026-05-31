import { useEffect, useRef } from 'react'
import { TURNSTILE_SITEKEY } from '../../config'

const SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js'

// Renders a Cloudflare Turnstile widget only when a site key is configured.
// On submit, the form reads the token via window.turnstile.getResponse().
// When no key is set this renders nothing, so the form works with the honeypot alone.
export default function TurnstileWidget() {
  const ref = useRef(null)

  useEffect(() => {
    if (!TURNSTILE_SITEKEY) return
    if (!document.querySelector(`script[src="${SCRIPT_SRC}"]`)) {
      const s = document.createElement('script')
      s.src = SCRIPT_SRC
      s.async = true
      s.defer = true
      document.head.appendChild(s)
    }
  }, [])

  if (!TURNSTILE_SITEKEY) return null
  return <div ref={ref} className="cf-turnstile td-form__turnstile" data-sitekey={TURNSTILE_SITEKEY} />
}
