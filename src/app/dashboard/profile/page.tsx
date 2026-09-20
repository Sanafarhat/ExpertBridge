import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import OnboardingForm from '@/components/dashboard/expert/onboarding-form'

export default async function ExpertProfilePage() {
  const session = await getServerSession(authOptions)

  if (!session?.user || session.user.role !== 'EXPERT') {
    redirect('/dashboard')
  }

  const profile = await prisma.expertProfile.findUnique({
    where: { userId: session.user.id },
    include: {
      expertTags: {
        include: {
          tag: {
            include: {
              category: true
            }
          }
        }
      },
      engagements: true,
      documents: true,
    }
  })

  // We should also fetch available ExpertiseCategories for the form
  const categories = await prisma.expertiseCategory.findMany({
    include: {
      tags: true
    }
  })

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Professional Profile</h1>
        <p className="text-slate-500 mt-2">Complete your profile to get verified and discover engagements.</p>
      </div>

      <OnboardingForm initialData={profile} categories={categories} />
    </div>
  )
}
