import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect('/login')
  }

  const role = session.user.role as string

  if (role === 'EXPERT') {
    const profile = await prisma.expertProfile.findUnique({
      where: { userId: session.user.id },
      include: {
        engagements: true,
        engagementRequests: true,
      }
    })

    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-slate-900">Good morning, {session.user.name}</h1>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-medium text-slate-500">Verification Status</h3>
            <p className="text-2xl font-bold text-blue-600 mt-2">{profile?.verificationStatus || 'DRAFT'}</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-medium text-slate-500">Pending Requests</h3>
            <p className="text-2xl font-bold text-slate-900 mt-2">{profile?.engagementRequests?.length || 0}</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-medium text-slate-500">Verified Engagements</h3>
            <p className="text-2xl font-bold text-slate-900 mt-2">{profile?.engagements?.length || 0}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-200">
            <h3 className="font-semibold text-slate-900">Recent Engagement Requests</h3>
          </div>
          <div className="p-6 text-center text-slate-500">
            No new engagement requests found.
          </div>
        </div>
      </div>
    )
  }

  if (role === 'INSTITUTION') {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-slate-900">Good morning, {session.user.name}</h1>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-medium text-slate-500">Active Requests</h3>
            <p className="text-2xl font-bold text-slate-900 mt-2">1</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-medium text-slate-500">Confirmed Engagements</h3>
            <p className="text-2xl font-bold text-green-600 mt-2">0</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-medium text-slate-500">Saved Experts</h3>
            <p className="text-2xl font-bold text-slate-900 mt-2">3</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-200 flex justify-between items-center">
            <h3 className="font-semibold text-slate-900">Recent Requirements</h3>
            <a href="/dashboard/requirements/new" className="text-sm text-blue-600 font-medium hover:underline">Post New Requirement</a>
          </div>
          <div className="p-0">
             <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-500 border-b">
                   <tr>
                      <th className="px-6 py-3 font-medium">Requirement</th>
                      <th className="px-6 py-3 font-medium">Date</th>
                      <th className="px-6 py-3 font-medium">Status</th>
                      <th className="px-6 py-3 font-medium">Action</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                   <tr>
                      <td className="px-6 py-4 font-medium text-slate-900">Entrepreneurship and Startup Mentoring</td>
                      <td className="px-6 py-4 text-slate-500">Oct 15, 2026</td>
                      <td className="px-6 py-4"><span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-medium">SUBMITTED</span></td>
                      <td className="px-6 py-4"><a href="/discovery" className="text-blue-600 hover:underline">Find Experts</a></td>
                   </tr>
                </tbody>
             </table>
          </div>
        </div>
      </div>
    )
  }

  if (role === 'ADMIN') {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-slate-900">Admin Console</h1>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-medium text-slate-500">Pending Verification</h3>
            <p className="text-2xl font-bold text-amber-600 mt-2">2</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-medium text-slate-500">Under Review</h3>
            <p className="text-2xl font-bold text-blue-600 mt-2">1</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-medium text-slate-500">Verified Experts</h3>
            <p className="text-2xl font-bold text-green-600 mt-2">14</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-medium text-slate-500">Reference Checks</h3>
            <p className="text-2xl font-bold text-slate-900 mt-2">3</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-200">
            <h3 className="font-semibold text-slate-900">Verification Queue</h3>
          </div>
          <div className="p-0">
             <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-500 border-b">
                   <tr>
                      <th className="px-6 py-3 font-medium">Expert</th>
                      <th className="px-6 py-3 font-medium">Domain</th>
                      <th className="px-6 py-3 font-medium">Submitted</th>
                      <th className="px-6 py-3 font-medium">Stage</th>
                      <th className="px-6 py-3 font-medium">Action</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                   <tr>
                      <td className="px-6 py-4 font-medium text-slate-900">Dr. Ananya Rao</td>
                      <td className="px-6 py-4 text-slate-500">Technology Strategy</td>
                      <td className="px-6 py-4 text-slate-500">Aug 20, 2026</td>
                      <td className="px-6 py-4"><span className="bg-green-50 text-green-700 px-2 py-1 rounded text-xs font-medium">VERIFIED</span></td>
                      <td className="px-6 py-4"><a href="#" className="text-slate-400 hover:text-slate-600">View</a></td>
                   </tr>
                </tbody>
             </table>
          </div>
        </div>
      </div>
    )
  }

  return <div>Unknown role</div>
}
