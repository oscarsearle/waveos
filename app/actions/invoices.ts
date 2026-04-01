'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import type { InvoiceStatus } from '@/lib/constants'

export async function createInvoiceAction(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .from('invoices')
    .insert({
      client_id: formData.get('client_id') as string,
      project_id: (formData.get('project_id') as string) || null,
      title: formData.get('title') as string,
      amount: Number(formData.get('amount')),
      status: (formData.get('status') as InvoiceStatus) || 'Unpaid',
      due_date: (formData.get('due_date') as string) || null,
      notes: (formData.get('notes') as string) || null,
    })
    .select('id')
    .single()

  if (error) throw new Error(error.message)

  revalidatePath('/invoices')
  redirect(`/invoices/${data.id}`)
}

export async function updateInvoiceAction(id: string, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { error } = await supabase
    .from('invoices')
    .update({
      title: formData.get('title') as string,
      amount: Number(formData.get('amount')),
      due_date: (formData.get('due_date') as string) || null,
      notes: (formData.get('notes') as string) || null,
    })
    .eq('id', id)

  if (error) throw new Error(error.message)

  revalidatePath(`/invoices/${id}`)
  revalidatePath('/invoices')
  redirect(`/invoices/${id}`)
}

export async function updateInvoiceStatusAction(id: string, status: InvoiceStatus) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const updateData: Record<string, unknown> = { status }
  if (status === 'Paid') updateData.paid_at = new Date().toISOString()

  const { error } = await supabase.from('invoices').update(updateData).eq('id', id)
  if (error) throw new Error(error.message)

  revalidatePath(`/invoices/${id}`)
  revalidatePath('/invoices')
  revalidatePath('/dashboard')
}
