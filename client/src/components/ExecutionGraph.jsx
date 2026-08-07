export default function ExecutionGraph({ graph }) {
  if (!graph || !graph.nodes || graph.nodes.length === 0) return null

  return (
    <div>
      <div className="mono" style={{ fontSize: 10, letterSpacing: '0.08em', color: '#8FA089', textTransform: 'uppercase', marginBottom: 18 }}>
        Execution graph
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {graph.nodes.map((node, idx) => {
          const needsApproval = node.status === 'requires_approval'
          return (
            <div key={node.id} style={{ display: 'flex', gap: 12, marginBottom: idx < graph.nodes.length - 1 ? 18 : 0 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    background: 'var(--lime)',
                    color: 'var(--lime-ink)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 11,
                    flexShrink: 0,
                  }}
                >
                  {needsApproval ? '!' : '✓'}
                </span>
                {idx < graph.nodes.length - 1 && (
                  <span style={{ width: 1.5, minHeight: 14, background: 'var(--forest-line)', flex: 1 }} />
                )}
              </div>
              <div>
                <div style={{ color: needsApproval ? 'var(--lime)' : '#fff', fontSize: 13, fontWeight: 700 }}>
                  {node.label}
                </div>
                <div className="mono" style={{ fontSize: 11, color: '#7C8C77', marginTop: 2 }}>
                  {node.agent} · {node.status.replace('_', ' ')}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}