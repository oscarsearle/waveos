'use client'

import { useTransition, useState } from 'react'
import { verifyPortalPasswordAction } from '@/app/actions/portal'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Waves } from 'lucide-react'

export function PortalGate({
  slug,
  displayName,
}: {
  slug: string
  displayName: string
}) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const formData = new FormData(e.currentTarget)
    startTransition(async () => {
      try {
        await verifyPortalPasswordAction(slug, formData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Incorrect password')
      }
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex items-center gap-2.5 mb-10">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/[0.07]">
            <Waves className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-xs font-medium text-zinc-400 leading-tight">Creative Wave Media</p>
          </div>
        </div>

        <h1 className="text-xl font-semibold text-white mb-1">{displayName}</h1>
        <p className="text-sm text-zinc-500 mb-8">Enter your portal password to continue.</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-zinc-400">Password</Label>
            <Input
              name="password"
              type="password"
              required
              placeholder="••••••••"
              className="bg-zinc-900 border-white/10 text-white placeholder:text-zinc-600"
            />
          </div>

          {error && (
            <p className="text-xs text-red-400">{error}</p>
          )}

          <Button
            type="submit"
            disabled={isPending}
            className="w-full bg-white text-black hover:bg-zinc-200 font-medium mt-1"
          >
            {isPending ? 'Checking…' : 'Enter Portal'}
          </Button>
        </form>
      </div>
    </div>
  )
}
