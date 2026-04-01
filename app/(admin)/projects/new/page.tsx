'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useTransition } from 'react'
import { createProjectAction } from '@/app/actions/projects'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { PIPELINE_STAGES } from '@/lib/constants'
import { ChevronLeft } from 'lucide-react'
import { toast } from 'sonner'

export default function NewProjectPage() {
  const searchParams = useSearchParams()
  const clientId = searchParams.get('client_id') ?? ''
  const [isPending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    startTransition(async () => {
      try {
        await createProjectAction(formData)
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Error creating project')
      }
    })
  }

  return (
    <div className="p-8 max-w-2xl">
      <Link
        href="/projects"
        className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 transition-colors mb-6"
      >
        <ChevronLeft className="w-3.5 h-3.5" />
        Projects
      </Link>
      <h1 className="text-lg font-semibold text-white mb-8">New Project</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <input type="hidden" name="client_id" value={clientId} />

        <div className="rounded-xl border border-white/[0.07] bg-zinc-900/40 p-6 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-zinc-400">Project Name <span className="text-red-400">*</span></Label>
            <Input name="name" required className="bg-zinc-900 border-white/10 text-white h-9 text-sm" />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-zinc-400">Pipeline Stage</Label>
            <Select name="stage" defaultValue="Lead">
              <SelectTrigger className="bg-zinc-900 border-white/10 text-white h-9 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-white/10">
                {PIPELINE_STAGES.map((s) => (
                  <SelectItem key={s} value={s} className="text-zinc-200 focus:bg-white/10 focus:text-white">{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs text-zinc-400">Shoot Date</Label>
              <Input name="shoot_date" type="date" className="bg-zinc-900 border-white/10 text-white h-9 text-sm" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs text-zinc-400">Deadline</Label>
              <Input name="deadline" type="date" className="bg-zinc-900 border-white/10 text-white h-9 text-sm" />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-zinc-400">Description</Label>
            <Textarea name="description" rows={3} className="bg-zinc-900 border-white/10 text-white text-sm resize-none" />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-zinc-400">Deliverables</Label>
            <Textarea name="deliverables" rows={3} placeholder="List the key deliverables…" className="bg-zinc-900 border-white/10 text-white text-sm resize-none placeholder:text-zinc-600" />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-zinc-400">Notes</Label>
            <Textarea name="notes" rows={3} className="bg-zinc-900 border-white/10 text-white text-sm resize-none" />
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={isPending} className="bg-white text-black hover:bg-zinc-200 font-medium h-9 px-5 text-sm">
            {isPending ? 'Creating…' : 'Create Project'}
          </Button>
        </div>
      </form>
    </div>
  )
}
