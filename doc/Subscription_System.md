# CareerOS
# Subscription_System.md
## Level 3 Technical Specification

**Part 1 of 12**

**Version:** 1.0.0
**Status:** Approved
**Module:** Subscription & Monetization System
**Product:** CareerOS
**Document Type:** Level 3 Technical Specification
**Architecture:** Next.js + Clerk + Prisma + Supabase PostgreSQL + Cloudinary + Resend

---

# 1. Document Purpose

## 1.1 Purpose

This document defines the complete Subscription System architecture for CareerOS.

The purpose of this document is to refine the existing MVP by introducing a scalable, production-ready subscription system while preserving the current application architecture and business workflows.

This document serves as the single source of truth for developers, AI coding agents, designers, QA engineers, and future contributors.

The Subscription System controls:

- User plans
- Feature access
- Usage limits
- Storage quotas
- AI entitlements
- Upgrade and downgrade workflows
- Future payment readiness
- Subscription analytics

This document does **not** redesign the existing MVP.

Instead, it integrates subscription management into the current product.

---

## 1.2 Objectives

The Subscription System SHALL:

- Support three subscription plans.
- Enforce plan-based feature access.
- Track user usage.
- Protect premium functionality.
- Control AI costs.
- Control storage usage.
- Enable future payment gateways.
- Scale without architectural redesign.

---

## 1.3 Intended Audience

This document is written for:

- Frontend Developers
- Backend Developers
- Database Engineers
- UI/UX Designers
- AI Coding Tools
- Future Contributors

The document assumes no implementation decisions outside of what is explicitly defined here.

---

# 2. Product Vision

CareerOS is designed to become the student's complete Career Operating System.

Instead of offering isolated tools, CareerOS centralizes the entire placement journey into one platform.

The Subscription System supports this vision by providing progressive value as users become more engaged.

The subscription model must encourage long-term adoption while maintaining a useful free experience.

---

# 3. Subscription Philosophy

The subscription strategy is based on three principles.

## Principle 1 — Free Must Be Useful

The Free plan is not a temporary trial.

It is a complete starter experience.

Users should be able to manage real job applications before reaching limits.

The goal is trust and adoption.

---

## Principle 2 — Pro Removes Workflow Friction

Pro exists for active job seekers.

The value proposition is productivity.

Users pay because they no longer want operational limits.

Pro focuses on:

- Unlimited tracking
- Better organization
- Better reporting
- Better workflow
- Better productivity

Pro does **not** include AI.

---

## Principle 3 — Elite Improves Career Outcomes

Elite exists for students who want an advantage.

Every Elite feature must directly help users get more interviews.

Examples include:

- Resume optimization
- ATS analysis
- Resume-to-job matching
- AI interview preparation
- AI cover letter generation
- Career insights

Elite is an AI-powered career assistant rather than simply another subscription tier.

---

# 4. Business Objectives

The Subscription System supports CareerOS business growth.

Primary objectives include:

- Increase user retention.
- Increase paid conversions.
- Maintain a valuable free experience.
- Generate recurring monthly revenue.
- Reduce infrastructure abuse.
- Control AI costs.
- Control storage usage.
- Prepare for payment gateway integration.

Secondary objectives include:

- Product analytics
- Usage reporting
- Revenue forecasting
- Subscription management
- Future enterprise expansion

---

# 5. Scope

## Included

The Subscription System includes:

- Subscription plans
- Feature gating
- Usage tracking
- Storage limits
- AI limits
- Upgrade flow
- Downgrade flow
- Subscription management
- Plan comparison
- Admin subscription controls
- Billing-ready architecture

---

## Excluded

This document does not define:

- Razorpay implementation
- Stripe implementation
- Coupons
- Referral programs
- Enterprise licensing
- Organization plans
- Family plans
- Marketplace
- API billing

These modules will be documented separately.

---

# 6. Existing MVP Integration

The Subscription System refines the existing MVP.

The following modules remain functionally unchanged.

| Module | Status |
|---------|---------|
| Clerk Authentication | Existing |
| User Dashboard | Existing |
| Resume Library | Existing |
| Applications | Existing |
| Interviews | Existing |
| Reminders | Existing |
| Notifications | Existing |
| Analytics | Existing |
| Admin Dashboard | Existing |

The Subscription System only introduces plan-based rules.

Business workflows remain unchanged.

---

# 7. Supported Plans

CareerOS supports exactly three plans.

## Free

Purpose:

Allow new users to experience CareerOS without payment.

Target Audience:

- Students
- Internship seekers
- First-time users

---

## Pro

Purpose:

Provide unlimited productivity tools for active applicants.

Target Audience:

- Final-year students
- Daily job seekers
- Professionals changing jobs

---

## Elite

Purpose:

Provide AI-powered career assistance.

Target Audience:

- Competitive placement preparation
- Serious job seekers
- Users wanting resume optimization and interview preparation

No additional plans are supported in this version.

---

# 8. Pricing Strategy

## Monthly Pricing

| Plan | Price |
|--------|---------|
| Free | ₹0 |
| Pro | ₹199 |
| Elite | ₹499 |

---

## Yearly Pricing

| Plan | Price |
|--------|---------|
| Free | ₹0 |
| Pro | ₹1,999 |
| Elite | ₹4,999 |

---

## Pricing Rules

- Prices shall default to INR.
- Monthly and yearly pricing shall always be displayed.
- Yearly plans shall clearly indicate savings.
- Pricing values shall be configurable without code changes.

---

# 9. High-Level User Journey

```text
Visitor
    ↓
Landing Page
    ↓
Register (Clerk)
    ↓
Free Plan Assigned
    ↓
Uses CareerOS
    ↓
Approaches Usage Limit
    ↓
Upgrade Prompt
    ↓
Selects Pro or Elite
    ↓
Subscription Activated
    ↓
Immediate Feature Access
```

---

# 10. Subscription Lifecycle

Every newly registered user begins with the Free plan.

Possible lifecycle:

```text
Visitor
    ↓
Register
    ↓
Free
    ↓
Upgrade
    ↓
Pro
    ↓
Upgrade
    ↓
Elite
    ↓
Downgrade
    ↓
Pro
    ↓
Downgrade
    ↓
Free
```

Future versions may include:

- Trial
- Payment Pending
- Past Due
- Cancelled

These states are intentionally reserved for future billing implementation.

---

# 11. Core Design Principles

The Subscription System follows these engineering principles.

### Transparency

Users must always know:

- Current plan
- Usage
- Limits
- Upgrade benefits

---

### Predictability

No hidden limitations.

Every restriction must be communicated before it affects the user.

---

### Scalability

Future plans should be added through configuration rather than major code changes.

---

### Security

All feature access decisions must be enforced on the server.

The frontend must never determine subscription access independently.

---

### Extensibility

The architecture should support future additions including:

- Student Plus
- Team Plans
- University Plans
- Enterprise Plans

without redesigning the database or business logic.

---

# 12. Success Criteria

The Subscription System is considered complete when:

- Three plans are fully implemented.
- Plan limits are enforced consistently.
- Feature gating works across all modules.
- Usage tracking is accurate.
- Storage quotas are enforced.
- AI access is restricted to Elite.
- Upgrade and downgrade workflows function correctly.
- Admins can manage subscriptions.
- The architecture is ready for future payment integration.

---

# 13. Assumptions

The Subscription System assumes:

- Clerk manages authentication.
- Prisma manages database access.
- Supabase PostgreSQL stores relational data.
- Cloudinary stores uploaded files.
- Resend sends transactional emails.
- Gemini powers Elite AI features.
- Payment gateways will be integrated in a future phase.

---

# 14. Out of Scope

The following features are intentionally excluded from this specification:

- Team subscriptions
- Referral rewards
- Affiliate system
- Coupons
- AI credit purchases
- Marketplace
- White-label deployments
- Mobile subscription handling

---

# 15. Change Log

| Version | Date | Description |
|----------|------|-------------|
| 1.0.0 | Initial Release | Created Level 3 Subscription System architecture for CareerOS MVP refinement |

---
# 16. Plan Specifications

This section defines the complete feature allocation, usage limits, storage quotas, and entitlement rules for every CareerOS subscription plan.

The Subscription Service SHALL use these specifications as the authoritative source when determining user permissions.

The values defined in this document SHALL NOT be hardcoded throughout the application. They SHALL be managed through a centralized configuration layer.

---

# 17. CareerOS Free

## 17.1 Purpose

The Free plan introduces users to CareerOS.

It provides enough functionality for students to organize their job search while encouraging upgrades as their usage grows.

The Free plan is intended for:

- New users
- Students exploring CareerOS
- Internship seekers
- Users applying occasionally

The Free plan SHALL never feel like a temporary trial.

---

## 17.2 Usage Limits

| Feature | Limit |
|----------|------:|
| Job Applications | 10 |
| Resume Uploads | 5 |
| Interview Schedules | 10 |
| Active Reminders | 25 |
| Resume Storage | 100 MB |
| Profile Image | 1 |
| Notifications | Unlimited |
| Email Notifications | Unlimited |

---

## 17.3 Available Features

Free users SHALL have access to:

- Dashboard
- User Profile
- Resume Library
- Application Tracker
- Interview Tracker
- Reminder System
- Notification Center
- Calendar
- Basic Analytics
- Search
- Basic Filters

---

## 17.4 Restricted Features

Free users SHALL NOT access:

- Export PDF
- Export CSV
- Resume Version History
- Custom Tags
- Archive Applications
- Dashboard Customization
- Advanced Analytics
- AI Workspace

Attempting to access these features SHALL display an upgrade prompt.

---

# 18. CareerOS Pro

## 18.1 Purpose

CareerOS Pro removes productivity limitations.

It targets users actively applying for jobs who need unlimited organization capabilities.

Pro SHALL focus on workflow efficiency instead of AI.

---

## 18.2 Usage Limits

| Feature | Limit |
|----------|------:|
| Job Applications | Unlimited |
| Resume Uploads | Unlimited |
| Interview Schedules | Unlimited |
| Active Reminders | Unlimited |
| Resume Storage | 2 GB |
| Profile Image | 1 |
| Notifications | Unlimited |
| Email Notifications | Unlimited |

---

## 18.3 Additional Features

Pro SHALL include everything in Free plus:

- Unlimited Applications
- Unlimited Resume Uploads
- Unlimited Interviews
- Unlimited Reminders
- Advanced Analytics
- Export CSV
- Export PDF
- Resume Version History
- Rich Notes
- Attachments
- Archive Applications
- Custom Tags
- Dashboard Customization
- Advanced Search
- Advanced Filters
- Priority Email Notifications

---

## 18.4 AI Restrictions

Pro SHALL NOT include:

- ATS Resume Analysis
- Resume Match
- Resume Rewrite
- AI Cover Letter
- AI Interview Preparation
- AI Career Insights

