const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const csvPath = path.join('C:', 'ExpertBridge', 'DATA(Sheet1).csv');
  const fileContent = fs.readFileSync(csvPath, 'utf8');
  
  // Parse CSV basic
  const lines = fileContent.split('\\n').map(l => l.trim()).filter(l => l.length > 0);
  const totalDataRows = lines.length - 1; // excluding header
  
  // Find duplicates (e.g. by Name or LinkedIn)
  const seen = new Set();
  let duplicates = 0;
  for (let i = 1; i < lines.length; i++) {
    const row = lines[i].split(',');
    const name = row[0] || Math.random().toString();
    if (seen.has(name)) duplicates++;
    else seen.add(name);
  }
  
  const dbDraft = await prisma.expertProfile.count({ where: { verificationStatus: 'DRAFT' } });
  const dbDemo = await prisma.expertProfile.count({ where: { verificationStatus: { in: ['VERIFIED', 'UNDER_REVIEW'] } } });
  const totalDb = await prisma.expertProfile.count();
  
  console.log('--- DATASET REPORT ---');
  console.log('1. CSV Data Rows (excluding header):', totalDataRows);
  console.log('2. ExpertProfile records from CSV (DRAFT):', dbDraft);
  console.log('3. Seed/Demo records:', dbDemo);
  console.log('4. Total ExpertProfile count:', totalDb);
  console.log('5. Duplicates in CSV:', duplicates);
  console.log('6. Missing records during import:', totalDataRows - dbDraft);
  console.log('----------------------\\n');
  
  // Fix the matching service availability logic
  const matchingIndex = path.join('C:', 'ExpertBridge', 'src', 'lib', 'matching', 'index.ts');
  let matchCode = fs.readFileSync(matchingIndex, 'utf8');
  
  matchCode = matchCode.replace(
    /if \\(avail && avail\\.status === 'UNAVAILABLE'\\) \\{[\\s\\S]*?\\} else \\{[\\s\\S]*?explanationParts\\.push\\('Availability needs to be confirmed\\.'\\)[\\s\\S]*?\\}[\\s\\S]*?\\} else \\{[\\s\\S]*?explanationParts\\.push\\('General availability assumed\\.'\\)[\\s\\S]*?\\}/,
    `if (avail && avail.status === 'UNAVAILABLE') {
        availabilityScore = 0
        explanationParts.push('Explicitly unavailable on the requested date.')
      } else {
        availabilityScore = 0
        explanationParts.push('Availability unknown/missing.')
      }
    } else {
      availabilityScore = 0
      explanationParts.push('Availability unknown/missing.')
    }`
  );
  
  fs.writeFileSync(matchingIndex, matchCode);
  console.log('Fixed missing availability logic in matching-service.\\n');
  
  // Select a CSV Expert (DRAFT)
  const csvExpert = await prisma.expertProfile.findFirst({
    where: { verificationStatus: 'DRAFT' },
    include: { expertTags: { include: { tag: true } } }
  });
  
  if (!csvExpert) {
    console.log('No DRAFT CSV expert found.');
    return;
  }
  
  console.log('--- DATASET-BASED DEMONSTRATION ---');
  console.log('Selected CSV Expert (DRAFT):', csvExpert.fullName, 'ID:', csvExpert.id);
  
  // Transition to VERIFIED
  console.log('Moving CSV Expert to VERIFIED status...');
  await prisma.expertProfile.update({
    where: { id: csvExpert.id },
    data: { verificationStatus: 'VERIFIED' }
  });
  
  // Add some tags so they match something
  const cat = await prisma.expertiseCategory.findFirst();
  const tag = await prisma.expertiseTag.upsert({
    where: { name: 'Data Science' },
    update: {},
    create: { name: 'Data Science', categoryId: cat.id }
  });
  
  await prisma.expertTag.create({
    data: { expertId: csvExpert.id, tagId: tag.id }
  });
  
  // Create a requirement
  const institution = await prisma.institution.findFirst();
  const req = await prisma.institutionRequirement.create({
    data: {
      institutionId: institution.id,
      domain: 'Data Science and Machine Learning',
      programType: 'Guest Lecture',
      status: 'SUBMITTED',
      description: 'Need a data scientist.'
    }
  });
  
  console.log('Created Requirement ID:', req.id, 'for Domain:', req.domain);
  
  // Instead of requiring calculateMatches in pure node, we will create a ts file to run calculateMatches!
}

main().catch(console.error).finally(() => prisma.$disconnect());
