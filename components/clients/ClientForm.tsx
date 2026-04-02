'use client'

import { useTransition } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { PIPELINE_STAGES, PROJECT_TYPES } from '@/lib/constants'
import type { Client } from '@/lib/types'
import { toast } from 'sonner'

type Props = {
  client?: Client
  action: (formData: FormData) => Promise<void>
  submitLabel?: string
}

export function ClientForm({ client, action, submitLabel = 'Save Client' }: Props) {
  const [isPending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    startTransition(async () => {
      try {
        await action(formData)
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Something went wrong')
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="text-sm font-semibold text-gray-900 mb-5">Contact</h2>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Full Name" name="name" defaultValue={client?.name} required />
          <Field label="Brand / Business Name" name="brand_name" defaultValue={client?.brand_name ?? ''} />
          <Field label="Email" name="email" type="email" defaultValue={client?.email ?? ''} />
          <Field label="Phone" name="phone" defaultValue={client?.phone ?? ''} />
          <Field label="Instagram" name="instagram" defaultValue={client?.instagram ?? ''} placeholder="@handle" />
        </div>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="text-sm font-semibold text-gray-900 mb-5">Project</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-gray-400 font-medium">Project Type</Label>
            <Select name="project_type" defaultValue={client?.project_type ?? ''}>
              <SelectTrigger className="bg-gray-50 border-gray-200 text-gray-900 h-9 text-sm">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-200">
                {PROJECT_TYPES.map((t) => (
                  <SelectItem key={t} value={t} className="text-gray-700 focus:bg-gray-50 focus:text-gray-900">
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-gray-400 font-medium">Pipeline Status</Label>
            <Select name="status" defaultValue={client?.status ?? 'Lead'}>
              <SelectTrigger className="bg-gray-50 border-gray-200 text-gray-900 h-9 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-200">
                {PIPELINE_STAGES.map((s) => (
                  <SelectItem key={s} value={s} className="text-gray-700 focus:bg-gray-50 focus:text-gray-900">
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Field
            label="Project Value (£)"
            name="project_value"
            type="number"
            defaultValue={client?.project_value?.toString() ?? ''}
            placeholder="e.g. 2500"
          />
          <Field
            label="Portal Slug"
            name="portal_slug"
            defaultValue={client?.portal_slug ?? ''}
            placeholder="brand-name (auto-generated)"
          />
        </div>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="text-sm font-semibold text-gray-900 mb-5">Notes</h2>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-gray-400 font-medium">Next Action</Label>
            <Input
              name="next_action"
              defaultValue={client?.next_action ?? ''}
              placeholder="e.g. Send proposal by Friday"
              className="bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-300 h-9 text-sm"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-gray-400 font-medium">Notes</Label>
            <Textarea
              name="notes"
              defaultValue={client?.notes ?? ''}
              rows={4}
              placeholder="Internal notes about this client…"
              className="bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-300 text-sm resize-none"
            />
          </div>
        </div>
      </section>

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={isPending}
          className="font-medium h-9 px-5 text-sm text-white"
          style={{ background: '#054F99' }}
        >
          {isPending ? 'Saving…' : submitLabel}
        </Button>
      </div>
    </form>
  )
}

function Field({
  label,
  name,
  type = 'text',
  defaultValue,
  placeholder,
  required,
}: {
  label: string
  name: string
  type?: string
  defaultValue?: string
  placeholder?: string
  required?: boolean
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label className="text-xs text-gray-400 font-medium">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </Label>
      <Input
        name={name}
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        required={required}
        className="bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-300 h-9 text-sm"
      />
    </div>
  )
}
