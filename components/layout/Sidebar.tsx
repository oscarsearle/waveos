'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  Gauge,
  Users,
  FolderOpen,
  Globe,
  FileText,
  ScrollText,
  DollarSign,
  MessageSquareQuote,
  Settings,
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
      { href: '/portals', label: 'Portals', icon: Globe },
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
  {
    label: null,
    items: [
      { href: '/settings', label: 'Settings', icon: Settings },
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
    <aside className="flex flex-col w-48 min-h-screen shrink-0 border-r" style={{ background: '#060a12', borderColor: '#162035' }}>
      {/* Logo */}
      <div className="flex items-center px-4 py-4 border-b" style={{ borderColor: '#162035' }}>
        <Image
          src="/creativewave-logo-blue.png"
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
              <p className="px-2 mb-1.5 text-[9px] font-semibold uppercase tracking-[0.12em]" style={{ color: '#2d4060' }}>
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
                      ? 'text-[#00B7FF]'
                      : 'text-white/40 hover:text-white/80 hover:bg-white/[0.04]'
                  )}
                  style={active ? { background: 'rgba(0,183,255,0.08)', fontFamily: 'var(--font-poppins)' } : { fontFamily: 'var(--font-poppins)' }}
                >
                  <Icon
                    className="w-[15px] h-[15px] shrink-0 transition-colors"
                    style={{ color: active ? '#00B7FF' : undefined }}
                  />
                  {label}
                </Link>
              )
            })}
          </div>
        ))}
      </nav>

      {/* Sign out */}
      <div className="px-3 pb-5 pt-3 border-t" style={{ borderColor: '#162035' }}>
        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-2.5 px-2 py-1.5 rounded text-[13px] font-medium text-white/30 hover:text-white/70 hover:bg-white/[0.04] transition-all"
          style={{ fontFamily: 'var(--font-poppins)' }}
        >
          <LogOut className="w-[15px] h-[15px] shrink-0" />
          Sign out
        </button>
      </div>
    </aside>
  )
}
