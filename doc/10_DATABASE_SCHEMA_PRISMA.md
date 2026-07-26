# CareerOS

# Database Schema (Prisma)

---

# Document Metadata

| Field | Value |
|-------|-------|
| Document ID | DOC-010 |
| Document Name | Database Schema (Prisma) |
| File Name | 10_DATABASE_SCHEMA_PRISMA.md |
| Version | 1.0.0 |
| Status | Approved |
| Audience | AI Coding Agent, Backend Developers |

---

# Purpose

This document defines the Prisma schema for the CareerOS MVP.

The generated `schema.prisma` MUST follow this specification.

---

# Database Provider

```prisma
provider = "postgresql"
```

---

# Prisma Generator

```prisma
generator client {
  provider = "prisma-client-js"
}
```

---

# Models

The MVP SHALL contain the following models:

```text
User

Profile

Resume

Application

ApplicationStatusHistory

Interview

Reminder

Feedback

Notification
```

---

# User

## Fields

```text
id

email

passwordHash

createdAt

updatedAt
```

---

## Relationships

```text
1 → 1 Profile

1 → Many Resume

1 → Many Application

1 → Many Reminder

1 → Many Feedback

1 → Many Notification
```

---

# Profile

## Fields

```text
id

userId

fullName

phone

college

degree

specialization

graduationYear

preferredRole

preferredLocation

bio

profileImageUrl

createdAt

updatedAt
```

---

## Relationships

```text
Belongs To User
```

---

# Resume

## Fields

```text
id

userId

name

targetRole

version

notes

fileUrl

fileSize

isDefault

createdAt

updatedAt
```

---

## Relationships

```text
Belongs To User

Referenced By Applications
```

---

# Application

## Fields

```text
id

userId

resumeId

companyName

jobTitle

department

jobType

workMode

location

source

applicationDate

currentStatus

recruiterName

recruiterEmail

salary

jobUrl

notes

createdAt

updatedAt
```

---

## Relationships

```text
Belongs To User

Belongs To Resume

Has Many Interviews

Has Many Status History Records

Has Many Reminders
```

---

# Application Status History

## Fields

```text
id

applicationId

previousStatus

newStatus

notes

changedAt
```

---

## Relationships

```text
Belongs To Application
```

---

# Interview

## Fields

```text
id

applicationId

interviewRound

interviewType

status

result

scheduledDate

scheduledTime

timeZone

meetingPlatform

meetingLink

interviewerName

interviewerEmail

preparationNotes

interviewFeedback

questionsAsked

personalNotes

createdAt

updatedAt
```

---

## Relationships

```text
Belongs To Application
```

---

# Reminder

## Fields

```text
id

userId

applicationId (Optional)

title

description

priority

status

reminderType

dueDate

dueTime

completedAt

createdAt

updatedAt
```

---

## Relationships

```text
Belongs To User

Optional Application Relationship
```

---

# Feedback

## Fields

```text
id

userId

category

title

description

status

createdAt
```

---

## Relationships

```text
Belongs To User
```

---

# Notification

## Fields

```text
id

userId

title

message

type

status

createdAt
```

---

## Relationships

```text
Belongs To User
```

---

# Common Field Rules

Every model SHALL include:

```text
id

createdAt

updatedAt
```

Except:

- ApplicationStatusHistory
- Feedback
- Notification

These use only the fields required by the MVP.

---

# Primary Keys

Every table SHALL use

```text
UUID
```

---

# Foreign Keys

Foreign keys SHALL enforce referential integrity.

Cascade delete SHALL be applied only where appropriate.

---

# Indexes

Indexes SHALL be created for:

```text
email

userId

resumeId

applicationId

currentStatus

applicationDate

dueDate

scheduledDate
```

---

# Enums

The following Prisma enums SHALL be defined:

```text
ApplicationStatus

InterviewStatus

InterviewResult

ReminderPriority

ReminderStatus

ReminderType

FeedbackCategory

FeedbackStatus

NotificationType

NotificationStatus

JobType

WorkMode
```

---

# Constraints

- Email MUST be unique.
- One Profile per User.
- One Default Resume per User.
- Resume belongs to one User.
- Application belongs to one User.
- Interview belongs to one Application.
- Reminder belongs to one User.
- Feedback belongs to one User.
- Notification belongs to one User.

---

# Naming Conventions

Models

```text
PascalCase
```

Fields

```text
camelCase
```

Database tables

```text
snake_case
```

---

# Schema Checklist

Before generating `schema.prisma`, verify:

- All models are present.
- Relationships are correctly defined.
- UUID primary keys are used.
- Foreign keys are configured.
- Required indexes are added.
- Enums are created.
- Constraints are enforced.
- Naming conventions are followed.

---
