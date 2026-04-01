import { cn } from '@/lib/utils'
import { PROPOSAL_STATUS_COLOURS } from '@/lib/constants'

export function ProposalStatusBadge({ status }: { status: string }) {
  const colours = PROPOSAL_STATUS_COLOURS[status] ?? { bg: 'bg-zinc-800', text: 'text-zinc-300' }
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium',
        colours.bg,
        colours.text
      )}
    >
      {status}
    </span>
  )
}
