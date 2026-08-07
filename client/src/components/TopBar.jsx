import { NavLink } from 'react-router-dom'
import AgentPulse from './AgentPulse'
import ProfileMenu from './ProfileMenu'

export default function TopBar() {
  return (
    <header
      style={{
        height: 'var(--topbar-height)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '20px 44px',
        background: 'var(--paper)',
        borderBottom: '1px solid var(--paper-line)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}
    >
      <BrandMark />

      <nav style={{ display: 'flex', gap: 2 }}>
        <NavItem to="/dashboard" label="Dashboard" />
        <NavItem to="/chat" label="Chat" />
        <NavItem to="/student" label="Student" />
        <NavItem to="/services" label="Services" />
        <NavItem to="/knowledge" label="Knowledge" />
      </nav>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <AgentPulse />
        <ProfileMenu />
      </div>
    </header>
  )
}

function BrandMark() {
  return (
    <a href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <span
        style={{
          width: 38,
          height: 38,
          borderRadius: 10,
          background: 'var(--forest)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L21 7V17L12 22L3 17V7L12 2Z" stroke="#CFEE4E" strokeWidth="1.6" />
          <circle cx="12" cy="12" r="2.6" fill="#CFEE4E" />
        </svg>
      </span>
      <span style={{ fontWeight: 800, fontSize: 18, letterSpacing: '-0.01em', color: 'var(--ink)' }}>
        AgentX
      </span>
    </a>
  )
}

function NavItem({ to, label }) {
  return (
    <NavLink
      to={to}
      style={({ isActive }) => ({
        padding: '9px 15px',
        borderRadius: 'var(--radius-full)',
        fontSize: 13.5,
        fontWeight: 600,
        color: isActive ? 'var(--paper-text-on-forest)' : 'var(--ink-soft)',
        background: isActive ? 'var(--forest)' : 'transparent',
      })}
    >
      {label}
    </NavLink>
  )
}