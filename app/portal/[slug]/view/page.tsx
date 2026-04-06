import { checkPortalAuth, getPortalData } from '@/app/actions/portal'
import { redirect, notFound } from 'next/navigation'
import { Waves, ExternalLink, FileText } from 'lucide-react'
import { PIPELINE_STAGES, STAGE_COLOURS } from '@/lib/constants'
import { cn } from '@/lib/utils'
import Link from 'next/link'

export default async function PortalViewPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  // Auth gate — redirect to password page if not authenticated
  const isAuthenticated = await checkPortalAuth(slug)
  if (!isAuthenticated) {
    redirect(`/portal/${slug}`)
  }

  const data = await getPortalData(slug)
  if (!data) notFound()

  const { client, projects, links, updates, proposals } = data
  const displayName = client.brand_name || client.name

  // Pipeline progress
  const currentStageIndex = PIPELINE_STAGES.indexOf(client.status as typeof PIPELINE_STAGES[number])

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Header */}
      <header className="border-b border-white/[0.06] px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center gap-2.5">
          <div className="flex items-center justify-center w-7 h-7 rounded-md bg-white/[0.07]">
            <Waves className="w-4 h-4 text-white" />
          </div>
          <span className="text-xs text-zinc-500">Creative Wave Media</span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-10">
        {/* Page title */}
        <div className="mb-10">
          <h1 className="text-2xl font-semibold text-white mb-1">{displayName}</h1>
          <p className="text-sm text-zinc-500">Your project portal</p>
        </div>

        {/* Current stage */}
        {client.status && (
          <section className="rounded-xl border border-white/[0.07] bg-zinc-900/40 p-6 mb-5">
            <h2 className="text-xs font-medium text-zinc-500 uppercase tracking-wide mb-5">Project Status</h2>
            <div className="flex items-center gap-2.5">
              {(() => {
                const colours = STAGE_COLOURS[client.status] ?? { bg: 'bg-zinc-800', text: 'text-zinc-300' }
                return (
                  <span className={cn('inline-flex items-center px-3 py-1 rounded-full text-sm font-medium', colours.bg, colours.text)}>
                    {client.status}
                  </span>
                )
              })()}
            </div>
          </section>
        )}

        {/* Proposals */}
        {proposals.length > 0 && (
          <section className="rounded-xl border border-white/[0.07] bg-zinc-900/40 p-6 mb-5">
            <h2 className="text-xs font-medium text-zinc-500 uppercase tracking-wide mb-5">
              {proposals.length === 1 ? 'Proposal' : 'Proposals'}
            </h2>
            <div className="flex flex-col gap-3">
              {proposals.map((proposal) => (
                <Link
                  key={proposal.id}
                  href={`/portal/${slug}/proposal/${proposal.id}`}
                  className="flex items-center justify-between rounded-lg border border-white/[0.05] bg-zinc-900/60 px-4 py-4 hover:bg-white/[0.04] transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                      <FileText className="w-4 h-4 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-zinc-200">{proposal.title}</p>
                      {proposal.price && (
                        <p className="text-xs text-zinc-500 mt-0.5">${Number(proposal.price).toLocaleString()}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400">
                      View Proposal
                    </span>
                    <ExternalLink className="w-3.5 h-3.5 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <section className="rounded-xl border border-white/[0.07] bg-zinc-900/40 p-6 mb-5">
            <h2 className="text-xs font-medium text-zinc-500 uppercase tracking-wide mb-5">
              {projects.length === 1 ? 'Project' : 'Projects'}
            </h2>
            <div className="flex flex-col gap-5">
              {projects.map((project) => (
                <div key={project.id}>
                  <h3 className="text-sm font-medium text-white mb-3">{project.name}</h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    {project.shoot_date && (
                      <div>
                        <p className="text-xs text-zinc-500 mb-0.5">Shoot Date</p>
                        <p className="text-zinc-200">
                          {new Date(project.shoot_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                      </div>
                    )}
                    {project.deadline && (
                      <div>
                        <p className="text-xs text-zinc-500 mb-0.5">Delivery Deadline</p>
                        <p className="text-zinc-200">
                          {new Date(project.deadline).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                      </div>
                    )}
                  </div>
                  {project.deliverables && (
                    <div className="mt-4">
                      <p className="text-xs text-zinc-500 mb-1.5">Deliverables</p>
                      <p className="text-sm text-zinc-300 whitespace-pre-wrap">{project.deliverables}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Links */}
        {links.length > 0 && (
          <section className="rounded-xl border border-white/[0.07] bg-zinc-900/40 p-6 mb-5">
            <h2 className="text-xs font-medium text-zinc-500 uppercase tracking-wide mb-5">Files & Links</h2>
            <div className="flex flex-col gap-2">
              {links.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between rounded-lg border border-white/[0.05] bg-zinc-900/60 px-4 py-3 hover:bg-white/[0.04] transition-colors"
                >
                  <span className="text-sm text-zinc-200">{link.label}</span>
                  <ExternalLink className="w-3.5 h-3.5 text-zinc-500" />
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Status updates */}
        {updates.length > 0 && (
          <section className="rounded-xl border border-white/[0.07] bg-zinc-900/40 p-6 mb-5">
            <h2 className="text-xs font-medium text-zinc-500 uppercase tracking-wide mb-5">Updates</h2>
            <div className="flex flex-col gap-4">
              {updates.map((update) => (
                <div key={update.id} className="flex flex-col gap-1">
                  <p className="text-sm text-zinc-200">{update.message}</p>
                  <p className="text-xs text-zinc-600">
                    {new Date(update.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Footer */}
        <footer className="mt-12 pt-6 border-t border-white/[0.05] text-center">
          <p className="text-xs text-zinc-600">Powered by Creative Wave Media</p>
        </footer>
      </main>
    </div>
  )
}
