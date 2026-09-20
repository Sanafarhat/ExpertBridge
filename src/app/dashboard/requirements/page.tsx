import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import Link from 'next/link'
import { Plus } from 'lucide-react'

export default async function RequirementsPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user || session.user.role !== 'INSTITUTION') {
    redirect('/dashboard')
  }

  const institution = await prisma.institution.findUnique({
    where: { userId: session.user.id },
    include: {
      requirements: {
        orderBy: { createdAt: 'desc' }
      }
    }
  })

  if (!institution) return <div>Institution not found</div>

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Requirements</h1>
          <p className="text-slate-500 mt-1">Manage your posted requirements and find matching experts.</p>
        </div>
        <Link 
          href="/dashboard/requirements/new" 
          className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md font-medium text-sm hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" /> Post New Requirement
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-0">
           <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-500 border-b">
                 <tr>
                    <th className="px-6 py-4 font-medium">Domain / Topic</th>
                    <th className="px-6 py-4 font-medium">Program Type</th>
                    <th className="px-6 py-4 font-medium">Date</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                 {institution.requirements.length === 0 ? (
                    <tr>
                       <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                         You haven&apos;t posted any requirements yet.<br/>
                         <Link href="/dashboard/requirements/new" className="text-blue-600 hover:underline mt-2 inline-block">Post your first requirement</Link>
                       </td>
                    </tr>
                 ) : institution.requirements.map(req => (
                   <tr key={req.id} className="hover:bg-slate-50/50">
                      <td className="px-6 py-4 font-medium text-slate-900">{req.domain}</td>
                      <td className="px-6 py-4 text-slate-600">{req.programType}</td>
                      <td className="px-6 py-4 text-slate-600">{req.preferredDate ? new Date(req.preferredDate).toLocaleDateString() : 'Flexible'}</td>
                      <td className="px-6 py-4">
                         <span className="bg-blue-50 text-blue-700 border border-blue-200 px-2 py-1 rounded text-xs font-semibold">
                           {req.status}
                         </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                         <Link 
                           href={`/dashboard/requirements/${req.id}/matches`} 
                           className="text-blue-600 hover:text-blue-700 font-medium hover:underline text-sm"
                         >
                           View Matches
                         </Link>
                      </td>
                   </tr>
                 ))}
              </tbody>
           </table>
        </div>
      </div>
    </div>
  )
}
