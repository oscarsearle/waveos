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
          <Users className="w-4 h-4 opacity-30" style={{ color: '#00B7FF' }} />
          <div>
            <h1 className="text-lg font-bold" style={{ fontFamily: 'var(--font-poppins)', color: '#e8eeff', letterSpacing: '-0.02em' }}>Clients</h1>
            <p className="text-[11px]" style={{ color: '#3d5475' }}>{rows.length} total</p>
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
          <Users className="w-8 h-8 mb-3 opacity-20" style={{ color: '#00B7FF' }} />
          <p className="text-sm" style={{ color: '#3d5475' }}>No clients yet.</p>
          <p className="text-xs mt-1" style={{ color: '#2d4060' }}>Add your first client to get started.</p>
          <Link href="/clients/new" className="mt-4">
            <Button variant="outline" className="h-8 text-xs border-white/[0.08] text-white/40 hover:text-white hover:bg-white/[0.05]">
              <Plus className="w-3.5 h-3.5 mr-1.5" />
              Add Client
            </Button>
          </Link>
        </div>
      ) : (
        <div className="rounded-xl overflow-hidden border" style={{ background: '#0b1120', borderColor: '#162035' }}>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b" style={{ background: '#0d1728', borderColor: '#162035' }}>
                <th className="text-left px-4 py-3 text-[10px] font-semibold uppercase tracking-widest" style={{ color: '#2d4060' }}>Client</th>
                <th className="text-left px-4 py-3 text-[10px] font-semibold uppercase tracking-widest" style={{ color: '#2d4060' }}>Status</th>
                <th className="text-left px-4 py-3 text-[10px] font-semibold uppercase tracking-widest" style={{ color: '#2d4060' }}>Type</th>
                <th className="text-left px-4 py-3 text-[10px] font-semibold uppercase tracking-widest" style={{ color: '#2d4060' }}>Value</th>
                <th className="text-left px-4 py-3 text-[10px] font-semibold uppercase tracking-widest" style={{ color: '#2d4060' }}>Next Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((client, i) => (
                <tr
                  key={client.id}
                  className={`border-b transition-colors hover:bg-white/[0.02] ${i === rows.length - 1 ? 'border-b-0' : ''}`}
                  style={{ borderColor: '#162035' }}
                >
                  <td className="px-4 py-3">
                    <Link href={`/clients/${client.id}`} className="group">
                      <p className="font-medium group-hover:text-[#00B7FF] transition-colors" style={{ color: '#e8eeff' }}>
                        {client.brand_name || client.name}
                      </p>
                      {client.brand_name && (
                        <p className="text-xs" style={{ color: '#3d5475' }}>{client.name}</p>
                      )}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={client.status} />
                  </td>
                  <td className="px-4 py-3 text-[13px]" style={{ color: '#3d5475' }}>{client.project_type || '—'}</td>
                  <td className="px-4 py-3 text-[13px]" style={{ color: '#3d5475' }}>
                    {client.project_value ? `£${client.project_value.toLocaleString()}` : '—'}
                  </td>
                  <td className="px-4 py-3 text-[13px] max-w-xs truncate" style={{ color: '#3d5475' }}>
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
