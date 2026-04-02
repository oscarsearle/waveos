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
      <Link href="/testimonials" className="inline-flex items-center gap-1.5 text-[12px] text-gray-400 hover:text-gray-700 transition-colors mb-6">
        <ChevronLeft className="w-3.5 h-3.5" />
        Testimonials
      </Link>

      <div className="mb-8">
        <h1 className="text-lg font-semibold text-gray-900 tracking-tight mb-1">
          {client ? (client.brand_name || client.name) : 'Testimonial'}
        </h1>
        {client && (
          <Link href={`/clients/${client.id}`} className="text-[13px] text-gray-400 hover:text-gray-700 transition-colors">
            View client
          </Link>
        )}
      </div>

      {t.quote && t.status === 'Approved' && (
        <div className="rounded-xl border border-gray-200 bg-white p-6 mb-6">
          <Quote className="w-5 h-5 mb-4" style={{ color: '#00B7FF' }} />
          <p className="text-[15px] text-gray-700 leading-relaxed font-light italic">{t.quote}</p>
          {client && (
            <p className="text-[12px] text-gray-400 mt-4">— {client.brand_name || client.name}</p>
          )}
        </div>
      )}

      <form action={updateAction} className="flex flex-col gap-5">
        <div className="rounded-xl border border-gray-200 bg-white p-6 flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <Label className="text-[11px] text-gray-400 uppercase tracking-widest font-semibold">Status</Label>
            <Select name="status" defaultValue={t.status}>
              <SelectTrigger className="bg-gray-50 border-gray-200 text-gray-900 h-9 text-[13px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-200">
                {TESTIMONIAL_STATUSES.map((s) => (
                  <SelectItem key={s} value={s} className="text-gray-700 text-[13px] focus:bg-gray-50 focus:text-gray-900">{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-[11px] text-gray-400 uppercase tracking-widest font-semibold">Quote</Label>
            <Textarea
              name="quote"
              rows={6}
              defaultValue={t.quote ?? ''}
              placeholder="Client's testimonial text…"
              className="bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-300 text-[13px] resize-none"
            />
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
