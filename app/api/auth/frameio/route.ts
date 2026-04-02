import { NextResponse } from 'next/server'
import { getAuthUrl } from '@/lib/frameio'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const state = crypto.randomUUID()
  const url = getAuthUrl(state)
  return NextResponse.redirect(url)
}
