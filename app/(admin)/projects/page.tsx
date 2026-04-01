import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { StatusBadge } from '@/components/clients/StatusBadge'
import { Button } from '@/components/ui/button'
import { Plus, FolderOpen } from 'lucide-react'
import type { Project, Client } from '@/lib/types'

export default async function ProjectsPage() {
  const supabase = await createClient()
  const { data: projects } = await supabase
    .from('projects')
    .select('*, clients(id, name, brand_name)')
    .order('updated_at', { ascending: false })

  const rows = (projects ?? []) as (Project & { clients: Pick<Client, 'id' | 'name' | 'brand_name'> | null })[]

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <FolderOpen className="w-5 h-5 text-zinc-400" />
          <div>
            <h1 className="text-lg font-semibold text-white">Projects</h1>
            <p className="text-xs text-zinc-500">{rows.length} total</p>
          </div>
        </div>
        <Link href="/projects/new">
          <Button className="bg-white text-black hover:bg-zinc-200 h-8 text-xs font-medium">
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            New Project
          </Button>
        </Link>
      </div>

      {rows.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <FolderOpen className="w-8 h-8 text-zinc-700 mb-3" />
          <p className="text-sm text-zinc-400">No projects yet.</p>
        </div>
      ) : (
        <div className="rounded-xl border border-white/[0.07] overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.07] bg-white/[0.02]">
                <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wide">Project</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wide">Client</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wide">Stage</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wide">Shoot Date</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wide">Deadline</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((project, i) => {
                const client = project.clients
                return (
                  <tr
                    key={project.id}
                    className={`border-b border-white/[0.04] hover:bg-white/[0.03] transition-colors ${i === rows.length - 1 ? 'border-b-0' : ''}`}
                  >
                    <td className="px-4 py-3">
                      <Link href={`/projects/${project.id}`} className="font-medium text-white hover:text-zinc-200 transition-colors">
                        {project.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      {client ? (
                        <Link href={`/clients/${client.id}`} className="text-zinc-400 hover:text-zinc-200 transition-colors">
                          {client.brand_name || client.name}
                        </Link>
                      ) : (
                        <span className="text-zinc-600">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={project.stage} />
                    </td>
                    <td className="px-4 py-3 text-zinc-400">
                      {project.shoot_date
                        ? new Date(project.shoot_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                        : '—'}
                    </td>
                    <td className="px-4 py-3 text-zinc-400">
                      {project.deadline
                        ? new Date(project.deadline).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                        : '—'}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
