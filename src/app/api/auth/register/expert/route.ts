import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { writeFile, mkdir } from 'fs/promises';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const phone = formData.get('phone') as string;
    const designation = formData.get('designation') as string;
    const organization = formData.get('organization') as string;
    const bio = formData.get('bio') as string;
    const linkedin = formData.get('linkedin') as string;
    const location = formData.get('location') as string;
    const primaryDomain = formData.get('primaryDomain') as string;
    const tags = JSON.parse((formData.get('tags') as string) || '[]');
    const experienceYears = parseInt((formData.get('experienceYears') as string) || '0');
    const availabilityStatus = formData.get('availabilityStatus') as string;
    const preferredEngagementTypes = formData.get('preferredEngagementTypes') as string;

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Missing required account fields' }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Save files
    const documentKeys = ['idProof', 'educationProof', 'employmentProof', 'certificationProof'];
    const savedDocs: any[] = [];
    
    const uploadDir = path.join(process.cwd(), 'uploads', 'verifications');
    await mkdir(uploadDir, { recursive: true });

    for (const key of documentKeys) {
      const files = formData.getAll(key);
      for (const file of files) {
        if (file && typeof file === 'object' && file.name) {
          const f = file as File;
          const bytes = await f.arrayBuffer();
          const buffer = Buffer.from(bytes);
          const fileName = `${Date.now()}-${f.name}`;
          const filePath = path.join(uploadDir, fileName);
          await writeFile(filePath, buffer);
          
          savedDocs.push({
            documentType: key,
            fileName: f.name,
            storagePath: filePath,
            mimeType: f.type,
            fileSize: f.size,
          });
        }
      }
    }

    // Database transaction
    const result = await prisma.$transaction(async (tx) => {
      // 1. Create User
      const user = await tx.user.create({
        data: { name, email, passwordHash: hashedPassword, role: 'EXPERT' }
      });

      // 2. Create ExpertProfile
      const expertProfile = await tx.expertProfile.create({
        data: {
          userId: user.id,
          fullName: name,
          designation: designation || 'Expert',
          organization: organization || 'Independent',
          bio,
          linkedinUrl: linkedin,
          location,
          yearsExperience: experienceYears,
          
          verificationStatus: 'SUBMITTED', // Will be updated by AI pipeline
          
        }
      });

      // 3. Create Tags (Expertise)
      // For MVP, we map strings to new or existing ExpertiseTags (Domain = primary)
      const cat = await tx.expertiseCategory.upsert({
        where: { name: 'General' },
        update: {},
        create: { name: 'General', description: 'General Category' }
      });

      const tagNames = [primaryDomain, ...tags].filter(Boolean);
      for (const tagName of tagNames) {
        const t = await tx.expertiseTag.upsert({
          where: { name: tagName },
          update: {},
          create: { name: tagName, categoryId: cat.id }
        });
        
        await tx.expertTag.create({
          data: { expertId: expertProfile.id, tagId: t.id }
        });
      }

      // 4. Create Verification Application
      const verification = await tx.verification.create({
        data: {
          expertId: expertProfile.id,
          status: 'SUBMITTED',
        }
      });

      // 5. Link Documents
      for (const doc of savedDocs) {
        await tx.verificationDocument.create({
          data: {
            verificationId: verification.id,
            expertId: expertProfile.id,
            ...doc
          }
        });
      }

      // 6. Audit Log
      await tx.auditLog.create({
        data: {
          actorUserId: user.id,
          action: 'EXPERT_VERIFICATION_SUBMITTED',
          entityType: 'Verification',
          entityId: verification.id,
          metadata: JSON.stringify({ documentCount: savedDocs.length })
        }
      });

      return { user, expertProfile, verification };
    });

    

    return NextResponse.json({ 
      success: true, 
      message: 'Expert account and verification application submitted successfully',
      userId: result.user.id
    }, { status: 201 });

  } catch (error) {
    console.error('Registration Error:', error);
    return NextResponse.json({ error: 'Internal server error during registration' }, { status: 500 });
  }
}
