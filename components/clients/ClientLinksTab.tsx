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
      {links.length === 0 ? (
        <p className="text-sm text-gray-400 py-2">No links yet.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {links.map((link) => (
            <div
              key={link.id}
              className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900">{link.label}</p>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-700 transition-colors mt-0.5 truncate"
                  >
                    <ExternalLink className="w-3 h-3 shrink-0" />
                    {link.url}
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0 ml-4">
                {link.is_portal_visible && (
                  <span className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                    Portal
                  </span>
                )}
                <button
                  onClick={() => handleDelete(link.id)}
                  className="text-gray-300 hover:text-red-500 transition-colors"
                  disabled={isPending}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleAdd} className="rounded-xl border border-gray-200 bg-white p-5">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">Add Link</h3>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-gray-400 font-medium">Label</Label>
            <Input
              name="label"
              required
              placeholder="e.g. Frame.io Review"
              className="bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-300 h-8 text-sm"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-gray-400 font-medium">URL</Label>
            <Input
              name="url"
              type="url"
              required
              placeholder="https://"
              className="bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-300 h-8 text-sm"
            />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-xs text-gray-500 cursor-pointer">
            <input
              type="checkbox"
              name="is_portal_visible"
              className="rounded border-gray-300 bg-white"
              style={{ accentColor: '#054F99' }}
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
