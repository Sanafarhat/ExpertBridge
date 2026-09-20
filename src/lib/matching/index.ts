import { prisma } from '@/lib/db'

export interface MatchScore {
  expertId: string
  expertName: string
  designation: string
  organization: string
  totalScore: number
  domainRelevance: number
  programSuitability: number
  availabilityScore: number
  experienceScore: number
}

/**
 * Calculates a match score between an Institution Requirement and available Verified Experts.
 * 
 * Scoring Formula (Max 100%):
 * 1. Domain Relevance (40%) - How closely the expert's tags/domain match the requirement domain.
 * 2. Program Suitability (30%) - Has the expert done this program type before?
 * 3. Availability Score (15%) - Does the expert have listed availability matching the date? (For MVP, we assume 100% if no date is specified or if they are just generally active)
 * 4. Experience Score (15%) - Years of experience and number of past engagements.
 */
export async function calculateMatches(requirementId: string) {
  const requirement = await prisma.institutionRequirement.findUnique({
    where: { id: requirementId }
  })

  if (!requirement) throw new Error('Requirement not found')

  // Hard eligibility: only verified experts
  const verifiedExperts = await prisma.expertProfile.findMany({
    where: { verificationStatus: 'VERIFIED' },
    include: {
      expertTags: { include: { tag: true } },
      engagements: true,
      availability: true
    }
  })

  const reqDomainParts = requirement.domain.toLowerCase().split(/\s+/)

  const scoredExperts = verifiedExperts.map(expert => {
    let domainScore = 0
    let programScore = 0
    let availabilityScore = 15 // Default to max for MVP if no strict date
    let expScore = 0
    const explanationParts: string[] = []

    // 1. Domain Relevance (Max 40)
    let matchedTags = 0
    expert.expertTags.forEach(et => {
      const tagName = et.tag.name.toLowerCase()
      if (reqDomainParts.some(part => tagName.includes(part))) {
        matchedTags++
      }
    })
    
    const combinedProfileText = `${expert.designation} ${expert.organization} ${expert.bio}`.toLowerCase()
    const textMatches = reqDomainParts.filter(part => part.length > 3 && combinedProfileText.includes(part)).length

    if (matchedTags > 0 || textMatches > 0) {
      domainScore = Math.min(40, (matchedTags * 20) + (textMatches * 10))
      explanationParts.push('Strong domain match based on profile and expertise.')
    } else {
      domainScore = 10 
      explanationParts.push('Partial domain relevance.')
    }

    // 2. Program Suitability (Max 30)
    const hasDoneProgramType = expert.engagements.some(
      eng => eng.programType.toLowerCase() === requirement.programType.toLowerCase()
    )
    if (hasDoneProgramType) {
      programScore = 30
      explanationParts.push(`Has previously conducted ${requirement.programType} programs.`)
    } else if (expert.engagements.length > 0) {
      programScore = 15 
      explanationParts.push('Has general institutional engagement experience.')
    } else {
      explanationParts.push('No specific program experience listed.')
    }

    // 3. Availability (Max 15)
    if (requirement.preferredDate) {
      const reqDateStr = requirement.preferredDate.toISOString().split('T')[0]
      const avail = expert.availability.find(a => a.date.toISOString().split('T')[0] === reqDateStr)
      if (avail && avail.status === 'AVAILABLE') {
        availabilityScore = 15
        explanationParts.push('Available on the requested date.')
      } else if (avail && avail.status === 'UNAVAILABLE') {
        availabilityScore = 0
        explanationParts.push('Explicitly unavailable on the requested date.')
      } else {
        availabilityScore = 10
        explanationParts.push('Availability needs to be confirmed.')
      }
    } else {
      explanationParts.push('General availability assumed.')
    }

    // 4. Experience (Max 15)
    const years = expert.yearsExperience || 0
    const engCount = expert.engagements.length
    
    const calcExp = (years * 0.5) + (engCount * 2)
    expScore = Math.min(15, calcExp)
    if (expScore > 10) {
      explanationParts.push('High level of professional experience.')
    } else if (expScore > 0) {
      explanationParts.push('Adequate professional experience.')
    } else {
      explanationParts.push('Experience level not specified.')
    }

    const totalScore = Math.round(domainScore + programScore + availabilityScore + expScore)

    return {
      expertId: expert.id,
      matchScore: totalScore,
      domainScore,
      suitabilityScore: programScore,
      availabilityScore,
      experienceScore: Math.round(expScore),
      explanation: explanationParts.join(' ')
    }
  })

  // Sort by highest match score
  scoredExperts.sort((a, b) => b.matchScore - a.matchScore)

  // Take top 3
  const top3 = scoredExperts.slice(0, 3)

  // Persist recommendations
  const recommendations = []
  for (const match of top3) {
    const rec = await prisma.requirementRecommendation.upsert({
      where: {
        requirementId_expertId: {
          requirementId: requirement.id,
          expertId: match.expertId
        }
      },
      update: {
        matchScore: match.matchScore,
        domainScore: match.domainScore,
        suitabilityScore: match.suitabilityScore,
        availabilityScore: match.availabilityScore,
        experienceScore: match.experienceScore,
        explanation: match.explanation
      },
      create: {
        requirementId: requirement.id,
        expertId: match.expertId,
        matchScore: match.matchScore,
        domainScore: match.domainScore,
        suitabilityScore: match.suitabilityScore,
        availabilityScore: match.availabilityScore,
        experienceScore: match.experienceScore,
        explanation: match.explanation
      }
    })
    recommendations.push(rec)
  }

  return recommendations
}
