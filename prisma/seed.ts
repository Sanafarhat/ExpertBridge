import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Passwords
  const defaultPassword = await bcrypt.hash('expertbridge2026', 10)

  // 1. Create Users
  await prisma.user.upsert({
    where: { email: 'admin@expertbridge.demo' },
    update: {},
    create: {
      email: 'admin@expertbridge.demo',
      name: 'System Admin',
      passwordHash: defaultPassword,
      role: "ADMIN",
    },
  })

  const institutionUser = await prisma.user.upsert({
    where: { email: 'institution@expertbridge.demo' },
    update: {},
    create: {
      email: 'institution@expertbridge.demo',
      name: 'ABC Institute of Technology',
      passwordHash: defaultPassword,
      role: "INSTITUTION",
    },
  })

  const expertUser = await prisma.user.upsert({
    where: { email: 'expert@expertbridge.demo' },
    update: {},
    create: {
      email: 'expert@expertbridge.demo',
      name: 'Dr. Ananya Rao',
      passwordHash: defaultPassword,
      role: "EXPERT",
    },
  })

  // 2. Create Institution Profile
  const institution = await prisma.institution.upsert({
    where: { userId: institutionUser.id },
    update: {},
    create: {
      userId: institutionUser.id,
      name: 'ABC Institute of Technology',
      type: 'University',
      location: 'Bangalore, India',
      website: 'https://abc.edu',
      description: 'A premier educational institution fostering innovation in AI and emerging tech.',
    },
  })

  // 3. Create Expert Profile
  const expertProfile = await prisma.expertProfile.upsert({
    where: { userId: expertUser.id },
    update: {},
    create: {
      userId: expertUser.id,
      fullName: 'Dr. Ananya Rao',
      designation: 'Lead AI Researcher',
      organization: 'Global Tech AI',
      bio: 'Leading applied AI research and implementation. Passionate about machine learning architecture and mentoring future engineers.',
      phone: '+91 98765 43210',
      location: 'Bangalore, India',
      linkedinUrl: 'https://linkedin.com/in/demo-ananya-rao',
      yearsExperience: 12,
      verificationStatus: "UNDER_REVIEW",
    },
  })

  // 4. Create Expertise Categories and Tags
  const categoryTech = await prisma.expertiseCategory.upsert({
    where: { name: 'Technology' },
    update: {},
    create: { name: 'Technology', description: 'Core tech and engineering domains' }
  })

  const tagAI = await prisma.expertiseTag.upsert({
    where: { name: 'AI & Machine Learning' },
    update: {},
    create: { name: 'AI & Machine Learning', categoryId: categoryTech.id }
  })

  // Assign tags to expert
  await prisma.expertTag.upsert({
    where: { expertId_tagId: { expertId: expertProfile.id, tagId: tagAI.id } },
    update: {},
    create: { expertId: expertProfile.id, tagId: tagAI.id }
  })

  // 5. Create Past Engagements for Expert
  await prisma.expertEngagement.create({
    data: {
      expertId: expertProfile.id,
      institutionName: 'DEF College of Engineering',
      title: 'Neural Networks Fundamentals',
      programType: 'Guest Lecture',
      date: new Date('2025-08-15'),
      duration: '3 hours',
      role: 'Keynote Speaker',
      verificationStatus: "VERIFIED",
    }
  })

  // 6. Create Institution Requirement
  await prisma.institutionRequirement.create({
    data: {
      institutionId: institution.id,
      domain: 'AI & Machine Learning',
      programType: 'Industry Workshop',
      preferredDate: new Date('2026-10-15'),
      duration: '2 hours',
      audience: 'Final-year students',
      budget: '₹20,000',
      description: 'Need a cybersecurity or AI/ML expert for a 2-hour workshop for final-year students to understand industry standards.',
      status: "SUBMITTED",
    }
  })

  // 7. Create Verification record in SUBMITTED state for AI demo
  await prisma.verification.create({
    data: {
      expertId: expertProfile.id,
      status: "SUBMITTED",
      documents: {
        create: [
          {
            expertId: expertProfile.id,
            documentType: 'PhD Certificate',
            fileName: 'ananya_phd_certificate.pdf',
            storagePath: 'private/documents/demo_phd.pdf',
            mimeType: 'application/pdf',
            fileSize: 1024000
          },
          {
            expertId: expertProfile.id,
            documentType: 'Professional Certification',
            fileName: 'ananya_ml_cert.pdf',
            storagePath: 'private/documents/demo_ml.pdf',
            mimeType: 'application/pdf',
            fileSize: 512000
          },
          {
            expertId: expertProfile.id,
            documentType: 'Institution Reference',
            fileName: 'def_college_reference.pdf',
            storagePath: 'private/documents/demo_ref.pdf',
            mimeType: 'application/pdf',
            fileSize: 256000
          }
        ]
      }
    }
  })

  console.log('Seed data generated successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
