import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { createInvoiceAction } from '@/app/actions/invoices'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { INVOICE_STATUSES } from '@/lib/constants'
import { ChevronLeft } from 'lucide-react'
import type { Client, Project } from '@/lib/types'

export default async function NewInvoicePage({
  searchParams,
}: {
  searchParams: Promise<{ client_id?: string }>
}) {
  const { client_id } = await searchParams
  const supabase = await createClient()

  const [{ data: clients }, { data: projects }] = await Promise.all([
    supabase.from('clients').select('id, name, brand_name').order('name'),
    supabase.from('projects').select('id, name').order('name'),
  ])

  return (
    <div className="p-8 max-w-xl">
      <Link href="/invoices" className="inline-flex items-center gap-1.5 text-[12px] text-gray-400 hover:text-gray-700 transition-colors mb-6">
        <ChevronLeft className="w-3.5 h-3.5" />
        Financials
      </Link>
      <h1 className="text-lg font-semibold text-gray-900 tracking-tight mb-8">New Invoice</h1>

      <form action={createInvoiceAction} className="flex flex-col gap-5">
        <div className="rounded-xl border border-gray-200 bg-white p-6 flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <Label className="text-[11px] text-gray-400 uppercase tracking-widest font-semibold">Title *</Label>
            <Input name="title" required placeholder="e.g. Brand Film — Studio Name" className="bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-300 h-9 text-[13px]" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label className="text-[11px] text-gray-400 uppercase tracking-widest font-semibold">Client *</Label>
              <Select name="client_id" defaultValue={client_id ?? ''}>
                <SelectTrigger className="bg-gray-50 border-gray-200 text-gray-900 h-9 text-[13px]">
                  <SelectValue placeholder="Select client" />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-200">
                  {(clients ?? []).map((c) => (
                    <SelectItem key={c.id} value={c.id} className="text-gray-700 text-[13px] focus:bg-gray-50 focus:text-gray-900">
                      {(c as unknown as Client).brand_name || c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="text-[11px] text-gray-400 uppercase tracking-widest font-semibold">Project</Label>
              <Select name="project_id">
                <SelectTrigger className="bg-gray-50 border-gray-200 text-gray-900 h-9 text-[13px]">
                  <SelectValue placeholder="Optional" />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-200">
                  {(projects ?? []).map((p) => (
                    <SelectItem key={p.id} value={p.id} className="text-gray-700 text-[13px] focus:bg-gray-50 focus:text-gray-900">
                      {(p as unknown as Project).name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="text-[11px] text-gray-400 uppercase tracking-widest font-semibold">Amount (£) *</Label>
              <Input name="amount" type="number" required placeholder="0" className="bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-300 h-9 text-[13px]" />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="text-[11px] text-gray-400 uppercase tracking-widest font-semibold">Status</Label>
              <Select name="status" defaultValue="Unpaid">
                <SelectTrigger className="bg-gray-50 border-gray-200 text-gray-900 h-9 text-[13px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-200">
                  {INVOICE_STATUSES.map((s) => (
                    <SelectItem key={s} value={s} className="text-gray-700 text-[13px] focus:bg-gray-50 focus:text-gray-900">{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5 col-span-2">
              <Label className="text-[11px] text-gray-400 uppercase tracking-widest font-semibold">Due Date</Label>
              <Input name="due_date" type="date" className="bg-gray-50 border-gray-200 text-gray-900 h-9 text-[13px]" />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-[11px] text-gray-400 uppercase tracking-widest font-semibold">Notes</Label>
            <Textarea name="notes" rows={3} className="bg-gray-50 border-gray-200 text-gray-900 text-[13px] resize-none" />
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" className="font-medium h-9 px-5 text-[13px] rounded-lg text-white" style={{ background: '#054F99' }}>
            Create Invoice
          </Button>
        </div>
      </form>
    </div>
  )
}
