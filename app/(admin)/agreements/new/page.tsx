import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { createAgreementAction } from '@/app/actions/agreements'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AGREEMENT_TEMPLATES } from '@/lib/constants'
import { ChevronLeft } from 'lucide-react'
import type { Client, Project } from '@/lib/types'

export default async function NewAgreementPage({
  searchParams,
}: {
  searchParams: Promise<{ client_id?: string }>
}) {
  const { client_id } = await searchParams
  const supabase = await createClient()

  const [{ data: clients }, { data: projects }] = await Promise.all([
    supabase.from('clients').select('id, name, brand_name').order('name'),
    supabase.from('projects').select('id, name, client_id').order('name'),
  ])

  return (
    <div className="p-8 max-w-2xl">
      <Link href="/agreements" className="inline-flex items-center gap-1.5 text-[12px] text-zinc-600 hover:text-zinc-300 transition-colors mb-6">
        <ChevronLeft className="w-3.5 h-3.5" />
        Agreements
      </Link>
      <h1 className="text-lg font-semibold text-white tracking-tight mb-8">New Agreement</h1>

      <form action={createAgreementAction} className="flex flex-col gap-5">
        <div className="rounded-xl border border-white/[0.07] bg-[#0f0f0f] p-6 flex flex-col gap-5">

          <div className="flex flex-col gap-1.5">
            <Label className="text-[11px] text-zinc-500 uppercase tracking-widest">Title <span className="text-red-400 normal-case tracking-normal">*</span></Label>
            <Input name="title" required placeholder="e.g. Production Agreement — Studio Name" className="bg-zinc-900/60 border-white/[0.08] text-white placeholder:text-zinc-700 h-9 text-[13px]" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label className="text-[11px] text-zinc-500 uppercase tracking-widest">Client</Label>
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
                  <SelectValue placeholder="Link to project (optional)" />
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
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-[11px] text-zinc-500 uppercase tracking-widest">Template / Type</Label>
            <Select name="template_type">
              <SelectTrigger className="bg-zinc-900/60 border-white/[0.08] text-white h-9 text-[13px]">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-white/10">
                {AGREEMENT_TEMPLATES.map((t) => (
                  <SelectItem key={t} value={t} className="text-zinc-200 text-[13px] focus:bg-white/10 focus:text-white">{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-[11px] text-zinc-500 uppercase tracking-widest">File / Link</Label>
            <Input name="file_url" type="url" placeholder="https:// (Google Doc, DocuSign, Dropbox…)" className="bg-zinc-900/60 border-white/[0.08] text-white placeholder:text-zinc-700 h-9 text-[13px]" />
            <p className="text-[11px] text-zinc-700">Link to the agreement document or signed PDF.</p>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-[11px] text-zinc-500 uppercase tracking-widest">Notes</Label>
            <Textarea name="notes" rows={3} placeholder="Internal notes…" className="bg-zinc-900/60 border-white/[0.08] text-white placeholder:text-zinc-700 text-[13px] resize-none" />
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" className="bg-white text-black hover:bg-zinc-100 font-medium h-9 px-5 text-[13px] rounded-lg">
            Create Agreement
          </Button>
        </div>
      </form>
    </div>
  )
}