Attempting to access these features SHALL display an Elite upgrade prompt.

---

# 19. CareerOS Elite

## 19.1 Purpose

CareerOS Elite provides intelligent career assistance powered by AI.

Elite combines unlimited productivity with AI-powered guidance throughout the placement journey.

---

## 19.2 Usage Limits

| Feature | Limit |
|----------|------:|
| Job Applications | Unlimited |
| Resume Uploads | Unlimited |
| Interview Schedules | Unlimited |
| Active Reminders | Unlimited |
| Resume Storage | 10 GB |
| Notifications | Unlimited |
| Email Notifications | Unlimited |

---

## 19.3 AI Workspace

Elite users SHALL receive access to the complete AI Workspace.

Modules include:

- AI Resume Analyzer
- Resume vs Job Description Match
- Resume Improvement Suggestions
- Resume Rewrite Assistant
- AI Cover Letter Generator
- AI Interview Preparation
- AI Career Insights

---

## 19.4 Monthly AI Quotas

To manage infrastructure costs, AI usage SHALL be limited monthly.

| AI Feature | Monthly Limit |
|-------------|-------------:|
| Resume Analysis | 50 |
| Resume Match | 50 |
| Resume Rewrite | 30 |
| Cover Letter Generation | 30 |
| Interview Preparation | 50 |
| Career Insights | 10 |

These limits MAY be modified through centralized configuration without code changes.

---

# 20. Feature Comparison Matrix

| Feature | Free | Pro | Elite |
|----------|:----:|:---:|:-----:|
| Dashboard | ✅ | ✅ | ✅ |
| Resume Library | ✅ | ✅ | ✅ |
| Application Tracker | ✅ | ✅ | ✅ |
| Interview Tracker | ✅ | ✅ | ✅ |
| Reminder System | ✅ | ✅ | ✅ |
| Notifications | ✅ | ✅ | ✅ |
| Basic Analytics | ✅ | ✅ | ✅ |
| Advanced Analytics | ❌ | ✅ | ✅ |
| Export PDF | ❌ | ✅ | ✅ |
| Export CSV | ❌ | ✅ | ✅ |
| Resume Version History | ❌ | ✅ | ✅ |
| Rich Notes | ❌ | ✅ | ✅ |
| Attachments | ❌ | ✅ | ✅ |
| Custom Tags | ❌ | ✅ | ✅ |
| Archive Applications | ❌ | ✅ | ✅ |
| Dashboard Customization | ❌ | ✅ | ✅ |
| AI Resume Analyzer | ❌ | ❌ | ✅ |
| Resume Match | ❌ | ❌ | ✅ |
| Resume Rewrite | ❌ | ❌ | ✅ |
| AI Cover Letter | ❌ | ❌ | ✅ |
| AI Interview Prep | ❌ | ❌ | ✅ |
| AI Career Insights | ❌ | ❌ | ✅ |

---

# 21. Upgrade Triggers

Upgrade prompts SHALL appear only when users reach meaningful boundaries.

The system SHALL NOT display unnecessary upgrade requests.

---

## 21.1 Usage Limit Triggers

Upgrade prompts SHALL appear when:

- Creating the 11th Application
- Uploading the 6th Resume
- Scheduling the 11th Interview
- Creating the 26th Active Reminder
- Exceeding Storage Quota

---

## 21.2 Feature Triggers

Upgrade prompts SHALL appear when users attempt to access:

- Export Features
- Advanced Analytics
- Dashboard Customization
- Resume Version History
- AI Workspace
- AI Resume Analysis
- Resume Match
- AI Cover Letter
- AI Interview Preparation

---

## 21.3 Upgrade Modal Requirements

Every upgrade modal SHALL include:

- Current Plan
- Current Usage
- Usage Limit
- Benefits of Upgrading
- Feature Comparison
- Upgrade Button
- Pricing Information

The modal SHALL clearly explain why the action is restricted.

---

# 22. Downgrade Rules

Users may downgrade their subscription at any time.

Upon downgrade:

- Existing data SHALL NOT be deleted.
- Premium features SHALL become inaccessible.
- Usage exceeding the new plan limit SHALL remain read-only until usage falls below the limit.
- Users SHALL NOT be allowed to create additional resources beyond the downgraded limits.

Example:

A user with 42 Applications downgrades to Free.

Result:

- All 42 Applications remain visible.
- Editing remains allowed where applicable.
- Creating the 43rd Application is blocked until the user upgrades again.

---

# 23. Storage Policies

CareerOS SHALL store uploaded files in Cloudinary.

Supabase PostgreSQL SHALL only store metadata.

Storage usage SHALL be calculated using actual uploaded file sizes.

Storage SHALL include:

- Resume PDFs
- Resume DOCX Files
- Attachments

Storage SHALL NOT include:

- Profile Information
- Notifications
- Applications
- Interview Records
- Reminder Records

Storage SHALL be displayed to the user in the Usage page.

Example:

```
Storage

72 MB / 100 MB

██████████░░░░░
72%
```

---

# 24. Database Architecture

This section defines the database architecture required to support the CareerOS Subscription System.

The subscription module SHALL integrate with the existing CareerOS database without affecting the current MVP modules.

The database SHALL support:

- Subscription Management
- Usage Tracking
- Feature Entitlements
- AI Usage Monitoring
- Future Billing
- Future Coupons
- Future Team Plans

The database SHALL remain normalized and scalable.

---

# 25. Design Principles

The database SHALL follow these principles.

## 25.1 Single Source of Truth

Subscription information SHALL exist only once.

Every feature check SHALL reference the Subscription System.

No module SHALL maintain its own subscription state.

---

## 25.2 No Hardcoded Limits

Application limits SHALL NOT be hardcoded inside services.

Instead, limits SHALL be loaded from centralized plan definitions.

Example

```

FREE

Applications = 10

Resumes = 5

Interviews = 10

Storage = 100MB

```

---

## 25.3 Extensibility

Adding a future subscription plan SHALL require only:

- Database configuration
- Admin configuration

No business logic modifications should be necessary.

---

# 26. Existing User Model

The current User model SHALL remain the primary identity record.

Example

```prisma
model User {
    id             String   @id @default(uuid())
    clerkId        String   @unique
    email          String   @unique
    fullName       String
    isSuspended    Boolean
    createdAt      DateTime
    updatedAt      DateTime
}
```

The Subscription System SHALL reference the User table using the internal UUID.

The Clerk ID SHALL only be used for authentication.

---

# 27. Subscription Model

Every user SHALL have exactly one active subscription.

```prisma
model Subscription {

    id             String   @id @default(uuid())

    userId         String   @unique

    plan           PlanType

    status         SubscriptionStatus

    billingCycle   BillingCycle

    startsAt       DateTime

    expiresAt      DateTime?

    cancelledAt    DateTime?

    createdAt      DateTime

    updatedAt      DateTime

    user User @relation(fields: [userId], references: [id])
}
```

---

## Purpose

Stores

- Current Plan
- Billing Cycle
- Status
- Renewal Dates

---

## Rules

One user

↓

One subscription

Never multiple active subscriptions.

---

# 28. Plan Enumeration

```prisma
enum PlanType {

    FREE

    PRO

    ELITE

}
```

---

# 29. Subscription Status

```prisma
enum SubscriptionStatus {

ACTIVE

CANCELLED

EXPIRED

SUSPENDED

}
```

Future versions MAY introduce

- TRIAL

- PAST_DUE

- PAYMENT_PENDING

without changing existing architecture.

---

# 30. Billing Cycle

```prisma
enum BillingCycle {

MONTHLY

YEARLY

}
```

Free users SHALL always use

```
MONTHLY
```

internally for consistency.

---

# 31. Usage Tracking Model

Every tracked feature SHALL maintain its own usage counter.

```prisma
model UsageCounter {

id String @id @default(uuid())

userId String

feature FeatureType

used Int

limit Int

periodStart DateTime

periodEnd DateTime

createdAt DateTime

updatedAt DateTime

}
```

---

## Purpose

Tracks

- Applications

- Resumes

- Interviews

- Reminders

- Storage

- AI Usage

---

## Rules

Every usage record belongs to exactly one user.

Usage SHALL be automatically updated.

---

# 32. Feature Enumeration

```prisma
enum FeatureType {

APPLICATIONS

RESUMES

INTERVIEWS

REMINDERS

STORAGE

AI_ANALYSIS

AI_MATCH

AI_REWRITE

AI_COVER_LETTER

AI_INTERVIEW

CAREER_INSIGHTS

}
```

---

# 33. Plan Definition Model

Plan definitions SHALL be stored separately.

```prisma
model PlanDefinition {

id String @id @default(uuid())

plan PlanType

monthlyPrice Decimal

yearlyPrice Decimal

configuration Json

createdAt DateTime

updatedAt DateTime

}
```

---

## Why?

Instead of

```
if(plan=="FREE")

limit=10
```

The backend SHALL load

```
FREE

↓

Configuration

↓

Application Limit = 10
```

This allows changing limits without changing backend logic.

---

# 34. AI Usage Model

Elite users SHALL have AI usage tracked separately.

```prisma
model AIUsage {

id String @id @default(uuid())

userId String

feature FeatureType

requestCount Int

month Int

year Int

createdAt DateTime

updatedAt DateTime

}
```

---

## Purpose

Tracks

- Resume Analysis

- Resume Match

- Resume Rewrite

- Cover Letter

- Interview Preparation

- Career Insights

---

# 35. Billing History

Future payment history SHALL use

```prisma
model BillingHistory {

id String @id @default(uuid())

userId String

subscriptionId String

amount Decimal

currency String

status String

provider String

providerReference String

paidAt DateTime?

createdAt DateTime

}
```

Current MVP SHALL keep this model ready.

Payment integration comes later.

---

# 36. Database Relationships

```
User

│

├────────────── Subscription

│

├────────────── UsageCounter

│

├────────────── BillingHistory

│

└────────────── AIUsage
```

One User

↓

One Subscription

One User

↓

Many Usage Counters

One User

↓

Many AI Logs

One User

↓

Many Billing Records

---

# 37. Feature Access Flow

Whenever a user performs an action

```
User

↓

API Request

↓

Authentication

↓

Subscription Lookup

↓

Plan Definition

↓

Usage Counter

↓

Allowed?

↓

YES

↓

Continue

OR

↓

NO

↓

Return Upgrade Response
```

Every restricted feature SHALL follow this workflow.

---

# 38. Upgrade Flow

```
FREE

↓

Clicks Upgrade

↓

Choose PRO

↓

Payment (Future)

↓

Subscription Updated

↓

Feature Access Updated

↓

Dashboard Refresh
```

The subscription update SHALL happen immediately after successful payment.

---

# 39. Downgrade Flow

