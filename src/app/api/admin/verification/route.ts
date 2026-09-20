import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { getVerificationProvider } from '@/lib/ai/verification/verification-service'

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { action, verificationId, documentId, status, notes, expertId } = await request.json()

    if (action === 'UPDATE_DOCUMENT_STATUS') {
      const doc = await prisma.verificationDocument.update({
        where: { id: documentId },
        data: {
          status,
          reviewedAt: new Date(),
          reviewedBy: session.user.id,
          reviewNotes: notes
        }
      })

      await prisma.auditLog.create({
        data: {
          actorUserId: session.user.id,
          action: `DOCUMENT_${status}`,
          entityType: 'VerificationDocument',
          entityId: doc.id,
          metadata: JSON.stringify({ notes })
        }
      })

      return NextResponse.json({ success: true, document: doc })
    }

    if (action === 'UPDATE_VERIFICATION_STATUS') {
      const verification = await prisma.verification.update({
        where: { id: verificationId },
        data: {
          status,
          reviewedAt: new Date(),
          reviewedBy: session.user.id,
          decision: status === 'VERIFIED' ? 'APPROVED' : status === 'REJECTED' ? 'REJECTED' : 'PENDING',
          adminNotes: notes
        }
      })

      // Sync expert profile status
      await prisma.expertProfile.update({
        where: { id: expertId },
        data: { verificationStatus: status }
      })

      await prisma.auditLog.create({
        data: {
          actorUserId: session.user.id,
          action: `EXPERT_${status}`,
          entityType: 'Verification',
          entityId: verification.id,
          metadata: JSON.stringify({ notes })
        }
      })

      return NextResponse.json({ success: true, verification })
    }

    if (action === 'RUN_AI_VERIFICATION') {
      const verification = await prisma.verification.findUnique({
        where: { id: verificationId },
        include: {
          expert: {
            include: { expertTags: { include: { tag: true } } }
          },
          documents: true
        }
      });

      if (!verification) {
        return NextResponse.json({ error: 'Verification not found' }, { status: 404 });
      }

      const engagements = await prisma.expertEngagement.findMany({
        where: { expertId: verification.expertId }
      });

      try {
        const aiProvider = getVerificationProvider();
        const insights = await aiProvider.verifyExpertSubmission(
          verification.expert,
          verification.documents,
          engagements
        );

        const updatedVerification = await prisma.verification.update({
          where: { id: verificationId },
          data: {
            aiSummary: insights.summary,
            aiConsistent: insights.consistent,
            aiConfidence: insights.confidence,
            aiMissingInfo: JSON.stringify(insights.missingInformation),
            aiInconsistencies: JSON.stringify(insights.inconsistencies),
            aiDocumentFindings: JSON.stringify(insights.documentFindings),
            aiProcessedAt: new Date()
          }
        });

        await prisma.auditLog.create({
          data: {
            actorUserId: session.user.id,
            action: 'AI_VERIFICATION_RAN',
            entityType: 'Verification',
            entityId: verification.id,
            metadata: JSON.stringify({ confidence: insights.confidence })
          }
        });

        return NextResponse.json({ success: true, verification: updatedVerification });
      } catch (aiError) {
        console.error('AI Verification failed:', aiError)
        return NextResponse.json({ 
          error: 'AI analysis failed', 
          details: aiError instanceof Error ? aiError.message : String(aiError)
        }, { status: 500 })
      }
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Verification Error:', error)
    return NextResponse.json({ error: error instanceof Error ? error.message : String(error) }, { status: 500 })
  }
}
