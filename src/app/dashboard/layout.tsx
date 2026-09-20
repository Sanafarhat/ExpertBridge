import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ShieldCheck, LogOut } from 'lucide-react'
import NotificationBell from '@/components/layout/notification-bell'
import SidebarNav from '@/components/layout/sidebar-nav'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect('/login')
  }

  const role = session.user.role as string

  return (
    <div className="min-h-screen bg-[#FAFAFC] flex flex-col">
      <header className="sticky top-0 z-40 bg-primary text-white border-b border-primary">
        <div className="flex h-16 items-center px-4 md:px-6 justify-between">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
              <ShieldCheck className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">ExpertBridge</span>
          </Link>

          <div className="flex items-center gap-4">
             <NotificationBell />
              <div className="hidden md:flex text-sm text-slate-300">
               {session.user.name} <span className="mx-2 opacity-50">|</span> <span className="font-semibold text-accent">{role}</span>
             </div>
             <Link href="/api/auth/signout" className="flex items-center gap-2 text-sm text-slate-300 hover:text-white transition-colors">
               <LogOut className="h-4 w-4" />
               <span className="hidden md:inline">Sign Out</span>
             </Link>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 hidden md:flex flex-col border-r border-[#E7E6EF] bg-white">
           <SidebarNav role={role} />
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
           {children}
        </main>
      </div>
    </div>
  )
}
