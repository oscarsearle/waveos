'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useTransition, Suspense } from 'react'
import { createProposalAction } from '@/app/actions/proposals'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ChevronLeft } from 'lucide-react'
import { toast } from 'sonner'

function NewProposalForm() {
  const searchParams = useSearchParams()
  const clientId = searchParams.get('client_id') ?? ''
  const [isPending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    startTransition(async () => {
      try {
        await createProposalAction(formData)
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Error creating proposal')
      }
    })
  }

  const inputStyle = { background: '#0d1728', borderColor: '#1a2a45', color: '#e8eeff' }
  const inputCls = "h-9 text-sm border text-white placeholder:text-white/20"

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <input type="hidden" name="client_id" value={clientId} />

      <div className="rounded-xl border p-6 flex flex-col gap-4" style={{ background: '#0b1120', borderColor: '#162035' }}>
        <div className="flex flex-col gap-1.5">
          <Label className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: '#3d5475' }}>
            Proposal Title <span className="text-red-400">*</span>
          </Label>
          <Input name="title" required placeholder="e.g. Brand Film Package — Studio Name" className={`${inputCls} placeholder:text-white/20`} style={inputStyle} />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: '#3d5475' }}>Scope of Work</Label>
          <Textarea name="scope" rows={4} placeholder="Describe what is included…" className="text-sm resize-none border placeholder:text-white/20" style={inputStyle} />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: '#3d5475' }}>Deliverables</Label>
          <Textarea name="deliverables" rows={4} placeholder="e.g. 1x 60-second hero film, 3x 15-second social cuts…" className="text-sm resize-none border placeholder:text-white/20" style={inputStyle} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <Label className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: '#3d5475' }}>Price (£)</Label>
            <Input name="price" type="number" placeholder="e.g. 3500" className={`${inputCls} placeholder:text-white/20`} style={inputStyle} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: '#3d5475' }}>Timeline</Label>
            <Input name="timeline" placeholder="e.g. 4 weeks from shoot date" className={`${inputCls} placeholder:text-white/20`} style={inputStyle} />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: '#3d5475' }}>Add-Ons / Optional Extras</Label>
          <Textarea name="add_ons" rows={3} placeholder="e.g. Additional edit £500, Drone footage £300…" className="text-sm resize-none border placeholder:text-white/20" style={inputStyle} />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: '#3d5475' }}>Notes</Label>
          <Textarea name="notes" rows={3} placeholder="Internal notes, terms, payment schedule…" className="text-sm resize-none border placeholder:text-white/20" style={inputStyle} />
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isPending} className="font-medium h-9 px-5 text-sm text-white" style={{ background: '#054F99' }}>
          {isPending ? 'Creating…' : 'Create Proposal'}
        </Button>
      </div>
    </form>
  )
}

export default function NewProposalPage() {
  return (
    <div className="p-8 max-w-2xl">
      <Link href="/proposals" className="inline-flex items-center gap-1.5 text-xs hover:text-[#00B7FF] transition-colors mb-6" style={{ color: '#3d5475' }}>
        <ChevronLeft className="w-3.5 h-3.5" />
        Proposals
      </Link>
      <h1 className="text-lg font-bold mb-8" style={{ fontFamily: 'var(--font-poppins)', color: '#e8eeff', letterSpacing: '-0.02em' }}>New Proposal</h1>
      <Suspense fallback={null}>
        <NewProposalForm />
      </Suspense>
    </div>
  )
}
