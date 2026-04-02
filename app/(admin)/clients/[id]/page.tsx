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
        className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-700 transition-colors mb-6"
      >
        <ChevronLeft className="w-3.5 h-3.5" />
        Clients
      </Link>

      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-xl font-semibold text-gray-900">{displayName}</h1>
            <StatusBadge status={c.status} />
          </div>
          {c.brand_name && (
            <p className="text-sm text-gray-400">{c.name}</p>
          )}
          {c.project_value && (
            <p className="text-sm text-gray-500 mt-0.5">
              £{c.project_value.toLocaleString()}
            </p>
          )}
        </div>
        <Link href={`/clients/${id}/edit`}>
          <Button variant="outline" className="h-8 text-xs border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50">
            <Pencil className="w-3.5 h-3.5 mr-1.5" />
            Edit
          </Button>
        </Link>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="bg-gray-100 border border-gray-200 mb-6 h-9">
          <TabsTrigger value="overview" className="text-xs data-[state=active]:bg-white data-[state=active]:text-gray-900 text-gray-500">Overview</TabsTrigger>
          <TabsTrigger value="projects" className="text-xs data-[state=active]:bg-white data-[state=active]:text-gray-900 text-gray-500">
            Projects {projects && projects.length > 0 ? `(${projects.length})` : ''}
          </TabsTrigger>
          <TabsTrigger value="proposals" className="text-xs data-[state=active]:bg-white data-[state=active]:text-gray-900 text-gray-500">
            Proposals {proposals && proposals.length > 0 ? `(${proposals.length})` : ''}
          </TabsTrigger>
          <TabsTrigger value="links" className="text-xs data-[state=active]:bg-white data-[state=active]:text-gray-900 text-gray-500">Links</TabsTrigger>
          <TabsTrigger value="portal" className="text-xs data-[state=active]:bg-white data-[state=active]:text-gray-900 text-gray-500">Portal</TabsTrigger>
        </TabsList>

        {/* Overview */}
        <TabsContent value="overview" className="mt-0">
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">Contact</h3>
              <div className="flex flex-col gap-3">
                {c.email && (
                  <a href={`mailto:${c.email}`} className="flex items-center gap-2.5 text-sm text-gray-600 hover:text-gray-900 transition-colors">
                    <Mail className="w-4 h-4 text-gray-400 shrink-0" />
                    {c.email}
                  </a>
                )}
                {c.phone && (
                  <a href={`tel:${c.phone}`} className="flex items-center gap-2.5 text-sm text-gray-600 hover:text-gray-900 transition-colors">
                    <Phone className="w-4 h-4 text-gray-400 shrink-0" />
                    {c.phone}
                  </a>
                )}
                {c.instagram && (
                  <a href={`https://instagram.com/${c.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 text-sm text-gray-600 hover:text-gray-900 transition-colors">
                    <AtSign className="w-4 h-4 text-gray-400 shrink-0" />
                    {c.instagram}
                  </a>
                )}
                {!c.email && !c.phone && !c.instagram && (
                  <p className="text-sm text-gray-400">No contact info added.</p>
                )}
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">Next Action</h3>
              {c.next_action ? (
                <p className="text-sm text-gray-700">{c.next_action}</p>
              ) : (
                <p className="text-sm text-gray-400">No next action set.</p>
              )}
            </div>

            {c.notes && (
              <div className="col-span-2 rounded-xl border border-gray-200 bg-white p-5">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">Notes</h3>
                <p className="text-sm text-gray-600 whitespace-pre-wrap">{c.notes}</p>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Projects */}
        <TabsContent value="projects" className="mt-0">
          <div className="flex justify-between items-center mb-4">
            <p className="text-xs text-gray-400">{(projects ?? []).length} project(s)</p>
            <Link href={`/projects/new?client_id=${id}`}>
              <Button variant="outline" className="h-8 text-xs border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50">
                <Plus className="w-3.5 h-3.5 mr-1.5" />
                New Project
              </Button>
            </Link>
          </div>
          {(projects ?? []).length === 0 ? (
            <p className="text-sm text-gray-400 py-6">No projects yet.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {(projects as Project[]).map((p) => (
                <Link
                  key={p.id}
                  href={`/projects/${p.id}`}
                  className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3 hover:bg-gray-50 transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">{p.name}</p>
                    {p.shoot_date && (
                      <p className="text-xs text-gray-400 mt-0.5">Shoot: {new Date(p.shoot_date).toLocaleDateString('en-GB')}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={p.stage} />
                    <ExternalLink className="w-3.5 h-3.5 text-gray-300" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Proposals */}
        <TabsContent value="proposals" className="mt-0">
          <div className="flex justify-between items-center mb-4">
            <p className="text-xs text-gray-400">{(proposals ?? []).length} proposal(s)</p>
            <Link href={`/proposals/new?client_id=${id}`}>
              <Button variant="outline" className="h-8 text-xs border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50">
                <Plus className="w-3.5 h-3.5 mr-1.5" />
                New Proposal
              </Button>
            </Link>
          </div>
          {(proposals ?? []).length === 0 ? (
            <p className="text-sm text-gray-400 py-6">No proposals yet.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {(proposals as Proposal[]).map((p) => (
                <Link
                  key={p.id}
                  href={`/proposals/${p.id}`}
                  className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3 hover:bg-gray-50 transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">{p.title}</p>
                    {p.price && (
                      <p className="text-xs text-gray-400 mt-0.5">£{p.price.toLocaleString()}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <ProposalStatusBadge status={p.status} />
                    <ExternalLink className="w-3.5 h-3.5 text-gray-300" />
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