```
ELITE

↓

Downgrade

↓

Subscription Updated

↓

Premium Features Locked

↓

Existing Data Preserved

↓

Creation Limits Applied
```

No existing user data SHALL be deleted automatically.

---

# 40. Database Constraints

The database SHALL enforce

- One active subscription per user.
- Foreign key integrity.
- UUID primary keys.
- Indexed userId fields.
- Indexed plan fields.
- Indexed feature fields.
- Cascade delete only where appropriate.
- Automatic timestamps.

---

# 41. Index Recommendations

Indexes SHALL exist on

Subscription

- userId
- plan
- status

UsageCounter

- userId
- feature

AIUsage

- userId
- month
- year

BillingHistory

- userId
- subscriptionId

Proper indexing is mandatory for dashboard performance.

---

# 42. Future Scalability

This database architecture SHALL support future additions including

- Student Plus

- Team Plans

- University Licenses

- Organization Accounts

- Referral Rewards

- Coupons

- AI Credits

without requiring major schema redesign.

---

# 43. Backend Architecture

This section defines the complete backend architecture for the CareerOS Subscription System.

The backend SHALL be responsible for all subscription logic.

The frontend SHALL never make subscription decisions.

Every feature access request MUST be validated by the backend.

---

# 44. Backend Design Principles

The Subscription System SHALL follow the existing CareerOS layered architecture.

```
Client

↓

Route Handler

↓

Authentication Middleware

↓

Subscription Middleware

↓

Validation

↓

Service Layer

↓

Repository Layer

↓

Prisma ORM

↓

Supabase PostgreSQL
```

Each layer SHALL have a single responsibility.

---

# 45. Authentication

CareerOS uses **Clerk Authentication**.

The Subscription System SHALL trust only authenticated Clerk sessions.

Authentication Flow

```
User

↓

Clerk Authentication

↓

Session Token

↓

Backend

↓

Verify Session

↓

Resolve User

↓

Continue
```

Unauthenticated requests SHALL return

```
401 Unauthorized
```

---

# 46. User Resolution

After Clerk authentication the backend SHALL resolve the internal CareerOS user.

Flow

```
Clerk User ID

↓

User Repository

↓

CareerOS User

↓

UUID

↓

Subscription Lookup
```

The backend SHALL NEVER use Clerk IDs for database relationships.

Only internal UUIDs SHALL be used.

---

# 47. Subscription Middleware

A dedicated Subscription Middleware SHALL execute after authentication.

Responsibilities

- Load current subscription
- Load usage counters
- Load plan definition
- Attach subscription context
- Reject suspended users
- Reject expired subscriptions (future)

Output

```
request.subscription

request.plan

request.usage
```

This context SHALL be available throughout the request lifecycle.

---

# 48. Feature Gate Middleware

Every premium endpoint SHALL pass through the Feature Gate.

Flow

```
Incoming Request

↓

Authentication

↓

Subscription Middleware

↓

Feature Gate

↓

Allowed?

↓

YES

↓

Continue

OR

↓

NO

↓

403 Response
```

The Feature Gate SHALL be reusable.

---

# 49. Feature Gate Rules

The Feature Gate SHALL verify

- Authentication
- Active Subscription
- User Suspension Status
- Required Plan
- Usage Limits
- AI Quotas

Only when every condition passes SHALL access be granted.

---

# 50. Repository Layer

Repositories SHALL communicate only with Prisma.

Repositories SHALL NOT contain business logic.

Repositories

```
SubscriptionRepository

UsageRepository

PlanRepository

BillingRepository

AIUsageRepository
```

Responsibilities

- Read
- Write
- Update
- Delete
- Pagination
- Filtering

Nothing more.

---

# 51. Service Layer

Business logic SHALL exist only inside Services.

Services

```
SubscriptionService

UsageService

FeatureGateService

BillingService

AIUsageService

PlanService
```

---

## SubscriptionService

Responsibilities

- Current plan
- Upgrade
- Downgrade
- Status
- Entitlements

---

## UsageService

Responsibilities

- Increment counters
- Reset periods
- Storage calculation
- Reminder counts
- Resume counts

---

## FeatureGateService

Responsibilities

- Validate feature access
- Validate limits
- Return allow/deny
- Generate upgrade reasons

---

## AIUsageService

Responsibilities

- Count AI requests
- Reset monthly usage
- Calculate remaining quota
- Log AI activity

---

## BillingService

Future responsibilities

- Razorpay
- Stripe
- Renewals
- Cancellation
- Refund support

---

# 52. API Architecture

Every Subscription API SHALL follow

```
API Route

↓

Validation

↓

Authentication

↓

Subscription Middleware

↓

Service

↓

Repository

↓

Database
```

Business logic SHALL NEVER exist inside Route Handlers.

---

# 53. Public APIs

Public APIs require no authentication.

### GET

```
/api/plans
```

Returns

- Plan names
- Prices
- Comparison
- Limits

---

### GET

```
/api/pricing
```

Returns

Current pricing configuration.

---

# 54. Authenticated APIs

### GET

```
/api/subscription
```

Returns

- Current Plan
- Billing Cycle
- Renewal Date
- Status

---

### GET

```
/api/subscription/usage
```

Returns

- Applications Used
- Resume Count
- Interview Count
- Reminder Count
- Storage Used
- AI Usage

---

### GET

```
/api/subscription/features
```

Returns feature entitlements.

---

### POST

```
/api/subscription/upgrade
```

Upgrades user subscription.

---

### POST

```
/api/subscription/downgrade
```

Downgrades subscription.

---

### POST

```
/api/subscription/cancel
```

Cancels subscription.

Future payment integration SHALL use this endpoint.

---

# 55. AI APIs

Elite only.

### POST

```
/api/ai/resume-analysis
```

---

### POST

```
/api/ai/resume-match
```

---

### POST

```
/api/ai/resume-rewrite
```

---

### POST

```
/api/ai/cover-letter
```

---

### POST

```
/api/ai/interview-prep
```

---

### GET

```
/api/ai/career-insights
```

Each endpoint SHALL validate

- Authentication
- Elite Plan
- Remaining AI Quota

before calling Gemini.

---

# 56. Validation Rules

Every request SHALL validate

Authentication

↓

Required Fields

↓

Subscription

↓

Usage

↓

Permissions

↓

Business Rules

Invalid requests SHALL NEVER reach the Service Layer.

---

# 57. Standard Responses

Success

```json
{
  "success": true,
  "data": {}
}
```

Validation Error

```json
{
  "success": false,
  "error": "Validation Failed"
}
```

Limit Reached

```json
{
  "success": false,
  "error": "Application limit reached.",
  "upgradeRequired": true
}
```

Feature Locked

```json
{
  "success": false,
  "error": "Elite subscription required.",
  "requiredPlan": "ELITE"
}
```

---

# 58. Usage Increment Flow

Example

User creates Application

```
Create Application

↓

Validate

↓

Save Application

↓

Increment Usage Counter

↓

Return Success
```

Usage SHALL update only after successful creation.

---

# 59. Storage Calculation

Whenever a file is uploaded

```
Upload Resume

↓

Cloudinary Upload

↓

Get File Size

↓

Update Storage Counter

↓

Return Success
```

Storage SHALL use actual uploaded file size.

---

# 60. AI Request Flow

```
Elite User

↓

Resume Analysis

↓

Authentication

↓

Subscription Check

↓

Quota Check

↓

Gemini API

↓

Response

↓

Increment AI Usage

↓

Return Result
```

The Gemini request SHALL NOT execute if quota is exhausted.

---

# 61. Error Handling

The backend SHALL return standardized errors.

Common Errors

```
401 Unauthorized

403 Forbidden

404 Not Found

409 Limit Reached

422 Validation Failed

429 Rate Limited

500 Internal Server Error
```

Every error SHALL contain

- Code
- Message
- Suggested Action

---

# 62. Audit Logging

The backend SHALL log

- Upgrade
- Downgrade
- Plan Change
- AI Usage
- Feature Denials
- Storage Violations
- Admin Overrides

Audit logs SHALL support future Admin Analytics.

---

# 63. Performance Requirements

Subscription validation SHALL complete within

```
<100ms
```

excluding external services.

Frequently accessed plan definitions SHALL be cached.

The backend SHALL minimize unnecessary database queries.

---

# 64. Security Requirements

The backend SHALL

- Never trust client plan data
- Never trust usage counters from the client
- Validate every premium request
- Protect AI endpoints
- Prevent usage manipulation
- Verify Clerk sessions
- Validate ownership of resources

All subscription decisions SHALL be server-side.

---

# 65. Frontend Architecture

This section defines the complete frontend architecture for the CareerOS Subscription System.

The frontend SHALL present subscription information clearly while relying on the backend for all authorization decisions.

The frontend SHALL NEVER determine feature access independently.

Every premium feature SHALL be validated by the backend before execution.

---

# 66. Frontend Design Principles

The Subscription UI SHALL follow these principles.

## 66.1 Transparency

Users must always know

- Current Plan
- Current Usage
- Current Limits
- Remaining Quota
- Upgrade Benefits

No subscription information shall be hidden.

---

## 66.2 Consistency

Every subscription component SHALL use the same visual language.

Examples

- Plan Cards
- Upgrade Buttons
- Lock States
- Usage Progress Bars
- AI Quota Cards

All pages SHALL follow the CareerOS design system.

---

## 66.3 Non-Intrusive Upgrades

Upgrade prompts SHALL appear only when relevant.

The application SHALL never spam users with upgrade popups.

Upgrade requests SHALL occur only when

- A feature is locked
- A usage limit is reached
- AI quota is exhausted
- Storage limit is exceeded

---

# 67. Navigation Integration

The Subscription System integrates into existing MVP navigation.

Settings

```
Settings

├── Profile

├── Notifications

├── Security

├── Subscription

└── Usage
```

Subscription SHALL NOT appear as a separate dashboard module.

It SHALL be accessible through Settings and contextual upgrade prompts.

---

# 68. Pricing Page

Route

```
/pricing
```

Purpose

Allow visitors and users to compare plans before upgrading.

---

## Layout

```
Hero

↓

Pricing Toggle

↓

Three Plan Cards

↓

Feature Comparison

↓

FAQ

↓

Upgrade CTA
```

---

## Pricing Toggle

Support

```
Monthly

Yearly
```

Yearly SHALL display savings.

Example

```
₹199/month

OR

₹1,999/year

Save ₹389
```

---

## Plan Cards

Each card SHALL display

- Plan Name
- Monthly Price
- Yearly Price
- Short Description
- Included Features
- Upgrade Button

Example

```
CareerOS Pro

₹199/month

Unlimited Applications

Unlimited Interviews

Unlimited Resumes

Advanced Analytics

Upgrade Now
```

---

