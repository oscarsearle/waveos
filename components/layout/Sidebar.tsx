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
    <aside className="flex flex-col w-52 min-h-screen shrink-0 bg-white border-r border-gray-200">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 py-[18px] border-b border-gray-200">
        <div className="flex items-center justify-center w-6 h-6 rounded" style={{ background: '#054F99' }}>
          <Waves className="w-3.5 h-3.5 text-white" />
        </div>
        <div>
          <p className="text-[13px] font-semibold tracking-tight text-gray-900 leading-none">WaveOS</p>
          <p className="text-[10px] leading-none mt-0.5 tracking-wide font-medium" style={{ color: '#054F99' }}>Creative Wave</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-4 px-2 py-4 flex-1">
        {navSections.map((section, si) => (
          <div key={si} className="flex flex-col gap-0.5">
            {section.label && (
              <p className="px-3 mb-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-gray-400">
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
                      ? 'text-gray-900'
                      : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100'
                  )}
                  style={active ? { background: '#EEF4FF' } : {}}
                >
                  <Icon
                    className={cn(
                      'w-[15px] h-[15px] shrink-0 transition-colors',
                      active ? '' : 'text-gray-400 group-hover:text-gray-600'
                    )}
                    style={active ? { color: '#054F99' } : {}}
                  />
                  {label}
                  {active && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full" style={{ background: '#00B7FF' }} />
                  )}
                </Link>
              )
            })}
          </div>
        ))}
      </nav>

      {/* Sign out */}
      <div className="px-2 pb-4 border-t border-gray-200 pt-3">
        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-2.5 px-3 py-[7px] rounded-md text-[13px] font-medium text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all"
        >
          <LogOut className="w-[15px] h-[15px] shrink-0" />
          Sign out
        </button>
      </div>
    </aside>
  )
}
