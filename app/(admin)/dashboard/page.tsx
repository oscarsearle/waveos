import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { StatusBadge } from '@/components/clients/StatusBadge'
import { ACTIVE_STAGES, PIPELINE_STAGES } from '@/lib/constants'
import { Users, FileText, Camera, TrendingUp, ChevronRight, ArrowUpRight } from 'lucide-react'
import type { Client, Project, Proposal } from '@/lib/types'

export default async function DashboardPage() {
  const supabase = await createClient()

  const today = new Date()
  const in14Days = new Date(today)
  in14Days.setDate(today.getDate() + 14)

  const [
    { data: clients },
    { data: projects },
    { data: proposals },
  ] = await Promise.all([
    supabase.from('clients').select('*').order('updated_at', { ascending: false }),
    supabase.from('projects').select('*, clients(name, brand_name)').order('updated_at', { ascending: false }),
    supabase.from('proposals').select('*, clients(name, brand_name)').order('updated_at', { ascending: false }),
  ])

  let invoices: { amount: number; status: string }[] = []
  try {
    const { data } = await supabase.from('invoices').select('amount, status')
    invoices = (data ?? []) as { amount: number; status: string }[]
  } catch { /* table may not exist yet */ }

  const allClients = (clients ?? []) as Client[]
  const allProjects = (projects ?? []) as Project[]
  const allProposals = (proposals ?? []) as Proposal[]

  const activeClients = allClients.filter((c) =>
    ACTIVE_STAGES.includes(c.status as typeof ACTIVE_STAGES[number])
  )
  const sentProposals = allProposals.filter((p) => p.status === 'Sent')
  const upcomingShoots = allProjects.filter((p) => {
    if (!p.shoot_date) return false
    const d = new Date(p.shoot_date)
    return d >= today && d <= in14Days
  })
  const unpaidTotal = invoices
    .filter((i) => i.status === 'Unpaid' || i.status === 'Partially Paid')
    .reduce((sum, i) => sum + (i.amount ?? 0), 0)

  const pipelineCounts = PIPELINE_STAGES.map((stage) => ({
    stage,
    count: allClients.filter((c) => c.status === stage).length,
  })).filter((s) => s.count > 0)

  const greeting = () => {
    const h = today.getHours()
    if (h < 12) return 'Good morning'
    if (h < 17) return 'Good afternoon'
    return 'Good evening'
  }

  return (
    <div className="p-8 max-w-5xl">
      {/* Header */}
      <div className="mb-10">
        <p className="text-xs font-semibold text-[#5A5A5A] uppercase tracking-widest mb-2">
          {today.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}
        </p>
        <h1 className="text-3xl font-bold" style={{ fontFamily: 'var(--font-poppins)', color: '#054F99', letterSpacing: '-0.03em' }}>
          {greeting()}, Oscar.
        </h1>
        <p className="text-sm text-[#5A5A5A] mt-1.5">Here's what's happening across the business.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-3 mb-8">
        {[
          { label: 'Active Clients', value: activeClients.length, icon: Users, href: '/clients' },
          { label: 'Proposals Out', value: sentProposals.length, icon: FileText, href: '/proposals' },
          { label: 'Upcoming Shoots', value: upcomingShoots.length, icon: Camera, href: '/projects' },
          { label: 'Unpaid Revenue', value: unpaidTotal > 0 ? `£${unpaidTotal.toLocaleString()}` : '—', icon: TrendingUp, href: '/invoices' },
        ].map(({ label, value, icon: Icon, href }) => (
          <Link key={label} href={href} className="group">
            <div className="bg-white rounded p-5 hover:shadow-sm transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <p className="text-[10px] font-semibold text-[#5A5A5A] uppercase tracking-widest">{label}</p>
                <Icon className="w-3.5 h-3.5 text-[#5A5A5A] opacity-40 group-hover:opacity-70 transition-opacity" />
              </div>
              <p className="text-2xl font-bold tabular-nums" style={{ fontFamily: 'var(--font-poppins)', color: '#054F99', letterSpacing: '-0.02em' }}>{value}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Pipeline */}
        <div className="col-span-1 bg-white rounded p-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-[#5A5A5A]">Pipeline</h2>
            <Link href="/clients" className="text-[11px] text-[#5A5A5A] hover:text-[#054F99] transition-colors flex items-center gap-1">
              View all <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
          {pipelineCounts.length === 0 ? (
            <p className="text-sm text-[#5A5A5A]">No clients yet.</p>
          ) : (
            <div className="flex flex-col gap-2.5">
              {pipelineCounts.map(({ stage, count }) => (
                <div key={stage} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#054F99] opacity-50 shrink-0" />
                    <span className="text-[13px] text-[#5A5A5A]">{stage}</span>
                  </div>
                  <span className="text-[13px] font-semibold text-[#1E1E1E] tabular-nums">{count}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="col-span-2 flex flex-col gap-4">
          {/* Upcoming shoots */}
          <div className="bg-white rounded p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[10px] font-bold uppercase tracking-widest text-[#5A5A5A]">Upcoming Shoots</h2>
              <span className="text-[11px] text-[#5A5A5A]">Next 14 days</span>
            </div>
            {upcomingShoots.length === 0 ? (
              <p className="text-[13px] text-[#5A5A5A]">No shoots scheduled.</p>
            ) : (
              <div className="flex flex-col gap-2">
                {upcomingShoots.map((p) => (
                  <Link key={p.id} href={`/projects/${p.id}`} className="flex items-center justify-between group py-1.5 border-b border-[#E7ECE7] last:border-0">
                    <div>
                      <p className="text-[13px] font-medium text-[#1E1E1E] group-hover:text-[#054F99] transition-colors">{p.name}</p>
                      <p className="text-[11px] text-[#5A5A5A]">
                        {(p.client as unknown as Client)?.brand_name || (p.client as unknown as Client)?.name}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[12px] text-[#5A5A5A]">
                        {new Date(p.shoot_date!).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                      </span>
                      <ArrowUpRight className="w-3 h-3 text-[#5A5A5A] opacity-40 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Next actions */}
          <div className="bg-white rounded p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[10px] font-bold uppercase tracking-widest text-[#5A5A5A]">Next Actions</h2>
            </div>
            {allClients.filter(c => c.next_action).length === 0 ? (
              <p className="text-[13px] text-[#5A5A5A]">No next actions set.</p>
            ) : (
              <div className="flex flex-col gap-2">
                {allClients.filter(c => c.next_action).slice(0, 4).map((c) => (
                  <Link key={c.id} href={`/clients/${c.id}`} className="flex items-center justify-between group py-1.5 border-b border-[#E7ECE7] last:border-0">
                    <div className="min-w-0 mr-4">
                      <p className="text-[11px] text-[#5A5A5A] mb-0.5">{c.brand_name || c.name}</p>
                      <p className="text-[13px] text-[#1E1E1E] group-hover:text-[#054F99] transition-colors truncate">{c.next_action}</p>
                    </div>
                    <StatusBadge status={c.status} />
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent clients */}
        <div className="col-span-3 bg-white rounded p-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-[#5A5A5A]">Recent Clients</h2>
            <Link href="/clients" className="text-[11px] text-[#5A5A5A] hover:text-[#054F99] transition-colors flex items-center gap-1">
              All clients <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          {allClients.slice(0, 6).length === 0 ? (
            <p className="text-[13px] text-[#5A5A5A]">No clients yet.</p>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {allClients.slice(0, 6).map((c) => (
                <Link
                  key={c.id}
                  href={`/clients/${c.id}`}
                  className="flex items-center justify-between rounded bg-[#E7ECE7] px-4 py-3 hover:bg-[#d8dfd8] transition-colors group"
                >
                  <div className="min-w-0">
                    <p className="text-[13px] font-medium text-[#1E1E1E] group-hover:text-[#054F99] transition-colors truncate">
                      {c.brand_name || c.name}
                    </p>
                    {c.project_value && (
                      <p className="text-[11px] text-[#5A5A5A] mt-0.5">£{c.project_value.toLocaleString()}</p>
                    )}
                  </div>
                  <StatusBadge status={c.status} />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
