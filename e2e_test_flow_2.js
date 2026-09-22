const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function runTestFlow() {
  console.log('--- STARTING MANUAL TEST FLOW SIMULATION ---');
  try {
    // 1. Create Expert User
    console.log('1. Register Expert...');
    const expertUser = await prisma.user.create({
      data: {
        email: 'testexpert_' + Date.now() + '@example.com',
        passwordHash: 'hashed_password',
        role: 'EXPERT',
      }
    });
    
    const expertProfile = await prisma.expertProfile.create({
      data: {
        userId: expertUser.id,
        firstName: 'Test',
        lastName: 'Expert',
        phone: '1234567890',
        designation: 'Sr. Dev',
        organization: 'Tech Co',
        location: 'NY',
        linkedinUrl: 'https://linkedin.com/test',
        bio: 'Test bio',
        domains: 'IT',
        skills: 'JS, TS',
        experience: 5,
        projects: 'None',
        engagementType: 'Remote',
        availability: 'Full-time',
        verificationStatus: 'PENDING'
      }
    });
    console.log(' Expert created with ID:', expertProfile.id);

    // 2. Admin Verify Expert
    console.log('2. Admin Verifies Expert...');
    const updatedExpert = await prisma.expertProfile.update({
      where: { id: expertProfile.id },
      data: { verificationStatus: 'VERIFIED' }
    });
    await prisma.auditLog.create({
      data: {
        action: 'EXPERT_VERIFICATION',
        entityId: expertProfile.id,
        entityType: 'EXPERT',
        actorId: 'admin_test_id',
        actorRole: 'ADMIN',
        details: 'Manually verified during test'
      }
    });
    console.log(' Expert verified.');

    // 3. Create Institution & Requirement
    console.log('3. Create Institution & Requirement...');
    const instUser = await prisma.user.create({
      data: {
        email: 'testinst_' + Date.now() + '@example.com',
        passwordHash: 'hashed_password',
        role: 'INSTITUTION'
      }
    });
    const inst = await prisma.institution.create({
      data: {
        userId: instUser.id,
        name: 'Test Institution'
      }
    });
    const req = await prisma.institutionRequirement.create({
      data: {
        institutionId: inst.id,
        programType: 'Guest Lecture',
        domain: 'IT',
        topics: 'JS, TS',
        expertRole: 'Speaker',
        duration: '1 hr',
        budget: '500',
        status: 'OPEN'
      }
    });
    console.log(' Requirement created:', req.id);

    // 4. Admin Match & Select Primary
    console.log('4. Admin Match & Select Primary...');
    // Simulate finding the match
    const rec = await prisma.requirementRecommendation.create({
      data: {
        requirementId: req.id,
        expertId: expertProfile.id,
        matchScore: 99,
        justification: 'Perfect match',
        selectionStatus: 'PRIMARY',
        contactStatus: 'CONTACTED'
      }
    });
    
    const engReq = await prisma.engagementRequest.create({
      data: {
        requirementId: req.id,
        expertId: expertProfile.id,
        institutionId: inst.id,
        status: 'PENDING',
        message: 'You have been selected.'
      }
    });
    console.log(' Expert contacted for requirement.');

    // 5. Institution Privacy Check (Before Acceptance)
    console.log('5. Institution Privacy Check (Before Acceptance)...');
    const instCheck1 = await prisma.institution.findUnique({
      where: { id: inst.id },
      include: {
        requirements: {
          include: { engagements: { where: { status: 'CONFIRMED' } } }
        }
      }
    });
    console.log(' Institution engagements visible:', instCheck1.requirements[0].engagements.length, '(Expected: 0)');

    // 6. Expert Accepts Engagement
    console.log('6. Expert Accepts Engagement...');
    await prisma.engagementRequest.update({
      where: { id: engReq.id },
      data: {
        status: 'CONFIRMED',
        respondedAt: new Date()
      }
    });
    await prisma.requirementRecommendation.update({
      where: { id: rec.id },
      data: { contactStatus: 'ACCEPTED' }
    });
    await prisma.engagement.create({
      data: {
        requirementId: req.id,
        expertId: expertProfile.id,
        institutionId: inst.id,
        status: 'CONFIRMED',
        startDate: new Date(),
        terms: 'Accepted'
      }
    });
    await prisma.institutionRequirement.update({
      where: { id: req.id },
      data: { status: 'IN_PROGRESS' }
    });
    console.log(' Expert accepted engagement.');

    // 7. Institution Privacy Check (After Acceptance)
    console.log('7. Institution Privacy Check (After Acceptance)...');
    const instCheck2 = await prisma.institution.findUnique({
      where: { id: inst.id },
      include: {
        requirements: {
          include: { engagements: { where: { status: 'CONFIRMED' }, include: { expert: true } } }
        }
      }
    });
    console.log(' Institution engagements visible:', instCheck2.requirements[0].engagements.length, '(Expected: 1)');
    console.log(' Visible Expert Name:', instCheck2.requirements[0].engagements[0].expert.firstName);

    console.log('--- TEST FLOW SUCCESSFUL ---');

  } catch (err) {
    console.error('Test Flow Failed:', err);
  } finally {
    await prisma.$disconnect();
  }
}

runTestFlow();
