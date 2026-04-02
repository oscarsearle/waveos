import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { StatusBadge } from '@/components/clients/StatusBadge'
import { Button } from '@/components/ui/button'
import { Plus, Users } from 'lucide-react'
import type { Client } from '@/lib/types'

export default async function ClientsPage() {
  const supabase = await createClient()
  const { data: clients } = await supabase
    .from('clients')
    .select('*')
    .order('updated_at', { ascending: false })

  const rows = (clients ?? []) as Client[]

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Users className="w-5 h-5 text-gray-400" />
          <div>
            <h1 className="text-lg font-semibold text-gray-900">Clients</h1>
            <p className="text-xs text-gray-400">{rows.length} total</p>
          </div>
        </div>
        <Link href="/clients/new">
          <Button className="h-8 text-xs font-medium text-white" style={{ background: '#054F99' }}>
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            New Client
          </Button>
        </Link>
      </div>

      {rows.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Users className="w-8 h-8 text-gray-300 mb-3" />
          <p className="text-sm text-gray-500">No clients yet.</p>
          <p className="text-xs text-gray-400 mt-1">Add your first client to get started.</p>
          <Link href="/clients/new" className="mt-4">
            <Button variant="outline" className="h-8 text-xs border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50">
              <Plus className="w-3.5 h-3.5 mr-1.5" />
              Add Client
            </Button>
          </Link>
        </div>
      ) : (
        <div className="rounded-xl border border-gray-200 overflow-hidden bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Client</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Type</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Value</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Next Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((client, i) => (
                <tr
                  key={client.id}
                  className={`border-b border-gray-50 hover:bg-gray-50 transition-colors ${i === rows.length - 1 ? 'border-b-0' : ''}`}
                >
                  <td className="px-4 py-3">
                    <Link href={`/clients/${client.id}`} className="group">
                      <p className="font-medium text-gray-900 group-hover:text-[#054F99] transition-colors">
                        {client.brand_name || client.name}
                      </p>
                      {client.brand_name && (
                        <p className="text-xs text-gray-400">{client.name}</p>
                      )}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={client.status} />
                  </td>
                  <td className="px-4 py-3 text-gray-500">{client.project_type || '—'}</td>
                  <td className="px-4 py-3 text-gray-500">
                    {client.project_value ? `£${client.project_value.toLocaleString()}` : '—'}
                  </td>
                  <td className="px-4 py-3 text-gray-500 max-w-xs truncate">
                    {client.next_action || '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
