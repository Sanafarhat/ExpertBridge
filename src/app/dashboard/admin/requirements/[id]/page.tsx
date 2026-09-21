import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import Link from 'next/link'
import { ArrowLeft, CheckCircle2, Search, Play, FileText } from 'lucide-react'
import AdminMatchActions from '@/components/dashboard/admin/admin-match-actions'

export default async function AdminRequirementPage({ params }: { params: any }) {
  const session = await getServerSession(authOptions)

  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/dashboard')
  }

  const resolvedParams = await Promise.resolve(params)
  const id = resolvedParams.id

  const requirement = await prisma.institutionRequirement.findUnique({
    where: { id },
    include: {
      institution: true,
      recommendations: {
        include: { expert: true },
        orderBy: { matchScore: 'desc' }
      }
    }
  })

  if (!requirement) {
    return <div className="p-8 text-center">Requirement not found.</div>
  }

  return (
    <div className="max-w-5xl mx-auto py-8 space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/dashboard" className="p-2 bg-white border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50 transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Review Requirement</h1>
          <p className="text-slate-500 text-sm mt-1">{requirement.institution.name}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" /> Details
            </h3>
            <div className="space-y-4 text-sm">
              <div>
                <span className="block text-slate-500 mb-1">Domain</span>
                <span className="font-medium text-slate-900">{requirement.domain}</span>
              </div>
              <div>
                <span className="block text-slate-500 mb-1">Program Type</span>
                <span className="font-medium text-slate-900">{requirement.programType}</span>
              </div>
              <div>
                <span className="block text-slate-500 mb-1">Duration</span>
                <span className="font-medium text-slate-900">{requirement.duration || 'Not specified'}</span>
              </div>
              <div>
                <span className="block text-slate-500 mb-1">Audience</span>
                <span className="font-medium text-slate-900">{requirement.audience || 'Not specified'}</span>
              </div>
              {requirement.budget && (
                <div>
                  <span className="block text-slate-500 mb-1">Budget</span>
                  <span className="font-medium text-slate-900">{requirement.budget}</span>
                </div>
              )}
              {requirement.description && (
                <div>
                  <span className="block text-slate-500 mb-1">Description</span>
                  <p className="font-medium text-slate-900 whitespace-pre-wrap">{requirement.description}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          <AdminMatchActions requirementId={requirement.id} status={requirement.status} hasMatches={requirement.recommendations.length > 0} />
          
          {requirement.recommendations.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-200">
                <h3 className="font-semibold text-slate-900">Generated Recommendations ({requirement.recommendations.length})</h3>
              </div>
              <div className="divide-y divide-slate-100">
                {requirement.recommendations.map(match => (
                  <div key={match.expertId} className="p-6 hover:bg-slate-50">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-bold text-slate-900 text-lg">{match.expert.fullName}</h4>
                        <div className="text-sm text-slate-500 mt-1">
                          <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-xs">ID: {match.expert.id}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-2xl font-bold text-blue-600">{match.matchScore}%</span>
                        <span className="text-xs uppercase font-bold text-slate-500 tracking-wider">Overall Match</span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-slate-700 mb-4 bg-blue-50/50 p-3 rounded border border-blue-100">{match.explanation}</p>
                    
                    <div className="grid grid-cols-4 gap-4">
                      <div className="bg-white border border-slate-200 p-2 rounded text-center">
                        <div className="text-[10px] text-slate-500 uppercase font-semibold mb-1">Domain</div>
                        <div className="font-medium text-slate-900">{match.domainScore}/40</div>
                      </div>
                      <div className="bg-white border border-slate-200 p-2 rounded text-center">
                        <div className="text-[10px] text-slate-500 uppercase font-semibold mb-1">Program</div>
                        <div className="font-medium text-slate-900">{match.suitabilityScore}/30</div>
                      </div>
                      <div className="bg-white border border-slate-200 p-2 rounded text-center">
                        <div className="text-[10px] text-slate-500 uppercase font-semibold mb-1">Avail</div>
                        <div className="font-medium text-slate-900">{match.availabilityScore}/15</div>
                      </div>
                      <div className="bg-white border border-slate-200 p-2 rounded text-center">
                        <div className="text-[10px] text-slate-500 uppercase font-semibold mb-1">Exp</div>
                        <div className="font-medium text-slate-900">{match.experienceScore}/15</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
