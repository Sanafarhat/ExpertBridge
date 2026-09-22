import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function PATCH(req: Request, { params }: { params: any }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const resolvedParams = await Promise.resolve(params)
    const { recommendationId } = resolvedParams
    const { selectionStatus } = await req.json()

    const recommendation = await prisma.requirementRecommendation.update({
      where: { id: recommendationId },
      data: { selectionStatus: selectionStatus || null }
    })

    return NextResponse.json({ success: true, recommendation })
  } catch (error) {
    console.error('Update selection error:', error)
    return NextResponse.json({ error: 'Failed to update selection status' }, { status: 500 })
  }
}
