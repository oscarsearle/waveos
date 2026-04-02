'use client'

import { useTransition } from 'react'
import {
  updatePortalSettingsAction,
  addPortalUpdateAction,
  deletePortalUpdateAction,
} from '@/app/actions/clients'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Trash2, ExternalLink } from 'lucide-react'
import { toast } from 'sonner'
import type { Client, PortalUpdate } from '@/lib/types'

export function ClientPortalTab({
  client,
  updates,
}: {
  client: Client
  updates: PortalUpdate[]
}) {
  const [isPending, startTransition] = useTransition()

  const portalUrl = client.portal_slug
    ? `/portal/${client.portal_slug}`
    : null

  function handlePortalSettings(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    startTransition(async () => {
      try {
        await updatePortalSettingsAction(client.id, formData)
        toast.success('Portal settings saved')
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Error saving settings')
      }
    })
  }

  function handleAddUpdate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const form = e.currentTarget
    startTransition(async () => {
      try {
        await addPortalUpdateAction(client.id, formData)
        form.reset()
        toast.success('Update posted')
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Error posting update')
      }
    })
  }

  function handleDeleteUpdate(updateId: string) {
    startTransition(async () => {
      try {
        await deletePortalUpdateAction(updateId, client.id)
        toast.success('Update removed')
      } catch {
        toast.error('Error removing update')
      }
    })
  }

  return (
    <div className="flex flex-col gap-5">
      <form onSubmit={handlePortalSettings} className="rounded-xl border border-gray-200 bg-white p-5">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-5">Portal Settings</h3>

        <div className="flex flex-col gap-4">
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              name="portal_enabled"
              defaultChecked={client.portal_enabled}
              className="rounded border-gray-300 w-4 h-4"
              style={{ accentColor: '#054F99' }}
            />
            <span className="text-sm text-gray-700">Portal enabled</span>
          </label>

          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-gray-400 font-medium">Portal Password</Label>
            <Input
              name="portal_password"
              type="password"
              placeholder="Leave blank to keep existing"
              className="bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-300 h-9 text-sm max-w-xs"
            />
            <p className="text-xs text-gray-400">Client must enter this to view their portal.</p>
          </div>

          {portalUrl && (
            <div className="flex items-center gap-2">
              <a
                href={portalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-900 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                {window?.location?.origin ?? ''}{portalUrl}
              </a>
            </div>
          )}

          {!client.portal_slug && (
            <p className="text-xs text-gray-400">Add a portal slug to the client profile first.</p>
          )}
        </div>

        <div className="mt-5">
          <Button
            type="submit"
            disabled={isPending}
            className="h-8 text-xs font-medium text-white"
            style={{ background: '#054F99' }}
          >
            {isPending ? 'Saving…' : 'Save Settings'}
          </Button>
        </div>
      </form>

      <div className="rounded-xl border border-gray-200 bg-white p-5">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-5">Portal Updates</h3>

        {updates.length === 0 ? (
          <p className="text-sm text-gray-400 mb-4">No updates posted yet.</p>
        ) : (
          <div className="flex flex-col gap-2 mb-5">
            {updates.map((u) => (
              <div
                key={u.id}
                className="flex items-start justify-between rounded-lg border border-gray-100 bg-gray-50 px-4 py-3"
              >
                <div>
                  <p className="text-sm text-gray-700">{u.message}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(u.created_at).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </p>
                </div>
                <button
                  onClick={() => handleDeleteUpdate(u.id)}
                  disabled={isPending}
                  className="text-gray-300 hover:text-red-500 transition-colors ml-4 mt-0.5 shrink-0"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}

        <form onSubmit={handleAddUpdate} className="flex flex-col gap-3">
          <Textarea
            name="message"
            required
            rows={3}
            placeholder="Post a status update for the client…"
            className="bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-300 text-sm resize-none"
          />
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isPending}
              className="h-8 text-xs font-medium text-white"
              style={{ background: '#054F99' }}
            >
              {isPending ? 'Posting…' : 'Post Update'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
