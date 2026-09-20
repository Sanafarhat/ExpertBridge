'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function SidebarNav({ role }: { role: string }) {
  const pathname = usePathname()

  const isActive = (path: string) => {
    if (path === '/dashboard' && pathname !== '/dashboard') return false
    return pathname.startsWith(path)
  }

  const getLinkClasses = (path: string) => {
    return isActive(path)
      ? "flex items-center gap-3 px-3 py-2 rounded-md bg-blue-50 text-blue-700 font-medium text-sm transition-colors"
      : "flex items-center gap-3 px-3 py-2 rounded-md text-slate-700 hover:bg-slate-100 font-medium text-sm transition-colors"
  }

  return (
    <nav className="flex-1 space-y-1 p-4">
      <Link href="/dashboard" className={getLinkClasses('/dashboard')}>
         Dashboard Overview
      </Link>
      
      {role === 'EXPERT' && (
        <>
          <Link href="/dashboard/profile" className={getLinkClasses('/dashboard/profile')}>
             Professional Profile
          </Link>
          <Link href="/dashboard/verification" className={getLinkClasses('/dashboard/verification')}>
             Verification Status
          </Link>
          <Link href="/dashboard/engagements" className={getLinkClasses('/dashboard/engagements')}>
             Engagement Requests
          </Link>
        </>
      )}
      
      {role === 'INSTITUTION' && (
        <>
          <Link href="/discovery" className={getLinkClasses('/discovery')}>
             Find Experts
          </Link>
          <Link href="/dashboard/requirements" className={getLinkClasses('/dashboard/requirements')}>
             My Requirements
          </Link>
          <Link href="/dashboard/engagements" className={getLinkClasses('/dashboard/engagements')}>
             Confirmed Engagements
          </Link>
        </>
      )}
      
      {role === 'ADMIN' && (
        <>
          <Link href="/dashboard/verification-queue" className={getLinkClasses('/dashboard/verification-queue')}>
             Verification Queue
          </Link>
          <Link href="/dashboard/institutions" className={getLinkClasses('/dashboard/institutions')}>
             Institutions
          </Link>
          <Link href="/dashboard/audit" className={getLinkClasses('/dashboard/audit')}>
             Audit Logs
          </Link>
        </>
      )}
    </nav>
  )
}