## Recommended Plan

The Pro plan SHALL display

```
Most Popular
```

Elite SHALL display

```
Best Value
```

Free SHALL display

```
Get Started
```

---

# 69. Subscription Page

Route

```
/settings/subscription
```

Purpose

Allow users to manage their subscription.

---

## Page Sections

```
Current Plan

↓

Usage Summary

↓

Billing Information

↓

Upgrade Options

↓

Billing History (Future)
```

---

## Current Plan Card

Example

```
Current Plan

CareerOS Pro

Status

Active

Monthly Plan

Next Renewal

12 August 2026
```

---

## Available Actions

Free User

```
Upgrade
```

---

Pro User

```
Upgrade

Downgrade
```

---

Elite User

```
Manage Plan

Downgrade
```

---

# 70. Usage Page

Route

```
/settings/usage
```

Purpose

Display all tracked usage.

---

## Applications

```
Applications

7 / 10

███████░░░

70%
```

---

## Resume Storage

```
Storage

62 MB / 100 MB

██████░░░░

62%
```

---

## Interviews

```
Interviews

5 / 10
```

---

## Reminders

```
Reminders

13 / 25
```

---

## AI Usage (Elite)

```
Resume Analysis

17 / 50

█████░░░░░
```

Each section SHALL update in real time after successful operations.

---

# 71. Upgrade Modal

The Upgrade Modal SHALL be reusable throughout the application.

---

## Trigger Conditions

- Feature Locked
- Usage Limit Reached
- Storage Full
- AI Quota Exhausted

---

## Layout

```
Feature Locked

↓

Current Plan

↓

Current Usage

↓

Benefits of Upgrade

↓

Plan Comparison

↓

Upgrade Button

↓

Cancel
```

---

## Example

```
Application Limit Reached

You have used

10 of 10 Applications.

Upgrade to Pro for

Unlimited Applications

Unlimited Interviews

Unlimited Resumes

Upgrade Now
```

---

# 72. Feature Lock Components

Restricted features SHALL display lock indicators.

Example

```
Resume Analyzer

🔒 Elite Feature

Upgrade to unlock AI Resume Analysis.
```

Hovering or clicking SHALL open the Upgrade Modal.

---

# 73. Usage Progress Components

Reusable component

```
<UsageProgress />
```

Supported display

```
Applications

8 / 10

80%
```

States

- Safe
- Warning
- Critical

Recommended thresholds

Safe

```
0–70%
```

Warning

```
71–90%
```

Critical

```
91–100%
```

---

# 74. Dashboard Integration

The existing MVP dashboard SHALL include a Subscription Widget.

Location

Top-right section of dashboard.

---

## Widget Layout

```
CareerOS Free

Applications

7 / 10

Storage

62 MB / 100 MB

Upgrade →
```

Elite users SHALL instead see

```
Elite

AI Remaining

43 Analyses

28 Resume Matches

Upgrade Not Required
```

---

# 75. Empty States

The Subscription System SHALL define empty states.

Example

```
No Usage Yet

Start applying for jobs.

Create your first Application.
```

---

Example

```
No AI Usage

Analyze your resume to receive ATS insights.
```

---

# 76. Loading States

Every subscription page SHALL support loading states.

Examples

```
Loading Plans...

Loading Usage...

Loading AI Quota...
```

Skeleton loaders SHALL be preferred over spinners.

---

# 77. Error States

Examples

```
Unable to load subscription.

Retry
```

---

```
Unable to retrieve usage.

Refresh
```

---

```
Billing information unavailable.
```

Errors SHALL never expose backend implementation details.

---

# 78. Responsive Behaviour

Desktop

Three-column pricing cards.

Tablet

Two-column layout.

Mobile

Single-column stacked cards.

Usage charts SHALL become vertically scrollable on smaller devices.

---

# 79. Accessibility

The Subscription UI SHALL support

- Keyboard Navigation
- Screen Readers
- Proper Focus Indicators
- Sufficient Color Contrast
- Semantic HTML

Progress indicators SHALL include accessible text.

Example

```
Applications Used

7 of 10

70 Percent
```

---

# 80. User Experience Guidelines

The subscription experience SHALL encourage upgrades through value.

It SHALL NOT rely on frustration.

Users should understand

- Why a feature is locked.
- What they gain by upgrading.
- How much they have already used.
- How much remains.

Every upgrade message SHALL communicate benefits before pricing.

---

# 81. Future UI Extensions

The architecture SHALL support future additions without redesign.

Examples

- Student Discount Banner
- Coupon Code Input
- Referral Rewards
- Team Plan Selector
- Enterprise Contact Form
- Trial Countdown
- Payment History
- Invoice Downloads

---

# 82. Acceptance Criteria

The frontend implementation SHALL be complete when

- Pricing page is implemented.
- Subscription page is implemented.
- Usage page is implemented.
- Upgrade modal is reusable.
- Dashboard widget is implemented.
- Lock states exist for all premium features.
- Progress indicators update correctly.
- Responsive layouts work across devices.
- Backend validation is respected.
- No premium feature is unlocked through frontend manipulation.

---

# 83. AI Workspace Architecture

The AI Workspace is an **Elite-exclusive** module within CareerOS.

Its purpose is to provide intelligent career guidance using Google Gemini Pro.

Unlike the core CareerOS modules, the AI Workspace does not store career data permanently. Instead, it processes user input, generates recommendations, and logs AI usage.

The AI Workspace SHALL integrate seamlessly with the existing MVP.

---

# 84. AI Design Principles

The AI Workspace SHALL follow these principles.

## 84.1 AI Assists, Not Replaces

The AI SHALL assist users in improving resumes, preparing for interviews, and understanding job descriptions.

The AI SHALL NOT make hiring decisions or claim guaranteed interview success.

---

## 84.2 Context-Aware Responses

Whenever possible, the AI SHALL use:

- Resume data
- Job description
- User profile
- Skills
- Experience

to produce personalized responses.

---

## 84.3 Cost Efficiency

Every AI request SHALL be validated before sending a request to Gemini.

The backend SHALL verify:

- Active Elite subscription
- Remaining monthly quota
- Valid request payload

before calling the AI model.

---

# 85. AI Modules

The Elite plan SHALL include the following AI modules.

| Module | Purpose |
|----------|---------|
| ATS Resume Analyzer | Analyze ATS compatibility |
| Resume Match | Compare resume with job description |
| Resume Rewrite | Improve resume content |
| Cover Letter Generator | Generate personalized cover letters |
| Interview Preparation | Generate interview questions |
| Career Insights | Personalized improvement suggestions |

---

# 86. AI Dashboard

Route

```
/dashboard/ai
```

Layout

```
AI Workspace

↓

Resume Analyzer

↓

Resume Match

↓

Resume Rewrite

↓

Cover Letter Generator

↓

Interview Preparation

↓

Career Insights

↓

Usage Summary
```

Only Elite users SHALL access this page.

---

# 87. ATS Resume Analyzer

Purpose

Analyze a resume for Applicant Tracking System compatibility.

Input

- Resume PDF/DOCX
- Optional Job Role

Processing

```
Resume Upload

↓

Extract Text

↓

Gemini Prompt

↓

Analysis

↓

Structured Response

↓

Display Results
```

Output SHALL include:

- ATS Score
- Formatting Issues
- Keyword Suggestions
- Missing Skills
- Grammar Suggestions
- Readability
- Strengths
- Weaknesses
- Overall Recommendations

---

# 88. Resume vs Job Match

Purpose

Compare the user's resume with a job description.

Inputs

- Resume
- Job Description

Processing

```
Resume

+

Job Description

↓

Gemini

↓

Semantic Comparison

↓

Score

↓

Recommendations
```

Output

- Match Percentage
- Missing Keywords
- Matching Skills
- Missing Skills
- Suggested Improvements
- Recruiter Perspective

---

# 89. Resume Rewrite Assistant

Purpose

Improve resume quality while preserving factual information.

Input

- Existing Resume

Options

- Professional
- Fresher
- ATS Optimized
- Technical
- Executive

Output

- Improved Summary
- Better Bullet Points
- Strong Action Verbs
- ATS Friendly Formatting
- Improved Skills Section

The AI SHALL NOT fabricate work experience.

---

# 90. AI Cover Letter Generator

Purpose

Generate a personalized cover letter.

Inputs

- Resume
- Company Name
- Job Title
- Job Description

Output

- Professional Greeting
- Personalized Introduction
- Skills Alignment
- Closing Paragraph

Users SHALL be able to copy or download the generated content.

---

# 91. AI Interview Preparation

Purpose

Generate personalized interview preparation material.

Inputs

- Resume
- Job Role
- Experience Level

Outputs

- Technical Questions
- HR Questions
- Behavioral Questions
- Scenario-Based Questions
- Model Answers
- Improvement Tips

The generated questions SHALL adapt to the user's profile whenever possible.

---

# 92. AI Career Insights

Purpose

Provide long-term career guidance.

Example Outputs

- Skill Gap Analysis
- Recommended Certifications
- Learning Roadmap
- Career Growth Suggestions
- Industry Trends
- High-Demand Skills

Career insights SHALL be educational and advisory.

---

# 93. Prompt Pipeline

Every AI request SHALL follow a standardized workflow.

```
User Input

↓

Authentication

↓

Elite Validation

↓

Quota Check

↓

Prepare Prompt

↓

Gemini API

↓

Parse Response

↓

Store Usage

↓

Return Structured Result
```

The prompt sent to Gemini SHALL be generated on the server.

The frontend SHALL NEVER generate AI prompts.

---

# 94. Prompt Templates

Each AI module SHALL maintain its own prompt template.

Example

ATS Analyzer

```
System Prompt

↓

Resume Content

↓

Job Role

↓

Output Instructions

↓

Gemini
```

Prompt templates SHALL be version controlled.

---

# 95. AI Response Format

All AI responses SHALL be converted into structured JSON before reaching the frontend.

Example

```json
{
  "score": 86,
  "strengths": [],
  "weaknesses": [],
  "recommendations": []
}
```

The frontend SHALL never parse raw AI text directly.

---

# 96. Monthly AI Quotas

Elite users SHALL receive monthly AI credits.

| Feature | Monthly Limit |
|----------|--------------:|
| Resume Analysis | 50 |
| Resume Match | 50 |
| Resume Rewrite | 30 |
| Cover Letter | 30 |
| Interview Preparation | 50 |
| Career Insights | 10 |

Quota SHALL reset automatically at the beginning of each billing month.

---

# 97. AI Usage Tracking

Every AI request SHALL be logged.

Stored information

- User ID
- AI Feature
- Timestamp
- Request Count
- Execution Status
- Processing Time

Prompt content and generated responses SHALL NOT be permanently stored unless explicitly required.

---

# 98. Error Handling

Common AI errors

