import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('=== FINAL DATABASE AUDIT REPORT ===');
  
  const totalExperts = await prisma.expertProfile.count();
  
  const statuses = await prisma.expertProfile.groupBy({
    by: ['verificationStatus'],
    _count: { verificationStatus: true }
  });
  
  const distinctExperts = await prisma.expertProfile.findMany({
    select: { id: true, fullName: true, verificationStatus: true }
  });
  
  const uniqueIds = new Set(distinctExperts.map(e => e.id)).size;
  const uniqueNames = new Set(distinctExperts.map(e => e.fullName)).size;
  
  console.log(`ExpertProfile total: ${totalExperts}`);
  statuses.forEach(s => {
    console.log(`${s.verificationStatus} count: ${s._count.verificationStatus}`);
  });
  
  console.log(`Distinct expert names: ${uniqueNames}`);
  console.log(`Distinct expert IDs: ${uniqueIds}`);
  
  const totalVerifications = await prisma.verification.count();
  const pendingVerifications = await prisma.verification.count({ where: { status: 'SUBMITTED' } });
  const underReviewVerifications = await prisma.verification.count({ where: { status: 'UNDER_REVIEW' } });
  
  console.log(`Verification application count: ${totalVerifications}`);
  console.log(`Pending verification count: ${pendingVerifications}`);
  console.log(`Under-review count: ${underReviewVerifications}`);
}

main().finally(() => prisma.$disconnect());
