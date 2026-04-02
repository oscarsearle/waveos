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

// Light-mode badge colours matching Creative Wave brand palette
export const STAGE_COLOURS: Record<string, { bg: string; text: string }> = {
  Lead:                 { bg: 'bg-gray-100',    text: 'text-gray-600' },
  Discovery:            { bg: 'bg-blue-50',     text: 'text-blue-700' },
  'Proposal Sent':      { bg: 'bg-violet-50',   text: 'text-violet-700' },
  'Awaiting Approval':  { bg: 'bg-amber-50',    text: 'text-amber-700' },
  'Agreement Sent':     { bg: 'bg-orange-50',   text: 'text-orange-700' },
  'Awaiting Signature': { bg: 'bg-orange-50',   text: 'text-orange-600' },
  'Pre-Production':     { bg: 'bg-sky-50',      text: 'text-sky-700' },
  'Shoot Booked':       { bg: 'bg-cyan-50',     text: 'text-cyan-700' },
  Editing:              { bg: 'bg-indigo-50',   text: 'text-indigo-700' },
  'Review Sent':        { bg: 'bg-purple-50',   text: 'text-purple-700' },
  Delivered:            { bg: 'bg-emerald-50',  text: 'text-emerald-700' },
  Invoiced:             { bg: 'bg-yellow-50',   text: 'text-yellow-700' },
  Paid:                 { bg: 'bg-green-50',    text: 'text-green-700' },
  Archived:             { bg: 'bg-gray-100',    text: 'text-gray-400' },
}

export const PROPOSAL_STATUS_COLOURS: Record<string, { bg: string; text: string }> = {
  Draft:    { bg: 'bg-gray-100',   text: 'text-gray-600' },
  Sent:     { bg: 'bg-blue-50',    text: 'text-blue-700' },
  Approved: { bg: 'bg-green-50',   text: 'text-green-700' },
  Declined: { bg: 'bg-red-50',     text: 'text-red-700' },
}

export const AGREEMENT_STATUSES = ['Draft', 'Sent', 'Signed', 'Complete'] as const
export type AgreementStatus = (typeof AGREEMENT_STATUSES)[number]

export const AGREEMENT_STATUS_COLOURS: Record<string, { bg: string; text: string }> = {
  Draft:    { bg: 'bg-gray-100',    text: 'text-gray-600' },
  Sent:     { bg: 'bg-blue-50',     text: 'text-blue-700' },
  Signed:   { bg: 'bg-emerald-50',  text: 'text-emerald-700' },
  Complete: { bg: 'bg-green-50',    text: 'text-green-700' },
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
  Planned:      { bg: 'bg-gray-100',   text: 'text-gray-600' },
  'In Progress': { bg: 'bg-blue-50',   text: 'text-blue-700' },
  Review:       { bg: 'bg-amber-50',   text: 'text-amber-700' },
  Delivered:    { bg: 'bg-emerald-50', text: 'text-emerald-700' },
}

export const TESTIMONIAL_STATUSES = ['Requested', 'Received', 'Approved'] as const
export type TestimonialStatus = (typeof TESTIMONIAL_STATUSES)[number]

export const INVOICE_STATUSES = ['Unpaid', 'Partially Paid', 'Paid'] as const
export type InvoiceStatus = (typeof INVOICE_STATUSES)[number]

export const INVOICE_STATUS_COLOURS: Record<string, { bg: string; text: string }> = {
  Unpaid:           { bg: 'bg-red-50',     text: 'text-red-700' },
  'Partially Paid': { bg: 'bg-amber-50',   text: 'text-amber-700' },
  Paid:             { bg: 'bg-emerald-50', text: 'text-emerald-700' },
}
