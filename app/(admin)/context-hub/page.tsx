import { createClient } from '@/lib/supabase/server'
import { ContextHubPanel } from './_panel'

export default async function ContextHubPage() {
  const supabase = await createClient()

  const { data: contexts } = await supabase
    .from('contexts')
    .select('id, title, created_at, extracted')
    .order('updated_at', { ascending: false })

  return <ContextHubPanel contexts={contexts ?? []} />
}
