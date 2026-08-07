import { useState } from 'react'
import { useNavigate, useLocation, Navigate } from 'react-router-dom'
import { AlertCircle } from 'lucide-react'
import { useAuth } from '../context/useAuth'
import './LoginPage.css'

export default function LoginPage() {
  const { user, token, ready, login } = useAuth()
  const nav = useNavigate()
  const location = useLocation()
  const [uid, setUid] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  if (ready && user && token) return <Navigate to="/dashboard" replace />

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      await login(uid.trim(), password)
      nav(location.state?.from?.pathname || '/dashboard', { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="paper-bg login-page">
      <div className="login-card">
        <div className="login-brand">
          <span className="login-brand-badge">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L21 7V17L12 22L3 17V7L12 2Z" stroke="#CFEE4E" strokeWidth="1.6" />
              <circle cx="12" cy="12" r="2.6" fill="#CFEE4E" />
            </svg>
          </span>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 18, color: 'var(--ink)' }}>
              AgentX
            </div>
            <div className="login-sub">Smart Campus Multi-Agent System</div>
          </div>
        </div>

        <div>
          <h1 className="login-title">Log in</h1>
        </div>

        {error && (
          <div className="login-error">
            <AlertCircle size={15} />
            {error}
          </div>
        )}

        <form onSubmit={submit}>
          <div className="login-fields">
            <div>
              <label className="login-field-label" htmlFor="login-uid">
                UID
              </label>
              <input
                id="login-uid"
                className="login-input"
                value={uid}
                onChange={(e) => setUid(e.target.value)}
                placeholder="e.g. chen"
                autoFocus
              />
            </div>
            <div>
              <label className="login-field-label" htmlFor="login-password">
                Password
              </label>
              <input
                id="login-password"
                className="login-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
          </div>

          <button type="submit" className="login-btn" disabled={busy || !uid || !password}>
            {busy ? 'Signing in…' : "Let's go!"}
            {!busy && <span className="login-btn-arrow">→</span>}
          </button>
        </form>

        <div className="login-demo">Demo: chen / chen@2026 · rahul / rahul@2026</div>
      </div>
    </div>
  )
}