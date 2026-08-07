import { Outlet } from 'react-router-dom'
import TopBar from './TopBar'

export default function AppShell() {
  return (
    <div style={{ minHeight: '100%', background: 'var(--paper)' }}>
      <TopBar />
      <main style={{ maxWidth: 'var(--content-max)', margin: '0 auto' }}>
        <Outlet />
      </main>
      <footer
        style={{
          padding: '30px 44px',
          borderTop: '1px solid var(--paper-line)',
          display: 'flex',
          justifyContent: 'space-between',
          fontFamily: 'var(--font-mono)',
          fontSize: 10.5,
          color: 'var(--ink-soft)',
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
        }}
      >
        <span>AgentX · Field System v1</span>
        <span>Manrope + JetBrains Mono · Paper / Forest</span>
      </footer>
    </div>
  )
}