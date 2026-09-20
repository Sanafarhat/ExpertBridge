# ExpertBridge — Product Requirements

## 1. Product Overview
ExpertBridge is a centralized web platform for educational institutions to discover, verify, and engage credible domain experts and speakers through a structured, transparent, and audit-ready workflow.

The product is not a generic speaker directory, social network, or freelancer marketplace.

## 2. Problem
Institutions commonly rely on personal contacts, WhatsApp groups, Google searches, referrals, and manual coordination. This creates difficulty in:
- Discovering relevant experts
- Verifying credentials and past engagements
- Establishing formal authorization
- Coordinating engagements
- Maintaining standardized records for audits and accreditation

## 3. Core Value Proposition
- Verified and authenticated experts
- Reduced institutional risk
- Structured expert discovery
- Audit-ready documentation
- Replacement of informal coordination methods

## 4. Primary Roles

### Expert
- Register and log in
- Complete professional profile
- Add expertise and experience
- Add past engagements
- Add institutions where sessions were delivered
- Upload supporting evidence
- Submit verification request
- Track verification
- Manage availability
- Receive and respond to engagement requests
- View engagement history

### Institution
- Register/login
- Maintain institution profile
- Submit expert requirements
- Search/filter experts
- View verified expert profiles
- Check availability and engagement history
- Send engagement requests
- Track requests and engagements
- Maintain/download relevant records

### Admin / Verification Team
- Review expert applications
- Review documents
- Contact referenced institutions
- Record verification outcomes
- Approve/reject/request clarification
- Manage experts and institutions
- Monitor engagements
- View audit logs
- Generate reports

## 5. Verification Principle
ExpertBridge certification represents verification/authentication of submitted professional and engagement information. It is NOT a skill ranking or claim that one expert is better than another.

Suggested statuses:
DRAFT, SUBMITTED, UNDER_REVIEW, REFERENCE_CHECK, VERIFIED, NEEDS_MORE_INFORMATION, REJECTED, EXPIRED.

## 6. Expert Information
- Name
- Designation
- Organization
- Professional bio
- Contact information
- Location
- LinkedIn/professional links
- Areas of expertise
- Expertise tags
- Years of experience
- Professional history
- Past speaking/teaching engagements
- Institutional references
- Availability
- Supporting documents
- Verification status

## 7. Institution Requirements
An institution can create a requirement containing:
- Topic/domain
- Program type
- Date
- Duration
- Audience
- Budget (optional)
- Additional requirements

Program types may include:
- Guest Lecture
- Workshop
- Panel Discussion
- Mentoring
- Faculty Development
- Industry Interaction
- Other

## 8. Matching
For the MVP, use transparent rule-based matching rather than pretending to use an LLM.

Match factors:
- Domain relevance
- Verification status
- Program suitability
- Availability
- Past engagement relevance

Show a transparent score and factor breakdown.

## 9. Core Workflow
Expert registration → profile completion → evidence upload → verification submission → admin review → institutional reference verification → approval → verified profile → institution search → requirement creation → matching → request → expert response → confirmed engagement → audit record.

## 10. MVP
The MVP must provide a complete working flow with persistent PostgreSQL data and role-based access.

No fake navigation, broken buttons, or frontend-only workflows.
