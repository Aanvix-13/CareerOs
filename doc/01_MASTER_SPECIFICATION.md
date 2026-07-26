# CareerOS Master Specification

> Single Source of Truth (SSOT) for CareerOS MVP

---

# Document Metadata

| Field | Value |
|-------|-------|
| Document ID | MS-000 |
| Document Name | Master Specification |
| Version | 1.0.0 |
| Status | Approved |
| Product | CareerOS |
| Product Stage | MVP |
| Repository | CareerOS |
| Owner | Founder |
| Audience | AI Coding Agents, Developers, Product Team |
| Priority | Critical |

---

# AI Context

This document is the highest-level engineering specification for CareerOS.

It defines the complete product vision, business rules, technical boundaries, implementation constraints, and engineering requirements for the MVP.

All implementation documents derive their requirements from this document.

If another document conflicts with this specification, this specification takes precedence unless an approved Architecture Decision Record (ADR) explicitly overrides it.

The AI coding agent MUST treat this document as the primary source of truth.

---

# 1. Product Identity

## Product Name

CareerOS

## Product Category

Software as a Service (SaaS)

## Product Type

Career Management Platform

## Target Platform

Responsive Web Application

## Development Approach

AI-Assisted Development

## Business Model

Freemium SaaS

## Current Stage

Minimum Viable Product (MVP)

---

# 2. Product Vision

CareerOS exists to become the most organized workspace for students and job seekers to manage every stage of their job search.

The product does not attempt to replace job portals.

Instead, CareerOS becomes the personal operating system that users rely on after discovering opportunities.

---

# 3. Mission Statement

Help job seekers stay organized, reduce missed opportunities, and simplify the application process through one reliable workspace.

---

# 4. Problem Statement

Job seekers typically manage their applications using multiple disconnected tools.

Examples include:

- LinkedIn
- Internshala
- Naukri
- Company career pages
- Google Sheets
- Notes applications
- Calendar applications
- Email

This fragmented workflow causes several problems:

- Forgotten applications
- Missed interviews
- Missed follow-ups
- Resume version confusion
- Duplicate applications
- Poor visibility into job search progress

CareerOS solves these problems by providing one centralized workspace.

---

# 5. Product Positioning

CareerOS is a career management platform.

CareerOS is NOT:

- a job board
- a recruitment platform
- a resume writing service
- a social network
- a messaging platform
- an AI interview coach
- a freelancing marketplace

CareerOS complements existing job portals instead of competing with them.

Users discover jobs elsewhere.

CareerOS manages everything after the user decides to apply.

---

# 6. Target Users

## Primary Users

- Engineering students
- College students
- Final-year students
- Fresh graduates
- Internship seekers
- Entry-level job seekers

## Secondary Users

- Career switchers
- Professionals managing multiple applications

---

# 7. Core User Goals

CareerOS should enable users to answer these questions instantly:

- Where have I applied?
- Which resume did I send?
- What interview is scheduled next?
- Which recruiter should I follow up with?
- Which applications are still active?
- Which applications were rejected?
- How many applications have I submitted this month?

If CareerOS consistently answers these questions, it delivers its core value.

---

# 8. Product Objectives

| ID | Objective | Priority |
|----|-----------|----------|
| OBJ-001 | Launch MVP quickly | P0 |
| OBJ-002 | Solve job search organization | P0 |
| OBJ-003 | Validate product-market fit | P0 |
| OBJ-004 | Collect structured user feedback | P0 |
| OBJ-005 | Build scalable architecture | P1 |
| OBJ-006 | Prepare for premium features | P1 |

---

# 9. Success Criteria

The MVP is considered successful when users can complete the following workflow without confusion.

1. Register an account.
2. Sign in securely.
3. Complete profile setup.
4. Create or upload resume records.
5. Add job applications.
6. Update application status.
7. Schedule interview rounds.
8. Create reminders.
9. Submit product feedback.
10. Return later and continue managing their job search.

---

# 10. Scope Definition

## Included in MVP

| Module ID | Module | Priority |
|------------|---------|----------|
| MOD-001 | Authentication | P0 |
| MOD-002 | User Profile | P0 |
| MOD-003 | Dashboard | P0 |
| MOD-004 | Resume Library | P0 |
| MOD-005 | Application Tracker | P0 |
| MOD-006 | Interview Tracker | P0 |
| MOD-007 | Reminder System | P0 |
| MOD-008 | Feedback Center | P0 |
| MOD-009 | Basic Analytics | P1 |
| MOD-010 | Notification Center | P1 |

---

## Explicitly Excluded from MVP

The following features SHALL NOT be implemented in MVP Version 1.

