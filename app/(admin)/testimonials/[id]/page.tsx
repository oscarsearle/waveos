import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { updateTestimonialAction } from '@/app/actions/testimonials'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { TESTIMONIAL_STATUSES } from '@/lib/constants'
import { ChevronLeft, Quote } from 'lucide-react'
import type { Testimonial, Client } from '@/lib/types'

export default async function TestimonialDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: testimonial } = await supabase
    .from('testimonials')
    .select('*, clients(id, name, brand_name), projects(id, name)')
    .eq('id', id)
    .single()

  if (!testimonial) notFound()

  const t = testimonial as Testimonial
  const client = t.clients as unknown as Pick<Client, 'id' | 'name' | 'brand_name'> | null

  async function updateAction(formData: FormData) {
    'use server'
    await updateTestimonialAction(id, formData)
  }

  return (
    <div className="p-8 max-w-xl">
      <Link href="/testimonials" className="inline-flex items-center gap-1.5 text-[12px] text-zinc-600 hover:text-zinc-300 transition-colors mb-6">
        <ChevronLeft className="w-3.5 h-3.5" />
        Testimonials
      </Link>

      <div className="mb-8">
        <h1 className="text-lg font-semibold text-white tracking-tight mb-1">
          {client ? (client.brand_name || client.name) : 'Testimonial'}
        </h1>
        {client && (
          <Link href={`/clients/${client.id}`} className="text-[13px] text-zinc-500 hover:text-zinc-300 transition-colors">
            View client
          </Link>
        )}
      </div>

      {t.quote && t.status === 'Approved' && (
        <div className="rounded-xl border border-white/[0.07] bg-[#0f0f0f] p-6 mb-6">
          <Quote className="w-5 h-5 text-brand mb-4" />
          <p className="text-[15px] text-zinc-100 leading-relaxed font-light italic">{t.quote}</p>
          {client && (
            <p className="text-[12px] text-zinc-600 mt-4">— {client.brand_name || client.name}</p>
          )}
        </div>
      )}

      <form action={updateAction} className="flex flex-col gap-5">
        <div className="rounded-xl border border-white/[0.07] bg-[#0f0f0f] p-6 flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <Label className="text-[11px] text-zinc-500 uppercase tracking-widest">Status</Label>
            <Select name="status" defaultValue={t.status}>
              <SelectTrigger className="bg-zinc-900/60 border-white/[0.08] text-white h-9 text-[13px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-white/10">
                {TESTIMONIAL_STATUSES.map((s) => (
                  <SelectItem key={s} value={s} className="text-zinc-200 text-[13px] focus:bg-white/10 focus:text-white">{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-[11px] text-zinc-500 uppercase tracking-widest">Quote</Label>
            <Textarea
              name="quote"
              rows={6}
              defaultValue={t.quote ?? ''}
              placeholder="Client's testimonial text…"
              className="bg-zinc-900/60 border-white/[0.08] text-white placeholder:text-zinc-700 text-[13px] resize-none"
            />
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
