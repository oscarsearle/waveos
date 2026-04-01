import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'

type StatCardProps = {
  label: string
  value: string | number
  icon: LucideIcon
  className?: string
}

export function StatCard({ label, value, icon: Icon, className }: StatCardProps) {
  return (
    <div className={cn('rounded-xl border border-white/[0.07] bg-zinc-900/60 p-5', className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-zinc-500 mb-1.5 uppercase tracking-wide font-medium">{label}</p>
          <p className="text-3xl font-semibold text-white tabular-nums">{value}</p>
        </div>
        <div className="p-2 rounded-lg bg-white/[0.06]">
          <Icon className="w-4 h-4 text-zinc-400" />
        </div>
      </div>
    </div>
  )
}
