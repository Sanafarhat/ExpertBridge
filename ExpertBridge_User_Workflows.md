# ExpertBridge — User Workflows

## 1. Expert Journey

### Registration
Expert opens ExpertBridge → chooses Become a Verified Expert → creates account → enters dashboard.

### Profile Setup
Complete:
- Professional details
- Designation
- Organization
- Experience
- Expertise
- Professional links

### Engagement History
Expert adds previous:
- Institution
- Program
- Topic
- Date
- Role
- Supporting evidence

### Document Submission
Upload:
- Certificates
- Offer/engagement letters
- Event brochures
- Emails
- Recommendation letters
- Other supporting proof

### Verification Submission
Expert reviews information → submits verification request.

Status changes:
SUBMITTED → UNDER_REVIEW → REFERENCE_CHECK → VERIFIED

If clarification is needed:
NEEDS_MORE_INFORMATION

If rejected:
REJECTED

### Verification Result
Verified experts receive:
VERIFIED & CERTIFIED

Important:
This status confirms verification/authenticity of submitted information. It does not rank skill.

### Availability
Expert manages available dates/times.

### Engagement Request
Institution sends request → expert sees request → expert accepts/declines → if accepted, engagement is created.

---

## 2. Institution Journey

### Registration
Institution creates account → enters institution details → accesses dashboard.

### Requirement Creation
Institution selects Find an Expert.

Enter:
- Topic/domain
- Program type
- Date
- Duration
- Audience
- Budget
- Additional requirements

Click:
Find Matching Experts

### Discovery
System searches verified profiles.

Show:
- Match score
- Domain relevance
- Program suitability
- Availability
- Past engagement relevance
- Verification status

### Profile Review
Institution opens expert profile and reviews:
- Expertise
- Experience
- Verified engagements
- Availability
- Verification information

### Request
Institution sends:
- Requirement
- Date
- Duration
- Budget
- Message

### Confirmation
Expert accepts → institution receives confirmation → engagement record created.

---

## 3. Admin Journey

### Verification Queue
Admin opens Verification Queue → sees pending applications.

### Review
Open application → review:
- Expert profile
- Documents
- Engagement history
- Institutional references

### Document Review
Each document can be:
APPROVED
REJECTED
NEEDS_CLARIFICATION

### Reference Check
Admin records:
- Institution contacted
- Contact status
- Response
- Nature of engagement
- Feedback
- Notes

Do not simulate an actual external verification call.

### Decision
Admin chooses:
Approve
Reject
Request More Information

### Approval
Expert status becomes:
VERIFIED

System creates:
- Verification record
- Audit log
- Notification

### Audit
Every major action is recorded with:
Timestamp
Actor
Action
Entity
Status
Metadata

---

## 4. Engagement Lifecycle

Requirement:
DRAFT
↓
SUBMITTED
↓
MATCHED
↓
REQUEST_SENT
↓
PENDING_EXPERT
↓
ACCEPTED
↓
CONFIRMED
↓
COMPLETED

Alternative:
DECLINED
CANCELLED

---

## 5. Notification Events

Expert:
- Verification submitted
- More information requested
- Verification approved/rejected
- New engagement request
- Request accepted/declined

Institution:
- Requirement created
- Relevant experts found
- Expert accepted/declined
- Engagement confirmed

Admin:
- New verification application
- Document requiring review
- Reference check pending

---

## 6. Audit Events

Generate audit entries for:
- Account creation
- Profile updates
- Document upload
- Verification submission
- Document approval/rejection
- Reference verification
- Verification decision
- Requirement creation
- Engagement request
- Request acceptance/decline
- Engagement confirmation

---

## 7. Demo Scenarios

### Scenario A — Expert Verification
1. Log in as expert
2. Complete profile
3. Upload demo documents
4. Submit verification
5. Log in as admin
6. Review application
7. Approve evidence
8. Mark reference verified
9. Approve expert
10. Log back in as expert
11. Show Verified & Certified status

### Scenario B — Institution Discovery
1. Log in as institution
2. Create requirement
3. Search matching experts
4. Filter by domain/availability
5. Open expert profile
6. Review verification
7. Send request

### Scenario C — Engagement
1. Log in as expert
2. View request
3. Accept
4. Show confirmation
5. View engagement record
6. Show audit trail
