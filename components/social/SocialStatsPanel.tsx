'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { logSocialStatsAction, deleteSocialStatAction, type Platform } from '@/app/actions/social'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Plus, Trash2, TrendingUp, Users, Eye, Heart, MessageCircle } from 'lucide-react'
import { toast } from 'sonner'

type Stat = {
  id: string
  followers: number | null
  views: number | null
  likes: number | null
  comments: number | null
  posts: number | null
  notes: string | null
  recorded_at: string
}

type Props = {
  platform: Platform
  stats: Stat[]
  accentColor: string
}

function fmt(n: number | null): string {
  if (n === null || n === undefined) return '—'
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return n.toLocaleString()
}

export function SocialStatsPanel({ platform, stats, accentColor }: Props) {
  const [showForm, setShowForm] = useState(false)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const latest = stats[0] ?? null

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const form = e.currentTarget
    startTransition(async () => {
      const result = await logSocialStatsAction(platform, formData)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success('Stats logged')
        form.reset()
        setShowForm(false)
        router.refresh()
      }
    })
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      const result = await deleteSocialStatAction(id, platform)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success('Entry removed')
        router.refresh()
      }
    })
  }

  const inputStyle = { background: '#0d1728', borderColor: '#1a2a45', color: '#e8eeff' }
  const inputCls = 'h-9 text-sm border text-white placeholder:text-white/20'
  const labelCls = 'text-[10px] uppercase tracking-widest font-semibold'

  return (
    <div className="flex flex-col gap-5">
      {/* Latest snapshot */}
      {latest ? (
        <div className="rounded-xl border p-5" style={{ background: '#0b1120', borderColor: '#162035', borderTopColor: accentColor, borderTopWidth: 2 }}>
          <div className="flex items-center justify-between mb-5">
            <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: '#3d5475' }}>Latest Snapshot</p>
            <p className="text-[11px]" style={{ color: '#3d5475' }}>
              {new Date(latest.recorded_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
            </p>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: 'Followers', value: latest.followers, icon: Users },
              { label: 'Avg Views', value: latest.views, icon: Eye },
              { label: 'Avg Likes', value: latest.likes, icon: Heart },
              { label: 'Avg Comments', value: latest.comments, icon: MessageCircle },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label}>
                <div className="flex items-center gap-1.5 mb-1.5">
                  <Icon className="w-3 h-3 opacity-40" style={{ color: accentColor }} />
                  <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: '#3d5475' }}>{label}</p>
                </div>
                <p className="text-2xl font-bold tabular-nums" style={{ fontFamily: 'var(--font-poppins)', color: '#e8eeff', letterSpacing: '-0.02em' }}>
                  {fmt(value)}
                </p>
              </div>
            ))}
          </div>
          {latest.posts !== null && (
            <div className="flex items-center gap-1.5 mt-4 pt-4 border-t" style={{ borderColor: '#162035' }}>
              <TrendingUp className="w-3 h-3 opacity-40" style={{ color: accentColor }} />
              <p className="text-[12px]" style={{ color: '#3d5475' }}>
                <span style={{ color: '#e8eeff' }}>{latest.posts.toLocaleString()}</span> total posts
              </p>
            </div>
          )}
          {latest.notes && (
            <p className="text-[12px] mt-3" style={{ color: '#3d5475' }}>{latest.notes}</p>
          )}
        </div>
      ) : (
        <div className="rounded-xl border p-8 flex flex-col items-center text-center" style={{ background: '#0b1120', borderColor: '#162035' }}>
          <TrendingUp className="w-8 h-8 mb-3 opacity-20" style={{ color: accentColor }} />
          <p className="text-sm font-medium mb-1" style={{ color: '#3d5475' }}>No stats logged yet</p>
          <p className="text-[12px]" style={{ color: '#2d4060' }}>Log your first snapshot to start tracking growth.</p>
        </div>
      )}

      {/* Log stats button / form */}
      {!showForm ? (
        <div className="flex justify-end">
          <Button
            onClick={() => setShowForm(true)}
            className="h-8 text-xs font-medium text-white"
            style={{ background: '#054F99' }}
          >
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            Log Stats
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="rounded-xl border p-5 flex flex-col gap-4" style={{ background: '#0b1120', borderColor: '#162035' }}>
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: '#3d5475' }}>Log New Snapshot</p>
            <button type="button" onClick={() => setShowForm(false)} className="text-[11px] hover:text-white/70 transition-colors" style={{ color: '#3d5475' }}>
              Cancel
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { name: 'followers', label: 'Followers' },
              { name: 'views', label: 'Avg Views / Impressions' },
              { name: 'likes', label: 'Avg Likes' },
              { name: 'comments', label: 'Avg Comments' },
              { name: 'posts', label: 'Total Posts' },
            ].map(({ name, label }) => (
              <div key={name} className="flex flex-col gap-1.5">
                <Label className={labelCls} style={{ color: '#3d5475' }}>{label}</Label>
                <Input name={name} type="number" min="0" className={inputCls} style={inputStyle} />
              </div>
            ))}
            <div className="flex flex-col gap-1.5">
              <Label className={labelCls} style={{ color: '#3d5475' }}>Date</Label>
              <Input
                name="recorded_at"
                type="date"
                defaultValue={new Date().toISOString().split('T')[0]}
                className={inputCls}
                style={inputStyle}
              />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className={labelCls} style={{ color: '#3d5475' }}>Notes</Label>
            <Textarea name="notes" rows={2} className="text-sm resize-none border placeholder:text-white/20" style={inputStyle} />
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={isPending} className="h-8 text-xs font-medium text-white" style={{ background: '#054F99' }}>
              {isPending ? 'Saving…' : 'Save Snapshot'}
            </Button>
          </div>
        </form>
      )}

      {/* History */}
      {stats.length > 1 && (
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest mb-3" style={{ color: '#2d4060' }}>History</p>
          <div className="rounded-xl overflow-hidden border" style={{ background: '#0b1120', borderColor: '#162035' }}>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b" style={{ background: '#0d1728', borderColor: '#162035' }}>
                  {['Date', 'Followers', 'Avg Views', 'Avg Likes', 'Posts', ''].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-[10px] font-semibold uppercase tracking-widest" style={{ color: '#2d4060' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {stats.slice(1, 13).map((s, i) => (
                  <tr key={s.id} className={`border-b transition-colors hover:bg-white/[0.02] ${i === Math.min(stats.length - 2, 11) ? 'border-b-0' : ''}`} style={{ borderColor: '#162035' }}>
                    <td className="px-4 py-3 text-[13px]" style={{ color: '#3d5475' }}>
                      {new Date(s.recorded_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-4 py-3 text-[13px] tabular-nums" style={{ color: '#e8eeff' }}>{fmt(s.followers)}</td>
                    <td className="px-4 py-3 text-[13px] tabular-nums" style={{ color: '#3d5475' }}>{fmt(s.views)}</td>
                    <td className="px-4 py-3 text-[13px] tabular-nums" style={{ color: '#3d5475' }}>{fmt(s.likes)}</td>
                    <td className="px-4 py-3 text-[13px] tabular-nums" style={{ color: '#3d5475' }}>{fmt(s.posts)}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleDelete(s.id)}
                        disabled={isPending}
                        className="text-white/20 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
