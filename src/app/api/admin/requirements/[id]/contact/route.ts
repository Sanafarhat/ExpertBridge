import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function POST(req: Request, { params }: { params: any }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const resolvedParams = await Promise.resolve(params)
    const requirementId = resolvedParams.id

    // Find the PRIMARY candidate
    const primaryRecommendation = await prisma.requirementRecommendation.findFirst({
      where: {
        requirementId,
        selectionStatus: 'PRIMARY'
      }
    })

    if (!primaryRecommendation) {
      return NextResponse.json({ error: 'No PRIMARY candidate selected' }, { status: 400 })
    }

    // Check if engagement request already exists
    let engagementRequest = await prisma.engagementRequest.findFirst({
      where: {
        requirementId,
        expertId: primaryRecommendation.expertId
      }
    })

    if (!engagementRequest) {
      engagementRequest = await prisma.engagementRequest.create({
        data: {
          requirementId,
          expertId: primaryRecommendation.expertId,
          institutionId: (await prisma.institutionRequirement.findUnique({ where: { id: requirementId } }))!.institutionId,
          status: 'PENDING'
        }
      })
    } else {
      // Re-activate if declined before? Or just ensure it's pending.
      if (engagementRequest.status !== 'PENDING') {
         engagementRequest = await prisma.engagementRequest.update({
            where: { id: engagementRequest.id },
            data: { status: 'PENDING' }
         })
      }
    }

    // Mark recommendation as contacted
    await prisma.requirementRecommendation.update({
      where: { id: primaryRecommendation.id },
      data: { contactStatus: 'CONTACTED' }
    })

    // Update Requirement status
    await prisma.institutionRequirement.update({
      where: { id: requirementId },
      data: { status: 'EXPERT_CONTACTED' }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Contact expert error:', error)
    return NextResponse.json({ error: 'Failed to contact expert' }, { status: 500 })
  }
}
