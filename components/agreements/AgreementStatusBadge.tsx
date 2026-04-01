import { cn } from '@/lib/utils'
import { AGREEMENT_STATUS_COLOURS } from '@/lib/constants'

export function AgreementStatusBadge({ status }: { status: string }) {
  const colours = AGREEMENT_STATUS_COLOURS[status] ?? { bg: 'bg-zinc-800', text: 'text-zinc-300' }
  return (
    <span className={cn('inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium', colours.bg, colours.text)}>
      {status}
    </span>
  )
}
