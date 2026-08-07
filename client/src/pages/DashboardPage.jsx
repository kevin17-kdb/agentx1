import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

export default function DashboardPage() {
  const { user } = useAuth()
  const nav = useNavigate()
  const firstName = user?.name?.split(' ')[0] || 'Student'

  const cards = [
    { to: '/chat', num: '01 · CHAT', title: 'AI Assistant', desc: 'Multi-agent chat with live execution graph & HITL review.', foot: ['Active', '7 agents'] },
    { to: '/student', num: '02 · CAMPUS', title: 'My Campus', desc: 'Profile, timetable, attendance and academic shortcuts.', foot: ['Synced', '82.4%'] },
    { to: '/services', num: '03 · SERVICES', title: 'Services', desc: 'Events, internships, student services and helpdesk.', foot: ['3 open', 'Live'] },
    { to: '/knowledge', num: '04 · KNOWLEDGE', title: 'Knowledge Base', desc: 'RAG-powered search across institutional documents.', foot: ['Indexed', '1.2k docs'] },
  ]

  return (
    <div className="paper-bg">
      <div style={{ padding: '80px 44px 30px', maxWidth: 'var(--content-max)', margin: '0 auto' }}>
        {/* Status strip */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '16px 20px',
            borderRadius: 14,
            background: 'var(--surface)',
            border: '1px solid var(--paper-line)',
            marginBottom: 44,
            fontSize: 14,
            fontWeight: 500,
            color: 'var(--ink)',
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: 'var(--lime)',
              boxShadow: '0 0 0 3px rgba(207, 238, 78, 0.35)',
              flexShrink: 0,
            }}
          />
          <span>
            <strong style={{ fontWeight: 800 }}>Welcome back, {firstName}</strong>
            {' — '}
            {user?.studentId || 'S101'} · what would you like to get done today?
          </span>
          <span
            className="mono"
            style={{
              marginLeft: 'auto',
              fontSize: 11.5,
              background: 'var(--lime)',
              color: 'var(--lime-ink)',
              padding: '5px 12px',
              borderRadius: 'var(--radius-full)',
              fontWeight: 700,
            }}
          >
            6 / 7 ACTIVE
          </span>
        </div>

        <SectionHead title="Workspace" />

        <div className="cardgrid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {cards.map((c) => (
            <button
              key={c.to}
              onClick={() => nav(c.to)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)'
                e.currentTarget.style.boxShadow = '0 16px 28px -18px rgba(27, 36, 28, 0.25)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}
              style={{
                textAlign: 'left',
                background: 'var(--surface)',
                border: '1px solid var(--paper-line)',
                borderRadius: 16,
                padding: 24,
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform .15s ease, box-shadow .15s ease',
              }}
            >
              <div className="mono" style={{ fontSize: 11, color: 'var(--moss)', marginBottom: 16, fontWeight: 600 }}>
                {c.num}
              </div>
              <h4 style={{ fontSize: 17, fontWeight: 800, marginBottom: 8, letterSpacing: '-0.01em', color: 'var(--ink)' }}>
                {c.title}
              </h4>
              <p style={{ fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.55, fontWeight: 500, flex: 1 }}>
                {c.desc}
              </p>
              <div
                className="mono"
                style={{
                  marginTop: 16,
                  paddingTop: 14,
                  borderTop: '1px solid var(--paper-line)',
                  fontSize: 10.5,
                  color: 'var(--ink-soft)',
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <span>{c.foot[0]}</span>
                <span>{c.foot[1]}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Forest stat panel (hero fold-in) + miniboxes */}
        <div
          style={{
            marginTop: 44,
            borderRadius: 18,
            background: 'var(--forest)',
            padding: '36px 40px',
            color: 'var(--paper-text-on-forest)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
            <div className="mono" style={{ fontSize: 10, letterSpacing: '0.08em', color: '#8FA089', textTransform: 'uppercase', lineHeight: 1.6 }}>
              Today's throughput
              <br />
              Automated workflows
            </div>
            <span
              className="mono"
              style={{
                fontSize: 10,
                letterSpacing: '0.06em',
                padding: '6px 12px',
                border: '1px solid var(--forest-line)',
                borderRadius: 100,
                color: 'var(--paper-text-on-forest)',
              }}
            >
              30D
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr 1fr', gap: 14 }}>
            {/* Statcard */}
            <div style={{ background: 'var(--forest-2)', border: '1px solid var(--forest-line)', borderRadius: 16, padding: 26 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div className="mono" style={{ fontSize: 10.5, letterSpacing: '0.06em', color: '#8FA089', textTransform: 'uppercase' }}>
                    Workflows completed
                  </div>
                  <div style={{ fontSize: 52, fontWeight: 800, letterSpacing: '-0.02em', marginTop: 10, color: '#fff' }}>142</div>
                  <div
                    className="mono"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 5,
                      fontSize: 11,
                      background: 'rgba(207,238,78,.14)',
                      color: 'var(--lime)',
                      padding: '4px 10px',
                      borderRadius: 100,
                      marginTop: 10,
                    }}
                  >
                    ↗ +18.4%
                  </div>
                </div>
                <span style={{ width: 30, height: 30, borderRadius: 8, background: 'var(--lime)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--lime-ink)', fontSize: 13 }}>
                  ✦
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 64, marginTop: 22 }}>
                {[30, 45, 26, 70, 38, 64, 34, 82, 40].map((h, i) => (
                  <i
                    key={i}
                    style={{
                      flex: 1,
                      borderRadius: '3px 3px 0 0',
                      height: `${h}%`,
                      background: [3, 5, 7].includes(i) ? 'var(--lime)' : 'var(--forest-line)',
                    }}
                  />
                ))}
              </div>
              <div
                className="mono"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginTop: 14,
                  paddingTop: 14,
                  borderTop: '1px solid var(--forest-line)',
                  fontSize: 9.5,
                  color: '#7C8C77',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                }}
              >
                <span>Academic · Events · Placement</span>
                <span>Δ 30D · Live</span>
              </div>
            </div>

            {/* Minibox: Actions */}
            <div style={{ background: 'var(--forest-2)', border: '1px solid var(--forest-line)', borderRadius: 14, padding: 18, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div className="mono" style={{ fontSize: 9.5, letterSpacing: '0.07em', color: '#8FA089', textTransform: 'uppercase', marginBottom: 13 }}>
                Actions
              </div>
              <div>
                <button
                  onClick={() => nav('/chat')}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    background: 'var(--lime)',
                    color: 'var(--lime-ink)',
                    fontWeight: 700,
                    fontSize: 13,
                    padding: '9px 16px',
                    borderRadius: 100,
                    border: 'none',
                    marginRight: 8,
                    cursor: 'pointer',
                  }}
                >
                  Sign in →
                </button>
                <button
                  onClick={() => nav('/knowledge')}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    background: 'transparent',
                    color: 'var(--paper-text-on-forest)',
                    fontWeight: 600,
                    fontSize: 13,
                    padding: '9px 16px',
                    borderRadius: 100,
                    border: '1px solid var(--forest-line)',
                    cursor: 'pointer',
                  }}
                >
                  Try demo
                </button>
              </div>
            </div>

            {/* Minibox: Range */}
            <div style={{ background: 'var(--forest-2)', border: '1px solid var(--forest-line)', borderRadius: 14, padding: 18, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div className="mono" style={{ fontSize: 9.5, letterSpacing: '0.07em', color: '#8FA089', textTransform: 'uppercase', marginBottom: 13 }}>
                Range
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                {[
                  { t: '7D', on: false },
                  { t: '30D', on: true },
                  { t: 'QTR', on: false },
                ].map((tab) => (
                  <span
                    key={tab.t}
                    className="mono"
                    style={{
                      fontSize: 11,
                      padding: '7px 13px',
                      borderRadius: 100,
                      color: tab.on ? 'var(--lime-ink)' : '#8FA089',
                      background: tab.on ? 'var(--lime)' : 'transparent',
                      border: `1px solid ${tab.on ? 'var(--lime)' : 'var(--forest-line)'}`,
                      fontWeight: tab.on ? 700 : 400,
                    }}
                  >
                    {tab.t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function SectionHead({ title }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginBottom: 28 }}>
      <h3 className="mono" style={{ fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--ink-soft)', fontWeight: 600 }}>
        {title}
      </h3>
      <div style={{ flex: 1, height: 1, background: 'var(--paper-line)' }} />
    </div>
  )
}