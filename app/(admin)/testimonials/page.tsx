import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Plus, MessageSquareQuote, Quote } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Testimonial, Client } from '@/lib/types'

const STATUS_COLOURS: Record<string, { bg: string; text: string }> = {
  Requested: { bg: 'bg-white/[0.06]',   text: 'text-white/50' },
  Received:  { bg: 'bg-blue-500/10',    text: 'text-blue-300' },
  Approved:  { bg: 'bg-emerald-500/10', text: 'text-emerald-300' },
}

export default async function TestimonialsPage() {
  const supabase = await createClient()
  const { data: testimonials } = await supabase
    .from('testimonials')
    .select('*, clients(id, name, brand_name), projects(id, name)')
    .order('updated_at', { ascending: false })

  const rows = (testimonials ?? []) as Testimonial[]
  const approved = rows.filter(t => t.status === 'Approved')
  const others = rows.filter(t => t.status !== 'Approved')

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <MessageSquareQuote className="w-4 h-4 opacity-30" style={{ color: '#00B7FF' }} />
          <div>
            <h1 className="text-lg font-bold" style={{ fontFamily: 'var(--font-poppins)', color: '#e8eeff', letterSpacing: '-0.02em' }}>Testimonials</h1>
            <p className="text-[11px]" style={{ color: '#3d5475' }}>{rows.length} total · {approved.length} approved</p>
          </div>
        </div>
        <Link href="/testimonials/new">
          <Button className="h-8 text-xs font-medium text-white" style={{ background: '#054F99' }}>
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            Add Testimonial
          </Button>
        </Link>
      </div>

      {rows.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <MessageSquareQuote className="w-7 h-7 mb-3 opacity-20" style={{ color: '#00B7FF' }} />
          <p className="text-sm" style={{ color: '#3d5475' }}>No testimonials yet.</p>
          <p className="text-[12px] mt-1" style={{ color: '#2d4060' }}>Request and collect client feedback here.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {approved.length > 0 && (
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest mb-3" style={{ color: '#2d4060' }}>Approved</p>
              <div className="grid grid-cols-2 gap-3">
                {approved.map((t) => {
                  const client = t.clients as unknown as Pick<Client, 'id' | 'name' | 'brand_name'> | null
                  return (
                    <Link
                      key={t.id}
                      href={`/testimonials/${t.id}`}
                      className="rounded-xl border p-5 transition-all group hover:border-[#00B7FF]/20"
                      style={{ background: '#0b1120', borderColor: '#162035' }}
                    >
                      <Quote className="w-4 h-4 mb-3" style={{ color: '#00B7FF', opacity: 0.5 }} />
                      <p className="text-[13px] leading-relaxed mb-4 line-clamp-3" style={{ color: '#5a7099' }}>{t.quote}</p>
                      {client && (
                        <p className="text-[11px] font-medium" style={{ color: '#3d5475' }}>{client.brand_name || client.name}</p>
                      )}
                    </Link>
                  )
                })}
              </div>
            </div>
          )}

          {others.length > 0 && (
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest mb-3" style={{ color: '#2d4060' }}>In Progress</p>
              <div className="rounded-xl overflow-hidden border" style={{ background: '#0b1120', borderColor: '#162035' }}>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b" style={{ background: '#0d1728', borderColor: '#162035' }}>
                      <th className="text-left px-5 py-3 text-[10px] font-semibold uppercase tracking-widest" style={{ color: '#2d4060' }}>Client</th>
                      <th className="text-left px-5 py-3 text-[10px] font-semibold uppercase tracking-widest" style={{ color: '#2d4060' }}>Quote</th>
                      <th className="text-left px-5 py-3 text-[10px] font-semibold uppercase tracking-widest" style={{ color: '#2d4060' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {others.map((t, i) => {
                      const client = t.clients as unknown as Pick<Client, 'id' | 'name' | 'brand_name'> | null
                      const colours = STATUS_COLOURS[t.status] ?? { bg: 'bg-white/[0.06]', text: 'text-white/50' }
                      return (
                        <tr key={t.id} className={`border-b hover:bg-white/[0.02] ${i === others.length - 1 ? 'border-b-0' : ''}`} style={{ borderColor: '#162035' }}>
                          <td className="px-5 py-3.5 text-[13px]" style={{ color: '#3d5475' }}>
                            {client ? (client.brand_name || client.name) : '—'}
                          </td>
                          <td className="px-5 py-3.5">
                            <Link href={`/testimonials/${t.id}`} className="text-[13px] hover:text-[#00B7FF] transition-colors line-clamp-1" style={{ color: '#5a7099' }}>
                              {t.quote || <span className="italic opacity-40">No quote yet</span>}
                            </Link>
                          </td>
                          <td className="px-5 py-3.5">
                            <span className={cn('inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium', colours.bg, colours.text)}>
                              {t.status}
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
