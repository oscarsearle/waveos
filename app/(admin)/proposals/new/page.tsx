'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useTransition } from 'react'
import { createProposalAction } from '@/app/actions/proposals'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ChevronLeft } from 'lucide-react'
import { toast } from 'sonner'

export default function NewProposalPage() {
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

  return (
    <div className="p-8 max-w-2xl">
      <Link href="/proposals" className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 transition-colors mb-6">
        <ChevronLeft className="w-3.5 h-3.5" />
        Proposals
      </Link>
      <h1 className="text-lg font-semibold text-white mb-8">New Proposal</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <input type="hidden" name="client_id" value={clientId} />

        <div className="rounded-xl border border-white/[0.07] bg-zinc-900/40 p-6 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-zinc-400">Proposal Title <span className="text-red-400">*</span></Label>
            <Input name="title" required placeholder="e.g. Brand Film Package — Studio Name" className="bg-zinc-900 border-white/10 text-white h-9 text-sm placeholder:text-zinc-600" />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-zinc-400">Scope of Work</Label>
            <Textarea name="scope" rows={4} placeholder="Describe what is included in this proposal…" className="bg-zinc-900 border-white/10 text-white text-sm resize-none placeholder:text-zinc-600" />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-zinc-400">Deliverables</Label>
            <Textarea name="deliverables" rows={4} placeholder="e.g. 1x 60-second hero film, 3x 15-second social cuts, raw footage…" className="bg-zinc-900 border-white/10 text-white text-sm resize-none placeholder:text-zinc-600" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs text-zinc-400">Price (£)</Label>
              <Input name="price" type="number" placeholder="e.g. 3500" className="bg-zinc-900 border-white/10 text-white h-9 text-sm placeholder:text-zinc-600" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs text-zinc-400">Timeline</Label>
              <Input name="timeline" placeholder="e.g. 4 weeks from shoot date" className="bg-zinc-900 border-white/10 text-white h-9 text-sm placeholder:text-zinc-600" />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-zinc-400">Add-Ons / Optional Extras</Label>
            <Textarea name="add_ons" rows={3} placeholder="e.g. Additional edit £500, Drone footage £300…" className="bg-zinc-900 border-white/10 text-white text-sm resize-none placeholder:text-zinc-600" />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-zinc-400">Notes</Label>
            <Textarea name="notes" rows={3} placeholder="Internal notes, terms, payment schedule…" className="bg-zinc-900 border-white/10 text-white text-sm resize-none placeholder:text-zinc-600" />
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={isPending} className="bg-white text-black hover:bg-zinc-200 font-medium h-9 px-5 text-sm">
            {isPending ? 'Creating…' : 'Create Proposal'}
          </Button>
        </div>
      </form>
    </div>
  )
}
