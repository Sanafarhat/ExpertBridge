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
    const id = resolvedParams.id

    // Update status to released
    await prisma.institutionRequirement.update({
      where: { id },
      data: { status: 'RECOMMENDATIONS_RELEASED' }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Match release error:', error)
    return NextResponse.json({ error: 'Failed to release matches' }, { status: 500 })
  }
}
