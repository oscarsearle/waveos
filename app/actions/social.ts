'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export type Platform = 'instagram' | 'youtube' | 'tiktok' | 'linkedin'

export async function logSocialStatsAction(
  platform: Platform,
  formData: FormData
): Promise<{ id?: string; error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { data, error } = await supabase
    .from('social_stats')
    .insert({
      platform,
      followers: formData.get('followers') ? Number(formData.get('followers')) : null,
      views: formData.get('views') ? Number(formData.get('views')) : null,
      likes: formData.get('likes') ? Number(formData.get('likes')) : null,
      comments: formData.get('comments') ? Number(formData.get('comments')) : null,
      posts: formData.get('posts') ? Number(formData.get('posts')) : null,
      notes: (formData.get('notes') as string) || null,
      recorded_at: (formData.get('recorded_at') as string) || new Date().toISOString().split('T')[0],
    })
    .select('id')
    .single()

  if (error) return { error: error.message }

  revalidatePath(`/${platform}`)
  return { id: data.id }
}

export async function deleteSocialStatAction(
  id: string,
  platform: Platform
): Promise<{ error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { error } = await supabase.from('social_stats').delete().eq('id', id)
  if (error) return { error: error.message }

  revalidatePath(`/${platform}`)
  return {}
}
