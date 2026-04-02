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
          <FolderOpen className="w-5 h-5 text-gray-400" />
          <div>
            <h1 className="text-lg font-semibold text-gray-900">Projects</h1>
            <p className="text-xs text-gray-400">{rows.length} total</p>
          </div>
        </div>
        <Link href="/projects/new">
          <Button className="h-8 text-xs font-medium text-white" style={{ background: '#054F99' }}>
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            New Project
          </Button>
        </Link>
      </div>

      {rows.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <FolderOpen className="w-8 h-8 text-gray-300 mb-3" />
          <p className="text-sm text-gray-500">No projects yet.</p>
        </div>
      ) : (
        <div className="rounded-xl border border-gray-200 overflow-hidden bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Project</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Client</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Stage</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Shoot Date</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Deadline</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((project, i) => {
                const client = project.clients
                return (
                  <tr
                    key={project.id}
                    className={`border-b border-gray-50 hover:bg-gray-50 transition-colors ${i === rows.length - 1 ? 'border-b-0' : ''}`}
                  >
                    <td className="px-4 py-3">
                      <Link href={`/projects/${project.id}`} className="font-medium text-gray-900 hover:text-[#054F99] transition-colors">
                        {project.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      {client ? (
                        <Link href={`/clients/${client.id}`} className="text-gray-500 hover:text-gray-900 transition-colors">
                          {client.brand_name || client.name}
                        </Link>
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={project.stage} />
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {project.shoot_date
                        ? new Date(project.shoot_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                        : '—'}
                    </td>
                    <td className="px-4 py-3 text-gray-500">
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
