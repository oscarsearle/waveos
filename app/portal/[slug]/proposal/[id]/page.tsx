import { checkPortalAuth } from '@/app/actions/portal'
import { createServiceClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'

export default async function ProposalViewPage({
  params,
}: {
  params: Promise<{ slug: string; id: string }>
}) {
  const { slug, id } = await params

  const isAuthenticated = await checkPortalAuth(slug)
  if (!isAuthenticated) redirect(`/portal/${slug}`)

  const supabase = await createServiceClient()

  // Fetch client for this slug
  const { data: client } = await supabase
    .from('clients')
    .select('id, name, brand_name, email, portal_enabled')
    .eq('portal_slug', slug)
    .single()

  if (!client || !client.portal_enabled) notFound()

  // Fetch proposal, verify it belongs to this client
  const { data: proposal } = await supabase
    .from('proposals')
    .select('*')
    .eq('id', id)
    .eq('client_id', client.id)
    .single()

  if (!proposal) notFound()

  const displayName = client.brand_name || client.name
  const deliverablesList = proposal.deliverables
    ? proposal.deliverables.split('\n').filter(Boolean)
    : []
  const addOnsList = proposal.add_ons
    ? proposal.add_ons.split('\n').filter(Boolean)
    : []

  return (
    <div style={{ background: '#E9EFE6', color: '#1A1A1A', fontFamily: "'Poppins', sans-serif", fontSize: '16px', lineHeight: '1.6', minHeight: '100vh' }}>

      {/* Google Font */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
      `}</style>

      {/* Nav */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 100, background: '#104EA1', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 56px', height: '60px' }}>
        <span style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '0.06em', color: 'rgba(255,255,255,0.85)' }}>
          @creativewave.nz
        </span>
        <div style={{ display: 'flex', gap: '36px' }}>
          {['Introduction', 'Scope', 'Pricing', 'Next Steps'].map(s => (
            <a key={s} href={`#${s.toLowerCase().replace(' ', '-')}`} style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '12px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              {s}
            </a>
          ))}
        </div>
      </nav>

      {/* Hero */}
      <section style={{ background: '#104EA1' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '72px 56px 0' }}>
          {/* Top bar */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '52px' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '0.08em', color: 'rgba(255,255,255,0.7)', lineHeight: '1.6' }}>
              @creativewave.nz
              <span style={{ display: 'block', fontWeight: 400, fontSize: '12px', color: 'rgba(255,255,255,0.45)', letterSpacing: '0.04em', marginTop: '2px' }}>Creative Wave Media</span>
            </div>
            <div style={{ textAlign: 'right', fontSize: '12px', color: 'rgba(255,255,255,0.45)', letterSpacing: '0.04em' }}>
              {new Date(proposal.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
            </div>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.18)' }} />

          {/* Title row */}
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', padding: '52px 0 48px', gap: '32px' }}>
            <h1 style={{ fontWeight: 900, fontSize: 'clamp(72px, 11vw, 116px)', lineHeight: '0.92', color: '#fff', letterSpacing: '-0.03em' }}>
              proposal.
            </h1>
            <div style={{ textAlign: 'right', color: 'rgba(255,255,255,0.7)', fontSize: '13.5px', lineHeight: '1.8', paddingBottom: '6px', flexShrink: 0 }}>
              {proposal.title}<br />
              <strong style={{ fontWeight: 700, color: '#fff' }}>{displayName}</strong>
            </div>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.18)' }} />

          {/* Prepared for / by */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', padding: '44px 0 64px' }}>
            <div>
              <h4 style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.45)', marginBottom: '12px' }}>Prepared for.</h4>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14.5px', lineHeight: '1.85' }}>
                {client.name}<br />
                {client.email && <a href={`mailto:${client.email}`} style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none' }}>{client.email}</a>}
                {client.email && <br />}
                {displayName}
              </p>
            </div>
            <div>
              <h4 style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.45)', marginBottom: '12px' }}>Prepared by.</h4>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14.5px', lineHeight: '1.85' }}>
                Oscar Searle<br />
                0210 842 3490<br />
                <a href="mailto:oscar@creativewave.nz" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none' }}>oscar@creativewave.nz</a><br />
                <br />
                Creative Wave Media<br />
                Wānaka, NZ
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 56px' }}>

        {/* Introduction */}
        <div id="introduction" style={{ paddingTop: '80px' }}>
          <hr style={{ border: 'none', borderTop: '1px solid rgba(26,26,26,0.12)' }} />
          <h2 style={{ fontWeight: 900, fontSize: 'clamp(52px, 7.5vw, 88px)', lineHeight: '0.95', color: '#1A1A1A', letterSpacing: '-0.03em', padding: '32px 0 28px' }}>introduction.</h2>
          <hr style={{ border: 'none', borderTop: '1px solid rgba(26,26,26,0.12)' }} />
        </div>
        <section style={{ paddingBottom: '64px' }}>
          <div style={{ padding: '40px 0' }}>
            <p style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#104EA1', marginBottom: '14px' }}>Hi {client.name.split(' ')[0]},</p>
            <p style={{ fontSize: '15.5px', color: '#4a4a4a', maxWidth: '620px', lineHeight: '1.75', marginBottom: '14px' }}>
              Thank you for considering Creative Wave Media for your project. We specialise in creating high-quality video and photography content that helps local businesses tell their story, attract customers, and grow.
            </p>
            <p style={{ fontSize: '15.5px', color: '#4a4a4a', maxWidth: '620px', lineHeight: '1.75' }}>
              Below is a detailed outline of what we can offer for {displayName}. Once you've had a look and are ready to proceed, just let us know.
            </p>
          </div>
        </section>

        {/* Project Overview */}
        {proposal.scope && (
          <>
            <div>
              <hr style={{ border: 'none', borderTop: '1px solid rgba(26,26,26,0.12)' }} />
              <h2 style={{ fontWeight: 900, fontSize: 'clamp(52px, 7.5vw, 88px)', lineHeight: '0.95', color: '#1A1A1A', letterSpacing: '-0.03em', padding: '32px 0 28px' }}>project overview.</h2>
              <hr style={{ border: 'none', borderTop: '1px solid rgba(26,26,26,0.12)' }} />
            </div>
            <section style={{ paddingBottom: '64px' }}>
              <div style={{ padding: '40px 0' }}>
                <p style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#104EA1', marginBottom: '14px' }}>Project Goal.</p>
                <p style={{ fontSize: '15.5px', color: '#4a4a4a', maxWidth: '620px', lineHeight: '1.75' }}>{proposal.scope}</p>
              </div>
            </section>
          </>
        )}

        {/* Scope of Work */}
        {deliverablesList.length > 0 && (
          <>
            <div id="scope">
              <hr style={{ border: 'none', borderTop: '1px solid rgba(26,26,26,0.12)' }} />
              <h2 style={{ fontWeight: 900, fontSize: 'clamp(52px, 7.5vw, 88px)', lineHeight: '0.95', color: '#1A1A1A', letterSpacing: '-0.03em', padding: '32px 0 28px' }}>scope of work.</h2>
              <hr style={{ border: 'none', borderTop: '1px solid rgba(26,26,26,0.12)' }} />
            </div>
            <section style={{ paddingBottom: '64px' }}>
              <div style={{ padding: '40px 0' }}>
                <p style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#104EA1', marginBottom: '14px' }}>Key Deliverables.</p>
                <ul style={{ listStyle: 'none', marginTop: '8px' }}>
                  {deliverablesList.map((d: string, i: number) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '12px 0', fontSize: '15px', color: '#4a4a4a', borderBottom: i < deliverablesList.length - 1 ? '1px solid rgba(26,26,26,0.07)' : 'none' }}>
                      <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#104EA1', opacity: 0.45, flexShrink: 0 }} />
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          </>
        )}

        {/* Pricing */}
        {proposal.price && (
          <>
            <div id="pricing">
              <hr style={{ border: 'none', borderTop: '1px solid rgba(26,26,26,0.12)' }} />
              <h2 style={{ fontWeight: 900, fontSize: 'clamp(52px, 7.5vw, 88px)', lineHeight: '0.95', color: '#1A1A1A', letterSpacing: '-0.03em', padding: '32px 0 28px' }}>pricing.</h2>
              <hr style={{ border: 'none', borderTop: '1px solid rgba(26,26,26,0.12)' }} />
            </div>
            <section style={{ paddingBottom: '80px' }}>
              <div style={{ marginTop: '36px', display: 'grid', gridTemplateColumns: addOnsList.length > 0 ? '1fr 1fr' : '1fr', gap: '20px', maxWidth: addOnsList.length > 0 ? '100%' : '460px' }}>
                {/* Main package */}
                <div style={{ background: '#104EA1', borderRadius: '16px', padding: '40px 36px' }}>
                  <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.45)', marginBottom: '10px' }}>Package</div>
                  <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#fff', marginBottom: '24px', letterSpacing: '-0.01em' }}>{proposal.title}.</h3>
                  {deliverablesList.length > 0 && (
                    <ul style={{ listStyle: 'none', marginBottom: '28px' }}>
                      {deliverablesList.map((d: string, i: number) => (
                        <li key={i} style={{ fontSize: '14px', color: 'rgba(255,255,255,0.78)', padding: '7px 0', borderBottom: i < deliverablesList.length - 1 ? '1px solid rgba(255,255,255,0.1)' : 'none', display: 'flex', gap: '10px' }}>
                          <span style={{ opacity: 0.4, flexShrink: 0, marginTop: '1px' }}>✓</span>
                          {d}
                        </li>
                      ))}
                      {proposal.timeline && (
                        <li style={{ fontSize: '14px', color: 'rgba(255,255,255,0.78)', padding: '7px 0', display: 'flex', gap: '10px' }}>
                          <span style={{ opacity: 0.4, flexShrink: 0, marginTop: '1px' }}>✓</span>
                          Timeline: {proposal.timeline}
                        </li>
                      )}
                    </ul>
                  )}
                  <div style={{ fontSize: '30px', fontWeight: 900, color: '#fff', letterSpacing: '-0.03em', marginBottom: '22px' }}>
                    ${Number(proposal.price).toLocaleString()}
                  </div>
                  <a
                    href={`mailto:oscar@creativewave.nz?subject=Proposal%20Accepted%20%E2%80%94%20${encodeURIComponent(displayName)}`}
                    style={{ display: 'block', width: '100%', textAlign: 'center', padding: '14px 24px', fontFamily: "'Poppins', sans-serif", fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', textDecoration: 'none', borderRadius: '16px', border: '2px solid rgba(255,255,255,0.45)', color: '#fff', background: 'transparent' }}
                  >
                    I'm In →
                  </a>
                </div>

                {/* Add-ons */}
                {addOnsList.length > 0 && (
                  <div style={{ background: '#fff', borderRadius: '16px', padding: '40px 36px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#2B5D9E', marginBottom: '10px' }}>Optional Add-Ons</div>
                    <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#1A1A1A', marginBottom: '24px', letterSpacing: '-0.01em' }}>Extras.</h3>
                    <ul style={{ listStyle: 'none' }}>
                      {addOnsList.map((a: string, i: number) => (
                        <li key={i} style={{ fontSize: '14px', color: '#4a4a4a', padding: '7px 0', borderBottom: i < addOnsList.length - 1 ? '1px solid rgba(26,26,26,0.07)' : 'none', display: 'flex', gap: '10px' }}>
                          <span style={{ opacity: 0.4, flexShrink: 0, marginTop: '1px' }}>+</span>
                          {a}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </section>
          </>
        )}

        {/* Next Steps */}
        <div id="next-steps">
          <hr style={{ border: 'none', borderTop: '1px solid rgba(26,26,26,0.12)' }} />
          <h2 style={{ fontWeight: 900, fontSize: 'clamp(52px, 7.5vw, 88px)', lineHeight: '0.95', color: '#1A1A1A', letterSpacing: '-0.03em', padding: '32px 0 28px' }}>next steps.</h2>
          <hr style={{ border: 'none', borderTop: '1px solid rgba(26,26,26,0.12)' }} />
        </div>
        <section style={{ paddingBottom: '64px' }}>
          <div style={{ background: '#104EA1', borderRadius: '16px', padding: '52px 48px', marginTop: '36px' }}>
            <p style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.5)', marginBottom: '14px' }}>Ready to move forward?</p>
            <p style={{ fontSize: '15.5px', color: 'rgba(255,255,255,0.8)', maxWidth: '560px', lineHeight: '1.75', marginBottom: '10px' }}>
              To get started, simply click the button below, or flick us an email with any questions. We'll follow up with a project agreement and lock in your shoot date.
            </p>
            <p style={{ fontSize: '15.5px', color: 'rgba(255,255,255,0.8)', marginBottom: '32px' }}>
              Any questions? Get in touch at{' '}
              <a href="mailto:oscar@creativewave.nz" style={{ color: 'rgba(255,255,255,0.9)', fontWeight: 600, textDecoration: 'underline', textUnderlineOffset: '3px' }}>oscar@creativewave.nz</a>
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <a
                href={`mailto:oscar@creativewave.nz?subject=Proposal%20Accepted%20%E2%80%94%20${encodeURIComponent(displayName)}`}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 24px', borderRadius: '16px', border: '1.5px solid rgba(255,255,255,0.3)', textDecoration: 'none', color: '#fff', fontSize: '13px', fontWeight: 600 }}
              >
                Accept Proposal <span style={{ fontSize: '18px' }}>→</span>
              </a>
              <a
                href={`mailto:oscar@creativewave.nz?subject=Question%20re%3A%20Proposal%20%E2%80%94%20${encodeURIComponent(displayName)}`}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 24px', borderRadius: '16px', border: '1.5px solid rgba(255,255,255,0.3)', textDecoration: 'none', color: '#fff', fontSize: '13px', fontWeight: 600 }}
              >
                Ask a Question <span style={{ fontSize: '18px' }}>→</span>
              </a>
            </div>
          </div>
        </section>

        {/* Terms */}
        {proposal.notes && (
          <>
            <div>
              <hr style={{ border: 'none', borderTop: '1px solid rgba(26,26,26,0.12)' }} />
              <h2 style={{ fontWeight: 900, fontSize: 'clamp(52px, 7.5vw, 88px)', lineHeight: '0.95', color: '#1A1A1A', letterSpacing: '-0.03em', padding: '32px 0 28px' }}>terms.</h2>
              <hr style={{ border: 'none', borderTop: '1px solid rgba(26,26,26,0.12)' }} />
            </div>
            <section style={{ paddingBottom: '64px' }}>
              <div style={{ padding: '40px 0' }}>
                <p style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#104EA1', marginBottom: '14px' }}>Project Policies.</p>
                <ul style={{ listStyle: 'none', marginTop: '12px' }}>
                  {proposal.notes.split('\n').filter(Boolean).map((t: string, i: number) => (
                    <li key={i} style={{ padding: '14px 0', fontSize: '15px', color: '#4a4a4a', borderBottom: '1px solid rgba(26,26,26,0.08)', lineHeight: '1.6' }}>{t}</li>
                  ))}
                </ul>
              </div>
            </section>
          </>
        )}
      </div>

      {/* Footer */}
      <footer style={{ background: '#1A1A1A', marginTop: '80px', padding: '44px 56px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <strong style={{ display: 'block', fontSize: '13px', fontWeight: 800, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>Creative Wave Media</strong>
            <span style={{ fontSize: '12.5px', color: 'rgba(255,255,255,0.4)' }}>Wānaka, New Zealand</span>
          </div>
          <div style={{ textAlign: 'right' }}>
            <a href="https://www.creativewave.nz/" style={{ display: 'block', fontSize: '12.5px', color: 'rgba(255,255,255,0.45)', textDecoration: 'none', marginBottom: '4px' }}>www.creativewave.nz</a>
            <a href="mailto:oscar@creativewave.nz" style={{ display: 'block', fontSize: '12.5px', color: 'rgba(255,255,255,0.45)', textDecoration: 'none' }}>oscar@creativewave.nz</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
