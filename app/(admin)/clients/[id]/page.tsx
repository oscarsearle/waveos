import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { StatusBadge } from '@/components/clients/StatusBadge'
import { ProposalStatusBadge } from '@/components/proposals/ProposalStatusBadge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ClientPortalTab } from '@/components/clients/ClientPortalTab'
import { ClientLinksTab } from '@/components/clients/ClientLinksTab'
import {
  ChevronLeft,
  Pencil,
  Mail,
  Phone,
  AtSign,
  ExternalLink,
  Plus,
} from 'lucide-react'
import type { Client, Project, Proposal } from '@/lib/types'

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const [{ data: client }, { data: projects }, { data: proposals }, { data: updates }] =
    await Promise.all([
      supabase.from('clients').select('*').eq('id', id).single(),
      supabase.from('projects').select('*').eq('client_id', id).order('created_at', { ascending: false }),
      supabase.from('proposals').select('*').eq('client_id', id).order('created_at', { ascending: false }),
      supabase.from('portal_updates').select('*').eq('client_id', id).order('created_at', { ascending: false }),
    ])

  const { data: links } = await supabase
    .from('links')
    .select('*')
    .eq('client_id', id)
    .order('created_at', { ascending: false })

  if (!client) notFound()

  const c = client as Client
  const displayName = c.brand_name || c.name

  return (
    <div className="p-8">
      <Link
        href="/clients"
        className="inline-flex items-center gap-1.5 text-xs transition-colors mb-6 hover:text-[#00B7FF]"
        style={{ color: '#3d5475' }}
      >
        <ChevronLeft className="w-3.5 h-3.5" />
        Clients
      </Link>

      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-xl font-bold" style={{ fontFamily: 'var(--font-poppins)', color: '#e8eeff', letterSpacing: '-0.02em' }}>{displayName}</h1>
            <StatusBadge status={c.status} />
          </div>
          {c.brand_name && (
            <p className="text-sm" style={{ color: '#3d5475' }}>{c.name}</p>
          )}
          {c.project_value && (
            <p className="text-sm mt-0.5" style={{ color: '#3d5475' }}>
              £{c.project_value.toLocaleString()}
            </p>
          )}
        </div>
        <Link href={`/clients/${id}/edit`}>
          <Button variant="outline" className="h-8 text-xs border-white/[0.08] text-white/40 hover:text-white hover:bg-white/[0.05]">
            <Pencil className="w-3.5 h-3.5 mr-1.5" />
            Edit
          </Button>
        </Link>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-6 h-9 border" style={{ background: '#0d1728', borderColor: '#162035' }}>
          <TabsTrigger value="overview" className="text-xs data-[state=active]:bg-white/[0.06] data-[state=active]:text-white text-white/40">Overview</TabsTrigger>
          <TabsTrigger value="projects" className="text-xs data-[state=active]:bg-white/[0.06] data-[state=active]:text-white text-white/40">
            Projects {projects && projects.length > 0 ? `(${projects.length})` : ''}
          </TabsTrigger>
          <TabsTrigger value="proposals" className="text-xs data-[state=active]:bg-white/[0.06] data-[state=active]:text-white text-white/40">
            Proposals {proposals && proposals.length > 0 ? `(${proposals.length})` : ''}
          </TabsTrigger>
          <TabsTrigger value="links" className="text-xs data-[state=active]:bg-white/[0.06] data-[state=active]:text-white text-white/40">Links</TabsTrigger>
          <TabsTrigger value="portal" className="text-xs data-[state=active]:bg-white/[0.06] data-[state=active]:text-white text-white/40">Portal</TabsTrigger>
        </TabsList>

        {/* Overview */}
        <TabsContent value="overview" className="mt-0">
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl border p-5" style={{ background: '#0b1120', borderColor: '#162035' }}>
              <h3 className="text-[10px] font-semibold uppercase tracking-widest mb-4" style={{ color: '#3d5475' }}>Contact</h3>
              <div className="flex flex-col gap-3">
                {c.email && (
                  <a href={`mailto:${c.email}`} className="flex items-center gap-2.5 text-sm hover:text-[#00B7FF] transition-colors" style={{ color: '#5a7099' }}>
                    <Mail className="w-4 h-4 shrink-0 opacity-40" />
                    {c.email}
                  </a>
                )}
                {c.phone && (
                  <a href={`tel:${c.phone}`} className="flex items-center gap-2.5 text-sm hover:text-[#00B7FF] transition-colors" style={{ color: '#5a7099' }}>
                    <Phone className="w-4 h-4 shrink-0 opacity-40" />
                    {c.phone}
                  </a>
                )}
                {c.instagram && (
                  <a href={`https://instagram.com/${c.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 text-sm hover:text-[#00B7FF] transition-colors" style={{ color: '#5a7099' }}>
                    <AtSign className="w-4 h-4 shrink-0 opacity-40" />
                    {c.instagram}
                  </a>
                )}
                {!c.email && !c.phone && !c.instagram && (
                  <p className="text-sm" style={{ color: '#2d4060' }}>No contact info added.</p>
                )}
              </div>
            </div>

            <div className="rounded-xl border p-5" style={{ background: '#0b1120', borderColor: '#162035' }}>
              <h3 className="text-[10px] font-semibold uppercase tracking-widest mb-4" style={{ color: '#3d5475' }}>Next Action</h3>
              {c.next_action ? (
                <p className="text-sm" style={{ color: '#e8eeff' }}>{c.next_action}</p>
              ) : (
                <p className="text-sm" style={{ color: '#2d4060' }}>No next action set.</p>
              )}
            </div>

            {c.notes && (
              <div className="col-span-2 rounded-xl border p-5" style={{ background: '#0b1120', borderColor: '#162035' }}>
                <h3 className="text-[10px] font-semibold uppercase tracking-widest mb-4" style={{ color: '#3d5475' }}>Notes</h3>
                <p className="text-sm whitespace-pre-wrap" style={{ color: '#5a7099' }}>{c.notes}</p>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Projects */}
        <TabsContent value="projects" className="mt-0">
          <div className="flex justify-between items-center mb-4">
            <p className="text-xs" style={{ color: '#3d5475' }}>{(projects ?? []).length} project(s)</p>
            <Link href={`/projects/new?client_id=${id}`}>
              <Button variant="outline" className="h-8 text-xs border-white/[0.08] text-white/40 hover:text-white hover:bg-white/[0.05]">
                <Plus className="w-3.5 h-3.5 mr-1.5" />
                New Project
              </Button>
            </Link>
          </div>
          {(projects ?? []).length === 0 ? (
            <p className="text-sm py-6" style={{ color: '#2d4060' }}>No projects yet.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {(projects as Project[]).map((p) => (
                <Link
                  key={p.id}
                  href={`/projects/${p.id}`}
                  className="flex items-center justify-between rounded-lg border px-4 py-3 transition-all hover:border-[#00B7FF]/20"
                  style={{ background: '#0d1728', borderColor: '#162035' }}
                >
                  <div>
                    <p className="text-sm font-medium" style={{ color: '#e8eeff' }}>{p.name}</p>
                    {p.shoot_date && (
                      <p className="text-xs mt-0.5" style={{ color: '#3d5475' }}>Shoot: {new Date(p.shoot_date).toLocaleDateString('en-GB')}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={p.stage} />
                    <ExternalLink className="w-3.5 h-3.5 opacity-20" style={{ color: '#00B7FF' }} />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Proposals */}
        <TabsContent value="proposals" className="mt-0">
          <div className="flex justify-between items-center mb-4">
            <p className="text-xs" style={{ color: '#3d5475' }}>{(proposals ?? []).length} proposal(s)</p>
            <Link href={`/proposals/new?client_id=${id}`}>
              <Button variant="outline" className="h-8 text-xs border-white/[0.08] text-white/40 hover:text-white hover:bg-white/[0.05]">
                <Plus className="w-3.5 h-3.5 mr-1.5" />
                New Proposal
              </Button>
            </Link>
          </div>
          {(proposals ?? []).length === 0 ? (
            <p className="text-sm py-6" style={{ color: '#2d4060' }}>No proposals yet.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {(proposals as Proposal[]).map((p) => (
                <Link
                  key={p.id}
                  href={`/proposals/${p.id}`}
                  className="flex items-center justify-between rounded-lg border px-4 py-3 transition-all hover:border-[#00B7FF]/20"
                  style={{ background: '#0d1728', borderColor: '#162035' }}
                >
                  <div>
                    <p className="text-sm font-medium" style={{ color: '#e8eeff' }}>{p.title}</p>
                    {p.price && (
                      <p className="text-xs mt-0.5" style={{ color: '#3d5475' }}>£{p.price.toLocaleString()}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <ProposalStatusBadge status={p.status} />
                    <ExternalLink className="w-3.5 h-3.5 opacity-20" style={{ color: '#00B7FF' }} />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Links */}
        <TabsContent value="links" className="mt-0">
          <ClientLinksTab clientId={id} links={links ?? []} />
        </TabsContent>

        {/* Portal */}
        <TabsContent value="portal" className="mt-0">
          <ClientPortalTab client={c} updates={updates ?? []} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
