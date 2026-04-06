'use server'

import { createServiceClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const COOKIE_PREFIX = 'waveos_portal_'

export async function verifyPortalPasswordAction(slug: string, formData: FormData) {
  const supabase = await createServiceClient()

  const { data: client } = await supabase
    .from('clients')
    .select('id, portal_enabled, portal_password')
    .eq('portal_slug', slug)
    .single()

  if (!client || !client.portal_enabled) {
    throw new Error('Portal not available')
  }

  const submitted = formData.get('password') as string

  if (!client.portal_password || submitted !== client.portal_password) {
    throw new Error('Incorrect password')
  }

  // Set an HTTP-only session cookie for this portal
  const cookieStore = await cookies()
  cookieStore.set(`${COOKIE_PREFIX}${slug}`, 'authenticated', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: `/portal/${slug}`,
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })

  redirect(`/portal/${slug}/view`)
}

export async function getPortalData(slug: string) {
  const supabase = await createServiceClient()

  const { data: client } = await supabase
    .from('clients')
    .select('id, name, brand_name, portal_enabled, status')
    .eq('portal_slug', slug)
    .single()

  if (!client || !client.portal_enabled) return null

  const [{ data: projects }, { data: links }, { data: updates }, { data: proposals }] = await Promise.all([
    supabase
      .from('projects')
      .select('id, name, deliverables, stage, shoot_date, deadline')
      .eq('client_id', client.id)
      .order('created_at', { ascending: false }),
    supabase
      .from('links')
      .select('id, label, url')
      .eq('client_id', client.id)
      .eq('is_portal_visible', true)
      .order('created_at', { ascending: false }),
    supabase
      .from('portal_updates')
      .select('id, message, created_at')
      .eq('client_id', client.id)
      .order('created_at', { ascending: false }),
    supabase
      .from('proposals')
      .select('id, title, status, price')
      .eq('client_id', client.id)
      .not('status', 'eq', 'Draft')
      .order('created_at', { ascending: false }),
  ])

  return {
    client: {
      name: client.name,
      brand_name: client.brand_name,
      portal_enabled: client.portal_enabled,
      status: client.status,
    },
    projects: projects ?? [],
    links: links ?? [],
    updates: updates ?? [],
    proposals: proposals ?? [],
  }
}

export async function checkPortalAuth(slug: string): Promise<boolean> {
  const cookieStore = await cookies()
  const cookie = cookieStore.get(`${COOKIE_PREFIX}${slug}`)
  return cookie?.value === 'authenticated'
}
