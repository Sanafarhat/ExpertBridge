import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import Link from 'next/link'
import { Search, Filter, Eye } from 'lucide-react'

export default async function VerificationQueuePage() {
  const session = await getServerSession(authOptions)

  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/dashboard')
  }

  // Fetch verifications that are not in DRAFT
  const verifications = await prisma.verification.findMany({
    where: {
      status: { not: 'DRAFT' }
    },
    include: {
      expert: {
        include: {
          user: true,
          expertTags: {
            include: { tag: true }
          }
        }
      },
      documents: true
    },
    orderBy: { submittedAt: 'asc' }
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Verification Queue</h1>
          <p className="text-slate-500 mt-1">Review and process expert applications.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search experts..." 
              className="pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none w-64"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50">
            <Filter className="w-4 h-4" /> Filter
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 font-medium">Expert</th>
              <th className="px-6 py-4 font-medium">Primary Domain</th>
              <th className="px-6 py-4 font-medium">Submitted Date</th>
              <th className="px-6 py-4 font-medium">Docs</th>
              <th className="px-6 py-4 font-medium">Stage</th>
              <th className="px-6 py-4 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {verifications.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                  No pending verifications in the queue.
                </td>
              </tr>
            ) : verifications.map((v) => (
              <tr key={v.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-medium text-slate-900">{v.expert.fullName}</div>
                  <div className="text-slate-500 text-xs">{v.expert.designation} at {v.expert.organization}</div>
                </td>
                <td className="px-6 py-4 text-slate-600">
                  {v.expert.expertTags[0]?.tag.name || 'Not specified'}
                </td>
                <td className="px-6 py-4 text-slate-600">
                  {v.submittedAt.toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full text-xs font-medium">
                    {v.documents.length}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                    v.status === 'VERIFIED' ? 'bg-green-100 text-green-700' :
                    v.status === 'SUBMITTED' ? 'bg-blue-100 text-blue-700' :
                    v.status === 'UNDER_REVIEW' ? 'bg-amber-100 text-amber-700' :
                    v.status === 'NEEDS_MORE_INFORMATION' ? 'bg-red-100 text-red-700' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                    {v.status.replace(/_/g, ' ')}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <Link 
                    href={`/dashboard/verification-queue/${v.id}`}
                    className="inline-flex items-center justify-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors font-medium text-xs"
                  >
                    <Eye className="w-3.5 h-3.5" /> Review
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
