'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useState, useTransition, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { createProjectAction } from '@/app/actions/projects'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { PIPELINE_STAGES } from '@/lib/constants'
import { ChevronLeft } from 'lucide-react'
import { toast } from 'sonner'

function NewProjectForm() {
  const searchParams = useSearchParams()
  const clientId = searchParams.get('client_id') ?? ''
  const [isPending, startTransition] = useTransition()
  const [shootTbc, setShootTbc] = useState(false)
  const [deadlineTbc, setDeadlineTbc] = useState(false)
  const router = useRouter()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    if (shootTbc) formData.set('shoot_date', '')
    if (deadlineTbc) formData.set('deadline', '')
    startTransition(async () => {
      try {
        const { id } = await createProjectAction(formData)
        router.push(`/projects/${id}`)
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Error creating project')
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
            Project Name <span className="text-red-400">*</span>
          </Label>
          <Input name="name" required className={inputCls} style={inputStyle} />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: '#3d5475' }}>Pipeline Stage</Label>
          <Select name="stage" defaultValue="Lead">
            <SelectTrigger className="h-9 text-sm border text-white" style={inputStyle}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent style={{ background: '#0c1420', borderColor: '#1a2a45' }}>
              {PIPELINE_STAGES.map((s) => (
                <SelectItem key={s} value={s} className="text-white/70 text-sm focus:bg-white/[0.06] focus:text-white">{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <Label className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: '#3d5475' }}>Shoot Date</Label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={shootTbc}
                  onChange={e => setShootTbc(e.target.checked)}
                  className="rounded"
                  style={{ accentColor: '#00B7FF' }}
                />
                <span className="text-[10px] font-medium" style={{ color: shootTbc ? '#00B7FF' : '#3d5475' }}>TBC</span>
              </label>
            </div>
            <Input
              name="shoot_date"
              type="date"
              disabled={shootTbc}
              className={inputCls}
              style={{ ...inputStyle, opacity: shootTbc ? 0.3 : 1 }}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <Label className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: '#3d5475' }}>Deadline</Label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={deadlineTbc}
                  onChange={e => setDeadlineTbc(e.target.checked)}
                  className="rounded"
                  style={{ accentColor: '#00B7FF' }}
                />
                <span className="text-[10px] font-medium" style={{ color: deadlineTbc ? '#00B7FF' : '#3d5475' }}>TBC</span>
              </label>
            </div>
            <Input
              name="deadline"
              type="date"
              disabled={deadlineTbc}
              className={inputCls}
              style={{ ...inputStyle, opacity: deadlineTbc ? 0.3 : 1 }}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: '#3d5475' }}>Description</Label>
          <Textarea name="description" rows={3} className="text-sm resize-none border" style={inputStyle} />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: '#3d5475' }}>Deliverables</Label>
          <Textarea name="deliverables" rows={3} placeholder="List the key deliverables…" className="text-sm resize-none border placeholder:text-white/20" style={inputStyle} />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: '#3d5475' }}>Notes</Label>
          <Textarea name="notes" rows={3} className="text-sm resize-none border" style={inputStyle} />
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isPending} className="font-medium h-9 px-5 text-sm text-white" style={{ background: '#054F99' }}>
          {isPending ? 'Creating…' : 'Create Project'}
        </Button>
      </div>
    </form>
  )
}

export default function NewProjectPage() {
  return (
    <div className="p-8 max-w-2xl">
      <Link
        href="/projects"
        className="inline-flex items-center gap-1.5 text-xs hover:text-[#00B7FF] transition-colors mb-6"
        style={{ color: '#3d5475' }}
      >
        <ChevronLeft className="w-3.5 h-3.5" />
        Projects
      </Link>
      <h1 className="text-lg font-bold mb-8" style={{ fontFamily: 'var(--font-poppins)', color: '#e8eeff', letterSpacing: '-0.02em' }}>New Project</h1>
      <Suspense fallback={null}>
        <NewProjectForm />
      </Suspense>
    </div>
  )
}
