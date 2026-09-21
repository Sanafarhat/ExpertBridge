import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { FileText, Sparkles, Handshake, ArrowRight, PlusCircle, CheckCircle2, ChevronRight, UserCircle, Briefcase, Calendar } from 'lucide-react'
import Link from 'next/link'

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
    const institution = await prisma.institution.findUnique({
      where: { userId: session.user.id },
      include: {
        requirements: {
          orderBy: { createdAt: 'desc' },
          include: {
            recommendations: {
              include: {
                expert: true
              }
            }
          }
        },
        engagements: true
      }
    });

    if (!institution) {
      return <div className="p-8">Please complete your institution profile.</div>
    }

    const activeRequirements = institution.requirements.filter(r => r.status !== 'COMPLETED' && r.status !== 'CANCELLED');
    const totalRecommendations = institution.requirements.reduce((acc, req) => acc + req.recommendations.length, 0);
    const confirmedEngagements = institution.engagements.length;

    const reqWithRecommendations = institution.requirements.find(r => r.status === 'RECOMMENDATIONS_RELEASED');
    const latestRecommendations = reqWithRecommendations ? reqWithRecommendations.recommendations.slice(0, 3) : [];

    const getStatusBadge = (status: string) => {
      switch (status) {
        case 'SUBMITTED': return <span className="bg-[#4DA3FF]/10 text-[#4DA3FF] px-2.5 py-1 rounded-md text-xs font-bold tracking-wide uppercase">SUBMITTED</span>;
        case 'UNDER_REVIEW': return <span className="bg-[#F6C85F]/20 text-[#D9A327] px-2.5 py-1 rounded-md text-xs font-bold tracking-wide uppercase">UNDER REVIEW</span>;
        case 'RECOMMENDATIONS_READY': 
        case 'RECOMMENDATIONS_RELEASED': return <span className="bg-[#6046D8]/10 text-[#6046D8] px-2.5 py-1 rounded-md text-xs font-bold tracking-wide uppercase">RECOMMENDATIONS READY</span>;
        case 'PROCESSING': return <span className="bg-[#6046D8]/10 text-[#6046D8] px-2.5 py-1 rounded-md text-xs font-bold tracking-wide uppercase">PROCESSING</span>;
        case 'MATCHED': return <span className="bg-[#2CBFAE]/10 text-[#2CBFAE] px-2.5 py-1 rounded-md text-xs font-bold tracking-wide uppercase">MATCHED</span>;
        case 'ENGAGEMENT_REQUESTED': return <span className="bg-[#F6C85F]/20 text-[#D9A327] px-2.5 py-1 rounded-md text-xs font-bold tracking-wide uppercase">REQUESTED</span>;
        case 'CONFIRMED': return <span className="bg-[#72D6B5]/20 text-[#21966B] px-2.5 py-1 rounded-md text-xs font-bold tracking-wide uppercase">CONFIRMED</span>;
        default: return <span className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded-md text-xs font-bold tracking-wide uppercase">{status}</span>;
      }
    };

    return (
      <div className="space-y-8 pb-12 max-w-6xl mx-auto">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-extrabold text-[#171942] tracking-tight">Good morning, {session.user.name}</h1>
          <p className="text-[#666778] mt-1.5 text-lg">Manage your submitted requirements and review expert recommendations.</p>
        </div>
        
        {/* Statistics */}
        <div className="grid gap-6 md:grid-cols-3">
          <div className="bg-white p-6 rounded-2xl border border-[#E7E6EF] shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-[#666778] uppercase tracking-wider mb-1">Active Requirements</p>
              <p className="text-4xl font-extrabold text-[#171942]">{activeRequirements.length}</p>
            </div>
            <div className="w-12 h-12 bg-[#4DA3FF]/10 rounded-full flex items-center justify-center">
              <FileText className="w-6 h-6 text-[#4DA3FF]" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-[#E7E6EF] shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-[#666778] uppercase tracking-wider mb-1">Recommendations</p>
              <p className="text-4xl font-extrabold text-[#171942]">{totalRecommendations}</p>
            </div>
            <div className="w-12 h-12 bg-[#6046D8]/10 rounded-full flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-[#6046D8]" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-[#E7E6EF] shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-[#666778] uppercase tracking-wider mb-1">Confirmed Engagements</p>
              <p className="text-4xl font-extrabold text-[#171942]">{confirmedEngagements}</p>
            </div>
            <div className="w-12 h-12 bg-[#2CBFAE]/10 rounded-full flex items-center justify-center">
              <Handshake className="w-6 h-6 text-[#2CBFAE]" />
            </div>
          </div>
        </div>

        {/* Primary CTA */}
        <div className="bg-gradient-to-r from-[#F2EEFF] to-[#FAFAFC] rounded-2xl border border-[#E7E6EF] shadow-sm p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex-1">
            <h2 className="text-xl font-bold text-[#171942] mb-2 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#6046D8]" /> Need an expert for your next program?
            </h2>
            <p className="text-[#666778]">Submit your requirement and let ExpertBridge identify suitable verified experts.</p>
          </div>
          <Link href="/dashboard/requirements/new" className="bg-[#171942] hover:bg-[#25265A] text-white px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 shadow-md w-full md:w-auto justify-center">
            <PlusCircle className="w-5 h-5" /> Submit a Requirement
          </Link>
        </div>

        {/* Top 3 Recommendations */}
        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-bold text-[#171942]">Your Latest Recommendations</h3>
            {reqWithRecommendations ? (
              <p className="text-[#666778] text-sm mt-1">ExpertBridge identified these verified experts for: <span className="font-semibold text-[#171942]">{reqWithRecommendations.domain} - {reqWithRecommendations.programType}</span></p>
            ) : (
              <p className="text-[#666778] text-sm mt-1">Submit a requirement to receive expert recommendations.</p>
            )}
          </div>

          {latestRecommendations.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-3">
              {latestRecommendations.map((rec) => (
                <div key={rec.id} className="bg-white rounded-2xl border border-[#E7E6EF] shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col">
                  <div className="p-6 flex-1">
                    <div className="flex justify-between items-start mb-4">
                      <div className="inline-flex items-center gap-1.5 bg-[#2CBFAE]/10 text-[#2CBFAE] px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                      </div>
                      <div className="text-right">
                        <div className="text-[#6046D8] font-black text-xl leading-none">{rec.matchScore}%</div>
                        <div className="text-[#666778] text-[10px] uppercase font-bold tracking-wider mt-0.5">Match</div>
                      </div>
                    </div>
                    
                    <h4 className="text-lg font-bold text-[#171942] mb-1">{rec.expert.fullName}</h4>
                    <p className="text-[#666778] text-sm font-medium mb-4">{rec.expert.designation} {rec.expert.organization && `at ${rec.expert.organization}`}</p>

                    <div className="space-y-3">
                      <div className="flex items-start gap-2.5">
                        <Briefcase className="w-4 h-4 text-[#6046D8] mt-0.5 shrink-0" />
                        <div>
                          <p className="text-[11px] font-bold text-[#666778] uppercase tracking-wider">Domain & Exp.</p>
                          <p className="text-sm text-[#171942] font-medium mt-0.5">{rec.expert.yearsExperience ? `${rec.expert.yearsExperience} Years` : 'Experience Not Listed'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 border-t border-[#E7E6EF] bg-[#FAFAFC] grid grid-cols-1 gap-2">
                    <Link href={`/dashboard/requirements/${reqWithRecommendations?.id}/matches`} className="bg-white border border-[#E7E6EF] hover:bg-slate-50 text-[#171942] w-full py-2.5 rounded-lg text-sm font-bold transition-colors flex items-center justify-center gap-1.5 shadow-sm">
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white border border-dashed border-[#E7E6EF] rounded-2xl p-10 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-[#F2EEFF] rounded-full flex items-center justify-center mb-4">
                <Sparkles className="w-8 h-8 text-[#6046D8]" />
              </div>
              <h4 className="text-lg font-bold text-[#171942] mb-2">No recommendations yet</h4>
              <p className="text-[#666778] max-w-sm mb-6">Submit a requirement and ExpertBridge will identify suitable verified experts for you.</p>
              <Link href="/dashboard/requirements/new" className="bg-[#171942] hover:bg-[#25265A] text-white px-5 py-2.5 rounded-xl font-semibold transition-all flex items-center gap-2 shadow-sm text-sm">
                <PlusCircle className="w-4 h-4" /> Submit a Requirement
              </Link>
            </div>
          )}
        </div>

        {/* Recent Requirements */}
        <div className="bg-white rounded-2xl border border-[#E7E6EF] shadow-sm overflow-hidden">
          <div className="p-6 border-b border-[#E7E6EF] flex justify-between items-center bg-[#FAFAFC]">
            <h3 className="font-bold text-[#171942] text-lg">Recent Requirements</h3>
            <Link href="/dashboard/requirements" className="text-sm font-bold text-[#6046D8] hover:text-[#7657E8] flex items-center gap-1">
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="overflow-x-auto">
             <table className="w-full text-sm text-left">
                <thead className="bg-white text-[#666778] border-b border-[#E7E6EF]">
                   <tr>
                      <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Requirement</th>
                      <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Date</th>
                      <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Status</th>
                      <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs text-right">Action</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-[#E7E6EF]">
                  {institution.requirements.length > 0 ? (
                    institution.requirements.slice(0, 5).map(req => (
                     <tr key={req.id} className="hover:bg-[#FAFAFC] transition-colors">
                        <td className="px-6 py-4">
                          <p className="font-bold text-[#171942]">{req.programType}</p>
                          <p className="text-xs text-[#666778] mt-0.5">{req.domain}</p>
                        </td>
                        <td className="px-6 py-4 font-medium text-[#666778]">
                          {req.createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </td>
                        <td className="px-6 py-4">
                          {getStatusBadge(req.status)}
                        </td>
                        <td className="px-6 py-4 text-right">
                          {req.recommendations.length > 0 ? (
                            <Link href={`/dashboard/requirements/${req.id}/matches`} className="inline-flex items-center gap-1.5 text-sm font-bold text-[#6046D8] hover:text-[#7657E8]">
                              View Top 3 <ArrowRight className="w-4 h-4" />
                            </Link>
                          ) : (
                            <Link href={`/dashboard/requirements`} className="text-sm font-bold text-[#666778] hover:text-[#171942]">
                              View Details
                            </Link>
                          )}
                        </td>
                     </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-[#666778]">
                        You haven&apos;t posted any requirements yet.
                      </td>
                    </tr>
                  )}
                </tbody>
             </table>
          </div>
        </div>
      </div>
    )
  }
  if (role === 'ADMIN') {
    const pendingVerificationsCount = await prisma.verification.count({ where: { status: 'SUBMITTED' } });
    const underReviewCount = await prisma.verification.count({ where: { status: 'UNDER_REVIEW' } });
    const verifiedExpertsCount = await prisma.expertProfile.count({ where: { verificationStatus: 'VERIFIED' } });
    const referenceChecksCount = 0; // Reference checks not implemented yet
    
    const recentVerifications = await prisma.verification.findMany({
      where: { status: { not: 'DRAFT' } },
      include: {
        expert: {
          include: { expertTags: { include: { tag: true } } }
        }
      },
      orderBy: { submittedAt: 'asc' },
      take: 5
    });

    const pendingRequirements = await prisma.institutionRequirement.findMany({
      where: { status: 'SUBMITTED' },
      include: { institution: true },
      orderBy: { createdAt: 'desc' }
    });

    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-slate-900">Admin Console</h1>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-medium text-slate-500">Pending Verification</h3>
            <p className="text-2xl font-bold text-amber-600 mt-2">{pendingVerificationsCount}</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-medium text-slate-500">Under Review</h3>
            <p className="text-2xl font-bold text-blue-600 mt-2">{underReviewCount}</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-medium text-slate-500">Verified Experts</h3>
            <p className="text-2xl font-bold text-green-600 mt-2">{verifiedExpertsCount}</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-medium text-slate-500">Reference Checks</h3>
            <p className="text-2xl font-bold text-slate-900 mt-2">{referenceChecksCount}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-200 flex justify-between items-center">
            <h3 className="font-semibold text-slate-900">Verification Queue</h3>
            <Link href="/dashboard/verification-queue" className="text-sm font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1">
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="p-0">
             <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-500 border-b">
                   <tr>
                      <th className="px-6 py-3 font-medium">Expert</th>
                      <th className="px-6 py-3 font-medium">Domain</th>
                      <th className="px-6 py-3 font-medium">Submitted</th>
                      <th className="px-6 py-3 font-medium">App ID</th>
                      <th className="px-6 py-3 font-medium">Stage</th>
                      <th className="px-6 py-3 font-medium text-right">Action</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                   {recentVerifications.length > 0 ? recentVerifications.map(v => (
                     <tr key={v.id}>
                        <td className="px-6 py-4 font-medium text-slate-900">{v.expert.fullName}</td>
                        <td className="px-6 py-4 text-slate-500">{v.expert.expertTags[0]?.tag.name || 'Not specified'}</td>
                        <td className="px-6 py-4 text-slate-500">{v.submittedAt.toLocaleDateString()}</td>
                        <td className="px-6 py-4 text-slate-500 font-mono text-xs" title="Application ID">{v.id.substring(0, 8)}</td>
                        <td className="px-6 py-4"><span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-medium uppercase">{v.status}</span></td>
                        <td className="px-6 py-4 text-right"><Link href="/dashboard/verification-queue" className="text-slate-400 hover:text-slate-600">View</Link></td>
                     </tr>
                   )) : (
                     <tr><td colSpan={6} className="px-6 py-4 text-center text-slate-500">No pending verifications.</td></tr>
                   )}
                </tbody>
             </table>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mt-6">
          <div className="p-6 border-b border-slate-200 flex justify-between items-center">
            <h3 className="font-semibold text-slate-900">Pending Requirements for Review</h3>
          </div>
          <div className="overflow-x-auto">
             <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                   <tr>
                      <th className="px-6 py-4 font-semibold">Institution</th>
                      <th className="px-6 py-4 font-semibold">Requirement</th>
                      <th className="px-6 py-4 font-semibold">Date</th>
                      <th className="px-6 py-4 font-semibold">Status</th>
                      <th className="px-6 py-4 font-semibold text-right">Action</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {pendingRequirements.length > 0 ? (
                    pendingRequirements.map(req => (
                     <tr key={req.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4 font-medium text-slate-900">{req.institution?.name || 'Unknown Institution'}</td>
                        <td className="px-6 py-4">
                          <p className="font-medium text-slate-900">{req.programType}</p>
                          <p className="text-xs text-slate-500">{req.domain}</p>
                        </td>
                        <td className="px-6 py-4 text-slate-500">
                          {req.createdAt.toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <span className="bg-[#4DA3FF]/10 text-[#4DA3FF] px-2.5 py-1 rounded-md text-xs font-bold tracking-wide uppercase">{req.status}</span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Link href={`/dashboard/admin/requirements/${req.id}`} className="text-sm font-medium text-blue-600 hover:text-blue-800">
                            Review & Match
                          </Link>
                        </td>
                     </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                        No pending requirements to review.
                      </td>
                    </tr>
                  )}
                </tbody>
             </table>
          </div>
        </div>
      </div>
    )
  }

  return <div>Unknown role</div>
}
