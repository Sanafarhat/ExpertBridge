import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { calculateMatches } from '@/lib/matching'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import RequestEngagementButton from '@/components/dashboard/institution/request-engagement-button'

export default async function MatchesPage({ params }: { params: any }) {
  const session = await getServerSession(authOptions)

  if (!session?.user || session.user.role !== 'INSTITUTION') {
    redirect('/dashboard')
  }

  const resolvedParams = await Promise.resolve(params)
  const id = resolvedParams.id

  const requirement = await prisma.institutionRequirement.findUnique({
    where: { id }
  })

  if (!requirement || requirement.institutionId !== (await prisma.institution.findUnique({ where: { userId: session.user.id } }))?.id) {
    return <div className="p-8 text-center">Requirement not found or unauthorized.</div>
  }

  if (requirement.status !== 'RECOMMENDATIONS_RELEASED') {
    return (
      <div className="max-w-5xl mx-auto py-12 text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Recommendations Not Ready</h2>
        <p className="text-slate-600 mb-8">Your requirement is currently under review. We will notify you once expert recommendations have been released.</p>
        <Link href="/dashboard" className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">Back to Dashboard</Link>
      </div>
    )
  }


  // Fetch the recommendations
  const matches = await prisma.requirementRecommendation.findMany({
    where: { requirementId: id },
    include: { expert: true },
    orderBy: { matchScore: 'desc' },
    take: 3
  })

  return (
    <div className="max-w-5xl mx-auto py-8">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/dashboard/requirements" className="p-2 bg-white border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50 transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Matching Experts</h1>
          <p className="text-slate-500 text-sm mt-1">Found {matches.length} verified experts for: <span className="font-semibold text-slate-700">{requirement.domain} • {requirement.programType}</span></p>
        </div>
      </div>

      <div className="grid gap-6">
        {matches.map(match => (
          <div key={match.expertId} className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col md:flex-row gap-6 items-start">

            {/* Score Circle */}
            <div className="flex flex-col items-center justify-center shrink-0 w-28 h-28 rounded-full border-4 border-blue-50 bg-blue-50/50">
              <span className="text-3xl font-bold text-blue-700">{match.matchScore}%</span>
              <span className="text-[10px] uppercase font-bold text-blue-500 tracking-wider mt-1 text-center leading-tight">Requirement<br />Match Score</span>
            </div>

            <div className="flex-1 min-w-0 w-full">
              <h2 className="text-xl font-bold text-slate-900">{match.expert.fullName}</h2>
              <p className="text-slate-600 mb-6 leading-relaxed">Let&apos;s request an engagement to initiate the process.</p>
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg text-sm text-slate-700 mb-4">
                <strong>Why this expert?</strong> {match.explanation}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <div className="text-xs text-slate-500 uppercase font-semibold mb-1">Domain</div>
                  <div className="flex items-center gap-2">
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-blue-500 h-full" style={{ width: `${(match.domainScore / 40) * 100}%` }} />
                    </div>
                    <span className="text-xs font-medium text-slate-700">{match.domainScore}/40</span>
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 uppercase font-semibold mb-1">Program</div>
                  <div className="flex items-center gap-2">
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-blue-500 h-full" style={{ width: `${(match.suitabilityScore / 30) * 100}%` }} />
                    </div>
                    <span className="text-xs font-medium text-slate-700">{match.suitabilityScore}/30</span>
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 uppercase font-semibold mb-1">Availability</div>
                  <div className="flex items-center gap-2">
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-blue-500 h-full" style={{ width: `${(match.availabilityScore / 15) * 100}%` }} />
                    </div>
                    <span className="text-xs font-medium text-slate-700">{match.availabilityScore}/15</span>
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 uppercase font-semibold mb-1">Experience</div>
                  <div className="flex items-center gap-2">
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-blue-500 h-full" style={{ width: `${(match.experienceScore / 15) * 100}%` }} />
                    </div>
                    <span className="text-xs font-medium text-slate-700">{match.experienceScore}/15</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="shrink-0 w-full md:w-auto flex flex-col items-stretch gap-2">
              <RequestEngagementButton requirementId={requirement.id} expertId={match.expertId} institutionId={requirement.institutionId} />
            </div>

          </div>
        ))}

        {matches.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
            <h3 className="text-lg font-medium text-slate-900 mb-2">No verified experts found</h3>
            <p className="text-slate-500">We couldn&apos;t find any experts matching your requirement yet. We will notify you when new experts join.</p>
          </div>
        )}
      </div>
    </div>
  )
}
