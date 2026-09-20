import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== 'INSTITUTION') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { requirementId, expertId, institutionId, message } = await request.json()

    // Create the EngagementRequest
    const engagementRequest = await prisma.engagementRequest.create({
      data: {
        requirementId,
        expertId,
        institutionId,
        message,
        status: 'PENDING'
      }
    })

    // Create Audit Log
    await prisma.auditLog.create({
      data: {
        actorUserId: session.user.id,
        action: 'ENGAGEMENT_REQUEST_SENT',
        entityType: 'EngagementRequest',
        entityId: engagementRequest.id
      }
    })

    // Create Notification for the Expert
    const expert = await prisma.expertProfile.findUnique({ where: { id: expertId } })
    if (expert) {
       await prisma.notification.create({
         data: {
           userId: expert.userId,
           title: 'New Engagement Request',
           message: 'An institution has requested your expertise for a program.',
           type: 'ENGAGEMENT_REQUEST'
         }
       })
    }

    return NextResponse.json({ success: true, engagementRequest })
  } catch (error) {
    console.error('Request Engagement Error:', error)
    return NextResponse.json({ error: (error as Error).message || 'Internal Server Error' }, { status: 500 })
  }
}
