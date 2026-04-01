import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { AgreementStatusBadge } from '@/components/agreements/AgreementStatusBadge'
import { AgreementStatusUpdater } from '@/components/agreements/AgreementStatusUpdater'
import { updateAgreementAction } from '@/app/actions/agreements'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AGREEMENT_TEMPLATES } from '@/lib/constants'
import { ChevronLeft, ExternalLink, Calendar } from 'lucide-react'
import type { Agreement, Client } from '@/lib/types'

export default async function AgreementDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: agreement } = await supabase
    .from('agreements')
    .select('*, clients(id, name, brand_name), projects(id, name)')
    .eq('id', id)
    .single()

  if (!agreement) notFound()

  const a = agreement as Agreement
  const client = a.clients as unknown as Pick<Client, 'id' | 'name' | 'brand_name'> | null

  async function updateAction(formData: FormData) {
    'use server'
    await updateAgreementAction(id, formData)
  }

  return (
    <div className="p-8 max-w-2xl">
      <Link href="/agreements" className="inline-flex items-center gap-1.5 text-[12px] text-zinc-600 hover:text-zinc-300 transition-colors mb-6">
        <ChevronLeft className="w-3.5 h-3.5" />
        Agreements
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-xl font-semibold text-white tracking-tight">{a.title}</h1>
            <AgreementStatusBadge status={a.status} />
          </div>
          {client && (
            <Link href={`/clients/${client.id}`} className="text-[13px] text-zinc-500 hover:text-zinc-300 transition-colors">
              {client.brand_name || client.name}
            </Link>
          )}
        </div>
        <AgreementStatusUpdater agreementId={id} currentStatus={a.status} />
      </div>

      {/* Timeline chips */}
      {(a.sent_at || a.signed_at) && (
        <div className="flex items-center gap-3 mb-6">
          {a.sent_at && (
            <div className="flex items-center gap-1.5 text-[12px] text-zinc-500 bg-white/[0.04] border border-white/[0.06] rounded-lg px-3 py-1.5">
              <Calendar className="w-3.5 h-3.5" />
              Sent {new Date(a.sent_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
            </div>
          )}
          {a.signed_at && (
            <div className="flex items-center gap-1.5 text-[12px] text-emerald-400 bg-emerald-950/40 border border-emerald-900/50 rounded-lg px-3 py-1.5">
              <Calendar className="w-3.5 h-3.5" />
              Signed {new Date(a.signed_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
            </div>
          )}
        </div>
      )}

      {/* File link */}
      {a.file_url && (
        <a
          href={a.file_url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 mb-6 text-[13px] text-zinc-400 hover:text-white transition-colors bg-white/[0.03] border border-white/[0.07] rounded-lg px-4 py-3"
        >
          <ExternalLink className="w-3.5 h-3.5 shrink-0" />
          View Agreement Document
        </a>
      )}

      {/* Edit form */}
      <form action={updateAction} className="flex flex-col gap-5">
        <div className="rounded-xl border border-white/[0.07] bg-[#0f0f0f] p-6 flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <Label className="text-[11px] text-zinc-500 uppercase tracking-widest">Title</Label>
            <Input name="title" defaultValue={a.title} required className="bg-zinc-900/60 border-white/[0.08] text-white h-9 text-[13px]" />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-[11px] text-zinc-500 uppercase tracking-widest">Template / Type</Label>
            <Select name="template_type" defaultValue={a.template_type ?? ''}>
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
            <Input name="file_url" type="url" defaultValue={a.file_url ?? ''} placeholder="https://" className="bg-zinc-900/60 border-white/[0.08] text-white placeholder:text-zinc-700 h-9 text-[13px]" />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-[11px] text-zinc-500 uppercase tracking-widest">Notes</Label>
            <Textarea name="notes" rows={4} defaultValue={a.notes ?? ''} className="bg-zinc-900/60 border-white/[0.08] text-white text-[13px] resize-none" />
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" className="bg-white text-black hover:bg-zinc-100 font-medium h-9 px-5 text-[13px] rounded-lg">
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  )
}
