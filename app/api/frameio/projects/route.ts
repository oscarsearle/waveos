import { NextResponse } from 'next/server'
import { frameioGet } from '@/lib/frameio'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: integration } = await supabase
    .from('integrations')
    .select('*')
    .eq('service', 'frameio')
    .single()

  if (!integration?.access_token) {
    return NextResponse.json({ error: 'Frame.io not connected' }, { status: 400 })
  }

  try {
    const projects = await frameioGet(
      `/teams/${integration.team_id}/projects`,
      integration.access_token
    )
    return NextResponse.json(projects)
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
