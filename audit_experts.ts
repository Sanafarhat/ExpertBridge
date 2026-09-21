import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // TABLE 1: CURRENT VERIFIED POOL
  const verifiedExperts = await prisma.expertProfile.findMany({
    where: { verificationStatus: 'VERIFIED' },
    include: {
      expertTags: { include: { tag: true } }
    }
  });

  console.log('=== TABLE 1 — CURRENT VERIFIED POOL ===');
  console.log('Name | Source | Domain | Experience | Availability | ID');
  console.log('---|---|---|---|---|---');
  for (const expert of verifiedExperts) {
    const isDemo = expert.fullName.includes('Ananya Rao') || expert.id === 'seed' || expert.userId === 'seed';
    const source = isDemo ? 'Demo' : 'CSV';
    const domain = expert.expertTags.length > 0 ? expert.expertTags.map(et => et.tag.name).join(', ') : 'None';
    
    console.log(`${expert.fullName} | ${source} | ${domain} | ${expert.yearsOfExperience ?? 'Unknown'} | ${expert.availability ?? 'Unknown'} | ${expert.id}`);
    console.log(`  Details -> Designation: ${expert.designation}, Tags: ${domain}`);
  }

  // TABLE 2: CSV DATASET DOMAIN DISTRIBUTION
  // Get all experts except Demo ones
  const allExperts = await prisma.expertProfile.findMany({
    include: {
      expertTags: { include: { tag: true } }
    }
  });

  const csvExperts = allExperts.filter(expert => !(expert.fullName.includes('Ananya Rao') || expert.id === 'seed' || expert.userId === 'seed'));
  
  const domainMap = new Map();
  for (const expert of csvExperts) {
    const primaryDomain = expert.expertTags.length > 0 ? expert.expertTags[0].tag.name : 'Unknown';
    if (!domainMap.has(primaryDomain)) {
      domainMap.set(primaryDomain, { count: 0, names: [], statuses: {} });
    }
    const d = domainMap.get(primaryDomain);
    d.count++;
    if (d.names.length < 3) d.names.push(expert.fullName);
    
    d.statuses[expert.verificationStatus] = (d.statuses[expert.verificationStatus] || 0) + 1;
  }

  console.log('\n=== TABLE 2 — CSV DATASET DOMAIN DISTRIBUTION ===');
  console.log('Domain | Number of CSV Experts | Example Names | Verification Status Distribution');
  console.log('---|---|---|---');
  for (const [domain, d] of domainMap.entries()) {
    const statusDist = Object.entries(d.statuses).map(([status, count]) => `${status}: ${count}`).join(', ');
    console.log(`${domain} | ${d.count} | ${d.names.join(', ')}... | ${statusDist}`);
  }

  // RELEVANT CANDIDATES
  console.log('\n=== RELEVANT CANDIDATES ===');
  const targetDomains = [
    'Marketing', 'Video Editing', 'Artificial Intelligence', 'Machine Learning', 
    'Cybersecurity', 'Robotics', 'Software', 'SaaS', 'Entrepreneurship', 'Startup'
  ];

  for (const domain of targetDomains) {
    console.log(`\nDomain: ${domain}`);
    const matches = csvExperts.filter(e => {
        const tags = e.expertTags.map(et => et.tag.name.toLowerCase());
        return tags.some(t => t.includes(domain.toLowerCase()));
    });
    
    if (matches.length === 0) {
      console.log('  No candidates found.');
    } else {
      for (const m of matches) {
        console.log(`  - ${m.fullName} (${m.verificationStatus}) [Tags: ${m.expertTags.map(et => et.tag.name).join(', ')}]`);
      }
    }
  }
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
