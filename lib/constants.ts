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

// Dark luxury badge colours
export const STAGE_COLOURS: Record<string, { bg: string; text: string }> = {
  Lead:                 { bg: 'bg-white/[0.06]',    text: 'text-white/50' },
  Discovery:            { bg: 'bg-blue-500/10',      text: 'text-blue-300' },
  'Proposal Sent':      { bg: 'bg-violet-500/10',    text: 'text-violet-300' },
  'Awaiting Approval':  { bg: 'bg-amber-500/10',     text: 'text-amber-300' },
  'Agreement Sent':     { bg: 'bg-orange-500/10',    text: 'text-orange-300' },
  'Awaiting Signature': { bg: 'bg-orange-500/10',    text: 'text-orange-200' },
  'Pre-Production':     { bg: 'bg-sky-500/10',       text: 'text-sky-300' },
  'Shoot Booked':       { bg: 'bg-cyan-500/[0.15]',  text: 'text-cyan-300' },
  Editing:              { bg: 'bg-indigo-500/10',    text: 'text-indigo-300' },
  'Review Sent':        { bg: 'bg-purple-500/10',    text: 'text-purple-300' },
  Delivered:            { bg: 'bg-emerald-500/10',   text: 'text-emerald-300' },
  Invoiced:             { bg: 'bg-yellow-500/10',    text: 'text-yellow-300' },
  Paid:                 { bg: 'bg-green-500/10',     text: 'text-green-300' },
  Archived:             { bg: 'bg-white/[0.04]',     text: 'text-white/25' },
}

export const PROPOSAL_STATUS_COLOURS: Record<string, { bg: string; text: string }> = {
  Draft:    { bg: 'bg-white/[0.06]',   text: 'text-white/50' },
  Sent:     { bg: 'bg-blue-500/10',    text: 'text-blue-300' },
  Approved: { bg: 'bg-emerald-500/10', text: 'text-emerald-300' },
  Declined: { bg: 'bg-red-500/10',     text: 'text-red-400' },
}

export const AGREEMENT_STATUSES = ['Draft', 'Sent', 'Signed', 'Complete'] as const
export type AgreementStatus = (typeof AGREEMENT_STATUSES)[number]

export const AGREEMENT_STATUS_COLOURS: Record<string, { bg: string; text: string }> = {
  Draft:    { bg: 'bg-white/[0.06]',    text: 'text-white/50' },
  Sent:     { bg: 'bg-blue-500/10',     text: 'text-blue-300' },
  Signed:   { bg: 'bg-emerald-500/10',  text: 'text-emerald-300' },
  Complete: { bg: 'bg-green-500/10',    text: 'text-green-300' },
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
  Planned:       { bg: 'bg-white/[0.06]',   text: 'text-white/50' },
  'In Progress': { bg: 'bg-blue-500/10',    text: 'text-blue-300' },
  Review:        { bg: 'bg-amber-500/10',   text: 'text-amber-300' },
  Delivered:     { bg: 'bg-emerald-500/10', text: 'text-emerald-300' },
}

export const TESTIMONIAL_STATUSES = ['Requested', 'Received', 'Approved'] as const
export type TestimonialStatus = (typeof TESTIMONIAL_STATUSES)[number]

export const INVOICE_STATUSES = ['Unpaid', 'Partially Paid', 'Paid'] as const
export type InvoiceStatus = (typeof INVOICE_STATUSES)[number]

export const INVOICE_STATUS_COLOURS: Record<string, { bg: string; text: string }> = {
  Unpaid:           { bg: 'bg-red-500/10',     text: 'text-red-400' },
  'Partially Paid': { bg: 'bg-amber-500/10',   text: 'text-amber-300' },
  Paid:             { bg: 'bg-emerald-500/10', text: 'text-emerald-300' },
}