- Quota Exceeded
- Invalid Resume
- Empty Job Description
- Gemini Timeout
- AI Service Unavailable

Example Response

```json
{
  "success": false,
  "error": "Monthly Resume Analysis limit reached.",
  "upgradeRequired": false
}
```

---

# 99. Security

The AI Workspace SHALL

- Validate authentication
- Verify Elite subscription
- Verify monthly quota
- Sanitize inputs
- Prevent prompt injection where possible
- Rate-limit requests
- Protect API keys

Gemini API keys SHALL only exist on the server.

---

# 100. Acceptance Criteria

The AI Workspace implementation SHALL be complete when

- ATS Resume Analyzer works correctly.
- Resume Match returns structured results.
- Resume Rewrite improves existing resumes.
- Cover Letter Generator produces personalized letters.
- Interview Preparation generates relevant questions.
- Career Insights provide actionable recommendations.
- Monthly quotas are enforced.
- Usage is tracked accurately.
- Gemini integration is secure.
- All AI endpoints require Elite access.

---

# 101. Admin Dashboard Architecture

This section defines the administrative features required to manage subscriptions, users, storage, AI usage, and future billing.

Only users with the **Admin** role shall access these features.

The Admin Dashboard SHALL act as the central control panel for CareerOS.

---

# 102. Admin Design Principles

The Admin Dashboard SHALL follow these principles.

## 102.1 Centralized Management

Administrators SHALL manage all subscription-related activities from a single interface.

The dashboard SHALL eliminate the need for direct database modifications.

---

## 102.2 Read Before Modify

Administrative actions SHALL display relevant user information before changes are made.

Examples:

- Current Plan
- Usage
- Storage
- AI Consumption
- Subscription Status

---

## 102.3 Auditability

Every administrative action SHALL generate an audit log.

Examples:

- Upgrade User
- Downgrade User
- Suspend User
- Restore User
- Delete User
- Reset AI Usage

---

# 103. Navigation Structure

```
Admin Dashboard

├── Overview

├── Users

├── Subscriptions

├── AI Usage

├── Storage

├── Analytics

├── Billing (Future)

├── Audit Logs

└── Settings
```

---

# 104. Dashboard Overview

Route

```
/admin
```

Purpose

Provide a real-time overview of platform health.

---

## Dashboard Widgets

```
Total Users

↓

Active Users

↓

Free Users

↓

Pro Users

↓

Elite Users

↓

Storage Usage

↓

AI Requests Today

↓

Revenue (Future)
```

---

## Charts

The Overview page SHALL include:

- User Growth
- Subscription Distribution
- Daily Signups
- AI Usage Trend
- Storage Growth
- Resume Upload Trend

---

# 105. User Management

Route

```
/admin/users
```

Purpose

Manage all registered users.

---

## Table Columns

| Column | Description |
|----------|-------------|
| Avatar | Profile Image |
| Name | Full Name |
| Email | Email Address |
| Plan | Current Plan |
| Status | Active/Suspended |
| Joined | Registration Date |
| Storage | Current Usage |
| Actions | Management Buttons |

---

## Search

The Users page SHALL support:

- Name Search
- Email Search
- Clerk ID Search

---

## Filters

Supported filters:

- Free
- Pro
- Elite
- Active
- Suspended
- Recent Users

---

# 106. User Details Page

Selecting a user SHALL open a detailed profile.

Sections

```
Profile

↓

Subscription

↓

Usage

↓

AI Usage

↓

Applications

↓

Interviews

↓

Reminders

↓

Notifications

↓

Audit History
```

---

# 107. Subscription Management

Administrators SHALL be able to:

- Upgrade User
- Downgrade User
- Extend Subscription
- Cancel Subscription
- Reactivate Subscription

Changing a subscription SHALL immediately update feature access.

---

## Manual Upgrade Flow

```
Select User

↓

Choose New Plan

↓

Confirm

↓

Subscription Updated

↓

Notification Sent
```

---

# 108. Suspension Management

Administrators SHALL be able to suspend users.

Suspension SHALL:

- Block login
- Block API access
- Block AI requests
- Preserve all user data

Unsuspending SHALL restore access immediately.

---

# 109. AI Usage Management

Route

```
/admin/ai
```

Purpose

Monitor platform AI consumption.

---

## Metrics

Display:

- Total AI Requests
- Daily Requests
- Monthly Requests
- Elite Users
- Average Response Time
- Failed Requests

---

## User AI Details

Each Elite user SHALL display:

- Resume Analysis Count
- Resume Match Count
- Resume Rewrite Count
- Cover Letter Count
- Interview Prep Count
- Career Insight Count

---

## Admin Actions

Administrators SHALL be able to:

- Reset AI Quota
- Increase AI Quota
- Disable AI Access
- View AI History

---

# 110. Storage Monitoring

Route

```
/admin/storage
```

Purpose

Monitor Cloudinary storage usage.

---

## Metrics

Display:

- Total Storage Used
- Total Files
- Average Resume Size
- Largest Files
- Cloudinary Usage Percentage

---

## User Storage

Display:

- User Name
- Files Uploaded
- Storage Used
- Plan
- Last Upload

---

## Admin Actions

- Delete File
- Force Cleanup
- View File Metadata
- Restore Metadata (Future)

---

# 111. Subscription Analytics

Route

```
/admin/analytics
```

Purpose

Monitor subscription growth.

---

## Charts

Display:

- Free vs Pro vs Elite
- Upgrade Rate
- Downgrade Rate
- Monthly Growth
- Retention Rate
- Conversion Funnel

---

## KPIs

Display:

- Total Users
- Paid Users
- Conversion Rate
- Monthly Active Users
- Average Storage/User
- Average AI Usage/User

---

# 112. Notifications

Administrative actions SHALL automatically notify affected users.

Examples

```
Plan Upgraded

↓

In-App Notification

↓

Email Notification
```

---

```
Account Suspended

↓

In-App Notification

↓

Email Notification
```

---

```
Subscription Expiring (Future)

↓

Reminder Email
```

---

# 113. Audit Logs

Route

```
/admin/audit
```

Every administrative action SHALL create an immutable audit record.

Stored Information

- Admin ID
- User ID
- Action
- Previous Value
- New Value
- Timestamp
- IP Address (Future)

---

## Example Actions

- PLAN_CHANGED
- USER_SUSPENDED
- USER_RESTORED
- AI_QUOTA_RESET
- FILE_DELETED
- SUBSCRIPTION_CANCELLED

---

# 114. Permissions

Only users with

```
role = admin
```

or

```
role = admin_careeros
```

shall access the Admin Dashboard.

Every request SHALL validate the user's role using Clerk session metadata and backend verification.

---

# 115. Future Billing Dashboard

The Billing module is reserved for future implementation.

Future features include:

- Razorpay Transactions
- Stripe Transactions
- Invoice Downloads
- Refund Requests
- Failed Payments
- Payment Analytics

The UI SHALL reserve a navigation item but keep it disabled until implementation.

---

# 116. Performance Requirements

The Admin Dashboard SHALL:

- Load within 2 seconds under normal conditions.
- Support pagination for all tables.
- Cache dashboard metrics where appropriate.
- Avoid loading unnecessary records.

Large datasets SHALL use server-side pagination.

---

# 117. Security Requirements

The Admin Dashboard SHALL:

- Require authenticated admin access.
- Validate roles on every request.
- Log all sensitive actions.
- Prevent privilege escalation.
- Protect against unauthorized API access.

No administrative operation SHALL rely solely on frontend validation.

---

# 118. Acceptance Criteria

The Admin Dashboard implementation SHALL be complete when:

- User management is fully functional.
- Subscription management works correctly.
- AI usage monitoring is available.
- Storage monitoring is operational.
- Analytics dashboards display accurate data.
- Audit logs record all administrative actions.
- Role-based access control is enforced.
- Future billing integration can be added without redesign.

---

# 119. Notifications & Automation Architecture

This section defines the complete notification, reminder, email, and automation architecture for CareerOS.

The notification system ensures users stay informed about important career activities without overwhelming them.

CareerOS SHALL support both in-app notifications and email notifications.

---

# 120. Notification Design Principles

The notification system SHALL follow these principles.

## 120.1 Actionable

Every notification SHALL encourage the user to perform a meaningful action.

Example

```
Interview Tomorrow

Prepare now →
```

instead of

```
Interview Tomorrow
```

---

## 120.2 Non-Intrusive

Notifications SHALL help users without becoming distracting.

The system SHALL avoid excessive notifications.

---

## 120.3 Timely

Notifications SHALL be delivered before the related event occurs.

Examples

- Reminder before interview
- Reminder before application deadline
- Reminder before task due date

---

# 121. Notification Types

CareerOS SHALL support the following notification categories.

| Category | Purpose |
|----------|---------|
| Reminder | Scheduled reminders |
| Interview | Interview events |
| Application | Job application updates |
| Resume | Resume actions |
| Subscription | Plan updates |
| AI | AI quota notifications |
| System | Platform announcements |
| Security | Login & account alerts |

---

# 122. Delivery Channels

CareerOS SHALL support multiple notification channels.

| Channel | Supported |
|----------|-----------|
| In-App Notifications | ✅ |
| Email | ✅ |
| Push Notifications | Future |
| SMS | Future |
| WhatsApp | Future |

---

# 123. In-App Notification Center

Every authenticated user SHALL have access to the Notification Center.

Route

```
/notifications
```

---

## Notification Bell

Located in the dashboard navigation.

Example

```
🔔

3
```

Clicking the bell SHALL open a notification drawer.

---

## Notification Drawer

Layout

```
Notifications

Today

Yesterday

Earlier

Mark All Read

View All
```

Unread notifications SHALL appear first.

---

# 124. Welcome Notification

Immediately after account creation, the system SHALL generate a welcome notification.

Example

```
Welcome to CareerOS!

Start by creating your first Job Application.
```

An email SHALL also be sent.

---

# 125. Login Summary Panel

After every successful login, the dashboard SHALL display a slide-down notification panel.

This panel SHALL summarize important events.

Example

```
Good Morning, Aayush 👋

Today's Summary

• Interview at 3:00 PM

• Resume Storage 82%

• 2 Pending Reminders

• Application Deadline Tomorrow

• Resume Analysis Available

Have a productive day 🚀
```

This panel SHALL appear once per login session.

Users MAY dismiss it.

---

# 126. Reminder Notifications

Whenever a reminder reaches its scheduled time,

CareerOS SHALL

- Create an in-app notification.
- Send an email notification (if enabled).

Example

```
Reminder

Update Resume

Due Today
```

---

# 127. Interview Notifications

Interview notifications SHALL be generated automatically.

Examples

```
Interview Tomorrow

Company

Google

10:00 AM
```

---

```
Interview in One Hour

Prepare your documents.
```

