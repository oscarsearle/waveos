'use client'

import { useTransition, useState } from 'react'
import { verifyPortalPasswordAction } from '@/app/actions/portal'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import Image from 'next/image'

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
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{
        background: `
          radial-gradient(ellipse 75% 60% at 18% 68%, rgba(25, 65, 175, 0.75) 0%, transparent 65%),
          radial-gradient(ellipse 55% 50% at 82% 22%, rgba(15, 50, 155, 0.65) 0%, transparent 60%),
          radial-gradient(ellipse 40% 35% at 60% 80%, rgba(10, 35, 120, 0.4) 0%, transparent 55%),
          #010c1e
        `,
      }}
    >
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-2xl p-10 shadow-2xl">
          {/* Logo */}
          <div className="mb-8">
            <Image
              src="/creativewave-square_black copy.png"
              alt="Creative Wave"
              width={160}
              height={63}
              priority
            />
          </div>

          <h1
            className="text-2xl font-bold text-[#1E1E1E] mb-1"
            style={{ fontFamily: 'var(--font-poppins)', letterSpacing: '-0.02em' }}
          >
            {displayName}
          </h1>
          <p className="text-sm text-[#5A5A5A] mb-7">Enter your portal password to continue.</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <Label className="text-[#1E1E1E] text-sm font-medium">Password</Label>
              <Input
                name="password"
                type="password"
                required
                placeholder="••••••••"
                className="bg-[#f0f2f5] border-0 text-[#1E1E1E] placeholder:text-[#9AA0A6] h-11 rounded-lg focus-visible:ring-2 focus-visible:ring-[#054F99]"
              />
            </div>

            {error && (
              <p className="text-xs text-red-500">{error}</p>
            )}

            <Button
              type="submit"
              disabled={isPending}
              className="w-full h-11 mt-1 font-semibold text-white rounded-lg text-[15px]"
              style={{ background: '#054F99' }}
            >
              {isPending ? 'Checking…' : 'Enter Portal'}
            </Button>
          </form>
        </div>
      </div>

      {/* Footer */}
      <p className="mt-6 text-[11px] text-white/30">Creative Wave Media Portal v1</p>
    </div>
  )
}
