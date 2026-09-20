import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import Link from 'next/link'
import { CheckCircle2, Clock, FileText, AlertCircle, RefreshCw } from 'lucide-react'

export default async function VerificationProgressPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user || session.user.role !== 'EXPERT') {
    redirect('/dashboard')
  }

  const profile = await prisma.expertProfile.findUnique({
    where: { userId: session.user.id },
  })

  const verification = await prisma.verification.findFirst({
    where: { expertId: profile?.id },
    orderBy: { submittedAt: 'desc' }
  })

  const status = profile?.verificationStatus || 'DRAFT'

  const statuses = [
    { id: 'DRAFT', label: 'Draft', desc: 'Profile incomplete', icon: FileText, color: 'text-slate-500', bg: 'bg-slate-100' },
    { id: 'SUBMITTED', label: 'Submitted', desc: 'Pending admin review', icon: Clock, color: 'text-blue-600', bg: 'bg-blue-100' },
    { id: 'UNDER_REVIEW', label: 'Under Review', desc: 'Admin is reviewing documents', icon: RefreshCw, color: 'text-amber-600', bg: 'bg-amber-100' },
    { id: 'REFERENCE_CHECK', label: 'Reference Check', desc: 'Contacting institutions', icon: RefreshCw, color: 'text-amber-600', bg: 'bg-amber-100' },
    { id: 'NEEDS_MORE_INFORMATION', label: 'Needs Info', desc: 'Action required', icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-100' },
    { id: 'VERIFIED', label: 'Verified', desc: 'Profile approved', icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-100' },
  ]

  const currentIndex = statuses.findIndex(s => s.id === status)

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Verification Progress</h1>
        <p className="text-slate-500 mt-2">Track the status of your expert verification application.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-8">
          <div className="flex flex-col md:flex-row gap-8 justify-between">
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-slate-900 mb-6">Current Status</h2>
              
              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
                {statuses.map((step, idx) => {
                  const isCurrent = status === step.id
                  const isPast = currentIndex > idx
                  const Icon = step.icon
                  
                  return (
                    <div key={step.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                      <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-white shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm ${isPast ? 'bg-green-500 text-white' : isCurrent ? step.bg + ' ' + step.color : 'bg-slate-100 text-slate-400'}`}>
                        {isPast ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                      </div>
                      
                      <div className={`w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border shadow-sm ${isCurrent ? 'bg-white border-blue-200 ring-1 ring-blue-100' : isPast ? 'bg-slate-50 border-slate-200' : 'bg-white border-slate-100 opacity-50'}`}>
                        <div className="flex items-center justify-between mb-1">
                          <div className={`font-bold ${isCurrent ? 'text-slate-900' : 'text-slate-700'}`}>{step.label}</div>
                          {isCurrent && <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">Current</span>}
                        </div>
                        <div className="text-slate-500 text-sm">{step.desc}</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="w-full md:w-80 space-y-6">
              <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                <h3 className="font-semibold text-slate-900 mb-2">What happens next?</h3>
                {status === 'DRAFT' && (
                  <p className="text-sm text-slate-600 mb-4">Complete your professional profile and upload documents to submit your application.</p>
                )}
                {(status === 'SUBMITTED' || status === 'UNDER_REVIEW') && (
                  <p className="text-sm text-slate-600 mb-4">Our team is reviewing your documents. We may reach out if we need clarification.</p>
                )}
                {status === 'REFERENCE_CHECK' && (
                  <p className="text-sm text-slate-600 mb-4">We are contacting your listed institutions to verify your previous engagements.</p>
                )}
                {status === 'NEEDS_MORE_INFORMATION' && (
                  <p className="text-sm text-red-600 mb-4">Action is required from your side. Please check your emails or notifications for details.</p>
                )}
                {status === 'VERIFIED' && (
                  <p className="text-sm text-slate-600 mb-4">Your profile is verified. Institutions can now find you in the discovery portal.</p>
                )}
                
                {status === 'DRAFT' && (
                  <Link href="/dashboard/profile" className="block w-full text-center py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">
                    Continue Onboarding
                  </Link>
                )}
                {status === 'NEEDS_MORE_INFORMATION' && (
                  <Link href="/dashboard/profile" className="block w-full text-center py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">
                    Update Application
                  </Link>
                )}
              </div>

              {verification?.decision && status !== 'DRAFT' && (
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                  <h3 className="font-semibold text-slate-900 mb-2">Admin Feedback</h3>
                  <p className="text-sm text-slate-600">{verification.adminNotes || 'No specific notes provided.'}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
