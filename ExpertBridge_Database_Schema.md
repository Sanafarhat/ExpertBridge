# ExpertBridge — PostgreSQL Database Specification

## 1. Database
Use PostgreSQL as the single primary relational database.
Use Prisma ORM.

Do not add MongoDB. The data is strongly relational and PostgreSQL is sufficient.

Actual uploaded documents should be stored in object/file storage. PostgreSQL stores document metadata and protected storage references.

## 2. Core Models

### User
- id
- name
- email
- passwordHash
- role
- createdAt
- updatedAt

Roles:
EXPERT
INSTITUTION
ADMIN

### ExpertProfile
- id
- userId
- fullName
- designation
- organization
- bio
- phone
- location
- linkedinUrl
- yearsExperience
- verificationStatus
- createdAt
- updatedAt

### Institution
- id
- userId
- name
- type
- location
- website
- description
- createdAt
- updatedAt

### ExpertiseCategory
- id
- name
- description

### ExpertiseTag
- id
- name
- categoryId

### ExpertTag
- expertId
- tagId

### ExpertEngagement
- id
- expertId
- institutionId
- title/topic
- programType
- date
- duration
- role
- description
- verificationStatus
- createdAt

### InstitutionRequirement
- id
- institutionId
- domain
- programType
- preferredDate
- duration
- audience
- budget
- description
- status
- createdAt
- updatedAt

### EngagementRequest
- id
- requirementId
- expertId
- institutionId
- status
- message
- requestedAt
- respondedAt

Statuses:
PENDING
ACCEPTED
DECLINED
CANCELLED

### Engagement
- id
- requestId
- expertId
- institutionId
- requirementId
- confirmedAt
- status
- notes

### Verification
- id
- expertId
- status
- submittedAt
- reviewedAt
- reviewedBy
- decision
- adminNotes

### VerificationDocument
- id
- verificationId
- expertId
- documentType
- fileName
- storagePath
- mimeType
- fileSize
- status
- uploadedAt
- reviewedAt
- reviewedBy
- reviewNotes

Document statuses:
PENDING
APPROVED
REJECTED
NEEDS_CLARIFICATION

### InstitutionReference
- id
- expertId
- institutionName
- contactName
- contactEmail
- engagementDescription
- contactStatus
- verificationOutcome
- feedback
- contactedAt
- verifiedAt
- notes

### Availability
- id
- expertId
- date
- startTime
- endTime
- status

### Notification
- id
- userId
- title
- message
- type
- readAt
- createdAt

### AuditLog
- id
- actorUserId
- action
- entityType
- entityId
- metadata
- createdAt

Every important verification and engagement action should generate an audit log.

## 3. Relationships
User 1→1 ExpertProfile
User 1→1 Institution
ExpertProfile 1→N ExpertEngagement
ExpertProfile N↔N ExpertiseTag
ExpertProfile 1→1/Many Verification records as implementation requires
Verification 1→N VerificationDocument
ExpertProfile 1→N InstitutionReference
ExpertProfile 1→N Availability
Institution 1→N InstitutionRequirement
InstitutionRequirement 1→N EngagementRequest
EngagementRequest 1→1 Engagement when accepted
User 1→N Notification
User 1→N AuditLog

## 4. Security
- Hash passwords securely.
- Enforce role-based authorization server-side.
- Protect private document access.
- Do not expose storage paths publicly.
- Validate all inputs with Zod.
- Use server-side authorization for every protected mutation.
- Institutions must not access another institution's private records.
- Experts must not access another expert's private documents.
- Experts cannot access admin verification actions.

## 5. Seed Data
Create realistic fictional demo data:
- 10–20 experts
- 5 institutions
- 15+ expertise categories
- 20+ engagements
- Multiple verification states
- Multiple institution requirements
- Several engagement requests

Clearly fictional/demo names should be used where needed.
