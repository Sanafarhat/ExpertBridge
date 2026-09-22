const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  const expertProfileCount = await prisma.expertProfile.count();
  
  const statusCounts = await prisma.expertProfile.groupBy({
    by: ['verificationStatus'],
    _count: true
  });

  const verificationQueueCounts = await prisma.verification.groupBy({
    by: ['status'],
    _count: true
  });

  const eligibleForMatching = await prisma.expertProfile.count({
    where: { verificationStatus: 'VERIFIED' }
  });

  console.log('Total ExpertProfile records:', expertProfileCount);
  console.log('ExpertProfile status distribution:', statusCounts);
  console.log('Verification applications status distribution:', verificationQueueCounts);
  console.log('Experts strictly eligible for matching:', eligibleForMatching);

  // Check matching engine code
  const fs = require('fs');
  const matchingCode = fs.readFileSync('C:/ExpertBridge/src/lib/matching/index.ts', 'utf8');
  if (matchingCode.includes("verificationStatus: 'VERIFIED'")) {
    console.log('Matching engine strictly uses VERIFIED status.');
  }

}

run().catch(console.error).finally(() => prisma.$disconnect());
