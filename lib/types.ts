import type { PipelineStage, ProposalStatus, AgreementStatus, DeliverableStatus, InvoiceStatus, TestimonialStatus } from './constants'

export type Client = {
  id: string
  name: string
  brand_name: string | null
  email: string | null
  phone: string | null
  instagram: string | null
  project_type: string | null
  status: PipelineStage
  project_value: number | null
  next_action: string | null
  notes: string | null
  portal_slug: string | null
  portal_enabled: boolean
  portal_password: string | null
  created_at: string
  updated_at: string
}

export type Project = {
  id: string
  client_id: string
  name: string
  description: string | null
  deliverables: string | null
  stage: PipelineStage
  shoot_date: string | null
  deadline: string | null
  notes: string | null
  created_at: string
  updated_at: string
  // joined
  client?: Pick<Client, 'id' | 'name' | 'brand_name'>
  clients?: Pick<Client, 'id' | 'name' | 'brand_name'>
}

export type Proposal = {
  id: string
  client_id: string
  title: string
  scope: string | null
  deliverables: string | null
  price: number | null
  add_ons: string | null
  timeline: string | null
  notes: string | null
  status: ProposalStatus
  sent_at: string | null
  created_at: string
  updated_at: string
  // joined
  client?: Pick<Client, 'id' | 'name' | 'brand_name'>
  clients?: Pick<Client, 'id' | 'name' | 'brand_name'>
}

export type Agreement = {
  id: string
  client_id: string
  project_id: string | null
  title: string
  template_type: string | null
  status: AgreementStatus
  file_url: string | null
  notes: string | null
  sent_at: string | null
  signed_at: string | null
  created_at: string
  updated_at: string
  // joined
  clients?: Pick<Client, 'id' | 'name' | 'brand_name'>
  projects?: Pick<Project, 'id' | 'name'>
}

export type Deliverable = {
  id: string
  project_id: string
  client_id: string
  title: string
  type: string | null
  status: DeliverableStatus
  due_date: string | null
  notes: string | null
  created_at: string
  updated_at: string
  // joined
  projects?: Pick<Project, 'id' | 'name'>
  clients?: Pick<Client, 'id' | 'name' | 'brand_name'>
}

export type Testimonial = {
  id: string
  client_id: string | null
  project_id: string | null
  quote: string
  status: TestimonialStatus
  created_at: string
  updated_at: string
  // joined
  clients?: Pick<Client, 'id' | 'name' | 'brand_name'>
  projects?: Pick<Project, 'id' | 'name'>
}

export type Invoice = {
  id: string
  client_id: string
  project_id: string | null
  title: string
  amount: number
  status: InvoiceStatus
  due_date: string | null
  paid_at: string | null
  notes: string | null
  created_at: string
  updated_at: string
  // joined
  clients?: Pick<Client, 'id' | 'name' | 'brand_name'>
  projects?: Pick<Project, 'id' | 'name'>
}

export type Link = {
  id: string
  client_id: string
  project_id: string | null
  label: string
  url: string
  is_portal_visible: boolean
  created_at: string
}

export type PortalUpdate = {
  id: string
  client_id: string
  message: string
  created_at: string
}

export type PortalData = {
  client: Pick<Client, 'name' | 'brand_name' | 'portal_enabled'>
  projects: Pick<Project, 'id' | 'name' | 'deliverables' | 'stage' | 'shoot_date' | 'deadline'>[]
  links: Pick<Link, 'id' | 'label' | 'url'>[]
  updates: Pick<PortalUpdate, 'id' | 'message' | 'created_at'>[]
}
