import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { updateInvoiceAction } from '@/app/actions/invoices'
import { INVOICE_STATUS_COLOURS } from '@/lib/constants'
import { InvoiceStatusUpdater } from '@/components/invoices/InvoiceStatusUpdater'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ChevronLeft } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Invoice, Client } from '@/lib/types'

export default async function InvoiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: invoice } = await supabase
    .from('invoices')
    .select('*, clients(id, name, brand_name), projects(id, name)')
    .eq('id', id)
    .single()

  if (!invoice) notFound()

  const inv = invoice as Invoice
  const client = inv.clients as unknown as Pick<Client, 'id' | 'name' | 'brand_name'> | null
  const colours = INVOICE_STATUS_COLOURS[inv.status] ?? { bg: 'bg-gray-100', text: 'text-gray-600' }

  async function updateAction(formData: FormData) {
    'use server'
    await updateInvoiceAction(id, formData)
  }

  return (
    <div className="p-8 max-w-xl">
      <Link href="/invoices" className="inline-flex items-center gap-1.5 text-[12px] text-gray-400 hover:text-gray-700 transition-colors mb-6">
        <ChevronLeft className="w-3.5 h-3.5" />
        Financials
      </Link>

      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-xl font-semibold text-gray-900 tracking-tight">{inv.title}</h1>
            <span className={cn('inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium', colours.bg, colours.text)}>
              {inv.status}
            </span>
          </div>
          {client && (
            <Link href={`/clients/${client.id}`} className="text-[13px] text-gray-400 hover:text-gray-700 transition-colors">
              {client.brand_name || client.name}
            </Link>
          )}
          <p className="text-2xl font-semibold text-gray-900 mt-2">£{inv.amount.toLocaleString()}</p>
        </div>
        <InvoiceStatusUpdater invoiceId={id} currentStatus={inv.status} />
      </div>

      <form action={updateAction} className="flex flex-col gap-5">
        <div className="rounded-xl border border-gray-200 bg-white p-6 flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <Label className="text-[11px] text-gray-400 uppercase tracking-widest font-semibold">Title</Label>
            <Input name="title" defaultValue={inv.title} required className="bg-gray-50 border-gray-200 text-gray-900 h-9 text-[13px]" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label className="text-[11px] text-gray-400 uppercase tracking-widest font-semibold">Amount (£)</Label>
              <Input name="amount" type="number" defaultValue={inv.amount.toString()} required className="bg-gray-50 border-gray-200 text-gray-900 h-9 text-[13px]" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-[11px] text-gray-400 uppercase tracking-widest font-semibold">Due Date</Label>
              <Input name="due_date" type="date" defaultValue={inv.due_date ?? ''} className="bg-gray-50 border-gray-200 text-gray-900 h-9 text-[13px]" />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-[11px] text-gray-400 uppercase tracking-widest font-semibold">Notes</Label>
            <Textarea name="notes" rows={3} defaultValue={inv.notes ?? ''} className="bg-gray-50 border-gray-200 text-gray-900 text-[13px] resize-none" />
          </div>
        </div>
        <div className="flex justify-end">
          <Button type="submit" className="font-medium h-9 px-5 text-[13px] rounded-lg text-white" style={{ background: '#054F99' }}>
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  )
}