- AI Resume Builder
- AI Interview Coach
- Chrome Extension
- Mobile Application
- Recruiter Dashboard
- Team Collaboration
- Job Marketplace
- Social Feed
- Referral Marketplace
- Company Review Portal
- Browser Automation
- Automatic Job Import

These features belong to future roadmap versions only.

---

# 11. Product Principles

## PP-001

Keep the MVP intentionally small.

## PP-002

Solve one problem exceptionally well before expanding.

## PP-003

Every feature must provide direct value to the user's job search workflow.

## PP-004

Simplicity is preferred over feature quantity.

## PP-005

User data privacy is mandatory.

## PP-006

Collect feedback continuously.

## PP-007

Prefer reliability over automation.

## PP-008

Optimize for long-term maintainability.

---

# 12. Architecture Decisions

## ADR-001

### Title

CareerOS is not a Job Board.

### Status

Accepted

### Reason

Existing platforms already solve job discovery effectively.

CareerOS focuses exclusively on organization after users decide to apply.

---

## ADR-002

### Title

Freemium Business Model

### Status

Accepted

### Decision

Users receive a useful free plan.

Premium capabilities will be introduced only after product validation.

Payments are outside the scope of MVP Version 1.

---

## ADR-003

### Title

AI-First Development

### Status

Accepted

### Decision

The product is designed to be implemented using AI coding tools supported by structured engineering specifications.

---
---

# 13. User Roles

## ROLE-001 — Guest

### Description

A visitor who has not authenticated.

### Permissions

- View landing page
- View pricing page
- View feature overview
- Register
- Login
- Reset password

### Restrictions

Guest users SHALL NOT access any user data.

---

## ROLE-002 — Authenticated User

### Description

A registered user with an active account.

### Permissions

- Manage profile
- Manage resumes
- Manage job applications
- Manage interview rounds
- Manage reminders
- View dashboard
- Submit feedback
- View analytics
- Manage account settings

### Restrictions

Users SHALL access only their own data.

---

## ROLE-003 — Administrator

Administrator functionality is NOT included in MVP.

The system architecture SHALL allow future addition of administrative features without breaking existing modules.

---

# 14. Functional Requirements

---

## FR-001

### Title

User Registration

### Priority

P0

### Description

The system SHALL allow a guest user to create an account.

### Acceptance Criteria

- Email is unique.
- Password is securely stored.
- User account is created.
- User profile is initialized.

---

## FR-002

### Title

User Authentication

### Priority

P0

### Description

The system SHALL authenticate registered users.

### Acceptance Criteria

- Valid credentials allow login.
- Invalid credentials display an error.
- Session is securely created.

---

## FR-003

### Title

Profile Management

### Priority

P0

### Description

Users SHALL manage their personal profile.

### Profile Fields

- Full Name
- College
- Degree
- Graduation Year
- Preferred Job Role
- Preferred Location

---

## FR-004

### Title

Resume Library

### Priority

P0

### Description

Users SHALL create multiple resume records.

Each resume record may contain:

- Resume Name
- Version
- PDF File
- Notes

Users SHALL be able to select a default resume.

---

## FR-005

### Title

Application Tracking

### Priority

P0

### Description

Users SHALL create job application records.

Each application SHALL contain:

- Company Name
- Job Title
- Application Date
- Source
- Resume Used
- Current Status
- Notes

---

## FR-006

### Title

Application Status Updates

Users SHALL update application status.

Supported statuses:

- Wishlist
- Preparing
- Applied
- Assessment
- Interview
- Offer
- Rejected
- Accepted
- Archived

Status history SHALL be preserved.

---

## FR-007

### Title

Interview Management

Users SHALL record interview information.

Each interview SHALL support:

- Interview Round
- Interview Type
- Date
- Time
- Interviewer
- Meeting Link
- Notes
- Result

---

## FR-008

### Title

Reminder Management

Users SHALL create reminders.

Reminder examples:

- Follow-up
- Interview
- Assessment
- Document Submission
- Offer Expiry

---

## FR-009

### Title

Feedback Center

Users SHALL submit product feedback.

Supported feedback types:

- Bug Report
- Feature Request
- Improvement Suggestion
- General Review

---

## FR-010

### Title

Dashboard

The dashboard SHALL display:

- Total Applications
- Active Applications
- Interviews
- Upcoming Reminders
- Recent Activity

---

## FR-011

### Title

Analytics

Users SHALL view basic statistics.

Examples:

- Applications This Month
- Interview Count
- Offer Count
- Rejection Count
- Success Rate

---

# 15. Business Rules

---

## BR-001

Every account belongs to one person.

Shared accounts are not supported.

---

## BR-002

Every resume belongs to one authenticated user.

