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
          <DollarSign className="w-4 h-4 text-gray-400" />
          <div>
            <h1 className="text-lg font-semibold text-gray-900 tracking-tight">Financials</h1>
            <p className="text-[11px] text-gray-400">{rows.length} invoices</p>
          </div>
        </div>
        <Link href="/invoices/new">
          <Button className="h-8 text-xs font-medium text-white rounded-lg" style={{ background: '#054F99' }}>
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            New Invoice
          </Button>
        </Link>
      </div>

      {rows.length > 0 && (
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { label: 'Unpaid', value: totalUnpaid, colour: 'text-red-500' },
            { label: 'Partially Paid', value: totalPartial, colour: 'text-amber-500' },
            { label: 'Paid', value: totalPaid, colour: 'text-emerald-600' },
          ].map(({ label, value, colour }) => (
            <div key={label} className="rounded-xl border border-gray-200 bg-white px-5 py-4">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-2">{label}</p>
              <p className={cn('text-xl font-semibold tabular-nums', colour)}>
                £{value.toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}

      {rows.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <DollarSign className="w-7 h-7 text-gray-300 mb-3" />
          <p className="text-sm text-gray-500">No invoices yet.</p>
        </div>
      ) : (
        <div className="rounded-xl border border-gray-200 overflow-hidden bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-5 py-3 text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Invoice</th>
                <th className="text-left px-5 py-3 text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Client</th>
                <th className="text-left px-5 py-3 text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Amount</th>
                <th className="text-left px-5 py-3 text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Status</th>
                <th className="text-left px-5 py-3 text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Due</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((inv, i) => {
                const client = inv.clients as unknown as Pick<Client, 'id' | 'name' | 'brand_name'> | null
                const colours = INVOICE_STATUS_COLOURS[inv.status] ?? { bg: 'bg-gray-100', text: 'text-gray-600' }
                return (
                  <tr key={inv.id} className={`border-b border-gray-50 hover:bg-gray-50 transition-colors ${i === rows.length - 1 ? 'border-b-0' : ''}`}>
                    <td className="px-5 py-3.5">
                      <Link href={`/invoices/${inv.id}`} className="text-[13px] font-medium text-gray-900 hover:text-[#054F99] transition-colors">
                        {inv.title}
                      </Link>
                    </td>
                    <td className="px-5 py-3.5 text-[13px] text-gray-500">
                      {client ? (
                        <Link href={`/clients/${client.id}`} className="hover:text-gray-900 transition-colors">
                          {client.brand_name || client.name}
                        </Link>
                      ) : '—'}
                    </td>
                    <td className="px-5 py-3.5 text-[13px] font-medium text-gray-900 tabular-nums">
                      £{inv.amount.toLocaleString()}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={cn('inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium', colours.bg, colours.text)}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-[13px] text-gray-500">
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
