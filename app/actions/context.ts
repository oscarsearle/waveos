'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

const EXTRACT_SYSTEM = `You are a data extraction engine for Wave OS, a business management system for a creative agency (Creative Wave Media).

Extract structured information from raw context (briefs, discovery call notes, emails, planning docs).

Return ONLY a valid JSON object with these fields (omit fields you cannot find):
{
  "client_name": string,
  "brand_name": string,
  "project_name": string,
  "project_type": string, // one of: Brand Film, Photography, Social Content, Reels Package, Campaign, Event Coverage, Interview, Product Video, Documentary, Other
  "budget": number,
  "currency": string, // GBP or NZD or USD etc
  "deadline": string, // ISO date YYYY-MM-DD
  "shoot_date": string, // ISO date YYYY-MM-DD
  "location": string,
  "contacts": [{ "name": string, "email": string, "phone": string }],
  "deliverables": string[],
  "tasks": string[],
  "notes": string,
  "pipeline_stage": string // one of: Lead, Discovery, Proposal Sent, Awaiting Approval, Pre-Production, Shoot Booked, Editing, Delivered
}

Return ONLY valid JSON. No explanation. No markdown. Just JSON.`

export async function saveContextAction(
  formData: FormData
): Promise<{ id?: string; error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const rawText = (formData.get('raw_text') as string)?.trim()
  const title = (formData.get('title') as string)?.trim() || 'Untitled Context'
  if (!rawText) return { error: 'No context provided' }

  const { data, error } = await supabase
    .from('contexts')
    .insert({ raw_text: rawText, title })
    .select('id')
    .single()

  if (error) return { error: error.message }

  revalidatePath('/context-hub')
  return { id: data.id }
}

export async function updateContextAction(
  id: string,
  formData: FormData
): Promise<{ error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const rawText = (formData.get('raw_text') as string)?.trim()
  const title = (formData.get('title') as string)?.trim()

  const { error } = await supabase
    .from('contexts')
    .update({ raw_text: rawText, title })
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/context-hub')
  return {}
}

export async function deleteContextAction(
  id: string
): Promise<{ error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { error } = await supabase.from('contexts').delete().eq('id', id)
  if (error) return { error: error.message }

  revalidatePath('/context-hub')
  return {}
}

export async function parseContextAction(
  id: string
): Promise<{ extracted?: Record<string, unknown>; error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { data: ctx, error: fetchErr } = await supabase
    .from('contexts')
    .select('raw_text')
    .eq('id', id)
    .single()

  if (fetchErr || !ctx) return { error: 'Context not found' }

  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    systemInstruction: EXTRACT_SYSTEM,
  })

  const result = await model.generateContent(ctx.raw_text)
  const raw = result.response.text().trim()

  // Strip markdown code fences if present
  const cleaned = raw.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/, '').trim()

  let extracted: Record<string, unknown>
  try {
    extracted = JSON.parse(cleaned)
  } catch {
    return { error: 'Failed to parse extracted data' }
  }

  const { error: updateErr } = await supabase
    .from('contexts')
    .update({ extracted })
    .eq('id', id)

  if (updateErr) return { error: updateErr.message }

  revalidatePath('/context-hub')
  return { extracted }
}

export async function saveMessageAction(
  contextId: string,
  role: 'user' | 'assistant',
  content: string
): Promise<{ error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { error } = await supabase
    .from('context_messages')
    .insert({ context_id: contextId, role, content })

  if (error) return { error: error.message }
  return {}
}
