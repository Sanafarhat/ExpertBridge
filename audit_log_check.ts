import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('=== AUDIT LOGS ===');
  const logs = await prisma.auditLog.groupBy({
    by: ['action'],
    _count: { action: true }
  });
  
  logs.forEach(l => console.log(l.action, ':', l._count.action));
}

main().finally(() => prisma.$disconnect());
