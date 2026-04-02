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
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

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
    <aside className="flex flex-col w-48 min-h-screen shrink-0 bg-white border-r border-[#d0d7d0]">
      {/* Logo */}
      <div className="flex items-center px-4 py-4 border-b border-[#d0d7d0]">
        <Image
          src="/creativewave-square_blue copy 2.png"
          alt="Creative Wave"
          width={120}
          height={47}
          priority
        />
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-5 px-3 py-5 flex-1">
        {navSections.map((section, si) => (
          <div key={si} className="flex flex-col gap-0.5">
            {section.label && (
              <p className="px-2 mb-1.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-[#5A5A5A]">
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
                    'flex items-center gap-2.5 px-2 py-1.5 rounded text-[13px] font-medium transition-all duration-150',
                    active
                      ? 'text-[#054F99]'
                      : 'text-[#5A5A5A] hover:text-[#1E1E1E] hover:bg-[#E7ECE7]'
                  )}
                  style={active ? { background: 'rgba(5, 79, 153, 0.07)' } : {}}
                >
                  <Icon
                    className="w-[15px] h-[15px] shrink-0 transition-colors"
                    style={{ color: active ? '#054F99' : undefined }}
                  />
                  {label}
                </Link>
              )
            })}
          </div>
        ))}
      </nav>

      {/* Sign out */}
      <div className="px-3 pb-5 border-t border-[#d0d7d0] pt-3">
        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-2.5 px-2 py-1.5 rounded text-[13px] font-medium text-[#5A5A5A] hover:text-[#1E1E1E] hover:bg-[#E7ECE7] transition-all"
        >
          <LogOut className="w-[15px] h-[15px] shrink-0" />
          Sign out
        </button>
      </div>
    </aside>
  )
}
