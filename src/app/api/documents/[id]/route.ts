import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { promises as fs } from 'fs'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const document = await prisma.verificationDocument.findUnique({
      where: { id },
      include: {
        expert: true
      }
    })

    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 })
    }

    // Authorization Check
    const role = session.user.role
    
    if (role === 'INSTITUTION') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    
    if (role === 'EXPERT' && document.expert.userId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    // Admins have access inherently.

    // Read file
    const fileBuffer = await fs.readFile(document.storagePath)

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': document.mimeType || 'application/octet-stream',
        'Content-Disposition': `inline; filename="${document.fileName}"`,
      },
    })
  } catch (error: unknown) {
    console.error('File Retrieval Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
