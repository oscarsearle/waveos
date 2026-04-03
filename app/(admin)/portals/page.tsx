import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { ExternalLink } from 'lucide-react'

export default async function PortalsPage() {
  const supabase = await createClient()

  const { data: clients } = await supabase
    .from('clients')
    .select('id, name, brand_name, portal_slug, portal_enabled')
    .not('portal_slug', 'is', null)
    .order('name', { ascending: true })

  const portals = clients ?? []

  return (
    <div className="p-8 max-w-3xl">
      <h1 className="text-lg font-bold mb-8" style={{ fontFamily: 'var(--font-poppins)', color: '#e8eeff', letterSpacing: '-0.02em' }}>
        Portals
      </h1>

      {portals.length === 0 ? (
        <p className="text-sm" style={{ color: '#3d5475' }}>
          No portals set up yet. Add a portal slug to a client to get started.
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {portals.map((c) => {
            const displayName = c.brand_name || c.name
            const portalUrl = `/portal/${c.portal_slug}`
            return (
              <div
                key={c.id}
                className="flex items-center justify-between rounded-xl border px-4 py-3"
                style={{ background: '#0b1120', borderColor: '#162035' }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-1.5 h-1.5 rounded-full shrink-0"
                    style={{ background: c.portal_enabled ? '#22c55e' : '#3d5475' }}
                  />
                  <div>
                    <Link
                      href={`/clients/${c.id}`}
                      className="text-sm font-medium hover:text-[#00B7FF] transition-colors"
                      style={{ color: '#e8eeff' }}
                    >
                      {displayName}
                    </Link>
                    <p className="text-xs mt-0.5" style={{ color: '#3d5475' }}>
                      /portal/{c.portal_slug}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className="text-[10px] font-semibold uppercase tracking-widest"
                    style={{ color: c.portal_enabled ? '#22c55e' : '#3d5475' }}
                  >
                    {c.portal_enabled ? 'Live' : 'Disabled'}
                  </span>
                  <a
                    href={portalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs transition-colors hover:text-[#00B7FF]"
                    style={{ color: '#3d5475' }}
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Open
                  </a>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
