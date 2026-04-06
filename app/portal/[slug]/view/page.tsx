import { checkPortalAuth, getPortalData } from '@/app/actions/portal'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'

const STEPS = ['Proposal', 'Agreement', 'Pre-Production', 'Production', 'Post-Production', 'Wrap & Invoice']

function getStep(status: string): number {
  switch (status) {
    case 'Lead':
    case 'Discovery':          return 1
    case 'Proposal Sent':
    case 'Awaiting Approval':  return 2
    case 'Pre-Production':     return 3
    case 'Shoot Booked':       return 4
    case 'Editing':            return 5
    case 'Delivered':          return 6
    default:                   return 1
  }
}

function Badge({ type }: { type: 'pending' | 'active' | 'done' | 'review' }) {
  const styles = {
    pending: { background: 'rgba(90,99,88,0.10)', color: '#6A7568' },
    active:  { background: 'rgba(5,79,153,0.08)',  color: '#054F99' },
    done:    { background: 'rgba(22,130,60,0.10)',  color: '#146830' },
    review:  { background: 'rgba(180,110,10,0.10)', color: '#8A5500' },
  }
  const labels = { pending: 'Pending', active: 'In Progress', done: 'Done', review: 'In Review' }
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '5px 11px', borderRadius: '100px', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.7px', ...styles[type] }}>
      <span style={{ fontSize: '7px' }}>●</span>
      {labels[type]}
    </span>
  )
}

