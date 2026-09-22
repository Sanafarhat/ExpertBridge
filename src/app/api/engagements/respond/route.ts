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

    const { requestId, action } = await request.json()

    const engagementRequest = await prisma.engagementRequest.findUnique({
      where: { id: requestId },
      include: { requirement: true }
    })

    if (!engagementRequest) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 })
    }

    const status = action === 'ACCEPT' ? 'ACCEPTED' : 'DECLINED'

    // Mark recommendation as responded
    await prisma.requirementRecommendation.updateMany({
      where: {
        requirementId: engagementRequest.requirementId,
        expertId: engagementRequest.expertId
      },
      data: {
        contactStatus: status
      }
    })

    // Update the request
    await prisma.engagementRequest.update({
      where: { id: requestId },
      data: {
        status,
        respondedAt: new Date()
      }
    })

    // If accepted, create the Engagement record
    if (status === 'ACCEPTED') {
      await prisma.engagement.create({
        data: {
          requestId: engagementRequest.id,
          expertId: engagementRequest.expertId,
          institutionId: engagementRequest.institutionId,
          requirementId: engagementRequest.requirementId,
          status: 'CONFIRMED'
        }
      })
    }

    // Create Audit Log
    await prisma.auditLog.create({
      data: {
        actorUserId: session.user.id,
        action: `ENGAGEMENT_REQUEST_${status}`,
        entityType: 'EngagementRequest',
        entityId: engagementRequest.id
      }
    })

    // Create Notification for the Institution
    const institution = await prisma.institution.findUnique({ where: { id: engagementRequest.institutionId } })
    if (institution) {
       await prisma.notification.create({
         data: {
           userId: institution.userId,
           title: `Engagement Request ${status}`,
           message: `An expert has ${status.toLowerCase()} your engagement request for ${engagementRequest.requirement.domain}.`,
           type: 'ENGAGEMENT_RESPONSE'
         }
       })
    }

    return NextResponse.json({ success: true, status })
  } catch (error) {
    console.error('Respond Engagement Error:', error)
    return NextResponse.json({ error: (error as Error).message || 'Internal Server Error' }, { status: 500 })
  }
}
