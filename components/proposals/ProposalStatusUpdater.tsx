'use client'

import { useTransition } from 'react'
import { updateProposalStatusAction } from '@/app/actions/proposals'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { PROPOSAL_STATUSES } from '@/lib/constants'
import type { ProposalStatus } from '@/lib/constants'
import { ChevronDown } from 'lucide-react'
import { toast } from 'sonner'

export function ProposalStatusUpdater({
  proposalId,
  currentStatus,
}: {
  proposalId: string
  currentStatus: ProposalStatus
}) {
  const [isPending, startTransition] = useTransition()

  function handleStatusChange(status: ProposalStatus) {
    if (status === currentStatus) return
    startTransition(async () => {
      try {
        await updateProposalStatusAction(proposalId, status)
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
        className="inline-flex items-center gap-1.5 h-8 px-3 rounded-md text-xs border border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPending ? 'Updating…' : 'Change Status'}
        <ChevronDown className="w-3.5 h-3.5" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-white border-gray-200" align="end">
        {PROPOSAL_STATUSES.map((status) => (
          <DropdownMenuItem
            key={status}
            onClick={() => handleStatusChange(status)}
            className={`text-sm cursor-pointer focus:bg-gray-50 focus:text-gray-900 ${status === currentStatus ? 'text-gray-300' : 'text-gray-700'}`}
          >
            {status}
            {status === currentStatus && <span className="ml-2 text-gray-300">current</span>}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
