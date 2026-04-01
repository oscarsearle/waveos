import { createServiceClient } from '@/lib/supabase/server'
import { checkPortalAuth } from '@/app/actions/portal'
import { PortalGate } from '@/components/portal/PortalGate'
import { redirect } from 'next/navigation'
import { Waves } from 'lucide-react'

export default async function PortalGatePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  // Check if already authenticated
  const isAuthenticated = await checkPortalAuth(slug)
  if (isAuthenticated) {
    redirect(`/portal/${slug}/view`)
  }

  // Check if portal exists and is enabled
  const supabase = await createServiceClient()
  const { data: client } = await supabase
    .from('clients')
    .select('brand_name, name, portal_enabled')
    .eq('portal_slug', slug)
    .single()

  const displayName = client?.brand_name || client?.name || 'Client Portal'

  if (!client || !client.portal_enabled) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-4">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/[0.06]">
              <Waves className="w-5 h-5 text-zinc-400" />
            </div>
          </div>
          <p className="text-sm text-zinc-400">This portal is not available.</p>
          <p className="text-xs text-zinc-600 mt-1">Please contact your project team for access.</p>
        </div>
      </div>
    )
  }

  return <PortalGate slug={slug} displayName={displayName} />
}
