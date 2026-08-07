import { useEffect, useState } from 'react'
import { Mail, Phone, MapPin, BookOpen, Award, CalendarDays } from 'lucide-react'
import { api } from '../api/client'
import { useAuth } from '../context/useAuth'

export default function StudentPage() {
  const { user } = useAuth()
  const [student, setStudent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api
      .students()
      .then((res) => {
        const mine = res.students.find((s) => s.id === user?.studentId) || res.students[0]
        setStudent(mine)
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [user?.studentId])

  const p = student?.attendance_percentage ?? 0
  const circumference = 2 * Math.PI * 42

  return (
    <div className="paper-bg" style={{ minHeight: '100vh' }}>
      <div style={{ padding: '70px 44px 40px', maxWidth: 'var(--content-max)', margin: '0 auto' }}>
        <SectionHead title="My Campus" sub="Profile, academics and attendance at a glance." />

        {loading && <div style={{ color: 'var(--ink-soft)' }}>Loading profile…</div>}
        {error && <div style={{ color: 'var(--danger)' }}>{error}</div>}

        {student && (
          <div className="student-grid" style={{ display: 'grid', gap: 18 }}>
            {/* Left column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              {/* Identity */}
              <Card>
                <div style={{ display: 'flex', gap: 16 }}>
                  <div
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: 16,
                      background: 'var(--forest)',
                      display: 'grid',
                      placeItems: 'center',
                      color: 'var(--lime)',
                      fontWeight: 800,
                      fontSize: 22,
                      flexShrink: 0,
                    }}
                  >
                    {student.name
                      .split(' ')
                      .map((w) => w[0])
                      .join('')}
                  </div>
                  <div>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 20, color: 'var(--ink)' }}>
                      {student.name}
                    </div>
                    <div className="mono" style={{ color: 'var(--ink-soft)', fontSize: 12, marginTop: 2 }}>
                      {student.roll_number} · {student.branch}
                    </div>
                    <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
                      <Tag>Year {student.year}</Tag>
                      <Tag>Sem {student.semester}</Tag>
                      <Tag>CGPA {student.gpa}</Tag>
                      <Tag tone={student.active_backlogs === 0 ? 'green' : 'amber'}>
                        {student.active_backlogs === 0 ? 'No backlogs' : `${student.active_backlogs} backlog`}
                      </Tag>
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 18, marginTop: 16, color: 'var(--ink-soft)', fontSize: 13, flexWrap: 'wrap' }}>
                  <span style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                    <Mail size={14} color="var(--moss)" /> {student.email}
                  </span>
                  <span style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                    <Phone size={14} color="var(--moss)" /> {student.phone}
                  </span>
                  <span style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                    <MapPin size={14} color="var(--moss)" /> {student.hostel_block}
                  </span>
                </div>
              </Card>

              {/* Courses */}
              <Card>
                <SectionTitle icon={<BookOpen size={14} />} title="Registered courses" />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {student.registered_courses.map((c, i) => (
                    <div
                      key={i}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '10px 12px',
                        borderRadius: 10,
                        background: 'var(--paper)',
                        border: '1px solid var(--paper-line)',
                      }}
                    >
                      <div>
                        <span className="mono" style={{ color: 'var(--moss)', fontSize: 12, marginRight: 8, fontWeight: 600 }}>
                          {c.code}
                        </span>
                        <span style={{ fontSize: 13.5, color: 'var(--ink)', fontWeight: 600 }}>{c.name}</span>
                      </div>
                      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                        <span className="mono" style={{ fontSize: 11, color: 'var(--ink-soft)' }}>
                          {c.credits} CR
                        </span>
                        <span style={{ fontSize: 12, color: 'var(--ink-soft)' }}>{c.faculty}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Skills */}
              <Card>
                <SectionTitle title="Skills & background" />
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
                  {student.skills.map((s) => (
                    <span
                      key={s}
                      className="mono"
                      style={{
                        fontSize: 12,
                        padding: '5px 10px',
                        borderRadius: 'var(--radius-full)',
                        background: 'var(--lime)',
                        color: 'var(--lime-ink)',
                        fontWeight: 600,
                      }}
                    >
                      {s}
                    </span>
                  ))}
                </div>
                <p style={{ color: 'var(--ink-soft)', fontSize: 13.5, fontWeight: 500 }}>{student.resume_summary}</p>
              </Card>
            </div>

            {/* Right column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              {/* Attendance ring */}
              <Card>
                <SectionTitle icon={<Award size={14} />} title="Attendance" />
                <div style={{ display: 'grid', placeItems: 'center', padding: '8px 0' }}>
                  <div style={{ position: 'relative', width: 120, height: 120 }}>
                    <svg width="120" height="120" viewBox="0 0 120 120">
                      <circle cx="60" cy="60" r="50" stroke="var(--paper)" strokeWidth="12" fill="none" />
                      <circle
                        cx="60"
                        cy="60"
                        r="50"
                        stroke={p >= 75 ? 'var(--forest)' : 'var(--moss)'}
                        strokeWidth="12"
                        fill="none"
                        strokeDasharray={circumference}
                        strokeDashoffset={circumference * (1 - p / 100)}
                        strokeLinecap="round"
                        transform="rotate(-90 60 60)"
                      />
                    </svg>
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        display: 'grid',
                        placeItems: 'center',
                      }}
                    >
                      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 24, color: 'var(--ink)' }}>
                        {p}%
                      </div>
                    </div>
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--ink-soft)', marginTop: 6, fontWeight: 500 }}>
                    {student.attended_classes}/{student.total_classes} classes
                  </div>
                  <div
                    style={{
                      marginTop: 10,
                      padding: '6px 12px',
                      borderRadius: 'var(--radius-full)',
                      fontSize: 12,
                      background: 'rgba(207,238,78,.4)',
                      color: 'var(--lime-ink)',
                      fontWeight: 700,
                    }}
                  >
                    {p >= 75 ? 'Eligible for exams' : 'Below 75% — condonation may apply'}
                  </div>
                </div>
              </Card>

              {/* Calendar */}
              {student.calendar_events?.length > 0 && (
                <Card>
                  <SectionTitle icon={<CalendarDays size={14} />} title="Upcoming" />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {student.calendar_events.map((ev, i) => (
                      <div
                        key={i}
                        style={{
                          padding: '10px 12px',
                          borderRadius: 10,
                          background: 'var(--paper)',
                          border: '1px solid var(--paper-line)',
                        }}
                      >
                        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink)' }}>{ev.title}</div>
                        <div className="mono" style={{ fontSize: 11, color: 'var(--ink-soft)', marginTop: 2 }}>
                          {ev.date} · {ev.time} · {ev.category}
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </div>
          </div>
        )}
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
        padding: 20,
      }}
    >
      {children}
    </div>
  )
}

