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

  return (
    <div className="flex flex-col gap-5">
      {/* Existing links */}
      {links.length === 0 ? (
        <p className="text-sm text-zinc-600 py-2">No links yet.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {links.map((link) => (
            <div
              key={link.id}
              className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-zinc-900/40 px-4 py-3"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-white">{link.label}</p>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-300 transition-colors mt-0.5 truncate"
                  >
                    <ExternalLink className="w-3 h-3 shrink-0" />
                    {link.url}
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0 ml-4">
                {link.is_portal_visible && (
                  <span className="text-xs text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded">
                    Portal
                  </span>
                )}
                <button
                  onClick={() => handleDelete(link.id)}
                  className="text-zinc-600 hover:text-red-400 transition-colors"
                  disabled={isPending}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add link form */}
      <form
        onSubmit={handleAdd}
        className="rounded-xl border border-white/[0.07] bg-zinc-900/40 p-5"
      >
        <h3 className="text-xs font-medium text-zinc-400 mb-4">Add Link</h3>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-zinc-500">Label</Label>
            <Input
              name="label"
              required
              placeholder="e.g. Frame.io Review"
              className="bg-zinc-900 border-white/10 text-white placeholder:text-zinc-600 h-8 text-sm"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-zinc-500">URL</Label>
            <Input
              name="url"
              type="url"
              required
              placeholder="https://"
              className="bg-zinc-900 border-white/10 text-white placeholder:text-zinc-600 h-8 text-sm"
            />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-xs text-zinc-400 cursor-pointer">
            <input
              type="checkbox"
              name="is_portal_visible"
              className="rounded border-white/20 bg-zinc-900 accent-white"
            />
            Show on client portal
          </label>
          <Button
            type="submit"
            disabled={isPending}
            className="h-8 text-xs bg-white text-black hover:bg-zinc-200 font-medium"
          >
            <Plus className="w-3.5 h-3.5 mr-1" />
            {isPending ? 'Adding…' : 'Add Link'}
          </Button>
        </div>
      </form>
    </div>
  )
}
