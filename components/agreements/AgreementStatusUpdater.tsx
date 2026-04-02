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
        className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg text-[12px] font-medium border border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all disabled:opacity-50"
      >
        {isPending ? 'Updating…' : 'Change Status'}
        <ChevronDown className="w-3.5 h-3.5" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-white border-gray-200" align="end">
        {AGREEMENT_STATUSES.map((status) => (
          <DropdownMenuItem
            key={status}
            onClick={() => handleChange(status)}
            className={`text-[13px] cursor-pointer focus:bg-gray-50 focus:text-gray-900 ${status === currentStatus ? 'text-gray-300' : 'text-gray-700'}`}
          >
            {status}
            {status === currentStatus && <span className="ml-2 text-gray-300">current</span>}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
