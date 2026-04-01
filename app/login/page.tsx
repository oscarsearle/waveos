'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Waves } from 'lucide-react'
import { toast } from 'sonner'

export default function LoginPage() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    startTransition(async () => {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        toast.error(error.message)
      } else {
        router.push('/dashboard')
        router.refresh()
      }
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-10">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-white/10">
            <Waves className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white leading-tight">WaveOS</p>
            <p className="text-xs text-zinc-500 leading-tight">Creative Wave Media</p>
          </div>
        </div>

        <h1 className="text-xl font-semibold text-white mb-1">Sign in</h1>
        <p className="text-sm text-zinc-500 mb-8">Admin access only.</p>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email" className="text-zinc-300 text-xs">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="oscar@creativewavemedia.com"
              required
              className="bg-zinc-900 border-white/10 text-white placeholder:text-zinc-600"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="password" className="text-zinc-300 text-xs">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="bg-zinc-900 border-white/10 text-white placeholder:text-zinc-600"
            />
          </div>

          <Button
            type="submit"
            disabled={isPending}
            className="w-full mt-2 bg-white text-black hover:bg-zinc-200 font-medium"
          >
            {isPending ? 'Signing in…' : 'Sign in'}
          </Button>
        </form>
      </div>
    </div>
  )
}
