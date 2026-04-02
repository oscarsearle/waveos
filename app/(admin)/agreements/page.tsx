import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { AgreementStatusBadge } from '@/components/agreements/AgreementStatusBadge'
import { Button } from '@/components/ui/button'
import { Plus, ScrollText } from 'lucide-react'
import type { Agreement, Client } from '@/lib/types'

export default async function AgreementsPage() {
  const supabase = await createClient()
  const { data: agreements } = await supabase
    .from('agreements')
    .select('*, clients(id, name, brand_name), projects(id, name)')
    .order('updated_at', { ascending: false })

  const rows = (agreements ?? []) as Agreement[]

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <ScrollText className="w-4 h-4 opacity-30" style={{ color: '#00B7FF' }} />
          <div>
            <h1 className="text-lg font-bold" style={{ fontFamily: 'var(--font-poppins)', color: '#e8eeff', letterSpacing: '-0.02em' }}>Agreements</h1>
            <p className="text-[11px]" style={{ color: '#3d5475' }}>{rows.length} total</p>
          </div>
        </div>
        <Link href="/agreements/new">
          <Button className="h-8 text-xs font-medium text-white" style={{ background: '#054F99' }}>
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            New Agreement
          </Button>
        </Link>
      </div>

      {rows.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <ScrollText className="w-7 h-7 mb-3 opacity-20" style={{ color: '#00B7FF' }} />
          <p className="text-sm" style={{ color: '#3d5475' }}>No agreements yet.</p>
          <p className="text-[12px] mt-1" style={{ color: '#2d4060' }}>Create your first agreement to track contracts.</p>
          <Link href="/agreements/new" className="mt-5">
            <Button variant="outline" className="h-8 text-xs border-white/[0.08] text-white/40 hover:text-white hover:bg-white/[0.05]">
              <Plus className="w-3.5 h-3.5 mr-1.5" />
              New Agreement
            </Button>
          </Link>
        </div>
      ) : (
        <div className="rounded-xl overflow-hidden border" style={{ background: '#0b1120', borderColor: '#162035' }}>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b" style={{ background: '#0d1728', borderColor: '#162035' }}>
                <th className="text-left px-5 py-3 text-[10px] font-semibold uppercase tracking-widest" style={{ color: '#2d4060' }}>Agreement</th>
                <th className="text-left px-5 py-3 text-[10px] font-semibold uppercase tracking-widest" style={{ color: '#2d4060' }}>Client</th>
                <th className="text-left px-5 py-3 text-[10px] font-semibold uppercase tracking-widest" style={{ color: '#2d4060' }}>Type</th>
                <th className="text-left px-5 py-3 text-[10px] font-semibold uppercase tracking-widest" style={{ color: '#2d4060' }}>Status</th>
                <th className="text-left px-5 py-3 text-[10px] font-semibold uppercase tracking-widest" style={{ color: '#2d4060' }}>Sent</th>
                <th className="text-left px-5 py-3 text-[10px] font-semibold uppercase tracking-widest" style={{ color: '#2d4060' }}>Signed</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((a, i) => {
                const client = a.clients
                return (
                  <tr
                    key={a.id}
                    className={`border-b transition-colors hover:bg-white/[0.02] ${i === rows.length - 1 ? 'border-b-0' : ''}`}
                    style={{ borderColor: '#162035' }}
                  >
                    <td className="px-5 py-3.5">
                      <Link href={`/agreements/${a.id}`} className="font-medium hover:text-[#00B7FF] transition-colors text-[13px]" style={{ color: '#e8eeff' }}>
                        {a.title}
                      </Link>
                    </td>
                    <td className="px-5 py-3.5">
                      {client ? (
                        <Link href={`/clients/${client.id}`} className="text-[13px] hover:text-[#00B7FF] transition-colors" style={{ color: '#3d5475' }}>
                          {(client as unknown as Client).brand_name || (client as unknown as Client).name}
                        </Link>
                      ) : <span style={{ color: '#2d4060' }}>—</span>}
                    </td>
                    <td className="px-5 py-3.5 text-[13px]" style={{ color: '#3d5475' }}>{a.template_type || '—'}</td>
                    <td className="px-5 py-3.5"><AgreementStatusBadge status={a.status} /></td>
                    <td className="px-5 py-3.5 text-[13px]" style={{ color: '#3d5475' }}>
                      {a.sent_at ? new Date(a.sent_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : '—'}
                    </td>
                    <td className="px-5 py-3.5 text-[13px]" style={{ color: '#3d5475' }}>
                      {a.signed_at ? new Date(a.signed_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : '—'}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
