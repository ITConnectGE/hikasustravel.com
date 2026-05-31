import { useState, useCallback } from 'react'
import { submitWeb3Form } from '../utils/submitWeb3Form'

// Owns the network status for a form: 'idle' | 'sending' | 'success' | 'error'.
// Validation stays in each form component (the two forms have different fields).
export default function useWeb3Form() {
  const [status, setStatus] = useState('idle')

  const submit = useCallback(async (fields) => {
    setStatus('sending')
    try {
      const ok = await submitWeb3Form(fields)
      setStatus(ok ? 'success' : 'error')
      return ok
    } catch {
      setStatus('error')
      return false
    }
  }, [])

  const reset = useCallback(() => setStatus('idle'), [])

  return { status, submit, reset }
}
