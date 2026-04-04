'use client'

import { useState, useRef, useEffect, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import {
  saveContextAction,
  updateContextAction,
  deleteContextAction,
  parseContextAction,
  saveMessageAction,
} from '@/app/actions/context'
import { createClientAction } from '@/app/actions/clients'
import { createProjectAction } from '@/app/actions/projects'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import {
  Plus,
  Trash2,
  Sparkles,
  Send,
  ChevronRight,
  FileText,
  User,
  Calendar,
  DollarSign,
  MapPin,
  Package,
  CheckSquare,
  Loader2,
  BrainCircuit,
} from 'lucide-react'

type ContextRow = {
  id: string
  title: string
  created_at: string
  extracted: Record<string, unknown> | null
}

type Message = {
  role: 'user' | 'assistant'
  content: string
}

function extractActionBlock(text: string): { action: string; data: Record<string, unknown> } | null {
  const match = text.match(/```action\s*([\s\S]*?)```/)
  if (!match) return null
  try {
    return JSON.parse(match[1].trim())
  } catch {
    return null
  }
}

function stripActionBlock(text: string): string {
  return text.replace(/```action[\s\S]*?```/g, '').trim()
}

function ExtractedCard({ extracted }: { extracted: Record<string, unknown> }) {
  const fields = [
    { icon: User, label: 'Client', value: (extracted.brand_name || extracted.client_name) as string },
    { icon: FileText, label: 'Project', value: extracted.project_name as string },
    { icon: DollarSign, label: 'Budget', value: extracted.budget ? `${extracted.currency || '£'}${Number(extracted.budget).toLocaleString()}` : null },
    { icon: Calendar, label: 'Deadline', value: extracted.deadline as string },
    { icon: Calendar, label: 'Shoot Date', value: extracted.shoot_date as string },
    { icon: MapPin, label: 'Location', value: extracted.location as string },
  ].filter(f => f.value)

  const deliverables = extracted.deliverables as string[] | undefined
  const tasks = extracted.tasks as string[] | undefined
  const contacts = extracted.contacts as { name: string; email: string; phone: string }[] | undefined

  return (
    <div className="flex flex-col gap-3">
      {fields.length > 0 && (
        <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-blue-400 mb-3">Extracted Info</p>
          <div className="grid grid-cols-2 gap-2">
            {fields.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-start gap-2">
                <Icon className="w-3.5 h-3.5 mt-0.5 shrink-0 text-blue-300" />
                <div>
                  <p className="text-[10px] text-blue-400 font-medium">{label}</p>
                  <p className="text-[13px] text-slate-700 font-medium">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {contacts && contacts.length > 0 && (
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-2">Contacts</p>
          {contacts.map((c, i) => (
            <div key={i} className="text-[13px] text-slate-600">
              <span className="font-medium text-slate-800">{c.name}</span>
              {c.email && <span className="text-slate-400 ml-2">{c.email}</span>}
            </div>
          ))}
        </div>
      )}

      {deliverables && deliverables.length > 0 && (
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-1.5 mb-2">
            <Package className="w-3.5 h-3.5 text-slate-400" />
            <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">Deliverables</p>
          </div>
          <ul className="flex flex-col gap-1">
            {deliverables.map((d, i) => (
              <li key={i} className="flex items-center gap-2 text-[13px] text-slate-600">
                <span className="w-1 h-1 rounded-full bg-blue-300 shrink-0" />
                {d}
              </li>
            ))}
          </ul>
        </div>
      )}

      {tasks && tasks.length > 0 && (
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-1.5 mb-2">
            <CheckSquare className="w-3.5 h-3.5 text-slate-400" />
            <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">Tasks</p>
          </div>
          <ul className="flex flex-col gap-1">
            {tasks.map((t, i) => (
              <li key={i} className="flex items-center gap-2 text-[13px] text-slate-600">
                <span className="w-1 h-1 rounded-full bg-slate-300 shrink-0" />
                {t}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export function ContextHubPanel({ contexts }: { contexts: ContextRow[] }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  // Left panel state
  const [contextList, setContextList] = useState<ContextRow[]>(contexts)
  const [selectedId, setSelectedId] = useState<string | null>(contexts[0]?.id ?? null)

  // Right panel state
  const [title, setTitle] = useState('')
  const [rawText, setRawText] = useState('')
  const [extracted, setExtracted] = useState<Record<string, unknown> | null>(null)
  const [isParsing, setIsParsing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isNew, setIsNew] = useState(false)

  // Chat state
  const [messages, setMessages] = useState<Message[]>([])
  const [chatInput, setChatInput] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Load selected context
  useEffect(() => {
    if (!selectedId) return
    const ctx = contextList.find(c => c.id === selectedId)
    if (ctx) {
      setTitle(ctx.title)
      setExtracted(ctx.extracted)
      setMessages([])
      setIsNew(false)
      // Fetch full raw_text
      fetch(`/api/context/raw?id=${selectedId}`)
        .then(r => r.json())
        .then(d => setRawText(d.raw_text ?? ''))
        .catch(() => {})
    }
  }, [selectedId])

  function startNew() {
    setSelectedId(null)
    setTitle('')
    setRawText('')
    setExtracted(null)
    setMessages([])
    setIsNew(true)
  }

  async function handleSave() {
    if (!rawText.trim()) return toast.error('Add some context first')
    setIsSaving(true)
    const fd = new FormData()
    fd.set('raw_text', rawText)
    fd.set('title', title || 'Untitled Context')

    if (isNew) {
      const result = await saveContextAction(fd)
      if (result.error) { toast.error(result.error); setIsSaving(false); return }
      toast.success('Context saved')
      setSelectedId(result.id!)
      setIsNew(false)
      router.refresh()
    } else if (selectedId) {
      const result = await updateContextAction(selectedId, fd)
      if (result.error) { toast.error(result.error); setIsSaving(false); return }
      toast.success('Context updated')
      router.refresh()
    }
    setIsSaving(false)
  }

  async function handleParse() {
    if (!selectedId) {
      toast.error('Save context first before parsing')
      return
    }
    setIsParsing(true)
    const result = await parseContextAction(selectedId)
    if (result.error) {
      toast.error(result.error)
    } else {
      setExtracted(result.extracted ?? null)
      toast.success('Context parsed and structured')
      router.refresh()
    }
    setIsParsing(false)
  }

  async function handleDelete(id: string) {
    startTransition(async () => {
      const result = await deleteContextAction(id)
      if (result.error) { toast.error(result.error); return }
      setContextList(prev => prev.filter(c => c.id !== id))
      if (selectedId === id) {
        setSelectedId(null)
        setTitle(''); setRawText(''); setExtracted(null); setMessages([])
        setIsNew(true)
      }
      router.refresh()
    })
  }

  async function handleChat(e: React.FormEvent) {
    e.preventDefault()
    if (!chatInput.trim() || isStreaming) return
    if (!selectedId) { toast.error('Select or save a context first'); return }

    const userMsg: Message = { role: 'user', content: chatInput }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setChatInput('')
    setIsStreaming(true)

    await saveMessageAction(selectedId, 'user', chatInput)

    let assistantText = ''
    const assistantMsg: Message = { role: 'assistant', content: '' }
    setMessages(prev => [...prev, assistantMsg])

    try {
      const res = await fetch('/api/context/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contextId: selectedId,
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
        }),
      })

      const reader = res.body!.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        assistantText += decoder.decode(value)
        setMessages(prev => {
          const updated = [...prev]
          updated[updated.length - 1] = { role: 'assistant', content: assistantText }
          return updated
        })
      }

      // Check for action block
      const actionBlock = extractActionBlock(assistantText)
      if (actionBlock) {
        await executeAction(actionBlock.action, actionBlock.data)
      }

      await saveMessageAction(selectedId, 'assistant', assistantText)
    } catch {
      toast.error('Chat error — check your API key')
    }

    setIsStreaming(false)
  }

  async function executeAction(action: string, data: Record<string, unknown>) {
    const fd = new FormData()

    if (action === 'create_client') {
      Object.entries(data).forEach(([k, v]) => fd.set(k, String(v ?? '')))
      const result = await createClientAction(fd)
      if (result.error) toast.error(`Client error: ${result.error}`)
      else { toast.success('Client created!'); router.push(`/clients/${result.id}`) }
    } else if (action === 'create_project') {
      Object.entries(data).forEach(([k, v]) => fd.set(k, String(v ?? '')))
      // client_id needs to be set manually if blank
      const result = await createProjectAction(fd)
      if ('id' in result) { toast.success('Project created!'); router.push(`/projects/${result.id}`) }
    } else if (action === 'create_proposal') {
      Object.entries(data).forEach(([k, v]) => fd.set(k, String(v ?? '')))
      toast.success('Proposal data extracted — redirecting to new proposal')
      router.push('/proposals/new')
    }
  }

  const QUICK_COMMANDS = [
    'Summarise this brief',
    'Create a client from this',
    'Create a project from this',
    'List all deliverables',
    'What are the key deadlines?',
    'Draft a proposal outline',
  ]

  return (
    <div className="flex h-screen" style={{ background: '#f0f4ff' }}>

      {/* LEFT — context list */}
      <div className="w-64 shrink-0 flex flex-col border-r border-slate-200 bg-white">
        <div className="px-4 py-5 border-b border-slate-100">
          <div className="flex items-center gap-2 mb-4">
            <BrainCircuit className="w-4 h-4 text-[#054F99]" />
            <h1 className="text-[13px] font-bold text-slate-800" style={{ fontFamily: 'var(--font-poppins)' }}>
              Context Hub
            </h1>
          </div>
          <button
            onClick={startNew}
            className="w-full flex items-center justify-center gap-1.5 h-8 rounded-lg text-[12px] font-medium text-white transition-all hover:opacity-90"
            style={{ background: '#054F99' }}
          >
            <Plus className="w-3.5 h-3.5" />
            New Context
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-2">
          {contextList.length === 0 && (
            <p className="px-4 py-6 text-[12px] text-slate-400 text-center">No contexts yet.<br />Create one to get started.</p>
          )}
          {contextList.map(ctx => (
            <div
              key={ctx.id}
              onClick={() => setSelectedId(ctx.id)}
              className={`group flex items-center justify-between px-4 py-2.5 cursor-pointer transition-all ${selectedId === ctx.id ? 'bg-blue-50' : 'hover:bg-slate-50'}`}
            >
              <div className="min-w-0">
                <p className={`text-[13px] font-medium truncate ${selectedId === ctx.id ? 'text-[#054F99]' : 'text-slate-700'}`}>
                  {ctx.title}
                </p>
                <p className="text-[11px] text-slate-400">
                  {new Date(ctx.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                </p>
              </div>
              <div className="flex items-center gap-1 shrink-0 ml-2">
                {ctx.extracted && <span className="w-1.5 h-1.5 rounded-full bg-blue-400" title="Parsed" />}
                <button
                  onClick={e => { e.stopPropagation(); handleDelete(ctx.id) }}
                  className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-400 transition-all"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MIDDLE — raw context + extracted */}
      <div className="flex-1 flex flex-col min-w-0 border-r border-slate-200 overflow-y-auto">
        <div className="p-6 flex flex-col gap-4 h-full">
          {/* Title */}
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Context title…"
            className="w-full text-lg font-bold text-slate-800 bg-transparent border-none outline-none placeholder:text-slate-300"
            style={{ fontFamily: 'var(--font-poppins)' }}
          />

          {/* Raw text */}
          <textarea
            ref={textareaRef}
            value={rawText}
            onChange={e => setRawText(e.target.value)}
            placeholder="Paste your raw context here — discovery call notes, brief, emails, planning docs, anything…"
            className="flex-1 w-full min-h-[280px] resize-none rounded-xl border border-slate-200 bg-white p-4 text-[14px] text-slate-700 leading-relaxed placeholder:text-slate-300 outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-50 transition-all"
          />

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button
              onClick={handleSave}
              disabled={isSaving || !rawText.trim()}
              className="h-8 text-xs font-medium text-white"
              style={{ background: '#054F99' }}
            >
              {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Save'}
            </Button>
            <Button
              onClick={handleParse}
              disabled={isParsing || !selectedId}
              variant="outline"
              className="h-8 text-xs font-medium border-slate-200 text-slate-600 hover:bg-blue-50 hover:text-[#054F99] hover:border-blue-200 gap-1.5"
            >
              {isParsing
                ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Parsing…</>
                : <><Sparkles className="w-3.5 h-3.5" /> Parse & Extract</>
              }
            </Button>
            {!selectedId && !isNew && (
              <p className="text-[11px] text-slate-400">Save first to enable parsing</p>
            )}
          </div>

          {/* Extracted cards */}
          {extracted && Object.keys(extracted).length > 0 && (
            <div className="mt-2">
              <ExtractedCard extracted={extracted} />
            </div>
          )}
        </div>
      </div>

      {/* RIGHT — AI command panel */}
      <div className="w-96 shrink-0 flex flex-col bg-white">
        <div className="px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-[#054F99]" />
            <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">AI Operator</p>
          </div>
          {!selectedId && (
            <p className="text-[12px] text-slate-400 mt-1">Select or save a context to start chatting</p>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
          {messages.length === 0 && selectedId && (
            <div className="flex flex-col gap-2 mt-2">
              <p className="text-[11px] text-slate-400 mb-1">Quick commands:</p>
              {QUICK_COMMANDS.map(cmd => (
                <button
                  key={cmd}
                  onClick={() => setChatInput(cmd)}
                  className="flex items-center gap-2 text-left px-3 py-2 rounded-lg border border-slate-100 hover:border-blue-200 hover:bg-blue-50 transition-all group"
                >
                  <ChevronRight className="w-3 h-3 text-slate-300 group-hover:text-[#054F99] shrink-0" />
                  <span className="text-[13px] text-slate-600 group-hover:text-[#054F99]">{cmd}</span>
                </button>
              ))}
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[85%] rounded-xl px-4 py-3 text-[13px] leading-relaxed whitespace-pre-wrap ${
                  msg.role === 'user'
                    ? 'text-white'
                    : 'text-slate-700 border border-slate-100'
                }`}
                style={{
                  background: msg.role === 'user' ? '#054F99' : '#eff6ff',
                }}
              >
                {msg.role === 'assistant' ? stripActionBlock(msg.content) : msg.content}
                {msg.role === 'assistant' && extractActionBlock(msg.content) && (
                  <div className="mt-2 pt-2 border-t border-blue-200">
                    <span className="text-[11px] font-medium text-blue-500">
                      ✓ Action queued: {extractActionBlock(msg.content)?.action.replace('_', ' ')}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isStreaming && messages[messages.length - 1]?.content === '' && (
            <div className="flex justify-start">
              <div className="bg-blue-50 border border-slate-100 rounded-xl px-4 py-3">
                <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleChat} className="px-4 py-4 border-t border-slate-100">
          <div className="flex items-end gap-2">
            <textarea
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleChat(e as unknown as React.FormEvent) } }}
              placeholder={selectedId ? 'Type a command…' : 'Select a context first…'}
              disabled={!selectedId || isStreaming}
              rows={2}
              className="flex-1 resize-none rounded-xl border border-slate-200 px-3 py-2.5 text-[13px] text-slate-700 placeholder:text-slate-300 outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-50 transition-all disabled:opacity-40"
            />
            <button
              type="submit"
              disabled={!chatInput.trim() || isStreaming || !selectedId}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white transition-all hover:opacity-90 disabled:opacity-30 shrink-0"
              style={{ background: '#054F99' }}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
