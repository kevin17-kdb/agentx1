import { useEffect, useRef, useState } from 'react'
import { Send, ShieldAlert } from 'lucide-react'
import { api } from '../api/client'
import { useAuth } from '../context/useAuth'
import Markdown from '../components/Markdown'
import ExecutionGraph from '../components/ExecutionGraph'

const QUICK_PROMPTS = [
  'Am I eligible for the Google internship?',
  'What events are happening this week?',
  'Show my attendance percentage',
  'Find hostel scholarship info',
]

export default function ChatPage() {
  const { user } = useAuth()
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [hitl, setHitl] = useState(null)
  const [hitlResult, setHitlResult] = useState('')
  const [error, setError] = useState('')
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, busy])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const send = async (text) => {
    const query = (text ?? input).trim()
    if (!query || busy) return
    setInput('')
    setError('')
    setHitl(null)
    setHitlResult('')
    const userMsg = { role: 'user', content: query }
    setMessages((m) => [...m, userMsg])

    setBusy(true)
    try {
      const res = await api.chat(query)
      setMessages((m) => [
        ...m,
        {
          role: 'assistant',
          content: res.final_markdown_response || 'No response received.',
          graph: res.execution_graph,
          logs: res.agent_logs || [],
          hitl_pending: !!res.hitl_pending,
          payload: res.hitl_payload || null,
        },
      ])
      if (res.hitl_pending && res.hitl_payload) {
        setHitl(res.hitl_payload)
      }
    } catch (err) {
      setError(err.message || 'Something went wrong.')
      setMessages((m) => m.filter((x) => x !== userMsg))
    } finally {
      setBusy(false)
    }
  }

  const approve = async (action) => {
    if (!hitl) return
    setHitlResult(action === 'approve' ? 'Approving…' : 'Rejecting…')
    try {
      const res = await api.hitlRespond(hitl.draft_id, action)
      setHitlResult(
        res.status === 'success'
          ? action === 'approve'
            ? 'Email approved & dispatched.'
            : 'Draft rejected.'
          : res.error || 'Done.'
      )
      setHitl(null)
    } catch (err) {
      setHitlResult(err.message)
    }
  }

  return (
    <div className="chatsection" style={{ background: 'var(--forest)', padding: '70px 44px', marginTop: 40 }}>
      <div
        className="chatwrap"
        style={{
          maxWidth: 'var(--content-max)',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: 20,
        }}
      >
        {/* Chat column */}
        <div
          style={{
            background: 'var(--forest-2)',
            border: '1px solid var(--forest-line)',
            borderRadius: 'var(--radius-lg)',
            display: 'flex',
            flexDirection: 'column',
            height: 'calc(100vh - var(--topbar-height) - 160px)',
            minHeight: 480,
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '22px 26px',
              borderBottom: '1px solid var(--forest-line)',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <span
              style={{
                width: 34,
                height: 34,
                borderRadius: 9,
                background: 'var(--lime)',
                color: 'var(--lime-ink)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
              }}
            >
              ✦
            </span>
            <div>
              <div style={{ color: '#fff', fontSize: 15, fontWeight: 700 }}>AgentX Assistant</div>
              <div className="mono" style={{ color: '#8FA089', fontSize: 11.5, marginTop: 2 }}>
                MULTI-AGENT PLANNER · RAG · HITL GATING
              </div>
            </div>
          </div>

          {/* Messages */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '24px 26px',
              color: '#C6D2C2',
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
            }}
          >
            {messages.length === 0 && !busy && (
              <div style={{ margin: 'auto', textAlign: 'center', maxWidth: 420 }}>
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 16,
                    background: 'var(--lime)',
                    color: 'var(--lime-ink)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 24,
                    fontWeight: 800,
                    margin: '0 auto 16px',
                  }}
                >
                  ✦
                </div>
                <h3 style={{ fontSize: 19, color: '#fff', marginBottom: 6 }}>
                  Hi {user?.name?.split(' ')[0] || 'there'}
                </h3>
                <p style={{ color: '#8FA089', fontSize: 13.5, marginBottom: 20 }}>
                  Ask me anything — internships, exam rules, events, schedules. Agents plan,
                  retrieve from knowledge, and act.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {QUICK_PROMPTS.map((p) => (
                    <button
                      key={p}
                      onClick={() => send(p)}
                      style={{
                        textAlign: 'left',
                        padding: '10px 14px',
                        borderRadius: 10,
                        background: 'var(--forest)',
                        border: '1px solid var(--forest-line)',
                        color: '#9FB09A',
                        fontSize: 13,
                        cursor: 'pointer',
                      }}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, i) => (
              <MessageBubble key={i} msg={msg} />
            ))}

            {busy && (
              <div style={{ display: 'flex', gap: 10 }}>
                <span
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: 8,
                    background: 'var(--forest)',
                    border: '1px solid var(--forest-line)',
                    flexShrink: 0,
                  }}
                />
                <div style={{ display: 'flex', gap: 4, alignItems: 'center', padding: '10px 0' }}>
                  <Dot delay="0s" />
                  <Dot delay="0.15s" />
                  <Dot delay="0.3s" />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* HITL banner */}
          {hitl && (
            <div
              style={{
                margin: '0 26px 12px',
                padding: '14px 16px',
                borderRadius: 12,
                background: 'rgba(207,238,78,.12)',
                border: '1px solid rgba(207,238,78,.4)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <ShieldAlert size={16} color="var(--lime)" />
                <span style={{ fontWeight: 800, fontSize: 13.5, color: 'var(--lime)' }}>
                  Human approval required
                </span>
              </div>
              <div style={{ fontSize: 13, color: '#C6D2C2', marginBottom: 4 }}>
                <div>
                  <span className="mono" style={{ color: '#7C8C77' }}>
                    To:
                  </span>{' '}
                  {hitl.recipient}
                </div>
                <div>
                  <span className="mono" style={{ color: '#7C8C77' }}>
                    Subject:
                  </span>{' '}
                  {hitl.subject}
                </div>
              </div>
              <div
                className="mono"
                style={{
                  fontSize: 12,
                  color: '#C6D2C2',
                  background: 'rgba(22,36,28,.6)',
                  padding: '10px 12px',
                  borderRadius: 8,
                  whiteSpace: 'pre-wrap',
                  marginBottom: 12,
                  maxHeight: 110,
                  overflowY: 'auto',
                }}
              >
                {hitl.body}
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  onClick={() => approve('approve')}
                  disabled={!!hitlResult}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 100,
                    border: 'none',
                    background: 'var(--lime)',
                    color: 'var(--lime-ink)',
                    fontWeight: 700,
                    fontSize: 13,
                  }}
                >
                  Approve & send →
                </button>
                <button
                  onClick={() => approve('reject')}
                  disabled={!!hitlResult}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 100,
                    border: '1px solid var(--forest-line)',
                    background: 'transparent',
                    color: '#C6D2C2',
                    fontSize: 13,
                  }}
                >
                  Reject
                </button>
                {hitlResult && (
                  <span style={{ alignSelf: 'center', fontSize: 12.5, color: 'var(--lime)' }}>{hitlResult}</span>
                )}
              </div>
            </div>
          )}

          {error && (
            <div
              style={{
                margin: '0 26px 12px',
                padding: '10px 14px',
                borderRadius: 10,
                background: 'var(--danger-soft)',
                color: 'var(--danger)',
                fontSize: 13,
              }}
            >
              {error}
            </div>
          )}

          {/* Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault()
              send()
            }}
            style={{ padding: 18, borderTop: '1px solid var(--forest-line)', display: 'flex', gap: 10 }}
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about internships, exam rules, events…"
              style={{
                flex: 1,
                padding: '13px 15px',
                borderRadius: 10,
                background: 'var(--forest)',
                border: '1px solid var(--forest-line)',
                color: '#C6D2C2',
                fontSize: 14,
                fontFamily: 'var(--font-mono)',
                outline: 'none',
              }}
            />
            <button
              type="submit"
              disabled={busy || !input.trim()}
              style={{
                width: 46,
                borderRadius: 10,
                border: 'none',
                background: busy ? 'var(--forest-line)' : 'var(--lime)',
                color: busy ? '#7C8C77' : 'var(--lime-ink)',
                display: 'grid',
                placeItems: 'center',
              }}
            >
              <Send size={18} />
            </button>
          </form>
        </div>

        {/* Right rail: graph */}
        <div style={{ width: '100%' }}>
          <div
            style={{
              background: 'var(--forest-2)',
              border: '1px solid var(--forest-line)',
              borderRadius: 'var(--radius-lg)',
              padding: 24,
              position: 'sticky',
              top: 'calc(var(--topbar-height) + 28px)',
            }}
          >
            {messages.some((m) => m.graph) ? (
              <ExecutionGraph graph={messages.filter((m) => m.graph).slice(-1)[0].graph} />
            ) : (
              <div style={{ color: '#7C8C77', fontSize: 13 }}>
                <div className="mono" style={{ fontSize: 10, letterSpacing: '0.08em', marginBottom: 18, textTransform: 'uppercase' }}>
                  Execution graph
                </div>
                Send a message to see the live agent pipeline.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function Dot({ delay }) {
  return (
    <span
      style={{
        width: 7,
        height: 7,
        borderRadius: '50%',
        background: 'var(--lime)',
        animation: `typing 1.2s ${delay} infinite`,
      }}
    />
  )
}

function MessageBubble({ msg }) {
  if (msg.role === 'user') {
    return (
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <div
          style={{
            maxWidth: '78%',
            padding: '11px 15px',
            borderRadius: '14px 14px 4px 14px',
            background: 'var(--lime)',
            color: 'var(--lime-ink)',
            fontSize: 14,
            fontWeight: 700,
            whiteSpace: 'pre-wrap',
          }}
        >
          {msg.content}
        </div>
      </div>
    )
  }
  return (
    <div style={{ display: 'flex', gap: 10 }}>
      <span
        style={{
          width: 26,
          height: 26,
          borderRadius: 8,
          background: 'var(--forest)',
          border: '1px solid var(--forest-line)',
          flexShrink: 0,
          display: 'grid',
          placeItems: 'center',
          fontSize: 13,
          color: 'var(--lime)',
        }}
      >
        ✦
      </span>
      <div
        style={{
          maxWidth: '82%',
          padding: '13px 16px',
          borderRadius: '4px 14px 14px 14px',
          background: 'var(--forest)',
          border: '1px solid var(--forest-line)',
          color: '#C6D2C2',
        }}
      >
        <Markdown text={msg.content} />
        {msg.logs?.length > 0 && (
          <div style={{ marginTop: 12, paddingTop: 10, borderTop: '1px solid var(--forest-line)' }}>
            <div className="mono" style={{ fontSize: 9.5, color: '#7C8C77', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Agent log
            </div>
            {msg.logs.map((log, i) => (
              <div key={i} style={{ fontSize: 12.5, color: '#9FB09A', marginBottom: 5 }}>
                <b style={{ color: 'var(--lime)', fontWeight: 700 }}>{log.agent}</b> — {log.details}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}