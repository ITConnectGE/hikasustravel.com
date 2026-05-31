import { WEB3FORMS_KEY } from '../config'

// Posts a plain object of fields to Web3Forms, which emails the submission.
// Returns true on success, false otherwise. Throws are left to the caller (treated as errors).
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
    }),
  })
  const data = await res.json()
  return data.success === true
}
