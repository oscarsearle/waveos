import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Sidebar } from '@/components/layout/Sidebar'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="flex min-h-screen" style={{ background: 'linear-gradient(135deg, #05080f 0%, #061428 40%, #0a2550 100%)' }}>
      <Sidebar />
      <main className="flex-1 overflow-auto" style={{ background: 'transparent' }}>
        {children}
      </main>
    </div>
  )
}
