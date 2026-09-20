import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== 'EXPERT') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()
    const { action, profileData, selectedTags } = data

    // Convert yearsExperience to Int
    let exp = parseInt(profileData.yearsExperience)
    if (isNaN(exp)) exp = 0

    // Upsert the profile
    const profile = await prisma.expertProfile.update({
      where: { userId: session.user.id },
      data: {
        fullName: profileData.fullName,
        designation: profileData.designation,
        organization: profileData.organization,
        bio: profileData.bio,
        phone: profileData.phone,
        location: profileData.location,
        linkedinUrl: profileData.linkedinUrl,
        yearsExperience: exp,
      }
    })

    // Update tags
    // First, delete all existing tags for this expert
    await prisma.expertTag.deleteMany({
      where: { expertId: profile.id }
    })

    // Then insert the new ones
    if (selectedTags && selectedTags.length > 0) {
      await prisma.expertTag.createMany({
        data: selectedTags.map((tagId: string) => ({
          expertId: profile.id,
          tagId: tagId
        }))
      })
    }

    if (action === 'SUBMIT_FOR_VERIFICATION') {
      // Check if verification already exists and update, else create
      const verification = await prisma.verification.findFirst({
        where: { expertId: profile.id, status: { in: ['SUBMITTED', 'DRAFT'] } }
      })

      if (verification) {
        await prisma.verification.update({
          where: { id: verification.id },
          data: { status: 'SUBMITTED', submittedAt: new Date() }
        })
      } else {
        await prisma.verification.create({
          data: {
            expertId: profile.id,
            status: 'SUBMITTED',
            submittedAt: new Date()
          }
        })
      }

      await prisma.expertProfile.update({
        where: { id: profile.id },
        data: { verificationStatus: 'SUBMITTED' }
      })

      // Add an audit log
      await prisma.auditLog.create({
        data: {
          actorUserId: session.user.id,
          action: 'EXPERT_VERIFICATION_SUBMITTED',
          entityType: 'ExpertProfile',
          entityId: profile.id
        }
      })
    }

    return NextResponse.json({ success: true, profile })
  } catch (error) {
    console.error('Expert Onboarding Error:', error)
    return NextResponse.json({ error: (error as Error).message || 'Internal Server Error' }, { status: 500 })
  }
}
