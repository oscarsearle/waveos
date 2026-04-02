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

  const inputCls = "h-9 text-sm border text-white placeholder:text-white/20"
  const inputStyle = { background: '#0d1728', borderColor: '#1a2a45', color: '#e8eeff' }

  return (
    <div className="p-8 max-w-2xl">
      <Link href="/proposals" className="inline-flex items-center gap-1.5 text-xs hover:text-[#00B7FF] transition-colors mb-6" style={{ color: '#3d5475' }}>
        <ChevronLeft className="w-3.5 h-3.5" />
        Proposals
      </Link>

      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-xl font-bold" style={{ fontFamily: 'var(--font-poppins)', color: '#e8eeff', letterSpacing: '-0.02em' }}>{p.title}</h1>
            <ProposalStatusBadge status={p.status} />
          </div>
          {p.clients && (
            <Link href={`/clients/${p.clients.id}`} className="text-sm hover:text-[#00B7FF] transition-colors" style={{ color: '#3d5475' }}>
              {p.clients.brand_name || p.clients.name}
            </Link>
          )}
          {p.price && (
            <p className="text-sm mt-0.5" style={{ color: '#3d5475' }}>£{p.price.toLocaleString()}</p>
          )}
        </div>
        <ProposalStatusUpdater proposalId={id} currentStatus={p.status} />
      </div>

      <form action={updateAction} className="flex flex-col gap-5">
        <div className="rounded-xl border p-6 flex flex-col gap-4" style={{ background: '#0b1120', borderColor: '#162035' }}>
          <div className="flex flex-col gap-1.5">
            <Label className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: '#3d5475' }}>Proposal Title</Label>
            <Input name="title" defaultValue={p.title} required className={inputCls} style={inputStyle} />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: '#3d5475' }}>Scope of Work</Label>
            <Textarea name="scope" rows={5} defaultValue={p.scope ?? ''} className="text-sm resize-none border" style={inputStyle} />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: '#3d5475' }}>Deliverables</Label>
            <Textarea name="deliverables" rows={5} defaultValue={p.deliverables ?? ''} className="text-sm resize-none border" style={inputStyle} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: '#3d5475' }}>Price (£)</Label>
              <Input name="price" type="number" defaultValue={p.price?.toString() ?? ''} className={inputCls} style={inputStyle} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: '#3d5475' }}>Timeline</Label>
              <Input name="timeline" defaultValue={p.timeline ?? ''} className={inputCls} style={inputStyle} />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: '#3d5475' }}>Add-Ons / Optional Extras</Label>
            <Textarea name="add_ons" rows={3} defaultValue={p.add_ons ?? ''} className="text-sm resize-none border" style={inputStyle} />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: '#3d5475' }}>Notes</Label>
            <Textarea name="notes" rows={3} defaultValue={p.notes ?? ''} className="text-sm resize-none border" style={inputStyle} />
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
