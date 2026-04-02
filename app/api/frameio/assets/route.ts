import { NextRequest, NextResponse } from 'next/server'
import { frameioGet } from '@/lib/frameio'
import { createClient } from '@/lib/supabase/server'

// GET /api/frameio/assets?folder_id=xxx
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const folderId = searchParams.get('folder_id')
  if (!folderId) return NextResponse.json({ error: 'folder_id required' }, { status: 400 })

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: integration } = await supabase
    .from('integrations')
    .select('access_token')
    .eq('service', 'frameio')
    .single()

  if (!integration?.access_token) {
    return NextResponse.json({ error: 'Frame.io not connected' }, { status: 400 })
  }

  try {
    const assets = await frameioGet(
      `/assets/${folderId}/children?type=file,folder&page=1&page_size=50`,
      integration.access_token
    )
    return NextResponse.json(assets)
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
