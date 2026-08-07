import { useState } from 'react'
import { Search } from 'lucide-react'
import { api } from '../api/client'

const SUGGESTIONS = [
  'attendance requirement',
  'examination regulations',
  'internship workshop registration',
  'condonation fee',
]

export default function KnowledgePage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const search = async (q) => {
    const text = (q ?? query).trim()
    if (!text || busy) return
    setQuery('')
    setBusy(true)
    setError('')
    try {
      const res = await api.ragSearch(text, 5)
      setResults(res.results || [])
    } catch (e) {
      setError(e.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="paper-bg" style={{ minHeight: '100vh' }}>
      <div style={{ padding: '70px 44px 40px', maxWidth: 'var(--content-max)', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginBottom: 28 }}>
          <h3 className="mono" style={{ fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--ink-soft)', fontWeight: 600 }}>
            Knowledge base
          </h3>
          <div style={{ flex: 1, height: 1, background: 'var(--paper-line)' }} />
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            search()
          }}
          style={{ display: 'flex', gap: 10, marginBottom: 20 }}
        >
          <div style={{ position: 'relative', flex: 1 }}>
            <Search
              size={16}
              color="var(--ink-soft)"
              style={{ position: 'absolute', left: 18, top: '50%', transform: 'translateY(-50%)' }}
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search campus regulations & documents…"
              style={{
                width: '100%',
                padding: '16px 18px 16px 44px',
                borderRadius: 12,
                border: '1px solid var(--paper-line)',
                background: 'var(--surface)',
                fontFamily: 'var(--font-mono)',
                fontSize: 13.5,
                color: 'var(--ink)',
                outline: 'none',
              }}
            />
          </div>
          <button
            type="submit"
            disabled={busy || !query.trim()}
            style={{
              background: busy ? 'var(--moss)' : 'var(--forest)',
              color: '#fff',
              border: 'none',
              padding: '0 26px',
              borderRadius: 12,
              fontWeight: 700,
              fontSize: 13.5,
              cursor: 'pointer',
              opacity: busy ? 0.7 : 1,
            }}
          >
            {busy ? 'Searching…' : 'Search'}
          </button>
        </form>

        <div style={{ display: 'flex', gap: 8, marginBottom: 34, flexWrap: 'wrap' }}>
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => search(s)}
              className="mono"
              style={{
                fontSize: 11.5,
                padding: '8px 14px',
                borderRadius: 100,
                border: '1px solid var(--paper-line)',
                background: 'var(--surface)',
                color: 'var(--ink-soft)',
                cursor: 'pointer',
              }}
            >
              {s}
            </button>
          ))}
        </div>

        {error && <div style={{ color: 'var(--danger)' }}>{error}</div>}

        {results !== null && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0, maxWidth: 900 }}>
            {results.length === 0 ? (
              <div style={{ color: 'var(--ink-soft)', fontSize: 14 }}>No documents matched your query.</div>
            ) : (
              results.map((r, i) => (
                <div
                  key={i}
                  style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--paper-line)',
                    borderRadius: 14,
                    padding: 22,
                    marginBottom: 14,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                    <h4 style={{ fontSize: 15.5, fontWeight: 800, color: 'var(--ink)' }}>{r.title}</h4>
                    <span
                      className="mono"
                      style={{
                        fontSize: 11,
                        background: 'var(--lime)',
                        color: 'var(--lime-ink)',
                        padding: '4px 10px',
                        borderRadius: 100,
                        fontWeight: 700,
                      }}
                    >
                      {r.relevance_score}
                    </span>
                  </div>
                  <div className="mono" style={{ fontSize: 10.5, color: 'var(--ink-soft)', marginBottom: 10 }}>
                    {r.doc_id} · {r.category}
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.6, fontWeight: 500 }}>{r.snippet}</div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}