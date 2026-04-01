'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  Gauge,
  Users,
  FolderOpen,
  FileText,
  ScrollText,
  DollarSign,
  MessageSquareQuote,
  LogOut,
  Waves,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const navSections = [
  {
    label: null,
    items: [
      { href: '/dashboard', label: 'Control Room', icon: Gauge },
    ],
  },
  {
    label: 'Work',
    items: [
      { href: '/clients', label: 'Clients', icon: Users },
      { href: '/projects', label: 'Projects', icon: FolderOpen },
    ],
  },
  {
    label: 'Business',
    items: [
      { href: '/proposals', label: 'Proposals', icon: FileText },
      { href: '/agreements', label: 'Agreements', icon: ScrollText },
      { href: '/invoices', label: 'Financials', icon: DollarSign },
    ],
  },
  {
    label: 'Content',
    items: [
      { href: '/testimonials', label: 'Testimonials', icon: MessageSquareQuote },
    ],
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <aside className="flex flex-col w-52 min-h-screen shrink-0 bg-[#070707] border-r border-white/[0.055]">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 py-[18px] border-b border-white/[0.055]">
        <div className="flex items-center justify-center w-6 h-6 rounded bg-white/[0.08]">
          <Waves className="w-3.5 h-3.5 text-white" />
        </div>
        <div>
          <p className="text-[13px] font-semibold tracking-tight text-white leading-none">WaveOS</p>
          <p className="text-[10px] text-zinc-600 leading-none mt-0.5 tracking-wide">Creative Wave Media</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-4 px-2 py-4 flex-1">
        {navSections.map((section, si) => (
          <div key={si} className="flex flex-col gap-0.5">
            {section.label && (
              <p className="px-3 mb-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-zinc-600">
                {section.label}
              </p>
            )}
            {section.items.map(({ href, label, icon: Icon }) => {
              const active = pathname === href || pathname.startsWith(href + '/')
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    'group flex items-center gap-2.5 px-3 py-[7px] rounded-md text-[13px] font-medium transition-all duration-150',
                    active
                      ? 'bg-white/[0.07] text-white'
                      : 'text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.04]'
                  )}
                >
                  <Icon
                    className={cn(
                      'w-[15px] h-[15px] shrink-0 transition-colors',
                      active ? 'text-brand' : 'text-zinc-600 group-hover:text-zinc-400'
                    )}
                  />
                  {label}
                  {active && (
                    <span className="ml-auto w-1 h-1 rounded-full bg-brand" />
                  )}
                </Link>
              )
            })}
          </div>
        ))}
      </nav>

      {/* Sign out */}
      <div className="px-2 pb-4 border-t border-white/[0.055] pt-3">
        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-2.5 px-3 py-[7px] rounded-md text-[13px] font-medium text-zinc-600 hover:text-zinc-300 hover:bg-white/[0.04] transition-all"
        >
          <LogOut className="w-[15px] h-[15px] shrink-0" />
          Sign out
        </button>
      </div>
    </aside>
  )
}
