/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { requirementService } from '@/lib/ai/requirement/requirement-service'
// pdf-parse import removed here for dynamic import

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

    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Read the file as a buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Extract text using pdf-parse
    let extractedText = ''
    try {
      const pdfParseLib = await import('pdf-parse');
      const parseModule = await import('pdf-parse');
      const parseFunction = (parseModule as any).default || parseModule;
      const pdfData = await (parseFunction as any)(buffer);
      extractedText = pdfData.text
    } catch (e) {
      console.error('PDF Parse Error:', e)
      return NextResponse.json({ error: 'Failed to extract text from PDF' }, { status: 400 })
    }

    if (!extractedText || extractedText.trim().length === 0) {
      return NextResponse.json({ error: 'PDF appears to be empty or unreadable' }, { status: 400 })
    }

    // Call Gemini to analyze the requirement text
    const structuredRequirement = await requirementService.analyzeRequirementText(extractedText)

    // Convert date/duration logic for DB if needed, but the model has preferredDate (DateTime) and duration (String)
    // AI might not return an exact DateTime for preferredDate. If date is not provided, we keep it null.
    // We'll store the AI response directly into the structuredRequirement column

    const requirement = await prisma.institutionRequirement.create({
      data: {
        institutionId: institution.id,
        domain: structuredRequirement.domain || 'Unspecified',
        programType: structuredRequirement.programType || 'Unspecified',
        audience: structuredRequirement.audience,
        duration: structuredRequirement.duration,
        sourceType: 'PDF_UPLOAD',
        sourceDocumentId: file.name, // Usually you'd store it in S3 and put the ID here.
        structuredRequirement: JSON.stringify(structuredRequirement),
        status: 'SUBMITTED' 
      }
    })

    // Audit Log
    await prisma.auditLog.create({
      data: {
        actorUserId: session.user.id,
        action: 'REQUIREMENT_CREATED_VIA_PDF',
        entityType: 'InstitutionRequirement',
        entityId: requirement.id
      }
    })

    return NextResponse.json({ success: true, requirement })
  } catch (error) {
    console.error('Requirement Upload Error:', error)
    return NextResponse.json({ error: (error as Error).message || 'Internal Server Error' }, { status: 500 })
  }
}
