'use client'

import { useTransition } from 'react'
import { addLinkAction, deleteLinkAction } from '@/app/actions/clients'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Trash2, ExternalLink, Plus } from 'lucide-react'
import { toast } from 'sonner'
import type { Link as LinkType } from '@/lib/types'

export function ClientLinksTab({
  clientId,
  links,
}: {
  clientId: string
  links: LinkType[]
}) {
  const [isPending, startTransition] = useTransition()

  function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const form = e.currentTarget
    startTransition(async () => {
      try {
        await addLinkAction(clientId, formData)
        form.reset()
        toast.success('Link added')
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Error adding link')
      }
    })
  }

  function handleDelete(linkId: string) {
    startTransition(async () => {
      try {
        await deleteLinkAction(linkId, clientId)
        toast.success('Link removed')
      } catch {
        toast.error('Error removing link')
      }
    })
  }

  const inputStyle = { background: '#0d1728', borderColor: '#1a2a45', color: '#e8eeff' }

  return (
    <div className="flex flex-col gap-5">
      {links.length === 0 ? (
        <p className="text-sm py-2" style={{ color: '#3d5475' }}>No links yet.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {links.map((link) => (
            <div
              key={link.id}
              className="flex items-center justify-between rounded-lg border px-4 py-3"
              style={{ background: '#0d1728', borderColor: '#162035' }}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="min-w-0">
                  <p className="text-sm font-medium" style={{ color: '#e8eeff' }}>{link.label}</p>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs hover:text-[#00B7FF] transition-colors mt-0.5 truncate"
                    style={{ color: '#3d5475' }}
                  >
                    <ExternalLink className="w-3 h-3 shrink-0" />
                    {link.url}
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0 ml-4">
                {link.is_portal_visible && (
                  <span className="text-xs px-2 py-0.5 rounded border" style={{ color: '#6ee7b7', background: 'rgba(16,185,129,0.08)', borderColor: 'rgba(16,185,129,0.2)' }}>
                    Portal
                  </span>
                )}
                <button
                  onClick={() => handleDelete(link.id)}
                  className="transition-colors hover:text-red-400"
                  style={{ color: '#2d4060' }}
                  disabled={isPending}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleAdd} className="rounded-xl border p-5" style={{ background: '#0b1120', borderColor: '#162035' }}>
        <h3 className="text-[10px] font-semibold uppercase tracking-widest mb-4" style={{ color: '#3d5475' }}>Add Link</h3>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-medium" style={{ color: '#3d5475' }}>Label</Label>
            <Input
              name="label"
              required
              placeholder="e.g. Frame.io Review"
              className="h-8 text-sm border text-white placeholder:text-white/20"
              style={inputStyle}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-medium" style={{ color: '#3d5475' }}>URL</Label>
            <Input
              name="url"
              type="url"
              required
              placeholder="https://"
              className="h-8 text-sm border text-white placeholder:text-white/20"
              style={inputStyle}
            />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-xs cursor-pointer" style={{ color: '#3d5475' }}>
            <input
              type="checkbox"
              name="is_portal_visible"
              className="rounded border"
              style={{ accentColor: '#00B7FF', borderColor: '#1a2a45' }}
            />
            Show on client portal
          </label>
          <Button
            type="submit"
            disabled={isPending}
            className="h-8 text-xs font-medium text-white"
            style={{ background: '#054F99' }}
          >
            <Plus className="w-3.5 h-3.5 mr-1" />
            {isPending ? 'Adding…' : 'Add Link'}
          </Button>
        </div>
      </form>
    </div>
  )
}
