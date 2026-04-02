'use client'

import { useTransition } from 'react'
import { updateInvoiceStatusAction } from '@/app/actions/invoices'
import { INVOICE_STATUSES } from '@/lib/constants'
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
        className="inline-flex items-center gap-1.5 h-8 px-3 rounded-md text-[12px] font-medium border text-white/40 hover:text-white hover:bg-white/[0.05] transition-all disabled:opacity-50"
        style={{ borderColor: '#162035', background: '#0d1728' }}
      >
        {isPending ? 'Updating…' : 'Update Status'}
        <ChevronDown className="w-3.5 h-3.5" />
      </DropdownMenuTrigger>
      <DropdownMenuContent style={{ background: '#0c1420', borderColor: '#1a2a45' }} align="end">
        {INVOICE_STATUSES.map((s) => (
          <DropdownMenuItem
            key={s}
            onClick={() => handleChange(s)}
            className={`text-[13px] cursor-pointer focus:bg-white/[0.06] ${s === currentStatus ? 'text-white/20' : 'text-white/60 focus:text-white'}`}
          >
            {s}
            {s === currentStatus && <span className="ml-2 text-white/20">current</span>}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
