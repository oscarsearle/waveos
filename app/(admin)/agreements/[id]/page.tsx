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
      <Link href="/agreements" className="inline-flex items-center gap-1.5 text-[12px] text-gray-400 hover:text-gray-700 transition-colors mb-6">
        <ChevronLeft className="w-3.5 h-3.5" />
        Agreements
      </Link>

      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-xl font-semibold text-gray-900 tracking-tight">{a.title}</h1>
            <AgreementStatusBadge status={a.status} />
          </div>
          {client && (
            <Link href={`/clients/${client.id}`} className="text-[13px] text-gray-400 hover:text-gray-700 transition-colors">
              {client.brand_name || client.name}
            </Link>
          )}
        </div>
        <AgreementStatusUpdater agreementId={id} currentStatus={a.status} />
      </div>

      {(a.sent_at || a.signed_at) && (
        <div className="flex items-center gap-3 mb-6">
          {a.sent_at && (
            <div className="flex items-center gap-1.5 text-[12px] text-gray-500 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5">
              <Calendar className="w-3.5 h-3.5" />
              Sent {new Date(a.sent_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
            </div>
          )}
          {a.signed_at && (
            <div className="flex items-center gap-1.5 text-[12px] text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-1.5">
              <Calendar className="w-3.5 h-3.5" />
              Signed {new Date(a.signed_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
            </div>
          )}
        </div>
      )}

      {a.file_url && (
        <a
          href={a.file_url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 mb-6 text-[13px] text-gray-600 hover:text-gray-900 transition-colors bg-gray-50 border border-gray-200 rounded-lg px-4 py-3"
        >
          <ExternalLink className="w-3.5 h-3.5 shrink-0" />
          View Agreement Document
        </a>
      )}

      <form action={updateAction} className="flex flex-col gap-5">
        <div className="rounded-xl border border-gray-200 bg-white p-6 flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <Label className="text-[11px] text-gray-400 uppercase tracking-widest font-semibold">Title</Label>
            <Input name="title" defaultValue={a.title} required className="bg-gray-50 border-gray-200 text-gray-900 h-9 text-[13px]" />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-[11px] text-gray-400 uppercase tracking-widest font-semibold">Template / Type</Label>
            <Select name="template_type" defaultValue={a.template_type ?? ''}>
              <SelectTrigger className="bg-gray-50 border-gray-200 text-gray-900 h-9 text-[13px]">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-200">
                {AGREEMENT_TEMPLATES.map((t) => (
                  <SelectItem key={t} value={t} className="text-gray-700 text-[13px] focus:bg-gray-50 focus:text-gray-900">{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-[11px] text-gray-400 uppercase tracking-widest font-semibold">File / Link</Label>
            <Input name="file_url" type="url" defaultValue={a.file_url ?? ''} placeholder="https://" className="bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-300 h-9 text-[13px]" />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-[11px] text-gray-400 uppercase tracking-widest font-semibold">Notes</Label>
            <Textarea name="notes" rows={4} defaultValue={a.notes ?? ''} className="bg-gray-50 border-gray-200 text-gray-900 text-[13px] resize-none" />
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" className="font-medium h-9 px-5 text-[13px] rounded-lg text-white" style={{ background: '#054F99' }}>
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  )
}