export default async function PortalViewPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const isAuthenticated = await checkPortalAuth(slug)
  if (!isAuthenticated) redirect(`/portal/${slug}`)

  const data = await getPortalData(slug)
  if (!data) notFound()

  const { client, projects, links, updates, proposals } = data
  const displayName = client.brand_name || client.name
  const firstName = client.name.split(' ')[0]
  const currentStep = getStep(client.status || 'Lead')
  const mainProject = projects[0]
  const activeProposals = proposals.filter((p: { status: string }) => p.status !== 'Draft')

  const S = {
    page:    { fontFamily: "'Poppins', system-ui, sans-serif", background: '#E7ECE7', color: '#1E1E1E', minHeight: '100vh', lineHeight: '1.6', WebkitFontSmoothing: 'antialiased' } as React.CSSProperties,
    card:    { background: '#FFFFFF', border: '1px solid #D2DAD2', borderRadius: '20px', padding: '28px 32px' } as React.CSSProperties,
    secIcon: { width: '36px', height: '36px', background: '#FFFFFF', border: '1.5px solid #D2DAD2', borderRadius: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 } as React.CSSProperties,
    secHead: { display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' } as React.CSSProperties,
    btnPrimary: { display: 'inline-flex', alignItems: 'center', gap: '7px', padding: '11px 24px', borderRadius: '100px', fontSize: '13px', fontWeight: 600, background: '#054F99', color: '#FFFFFF', textDecoration: 'none' } as React.CSSProperties,
    btnGhost: { display: 'inline-flex', alignItems: 'center', gap: '7px', padding: '9px 20px', borderRadius: '100px', fontSize: '13px', fontWeight: 600, color: '#054F99', border: '1.5px solid #054F99', background: 'transparent', textDecoration: 'none' } as React.CSSProperties,
  }

  return (
    <div style={S.page}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap'); *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }`}</style>

      {/* Top bar */}
      <header style={{ background: '#FFFFFF', borderBottom: '1px solid #D2DAD2', padding: '14px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '32px', height: '32px', background: '#054F99', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '15px' }}>≋</div>
          <span style={{ fontSize: '13px', fontWeight: 800, color: '#1E1E1E', letterSpacing: '0.5px', textTransform: 'uppercase' }}>Creative Wave Media</span>
        </div>
        <div style={{ fontSize: '12px', fontWeight: 500, color: 'rgba(30,30,30,0.55)' }}>
          {displayName}{mainProject ? ` · ${mainProject.name}` : ''}
        </div>
      </header>

      {/* Hero */}
      <section style={{ maxWidth: '920px', margin: '0 auto', padding: '64px 40px 48px' }}>
        <div style={{ display: 'inline-block', fontSize: '11px', fontWeight: 600, letterSpacing: '0.5px', color: '#1E1E1E', border: '1.5px solid #D2DAD2', borderRadius: '100px', padding: '4px 14px', marginBottom: '20px' }}>
          Client Portal
        </div>
        <h1 style={{ fontSize: '42px', fontWeight: 900, letterSpacing: '-1.5px', lineHeight: 1.1, color: '#1E1E1E', marginBottom: '16px', textTransform: 'lowercase' }}>
          welcome, {firstName.toLowerCase()}.
        </h1>
        <p style={{ fontSize: '16px', color: 'rgba(30,30,30,0.55)', maxWidth: '580px', lineHeight: 1.7 }}>
          Everything for <strong style={{ color: '#1E1E1E', fontWeight: 600 }}>{mainProject?.name || displayName}</strong> lives right here — your proposal, project details, files, and updates. Bookmark this page and check back any time.
        </p>
      </section>

      {/* Timeline */}
      <div style={{ maxWidth: '920px', margin: '0 auto 56px', padding: '0 40px' }}>
        <div style={{ display: 'flex', background: '#FFFFFF', border: '1px solid #D2DAD2', borderRadius: '20px', overflow: 'hidden' }}>
          {STEPS.map((step, i) => {
            const n = i + 1
            const isDone   = n < currentStep
            const isActive = n === currentStep
            return (
              <div key={step} style={{ flex: 1, padding: '16px 10px', textAlign: 'center', background: isActive ? 'rgba(5,79,153,0.08)' : 'transparent', borderRight: i < STEPS.length - 1 ? '1px solid #D2DAD2' : 'none' }}>
                <div style={{ fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: isDone ? '#146830' : isActive ? '#054F99' : 'rgba(30,30,30,0.35)', marginBottom: '3px' }}>
                  {String(n).padStart(2, '0')}
                </div>
                <div style={{ fontSize: '12px', fontWeight: isActive ? 700 : 600, color: isDone ? '#146830' : isActive ? '#054F99' : 'rgba(30,30,30,0.55)' }}>
                  {step}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Main */}
      <main style={{ maxWidth: '920px', margin: '0 auto', padding: '0 40px 96px', display: 'flex', flexDirection: 'column', gap: '52px' }}>

        {/* 1 — Proposal */}
        <section>
          <div style={S.secHead}>
            <div style={S.secIcon}>📄</div>
            <div>
              <div style={{ fontSize: '18px', fontWeight: 700 }}>Proposal</div>
              <div style={{ fontSize: '13px', color: 'rgba(30,30,30,0.55)', marginTop: '1px' }}>Scope, deliverables, timeline & investment</div>
            </div>
          </div>

          {activeProposals.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {activeProposals.map((p: { id: string; title: string; status: string; price: number | null }) => (
                <div key={p.id} style={S.card}>
                  <div style={{ fontSize: '15px', fontWeight: 700, marginBottom: '8px' }}>Project Proposal — {p.title}</div>
                  <div style={{ fontSize: '14px', color: 'rgba(30,30,30,0.55)', lineHeight: 1.7, marginBottom: '22px' }}>
                    This document covers everything we discussed: the creative concept, what we'll deliver, the production timeline, and the total investment.
                    {p.price && <> Total investment: <strong style={{ color: '#1E1E1E' }}>${Number(p.price).toLocaleString()}</strong>.</>}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Badge type="done" />
                    <Link href={`/portal/${slug}/proposal/${p.id}`} style={S.btnPrimary}>
                      📄 View Proposal
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={S.card}>
              <div style={{ fontSize: '15px', fontWeight: 700, marginBottom: '8px' }}>Proposal</div>
              <div style={{ fontSize: '14px', color: 'rgba(30,30,30,0.55)', lineHeight: 1.7, marginBottom: '22px' }}>
                Your proposal is being prepared and will appear here once it's ready.
              </div>
              <Badge type="pending" />
            </div>
          )}
        </section>

        {/* 2 — Project Details */}
        {projects.length > 0 && (
          <section>
            <div style={S.secHead}>
              <div style={S.secIcon}>🎬</div>
              <div>
                <div style={{ fontSize: '18px', fontWeight: 700 }}>Project Details</div>
                <div style={{ fontSize: '13px', color: 'rgba(30,30,30,0.55)', marginTop: '1px' }}>Dates, deliverables & what we're making</div>
              </div>
            </div>
            {projects.map((project: { id: string; name: string; shoot_date: string | null; deadline: string | null; deliverables: string | null }) => (
              <div key={project.id} style={{ ...S.card, marginBottom: '12px' }}>
                <div style={{ fontSize: '15px', fontWeight: 700, marginBottom: '16px' }}>{project.name}</div>
                {(project.shoot_date || project.deadline) && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: project.deliverables ? '20px' : '0' }}>
                    {project.shoot_date && (
                      <div>
                        <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.7px', color: 'rgba(30,30,30,0.35)', marginBottom: '4px' }}>Shoot Date</div>
                        <div style={{ fontSize: '14px', fontWeight: 600 }}>{new Date(project.shoot_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                      </div>
                    )}
                    {project.deadline && (
                      <div>
                        <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.7px', color: 'rgba(30,30,30,0.35)', marginBottom: '4px' }}>Delivery</div>
                        <div style={{ fontSize: '14px', fontWeight: 600 }}>{new Date(project.deadline).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                      </div>
                    )}
                  </div>
                )}
                {project.deliverables && (
                  <div>
                    <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.7px', color: 'rgba(30,30,30,0.35)', marginBottom: '8px' }}>Deliverables</div>
                    <ul style={{ listStyle: 'none' }}>
                      {project.deliverables.split('\n').filter(Boolean).map((d: string, i: number) => (
                        <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 0', fontSize: '14px', color: 'rgba(30,30,30,0.7)', borderBottom: '1px solid #D2DAD2' }}>
                          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#054F99', opacity: 0.4, flexShrink: 0 }} />
                          {d}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </section>
        )}

        {/* 3 — Files & Links */}
        {links.length > 0 && (
          <section>
            <div style={S.secHead}>
              <div style={S.secIcon}>🗂️</div>
              <div>
                <div style={{ fontSize: '18px', fontWeight: 700 }}>Files & Links</div>
                <div style={{ fontSize: '13px', color: 'rgba(30,30,30,0.55)', marginTop: '1px' }}>Shared documents, drafts & deliverables</div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {links.map((link: { id: string; label: string; url: string }) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#FFFFFF', border: '1px solid #D2DAD2', borderRadius: '14px', padding: '16px 24px', textDecoration: 'none' }}
                >
                  <span style={{ fontSize: '14px', fontWeight: 600, color: '#1E1E1E' }}>{link.label}</span>
                  <span style={S.btnGhost}>View →</span>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* 4 — Updates */}
        {updates.length > 0 && (
          <section>
            <div style={S.secHead}>
              <div style={S.secIcon}>💬</div>
              <div>
                <div style={{ fontSize: '18px', fontWeight: 700 }}>Updates</div>
                <div style={{ fontSize: '13px', color: 'rgba(30,30,30,0.55)', marginTop: '1px' }}>Latest from Creative Wave</div>
              </div>
            </div>
            <div style={{ background: '#FFFFFF', border: '1px solid #D2DAD2', borderRadius: '20px', overflow: 'hidden' }}>
              {updates.map((update: { id: string; message: string; created_at: string }, i: number) => (
                <div key={update.id} style={{ padding: '20px 32px', borderBottom: i < updates.length - 1 ? '1px solid #D2DAD2' : 'none' }}>
                  <p style={{ fontSize: '14px', color: '#1E1E1E', lineHeight: 1.65, marginBottom: '4px' }}>{update.message}</p>
                  <p style={{ fontSize: '12px', color: 'rgba(30,30,30,0.35)' }}>{new Date(update.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 5 — Testimonial */}
        <section>
          <div style={S.secHead}>
            <div style={S.secIcon}>⭐</div>
            <div>
              <div style={{ fontSize: '18px', fontWeight: 700 }}>Project Wrap</div>
              <div style={{ fontSize: '13px', color: 'rgba(30,30,30,0.55)', marginTop: '1px' }}>We'd love to hear how it went</div>
            </div>
          </div>
          <div style={{ background: '#054F99', border: '1px solid #054F99', borderRadius: '20px', padding: '28px 32px' }}>
            <div style={{ fontSize: '15px', fontWeight: 700, color: '#FFFFFF', marginBottom: '8px' }}>Share Your Experience</div>
            <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.75)', lineHeight: 1.7, marginBottom: '22px' }}>
              Once you've received your final files and you're happy with everything, a short testimonial goes a long way — even just two or three sentences about working together. Takes less than two minutes.
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '5px 11px', borderRadius: '100px', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.7px', background: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.7)' }}>
                <span style={{ fontSize: '7px' }}>●</span> After final delivery
              </span>
              <a href="mailto:oscar@creativewave.nz?subject=Testimonial" style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', padding: '11px 24px', borderRadius: '100px', fontSize: '13px', fontWeight: 600, background: '#FFFFFF', color: '#054F99', textDecoration: 'none' }}>
                ⭐ Leave a Testimonial
              </a>
            </div>
          </div>
        </section>

        {/* Contact note */}
        <div style={{ borderRadius: '14px', padding: '16px 20px', fontSize: '13px', lineHeight: 1.65, background: '#FFFFFF', border: '1px solid #D2DAD2', color: 'rgba(30,30,30,0.55)' }}>
          💬 <strong style={{ color: '#1E1E1E', fontWeight: 600 }}>Got a question?</strong> Get in touch at{' '}
          <a href="mailto:oscar@creativewave.nz" style={{ color: '#054F99', fontWeight: 600, textDecoration: 'none' }}>oscar@creativewave.nz</a>
        </div>

      </main>

      {/* Footer */}
      <footer style={{ textAlign: 'center', padding: '32px 40px', fontSize: '12px', fontWeight: 500, color: 'rgba(30,30,30,0.35)', borderTop: '1px solid #D2DAD2', background: '#FFFFFF' }}>
        <p>Creative Wave Media · <a href="mailto:oscar@creativewave.nz" style={{ color: 'rgba(30,30,30,0.35)', textDecoration: 'none' }}>oscar@creativewave.nz</a> · <a href="https://www.creativewave.nz" style={{ color: 'rgba(30,30,30,0.35)', textDecoration: 'none' }}>www.creativewave.nz</a></p>
        <p style={{ marginTop: '5px' }}>This portal is private and intended for {displayName} only.</p>
      </footer>
    </div>
  )
}
