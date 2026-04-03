'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import type { ProposalStatus } from '@/lib/constants'

export async function createProposalAction(formData: FormData): Promise<{ id: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const clientId = (formData.get('client_id') as string) || null

  const { data, error } = await supabase
    .from('proposals')
    .insert({
      client_id: clientId,
      title: formData.get('title') as string,
      scope: (formData.get('scope') as string) || null,
      deliverables: (formData.get('deliverables') as string) || null,
      price: formData.get('price') ? Number(formData.get('price')) : null,
      add_ons: (formData.get('add_ons') as string) || null,
      timeline: (formData.get('timeline') as string) || null,
      notes: (formData.get('notes') as string) || null,
      status: 'Draft',
    })
    .select('id')
    .single()

  if (error) throw new Error(error.message)

  revalidatePath('/proposals')
  return { id: data.id }
}

export async function updateProposalAction(id: string, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { error } = await supabase
    .from('proposals')
    .update({
      title: formData.get('title') as string,
      scope: (formData.get('scope') as string) || null,
      deliverables: (formData.get('deliverables') as string) || null,
      price: formData.get('price') ? Number(formData.get('price')) : null,
      add_ons: (formData.get('add_ons') as string) || null,
      timeline: (formData.get('timeline') as string) || null,
      notes: (formData.get('notes') as string) || null,
    })
    .eq('id', id)

  if (error) throw new Error(error.message)

  revalidatePath(`/proposals/${id}`)
  revalidatePath('/proposals')
  redirect(`/proposals/${id}`)
}

export async function updateProposalStatusAction(id: string, status: ProposalStatus) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const updateData: Record<string, unknown> = { status }
  if (status === 'Sent') {
    updateData.sent_at = new Date().toISOString()
  }

  const { error } = await supabase.from('proposals').update(updateData).eq('id', id)
  if (error) throw new Error(error.message)

  revalidatePath(`/proposals/${id}`)
  revalidatePath('/proposals')
  revalidatePath('/dashboard')
}
