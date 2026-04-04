import { NextRequest } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@/lib/supabase/server'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const SYSTEM_PROMPT = `You are the internal AI operator for Wave OS — a business management system built for Creative Wave Media, a creative agency.

You have direct access to a piece of context (brief, discovery call notes, emails, or planning documents) pasted by the user. Your job is to help Oscar (the agency owner) understand, organise, and act on this context.

You can:
- Summarise the brief
- Answer questions about the context
- Extract tasks, deliverables, deadlines, contacts
- Execute actions across the OS (create clients, projects, proposals, etc.)

When the user asks you to perform a system action, respond naturally THEN include an action block at the very end like this:

\`\`\`action
{"action":"create_client","data":{"name":"Ben Searle","brand_name":"Ben Builds","email":"ben@builds.co","phone":"","instagram":"","next_action":"Discovery Call","notes":""}}
\`\`\`

Available actions and their data shapes:
- create_client: { name, brand_name, email, phone, instagram, next_action, notes }
- create_project: { client_id (leave blank), name, description, deliverables, stage, shoot_date (YYYY-MM-DD or ""), deadline (YYYY-MM-DD or ""), notes }
- create_proposal: { client_id (leave blank), title, scope, deliverables, price, timeline, notes }

Rules:
- Be concise and professional. This is an internal operator tool, not a chatbot.
- If you don't have enough information for an action, ask for it.
- Dates must be ISO format (YYYY-MM-DD) or empty string.
- Only include one action block per response.
- If no action is needed, don't include an action block.`

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return new Response('Unauthorized', { status: 401 })

  const { contextId, messages } = await req.json()

  // Fetch context
  const { data: ctx } = await supabase
    .from('contexts')
    .select('raw_text, extracted, title')
    .eq('id', contextId)
    .single()

  const contextBlock = ctx
    ? `CONTEXT: "${ctx.title}"\n\nRAW TEXT:\n${ctx.raw_text}\n\nEXTRACTED DATA:\n${JSON.stringify(ctx.extracted ?? {}, null, 2)}`
    : ''

  const systemWithContext = contextBlock
    ? `${SYSTEM_PROMPT}\n\n---\n\n${contextBlock}`
    : SYSTEM_PROMPT

  const stream = anthropic.messages.stream({
    model: 'claude-opus-4-5',
    max_tokens: 2048,
    system: systemWithContext,
    messages,
  })

  const readable = new ReadableStream({
    async start(controller) {
      for await (const event of stream) {
        if (
          event.type === 'content_block_delta' &&
          event.delta.type === 'text_delta'
        ) {
          controller.enqueue(new TextEncoder().encode(event.delta.text))
        }
      }
      controller.close()
    },
  })

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Transfer-Encoding': 'chunked',
    },
  })
}
