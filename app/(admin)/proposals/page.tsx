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
          <FileText className="w-5 h-5 text-zinc-400" />
          <div>
            <h1 className="text-lg font-semibold text-white">Proposals</h1>
            <p className="text-xs text-zinc-500">{rows.length} total</p>
          </div>
        </div>
        <Link href="/proposals/new">
          <Button className="bg-white text-black hover:bg-zinc-200 h-8 text-xs font-medium">
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            New Proposal
          </Button>
        </Link>
      </div>

      {rows.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <FileText className="w-8 h-8 text-zinc-700 mb-3" />
          <p className="text-sm text-zinc-400">No proposals yet.</p>
        </div>
      ) : (
        <div className="rounded-xl border border-white/[0.07] overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.07] bg-white/[0.02]">
                <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wide">Proposal</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wide">Client</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wide">Status</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wide">Value</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wide">Sent</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((proposal, i) => {
                const client = proposal.clients
                return (
                  <tr
                    key={proposal.id}
                    className={`border-b border-white/[0.04] hover:bg-white/[0.03] transition-colors ${i === rows.length - 1 ? 'border-b-0' : ''}`}
                  >
                    <td className="px-4 py-3">
                      <Link href={`/proposals/${proposal.id}`} className="font-medium text-white hover:text-zinc-200 transition-colors">
                        {proposal.title}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      {client ? (
                        <Link href={`/clients/${client.id}`} className="text-zinc-400 hover:text-zinc-200 transition-colors">
                          {client.brand_name || client.name}
                        </Link>
                      ) : (
                        <span className="text-zinc-600">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <ProposalStatusBadge status={proposal.status} />
                    </td>
                    <td className="px-4 py-3 text-zinc-400">
                      {proposal.price ? `£${proposal.price.toLocaleString()}` : '—'}
                    </td>
                    <td className="px-4 py-3 text-zinc-400">
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
