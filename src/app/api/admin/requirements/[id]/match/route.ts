import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { calculateMatches } from '@/lib/matching'

export async function POST(req: Request, { params }: { params: any }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const resolvedParams = await Promise.resolve(params)
    const id = resolvedParams.id

    console.log('[ADMIN MATCHING] Triggering deterministic match for requirement:', id);
    
    // Trigger existing deterministic matching logic
    await calculateMatches(id)

    // Update status to ready
    await prisma.institutionRequirement.update({
      where: { id },
      data: { status: 'RECOMMENDATIONS_READY' }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Match generation error:', error)
    return NextResponse.json({ error: 'Failed to generate matches' }, { status: 500 })
  }
}
