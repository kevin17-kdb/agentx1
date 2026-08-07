import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

export default function RequireAuth({ children }) {
  const { user, token, ready } = useAuth()
  const location = useLocation()

  if (!ready) {
    return (
      <div style={{ display: 'grid', placeItems: 'center', height: '100%', color: 'var(--text-muted)' }}>
        Loading…
      </div>
    )
  }
  if (!user || !token) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }
  return children
}