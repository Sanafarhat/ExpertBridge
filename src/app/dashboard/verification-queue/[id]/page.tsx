import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import VerificationWorkspace from '@/components/dashboard/admin/verification-workspace'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default async function VerificationWorkspacePage({ params }: { params: any }) {
  const session = await getServerSession(authOptions)

  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/dashboard')
  }

  const resolvedParams = await Promise.resolve(params)
  const id = resolvedParams.id

  const verification = await prisma.verification.findUnique({
    where: { id },
    include: {
      expert: {
        include: {
          expertTags: {
            include: { tag: true }
          },
          engagements: true,
          references: true
        }
      },
      documents: true
    }
  })

  if (!verification) {
    return (
      <div className="p-8 text-center text-slate-500">
        Verification record not found.
        <div className="mt-4">
           <Link href="/dashboard/verification-queue" className="text-blue-600 hover:underline">Return to Queue</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/dashboard/verification-queue" className="p-2 bg-white border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50 transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Verification Workspace</h1>
          <p className="text-slate-500 text-sm">Reviewing application for {verification.expert.fullName}</p>
        </div>
      </div>

      <div className="flex-1 min-h-0 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <VerificationWorkspace initialData={verification} />
      </div>
    </div>
  )
}
