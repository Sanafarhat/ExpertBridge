import { PrismaClient } from '@prisma/client';
import { calculateMatches } from './src/lib/matching/index';
const prisma = new PrismaClient();

async function main() {
  console.log('--- STARTING LINEAGE DEMONSTRATION ---');
  
  // 1. Get the target expert (Dr. Ananya Rao)
  const expert = await prisma.expertProfile.findFirst({
    where: { verificationStatus: 'VERIFIED' },
    include: { expertTags: { include: { tag: true } } }
  });
  
  if (!expert) throw new Error('No verified expert found.');
  console.log('1. Found VERIFIED ExpertProfile in Database:');
  console.log(`   ID: ${expert.id}`);
  console.log(`   Name: ${expert.fullName}`);
  console.log(`   Designation: ${expert.designation} at ${expert.organization}`);
  console.log(`   Tags: ${expert.expertTags.map(t => t.tag.name).join(', ')}`);

  // 2. Create a mock requirement
  const institution = await prisma.institution.findFirst();
  if (!institution) throw new Error('No institution found.');
  
  console.log('\\n2. Creating InstitutionRequirement:');
  const req = await prisma.institutionRequirement.create({
    data: {
      institutionId: institution.id,
      domain: 'Artificial Intelligence and Machine Learning',
      programType: 'Workshop',
      status: 'SUBMITTED',
      description: 'Test requirement for lineage demonstration.'
    }
  });
  console.log(`   Requirement ID: ${req.id}`);
  console.log(`   Domain: ${req.domain}`);
  console.log(`   Program Type: ${req.programType}`);

  // 3. Trigger matching engine
  console.log('\\n3. Triggering Deterministic Matching Engine...');
  const recommendations = await calculateMatches(req.id);
  
  console.log('\\n4. Generated RequirementRecommendation:');
  for (const rec of recommendations) {
    console.log(`   Match found!`);
    console.log(`   Expert ID matched: ${rec.expertId} (Matches original DB ID: ${rec.expertId === expert.id})`);
    console.log(`   Total Score: ${rec.matchScore}%`);
    console.log(`   --- Scoring Components ---`);
    console.log(`   Domain Score (40% max): ${rec.domainScore}`);
    console.log(`   Suitability Score (30% max): ${rec.suitabilityScore}`);
    console.log(`   Availability Score (15% max): ${rec.availabilityScore}`);
    console.log(`   Experience Score (15% max): ${rec.experienceScore}`);
    console.log(`   Explanation: ${rec.explanation}`);
  }
  
  // Cleanup
  await prisma.requirementRecommendation.deleteMany({ where: { requirementId: req.id } });
  await prisma.institutionRequirement.delete({ where: { id: req.id } });
  
  console.log('\\n--- DEMONSTRATION COMPLETE ---');
}

main().catch(console.error).finally(() => prisma.$disconnect());
