import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { createTestimonialAction } from '@/app/actions/testimonials'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { TESTIMONIAL_STATUSES } from '@/lib/constants'
import { ChevronLeft } from 'lucide-react'
import type { Client } from '@/lib/types'

export default async function NewTestimonialPage({
  searchParams,
}: {
  searchParams: Promise<{ client_id?: string }>
}) {
  const { client_id } = await searchParams
  const supabase = await createClient()
  const { data: clients } = await supabase.from('clients').select('id, name, brand_name').order('name')

  return (
    <div className="p-8 max-w-xl">
      <Link href="/testimonials" className="inline-flex items-center gap-1.5 text-[12px] text-zinc-600 hover:text-zinc-300 transition-colors mb-6">
        <ChevronLeft className="w-3.5 h-3.5" />
        Testimonials
      </Link>
      <h1 className="text-lg font-semibold text-white tracking-tight mb-8">Add Testimonial</h1>

      <form action={createTestimonialAction} className="flex flex-col gap-5">
        <div className="rounded-xl border border-white/[0.07] bg-[#0f0f0f] p-6 flex flex-col gap-5">
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
            <Label className="text-[11px] text-zinc-500 uppercase tracking-widest">Status</Label>
            <Select name="status" defaultValue="Requested">
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
              rows={5}
              placeholder="Paste the client's testimonial here once received…"
              className="bg-zinc-900/60 border-white/[0.08] text-white placeholder:text-zinc-700 text-[13px] resize-none"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" className="bg-white text-black hover:bg-zinc-100 font-medium h-9 px-5 text-[13px] rounded-lg">
            Save Testimonial
          </Button>
        </div>
      </form>
    </div>
  )
}
