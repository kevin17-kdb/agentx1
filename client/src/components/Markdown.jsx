const INLINE = /\*\*(.+?)\*\*|`(.+?)`|_([^_]+)_/g

function renderInline(text) {
  const parts = []
  let last = 0
  let m
  INLINE.lastIndex = 0
  while ((m = INLINE.exec(text))) {
    if (m.index > last) parts.push(text.slice(last, m.index))
    if (m[1]) {
      parts.push(
        <strong key={parts.length} style={{ fontWeight: 800, color: 'inherit' }}>
          {m[1]}
        </strong>
      )
    } else if (m[2]) {
      parts.push(
        <code key={parts.length} className="mono" style={{ background: 'rgba(207,238,78,.18)', padding: '1px 6px', borderRadius: 5, fontSize: 12.5, color: 'var(--lime)' }}>
          {m[2]}
        </code>
      )
    } else if (m[3]) {
      parts.push(
        <em key={parts.length} style={{ fontStyle: 'italic' }}>
          {m[3]}
        </em>
      )
    }
    last = m.index + m[0].length
  }
  if (last < text.length) parts.push(text.slice(last))
  return parts
}

function renderLine(block, i) {
  if (block === '') return null

  if (block.startsWith('### ')) {
    return (
      <h4 key={i} style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 800, margin: '14px 0 6px' }}>
        {renderInline(block.slice(4))}
      </h4>
    )
  }
  if (block.startsWith('## ')) {
    return (
      <h3 key={i} style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 800, margin: '14px 0 6px' }}>
        {renderInline(block.slice(3))}
      </h3>
    )
  }
  if (block.startsWith('> ')) {
    return (
      <div
        key={i}
        style={{
          borderLeft: '3px solid var(--lime)',
          padding: '8px 12px',
          margin: '8px 0',
          background: 'rgba(207,238,78,.12)',
          borderRadius: '0 8px 8px 0',
          color: 'inherit',
          fontSize: 13.5,
        }}
      >
        {renderInline(block.slice(2))}
      </div>
    )
  }
  if (/^[-*] /.test(block)) {
    return (
      <div key={i} style={{ display: 'flex', gap: 8, margin: '4px 0' }}>
        <span style={{ color: 'var(--lime)' }}>•</span>
        <span>{renderInline(block.slice(2))}</span>
      </div>
    )
  }
  return (
    <p key={i} style={{ margin: '6px 0', lineHeight: 1.6 }}>
      {renderInline(block)}
    </p>
  )
}

export default function Markdown({ text = '', muted = false }) {
  const blocks = String(text).replace(/^\s+|\s+$/g, '').split('\n')
  return (
    <div style={{ fontSize: muted ? 13.5 : 14.5, color: muted ? 'var(--ink-soft)' : 'inherit' }}>
      {blocks.map(renderLine)}
    </div>
  )
}