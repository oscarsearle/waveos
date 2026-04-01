export const PIPELINE_STAGES = [
  'Lead',
  'Discovery',
  'Proposal Sent',
  'Awaiting Approval',
  'Agreement Sent',
  'Awaiting Signature',
  'Pre-Production',
  'Shoot Booked',
  'Editing',
  'Review Sent',
  'Delivered',
  'Invoiced',
  'Paid',
  'Archived',
] as const

export type PipelineStage = (typeof PIPELINE_STAGES)[number]

export const PROPOSAL_STATUSES = ['Draft', 'Sent', 'Approved', 'Declined'] as const
export type ProposalStatus = (typeof PROPOSAL_STATUSES)[number]

export const PROJECT_TYPES = [
  'Brand Film',
  'Photography',
  'Social Content',
  'Reels Package',
  'Campaign',
  'Event Coverage',
  'Interview',
  'Product Video',
  'Documentary',
  'Other',
] as const

// Stages that indicate active work (used in dashboard counts)
export const ACTIVE_STAGES: PipelineStage[] = [
  'Discovery',
  'Proposal Sent',
  'Awaiting Approval',
  'Agreement Sent',
  'Awaiting Signature',
  'Pre-Production',
  'Shoot Booked',
  'Editing',
  'Review Sent',
  'Delivered',
  'Invoiced',
]

// Stage badge colours — maps stage name to a Tailwind colour class pair
export const STAGE_COLOURS: Record<string, { bg: string; text: string }> = {
  Lead: { bg: 'bg-zinc-800', text: 'text-zinc-300' },
  Discovery: { bg: 'bg-blue-950', text: 'text-blue-300' },
  'Proposal Sent': { bg: 'bg-violet-950', text: 'text-violet-300' },
  'Awaiting Approval': { bg: 'bg-amber-950', text: 'text-amber-300' },
  'Agreement Sent': { bg: 'bg-orange-950', text: 'text-orange-300' },
  'Awaiting Signature': { bg: 'bg-orange-950', text: 'text-orange-200' },
  'Pre-Production': { bg: 'bg-sky-950', text: 'text-sky-300' },
  'Shoot Booked': { bg: 'bg-cyan-950', text: 'text-cyan-300' },
  Editing: { bg: 'bg-indigo-950', text: 'text-indigo-300' },
  'Review Sent': { bg: 'bg-purple-950', text: 'text-purple-300' },
  Delivered: { bg: 'bg-emerald-950', text: 'text-emerald-300' },
  Invoiced: { bg: 'bg-yellow-950', text: 'text-yellow-300' },
  Paid: { bg: 'bg-green-950', text: 'text-green-300' },
  Archived: { bg: 'bg-zinc-900', text: 'text-zinc-500' },
}

export const PROPOSAL_STATUS_COLOURS: Record<string, { bg: string; text: string }> = {
  Draft: { bg: 'bg-zinc-800', text: 'text-zinc-300' },
  Sent: { bg: 'bg-blue-950', text: 'text-blue-300' },
  Approved: { bg: 'bg-green-950', text: 'text-green-300' },
  Declined: { bg: 'bg-red-950', text: 'text-red-300' },
}

export const AGREEMENT_STATUSES = ['Draft', 'Sent', 'Signed', 'Complete'] as const
export type AgreementStatus = (typeof AGREEMENT_STATUSES)[number]

export const AGREEMENT_STATUS_COLOURS: Record<string, { bg: string; text: string }> = {
  Draft: { bg: 'bg-zinc-800', text: 'text-zinc-300' },
  Sent: { bg: 'bg-blue-950', text: 'text-blue-300' },
  Signed: { bg: 'bg-emerald-950', text: 'text-emerald-300' },
  Complete: { bg: 'bg-green-950', text: 'text-green-300' },
}

export const AGREEMENT_TEMPLATES = [
  'Production Agreement',
  'Usage License',
  'NDA',
  'Creative Brief',
  'Collaboration Agreement',
  'Model Release',
  'Location Release',
  'Other',
] as const

export const DELIVERABLE_TYPES = [
  'Hero Film',
  'Social Reel',
  'Short Form',
  'Photo Set',
  'Story Content',
  'Interview',
  'BTS',
  'Podcast',
  'Other',
] as const

export const DELIVERABLE_STATUSES = ['Planned', 'In Progress', 'Review', 'Delivered'] as const
export type DeliverableStatus = (typeof DELIVERABLE_STATUSES)[number]

export const DELIVERABLE_STATUS_COLOURS: Record<string, { bg: string; text: string }> = {
  Planned: { bg: 'bg-zinc-800', text: 'text-zinc-300' },
  'In Progress': { bg: 'bg-blue-950', text: 'text-blue-300' },
  Review: { bg: 'bg-amber-950', text: 'text-amber-300' },
  Delivered: { bg: 'bg-emerald-950', text: 'text-emerald-300' },
}

export const TESTIMONIAL_STATUSES = ['Requested', 'Received', 'Approved'] as const
export type TestimonialStatus = (typeof TESTIMONIAL_STATUSES)[number]

export const INVOICE_STATUSES = ['Unpaid', 'Partially Paid', 'Paid'] as const
export type InvoiceStatus = (typeof INVOICE_STATUSES)[number]

export const INVOICE_STATUS_COLOURS: Record<string, { bg: string; text: string }> = {
  Unpaid: { bg: 'bg-red-950', text: 'text-red-300' },
  'Partially Paid': { bg: 'bg-amber-950', text: 'text-amber-300' },
  Paid: { bg: 'bg-emerald-950', text: 'text-emerald-300' },
}
