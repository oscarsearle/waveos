import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { ClientForm } from '@/components/clients/ClientForm'
import { updateClientAction } from '@/app/actions/clients'
import { ChevronLeft } from 'lucide-react'
import type { Client } from '@/lib/types'

export default async function EditClientPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data: client } = await supabase.from('clients').select('*').eq('id', id).single()

  if (!client) notFound()

  const c = client as Client

  async function action(formData: FormData) {
    'use server'
    await updateClientAction(id, formData)
  }

  return (
    <div className="p-8 max-w-3xl">
      <Link
        href={`/clients/${id}`}
        className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 transition-colors mb-6"
      >
        <ChevronLeft className="w-3.5 h-3.5" />
        {c.brand_name || c.name}
      </Link>
      <h1 className="text-lg font-semibold text-white mb-8">Edit Client</h1>
      <ClientForm client={c} action={action} submitLabel="Save Changes" />
    </div>
  )
}
