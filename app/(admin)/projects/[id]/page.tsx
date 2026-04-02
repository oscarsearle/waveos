import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { StatusBadge } from '@/components/clients/StatusBadge'
import { DeliverablesPanel } from '@/components/deliverables/DeliverablesPanel'
import { FrameioPanel } from '@/components/frameio/FrameioPanel'
import { updateProjectAction } from '@/app/actions/projects'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PIPELINE_STAGES } from '@/lib/constants'
import { ChevronLeft } from 'lucide-react'
import type { Project, Client, Deliverable } from '@/lib/types'

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const [{ data: project }, { data: deliverables }, { data: frameioIntegration }] = await Promise.all([
    supabase.from('projects').select('*, clients(id, name, brand_name)').eq('id', id).single(),
    supabase.from('deliverables').select('*').eq('project_id', id).order('created_at', { ascending: true }),
    supabase.from('integrations').select('account_id').eq('service', 'frameio').maybeSingle(),
  ])

  if (!project) notFound()

  const p = project as Project & { clients: Pick<Client, 'id' | 'name' | 'brand_name'> | null }

  async function updateAction(formData: FormData) {
    'use server'
    await updateProjectAction(id, formData)
  }

  const inputCls = "h-9 text-[13px] border text-white placeholder:text-white/20"
  const inputStyle = { background: '#0d1728', borderColor: '#1a2a45', color: '#e8eeff' }

  return (
    <div className="p-8 max-w-2xl">
      <Link href="/projects" className="inline-flex items-center gap-1.5 text-[12px] hover:text-[#00B7FF] transition-colors mb-6" style={{ color: '#3d5475' }}>
        <ChevronLeft className="w-3.5 h-3.5" />
        Projects
      </Link>

      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-xl font-bold" style={{ fontFamily: 'var(--font-poppins)', color: '#e8eeff', letterSpacing: '-0.02em' }}>{p.name}</h1>
            <StatusBadge status={p.stage} />
          </div>
          {p.clients && (
            <Link href={`/clients/${p.clients.id}`} className="text-[13px] hover:text-[#00B7FF] transition-colors" style={{ color: '#3d5475' }}>
              {p.clients.brand_name || p.clients.name}
            </Link>
          )}
        </div>
      </div>

      <Tabs defaultValue="details" className="w-full">
        <TabsList className="mb-6 h-8 border" style={{ background: '#0d1728', borderColor: '#162035' }}>
          <TabsTrigger value="details" className="text-[12px] data-[state=active]:bg-white/[0.06] data-[state=active]:text-white text-white/40">Details</TabsTrigger>
          <TabsTrigger value="deliverables" className="text-[12px] data-[state=active]:bg-white/[0.06] data-[state=active]:text-white text-white/40">
            Deliverables {(deliverables ?? []).length > 0 ? `(${deliverables!.length})` : ''}
          </TabsTrigger>
          <TabsTrigger value="assets" className="text-[12px] data-[state=active]:bg-white/[0.06] data-[state=active]:text-white text-white/40">Frame.io</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="mt-0">
          <form action={updateAction} className="flex flex-col gap-5">
            <div className="rounded-xl border p-6 flex flex-col gap-4" style={{ background: '#0b1120', borderColor: '#162035' }}>
              <div className="flex flex-col gap-1.5">
                <Label className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: '#3d5475' }}>Project Name</Label>
                <Input name="name" defaultValue={p.name} required className={inputCls} style={inputStyle} />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: '#3d5475' }}>Pipeline Stage</Label>
                <Select name="stage" defaultValue={p.stage}>
                  <SelectTrigger className="h-9 text-[13px] border text-white" style={inputStyle}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent style={{ background: '#0c1420', borderColor: '#1a2a45' }}>
                    {PIPELINE_STAGES.map((s) => (
                      <SelectItem key={s} value={s} className="text-white/70 text-[13px] focus:bg-white/[0.06] focus:text-white">{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: '#3d5475' }}>Shoot Date</Label>
                  <Input name="shoot_date" type="date" defaultValue={p.shoot_date ?? ''} className={inputCls} style={inputStyle} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: '#3d5475' }}>Deadline</Label>
                  <Input name="deadline" type="date" defaultValue={p.deadline ?? ''} className={inputCls} style={inputStyle} />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: '#3d5475' }}>Description</Label>
                <Textarea name="description" rows={3} defaultValue={p.description ?? ''} className="text-[13px] resize-none border" style={inputStyle} />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: '#3d5475' }}>Deliverables (summary)</Label>
                <Textarea name="deliverables" rows={3} defaultValue={p.deliverables ?? ''} className="text-[13px] resize-none border" style={inputStyle} />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: '#3d5475' }}>Notes</Label>
                <Textarea name="notes" rows={3} defaultValue={p.notes ?? ''} className="text-[13px] resize-none border" style={inputStyle} />
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" className="font-medium h-9 px-5 text-[13px] rounded-lg text-white" style={{ background: '#054F99' }}>
                Save Changes
              </Button>
            </div>
          </form>
        </TabsContent>

        <TabsContent value="deliverables" className="mt-0">
          <DeliverablesPanel
            projectId={id}
            clientId={p.client_id}
            deliverables={(deliverables ?? []) as Deliverable[]}
          />
        </TabsContent>

        <TabsContent value="assets" className="mt-0">
          <FrameioPanel isConnected={!!frameioIntegration?.account_id} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
