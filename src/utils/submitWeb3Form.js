import { WEB3FORMS_KEY } from '../config'
import { getAttributionFields } from './attribution'

// Posts a plain object of fields to Web3Forms, which emails the submission.
// Returns true on success, false otherwise. Throws are left to the caller (treated as errors).
//
// First-touch attribution (Source / Referrer / Landing Page) is merged in here,
// the single point every form submission flows through, so it covers all forms
// — current and future, including modal and dynamically mounted ones — and is
// read fresh at submit time. Attribution keys go last so they are authoritative.
export async function submitWeb3Form(fields) {
  const res = await fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      access_key: WEB3FORMS_KEY,
      from_name: 'Hikasus Travel Website',
      ...fields,
      ...getAttributionFields(),
    }),
  })
  const data = await res.json()
  return data.success === true
}
