'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { DeliverableStatus } from '@/lib/constants'

export async function addDeliverableAction(projectId: string, clientId: string, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { error } = await supabase.from('deliverables').insert({
    project_id: projectId,
    client_id: clientId,
    title: formData.get('title') as string,
    type: (formData.get('type') as string) || null,
    status: (formData.get('status') as DeliverableStatus) || 'Planned',
    due_date: (formData.get('due_date') as string) || null,
    notes: (formData.get('notes') as string) || null,
  })

  if (error) throw new Error(error.message)
  revalidatePath(`/projects/${projectId}`)
}

export async function updateDeliverableStatusAction(id: string, status: DeliverableStatus, projectId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { error } = await supabase.from('deliverables').update({ status }).eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath(`/projects/${projectId}`)
}

export async function deleteDeliverableAction(id: string, projectId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { error } = await supabase.from('deliverables').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath(`/projects/${projectId}`)
}
