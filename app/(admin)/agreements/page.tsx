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
          <ScrollText className="w-4 h-4 text-gray-400" />
          <div>
            <h1 className="text-lg font-semibold text-gray-900 tracking-tight">Agreements</h1>
            <p className="text-[11px] text-gray-400">{rows.length} total</p>
          </div>
        </div>
        <Link href="/agreements/new">
          <Button className="h-8 text-xs font-medium text-white rounded-lg" style={{ background: '#054F99' }}>
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            New Agreement
          </Button>
        </Link>
      </div>

      {rows.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <ScrollText className="w-7 h-7 text-gray-300 mb-3" />
          <p className="text-sm text-gray-500">No agreements yet.</p>
          <p className="text-[12px] text-gray-400 mt-1">Create your first agreement to track contracts.</p>
          <Link href="/agreements/new" className="mt-5">
            <Button variant="outline" className="h-8 text-xs border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50">
              <Plus className="w-3.5 h-3.5 mr-1.5" />
              New Agreement
            </Button>
          </Link>
        </div>
      ) : (
        <div className="rounded-xl border border-gray-200 overflow-hidden bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-5 py-3 text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Agreement</th>
                <th className="text-left px-5 py-3 text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Client</th>
                <th className="text-left px-5 py-3 text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Type</th>
                <th className="text-left px-5 py-3 text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Status</th>
                <th className="text-left px-5 py-3 text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Sent</th>
                <th className="text-left px-5 py-3 text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Signed</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((a, i) => {
                const client = a.clients
                return (
                  <tr
                    key={a.id}
                    className={`border-b border-gray-50 hover:bg-gray-50 transition-colors ${i === rows.length - 1 ? 'border-b-0' : ''}`}
                  >
                    <td className="px-5 py-3.5">
                      <Link href={`/agreements/${a.id}`} className="font-medium text-gray-900 hover:text-[#054F99] transition-colors text-[13px]">
                        {a.title}
                      </Link>
                    </td>
                    <td className="px-5 py-3.5">
                      {client ? (
                        <Link href={`/clients/${client.id}`} className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors">
                          {(client as unknown as Client).brand_name || (client as unknown as Client).name}
                        </Link>
                      ) : <span className="text-gray-300">—</span>}
                    </td>
                    <td className="px-5 py-3.5 text-[13px] text-gray-500">{a.template_type || '—'}</td>
                    <td className="px-5 py-3.5"><AgreementStatusBadge status={a.status} /></td>
                    <td className="px-5 py-3.5 text-[13px] text-gray-500">
                      {a.sent_at ? new Date(a.sent_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : '—'}
                    </td>
                    <td className="px-5 py-3.5 text-[13px] text-gray-500">
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
