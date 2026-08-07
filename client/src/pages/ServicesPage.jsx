import { useEffect, useState } from 'react'
import { CalendarDays, Briefcase, Bus, Award, HelpCircle, ChevronDown } from 'lucide-react'
import { api } from '../api/client'
import { useAuth } from '../context/useAuth'

const TABS = [
  { id: 'events', label: 'Events', icon: <CalendarDays size={15} /> },
  { id: 'internships', label: 'Internships', icon: <Briefcase size={15} /> },
  { id: 'transport', label: 'Transport', icon: <Bus size={15} /> },
  { id: 'scholarships', label: 'Scholarships', icon: <Award size={15} /> },
  { id: 'faqs', label: 'Help & FAQ', icon: <HelpCircle size={15} /> },
]

export default function ServicesPage() {
  const { user } = useAuth()
  const [tab, setTab] = useState('events')
  const [data, setData] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.allSettled([
      api.events(),
      api.internships(),
      api.transport(),
      api.scholarships(),
      api.faqs(),
    ]).then(([e, i, t, s, f]) => {
      setData({
        events: e.status === 'fulfilled' ? e.value.events : [],
        internships: i.status === 'fulfilled' ? i.value.internships : [],
        transport: t.status === 'fulfilled' ? t.value.routes : [],
        scholarships: s.status === 'fulfilled' ? s.value.scholarships : [],
        faqs: f.status === 'fulfilled' ? f.value.faqs : [],
      })
      setLoading(false)
    })
  }, [])

  return (
    <div className="paper-bg" style={{ minHeight: '100vh' }}>
      <div style={{ padding: '70px 44px 40px', maxWidth: 'var(--content-max)', margin: '0 auto' }}>
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 30, fontWeight: 800, color: 'var(--ink)', letterSpacing: '-0.02em' }}>Campus Services</h1>
          <p style={{ color: 'var(--ink-soft)', marginTop: 6, fontWeight: 500 }}>
            Everything the agents can act on — events, internships, transport and more.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '9px 15px',
                borderRadius: 'var(--radius-full)',
                fontSize: 13.5,
                fontWeight: 700,
                fontFamily: 'var(--font-mono)',
                border: '1px solid',
                borderColor: tab === t.id ? 'var(--forest)' : 'var(--paper-line)',
                background: tab === t.id ? 'var(--forest)' : 'var(--surface)',
                color: tab === t.id ? 'var(--paper-text-on-forest)' : 'var(--ink-soft)',
              }}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>

        {loading && <div style={{ color: 'var(--ink-soft)' }}>Loading services…</div>}

        {!loading && tab === 'events' && <EventsList events={data.events} />}
        {!loading && tab === 'internships' && <InternshipsList list={data.internships} user={user} />}
        {!loading && tab === 'transport' && <TransportList routes={data.transport} />}
        {!loading && tab === 'scholarships' && <ScholarshipsList list={data.scholarships} />}
        {!loading && tab === 'faqs' && <FaqList faqs={data.faqs} />}
      </div>
    </div>
  )
}

function Card({ children }) {
  return (
    <div
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--paper-line)',
        borderRadius: 'var(--radius-lg)',
        padding: 18,
      }}
    >
      {children}
    </div>
  )
}

function ChipLime({ children }) {
  return (
    <span
      className="mono"
      style={{
        fontSize: 10.5,
        padding: '4px 9px',
        borderRadius: 'var(--radius-full)',
        background: 'var(--lime)',
        color: 'var(--lime-ink)',
        fontWeight: 700,
        display: 'inline-block',
      }}
    >
      {children}
    </span>
  )
}

function EventsList({ events }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
      {events.map((ev) => (
        <Card key={ev.id}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <ChipLime>{ev.category}</ChipLime>
            <span className="mono" style={{ fontSize: 11, color: 'var(--ink-soft)' }}>
              Left: {ev.seats_left}
            </span>
          </div>
          <div style={{ fontWeight: 800, fontSize: 15, color: 'var(--ink)', marginBottom: 10 }}>{ev.title}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 13, color: 'var(--ink-soft)', fontWeight: 500 }}>
            <div>🗓 {ev.date} · {ev.time}</div>
            <div>📍 {ev.location}</div>
            <div>🗣 {ev.speaker || ev.organizer}</div>
          </div>
        </Card>
      ))}
    </div>
  )
}

