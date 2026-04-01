import { cn } from '@/lib/utils'
import { STAGE_COLOURS } from '@/lib/constants'
import type { PipelineStage } from '@/lib/constants'

export function StatusBadge({ status }: { status: string }) {
  const colours = STAGE_COLOURS[status] ?? { bg: 'bg-zinc-800', text: 'text-zinc-300' }
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

export function PipelineDot({ status }: { status: PipelineStage }) {
  const colours = STAGE_COLOURS[status] ?? { bg: 'bg-zinc-500', text: 'text-zinc-300' }
  return (
    <span
      className={cn(
        'inline-block w-2 h-2 rounded-full',
        colours.bg.replace('bg-', 'bg-').replace('-950', '-400').replace('-800', '-400')
      )}
    />
  )
}
