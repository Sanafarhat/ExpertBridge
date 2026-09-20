'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, FileText, Sparkles, Handshake, ShieldCheck, Users, ClipboardList, UserCircle } from 'lucide-react'

export default function SidebarNav({ role }: { role: string }) {
  const pathname = usePathname()

  const isActive = (path: string) => {
    if (path === '/dashboard' && pathname === '/dashboard') return true
    if (path !== '/dashboard' && pathname.startsWith(path)) return true
    return false
  }

  const getLinkClasses = (path: string) => {
    return isActive(path)
      ? "flex items-center gap-3 px-3 py-2 rounded-md bg-[#F2EEFF] text-[#6046D8] font-medium text-sm transition-colors"
      : "flex items-center gap-3 px-3 py-2 rounded-md text-[#666778] hover:bg-slate-100 hover:text-[#171942] font-medium text-sm transition-colors"
  }

  return (
    <nav className="flex-1 space-y-1 p-4">
      <Link href="/dashboard" className={getLinkClasses('/dashboard')}>
         <LayoutDashboard className="w-4 h-4" /> Dashboard
      </Link>
      
      {role === 'EXPERT' && (
        <>
          <Link href="/dashboard/profile" className={getLinkClasses('/dashboard/profile')}>
             <UserCircle className="w-4 h-4" /> Professional Profile
          </Link>
          <Link href="/dashboard/verification" className={getLinkClasses('/dashboard/verification')}>
             <ShieldCheck className="w-4 h-4" /> Verification Status
          </Link>
          <Link href="/dashboard/engagements" className={getLinkClasses('/dashboard/engagements')}>
             <Handshake className="w-4 h-4" /> Engagement Requests
          </Link>
        </>
      )}
      
      {role === 'INSTITUTION' && (
        <>
          <Link href="/dashboard/requirements" className={getLinkClasses('/dashboard/requirements')}>
             <FileText className="w-4 h-4" /> My Requirements
          </Link>
          <Link href="/dashboard/requirements" className={getLinkClasses('/dashboard/recommendations')}>
             <Sparkles className="w-4 h-4" /> Recommendations
          </Link>
          <Link href="/dashboard/engagements" className={getLinkClasses('/dashboard/engagements')}>
             <Handshake className="w-4 h-4" /> Engagements
          </Link>
        </>
      )}
      
      {role === 'ADMIN' && (
        <>
          <Link href="/dashboard/verification-queue" className={getLinkClasses('/dashboard/verification-queue')}>
             <ClipboardList className="w-4 h-4" /> Verification Queue
          </Link>
          <Link href="/dashboard/institutions" className={getLinkClasses('/dashboard/institutions')}>
             <Users className="w-4 h-4" /> Institutions
          </Link>
          <Link href="/dashboard/audit" className={getLinkClasses('/dashboard/audit')}>
             <ShieldCheck className="w-4 h-4" /> Audit Logs
          </Link>
        </>
      )}
    </nav>
  )
}
