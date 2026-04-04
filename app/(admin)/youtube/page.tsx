import { createClient } from '@/lib/supabase/server'
import { PlayCircle as Youtube } from 'lucide-react'
import { SocialStatsPanel } from '@/components/social/SocialStatsPanel'

const ACCENT = '#FF0000'

export default async function YouTubePage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('social_stats')
    .select('*')
    .eq('platform', 'youtube')
    .order('recorded_at', { ascending: false })

  const stats = data ?? []

  return (
    <div className="p-8 max-w-3xl">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${ACCENT}20`, border: `1px solid ${ACCENT}30` }}>
          <Youtube className="w-4 h-4" style={{ color: ACCENT }} />
        </div>
        <div>
          <h1 className="text-lg font-bold" style={{ fontFamily: 'var(--font-poppins)', color: '#e8eeff', letterSpacing: '-0.02em' }}>YouTube</h1>
          <p className="text-[11px]" style={{ color: '#3d5475' }}>{stats.length} snapshot{stats.length !== 1 ? 's' : ''} logged</p>
        </div>
      </div>
      <SocialStatsPanel platform="youtube" stats={stats} accentColor={ACCENT} />
    </div>
  )
}
