'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import type { TestimonialStatus } from '@/lib/constants'

export async function createTestimonialAction(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .from('testimonials')
    .insert({
      client_id: (formData.get('client_id') as string) || null,
      project_id: (formData.get('project_id') as string) || null,
      quote: formData.get('quote') as string,
      status: (formData.get('status') as TestimonialStatus) || 'Requested',
    })
    .select('id')
    .single()

  if (error) throw new Error(error.message)

  revalidatePath('/testimonials')
  redirect(`/testimonials/${data.id}`)
}

export async function updateTestimonialAction(id: string, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { error } = await supabase
    .from('testimonials')
    .update({
      quote: formData.get('quote') as string,
      status: formData.get('status') as TestimonialStatus,
    })
    .eq('id', id)

  if (error) throw new Error(error.message)

  revalidatePath(`/testimonials/${id}`)
  revalidatePath('/testimonials')
  redirect(`/testimonials/${id}`)
}
