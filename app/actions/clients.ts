'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { PipelineStage } from '@/lib/constants'

function toSlug(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

export async function createClientAction(formData: FormData): Promise<{ id?: string; error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { data, error } = await supabase
    .from('clients')
    .insert({
      name: formData.get('name') as string,
      brand_name: (formData.get('brand_name') as string) || null,
      email: (formData.get('email') as string) || null,
      phone: (formData.get('phone') as string) || null,
      instagram: (formData.get('instagram') as string) || null,
      status: 'Lead',
      next_action: (formData.get('next_action') as string) || null,
      notes: (formData.get('notes') as string) || null,
    })
    .select('id')
    .single()

  if (error) return { error: error.message }

  revalidatePath('/clients')
  return { id: data.id }
}

export async function updateClientAction(id: string, formData: FormData): Promise<{ id?: string; error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { error } = await supabase
    .from('clients')
    .update({
      name: formData.get('name') as string,
      brand_name: (formData.get('brand_name') as string) || null,
      email: (formData.get('email') as string) || null,
      phone: (formData.get('phone') as string) || null,
      instagram: (formData.get('instagram') as string) || null,
      next_action: (formData.get('next_action') as string) || null,
      notes: (formData.get('notes') as string) || null,
    })
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath(`/clients/${id}`)
  revalidatePath('/clients')
  return { id }
}

export async function updateClientStatusAction(id: string, status: PipelineStage) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { error } = await supabase.from('clients').update({ status }).eq('id', id)
  if (error) throw new Error(error.message)

  revalidatePath(`/clients/${id}`)
  revalidatePath('/clients')
  revalidatePath('/dashboard')
}

export async function updatePortalSettingsAction(
  id: string,
  formData: FormData
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const portalEnabled = formData.get('portal_enabled') === 'on'
  const portalPassword = (formData.get('portal_password') as string) || null

  const portalSlug = (formData.get('portal_slug') as string)?.trim() || null

  const updateData: Record<string, unknown> = { portal_enabled: portalEnabled }
  if (portalPassword !== null) {
    updateData.portal_password = portalPassword
  }
  if (portalSlug !== null) {
    updateData.portal_slug = portalSlug
  }

  const { error } = await supabase.from('clients').update(updateData).eq('id', id)
  if (error) throw new Error(error.message)

  revalidatePath(`/clients/${id}`)
}

export async function addLinkAction(clientId: string, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { error } = await supabase.from('links').insert({
    client_id: clientId,
    label: formData.get('label') as string,
    url: formData.get('url') as string,
    is_portal_visible: formData.get('is_portal_visible') === 'on',
  })
  if (error) throw new Error(error.message)

  revalidatePath(`/clients/${clientId}`)
}

export async function deleteLinkAction(linkId: string, clientId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { error } = await supabase.from('links').delete().eq('id', linkId)
  if (error) throw new Error(error.message)

  revalidatePath(`/clients/${clientId}`)
}

export async function addPortalUpdateAction(clientId: string, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { error } = await supabase.from('portal_updates').insert({
    client_id: clientId,
    message: formData.get('message') as string,
  })
  if (error) throw new Error(error.message)

  revalidatePath(`/clients/${clientId}`)
}

export async function deletePortalUpdateAction(updateId: string, clientId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { error } = await supabase.from('portal_updates').delete().eq('id', updateId)
  if (error) throw new Error(error.message)

  revalidatePath(`/clients/${clientId}`)
}
