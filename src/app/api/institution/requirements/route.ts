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

    const institution = await prisma.institution.findUnique({
      where: { userId: session.user.id }
    })

    if (!institution) {
      return NextResponse.json({ error: 'Institution profile not found' }, { status: 404 })
    }

    const data = await request.json()

    // Validate preferredDate (convert to Date object if provided)
    let parsedDate = null
    if (data.preferredDate) {
      parsedDate = new Date(data.preferredDate)
    }

    const requirement = await prisma.institutionRequirement.create({
      data: {
        institutionId: institution.id,
        domain: data.domain,
        programType: data.programType,
        preferredDate: parsedDate,
        duration: data.duration,
        audience: data.audience,
        budget: data.budget,
        description: data.description,
        status: 'SUBMITTED' // Or DRAFT if they don't finalize immediately
      }
    })

    // Audit Log
    await prisma.auditLog.create({
      data: {
        actorUserId: session.user.id,
        action: 'REQUIREMENT_CREATED',
        entityType: 'InstitutionRequirement',
        entityId: requirement.id
      }
    })

    return NextResponse.json({ success: true, requirement })
  } catch (error) {
    console.error('Requirement Creation Error:', error)
    return NextResponse.json({ error: (error as Error).message || 'Internal Server Error' }, { status: 500 })
  }
}