---

```
Interview Completed

Update Interview Outcome.
```

---

# 128. Application Notifications

Examples

```
Application Added Successfully
```

---

```
Application Deadline Tomorrow
```

---

```
You have reached

9 of 10 Applications.
```

---

```
Application Limit Reached

Upgrade to Pro.
```

---

# 129. Subscription Notifications

Generated automatically when

- Subscription upgraded
- Subscription downgraded
- Subscription renewed
- Subscription cancelled
- Subscription expiring (Future)

Example

```
Congratulations!

You are now a CareerOS Pro member.
```

---

# 130. AI Notifications

Elite users SHALL receive AI notifications.

Examples

```
Resume Analysis Completed
```

---

```
Only 5 Resume Analyses Remaining
```

---

```
Monthly AI Quota Reset
```

---

# 131. Email Notifications

CareerOS SHALL use **Resend** for transactional emails.

Supported emails

- Welcome
- Reminder
- Interview Reminder
- Subscription Upgrade
- Subscription Downgrade
- Password & Security Alerts (Clerk)
- AI Report Ready (Future)

Emails SHALL use responsive HTML templates.

---

# 132. Notification Database Model

```prisma
model Notification {

  id          String   @id @default(uuid())

  userId      String

  title       String

  message     String

  category    NotificationType

  isRead      Boolean  @default(false)

  actionUrl   String?

  createdAt   DateTime @default(now())

  updatedAt   DateTime @updatedAt

  user User @relation(fields: [userId], references: [id])
}
```

---

# 133. Notification Categories

```prisma
enum NotificationType {

WELCOME

REMINDER

INTERVIEW

APPLICATION

SUBSCRIPTION

AI

SYSTEM

SECURITY

}
```

---

# 134. Notification Flow

```
System Event

↓

Create Notification

↓

Store Database

↓

Display In-App

↓

Send Email (If Applicable)

↓

User Reads

↓

Marked Read
```

---

# 135. Scheduled Jobs

CareerOS SHALL execute background jobs for automation.

Daily Jobs

- Check today's reminders
- Check tomorrow's interviews
- Check application deadlines
- Generate notifications

Monthly Jobs

- Reset Elite AI quotas
- Generate subscription reports
- Clean expired notification cache

Future Jobs

- Subscription renewal
- Payment retries
- Invoice generation

---

# 136. Notification Preferences

Users SHALL control notification preferences.

Settings

```
Profile

↓

Notifications

↓

Email Notifications

↓

Reminder Notifications

↓

Interview Notifications

↓

Marketing Emails
```

Users MAY enable or disable each category independently.

---

# 137. Read & Unread Management

Users SHALL be able to:

- Mark notification as read
- Mark all as read
- Delete notification
- Filter by category
- Search notifications

Unread notifications SHALL display a visual indicator.

---

# 138. Retention Policy

Notifications SHALL remain available for **90 days**.

Older notifications MAY be archived or deleted automatically.

Audit logs SHALL NOT be affected by notification cleanup.

---

# 139. Performance Requirements

The Notification System SHALL:

- Load within 200 ms.
- Paginate notification history.
- Cache unread counts.
- Generate notifications asynchronously.

Background processing SHALL prevent delays in user actions.

---

# 140. Acceptance Criteria

The Notification & Automation System SHALL be complete when:

- In-app notifications function correctly.
- Email notifications are delivered through Resend.
- Login Summary Panel appears once per session.
- Reminder notifications trigger automatically.
- Interview notifications trigger automatically.
- Subscription notifications are generated.
- AI notifications respect Elite usage.
- Notification preferences are configurable.
- Scheduled jobs execute successfully.
- Notification history supports filtering and pagination.

---

# 141. Supabase Storage Architecture

This section defines the complete file storage architecture for CareerOS.

CareerOS SHALL use **Supabase Storage** as its primary object storage service.

Supabase PostgreSQL SHALL store application data and file metadata.

Resume files SHALL be stored inside Supabase Storage, while the database SHALL store references and metadata.

---

# 142. Storage Design Principles

The storage architecture SHALL follow these principles.

## 142.1 Separation of Responsibilities

Supabase Storage SHALL store:

- Resume PDFs
- Resume DOCX files
- User profile images
- Future attachments

Supabase PostgreSQL SHALL store:

- File metadata
- Storage path
- Public or signed URL
- File size
- MIME type
- Upload timestamps

---

## 142.2 Secure Access

Every uploaded file SHALL have controlled access.

Users SHALL only access their own files.

Every download request SHALL validate ownership before returning file access.

Supabase Storage policies SHALL enforce secure access.

---

## 142.3 Scalability

The storage architecture SHALL support:

- Thousands of uploaded resumes
- Fast file delivery
- Secure file access
- Future storage expansion

No architectural redesign SHALL be required.

---

# 143. Storage Architecture

```
User

↓

Upload Resume

↓

Next.js Backend

↓

Supabase Storage

↓

File Stored

↓

Storage Path Generated

↓

Metadata Saved

↓

Supabase PostgreSQL
```

Only metadata SHALL be stored inside PostgreSQL.

---

# 144. Resume Upload Flow

```
Select Resume

↓

Client Validation

↓

Upload API

↓

Authentication

↓

Subscription Validation

↓

Storage Limit Validation

↓

Upload to Supabase Storage

↓

Receive Storage Path

↓

Save Metadata

↓

Return Success
```

Uploads SHALL immediately fail if storage limits are exceeded.

---

# 145. Resume Metadata Model

```prisma
model Resume {

  id             String   @id @default(uuid())

  userId         String

  title          String

  originalName   String

  storagePath    String

  fileUrl        String

  fileType       String

  fileSize       Int

  uploadedAt     DateTime @default(now())

  updatedAt      DateTime @updatedAt

  user User @relation(fields: [userId], references: [id])

}
```

---

# 146. Supported File Types

CareerOS SHALL support:

| File Type | Allowed |
|------------|----------|
| PDF | ✅ |
| DOCX | ✅ |

The following SHALL be rejected:

- DOC
- TXT
- ZIP
- RAR
- EXE
- APK
- Unsupported formats

Future versions MAY support additional formats.

---

# 147. Maximum File Size

Maximum size per uploaded resume:

```
10 MB
```

If exceeded:

```
Upload Failed

Maximum allowed file size is 10 MB.
```

---

# 148. Storage Limits

## Free

```
100 MB
```

---

## Pro

```
2 GB
```

---

## Elite

```
10 GB
```

Storage SHALL be calculated using the actual uploaded file size.

---

# 149. Storage Bucket Structure

CareerOS SHALL use dedicated storage buckets.

Recommended structure

```
resumes/

    user-id/

        resume.pdf

        resume.docx

profile-images/

    user-id/

attachments/

    future-files/
```

This organization improves scalability and simplifies maintenance.

---

# 150. Upload Response

Example

```json
{
  "storagePath": "resumes/user123/resume.pdf",
  "publicUrl": "https://project.supabase.co/storage/v1/object/public/resumes/user123/resume.pdf",
  "fileSize": 245760,
  "fileType": "application/pdf"
}
```

Only required metadata SHALL be stored in PostgreSQL.

---

# 151. Storage Usage Calculation

Storage SHALL update after every upload or deletion.

Example

```
Current Storage

72 MB

+

Uploaded Resume

3 MB

↓

Updated Storage

75 MB
```

Storage SHALL always reflect actual usage.

---

# 152. Resume Deletion Flow

```
Delete Request

↓

Authentication

↓

Ownership Validation

↓

Delete File From Supabase Storage

↓

Delete Metadata

↓

Update Storage Counter

↓

Return Success
```

Both the stored file and metadata SHALL be removed.

---

# 153. Profile Image Storage

Profile images SHALL also use Supabase Storage.

Supported formats

- JPG
- JPEG
- PNG
- WEBP

Maximum size

```
5 MB
```

Only one active profile image SHALL exist per user.

Uploading a new image SHALL automatically replace the previous one.

---

# 154. Storage Security

The storage system SHALL:

- Validate authentication
- Validate ownership
- Restrict unsupported file types
- Restrict oversized uploads
- Prevent unauthorized downloads
- Prevent path manipulation

Supabase Storage policies SHALL protect all uploaded files.

---

# 155. Backup Strategy

Supabase Storage SHALL be the primary object storage.

Supabase PostgreSQL SHALL store all metadata required to locate uploaded files.

Future enhancements MAY include:

- Automated backups
- Multi-region replication
- External backup providers

---

# 156. Performance Requirements

The storage system SHALL:

- Upload files efficiently
- Deliver files quickly
- Support future resumable uploads
- Minimize unnecessary database operations
- Cache metadata where appropriate

---

# 157. Error Handling

Common errors include

- Unsupported file type
- File exceeds size limit
- Storage limit exceeded
- Upload failure
- Storage service unavailable
- Unauthorized access

Example response

```json
{
  "success": false,
  "error": "Storage limit exceeded.",
  "upgradeRequired": true
}
```

---

# 158. Acceptance Criteria

The Supabase Storage implementation SHALL be complete when:

- Resume uploads are stored in Supabase Storage.
- Metadata is stored in PostgreSQL.
- Storage limits are enforced.
- Ownership validation is implemented.
- Unsupported files are rejected.
- File deletion removes both storage objects and metadata.
- Profile image uploads function correctly.
- Storage usage updates automatically.
- Future file types can be added without architectural changes.

---

# 159. Security Architecture

This section defines the complete security architecture for CareerOS.

Security SHALL be enforced at every layer of the application.

The objective is to protect user data, secure uploaded files, safeguard AI services, and ensure the platform is production-ready.

CareerOS SHALL follow modern SaaS security best practices.

---

# 160. Security Principles

CareerOS SHALL follow the **Zero Trust Security Model**.

Every request SHALL be verified regardless of where it originates.

The backend SHALL NEVER trust client-side data without validation.

---

## Core Principles

- Authenticate every request
- Authorize every action
- Validate every input
- Protect uploaded files
- Secure API endpoints
- Encrypt sensitive data
- Prevent abuse
- Maintain audit logs

---

# 161. Authentication

CareerOS SHALL use **Clerk Authentication**.

Supported authentication methods

- Email & Password
- Google Sign-In

Future support

- GitHub Sign-In
- Microsoft Sign-In

Authentication Flow

```
User

↓

Clerk Authentication

↓

JWT Session

↓

Backend Verification

↓

Internal User Lookup

↓

Authorized Request
```

Only authenticated users SHALL access protected resources.

---

# 162. Authorization (RBAC)

CareerOS SHALL implement **Role-Based Access Control (RBAC).**

Supported Roles

```text
USER

ADMIN

SUPER_ADMIN
```

---

## USER Permissions

Users MAY

