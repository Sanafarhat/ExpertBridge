import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import EngagementActions from '@/components/dashboard/expert/engagement-actions'

export default async function EngagementsPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user || session.user.role === 'ADMIN') {
    redirect('/dashboard')
  }

  const role = session.user.role

  if (role === 'EXPERT') {
    const profile = await prisma.expertProfile.findUnique({
      where: { userId: session.user.id },
      include: {
        engagementRequests: {
          include: {
            institution: true,
            requirement: true
          },
          orderBy: { requestedAt: 'desc' }
        },
        confirmedEngagements: {
          include: {
            institution: true,
            requirement: true
          },
          orderBy: { confirmedAt: 'desc' }
        }
      }
    })

    if (!profile) return <div>Profile not found</div>

    const pendingRequests = profile.engagementRequests.filter(r => r.status === 'PENDING')
    // const historicalRequests = profile.engagementRequests.filter(r => r.status !== 'PENDING')

    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Engagement Requests</h1>
          <p className="text-slate-500 mt-1">Manage your incoming requests and confirmed engagements.</p>
        </div>

        {/* Pending Requests */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-200 bg-slate-50">
            <h2 className="font-semibold text-slate-900">Pending Requests ({pendingRequests.length})</h2>
          </div>
          <div className="p-6 space-y-4">
            {pendingRequests.length === 0 ? (
              <p className="text-slate-500 text-center py-4">No pending requests.</p>
            ) : (
              pendingRequests.map(req => (
                <div key={req.id} className="border border-slate-200 rounded-lg p-5 flex flex-col md:flex-row gap-6 justify-between items-start">
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg">{req.requirement.domain} • {req.requirement.programType}</h3>
                    <p className="text-slate-600 font-medium">{req.institution.name}</p>
                    <div className="mt-3 text-sm text-slate-600 space-y-1">
                      <p><strong>Date:</strong> {req.requirement.preferredDate ? new Date(req.requirement.preferredDate).toLocaleDateString() : 'Flexible'}</p>
                      <p><strong>Duration:</strong> {req.requirement.duration || 'Not specified'}</p>
                      <p><strong>Audience:</strong> {req.requirement.audience || 'Not specified'}</p>
                    </div>
                  </div>
                  <div className="shrink-0 w-full md:w-auto">
                    <EngagementActions requestId={req.id} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Confirmed Engagements */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-200 bg-slate-50">
            <h2 className="font-semibold text-slate-900">Confirmed Engagements ({profile.confirmedEngagements.length})</h2>
          </div>
          <div className="p-0">
             <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-500 border-b">
                   <tr>
                      <th className="px-6 py-3 font-medium">Program</th>
                      <th className="px-6 py-3 font-medium">Institution</th>
                      <th className="px-6 py-3 font-medium">Date</th>
                      <th className="px-6 py-3 font-medium">Status</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                   {profile.confirmedEngagements.length === 0 ? (
                      <tr>
                         <td colSpan={4} className="px-6 py-6 text-center text-slate-500">No confirmed engagements yet.</td>
                      </tr>
                   ) : profile.confirmedEngagements.map(eng => (
                     <tr key={eng.id}>
                        <td className="px-6 py-4 font-medium text-slate-900">{eng.requirement.domain}</td>
                        <td className="px-6 py-4 text-slate-600">{eng.institution.name}</td>
                        <td className="px-6 py-4 text-slate-600">{eng.requirement.preferredDate ? new Date(eng.requirement.preferredDate).toLocaleDateString() : 'TBD'}</td>
                        <td className="px-6 py-4">
                           <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-semibold">CONFIRMED</span>
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

  if (role === 'INSTITUTION') {
    const institution = await prisma.institution.findUnique({
      where: { userId: session.user.id },
      include: {
        engagements: {
          include: {
            expert: true,
            requirement: true
          },
          orderBy: { confirmedAt: 'desc' }
        },
        requests: {
          include: {
            expert: true,
            requirement: true
          },
          orderBy: { requestedAt: 'desc' }
        }
      }
    })

    if (!institution) return <div>Institution not found</div>

    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Engagements & Requests</h1>
          <p className="text-slate-500 mt-1">Track your requests and confirmed engagements with experts.</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-200 bg-slate-50">
            <h2 className="font-semibold text-slate-900">Confirmed Engagements</h2>
          </div>
          <div className="p-0">
             <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-500 border-b">
                   <tr>
                      <th className="px-6 py-3 font-medium">Program</th>
                      <th className="px-6 py-3 font-medium">Expert</th>
                      <th className="px-6 py-3 font-medium">Date</th>
                      <th className="px-6 py-3 font-medium">Status</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                   {institution.engagements.length === 0 ? (
                      <tr>
                         <td colSpan={4} className="px-6 py-6 text-center text-slate-500">No confirmed engagements yet.</td>
                      </tr>
                   ) : institution.engagements.map(eng => (
                     <tr key={eng.id}>
                        <td className="px-6 py-4 font-medium text-slate-900">{eng.requirement.domain}</td>
                        <td className="px-6 py-4 text-slate-600">{eng.expert.fullName}</td>
                        <td className="px-6 py-4 text-slate-600">{eng.requirement.preferredDate ? new Date(eng.requirement.preferredDate).toLocaleDateString() : 'TBD'}</td>
                        <td className="px-6 py-4">
                           <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-semibold">CONFIRMED</span>
                        </td>
                     </tr>
                   ))}
                </tbody>
             </table>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-200 bg-slate-50">
            <h2 className="font-semibold text-slate-900">Request History</h2>
          </div>
          <div className="p-0">
             <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-500 border-b">
                   <tr>
                      <th className="px-6 py-3 font-medium">Program</th>
                      <th className="px-6 py-3 font-medium">Expert</th>
                      <th className="px-6 py-3 font-medium">Requested</th>
                      <th className="px-6 py-3 font-medium">Status</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                   {institution.requests.length === 0 ? (
                      <tr>
                         <td colSpan={4} className="px-6 py-6 text-center text-slate-500">No requests sent.</td>
                      </tr>
                   ) : institution.requests.map(req => (
                     <tr key={req.id}>
                        <td className="px-6 py-4 font-medium text-slate-900">{req.requirement.domain}</td>
                        <td className="px-6 py-4 text-slate-600">{req.expert.fullName}</td>
                        <td className="px-6 py-4 text-slate-600">{req.requestedAt.toLocaleDateString()}</td>
                        <td className="px-6 py-4">
                           <span className={`px-2 py-1 rounded text-xs font-semibold ${
                             req.status === 'ACCEPTED' ? 'bg-green-100 text-green-700' :
                             req.status === 'DECLINED' ? 'bg-red-100 text-red-700' :
                             'bg-amber-100 text-amber-700'
                           }`}>
                             {req.status}
                           </span>
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

  return <div>Unknown role</div>
}
