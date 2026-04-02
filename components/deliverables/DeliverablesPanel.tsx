'use client'

import { useTransition, useState } from 'react'
import { addDeliverableAction, updateDeliverableStatusAction, deleteDeliverableAction } from '@/app/actions/deliverables'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DELIVERABLE_TYPES, DELIVERABLE_STATUSES, DELIVERABLE_STATUS_COLOURS } from '@/lib/constants'
import type { Deliverable } from '@/lib/types'
import type { DeliverableStatus } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { Trash2, Plus, ChevronDown } from 'lucide-react'
import { toast } from 'sonner'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

function DeliverableBadge({ status }: { status: string }) {
  const colours = DELIVERABLE_STATUS_COLOURS[status] ?? { bg: 'bg-gray-100', text: 'text-gray-600' }
  return (
    <span className={cn('inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium', colours.bg, colours.text)}>
      {status}
    </span>
  )
}

export function DeliverablesPanel({
  projectId,
  clientId,
  deliverables,
}: {
  projectId: string
  clientId: string
  deliverables: Deliverable[]
}) {
  const [isPending, startTransition] = useTransition()
  const [showForm, setShowForm] = useState(false)

  function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const form = e.currentTarget
    startTransition(async () => {
      try {
        await addDeliverableAction(projectId, clientId, formData)
        form.reset()
        setShowForm(false)
        toast.success('Deliverable added')
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Error')
      }
    })
  }

  function handleStatusChange(id: string, status: DeliverableStatus) {
    startTransition(async () => {
      try {
        await updateDeliverableStatusAction(id, status, projectId)
        toast.success(`Marked as ${status}`)
      } catch {
        toast.error('Error updating status')
      }
    })
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      try {
        await deleteDeliverableAction(id, projectId)
        toast.success('Removed')
      } catch {
        toast.error('Error removing deliverable')
      }
    })
  }

  return (
    <div className="flex flex-col gap-3">
      {deliverables.length === 0 && !showForm ? (
        <p className="text-[13px] text-gray-400 py-2">No deliverables tracked yet.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {deliverables.map((d) => (
            <div
              key={d.id}
              className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3"
            >
              <div className="min-w-0 mr-4">
                <p className="text-[13px] font-medium text-gray-900">{d.title}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  {d.type && <span className="text-[11px] text-gray-400">{d.type}</span>}
                  {d.due_date && (
                    <span className="text-[11px] text-gray-400">
                      Due {new Date(d.due_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <DropdownMenu>
                  <DropdownMenuTrigger
                    disabled={isPending}
                    className="inline-flex items-center gap-1 text-[11px] font-medium disabled:opacity-50"
                  >
                    <DeliverableBadge status={d.status} />
                    <ChevronDown className="w-3 h-3 text-gray-400" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-white border-gray-200" align="end">
                    {DELIVERABLE_STATUSES.map((s) => (
                      <DropdownMenuItem
                        key={s}
                        onClick={() => handleStatusChange(d.id, s)}
                        className={`text-[13px] cursor-pointer focus:bg-gray-50 focus:text-gray-900 ${s === d.status ? 'text-gray-300' : 'text-gray-700'}`}
                      >
                        {s}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                <button
                  onClick={() => handleDelete(d.id)}
                  disabled={isPending}
                  className="text-gray-300 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm ? (
        <form onSubmit={handleAdd} className="rounded-xl border border-gray-200 bg-white p-5 flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">Title *</Label>
              <Input name="title" required placeholder="e.g. Hero Film 60s" className="bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-300 h-8 text-[13px]" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">Type</Label>
              <Select name="type">
                <SelectTrigger className="bg-gray-50 border-gray-200 text-gray-900 h-8 text-[13px]">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-200">
                  {DELIVERABLE_TYPES.map((t) => (
                    <SelectItem key={t} value={t} className="text-gray-700 text-[13px] focus:bg-gray-50 focus:text-gray-900">{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">Status</Label>
              <Select name="status" defaultValue="Planned">
                <SelectTrigger className="bg-gray-50 border-gray-200 text-gray-900 h-8 text-[13px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-200">
                  {DELIVERABLE_STATUSES.map((s) => (
                    <SelectItem key={s} value={s} className="text-gray-700 text-[13px] focus:bg-gray-50 focus:text-gray-900">{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">Due Date</Label>
              <Input name="due_date" type="date" className="bg-gray-50 border-gray-200 text-gray-900 h-8 text-[13px]" />
            </div>
          </div>
          <div className="flex items-center justify-between pt-1">
            <button type="button" onClick={() => setShowForm(false)} className="text-[12px] text-gray-400 hover:text-gray-700 transition-colors">
              Cancel
            </button>
            <Button type="submit" disabled={isPending} className="h-8 text-[12px] font-medium rounded-lg text-white" style={{ background: '#054F99' }}>
              {isPending ? 'Adding…' : 'Add Deliverable'}
            </Button>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 text-[12px] text-gray-400 hover:text-gray-700 transition-colors py-1"
        >
          <Plus className="w-3.5 h-3.5" />
          Add deliverable
        </button>
      )}
    </div>
  )
}
