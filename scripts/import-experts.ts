import { parse } from 'csv-parse/sync';
import * as fs from 'fs';
import * as path from 'path';
/* eslint-disable @typescript-eslint/no-explicit-any */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function importData() {
  const csvPath = path.join(process.cwd(), 'DATA(Sheet1).csv');
  console.log('Reading from', csvPath);
  
  if (!fs.existsSync(csvPath)) {
    console.error('CSV file not found');
    process.exit(1);
  }

  const fileContent = fs.readFileSync(csvPath, 'utf8');
  
  const records = parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  }) as Record<string, string>[];

  console.log(`Found ${records.length} records. Starting import...`);

  for (const record of records) {
    const rawName = record['Name'] || '';
    if (!rawName) continue;

    const designation = record['Designation'] || null;
    let domain = record['Domain'] || null;
    const region = record['Region '] || null;
    const universityOrCompany = record['University or Company'] || null;
    const experienceRaw = record['Experience '] || null;
    let linkedin = record['linkdin profiles '] || null;

    // Normalizations
    // Clean domain
    if (domain) {
      domain = domain.trim();
      if (domain.toLowerCase() === 'cyber security') domain = 'Cybersecurity';
    }

    // Clean experience
    let yearsExperience: number | null = null;
    if (experienceRaw) {
      const match = experienceRaw.match(/(\d+)/);
      if (match && match[1]) {
        yearsExperience = parseInt(match[1], 10);
      }
    }

    // Clean linkedIn
    if (linkedin && linkedin.toLowerCase().includes('not verified')) {
      linkedin = null;
    }

    // Check if user already exists
    const emailBase = rawName.toLowerCase().replace(/[^a-z0-9]/g, '') || 'expert';
    const email = `${emailBase}_${Math.random().toString(36).substring(2, 7)}@example.com`;

    // Create user and expert profile
    try {
      const user = await prisma.user.create({
        data: {
          name: rawName,
          email: email,
          passwordHash: 'dummy_hashed_password', // In MVP, assume they reset password to claim account or use magic link
          role: 'EXPERT',
          expertProfile: {
            create: {
              fullName: rawName,
              designation: designation,
              organization: universityOrCompany,
              location: region,
              yearsExperience: yearsExperience,
              linkedinUrl: linkedin,
              verificationStatus: 'DRAFT', // Starts as unverified
            }
          }
        },
        include: { expertProfile: true }
      });

      // Add expert tags based on domain
      if (domain && user.expertProfile) {
        // Ensure category and tag exist
        let category = await prisma.expertiseCategory.findFirst({ where: { name: 'Imported Domains' } });
        if (!category) {
          category = await prisma.expertiseCategory.create({ data: { name: 'Imported Domains' } });
        }
        
        let tag = await prisma.expertiseTag.findFirst({ where: { name: domain } });
        if (!tag) {
          tag = await prisma.expertiseTag.create({
            data: { name: domain, categoryId: category.id }
          });
        }

        await prisma.expertTag.create({
          data: {
            expertId: user.expertProfile.id,
            tagId: tag.id
          }
        });
      }

      console.log(`Imported: ${rawName}`);
    } catch (e: any) {
      console.error(`Error importing ${rawName}:`, e.message);
    }
  }

  console.log('Import completed.');
}

importData()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
