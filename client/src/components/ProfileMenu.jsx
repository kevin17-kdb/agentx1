import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogOut } from 'lucide-react'
import { useAuth } from '../context/useAuth'

export default function ProfileMenu() {
  const { user, logout } = useAuth()
  const nav = useNavigate()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  if (!user) return null
  const initials = user.name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen((o) => !o)}
        title={user.name}
        style={{
          width: 34,
          height: 34,
          borderRadius: '50%',
          background: 'var(--lime)',
          color: 'var(--lime-ink)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 12,
          fontWeight: 800,
          border: 'none',
          cursor: 'pointer',
        }}
      >
        {initials}
      </button>

      {open && (
        <div
          style={{
            position: 'absolute',
            right: 0,
            top: 'calc(100% + 8px)',
            width: 220,
            background: 'var(--surface)',
            border: '1px solid var(--paper-line)',
            borderRadius: 14,
            boxShadow: 'var(--shadow-card)',
            padding: 8,
            zIndex: 60,
          }}
        >
          <div style={{ padding: '8px 10px', borderBottom: '1px solid var(--paper-line)' }}>
            <div style={{ fontWeight: 800, fontSize: 13.5, color: 'var(--ink)' }}>{user.name}</div>
            <div className="mono" style={{ fontSize: 11, color: 'var(--ink-soft)' }}>
              {user.studentId} · {user.role}
            </div>
          </div>
          <button
            onClick={() => {
              logout()
              nav('/login')
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              width: '100%',
              padding: '9px 10px',
              marginTop: 6,
              borderRadius: 8,
              background: 'transparent',
              border: 'none',
              color: 'var(--danger)',
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            <LogOut size={15} />
            Sign out
          </button>
        </div>
      )}
    </div>
  )
}