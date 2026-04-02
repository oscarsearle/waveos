import { createClient } from '@/lib/supabase/server'
import { Settings, CheckCircle, XCircle, Link as LinkIcon } from 'lucide-react'

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ frameio?: string }>
}) {
  const { frameio } = await searchParams
  const supabase = await createClient()

  const { data: frameioIntegration } = await supabase
    .from('integrations')
    .select('service, account_id, team_id, updated_at, expires_at')
    .eq('service', 'frameio')
    .maybeSingle()

  const isConnected = !!frameioIntegration?.account_id

  return (
    <div className="p-8 max-w-2xl">
      <div className="flex items-center gap-3 mb-10">
        <Settings className="w-4 h-4 opacity-30" style={{ color: '#00B7FF' }} />
        <div>
          <h1 className="text-lg font-bold" style={{ fontFamily: 'var(--font-poppins)', color: '#e8eeff', letterSpacing: '-0.02em' }}>Settings</h1>
          <p className="text-[11px]" style={{ color: '#3d5475' }}>Integrations & connected accounts</p>
        </div>
      </div>

      {/* Status banner */}
      {frameio === 'connected' && (
        <div className="flex items-center gap-2 mb-6 px-4 py-3 rounded-lg border text-sm" style={{ background: 'rgba(16,185,129,0.08)', borderColor: 'rgba(16,185,129,0.2)', color: '#6ee7b7' }}>
          <CheckCircle className="w-4 h-4 shrink-0" />
          Frame.io connected successfully.
        </div>
      )}
      {frameio === 'error' && (
        <div className="flex items-center gap-2 mb-6 px-4 py-3 rounded-lg border text-sm" style={{ background: 'rgba(239,68,68,0.08)', borderColor: 'rgba(239,68,68,0.2)', color: '#fca5a5' }}>
          <XCircle className="w-4 h-4 shrink-0" />
          Frame.io connection failed. Please try again.
        </div>
      )}

      {/* Integrations */}
      <div className="flex flex-col gap-3">
        <p className="text-[10px] font-semibold uppercase tracking-widest mb-1" style={{ color: '#2d4060' }}>Integrations</p>

        {/* Frame.io */}
        <div className="rounded-xl border p-5" style={{ background: '#0b1120', borderColor: '#162035' }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: '#111d35' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M4 4h7v7H4V4zM13 4h7v7h-7V4zM4 13h7v7H4v-7zM13 13h7v7h-7v-7z" fill="#00B7FF" opacity="0.8" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ color: '#e8eeff' }}>Frame.io</p>
                <p className="text-[12px] mt-0.5" style={{ color: '#3d5475' }}>
                  {isConnected
                    ? `Connected · last synced ${new Date(frameioIntegration!.updated_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}`
                    : 'Browse and share assets from your Frame.io workspace'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {isConnected && (
                <span className="flex items-center gap-1.5 text-[12px]" style={{ color: '#6ee7b7' }}>
                  <CheckCircle className="w-3.5 h-3.5" />
                  Connected
                </span>
              )}
              <a
                href="/api/auth/frameio"
                className="inline-flex items-center gap-1.5 h-8 px-3 rounded-md text-[12px] font-medium border transition-all hover:bg-white/[0.05] hover:text-white"
                style={{
                  borderColor: isConnected ? '#162035' : '#054F99',
                  background: isConnected ? '#0d1728' : 'rgba(5,79,153,0.15)',
                  color: isConnected ? '#5a7099' : '#e8eeff',
                }}
              >
                <LinkIcon className="w-3.5 h-3.5" />
                {isConnected ? 'Reconnect' : 'Connect'}
              </a>
            </div>
          </div>
        </div>

        {/* Coming soon */}
        {[
          { name: 'Gmail', desc: 'Send emails to clients directly from WaveOS', soon: true },
          { name: 'Instagram', desc: 'View account metrics and post performance', soon: true },
        ].map(({ name, desc }) => (
          <div key={name} className="rounded-xl border p-5 opacity-50" style={{ background: '#0b1120', borderColor: '#162035' }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-9 h-9 rounded-lg" style={{ background: '#111d35' }} />
                <div>
                  <p className="text-sm font-semibold" style={{ color: '#e8eeff' }}>{name}</p>
                  <p className="text-[12px] mt-0.5" style={{ color: '#3d5475' }}>{desc}</p>
                </div>
              </div>
              <span className="text-[11px] px-2 py-0.5 rounded border" style={{ color: '#3d5475', borderColor: '#162035', background: '#0d1728' }}>Coming soon</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