- Manage profile
- Upload resumes
- Manage applications
- Schedule interviews
- Create reminders
- Access subscription features
- Access AI Workspace (Elite only)

Users SHALL NOT

- Access Admin Dashboard
- Modify other users
- Access system analytics

---

## ADMIN Permissions

Admins MAY

- View all users
- Manage subscriptions
- Monitor storage
- Monitor AI usage
- Manage notifications
- Suspend users
- View analytics

Admins SHALL NOT

- Modify SUPER_ADMIN accounts

---

## SUPER_ADMIN Permissions

Super Admins MAY

- Perform all administrative actions
- Manage administrators
- Configure plans
- Configure system settings
- View audit logs
- Override subscription restrictions

---

# 163. API Security

Every protected API SHALL follow this execution pipeline.

```
Incoming Request

↓

Authentication

↓

Role Validation

↓

Subscription Validation

↓

Input Validation

↓

Business Logic

↓

Database

↓

Response
```

No protected endpoint SHALL bypass authentication.

---

# 164. Input Validation

Every user input SHALL be validated.

Examples

- Email
- Company Name
- Job Title
- Resume Title
- Interview Notes
- Reminder Text
- URLs
- AI Requests

Validation SHALL include

- Required fields
- Data types
- Maximum length
- Minimum length
- Allowed characters
- File validation

---

# 165. File Upload Security

Every uploaded file SHALL pass security validation.

Validation SHALL include

- MIME Type
- File Extension
- Maximum File Size
- Ownership Validation
- Storage Permission Check

Unsupported executable files SHALL be rejected immediately.

Uploaded files SHALL be stored only inside Supabase Storage.

---

# 166. Database Security

CareerOS SHALL use

- Supabase PostgreSQL
- Prisma ORM

Security measures

- Parameterized Queries
- UUID Primary Keys
- Foreign Keys
- Database Constraints
- Indexed Queries

Direct SQL SHALL be avoided unless required.

---

# 167. Supabase Storage Security

CareerOS SHALL use **Supabase Storage** for object storage.

Storage SHALL be protected using:

- Bucket Policies
- Row Level Security (where applicable)
- Authenticated Upload APIs
- Ownership Validation
- Secure File Paths

Users SHALL only access files they own.

Public buckets SHALL only be used where explicitly required (such as public profile assets, if implemented).

Resume files SHALL remain protected.

---

# 168. Environment Variables

Sensitive configuration SHALL remain server-side.

Required variables

```env
DATABASE_URL=

DIRECT_URL=

NEXT_PUBLIC_SUPABASE_URL=

NEXT_PUBLIC_SUPABASE_ANON_KEY=

SUPABASE_SERVICE_ROLE_KEY=

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=

CLERK_SECRET_KEY=

RESEND_API_KEY=

GEMINI_API_KEY=
```

Secrets SHALL NEVER be exposed to the frontend.

---

# 169. Rate Limiting

To reduce abuse, CareerOS SHALL implement API rate limiting.

Recommended limits

| Endpoint | Limit |
|----------|-------|
| Login | 10/min |
| Resume Upload | 20/hour |
| Resume Analysis | 10/min |
| Resume Match | 10/min |
| Interview Prep | 10/min |
| General APIs | 100/min |

Limits MAY be adjusted as platform usage grows.

---

# 170. AI Security

Gemini integration SHALL remain backend-only.

Every AI request SHALL verify

- Authentication
- Elite Subscription
- Monthly AI Quota
- Request Validation
- Rate Limit

Prompt generation SHALL occur only on the backend.

Gemini API keys SHALL NEVER be exposed.

---

# 171. Data Privacy

CareerOS SHALL collect only information necessary to provide services.

Examples

- User Profile
- Applications
- Interviews
- Reminders
- Resume Metadata
- Subscription Information
- Notifications

User information SHALL never be shared with third parties without consent.

---

# 172. Logging & Monitoring

The backend SHALL log

- Authentication Events
- Failed Login Attempts
- API Errors
- Resume Uploads
- Resume Deletions
- Subscription Changes
- AI Requests
- Admin Actions

Sensitive credentials SHALL NEVER appear in logs.

---

# 173. Audit Trail

Critical actions SHALL create immutable audit records.

Examples

- User Suspended
- Plan Upgraded
- Plan Downgraded
- Resume Deleted
- AI Quota Reset
- Admin Login
- Permission Changed

Audit records SHALL contain

- User ID
- Admin ID
- Action
- Timestamp
- Previous Value
- Updated Value

---

# 174. Error Handling

Production errors SHALL never expose internal implementation details.

❌ Avoid

```text
Prisma Error P2002
```

✅ Preferred

```text
Something went wrong.

Please try again later.
```

Detailed errors SHALL remain available only in server logs.

---

# 175. Backup & Recovery

CareerOS SHALL rely on Supabase infrastructure.

Database

- Automated backups
- Point-in-Time Recovery (where supported)

Storage

- Supabase Storage
- Metadata stored in PostgreSQL

Future enhancements

- Multi-region backups
- Disaster recovery procedures
- Scheduled backup verification

---

# 176. Production Deployment

Recommended production stack

| Component | Technology |
|-----------|------------|
| Frontend | Next.js |
| Backend | Next.js API Routes |
| Database | Supabase PostgreSQL |
| Object Storage | Supabase Storage |
| Authentication | Clerk |
| ORM | Prisma |
| Email | Resend |
| AI | Google Gemini Pro |
| Deployment | Vercel |

---

# 177. Security Checklist

Before production deployment verify

- Clerk Authentication configured
- RBAC implemented
- Supabase Storage policies configured
- HTTPS enabled
- API validation complete
- Rate limiting enabled
- File validation complete
- Environment variables secured
- Audit logging enabled
- Backup strategy verified

---

# 178. Acceptance Criteria

The Security Architecture SHALL be complete when

- Authentication protects all secured routes.
- RBAC is fully implemented.
- Supabase Storage policies protect uploaded files.
- AI endpoints are secured.
- Environment variables remain private.
- Rate limiting prevents abuse.
- Audit logs are generated.
- Sensitive information is never exposed.
- Production deployment follows this architecture.

---

# 179. Testing Strategy

This section defines the complete testing strategy for the CareerOS Subscription System.

Testing SHALL ensure every feature functions correctly before deployment.

The strategy covers:

- Unit Testing
- Integration Testing
- API Testing
- UI Testing
- End-to-End Testing
- Performance Testing
- Security Testing
- Regression Testing
- User Acceptance Testing

---

# 180. Testing Principles

CareerOS SHALL follow these testing principles.

## 180.1 Shift Left

Testing SHALL begin during development.

Developers SHALL validate functionality before submitting changes.

---

## 180.2 Automation First

Frequently executed tests SHALL be automated whenever practical.

Examples

- Authentication
- Subscription validation
- Storage validation
- API validation
- AI quota validation

---

## 180.3 Regression Protection

Every new feature SHALL preserve existing MVP functionality.

Regression testing SHALL be performed before every release.

---

# 181. Testing Levels

The platform SHALL be tested at multiple levels.

| Level | Purpose |
|--------|---------|
| Unit Testing | Individual functions |
| Integration Testing | Communication between modules |
| API Testing | Backend endpoints |
| UI Testing | User interface validation |
| End-to-End Testing | Complete user journeys |
| Performance Testing | Speed and scalability |
| Security Testing | Vulnerability detection |
| User Acceptance Testing | Final business validation |

---

# 182. Unit Testing

Unit tests SHALL verify individual services and functions.

Examples

Subscription Service

- Upgrade Plan
- Downgrade Plan
- Current Plan
- Feature Validation

Usage Service

- Increment Usage
- Reset Monthly Usage
- Storage Calculation

Storage Service

- Upload Metadata
- Delete Metadata
- Calculate Storage Usage

AI Service

- Monthly Quota Check
- Usage Tracking
- Elite Validation

Notification Service

- Create Notification
- Mark as Read
- Delete Notification

---

# 183. Integration Testing

Integration testing SHALL verify communication between modules.

Examples

- Clerk → User Database
- User → Subscription
- Subscription → Usage Limits
- Resume Upload → Supabase Storage
- Supabase Storage → PostgreSQL Metadata
- Reminder → Notification
- AI → Usage Tracking
- Email → Notification

---

# 184. API Testing

Every API endpoint SHALL be validated.

Example

GET

```
/api/subscription
```

Expected

```
200 OK
```

---

POST

```
/api/subscription/upgrade
```

Expected

```
Subscription Updated
```

---

POST

```
/api/resumes/upload
```

Expected

```
Authentication

↓

Storage Validation

↓

Subscription Validation

↓

Supabase Storage Upload

↓

Metadata Saved

↓

Success
```

Invalid requests SHALL return proper HTTP status codes.

---

# 185. UI Testing

The following interfaces SHALL be validated.

- Dashboard
- Applications
- Resume Library
- Interview Scheduler
- Reminders
- Notification Drawer
- Settings
- Pricing Page
- Subscription Page
- AI Workspace
- Admin Dashboard

Responsive behavior SHALL be verified across supported screen sizes.

---

# 186. End-to-End Testing

Complete user journeys SHALL be tested.

### Journey 1 — Free User

```
Register

↓

Login

↓

Upload Resume

↓

Create Applications

↓

Reach Plan Limit

↓

Upgrade Prompt
```

---

### Journey 2 — Pro User

```
Upgrade

↓

Unlimited Applications

↓

Unlimited Resume Uploads

↓

Storage Updated

↓

Export PDF
```

---

### Journey 3 — Elite User

```
Upgrade

↓

Resume Analysis

↓

Resume Match

↓

Interview Preparation

↓

AI Usage Updated
```

---

### Journey 4 — Admin

```
Admin Login

↓

View Users

↓

Upgrade Subscription

↓

Audit Log Created
```

---

# 187. Performance Testing

Recommended performance targets

| Feature | Target |
|----------|---------|
| Dashboard Load | < 2 sec |
| API Response | < 300 ms |
| Subscription Validation | < 100 ms |
| Resume Upload | < 5 sec |
| AI Response | < 10 sec |
| Notification Load | < 200 ms |

---

# 188. Load Testing

The MVP SHALL support at minimum

- 500 Registered Users
- 100 Concurrent Users
- 50 Simultaneous Resume Uploads
- 20 Concurrent AI Requests

Future releases SHALL increase these thresholds.

---

# 189. Security Testing

Security validation SHALL include

- Authentication
- Authorization
- RBAC Validation
- Storage Policies
- SQL Injection Protection
- Cross-Site Scripting (XSS)
- CSRF Protection (where applicable)
- API Rate Limiting
- Environment Variable Protection

Resume files SHALL only be accessible to their owner.

---

# 190. Regression Testing

Before every production release verify

