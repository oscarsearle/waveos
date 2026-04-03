import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { NewProposalForm } from './_form'
import { ChevronLeft } from 'lucide-react'

export default async function NewProposalPage({
  searchParams,
}: {
  searchParams: Promise<{ client_id?: string }>
}) {
  const { client_id } = await searchParams
  const supabase = await createClient()

  const { data: clients } = await supabase
    .from('clients')
    .select('id, name, brand_name')
    .order('name', { ascending: true })

  return (
    <div className="p-8 max-w-2xl">
      <Link href="/proposals" className="inline-flex items-center gap-1.5 text-xs hover:text-[#00B7FF] transition-colors mb-6" style={{ color: '#3d5475' }}>
        <ChevronLeft className="w-3.5 h-3.5" />
        Proposals
      </Link>
      <h1 className="text-lg font-bold mb-8" style={{ fontFamily: 'var(--font-poppins)', color: '#e8eeff', letterSpacing: '-0.02em' }}>New Proposal</h1>
      <NewProposalForm
        clients={clients ?? []}
        defaultClientId={client_id ?? ''}
      />
    </div>
  )
}
