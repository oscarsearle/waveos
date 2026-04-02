import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { ProposalStatusBadge } from '@/components/proposals/ProposalStatusBadge'
import { Button } from '@/components/ui/button'
import { Plus, FileText } from 'lucide-react'
import type { Proposal, Client } from '@/lib/types'

export default async function ProposalsPage() {
  const supabase = await createClient()
  const { data: proposals } = await supabase
    .from('proposals')
    .select('*, clients(id, name, brand_name)')
    .order('updated_at', { ascending: false })

  const rows = (proposals ?? []) as (Proposal & { clients: Pick<Client, 'id' | 'name' | 'brand_name'> | null })[]

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <FileText className="w-4 h-4 opacity-30" style={{ color: '#00B7FF' }} />
          <div>
            <h1 className="text-lg font-bold" style={{ fontFamily: 'var(--font-poppins)', color: '#e8eeff', letterSpacing: '-0.02em' }}>Proposals</h1>
            <p className="text-[11px]" style={{ color: '#3d5475' }}>{rows.length} total</p>
          </div>
        </div>
        <Link href="/proposals/new">
          <Button className="h-8 text-xs font-medium text-white" style={{ background: '#054F99' }}>
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            New Proposal
          </Button>
        </Link>
      </div>

      {rows.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <FileText className="w-8 h-8 mb-3 opacity-20" style={{ color: '#00B7FF' }} />
          <p className="text-sm" style={{ color: '#3d5475' }}>No proposals yet.</p>
        </div>
      ) : (
        <div className="rounded-xl overflow-hidden border" style={{ background: '#0b1120', borderColor: '#162035' }}>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b" style={{ background: '#0d1728', borderColor: '#162035' }}>
                <th className="text-left px-4 py-3 text-[10px] font-semibold uppercase tracking-widest" style={{ color: '#2d4060' }}>Proposal</th>
                <th className="text-left px-4 py-3 text-[10px] font-semibold uppercase tracking-widest" style={{ color: '#2d4060' }}>Client</th>
                <th className="text-left px-4 py-3 text-[10px] font-semibold uppercase tracking-widest" style={{ color: '#2d4060' }}>Status</th>
                <th className="text-left px-4 py-3 text-[10px] font-semibold uppercase tracking-widest" style={{ color: '#2d4060' }}>Value</th>
                <th className="text-left px-4 py-3 text-[10px] font-semibold uppercase tracking-widest" style={{ color: '#2d4060' }}>Sent</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((proposal, i) => {
                const client = proposal.clients
                return (
                  <tr
                    key={proposal.id}
                    className={`border-b transition-colors hover:bg-white/[0.02] ${i === rows.length - 1 ? 'border-b-0' : ''}`}
                    style={{ borderColor: '#162035' }}
                  >
                    <td className="px-4 py-3">
                      <Link href={`/proposals/${proposal.id}`} className="font-medium hover:text-[#00B7FF] transition-colors" style={{ color: '#e8eeff' }}>
                        {proposal.title}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      {client ? (
                        <Link href={`/clients/${client.id}`} className="hover:text-[#00B7FF] transition-colors" style={{ color: '#3d5475' }}>
                          {client.brand_name || client.name}
                        </Link>
                      ) : (
                        <span style={{ color: '#2d4060' }}>—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <ProposalStatusBadge status={proposal.status} />
                    </td>
                    <td className="px-4 py-3 text-[13px]" style={{ color: '#3d5475' }}>
                      {proposal.price ? `£${proposal.price.toLocaleString()}` : '—'}
                    </td>
                    <td className="px-4 py-3 text-[13px]" style={{ color: '#3d5475' }}>
                      {proposal.sent_at
                        ? new Date(proposal.sent_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
                        : '—'}
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