- Authentication
- Dashboard
- Applications
- Resume Library
- Interview Scheduler
- Reminders
- Notifications
- Storage Upload
- Subscription System
- AI Features
- Admin Dashboard

Previously working features SHALL continue functioning.

---

# 191. User Acceptance Testing (UAT)

CareerOS SHALL be tested using realistic user scenarios.

Representative users

- College Student
- Internship Applicant
- Final-Year Student
- Working Professional
- Platform Administrator

User feedback SHALL be reviewed before production deployment.

---

# 192. Monitoring

Production SHALL continuously monitor

- API Response Time
- Server Errors
- Database Health
- Supabase Storage Usage
- AI Requests
- Email Delivery
- Failed Logins
- Active Users

Critical failures SHALL generate alerts.

---

# 193. Logging

CareerOS SHALL log

- Authentication Events
- API Requests
- Resume Uploads
- Resume Deletions
- Subscription Changes
- AI Requests
- Storage Errors
- Email Failures
- Background Jobs

Sensitive credentials SHALL NEVER be stored in logs.

---

# 194. CI/CD Pipeline

Recommended deployment workflow

```
Developer Push

↓

GitHub

↓

Build

↓

Run Tests

↓

Lint

↓

Deploy Preview

↓

Approval

↓

Production Deployment
```

Production deployment SHALL stop automatically if tests fail.

---

# 195. Release Strategy

Recommended release workflow

```
Development

↓

Internal Testing

↓

QA Testing

↓

User Acceptance Testing

↓

Production
```

Every production deployment SHALL include release notes.

---

# 196. Production Maintenance

Daily

- Monitor application errors
- Verify storage health
- Check AI usage

Weekly

- Review logs
- Review storage usage
- Review failed emails

Monthly

- Reset AI quotas
- Review analytics
- Optimize database
- Archive expired notifications

---

# 197. Disaster Recovery

Recovery priority

1. Authentication
2. Database
3. Supabase Storage
4. Notifications
5. AI Services

Critical user information SHALL remain recoverable.

---

# 198. Success Metrics

The Subscription System SHALL be considered successful when

- Free users can use the platform without issues.
- Subscription limits are enforced correctly.
- Storage limits work accurately.
- AI quotas reset correctly.
- Admin tools operate reliably.
- Performance targets are achieved.
- No critical security vulnerabilities remain.

---

# 199. Final Acceptance Criteria

The Subscription & Storage System SHALL be approved when

- Subscription plans function correctly.
- Usage limits are enforced.
- Supabase Storage uploads function correctly.
- Resume metadata is stored successfully.
- AI features are protected.
- Notifications operate correctly.
- Admin dashboard functions correctly.
- Security requirements are satisfied.
- Performance targets are achieved.
- Documentation matches implementation.

---

# 200. Document Summary

This document defines the complete **Level 3 Specification** for the CareerOS Subscription System.

It includes

- Free, Pro and Elite Plans
- Usage Limits
- Feature Gating
- AI Workspace
- Supabase Storage
- Notification System
- Admin Dashboard
- Security Architecture
- Testing Strategy
- Production Readiness

The architecture is designed to refine the existing CareerOS MVP while remaining scalable for future enhancements such as payment gateways, referral systems, enterprise plans, coupons, and advanced AI capabilities.

---

# 201. Environment Variables

The following environment variables are required for the Subscription System.

## Authentication

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=

CLERK_SECRET_KEY=
```

---

## Database

```env
DATABASE_URL=

DIRECT_URL=

NEXT_PUBLIC_SUPABASE_URL=

NEXT_PUBLIC_SUPABASE_ANON_KEY=

SUPABASE_SERVICE_ROLE_KEY=
```

---

## Email

```env
RESEND_API_KEY=
```

---

## AI

```env
GEMINI_API_KEY=
```

---

## Application

```env
NEXT_PUBLIC_APP_URL=

NODE_ENV=
```

---

# 202. Recommended Folder Structure

```
src/

├── app/

│   ├── dashboard/

│   ├── settings/

│   ├── pricing/

│   ├── notifications/

│   ├── admin/

│   └── api/

│
├── components/

│   ├── subscription/

│   ├── pricing/

│   ├── notifications/

│   ├── usage/

│   ├── ai/

│   └── common/

│
├── services/

│   ├── subscription/

│   ├── ai/

│   ├── storage/

│   ├── notifications/

│   └── billing/

│
├── repositories/

├── middleware/

├── lib/

├── utils/

├── hooks/

├── types/

├── prisma/

└── config/
```

---

# 203. Configuration Files

The Subscription System SHALL centralize configuration.

Recommended files

```
config/

plans.ts

features.ts

limits.ts

ai.ts

storage.ts

pricing.ts
```

All subscription limits, feature gates, pricing, storage limits, and AI quotas SHALL be managed through configuration files.

Hardcoded values SHALL be avoided.

---

# 204. Example Plan Configuration

## Free

```typescript
Applications: 10

Resumes: 5

Interviews: 10

Reminders: 25

Storage: 100 MB
```

---

## Pro

```typescript
Applications: Unlimited

Resumes: Unlimited

Interviews: Unlimited

Reminders: Unlimited

Storage: 2 GB
```

---

## Elite

```typescript
Applications: Unlimited

Resumes: Unlimited

Interviews: Unlimited

Reminders: Unlimited

Storage: 10 GB

AI Features: Enabled
```

---

# 205. Feature Flag Architecture

CareerOS SHALL support feature flags for controlled feature releases.

Examples

```
AI Workspace

Enabled
```

---

```
Referral Program

Disabled
```

---

```
Coupons

Disabled
```

---

```
Push Notifications

Disabled
```

Future features SHALL be enabled through configuration without requiring architectural changes.

---

# 206. Recommended Constants

Examples

```text
MAX_RESUME_SIZE

MAX_PROFILE_IMAGE_SIZE

FREE_STORAGE_LIMIT

PRO_STORAGE_LIMIT

ELITE_STORAGE_LIMIT

FREE_APPLICATION_LIMIT

FREE_RESUME_LIMIT

FREE_INTERVIEW_LIMIT

FREE_REMINDER_LIMIT

AI_MONTHLY_LIMIT

NOTIFICATION_RETENTION_DAYS
```

Constants SHALL remain centralized.

---

# 207. Recommended Middleware Order

```
Authentication

↓

Role Validation

↓

Subscription Validation

↓

Usage Validation

↓

Storage Validation

↓

Rate Limiting

↓

Controller

↓

Response
```

Middleware SHALL always execute in this order.

---

# 208. Production Readiness Checklist

Before launching CareerOS verify the following.

### Authentication

- Clerk configured
- Google Login tested
- Protected routes verified

### Database

- Prisma migrations applied
- Indexes created
- Backup strategy verified

### Supabase Storage

- Resume uploads tested
- Resume deletion tested
- Profile image uploads tested
- Storage policies verified
- Storage usage calculation verified

### AI

- Gemini API connected
- Elite access verified
- Monthly quotas enforced

### Notifications

- In-App Notifications working
- Notification Drawer working
- Login Summary Panel tested
- Email notifications tested

### Subscription

- Free plan verified
- Pro plan verified
- Elite plan verified
- Upgrade flow tested
- Downgrade flow tested
- Usage limits verified

### Admin Dashboard

- User management tested
- Subscription management tested
- Analytics verified
- Audit logs verified

### Security

- Environment variables secured
- API validation complete
- Storage policies configured
- Rate limiting enabled

---

# 209. Future Roadmap

The architecture SHALL support future expansion.

## Phase 2

- Razorpay Integration
- Stripe Integration
- Payment History
- Invoice Downloads

---

## Phase 3

- Referral Program
- Coupon System
- Student Discounts
- Promotional Campaigns

---

## Phase 4

- Mobile Application
- Push Notifications
- Offline Support
- Resume Scanner

---

## Phase 5

- University Dashboard
- Placement Officer Portal
- Team Accounts
- Recruiter Dashboard

---

## Phase 6

- AI Career Coach
- AI Resume Builder
- AI Salary Insights
- AI Skill Roadmaps
- AI Learning Recommendations

---

# 210. Glossary

| Term | Meaning |
|--------|---------|
| ATS | Applicant Tracking System |
| AI Workspace | Elite AI tools |
| Usage Counter | Tracks feature usage |
| Plan Definition | Subscription configuration |
| Feature Gate | Backend authorization layer |
| RBAC | Role-Based Access Control |
| Clerk | Authentication Provider |
| Prisma | ORM |
| Supabase PostgreSQL | Primary Database |
| Supabase Storage | Object Storage |
| Resend | Email Service |
| Gemini | Google AI Model |

---

# 211. Architecture Summary

CareerOS Technology Stack

| Layer | Technology |
|---------|------------|
| Frontend | Next.js |
| Backend | Next.js API Routes |
| Database | Supabase PostgreSQL |
| Object Storage | Supabase Storage |
| ORM | Prisma |
| Authentication | Clerk |
| Email | Resend |
| AI | Google Gemini Pro |
| Deployment | Vercel |

---

# 212. Final Implementation Checklist

## MVP Core

- Authentication
- Dashboard
- Resume Library
- Applications
- Interviews
- Reminders
- Notifications

---

## Subscription

- Free Plan
- Pro Plan
- Elite Plan
- Usage Limits
- Storage Limits
- Feature Gates

---

## AI

- ATS Resume Analysis
- Resume Match
- Resume Rewrite
- Cover Letter Generator
- Interview Preparation
- Career Insights

---

## Storage

- Supabase Storage Uploads
- Resume Metadata
- Profile Image Uploads
- Storage Usage Tracking
- Secure File Access
- File Deletion

---

## Administration

- User Management
- Subscription Management
- Analytics
- AI Monitoring
- Storage Monitoring
- Audit Logs

---

## Production

- Security
- Testing
- Monitoring
- Logging
- Deployment
- Documentation

---

# 213. Final Notes

This document completes the **CareerOS Subscription System – Level 3 Technical Specification**.

The architecture has been designed specifically to refine the existing CareerOS MVP without introducing unnecessary complexity.

Key characteristics include:

- Modular architecture
- Scalable subscription model
- Secure backend validation
- Native Supabase Storage integration
- AI-powered Elite features
- Production-ready security
- Future payment readiness
- Configuration-driven architecture
- Maintainable and extensible design

This specification serves as the implementation blueprint for developers and AI coding tools.

It SHALL remain the single source of truth for the Subscription System until superseded by a newer version.

---

# 214. Document Status

| Property | Value |
|----------|-------|
| Document | CareerOS Subscription System |
| Specification Level | Level 3 |
| Version | 1.1.0 |
| Status | Final |
| Total Parts | 12 |
| Architecture | Production Ready |
| Object Storage | Supabase Storage |
| Payment Gateway | Future Integration |
| Last Updated | Version 1.1.0 |

---

# End of Document
