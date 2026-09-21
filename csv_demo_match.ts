import { PrismaClient } from '@prisma/client';
import { calculateMatches } from './src/lib/matching/index';
const prisma = new PrismaClient();

async function main() {
  console.log('--- CSV LINEAGE DEMONSTRATION ---');
  const reqId = '5c52c9e7-4217-40a3-8e0f-9c847fe76e52';
  
  const recommendations = await calculateMatches(reqId);
  
  for (const rec of recommendations) {
    const expert = await prisma.expertProfile.findUnique({ where: { id: rec.expertId } });
    console.log(`   Match found!`);
    console.log(`   Expert Name: ${expert?.fullName}`);
    console.log(`   Expert ID matched: ${rec.expertId}`);
    console.log(`   Total Score: ${rec.matchScore}%`);
    console.log(`   --- Scoring Components ---`);
    console.log(`   Domain Score (40% max): ${rec.domainScore}`);
    console.log(`   Suitability Score (30% max): ${rec.suitabilityScore}`);
    console.log(`   Availability Score (15% max): ${rec.availabilityScore}`);
    console.log(`   Experience Score (15% max): ${rec.experienceScore}`);
    console.log(`   Explanation: ${rec.explanation}`);
    console.log('');
  }
}

main().finally(() => prisma.$disconnect());
