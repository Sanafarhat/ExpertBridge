import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getVerificationProvider } from '@/lib/ai/verification/verification-service';
import PDFParser from 'pdf2json';
import fs from 'fs/promises';

async function extractTextFromPDF(filePath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const pdfParser = new (PDFParser as any)(null, 1);
    
    pdfParser.on('pdfParser_dataError', (errData: any) => reject(errData.parserError));
    pdfParser.on('pdfParser_dataReady', (pdfData: any) => {
      resolve(pdfParser.getRawTextContent());
    });
    
    pdfParser.loadPDF(filePath);
  });
}

export async function POST(req: NextRequest) {
  try {
    const { verificationId } = await req.json();

    if (!verificationId) {
      return NextResponse.json({ error: 'Missing verificationId' }, { status: 400 });
    }

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

    // Extract document text
    const extractedDocs = [];
    for (const doc of verification.documents) {
      let content = 'No text extracted';
      if (doc.mimeType === 'application/pdf') {
        try {
          content = await extractTextFromPDF(doc.storagePath);
          // Limit length to avoid max tokens issues (e.g. 5000 chars per doc)
          content = content.substring(0, 5000);
        } catch (e) {
          console.error(\Failed to parse PDF \:\, e);
          content = 'Error extracting text from PDF';
        }
      } else {
         content = '[Image or Non-PDF document - text extraction skipped]';
      }

      extractedDocs.push({
        type: doc.documentType,
        fileName: doc.fileName,
        content
      });
    }

    // Run AI Verification
    const aiProvider = getVerificationProvider();
    
    // Prepare minimal expert profile for AI
    const profileForAi = {
      name: verification.expert.fullName,
      designation: verification.expert.designation,
      organization: verification.expert.currentOrganization,
      experienceYears: verification.expert.yearsOfExperience,
      domain: verification.expert.expertTags.map(t => t.tag.name).join(', ')
    };

    // Log AI verification started
    await prisma.auditLog.create({
      data: {
        actorUserId: verification.expert.userId,
        action: 'AI_VERIFICATION_RAN',
        entityType: 'Verification',
        entityId: verification.id,
      }
    });

    const insights = await aiProvider.verifyExpertSubmission(
      profileForAi,
      extractedDocs,
      [] // No engagements for a new expert
    );

    // Apply BACKEND VERIFICATION POLICY
    let finalStatus = 'UNDER_REVIEW'; // Safe fallback
    
    // Policy Rules:
    // 1. If any missing information -> NEEDS_INFO
    if (insights.missingInformation && insights.missingInformation.length > 0) {
      finalStatus = 'NEEDS_INFO';
    } 
    // 2. If significant inconsistencies found -> REJECTED (or UNDER_REVIEW for manual check)
    // We will use REJECTED if consistent is explicitly false and there are inconsistencies.
    else if (!insights.consistent && insights.inconsistencies && insights.inconsistencies.length > 0) {
      finalStatus = 'REJECTED';
    }
    // 3. VERIFIED only if strictly consistent, no missing info, and doesn't require admin review.
    else if (insights.consistent && !insights.requiresAdminReview) {
      finalStatus = 'VERIFIED';
    }

    // Update Verification and ExpertProfile
    await prisma.$transaction(async (tx) => {
      await tx.verification.update({
        where: { id: verification.id },
        data: {
          status: finalStatus,
          aiSummary: insights.summary,
          aiConsistent: insights.consistent,
          aiMissingInfo: JSON.stringify(insights.missingInformation),
          aiInconsistencies: JSON.stringify(insights.inconsistencies),
          aiDocumentFindings: JSON.stringify(insights.documentFindings),
          aiConfidence: insights.confidence,
          aiProcessedAt: new Date(),
        }
      });

      await tx.expertProfile.update({
        where: { id: verification.expertId },
        data: { verificationStatus: finalStatus }
      });

      // Audit Log Outcome
      const auditAction = finalStatus === 'VERIFIED' ? 'EXPERT_VERIFIED' : 
                          finalStatus === 'NEEDS_INFO' ? 'EXPERT_VERIFICATION_NEEDS_INFO' : 
                          finalStatus === 'REJECTED' ? 'EXPERT_VERIFICATION_REJECTED' : 'EXPERT_UNDER_REVIEW';
                          
      await tx.auditLog.create({
        data: {
          actorUserId: verification.expert.userId,
          action: auditAction,
          entityType: 'Verification',
          entityId: verification.id,
          metadata: JSON.stringify({ aiConfidence: insights.confidence })
        }
      });
    });

    return NextResponse.json({ success: true, status: finalStatus, insights });

  } catch (error) {
    console.error('Onboarding AI Error:', error);
    return NextResponse.json({ error: 'Internal server error processing verification' }, { status: 500 });
  }
}
