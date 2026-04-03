'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { createProposalAction } from '@/app/actions/proposals'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'

type ClientOption = { id: string; name: string; brand_name: string | null }

export function NewProposalForm({
  clients,
  defaultClientId,
}: {
  clients: ClientOption[]
  defaultClientId: string
}) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    startTransition(async () => {
      try {
        const { id } = await createProposalAction(formData)
        router.push(`/proposals/${id}`)
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Error creating proposal')
      }
    })
  }

  const inputStyle = { background: '#0d1728', borderColor: '#1a2a45', color: '#e8eeff' }
  const inputCls = "h-9 text-sm border text-white placeholder:text-white/20"

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="rounded-xl border p-6 flex flex-col gap-4" style={{ background: '#0b1120', borderColor: '#162035' }}>

        <div className="flex flex-col gap-1.5">
          <Label className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: '#3d5475' }}>
            Client
          </Label>
          <Select name="client_id" defaultValue={defaultClientId || undefined}>
            <SelectTrigger className="h-9 text-sm border text-white" style={inputStyle}>
              <SelectValue placeholder="Select a client…" />
            </SelectTrigger>
            <SelectContent style={{ background: '#0c1420', borderColor: '#1a2a45' }}>
              {clients.map((c) => (
                <SelectItem key={c.id} value={c.id} className="text-white/70 text-sm focus:bg-white/[0.06] focus:text-white">
                  {c.brand_name || c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

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
