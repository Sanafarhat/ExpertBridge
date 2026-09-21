import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const total = await prisma.expertProfile.count();
  const draft = await prisma.expertProfile.count({ where: { verificationStatus: 'DRAFT' } });
  const verified = await prisma.expertProfile.count({ where: { verificationStatus: 'VERIFIED' } });
  const review = await prisma.expertProfile.count({ where: { verificationStatus: 'UNDER_REVIEW' } });
  
  console.log('Total:', total);
  console.log('Draft:', draft);
  console.log('Verified:', verified);
  console.log('Review:', review);
}

main().finally(() => prisma.$disconnect());
