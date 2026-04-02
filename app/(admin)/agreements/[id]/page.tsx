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

  const inputCls = "h-9 text-[13px] border text-white placeholder:text-white/20"
  const inputStyle = { background: '#0d1728', borderColor: '#1a2a45', color: '#e8eeff' }

  return (
    <div className="p-8 max-w-2xl">
      <Link href="/agreements" className="inline-flex items-center gap-1.5 text-[12px] hover:text-[#00B7FF] transition-colors mb-6" style={{ color: '#3d5475' }}>
        <ChevronLeft className="w-3.5 h-3.5" />
        Agreements
      </Link>

      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-xl font-bold" style={{ fontFamily: 'var(--font-poppins)', color: '#e8eeff', letterSpacing: '-0.02em' }}>{a.title}</h1>
            <AgreementStatusBadge status={a.status} />
          </div>
          {client && (
            <Link href={`/clients/${client.id}`} className="text-[13px] hover:text-[#00B7FF] transition-colors" style={{ color: '#3d5475' }}>
              {client.brand_name || client.name}
            </Link>
          )}
        </div>
        <AgreementStatusUpdater agreementId={id} currentStatus={a.status} />
      </div>

      {(a.sent_at || a.signed_at) && (
        <div className="flex items-center gap-3 mb-6">
          {a.sent_at && (
            <div className="flex items-center gap-1.5 text-[12px] rounded-lg px-3 py-1.5 border" style={{ color: '#5a7099', background: '#0d1728', borderColor: '#1a2a45' }}>
              <Calendar className="w-3.5 h-3.5" />
              Sent {new Date(a.sent_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
            </div>
          )}
          {a.signed_at && (
            <div className="flex items-center gap-1.5 text-[12px] rounded-lg px-3 py-1.5 border" style={{ color: '#6ee7b7', background: 'rgba(16,185,129,0.08)', borderColor: 'rgba(16,185,129,0.2)' }}>
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
          className="flex items-center gap-2 mb-6 text-[13px] hover:text-[#00B7FF] transition-colors rounded-lg px-4 py-3 border"
          style={{ color: '#5a7099', background: '#0d1728', borderColor: '#1a2a45' }}
        >
          <ExternalLink className="w-3.5 h-3.5 shrink-0" />
          View Agreement Document
        </a>
      )}

      <form action={updateAction} className="flex flex-col gap-5">
        <div className="rounded-xl border p-6 flex flex-col gap-5" style={{ background: '#0b1120', borderColor: '#162035' }}>
          <div className="flex flex-col gap-1.5">
            <Label className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: '#3d5475' }}>Title</Label>
            <Input name="title" defaultValue={a.title} required className={inputCls} style={inputStyle} />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: '#3d5475' }}>Template / Type</Label>
            <Select name="template_type" defaultValue={a.template_type ?? ''}>
              <SelectTrigger className="h-9 text-[13px] border text-white" style={inputStyle}>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent style={{ background: '#0c1420', borderColor: '#1a2a45' }}>
                {AGREEMENT_TEMPLATES.map((t) => (
                  <SelectItem key={t} value={t} className="text-white/70 text-[13px] focus:bg-white/[0.06] focus:text-white">{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: '#3d5475' }}>File / Link</Label>
            <Input name="file_url" type="url" defaultValue={a.file_url ?? ''} placeholder="https://" className={inputCls} style={{ ...inputStyle, color: a.file_url ? '#e8eeff' : undefined }} />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: '#3d5475' }}>Notes</Label>
            <Textarea name="notes" rows={4} defaultValue={a.notes ?? ''} className="text-[13px] resize-none border" style={inputStyle} />
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
