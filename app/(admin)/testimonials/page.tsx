import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Plus, MessageSquareQuote, Quote } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Testimonial, Client } from '@/lib/types'

const STATUS_COLOURS: Record<string, { bg: string; text: string }> = {
  Requested: { bg: 'bg-zinc-800', text: 'text-zinc-300' },
  Received: { bg: 'bg-blue-950', text: 'text-blue-300' },
  Approved: { bg: 'bg-emerald-950', text: 'text-emerald-300' },
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
          <MessageSquareQuote className="w-4 h-4 text-zinc-500" />
          <div>
            <h1 className="text-lg font-semibold text-white tracking-tight">Testimonials</h1>
            <p className="text-[11px] text-zinc-600">{rows.length} total · {approved.length} approved</p>
          </div>
        </div>
        <Link href="/testimonials/new">
          <Button className="bg-white text-black hover:bg-zinc-100 h-8 text-xs font-medium rounded-lg">
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            Add Testimonial
          </Button>
        </Link>
      </div>

      {rows.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <MessageSquareQuote className="w-7 h-7 text-zinc-800 mb-3" />
          <p className="text-sm text-zinc-500">No testimonials yet.</p>
          <p className="text-[12px] text-zinc-700 mt-1">Request and collect client feedback here.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {/* Approved testimonials — card view */}
          {approved.length > 0 && (
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-600 mb-3">Approved</p>
              <div className="grid grid-cols-2 gap-3">
                {approved.map((t) => {
                  const client = t.clients as unknown as Pick<Client, 'id' | 'name' | 'brand_name'> | null
                  return (
                    <Link
                      key={t.id}
                      href={`/testimonials/${t.id}`}
                      className="rounded-xl border border-white/[0.07] bg-[#0f0f0f] p-5 hover:border-white/[0.12] transition-colors group"
                    >
                      <Quote className="w-4 h-4 text-brand mb-3" />
                      <p className="text-[13px] text-zinc-200 leading-relaxed mb-4 line-clamp-3">{t.quote}</p>
                      {client && (
                        <p className="text-[11px] text-zinc-600">{client.brand_name || client.name}</p>
                      )}
                    </Link>
                  )
                })}
              </div>
            </div>
          )}

          {/* Other statuses — list view */}
          {others.length > 0 && (
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-600 mb-3">In Progress</p>
              <div className="rounded-xl border border-white/[0.07] overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/[0.07] bg-white/[0.02]">
                      <th className="text-left px-5 py-3 text-[10px] font-semibold text-zinc-600 uppercase tracking-widest">Client</th>
                      <th className="text-left px-5 py-3 text-[10px] font-semibold text-zinc-600 uppercase tracking-widest">Quote</th>
                      <th className="text-left px-5 py-3 text-[10px] font-semibold text-zinc-600 uppercase tracking-widest">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {others.map((t, i) => {
                      const client = t.clients as unknown as Pick<Client, 'id' | 'name' | 'brand_name'> | null
                      const colours = STATUS_COLOURS[t.status] ?? { bg: 'bg-zinc-800', text: 'text-zinc-300' }
                      return (
                        <tr key={t.id} className={`border-b border-white/[0.04] hover:bg-white/[0.02] ${i === others.length - 1 ? 'border-b-0' : ''}`}>
                          <td className="px-5 py-3.5 text-[13px] text-zinc-400">
                            {client ? (client.brand_name || client.name) : '—'}
                          </td>
                          <td className="px-5 py-3.5">
                            <Link href={`/testimonials/${t.id}`} className="text-[13px] text-zinc-300 hover:text-white transition-colors line-clamp-1">
                              {t.quote || <span className="text-zinc-600 italic">No quote yet</span>}
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
