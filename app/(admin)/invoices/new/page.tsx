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
      <Link href="/invoices" className="inline-flex items-center gap-1.5 text-[12px] text-zinc-600 hover:text-zinc-300 transition-colors mb-6">
        <ChevronLeft className="w-3.5 h-3.5" />
        Financials
      </Link>
      <h1 className="text-lg font-semibold text-white tracking-tight mb-8">New Invoice</h1>

      <form action={createInvoiceAction} className="flex flex-col gap-5">
        <div className="rounded-xl border border-white/[0.07] bg-[#0f0f0f] p-6 flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <Label className="text-[11px] text-zinc-500 uppercase tracking-widest">Title *</Label>
            <Input name="title" required placeholder="e.g. Brand Film — Studio Name" className="bg-zinc-900/60 border-white/[0.08] text-white placeholder:text-zinc-700 h-9 text-[13px]" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label className="text-[11px] text-zinc-500 uppercase tracking-widest">Client *</Label>
              <Select name="client_id" defaultValue={client_id ?? ''}>
                <SelectTrigger className="bg-zinc-900/60 border-white/[0.08] text-white h-9 text-[13px]">
                  <SelectValue placeholder="Select client" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-white/10">
                  {(clients ?? []).map((c) => (
                    <SelectItem key={c.id} value={c.id} className="text-zinc-200 text-[13px] focus:bg-white/10 focus:text-white">
                      {(c as unknown as Client).brand_name || c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="text-[11px] text-zinc-500 uppercase tracking-widest">Project</Label>
              <Select name="project_id">
                <SelectTrigger className="bg-zinc-900/60 border-white/[0.08] text-white h-9 text-[13px]">
                  <SelectValue placeholder="Optional" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-white/10">
                  {(projects ?? []).map((p) => (
                    <SelectItem key={p.id} value={p.id} className="text-zinc-200 text-[13px] focus:bg-white/10 focus:text-white">
                      {(p as unknown as Project).name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="text-[11px] text-zinc-500 uppercase tracking-widest">Amount (£) *</Label>
              <Input name="amount" type="number" required placeholder="0" className="bg-zinc-900/60 border-white/[0.08] text-white placeholder:text-zinc-700 h-9 text-[13px]" />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="text-[11px] text-zinc-500 uppercase tracking-widest">Status</Label>
              <Select name="status" defaultValue="Unpaid">
                <SelectTrigger className="bg-zinc-900/60 border-white/[0.08] text-white h-9 text-[13px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-white/10">
                  {INVOICE_STATUSES.map((s) => (
                    <SelectItem key={s} value={s} className="text-zinc-200 text-[13px] focus:bg-white/10 focus:text-white">{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5 col-span-2">
              <Label className="text-[11px] text-zinc-500 uppercase tracking-widest">Due Date</Label>
              <Input name="due_date" type="date" className="bg-zinc-900/60 border-white/[0.08] text-white h-9 text-[13px]" />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-[11px] text-zinc-500 uppercase tracking-widest">Notes</Label>
            <Textarea name="notes" rows={3} className="bg-zinc-900/60 border-white/[0.08] text-white text-[13px] resize-none" />
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" className="bg-white text-black hover:bg-zinc-100 font-medium h-9 px-5 text-[13px] rounded-lg">
            Create Invoice
          </Button>
        </div>
      </form>
    </div>
  )
}
