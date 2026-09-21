import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('=== DATABASE STATE AUDIT ===');
  const total = await prisma.expertProfile.count();
  
  const statuses = await prisma.expertProfile.groupBy({
    by: ['verificationStatus'],
    _count: { verificationStatus: true }
  });
  
  const distinctExperts = await prisma.expertProfile.findMany({
    select: { id: true, fullName: true, verificationStatus: true }
  });
  
  const uniqueIds = new Set(distinctExperts.map(e => e.id)).size;
  const uniqueNames = new Set(distinctExperts.map(e => e.fullName)).size;
  
  console.log('Total ExpertProfile records:', total);
  console.log('\\nCount by verificationStatus:');
  statuses.forEach(s => console.log(s.verificationStatus, ':', s._count.verificationStatus));
  
  console.log('\\nDistinct expert IDs:', uniqueIds);
  console.log('Distinct expert names:', uniqueNames);
  
  console.log('\\n--- Dr. Ananya Rao Records ---');
  const ananyas = await prisma.expertProfile.findMany({
    where: { fullName: { contains: 'Ananya Rao' } },
    include: { _count: { select: { verifications: true } } }
  });
  
  for (const a of ananyas) {
    const user = await prisma.user.findUnique({ where: { id: a.userId } });
    console.log(`ID: ${a.id}`);
    console.log(`Name: ${a.fullName}`);
    console.log(`Email: ${user?.email}`);
    console.log(`Designation: ${a.designation}`);
    console.log(`VerificationStatus: ${a.verificationStatus}`);
    console.log(`CreatedAt: ${a.createdAt}`);
    console.log(`UpdatedAt: ${a.updatedAt}`);
    console.log(`Number of verifications: ${a._count.verifications}`);
    console.log('-');
  }
}

main().finally(() => prisma.$disconnect());