function InternshipsList({ list, user }) {
  const year = user?.studentId === 'S101' ? 3 : user?.studentId === 'S102' ? 4 : 2
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {list.map((job) => {
        const eligible = job.eligible_years.includes(year)
        return (
          <Card key={job.id}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
              <div>
                <div className="mono" style={{ fontSize: 10.5, color: 'var(--moss)', marginBottom: 3, fontWeight: 700 }}>
                  {job.company.toUpperCase()}
                </div>
                <div style={{ fontWeight: 800, fontSize: 15.5, color: 'var(--ink)' }}>{job.role}</div>
              </div>
              <span
                style={{
                  padding: '5px 11px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: 12,
                  fontWeight: 700,
                  background: eligible ? 'var(--lime)' : 'rgba(75,93,72,.12)',
                  color: eligible ? 'var(--lime-ink)' : 'var(--moss)',
                  whiteSpace: 'nowrap',
                }}
              >
                {eligible ? 'Eligible for you' : 'Check criteria'}
              </span>
            </div>
            <div style={{ display: 'flex', gap: 16, marginTop: 12, fontSize: 12.5, color: 'var(--ink-soft)', flexWrap: 'wrap', fontWeight: 500 }}>
              <span>💰 {job.stipend}</span>
              <span>⏱ {job.duration}</span>
              <span>🗓 Deadline {job.deadline}</span>
              <span>🎯 Min CGPA {job.min_cgpa}</span>
            </div>
            <p style={{ fontSize: 13.5, color: 'var(--ink-soft)', marginTop: 12, fontWeight: 500 }}>{job.description}</p>
          </Card>
        )
      })}
    </div>
  )
}

function TransportList({ routes }) {
  const [open, setOpen] = useState(null)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {routes.map((r) => (
        <Card key={r.id}>
          <div
            onClick={() => setOpen(open === r.id ? null : r.id)}
            style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
          >
            <div>
              <div style={{ fontWeight: 800, fontSize: 15, color: 'var(--ink)' }}>{r.route}</div>
              <div style={{ fontSize: 12.5, color: 'var(--ink-soft)', marginTop: 2 }}>
                Pickup {r.pickup} · Drop {r.drop}
              </div>
            </div>
            <ChevronDown
              size={18}
              color="var(--ink-soft)"
              style={{ transform: open === r.id ? 'rotate(180deg)' : 'none', transition: 'transform 180ms' }}
            />
          </div>
          {open === r.id && (
            <div style={{ display: 'flex', gap: 6, marginTop: 12, flexWrap: 'wrap' }}>
              {r.stops.map((s, i) => (
                <span
                  key={i}
                  className="mono"
                  style={{
                    fontSize: 11,
                    padding: '4px 9px',
                    borderRadius: 'var(--radius-full)',
                    background: 'var(--paper)',
                    border: '1px solid var(--paper-line)',
                    color: 'var(--ink-soft)',
                  }}
                >
                  {s}
                </span>
              ))}
            </div>
          )}
        </Card>
      ))}
    </div>
  )
}

function ScholarshipsList({ list }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
      {list.map((s) => (
        <Card key={s.id}>
          <ChipLime>{s.category}</ChipLime>
          <div style={{ fontWeight: 800, fontSize: 15, color: 'var(--ink)', marginTop: 10 }}>{s.name}</div>
          <div style={{ fontSize: 14, color: 'var(--moss)', marginTop: 4, fontWeight: 700 }}>{s.amount}</div>
          <div style={{ fontSize: 13, color: 'var(--ink-soft)', marginTop: 8, fontWeight: 500 }}>
            <span className="mono" style={{ color: 'var(--ink-soft)' }}>
              Criteria:
            </span>{' '}
            {s.criteria}
          </div>
          <div className="mono" style={{ fontSize: 11, color: 'var(--ink-soft)', marginTop: 10 }}>
            Deadline: {s.deadline}
          </div>
        </Card>
      ))}
    </div>
  )
}

function FaqList({ faqs }) {
  const [open, setOpen] = useState(null)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 760 }}>
      {faqs.map((f, i) => (
        <Card key={i}>
          <div
            onClick={() => setOpen(open === i ? null : i)}
            style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}
          >
            <div style={{ fontWeight: 800, fontSize: 14.5, color: 'var(--ink)' }}>{f.q}</div>
            <ChevronDown
              size={17}
              color="var(--ink-soft)"
              style={{ transform: open === i ? 'rotate(180deg)' : 'none', transition: 'transform 180ms', flexShrink: 0 }}
            />
          </div>
          {open === i && (
            <p style={{ fontSize: 13.5, color: 'var(--ink-soft)', marginTop: 12, lineHeight: 1.6, fontWeight: 500 }}>{f.a}</p>
          )}
        </Card>
      ))}
    </div>
  )
}