import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Plus, DollarSign } from 'lucide-react'
import { cn } from '@/lib/utils'
import { INVOICE_STATUS_COLOURS } from '@/lib/constants'
import type { Invoice, Client } from '@/lib/types'

export default async function InvoicesPage() {
  const supabase = await createClient()
  const { data: invoices } = await supabase
    .from('invoices')
    .select('*, clients(id, name, brand_name), projects(id, name)')
    .order('created_at', { ascending: false })

  const rows = (invoices ?? []) as Invoice[]

  const totalUnpaid = rows.filter(i => i.status === 'Unpaid').reduce((s, i) => s + i.amount, 0)
  const totalPartial = rows.filter(i => i.status === 'Partially Paid').reduce((s, i) => s + i.amount, 0)
  const totalPaid = rows.filter(i => i.status === 'Paid').reduce((s, i) => s + i.amount, 0)

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <DollarSign className="w-4 h-4 opacity-30" style={{ color: '#00B7FF' }} />
          <div>
            <h1 className="text-lg font-bold" style={{ fontFamily: 'var(--font-poppins)', color: '#e8eeff', letterSpacing: '-0.02em' }}>Financials</h1>
            <p className="text-[11px]" style={{ color: '#3d5475' }}>{rows.length} invoices</p>
          </div>
        </div>
        <Link href="/invoices/new">
          <Button className="h-8 text-xs font-medium text-white" style={{ background: '#054F99' }}>
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            New Invoice
          </Button>
        </Link>
      </div>

      {rows.length > 0 && (
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { label: 'Unpaid', value: totalUnpaid, colour: 'text-red-400' },
            { label: 'Partially Paid', value: totalPartial, colour: 'text-amber-300' },
            { label: 'Paid', value: totalPaid, colour: 'text-emerald-300' },
          ].map(({ label, value, colour }) => (
            <div key={label} className="rounded-xl border px-5 py-4" style={{ background: '#0b1120', borderColor: '#162035' }}>
              <p className="text-[10px] font-semibold uppercase tracking-widest mb-2" style={{ color: '#2d4060' }}>{label}</p>
              <p className={cn('text-xl font-bold tabular-nums', colour)} style={{ fontFamily: 'var(--font-poppins)' }}>
                £{value.toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}

      {rows.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <DollarSign className="w-7 h-7 mb-3 opacity-20" style={{ color: '#00B7FF' }} />
          <p className="text-sm" style={{ color: '#3d5475' }}>No invoices yet.</p>
        </div>
      ) : (
        <div className="rounded-xl overflow-hidden border" style={{ background: '#0b1120', borderColor: '#162035' }}>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b" style={{ background: '#0d1728', borderColor: '#162035' }}>
                <th className="text-left px-5 py-3 text-[10px] font-semibold uppercase tracking-widest" style={{ color: '#2d4060' }}>Invoice</th>
                <th className="text-left px-5 py-3 text-[10px] font-semibold uppercase tracking-widest" style={{ color: '#2d4060' }}>Client</th>
                <th className="text-left px-5 py-3 text-[10px] font-semibold uppercase tracking-widest" style={{ color: '#2d4060' }}>Amount</th>
                <th className="text-left px-5 py-3 text-[10px] font-semibold uppercase tracking-widest" style={{ color: '#2d4060' }}>Status</th>
                <th className="text-left px-5 py-3 text-[10px] font-semibold uppercase tracking-widest" style={{ color: '#2d4060' }}>Due</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((inv, i) => {
                const client = inv.clients as unknown as Pick<Client, 'id' | 'name' | 'brand_name'> | null
                const colours = INVOICE_STATUS_COLOURS[inv.status] ?? { bg: 'bg-white/[0.06]', text: 'text-white/50' }
                return (
                  <tr key={inv.id} className={`border-b transition-colors hover:bg-white/[0.02] ${i === rows.length - 1 ? 'border-b-0' : ''}`} style={{ borderColor: '#162035' }}>
                    <td className="px-5 py-3.5">
                      <Link href={`/invoices/${inv.id}`} className="text-[13px] font-medium hover:text-[#00B7FF] transition-colors" style={{ color: '#e8eeff' }}>
                        {inv.title}
                      </Link>
                    </td>
                    <td className="px-5 py-3.5 text-[13px]" style={{ color: '#3d5475' }}>
                      {client ? (
                        <Link href={`/clients/${client.id}`} className="hover:text-[#00B7FF] transition-colors">
                          {client.brand_name || client.name}
                        </Link>
                      ) : '—'}
                    </td>
                    <td className="px-5 py-3.5 text-[13px] font-semibold tabular-nums" style={{ color: '#e8eeff' }}>
                      £{inv.amount.toLocaleString()}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={cn('inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium', colours.bg, colours.text)}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-[13px]" style={{ color: '#3d5475' }}>
                      {inv.due_date ? new Date(inv.due_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
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
