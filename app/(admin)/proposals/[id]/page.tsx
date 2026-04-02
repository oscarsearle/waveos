import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { ProposalStatusBadge } from '@/components/proposals/ProposalStatusBadge'
import { ProposalStatusUpdater } from '@/components/proposals/ProposalStatusUpdater'
import { updateProposalAction } from '@/app/actions/proposals'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ChevronLeft } from 'lucide-react'
import type { Proposal, Client } from '@/lib/types'

export default async function ProposalDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: proposal } = await supabase
    .from('proposals')
    .select('*, clients(id, name, brand_name)')
    .eq('id', id)
    .single()

  if (!proposal) notFound()

  const p = proposal as Proposal & { clients: Pick<Client, 'id' | 'name' | 'brand_name'> | null }

  async function updateAction(formData: FormData) {
    'use server'
    await updateProposalAction(id, formData)
  }

  return (
    <div className="p-8 max-w-2xl">
      <Link href="/proposals" className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-700 transition-colors mb-6">
        <ChevronLeft className="w-3.5 h-3.5" />
        Proposals
      </Link>

      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-xl font-semibold text-gray-900">{p.title}</h1>
            <ProposalStatusBadge status={p.status} />
          </div>
          {p.clients && (
            <Link href={`/clients/${p.clients.id}`} className="text-sm text-gray-400 hover:text-gray-700 transition-colors">
              {p.clients.brand_name || p.clients.name}
            </Link>
          )}
          {p.price && (
            <p className="text-sm text-gray-500 mt-0.5">£{p.price.toLocaleString()}</p>
          )}
        </div>
        <ProposalStatusUpdater proposalId={id} currentStatus={p.status} />
      </div>

      <form action={updateAction} className="flex flex-col gap-5">
        <div className="rounded-xl border border-gray-200 bg-white p-6 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-gray-400 font-semibold uppercase tracking-widest">Proposal Title</Label>
            <Input name="title" defaultValue={p.title} required className="bg-gray-50 border-gray-200 text-gray-900 h-9 text-sm" />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-gray-400 font-semibold uppercase tracking-widest">Scope of Work</Label>
            <Textarea name="scope" rows={5} defaultValue={p.scope ?? ''} className="bg-gray-50 border-gray-200 text-gray-900 text-sm resize-none" />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-gray-400 font-semibold uppercase tracking-widest">Deliverables</Label>
            <Textarea name="deliverables" rows={5} defaultValue={p.deliverables ?? ''} className="bg-gray-50 border-gray-200 text-gray-900 text-sm resize-none" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs text-gray-400 font-semibold uppercase tracking-widest">Price (£)</Label>
              <Input name="price" type="number" defaultValue={p.price?.toString() ?? ''} className="bg-gray-50 border-gray-200 text-gray-900 h-9 text-sm" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs text-gray-400 font-semibold uppercase tracking-widest">Timeline</Label>
              <Input name="timeline" defaultValue={p.timeline ?? ''} className="bg-gray-50 border-gray-200 text-gray-900 h-9 text-sm" />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-gray-400 font-semibold uppercase tracking-widest">Add-Ons / Optional Extras</Label>
            <Textarea name="add_ons" rows={3} defaultValue={p.add_ons ?? ''} className="bg-gray-50 border-gray-200 text-gray-900 text-sm resize-none" />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-gray-400 font-semibold uppercase tracking-widest">Notes</Label>
            <Textarea name="notes" rows={3} defaultValue={p.notes ?? ''} className="bg-gray-50 border-gray-200 text-gray-900 text-sm resize-none" />
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" className="font-medium h-9 px-5 text-sm text-white" style={{ background: '#054F99' }}>
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  )
}
