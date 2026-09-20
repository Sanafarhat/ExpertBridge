# ExpertBridge — UI/UX Specification

## 1. Design Goal
ExpertBridge should look like a mature institutional SaaS product, not a generic AI-generated landing page.

Desired qualities:
- Secure
- Institutional
- Trustworthy
- Premium
- Intelligent
- Calm
- Professional

Avoid:
- Purple AI aesthetics
- Excessive gradients
- Neon overload
- Cartoon illustrations
- Generic stock photos
- Huge floating decorative blobs
- Excessive glassmorphism
- Excessive rounded cards
- Template-like layouts

## 2. Brand Colors
Primary deep navy:
#071426

Secondary navy:
#0B1F3A

Royal blue:
#2563EB

Accent cyan:
#38BDF8

Light background:
#F8FAFC

Cool surface:
#EAF2F8

Slate text:
#64748B

Use blue for actions, green for verified/success, amber for pending, red for rejection/errors.

## 3. Typography
Use Inter, Manrope, or Geist.
Strong compact headings.
Highly readable body text.
Moderate corner radius: approximately 8–14px.

## 4. Homepage Structure

### Navbar
Logo: ExpertBridge with a simple bridge/connection icon.
Navigation:
- How It Works
- For Institutions
- For Experts
- Verification
- About

Actions:
- Sign In
- Get Started

Sticky navbar that becomes slightly more compact on scroll.

### Hero
Eyebrow:
TRUSTED EXPERT DISCOVERY FOR EDUCATION

Headline:
Find the Right Expert. Know They’re Verified.

Supporting copy:
ExpertBridge helps educational institutions discover, verify, and engage credible domain experts through one structured, transparent workflow.

Primary CTA:
Find an Expert

Secondary CTA:
Become a Verified Expert

Trust line:
Built for universities, colleges, IICs, EDCs and academic program teams.

Hero visual:
Create an abstract verification/network interface rather than a generic illustration.

Center:
Verified Expertise

Connected nodes:
Domain
Credentials
References
Availability
Engagements

Use subtle animated connection lines.

### Trust Section
"Designed for institutions where credibility and documentation matter."

Categories:
Universities
Colleges
IICs
EDCs
Incubation Centres
Academic Programs

Do not fabricate institution logos.

### Problem Section
Heading:
Expert discovery is still too informal.

Show:
Personal contacts
WhatsApp groups
Google searches
Manual coordination

Problems:
Hard to verify
No centralized records
No authorization trail
Last-minute coordination
Difficult audit documentation

### Workflow Section
Heading:
One workflow from discovery to verified engagement.

Five steps:
01 Institution submits requirement
02 Relevant experts are discovered
03 Credentials/documents are reviewed
04 Institutional references are verified
05 Engagement is confirmed

### Verification Section
Heading:
Verification is the foundation.

Visual sequence:
Professional Details
↓
Supporting Documents
↓
Past Engagements
↓
Institution References
↓
Verification Review
↓
Verified & Certified

Show:
Verification status
Evidence reviewed
Institution references
Verified engagements

Clarification:
Certification confirms authenticity and authorization of submitted credentials. It is not a ranking of professional skill.

### Expert Discovery Preview
Heading:
Search by expertise, not by connections.

Search:
"Search experts, domains or expertise..."

Filters:
Domain
Experience
Program Type
Availability
Verification Status
Location

Expert cards:
- Professional avatar
- Name
- Designation
- Organization
- Expertise tags
- Experience
- Verified & Certified badge
- Verified engagement count
- Availability

### Institutional Workflow
Show requirement → matching → request → confirmation.

### Audit Section
Show timeline-style records:
- Application submitted
- Documents reviewed
- Reference verified
- Verification approved
- Engagement confirmed

### Final CTA
Heading:
Better expert discovery starts with better verification.

Buttons:
Find an Expert
Become a Verified Expert

## 5. Expert Profile
Header:
Avatar, name, designation, organization, verification badge, availability.

Sections:
About
Areas of Expertise
Verified Engagements
Professional Experience
Institutional References
Verification Status
Availability

Dedicated verification panel:
EXPERTBRIDGE VERIFICATION
Verified & Certified
Evidence reviewed
Institution references
Verified engagements
Verification completion date

Do not publicly expose sensitive documents.

## 6. Institution Dashboard
Sidebar:
Overview
Find Experts
My Requests
Engagements
Saved Experts
Documents
Reports
Institution Profile
Settings

Dashboard:
Active Requests
Confirmed Engagements
Verified Experts
Pending Actions

Recent requests table:
Requirement
Expert
Date
Status
Last Updated
Action

Recommended Experts section.

## 7. Admin Dashboard
Sidebar:
Overview
Expert Applications
Verification Queue
Institutions
Engagements
Documents
Audit Logs
Reports
Settings

Metrics:
Pending Verification
Under Review
Verified Experts
Reference Checks
Documents Pending

Verification queue:
Expert
Domain
Submitted
Documents
Reference Status
Current Stage
Action

## 8. Verification Workspace
Use a three-column layout:
Left: expert summary
Center: documents/evidence
Right: verification actions

Document actions:
View
Approve
Reject
Request clarification

Verification timeline:
Application submitted
Documents reviewed
Reference contacted
Reference confirmed
Verification approved

Reference verification:
Institution
Contact status
Response
Nature of engagement
Feedback

This is a manual verification workflow for the MVP; do not fake real external calls.

## 9. Expert Onboarding
Six steps:
01 Professional Profile
02 Expertise
03 Experience
04 Engagements
05 Documents
06 Review & Submit

Show persistent progress.

## 10. Motion
Use Framer Motion.
- Fade/slide page entrance
- Subtle card elevation
- Small button scale interaction
- Subtle verification pulse
- Counter animation
- Scroll reveal
- Modal scale/fade
- Smooth sidebar transitions

Motion must communicate state, not decorate the page.

## 11. Accessibility
Use semantic HTML, keyboard navigation, ARIA labels, visible focus states, strong contrast, accessible forms, and status indicators that do not rely only on color.

## 12. Responsive
Optimize for:
1440px, 1280px, 1024px, 768px, 390px.

Mobile navigation becomes a drawer.
Tables become cards or horizontally scrollable.
Do not simply shrink desktop UI.
