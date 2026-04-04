import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return new Response('Unauthorized', { status: 401 })

  const id = req.nextUrl.searchParams.get('id')
  if (!id) return new Response('Missing id', { status: 400 })

  const { data, error } = await supabase
    .from('contexts')
    .select('raw_text, title, extracted')
    .eq('id', id)
    .single()

  if (error || !data) return new Response('Not found', { status: 404 })

  return Response.json(data)
}
