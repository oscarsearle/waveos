import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { StatusBadge } from '@/components/clients/StatusBadge'
import { DeliverablesPanel } from '@/components/deliverables/DeliverablesPanel'
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

  const [{ data: project }, { data: deliverables }] = await Promise.all([
    supabase.from('projects').select('*, clients(id, name, brand_name)').eq('id', id).single(),
    supabase.from('deliverables').select('*').eq('project_id', id).order('created_at', { ascending: true }),
  ])

  if (!project) notFound()

  const p = project as Project & { clients: Pick<Client, 'id' | 'name' | 'brand_name'> | null }

  async function updateAction(formData: FormData) {
    'use server'
    await updateProjectAction(id, formData)
  }

  return (
    <div className="p-8 max-w-2xl">
      <Link href="/projects" className="inline-flex items-center gap-1.5 text-[12px] text-zinc-600 hover:text-zinc-300 transition-colors mb-6">
        <ChevronLeft className="w-3.5 h-3.5" />
        Projects
      </Link>

      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-xl font-semibold text-white tracking-tight">{p.name}</h1>
            <StatusBadge status={p.stage} />
          </div>
          {p.clients && (
            <Link href={`/clients/${p.clients.id}`} className="text-[13px] text-zinc-500 hover:text-zinc-300 transition-colors">
              {p.clients.brand_name || p.clients.name}
            </Link>
          )}
        </div>
      </div>

      <Tabs defaultValue="details" className="w-full">
        <TabsList className="bg-zinc-900/60 border border-white/[0.07] mb-6 h-8">
          <TabsTrigger value="details" className="text-[12px] data-[state=active]:bg-white/[0.08] data-[state=active]:text-white text-zinc-500">Details</TabsTrigger>
          <TabsTrigger value="deliverables" className="text-[12px] data-[state=active]:bg-white/[0.08] data-[state=active]:text-white text-zinc-500">
            Deliverables {(deliverables ?? []).length > 0 ? `(${deliverables!.length})` : ''}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="mt-0">
          <form action={updateAction} className="flex flex-col gap-5">
            <div className="rounded-xl border border-white/[0.07] bg-[#0f0f0f] p-6 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label className="text-[11px] text-zinc-500 uppercase tracking-widest">Project Name</Label>
                <Input name="name" defaultValue={p.name} required className="bg-zinc-900/60 border-white/[0.08] text-white h-9 text-[13px]" />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label className="text-[11px] text-zinc-500 uppercase tracking-widest">Pipeline Stage</Label>
                <Select name="stage" defaultValue={p.stage}>
                  <SelectTrigger className="bg-zinc-900/60 border-white/[0.08] text-white h-9 text-[13px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-white/10">
                    {PIPELINE_STAGES.map((s) => (
                      <SelectItem key={s} value={s} className="text-zinc-200 text-[13px] focus:bg-white/10 focus:text-white">{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label className="text-[11px] text-zinc-500 uppercase tracking-widest">Shoot Date</Label>
                  <Input name="shoot_date" type="date" defaultValue={p.shoot_date ?? ''} className="bg-zinc-900/60 border-white/[0.08] text-white h-9 text-[13px]" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label className="text-[11px] text-zinc-500 uppercase tracking-widest">Deadline</Label>
                  <Input name="deadline" type="date" defaultValue={p.deadline ?? ''} className="bg-zinc-900/60 border-white/[0.08] text-white h-9 text-[13px]" />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label className="text-[11px] text-zinc-500 uppercase tracking-widest">Description</Label>
                <Textarea name="description" rows={3} defaultValue={p.description ?? ''} className="bg-zinc-900/60 border-white/[0.08] text-white text-[13px] resize-none" />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label className="text-[11px] text-zinc-500 uppercase tracking-widest">Deliverables (summary)</Label>
                <Textarea name="deliverables" rows={3} defaultValue={p.deliverables ?? ''} className="bg-zinc-900/60 border-white/[0.08] text-white text-[13px] resize-none" />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label className="text-[11px] text-zinc-500 uppercase tracking-widest">Notes</Label>
                <Textarea name="notes" rows={3} defaultValue={p.notes ?? ''} className="bg-zinc-900/60 border-white/[0.08] text-white text-[13px] resize-none" />
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" className="bg-white text-black hover:bg-zinc-100 font-medium h-9 px-5 text-[13px] rounded-lg">
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
      </Tabs>
    </div>
  )
}
