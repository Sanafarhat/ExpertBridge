import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { promises as fs } from 'fs'
import path from 'path'
import crypto from 'crypto'

const STORAGE_DIR = path.join(process.cwd(), 'storage/private/documents')

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== 'EXPERT') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const documentType = formData.get('documentType') as string || 'OTHER'

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Ensure the storage directory exists
    await fs.mkdir(STORAGE_DIR, { recursive: true })

    // Generate a secure, unique filename
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    const fileExt = path.extname(file.name)
    const randomName = crypto.randomBytes(16).toString('hex') + fileExt
    const storagePath = path.join(STORAGE_DIR, randomName)

    await fs.writeFile(storagePath, buffer)

    // Ensure expert profile exists to link the document
    const profile = await prisma.expertProfile.findUnique({
      where: { userId: session.user.id }
    })

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    // Get current verification draft or submitted
    let verification = await prisma.verification.findFirst({
      where: { expertId: profile.id, status: { in: ['DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'NEEDS_MORE_INFORMATION'] } }
    })

    // Create a draft verification if one doesn't exist
    if (!verification) {
      verification = await prisma.verification.create({
        data: { expertId: profile.id, status: 'DRAFT' }
      })
    }

    // Save metadata in database
    const document = await prisma.verificationDocument.create({
      data: {
        expertId: profile.id,
        verificationId: verification.id,
        documentType: documentType,
        fileName: file.name,
        storagePath: storagePath,
        mimeType: file.type,
        fileSize: file.size,
        status: 'PENDING'
      }
    })

    // Audit log for document upload
    await prisma.auditLog.create({
      data: {
        actorUserId: session.user.id,
        action: 'DOCUMENT_UPLOADED',
        entityType: 'VerificationDocument',
        entityId: document.id
      }
    })

    return NextResponse.json({ success: true, id: document.id, fileName: document.fileName, status: document.status })

  } catch (error) {
    console.error('Upload Error:', error)
    return NextResponse.json({ error: (error as Error).message || 'Upload failed' }, { status: 500 })
  }
}
