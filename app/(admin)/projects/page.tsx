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
          <FolderOpen className="w-4 h-4 opacity-30" style={{ color: '#00B7FF' }} />
          <div>
            <h1 className="text-lg font-bold" style={{ fontFamily: 'var(--font-poppins)', color: '#e8eeff', letterSpacing: '-0.02em' }}>Projects</h1>
            <p className="text-[11px]" style={{ color: '#3d5475' }}>{rows.length} total</p>
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
          <FolderOpen className="w-8 h-8 mb-3 opacity-20" style={{ color: '#00B7FF' }} />
          <p className="text-sm" style={{ color: '#3d5475' }}>No projects yet.</p>
        </div>
      ) : (
        <div className="rounded-xl overflow-hidden border" style={{ background: '#0b1120', borderColor: '#162035' }}>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b" style={{ background: '#0d1728', borderColor: '#162035' }}>
                <th className="text-left px-4 py-3 text-[10px] font-semibold uppercase tracking-widest" style={{ color: '#2d4060' }}>Project</th>
                <th className="text-left px-4 py-3 text-[10px] font-semibold uppercase tracking-widest" style={{ color: '#2d4060' }}>Client</th>
                <th className="text-left px-4 py-3 text-[10px] font-semibold uppercase tracking-widest" style={{ color: '#2d4060' }}>Stage</th>
                <th className="text-left px-4 py-3 text-[10px] font-semibold uppercase tracking-widest" style={{ color: '#2d4060' }}>Shoot Date</th>
                <th className="text-left px-4 py-3 text-[10px] font-semibold uppercase tracking-widest" style={{ color: '#2d4060' }}>Deadline</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((project, i) => {
                const client = project.clients
                return (
                  <tr
                    key={project.id}
                    className={`border-b transition-colors hover:bg-white/[0.02] ${i === rows.length - 1 ? 'border-b-0' : ''}`}
                    style={{ borderColor: '#162035' }}
                  >
                    <td className="px-4 py-3">
                      <Link href={`/projects/${project.id}`} className="font-medium hover:text-[#00B7FF] transition-colors" style={{ color: '#e8eeff' }}>
                        {project.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      {client ? (
                        <Link href={`/clients/${client.id}`} className="hover:text-[#00B7FF] transition-colors" style={{ color: '#3d5475' }}>
                          {client.brand_name || client.name}
                        </Link>
                      ) : (
                        <span style={{ color: '#2d4060' }}>—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={project.stage} />
                    </td>
                    <td className="px-4 py-3 text-[13px]" style={{ color: '#3d5475' }}>
                      {project.shoot_date
                        ? new Date(project.shoot_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                        : '—'}
                    </td>
                    <td className="px-4 py-3 text-[13px]" style={{ color: '#3d5475' }}>
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
