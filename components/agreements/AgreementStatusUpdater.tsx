'use client'

import { useTransition } from 'react'
import { updateAgreementStatusAction } from '@/app/actions/agreements'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { AGREEMENT_STATUSES } from '@/lib/constants'
import type { AgreementStatus } from '@/lib/constants'
import { ChevronDown } from 'lucide-react'
import { toast } from 'sonner'

export function AgreementStatusUpdater({
  agreementId,
  currentStatus,
}: {
  agreementId: string
  currentStatus: AgreementStatus
}) {
  const [isPending, startTransition] = useTransition()

  function handleChange(status: AgreementStatus) {
    if (status === currentStatus) return
    startTransition(async () => {
      try {
        await updateAgreementStatusAction(agreementId, status)
        toast.success(`Status updated to ${status}`)
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Error updating status')
      }
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        disabled={isPending}
        className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg text-[12px] font-medium border border-white/[0.08] text-zinc-400 hover:text-white hover:bg-white/[0.05] transition-all disabled:opacity-50"
      >
        {isPending ? 'Updating…' : 'Change Status'}
        <ChevronDown className="w-3.5 h-3.5" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-zinc-900 border-white/10" align="end">
        {AGREEMENT_STATUSES.map((status) => (
          <DropdownMenuItem
            key={status}
            onClick={() => handleChange(status)}
            className={`text-[13px] cursor-pointer focus:bg-white/10 focus:text-white ${status === currentStatus ? 'text-zinc-600' : 'text-zinc-200'}`}
          >
            {status}
            {status === currentStatus && <span className="ml-2 text-zinc-700">current</span>}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
