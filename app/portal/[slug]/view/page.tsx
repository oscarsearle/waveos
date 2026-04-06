import { checkPortalAuth, getPortalData } from '@/app/actions/portal'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

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

  return (
    <div style={{
      fontFamily: 'var(--font-poppins, "Poppins", system-ui, sans-serif)',
      background: 'linear-gradient(135deg, #05080f 0%, #061428 40%, #0a2550 100%)',
      minHeight: '100vh',
      color: '#e8eeff',
      WebkitFontSmoothing: 'antialiased',
    }}>

      {/* Header */}
      <header style={{ borderBottom: '1px solid #162035', padding: '14px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(5,8,15,0.6)', backdropFilter: 'blur(12px)', position: 'sticky', top: 0, zIndex: 100 }}>
        <Image
          src="/wave-os-logo copy 2.svg"
          alt="Wave OS"
          width={100}
          height={20}
          priority
        />
        <div style={{ fontSize: '12px', color: '#3d5475' }}>
          {displayName}{mainProject ? ` · ${mainProject.name}` : ''}
        </div>
      </header>

      <main style={{ maxWidth: '860px', margin: '0 auto', padding: '48px 40px 96px' }}>

        {/* Hero */}
        <div style={{ marginBottom: '48px' }}>
          <div style={{ display: 'inline-block', fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#00B7FF', background: 'rgba(0,183,255,0.08)', border: '1px solid rgba(0,183,255,0.2)', borderRadius: '100px', padding: '4px 12px', marginBottom: '16px' }}>
            Client Portal
          </div>
          <h1 style={{ fontSize: '36px', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1, color: '#e8eeff', marginBottom: '12px' }}>
            Welcome, {firstName}.
          </h1>
          <p style={{ fontSize: '15px', color: '#3d5475', maxWidth: '520px', lineHeight: 1.7 }}>
            Everything for <span style={{ color: '#8ba4c8', fontWeight: 600 }}>{mainProject?.name || displayName}</span> lives here — your proposal, project details, shared files, and updates. Bookmark this page and check back any time.
          </p>
        </div>

        {/* Timeline */}
        <div style={{ background: 'rgba(11,17,32,0.7)', border: '1px solid #162035', borderRadius: '16px', overflow: 'hidden', marginBottom: '40px', display: 'flex' }}>
          {STEPS.map((step, i) => {
            const n = i + 1
            const isDone   = n < currentStep
            const isActive = n === currentStep
            return (
              <div key={step} style={{ flex: 1, padding: '14px 8px', textAlign: 'center', background: isActive ? 'rgba(0,183,255,0.07)' : 'transparent', borderRight: i < STEPS.length - 1 ? '1px solid #162035' : 'none' }}>
                <div style={{ fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: isDone ? '#00B7FF' : isActive ? '#00B7FF' : '#2d4060', marginBottom: '3px' }}>
                  {String(n).padStart(2, '0')}
                </div>
                <div style={{ fontSize: '11px', fontWeight: isActive ? 700 : 500, color: isDone ? '#00B7FF' : isActive ? '#00B7FF' : '#3d5475' }}>
                  {step}
                </div>
                {isDone && (
                  <div style={{ fontSize: '9px', color: '#00B7FF', marginTop: '2px', opacity: 0.7 }}>✓</div>
                )}
              </div>
            )
          })}
        </div>

        {/* Sections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

          {/* Proposal */}
          <div style={{ background: 'rgba(11,17,32,0.7)', border: '1px solid #162035', borderRadius: '16px', padding: '28px 32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <div style={{ width: '32px', height: '32px', background: 'rgba(0,183,255,0.08)', border: '1px solid rgba(0,183,255,0.15)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', flexShrink: 0 }}>📄</div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#e8eeff' }}>Proposal</div>
                <div style={{ fontSize: '12px', color: '#3d5475' }}>Scope, deliverables, timeline & investment</div>
              </div>
            </div>

            {activeProposals.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {activeProposals.map((p: { id: string; title: string; price: number | null }) => (
                  <div key={p.id} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid #1a2a45', borderRadius: '12px', padding: '18px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 600, color: '#e8eeff', marginBottom: '4px' }}>{p.title}</div>
                      {p.price && <div style={{ fontSize: '12px', color: '#3d5475' }}>Investment: ${Number(p.price).toLocaleString()}</div>}
                    </div>
                    <Link href={`/portal/${slug}/proposal/${p.id}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '9px 20px', borderRadius: '100px', fontSize: '12px', fontWeight: 600, background: '#054F99', color: '#fff', textDecoration: 'none', whiteSpace: 'nowrap', flexShrink: 0 }}>
                      View Proposal →
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ fontSize: '13px', color: '#3d5475' }}>Your proposal is being prepared and will appear here once it's ready.</p>
            )}
          </div>

          {/* Project Details */}
          {projects.length > 0 && (
            <div style={{ background: 'rgba(11,17,32,0.7)', border: '1px solid #162035', borderRadius: '16px', padding: '28px 32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <div style={{ width: '32px', height: '32px', background: 'rgba(0,183,255,0.08)', border: '1px solid rgba(0,183,255,0.15)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', flexShrink: 0 }}>🎬</div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#e8eeff' }}>Project Details</div>
                  <div style={{ fontSize: '12px', color: '#3d5475' }}>Dates, deliverables & what we're creating</div>
                </div>
              </div>
              {projects.map((project: { id: string; name: string; shoot_date: string | null; deadline: string | null; deliverables: string | null }) => (
                <div key={project.id}>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#8ba4c8', marginBottom: '14px' }}>{project.name}</div>
                  {(project.shoot_date || project.deadline) && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: project.deliverables ? '20px' : '0' }}>
                      {project.shoot_date && (
                        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid #1a2a45', borderRadius: '10px', padding: '14px 16px' }}>
                          <div style={{ fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#2d4060', marginBottom: '5px' }}>Shoot Date</div>
                          <div style={{ fontSize: '14px', fontWeight: 600, color: '#e8eeff' }}>{new Date(project.shoot_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                        </div>
                      )}
                      {project.deadline && (
                        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid #1a2a45', borderRadius: '10px', padding: '14px 16px' }}>
                          <div style={{ fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#2d4060', marginBottom: '5px' }}>Delivery</div>
                          <div style={{ fontSize: '14px', fontWeight: 600, color: '#e8eeff' }}>{new Date(project.deadline).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                        </div>
                      )}
                    </div>
                  )}
                  {project.deliverables && (
                    <div>
                      <div style={{ fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#2d4060', marginBottom: '10px' }}>Deliverables</div>
                      <ul style={{ listStyle: 'none' }}>
                        {project.deliverables.split('\n').filter(Boolean).map((d: string, i: number) => (
                          <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 0', fontSize: '13px', color: '#8ba4c8', borderBottom: '1px solid #162035' }}>
                            <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#00B7FF', opacity: 0.5, flexShrink: 0 }} />
                            {d}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Files & Links */}
          {links.length > 0 && (
            <div style={{ background: 'rgba(11,17,32,0.7)', border: '1px solid #162035', borderRadius: '16px', padding: '28px 32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <div style={{ width: '32px', height: '32px', background: 'rgba(0,183,255,0.08)', border: '1px solid rgba(0,183,255,0.15)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', flexShrink: 0 }}>🗂️</div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#e8eeff' }}>Files & Links</div>
                  <div style={{ fontSize: '12px', color: '#3d5475' }}>Shared documents, drafts & deliverables</div>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {links.map((link: { id: string; label: string; url: string }) => (
                  <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.02)', border: '1px solid #1a2a45', borderRadius: '10px', padding: '14px 18px', textDecoration: 'none' }}>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#e8eeff' }}>{link.label}</span>
                    <span style={{ fontSize: '12px', color: '#00B7FF' }}>Open →</span>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Updates */}
          {updates.length > 0 && (
            <div style={{ background: 'rgba(11,17,32,0.7)', border: '1px solid #162035', borderRadius: '16px', padding: '28px 32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <div style={{ width: '32px', height: '32px', background: 'rgba(0,183,255,0.08)', border: '1px solid rgba(0,183,255,0.15)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', flexShrink: 0 }}>💬</div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#e8eeff' }}>Updates</div>
                  <div style={{ fontSize: '12px', color: '#3d5475' }}>Latest from Creative Wave</div>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {updates.map((update: { id: string; message: string; created_at: string }, i: number) => (
                  <div key={update.id} style={{ padding: '14px 0', borderBottom: i < updates.length - 1 ? '1px solid #162035' : 'none' }}>
                    <p style={{ fontSize: '13px', color: '#8ba4c8', lineHeight: 1.65, marginBottom: '4px' }}>{update.message}</p>
                    <p style={{ fontSize: '11px', color: '#2d4060' }}>{new Date(update.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Testimonial */}
          <div style={{ background: 'rgba(5,79,153,0.15)', border: '1px solid rgba(0,183,255,0.15)', borderRadius: '16px', padding: '28px 32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{ width: '32px', height: '32px', background: 'rgba(0,183,255,0.1)', border: '1px solid rgba(0,183,255,0.2)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', flexShrink: 0 }}>⭐</div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#e8eeff' }}>Project Wrap</div>
                <div style={{ fontSize: '12px', color: '#3d5475' }}>We'd love to hear how it went</div>
              </div>
            </div>
            <p style={{ fontSize: '13px', color: '#3d5475', lineHeight: 1.7, marginBottom: '20px' }}>
              Once you've received your final files and are happy with everything, a short testimonial goes a long way — even just two or three sentences about working together. It takes less than two minutes and helps other businesses understand what Creative Wave is actually like to work with.
            </p>
            <a href="mailto:oscar@creativewave.nz?subject=Testimonial" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '9px 20px', borderRadius: '100px', fontSize: '12px', fontWeight: 600, background: 'rgba(0,183,255,0.1)', color: '#00B7FF', border: '1px solid rgba(0,183,255,0.2)', textDecoration: 'none' }}>
              Leave a Testimonial →
            </a>
          </div>

          {/* Contact */}
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid #162035', borderRadius: '12px', padding: '16px 20px', fontSize: '13px', color: '#3d5475', lineHeight: 1.65 }}>
            Got a question? Reach out at{' '}
            <a href="mailto:oscar@creativewave.nz" style={{ color: '#00B7FF', fontWeight: 600, textDecoration: 'none' }}>oscar@creativewave.nz</a>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer style={{ textAlign: 'center', padding: '28px 40px', fontSize: '11px', color: '#2d4060', borderTop: '1px solid #162035' }}>
        <p>Creative Wave Media · <a href="mailto:oscar@creativewave.nz" style={{ color: '#2d4060', textDecoration: 'none' }}>oscar@creativewave.nz</a> · <a href="https://www.creativewave.nz" style={{ color: '#2d4060', textDecoration: 'none' }}>www.creativewave.nz</a></p>
        <p style={{ marginTop: '4px' }}>This portal is private and intended for {displayName} only.</p>
      </footer>
    </div>
  )
}