---

## BR-003

Every application belongs to exactly one user.

---

## BR-004

Every interview belongs to exactly one application.

---

## BR-005

Every reminder belongs to one application or one interview.

---

## BR-006

Deleting an application SHALL NOT automatically delete the user's resumes.

---

## BR-007

Deleting an application SHALL delete related interviews and reminders after user confirmation.

---

## BR-008

Users SHALL be able to restore accidentally deleted applications from Trash for a limited period (future feature).

For MVP, permanent deletion is acceptable.

---

## BR-009

Users SHALL NOT access another user's records.

---

## BR-010

Every feature SHALL require authentication unless explicitly documented otherwise.

---

---

# 16. Non-Functional Requirements

The following non-functional requirements apply to the entire CareerOS MVP.

## NFR-001 Availability

The application SHOULD maintain an uptime of at least 99% during MVP.

---

## NFR-002 Performance

Dashboard pages SHOULD load within 2 seconds under normal usage.

API responses SHOULD complete within 500 milliseconds for standard operations.

---

## NFR-003 Scalability

The architecture SHALL support future horizontal scaling without requiring major architectural changes.

---

## NFR-004 Security

All authenticated endpoints MUST verify user identity.

All user data MUST remain isolated.

Users SHALL NEVER access another user's data.

---

## NFR-005 Privacy

CareerOS SHALL collect only information necessary for providing the service.

User data SHALL NOT be shared with third parties without user consent.

---

## NFR-006 Reliability

The application SHALL gracefully handle unexpected failures.

Users SHOULD receive meaningful error messages instead of system errors.

---

## NFR-007 Maintainability

The codebase SHALL remain modular.

Business logic SHALL remain independent from UI implementation.

---

## NFR-008 Accessibility

The application SHOULD be usable on desktop, tablet, and mobile browsers.

Interactive components SHOULD be keyboard accessible.

---

## NFR-009 Browser Support

Supported browsers:

- Chrome
- Edge
- Firefox
- Safari

Latest stable versions only.

---

## NFR-010 Logging

Critical application events SHALL be logged.

Examples:

- Login
- Registration
- Password Reset
- Application Creation
- Resume Upload
- Interview Creation

---

# 17. Security Principles

## SEC-001 Authentication Required

All protected resources require authentication.

---

## SEC-002 Authorization

Users may access only resources they own.

---

## SEC-003 Password Storage

Passwords MUST be hashed using a secure industry-standard algorithm.

Passwords SHALL NEVER be stored in plain text.

---

## SEC-004 HTTPS

All production traffic MUST use HTTPS.

---

## SEC-005 Input Validation

All user input MUST be validated on both client and server.

---

## SEC-006 SQL Injection Protection

Database queries SHALL use parameterized queries or ORM protection.

---

## SEC-007 XSS Protection

User-generated content SHALL be sanitized before rendering.

---

## SEC-008 CSRF Protection

State-changing requests SHALL implement CSRF protection where applicable.

---

## SEC-009 File Upload Security

Uploaded files SHALL be validated for:

- File type
- File size
- Malicious content

Executable files SHALL NOT be accepted.

---

## SEC-010 Rate Limiting

Authentication endpoints SHOULD implement rate limiting.

---

# 18. Global Validation Rules

## VAL-001

Email addresses MUST be unique.

---

## VAL-002

Required fields SHALL NOT be empty.

---

## VAL-003

Dates SHALL use ISO-8601 format.

---

## VAL-004

Uploaded resumes SHALL be PDF format only for MVP.

---

## VAL-005

Maximum resume size SHALL be 5 MB.

---

## VAL-006

Application status MUST belong to the predefined status list.

---

## VAL-007

Reminder dates SHALL NOT be created in the past.

---

## VAL-008

Interview dates SHALL support timezone-aware timestamps.

---

## VAL-009

Every record SHALL contain:

- Created At
- Updated At

---

## VAL-010

Primary keys SHALL use UUID identifiers.

---

# 19. Repository Governance

## GOV-001

This repository is the single source of truth for CareerOS.

---

## GOV-002

Every feature MUST be documented before implementation.

---

## GOV-003

Every implementation MUST satisfy documented acceptance criteria.

---

## GOV-004

Undocumented features SHALL NOT be implemented.

---

## GOV-005

Breaking architectural decisions require an Architecture Decision Record (ADR).

---

## GOV-006

Documentation SHALL be updated before code changes.

---

# 20. MVP Exit Criteria

The MVP is complete when users can:

- Register
- Login
- Manage profile
- Create resume records
- Track applications
- Track interviews
- Manage reminders
- View dashboard
- Submit feedback

All P0 features must pass testing before release.

