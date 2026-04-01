'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import type { AgreementStatus } from '@/lib/constants'

export async function createAgreementAction(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .from('agreements')
    .insert({
      client_id: formData.get('client_id') as string,
      project_id: (formData.get('project_id') as string) || null,
      title: formData.get('title') as string,
      template_type: (formData.get('template_type') as string) || null,
      file_url: (formData.get('file_url') as string) || null,
      notes: (formData.get('notes') as string) || null,
      status: 'Draft',
    })
    .select('id')
    .single()

  if (error) throw new Error(error.message)

  revalidatePath('/agreements')
  redirect(`/agreements/${data.id}`)
}

export async function updateAgreementAction(id: string, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { error } = await supabase
    .from('agreements')
    .update({
      title: formData.get('title') as string,
      template_type: (formData.get('template_type') as string) || null,
      file_url: (formData.get('file_url') as string) || null,
      notes: (formData.get('notes') as string) || null,
    })
    .eq('id', id)

  if (error) throw new Error(error.message)

  revalidatePath(`/agreements/${id}`)
  revalidatePath('/agreements')
  redirect(`/agreements/${id}`)
}

export async function updateAgreementStatusAction(id: string, status: AgreementStatus) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const updateData: Record<string, unknown> = { status }
  if (status === 'Sent') updateData.sent_at = new Date().toISOString()
  if (status === 'Signed') updateData.signed_at = new Date().toISOString()

  const { error } = await supabase.from('agreements').update(updateData).eq('id', id)
  if (error) throw new Error(error.message)

  revalidatePath(`/agreements/${id}`)
  revalidatePath('/agreements')
}
