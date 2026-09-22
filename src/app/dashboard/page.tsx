import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { FileText, MapPin, Briefcase, Calendar, ArrowRight, ShieldCheck, CheckCircle2, ChevronRight, UserCircle, Link as LinkIcon, BadgeCheck, Search, FileBadge, Info, Clock, AlertTriangle, PlusCircle, Sparkles, Handshake } from 'lucide-react'
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
        expertTags: {
          include: {
            tag: true
          }
        },
        availability: true,
      }
    })

    if (!profile) {
      return <div className="p-8">Profile not found.</div>
    }

    const pendingRequests = profile.engagementRequests?.filter(r => r.status === 'PENDING').length || 0;
    const confirmedEngagements = profile.engagements?.length || 0;
    const isVerified = profile.verificationStatus === 'VERIFIED';
    
    // Initials for avatar
    const initials = profile.fullName ? profile.fullName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'EX';

    const getVerificationBadge = () => {
      switch (profile.verificationStatus) {
        case 'VERIFIED':
          return (
            <div className="flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium border border-green-200">
              <ShieldCheck className="w-4 h-4" />
              Verified
            </div>
          );
        case 'NEEDS_INFO':
          return (
            <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-sm font-medium border border-amber-200">
              <Info className="w-4 h-4" />
              Additional Information Required
            </div>
          );
        case 'UNDER_REVIEW':
        case 'SUBMITTED':
          return (
            <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium border border-blue-200">
              <Clock className="w-4 h-4" />
              Verification Under Review
            </div>
          );
        case 'REJECTED':
          return (
            <div className="flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-700 rounded-full text-sm font-medium border border-red-200">
              <AlertTriangle className="w-4 h-4" />
              Verification Requires Attention
            </div>
          );
        default:
          return (
            <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 text-slate-700 rounded-full text-sm font-medium border border-slate-200">
              Draft
            </div>
          );
      }
    };

    return (
      <div className="max-w-6xl mx-auto space-y-8 pb-12">
        {/* Profile Header Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden relative">
          {/* Banner */}
          <div className="h-32 bg-gradient-to-r from-slate-900 via-accent to-purple-800 relative">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_1px_1px,#ffffff_1px,transparent_0)] [background-size:20px_20px]"></div>
          </div>
          
          <div className="px-8 pb-8 relative">
            {/* Avatar */}
            <div className="flex justify-between items-end -mt-12 mb-4">
              <div className="w-24 h-24 rounded-full border-4 border-white bg-slate-100 flex items-center justify-center text-3xl font-bold text-slate-400 shadow-sm relative z-10">
                {initials}
              </div>
              <div className="flex gap-3 relative z-10 pt-16">
                <Link href="/dashboard/profile" className="px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-sm font-medium rounded-lg border border-slate-200 transition-colors">
                  View Full Profile
                </Link>
              </div>
            </div>

            {/* Identity */}
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-2xl font-bold text-slate-900">{profile.fullName}</h1>
                  {getVerificationBadge()}
                </div>
                <h2 className="text-lg text-slate-700 font-medium">{profile.designation} at {profile.organization || 'Independent'}</h2>
                <div className="flex items-center gap-4 text-sm text-slate-500 mt-2">
                  {profile.location && (
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4" />
                      {profile.location}
                    </div>
                  )}
                  {profile.yearsExperience !== null && (
                    <div className="flex items-center gap-1.5">
                      <Briefcase className="w-4 h-4" />
                      {profile.yearsExperience} Years Experience
                    </div>
                  )}
                  {profile.linkedinUrl && (
                    <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-accent hover:underline">
                      <LinkIcon className="w-4 h-4" />
                      LinkedIn
                    </a>
                  )}
                </div>
              </div>

              {profile.bio && (
                <p className="text-slate-600 leading-relaxed max-w-3xl">
                  {profile.bio}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          
          {/* Main Column */}
          <div className="md:col-span-2 space-y-8">
            
            {/* Expertise */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
              <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                <BadgeCheck className="w-5 h-5 text-accent" />
                Expertise & Domains
              </h3>
              
              {profile.expertTags.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {profile.expertTags.map(et => (
                    <span key={et.tag.id} className="px-3 py-1.5 bg-slate-50 border border-slate-200 text-slate-700 rounded-lg text-sm font-medium">
                      {et.tag.name}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500 text-sm">No expertise tags specified.</p>
              )}
            </div>

            {/* Engagement Requests */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-accent" />
                  Recent Engagement Requests
                </h3>
                {pendingRequests > 0 && (
                  <span className="px-2.5 py-1 bg-accent/10 text-accent text-xs font-bold rounded-full">
                    {pendingRequests} NEW
                  </span>
                )}
              </div>
              
              {profile.engagementRequests && profile.engagementRequests.length > 0 ? (
                <div className="divide-y divide-slate-100">
                  {profile.engagementRequests.map(req => (
                    <div key={req.id} className="p-8 hover:bg-slate-50 transition-colors">
                      {/* Note: In a real implementation, we would fetch the Institution and Requirement details */}
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold text-slate-900">Request #{req.id.substring(0,8)}</h4>
                          <p className="text-sm text-slate-500 mt-1">Status: {req.status}</p>
                        </div>
                        <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-md uppercase">
                          {req.status}
                        </span>
                      </div>
                      <Link href={`/dashboard/engagements`} className="inline-flex items-center gap-1.5 text-sm font-medium text-accent mt-4 hover:underline">
                        View Request <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                    <Search className="w-8 h-8 text-slate-300" />
                  </div>
                  <h4 className="text-slate-900 font-medium mb-1">No new engagement requests</h4>
                  <p className="text-slate-500 text-sm max-w-sm mx-auto">
                    Your requests will appear here when an institution selects you for a suitable engagement.
                  </p>
                </div>
              )}
            </div>
            
          </div>

          {/* Sidebar Column */}
          <div className="space-y-6">
            
            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
               <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center items-center text-center">
                <span className="text-3xl font-bold text-slate-900 mb-1">{pendingRequests}</span>
                <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Pending<br/>Requests</span>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center items-center text-center">
                <span className="text-3xl font-bold text-slate-900 mb-1">{confirmedEngagements}</span>
                <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Confirmed<br/>Engagements</span>
              </div>
            </div>

            {/* Verification Card */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <FileBadge className="w-5 h-5 text-accent" />
                Verification Status
              </h3>
              
              {isVerified ? (
                <div className="space-y-4">
                  <p className="text-sm text-slate-600">
                    Your professional information and submitted evidence have been verified.
                  </p>
                  <p className="text-sm text-slate-600">
                    Your profile may now be considered when it matches suitable institution requirements.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-slate-600">
                    Your profile verification is currently: <strong className="text-slate-900">{profile.verificationStatus}</strong>
                  </p>
                  <p className="text-sm text-slate-600">
                    Only verified experts are eligible for matching with institution requirements.
                  </p>
                </div>
              )}
            </div>

            {/* Availability Card */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-accent" />
                Availability
              </h3>
              
              {profile.availability && profile.availability.length > 0 ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    <span className="font-medium">{profile.availability[0].status}</span>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-slate-500 italic">Availability not specified</p>
              )}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h3 className="font-semibold text-slate-900 mb-4 text-sm uppercase tracking-wider">Quick Actions</h3>
              <div className="space-y-2">
                <Link href="/dashboard/profile" className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 text-sm font-medium text-slate-700 transition-colors">
                  View Professional Profile
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </Link>
                <Link href="/dashboard/engagements" className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 text-sm font-medium text-slate-700 transition-colors">
                  View Engagement Requests
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </div>
    )
  }

  // INSTITUTION ROLE DASHBOARD
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
      <div className="space-y-8 pb-12">
        <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Welcome, {institution.name}</h1>
            <p className="text-slate-500 mt-1">Manage your requirements and expert engagements.</p>
          </div>
          <Link href="/dashboard/requirements/new" className="bg-[#6046D8] hover:bg-[#4d38ad] text-white px-5 py-2.5 rounded-lg font-medium transition flex items-center gap-2">
            <PlusCircle className="w-5 h-5" />
            New Requirement
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 text-slate-500 mb-2">
              <FileText className="w-5 h-5" />
              <h3 className="font-medium">Active Requirements</h3>
            </div>
            <p className="text-3xl font-bold text-slate-900">{activeRequirements.length}</p>
          </div>
          
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 text-slate-500 mb-2">
              <Sparkles className="w-5 h-5 text-[#6046D8]" />
              <h3 className="font-medium">Total Recommendations</h3>
            </div>
            <p className="text-3xl font-bold text-slate-900">{totalRecommendations}</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 text-slate-500 mb-2">
              <Handshake className="w-5 h-5 text-[#2CBFAE]" />
              <h3 className="font-medium">Confirmed Engagements</h3>
            </div>
            <p className="text-3xl font-bold text-slate-900">{confirmedEngagements}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-200 flex justify-between items-center">
                <h2 className="text-lg font-bold text-slate-900">Recent Requirements</h2>
                <Link href="/dashboard/requirements" className="text-sm font-medium text-[#6046D8] hover:underline">View All</Link>
              </div>
              <div className="divide-y divide-slate-100">
                {institution.requirements.slice(0, 5).map((req) => (
                  <div key={req.id} className="p-6 hover:bg-slate-50 transition">
                    <div className="flex justify-between items-start mb-3">
                      <Link href={`/dashboard/requirements/${req.id}`} className="font-semibold text-slate-900 hover:text-[#6046D8] text-lg">
                        {req.programType} in {req.domain}
                      </Link>
                      {getStatusBadge(req.status)}
                    </div>
                    <div className="flex gap-4 text-sm text-slate-500 mb-4">
                      <span className="flex items-center gap-1"><UserCircle className="w-4 h-4"/> {req.domain}</span>
                      <span className="flex items-center gap-1"><Calendar className="w-4 h-4"/> {new Date(req.createdAt).toLocaleDateString()}</span>
                    </div>
                    {req.status === 'RECOMMENDATIONS_RELEASED' && (
                      <Link href={`/dashboard/requirements/${req.id}/matches`} className="inline-flex items-center gap-1 text-sm font-medium text-[#6046D8] hover:underline">
                        View {req.recommendations.length} Recommendations <ArrowRight className="w-4 h-4" />
                      </Link>
                    )}
                  </div>
                ))}
                {institution.requirements.length === 0 && (
                  <div className="p-8 text-center text-slate-500">
                    You haven&apos;t posted any requirements yet.
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
             <div className="bg-gradient-to-br from-[#1B2B4A] to-[#2a4066] rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-20">
                  <Sparkles className="w-24 h-24" />
                </div>
                <h3 className="text-lg font-bold mb-2 relative z-10">AI Matching Pipeline</h3>
                <p className="text-sm text-blue-100 mb-6 relative z-10">Your requirements are automatically analyzed and matched against our verified expert pool.</p>
                <Link href="/dashboard/requirements/new" className="inline-block bg-white text-[#1B2B4A] px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-100 transition relative z-10">
                  Submit New Requirement
                </Link>
             </div>
          </div>
        </div>
      </div>
    )
  }


  // ADMIN ROLE DASHBOARD
  if (role === 'ADMIN') {
    const pendingVerificationsCount = await prisma.verification.count({ where: { status: 'SUBMITTED' } });
    const underReviewCount = await prisma.verification.count({ where: { status: 'UNDER_REVIEW' } });
    const verifiedExpertsCount = await prisma.expertProfile.count({ where: { verificationStatus: 'VERIFIED' } });
    const referenceChecksCount = await prisma.verification.count({ where: { status: 'REFERENCE_CHECK' } });
    
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

  return (
    <div className="p-8">
      <p>Unknown role.</p>
    </div>
  )
}

