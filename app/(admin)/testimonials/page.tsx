import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Plus, MessageSquareQuote, Quote } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Testimonial, Client } from '@/lib/types'

const STATUS_COLOURS: Record<string, { bg: string; text: string }> = {
  Requested: { bg: 'bg-gray-100', text: 'text-gray-600' },
  Received: { bg: 'bg-blue-50', text: 'text-blue-700' },
  Approved: { bg: 'bg-emerald-50', text: 'text-emerald-700' },
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
          <MessageSquareQuote className="w-4 h-4 text-gray-400" />
          <div>
            <h1 className="text-lg font-semibold text-gray-900 tracking-tight">Testimonials</h1>
            <p className="text-[11px] text-gray-400">{rows.length} total · {approved.length} approved</p>
          </div>
        </div>
        <Link href="/testimonials/new">
          <Button className="h-8 text-xs font-medium text-white rounded-lg" style={{ background: '#054F99' }}>
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            Add Testimonial
          </Button>
        </Link>
      </div>

      {rows.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <MessageSquareQuote className="w-7 h-7 text-gray-300 mb-3" />
          <p className="text-sm text-gray-500">No testimonials yet.</p>
          <p className="text-[12px] text-gray-400 mt-1">Request and collect client feedback here.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {approved.length > 0 && (
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-3">Approved</p>
              <div className="grid grid-cols-2 gap-3">
                {approved.map((t) => {
                  const client = t.clients as unknown as Pick<Client, 'id' | 'name' | 'brand_name'> | null
                  return (
                    <Link
                      key={t.id}
                      href={`/testimonials/${t.id}`}
                      className="rounded-xl border border-gray-200 bg-white p-5 hover:border-gray-300 hover:shadow-sm transition-all group"
                    >
                      <Quote className="w-4 h-4 mb-3" style={{ color: '#00B7FF' }} />
                      <p className="text-[13px] text-gray-700 leading-relaxed mb-4 line-clamp-3">{t.quote}</p>
                      {client && (
                        <p className="text-[11px] text-gray-400 font-medium">{client.brand_name || client.name}</p>
                      )}
                    </Link>
                  )
                })}
              </div>
            </div>
          )}

          {others.length > 0 && (
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-3">In Progress</p>
              <div className="rounded-xl border border-gray-200 overflow-hidden bg-white">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50">
                      <th className="text-left px-5 py-3 text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Client</th>
                      <th className="text-left px-5 py-3 text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Quote</th>
                      <th className="text-left px-5 py-3 text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {others.map((t, i) => {
                      const client = t.clients as unknown as Pick<Client, 'id' | 'name' | 'brand_name'> | null
                      const colours = STATUS_COLOURS[t.status] ?? { bg: 'bg-gray-100', text: 'text-gray-600' }
                      return (
                        <tr key={t.id} className={`border-b border-gray-50 hover:bg-gray-50 ${i === others.length - 1 ? 'border-b-0' : ''}`}>
                          <td className="px-5 py-3.5 text-[13px] text-gray-500">
                            {client ? (client.brand_name || client.name) : '—'}
                          </td>
                          <td className="px-5 py-3.5">
                            <Link href={`/testimonials/${t.id}`} className="text-[13px] text-gray-700 hover:text-gray-900 transition-colors line-clamp-1">
                              {t.quote || <span className="text-gray-400 italic">No quote yet</span>}
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