function SectionTitle({ icon, title }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14, fontWeight: 800, fontSize: 14, color: 'var(--ink)' }}>
      {icon}
      {title}
    </div>
  )
}

function SectionHead({ title, sub }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <h1 style={{ fontSize: 30, fontWeight: 800, color: 'var(--ink)', letterSpacing: '-0.02em' }}>{title}</h1>
      {sub && <p style={{ color: 'var(--ink-soft)', marginTop: 6, fontWeight: 500 }}>{sub}</p>}
    </div>
  )
}

function Tag({ children, tone }) {
  const c =
    tone === 'green'
      ? { bg: 'rgba(207,238,78,.4)', fg: 'var(--lime-ink)', b: 'rgba(75,93,72,0.2)' }
      : tone === 'amber'
        ? { bg: 'rgba(192,83,61,.1)', fg: 'var(--danger)', b: 'rgba(192,83,61,.3)' }
        : { bg: 'var(--paper)', fg: 'var(--ink-soft)', b: 'var(--paper-line)' }
  return (
    <span
      className="mono"
      style={{ fontSize: 12, padding: '4px 9px', borderRadius: 'var(--radius-full)', background: c.bg, color: c.fg, border: `1px solid ${c.b}`, fontWeight: 600 }}
    >
      {children}
    </span>
  )
}