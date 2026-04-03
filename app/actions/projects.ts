'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import type { PipelineStage } from '@/lib/constants'

export async function createProjectAction(formData: FormData): Promise<{ id: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const clientId = (formData.get('client_id') as string) || null

  const { data, error } = await supabase
    .from('projects')
    .insert({
      client_id: clientId,
      name: formData.get('name') as string,
      description: (formData.get('description') as string) || null,
      deliverables: (formData.get('deliverables') as string) || null,
      stage: (formData.get('stage') as PipelineStage) || 'Lead',
      shoot_date: (formData.get('shoot_date') as string) || null,
      deadline: (formData.get('deadline') as string) || null,
      notes: (formData.get('notes') as string) || null,
    })
    .select('id')
    .single()

  if (error) throw new Error(error.message)

  revalidatePath('/projects')
  return { id: data.id }
}

export async function updateProjectAction(id: string, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { error } = await supabase
    .from('projects')
    .update({
      name: formData.get('name') as string,
      description: (formData.get('description') as string) || null,
      deliverables: (formData.get('deliverables') as string) || null,
      stage: formData.get('stage') as PipelineStage,
      shoot_date: (formData.get('shoot_date') as string) || null,
      deadline: (formData.get('deadline') as string) || null,
      notes: (formData.get('notes') as string) || null,
    })
    .eq('id', id)

  if (error) throw new Error(error.message)

  revalidatePath(`/projects/${id}`)
  revalidatePath('/projects')
  redirect(`/projects/${id}`)
}
