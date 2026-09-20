import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import RequirementForm from '@/components/dashboard/institution/requirement-form'
import { prisma } from '@/lib/db'

export default async function NewRequirementPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user || session.user.role !== 'INSTITUTION') {
    redirect('/dashboard')
  }

  const categories = await prisma.expertiseCategory.findMany({
    include: { tags: true }
  })

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Find an Expert</h1>
        <p className="text-slate-500 mt-2">Tell us about your requirement, and we&apos;ll match you with verified experts.</p>
      </div>

      <RequirementForm categories={categories} />
    </div>
  )
}
