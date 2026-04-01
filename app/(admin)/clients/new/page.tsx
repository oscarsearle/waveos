import Link from 'next/link'
import { ClientForm } from '@/components/clients/ClientForm'
import { createClientAction } from '@/app/actions/clients'
import { ChevronLeft } from 'lucide-react'

export default function NewClientPage() {
  return (
    <div className="p-8 max-w-3xl">
      <Link
        href="/clients"
        className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 transition-colors mb-6"
      >
        <ChevronLeft className="w-3.5 h-3.5" />
        Clients
      </Link>
      <h1 className="text-lg font-semibold text-white mb-8">New Client</h1>
      <ClientForm action={createClientAction} submitLabel="Create Client" />
    </div>
  )
}
