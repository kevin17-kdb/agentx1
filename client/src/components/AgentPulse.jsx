export default function AgentPulse() {
  return (
    <span
      className="topbar-pulse"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 7,
        fontFamily: 'var(--font-mono)',
        fontSize: 11,
        color: 'var(--ink-soft)',
        background: 'var(--surface)',
        border: '1px solid var(--paper-line)',
        padding: '6px 12px',
        borderRadius: 'var(--radius-full)',
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: 'var(--lime)',
          boxShadow: '0 0 0 3px rgba(207, 238, 78, 0.35)',
          display: 'inline-block',
        }}
      />
      7 AGENTS LIVE
    </span>
  )
}