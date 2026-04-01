'use client'

import { useTransition } from 'react'
import { updateInvoiceStatusAction } from '@/app/actions/invoices'
import { INVOICE_STATUSES, INVOICE_STATUS_COLOURS } from '@/lib/constants'
import type { InvoiceStatus } from '@/lib/constants'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ChevronDown } from 'lucide-react'
import { toast } from 'sonner'

export function InvoiceStatusUpdater({ invoiceId, currentStatus }: { invoiceId: string; currentStatus: InvoiceStatus }) {
  const [isPending, startTransition] = useTransition()

  function handleChange(status: InvoiceStatus) {
    if (status === currentStatus) return
    startTransition(async () => {
      try {
        await updateInvoiceStatusAction(invoiceId, status)
        toast.success(`Marked as ${status}`)
      } catch {
        toast.error('Error updating status')
      }
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        disabled={isPending}
        className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg text-[12px] font-medium border border-white/[0.08] text-zinc-400 hover:text-white hover:bg-white/[0.05] transition-all disabled:opacity-50"
      >
        {isPending ? 'Updating…' : 'Update Status'}
        <ChevronDown className="w-3.5 h-3.5" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-zinc-900 border-white/10" align="end">
        {INVOICE_STATUSES.map((s) => (
          <DropdownMenuItem
            key={s}
            onClick={() => handleChange(s)}
            className={`text-[13px] cursor-pointer focus:bg-white/10 focus:text-white ${s === currentStatus ? 'text-zinc-600' : 'text-zinc-200'}`}
          >
            {s}
            {s === currentStatus && <span className="ml-2 text-zinc-700">current</span>}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
