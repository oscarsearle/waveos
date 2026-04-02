import { NextRequest, NextResponse } from 'next/server'
import { exchangeCode, frameioGet } from '@/lib/frameio'
import { createClient } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const code = searchParams.get('code')
  const error = searchParams.get('error')

  if (error || !code) {
    return NextResponse.redirect(new URL('/settings?frameio=error', req.url))
  }

  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.redirect(new URL('/login', req.url))

    // Exchange code for tokens
    const tokens = await exchangeCode(code)
    const expiresAt = new Date(Date.now() + tokens.expires_in * 1000).toISOString()

    // Get account + team info
    const me = await frameioGet('/me', tokens.access_token)
    const teams = await frameioGet('/teams', tokens.access_token)
    const teamId = teams?.[0]?.id ?? null

    // Upsert into integrations table
    await supabase.from('integrations').upsert({
      service: 'frameio',
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      token_type: tokens.token_type,
      expires_at: expiresAt,
      scope: tokens.scope,
      account_id: me?.account_id ?? null,
      team_id: teamId,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'service' })

    return NextResponse.redirect(new URL('/settings?frameio=connected', req.url))
  } catch (err) {
    console.error('Frame.io OAuth error:', err)
    return NextResponse.redirect(new URL('/settings?frameio=error', req.url))
  }
}
