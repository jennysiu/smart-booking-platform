import { useState } from 'react'

type Mode = 'login' | 'register'

interface AuthResponse {
  accessToken?: string
  user?: { id: string; email: string; role: string }
  error?: string
}

const API_BASE = 'http://localhost:3000'

// In-memory token store — never localStorage
let accessToken: string | null = null
export const getAccessToken = () => accessToken

export function useAuth() {
  const [mode, setMode] = useState<Mode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const reset = (nextMode: Mode) => {
    setMode(nextMode)
    setError(null)
    setSuccess(null)
    setEmail('')
    setPassword('')
    setConfirmPassword('')
  }

  const handleSubmit = async () => {
    setError(null)
    setSuccess(null)

    if (!email || !password) return setError('Email and password are required.')
    if (mode === 'register' && password !== confirmPassword) return setError("Passwords don't match.")
    if (password.length < 8) return setError('Password must be at least 8 characters.')

    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/auth/${mode === 'login' ? 'login' : 'register'}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      })

      const data: AuthResponse = await res.json()

      if (!res.ok) {
        setError(data.error ?? 'Something went wrong. Please try again.')
        return
      }

      if (data.accessToken) accessToken = data.accessToken

      if (mode === 'register') {
        setSuccess('Account created! You can now sign in.')
        reset('login')
      } else {
        setSuccess(`Welcome back, ${data.user?.email ?? ''}!`)
        // TODO: navigate('/dashboard')
      }
    } catch {
      setError('Could not reach the server. Is it running on port 3000?')
    } finally {
      setLoading(false)
    }
  }

  return {
    mode, email, password, confirmPassword,
    loading, error, success,
    setEmail, setPassword, setConfirmPassword,
    reset, handleSubmit,
  }
}