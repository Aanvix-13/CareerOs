# CareerOS

# Database Design Document

---

# Document Metadata

| Field | Value |
|-------|-------|
| Document ID | DOC-002 |
| Document Name | Database Design |
| File Name | 02_DATABASE_DESIGN.md |
| Version | 1.0.0 |
| Status | Approved |
| Priority | Critical |
| Owner | Engineering |
| Audience | AI Coding Agent, Backend Developers, Database Engineers |

---

# Purpose

This document defines the complete database design for the CareerOS MVP.

It is the single source of truth for:

- Database schema
- Relationships
- Constraints
- Indexes
- Enums
- Data integrity
- Cascade rules

All backend APIs MUST follow this document.

No table may be created unless defined here.

---

# Database Philosophy

CareerOS uses a relational database.

The schema is designed around the following principles:

- One owner for every record.
- No duplicate business data.
- Normalized relationships.
- UUID primary keys.
- Soft deletes only where required.
- Audit timestamps on every table.
- Referential integrity enforced by foreign keys.

---

# Database Technology

## Database Engine

PostgreSQL

---

## ORM

Prisma ORM

---

## Migration Tool

Prisma Migrate

---

## Primary Key Strategy

UUID Version 4

Example

```
550e8400-e29b-41d4-a716-446655440000
```

---

## Timestamp Standard

All timestamps SHALL use UTC.

---

## Naming Convention

Tables

snake_case

Examples

```
users
profiles
applications
interviews
```

Columns

snake_case

Examples

```
created_at
updated_at
resume_id
```

Foreign Keys

```
user_id
resume_id
application_id
interview_id
```

---

# Entity Relationship Overview

CareerOS MVP contains the following entities.

| Entity | Purpose |
|---------|----------|
| users | Authentication |
| profiles | User information |
| resumes | Resume library |
| applications | Job applications |
| application_status_history | Status timeline |
| interviews | Interview tracking |
| reminders | Reminder management |
| feedback | Product feedback |
| notifications | In-app notifications |

---

# High-Level Relationship Diagram

```
User
 │
 ├── Profile (1:1)
 │
 ├── Resume (1:N)
 │
 ├── Application (1:N)
 │        │
 │        ├── Interview (1:N)
 │        │
 │        ├── Reminder (1:N)
 │        │
 │        └── Status History (1:N)
 │
 ├── Feedback (1:N)
 │
 └── Notification (1:N)
```

---

# Global Database Rules

## DB-001

Every table SHALL have:

- id
- created_at
- updated_at

---

## DB-002

Primary keys SHALL use UUID.

---

## DB-003

Foreign keys SHALL enforce referential integrity.

---

## DB-004

Every business record belongs to exactly one authenticated user unless explicitly documented otherwise.

---

## DB-005

No table may contain duplicated business information.

Reference records instead.

Example:

Application references Resume.

It does not duplicate Resume information.

---

## DB-006

Cascade deletion SHALL only occur where explicitly defined.

---

## DB-007

Every table SHALL include indexes for commonly searched fields.

---

## DB-008

Database SHALL remain normalized to at least Third Normal Form (3NF).

---

# Common Audit Fields

Unless specified otherwise, every table SHALL include:

| Column | Type |
|---------|------|
| id | UUID |
| created_at | TIMESTAMP |
| updated_at | TIMESTAMP |

---

# Supported Enums

## Application Status

- Wishlist
- Preparing
- Applied
- Online Assessment
- Technical Interview
- HR Interview
- Final Interview
- Offer Received
- Offer Accepted
- Offer Declined
- Rejected
- Withdrawn
- Archived

---

## Reminder Priority

- Low
- Medium
- High
- Critical

---

## Reminder Status

- Pending
- Completed
- Overdue

---

## Reminder Type

- Follow-up
- Interview
- Assessment
- Document Submission
- Offer Deadline
- Personal
- Other

---

## Interview Status

- Scheduled
- Completed
- Cancelled
- Rescheduled
- No Show

---

## Interview Result

- Pending
- Passed
- Failed
- Waiting
- Selected

---

## Notification Status

- Unread
- Read

---

## Feedback Status

- Submitted
- Under Review
- Planned
- Completed
- Closed

---

# Database Index Strategy

Indexes SHALL be created on:

- user_id
- application_id
- interview_id
- reminder_id
- created_at
- updated_at
- status
- due_date
- application_date

Composite indexes SHALL be introduced only when required by query performance.

---

# Database Constraints

- Email must be unique.
- Resume file path must not be null.
- Every application references one resume.
- Every interview references one application.
- Every reminder belongs to one user.
- Every feedback belongs to one user.
- Every notification belongs to one user.

---

# Next Section

The following sections define every database table individually.

- Users
- Profiles
- Resumes
- Applications
- Application Status History
- Interviews
- Reminders
- Feedback
- Notifications

---
---

# TABLE-001

# users

---

## Purpose

Stores authentication information for every registered user.

This table is the parent entity for all user-owned data.

---

## Relationships

| Relationship | Type |
|--------------|------|
| Profile | One-to-One |
| Resume | One-to-Many |
| Application | One-to-Many |
| Reminder | One-to-Many |
| Feedback | One-to-Many |
| Notification | One-to-Many |

---

## Columns

| Column | Type | Required | Constraints |
|---------|------|----------|-------------|
| id | UUID | Yes | Primary Key |
| email | VARCHAR(255) | Yes | Unique |
| password_hash | TEXT | Yes | Hashed Password |
| created_at | TIMESTAMP | Yes | UTC |
| updated_at | TIMESTAMP | Yes | UTC |

---

## Indexes

- Primary Key (id)
- Unique Index (email)

---

## Constraints

- Email must be unique.
- Password hash cannot be null.
- Password is never stored in plain text.

---

## Cascade Rules

Deleting a user SHALL delete:

- Profile
- Resumes
- Applications
- Interviews
- Reminders
- Feedback
- Notifications
- Status History

---

# TABLE-002

# profiles

---

## Purpose

Stores personal and career-related information.

Every user owns exactly one profile.

---

## Relationship

User (1:1)

---

## Columns

| Column | Type | Required | Constraints |
|---------|------|----------|-------------|
| id | UUID | Yes | Primary Key |
| user_id | UUID | Yes | Foreign Key → users.id |
| full_name | VARCHAR(100) | Yes | |
| profile_image | TEXT | No | URL/File Path |
| phone | VARCHAR(20) | No | |
| college | VARCHAR(150) | No | |
| degree | VARCHAR(100) | No | |
| specialization | VARCHAR(100) | No | |
| graduation_year | INTEGER | No | |
| preferred_role | VARCHAR(100) | No | |
| preferred_location | VARCHAR(100) | No | |
| bio | TEXT | No | |
| created_at | TIMESTAMP | Yes | UTC |
| updated_at | TIMESTAMP | Yes | UTC |

---

## Indexes

- user_id

---

## Constraints

- One profile per user.
- user_id must be unique.

---

# TABLE-003

# resumes

---

## Purpose

Stores all resume versions uploaded by a user.

---

## Relationship

User (1:N)

Application (1:N)

---

## Columns

| Column | Type | Required | Constraints |
|---------|------|----------|-------------|
| id | UUID | Yes | Primary Key |
| user_id | UUID | Yes | Foreign Key |
| name | VARCHAR(100) | Yes | |
| target_role | VARCHAR(100) | No | |
| version | VARCHAR(30) | No | |
| file_url | TEXT | Yes | |
| notes | TEXT | No | |
| is_default | BOOLEAN | Yes | Default FALSE |
| created_at | TIMESTAMP | Yes | UTC |
| updated_at | TIMESTAMP | Yes | UTC |

---

## Indexes

- user_id
- is_default

---

## Constraints

Only one resume per user may have:

```
is_default = true
```

---

Resume file must be PDF.

---

Resume cannot be deleted while referenced by an application.

---

# TABLE-004

# applications

---

## Purpose

Stores every job application created by a user.

This is the core table of CareerOS.

---

## Relationships

User (N:1)

Resume (N:1)

Interview (1:N)

Reminder (1:N)

Application Status History (1:N)

---

## Columns

| Column | Type | Required |
|---------|------|----------|
| id | UUID | Yes |
| user_id | UUID | Yes |
| resume_id | UUID | Yes |
| company_name | VARCHAR(150) | Yes |
| job_title | VARCHAR(150) | Yes |
| department | VARCHAR(100) | No |
| job_type | ENUM | Yes |
| work_mode | ENUM | Yes |
| location | VARCHAR(100) | No |
| source | VARCHAR(100) | Yes |
| recruiter_name | VARCHAR(100) | No |
| recruiter_email | VARCHAR(255) | No |
| salary | DECIMAL | No |
| job_url | TEXT | No |
| notes | TEXT | No |
| current_status | ENUM | Yes |
| application_date | DATE | Yes |
| created_at | TIMESTAMP | Yes |
| updated_at | TIMESTAMP | Yes |

---

## Indexes

- user_id
- resume_id
- company_name
- current_status
- application_date
- source

---

## Constraints

Company Name is required.

Job Title is required.

Resume reference is required.

Application Date cannot be in the future.

---

## Cascade Rules

Deleting an application SHALL delete:

- Interviews
- Reminders
- Status History

(after confirmation by the application layer)

---
---

# TABLE-005

# application_status_history

---

## Purpose

Stores the complete lifecycle of every application.

This table records every status transition instead of overwriting previous states.

It provides a complete audit trail for application progress.

---

## Relationships

Application (N:1)

User (N:1)

---

## Columns

| Column | Type | Required |
|---------|------|----------|
| id | UUID | Yes |
| application_id | UUID | Yes |
| user_id | UUID | Yes |
| previous_status | ENUM | No |
| new_status | ENUM | Yes |
| changed_at | TIMESTAMP | Yes |
| notes | TEXT | No |

---

## Indexes

- application_id
- user_id
- changed_at

---

## Constraints

Every record must belong to one application.

Every record must belong to one authenticated user.

The first status change may have a NULL previous_status.

---

## Cascade Rules

Deleting an application SHALL delete all related status history records.

---

# TABLE-006

# interviews

---

## Purpose

Stores every interview associated with a job application.

Supports multiple interview rounds.

---

## Relationships

Application (N:1)

User (N:1)

---

## Columns

| Column | Type | Required |
|---------|------|----------|
| id | UUID | Yes |
| application_id | UUID | Yes |
| user_id | UUID | Yes |
| interview_round | ENUM | Yes |
| interview_type | ENUM | Yes |
| interview_status | ENUM | Yes |
| interview_result | ENUM | Yes |
| interviewer_name | VARCHAR(100) | No |
| interviewer_email | VARCHAR(255) | No |
| meeting_platform | VARCHAR(100) | No |
| meeting_link | TEXT | No |
| scheduled_date | DATE | Yes |
| scheduled_time | TIME | Yes |
| timezone | VARCHAR(100) | Yes |
| preparation_notes | TEXT | No |
| interview_feedback | TEXT | No |
| questions_asked | TEXT | No |
| personal_notes | TEXT | No |
| created_at | TIMESTAMP | Yes |
| updated_at | TIMESTAMP | Yes |

---

## Indexes

- application_id
- user_id
- scheduled_date
- interview_status

---

## Constraints

Every interview belongs to exactly one application.

Scheduled date is required.

Scheduled time is required.

Meeting link is optional.

---

## Cascade Rules

Deleting an application SHALL delete all interviews.

---

# TABLE-007

# reminders

---

## Purpose

Stores reminders related to job applications, interviews, or personal career tasks.

---

## Relationships

User (N:1)

Application (N:1 Optional)

Interview (N:1 Optional)

---

## Columns

| Column | Type | Required |
|---------|------|----------|
| id | UUID | Yes |
| user_id | UUID | Yes |
| application_id | UUID | No |
| interview_id | UUID | No |
| title | VARCHAR(150) | Yes |
| description | TEXT | No |
| reminder_type | ENUM | Yes |
| priority | ENUM | Yes |
| status | ENUM | Yes |
| due_date | DATE | Yes |
| due_time | TIME | No |
| completed_at | TIMESTAMP | No |
| created_at | TIMESTAMP | Yes |
| updated_at | TIMESTAMP | Yes |

---

## Indexes

- user_id
- application_id
- interview_id
- due_date
- priority
- status

---

## Constraints

Every reminder belongs to one user.

A reminder may optionally reference an application.

A reminder may optionally reference an interview.

---

## Cascade Rules

Deleting an application deletes linked reminders.

Deleting an interview deletes linked reminders.

---
---

# TABLE-008

# feedback

---

## Purpose

Stores product feedback submitted by authenticated users.

This table enables users to report bugs, request features, and provide general feedback to improve CareerOS.

---

## Relationships

User (N:1)

---

## Columns

| Column | Type | Required |
|---------|------|----------|
| id | UUID | Yes |
| user_id | UUID | Yes |
| category | ENUM | Yes |
| title | VARCHAR(150) | Yes |
| description | TEXT | Yes |
| screenshot_url | TEXT | No |
| status | ENUM | Yes |
| app_version | VARCHAR(30) | Yes |
| browser | VARCHAR(100) | Yes |
| device | VARCHAR(100) | Yes |
| submitted_at | TIMESTAMP | Yes |
| created_at | TIMESTAMP | Yes |
| updated_at | TIMESTAMP | Yes |

---

## Feedback Categories

- Bug Report
- Feature Request
- Improvement Suggestion
- General Feedback

---

## Indexes

- user_id
- category
- status
- submitted_at

---

## Constraints

Category is required.

Title is required.

Description is required.

Screenshot is optional.

Every feedback record belongs to exactly one user.

---

## Cascade Rules

Deleting a user SHALL delete all associated feedback records.

---

# TABLE-009

# notifications

---

## Purpose

Stores in-app notifications generated by the system.

Notifications keep users informed about interviews, reminders, application updates, and important account events.

---

## Relationships

User (N:1)

---

## Columns

| Column | Type | Required |
|---------|------|----------|
| id | UUID | Yes |
| user_id | UUID | Yes |
| type | ENUM | Yes |
| title | VARCHAR(150) | Yes |
| message | TEXT | Yes |
| status | ENUM | Yes |
| related_entity | VARCHAR(50) | No |
| related_entity_id | UUID | No |
| created_at | TIMESTAMP | Yes |
| read_at | TIMESTAMP | No |
| updated_at | TIMESTAMP | Yes |

---

## Notification Types

- Welcome
- Application Created
- Application Updated
- Interview Scheduled
- Interview Today
- Reminder Due
- Reminder Overdue
- System Announcement

---

## Indexes

- user_id
- status
- type
- created_at

---

## Constraints

Every notification belongs to one authenticated user.

Notifications are generated only by the system during MVP.

Users cannot manually create notifications.

---

## Cascade Rules

Deleting a user SHALL delete all associated notifications.

---

# Foreign Key Relationships

| Parent Table | Child Table | Relationship |
|---------------|-------------|--------------|
| users | profiles | 1 : 1 |
| users | resumes | 1 : N |
| users | applications | 1 : N |
| users | interviews | 1 : N |
| users | reminders | 1 : N |
| users | feedback | 1 : N |
| users | notifications | 1 : N |
| applications | interviews | 1 : N |
| applications | reminders | 1 : N |
| applications | application_status_history | 1 : N |
| resumes | applications | 1 : N |
| interviews | reminders | 1 : N (Optional) |

---

# Delete Rules Summary

| Deleted Record | Automatically Deleted |
|----------------|-----------------------|
| User | Profile, Resumes, Applications, Status History, Interviews, Reminders, Feedback, Notifications |
| Application | Interviews, Reminders, Status History |
| Interview | Linked Reminders |
| Resume | Block deletion if referenced by an Application |

---

# Database Performance Guidelines

## Query Optimization

The backend SHOULD:

- Select only required columns.
- Use pagination for list endpoints.
- Filter records at the database level.
- Avoid unnecessary joins.
- Prevent N+1 query problems.

---

## Pagination

Large datasets SHALL use pagination.

Default page size:

```
20 records
```

Maximum page size:

```
100 records
```

---

## Search Strategy

Search SHALL support:

Applications

- Company Name
- Job Title
- Recruiter Name

---

Resumes

- Resume Name
- Target Role

---

Reminders

- Title

---

Notifications

- Title
- Message

---

# Data Integrity Rules

- Every authenticated record MUST reference a valid user.
- Every application MUST reference a valid resume.
- Every interview MUST reference a valid application.
- Every status history record MUST reference a valid application.
- Every reminder MUST reference a valid user.
- Foreign key constraints MUST be enforced.
- Orphan records SHALL NOT exist.

---

# Database Migration Rules

- Schema changes MUST be handled using Prisma Migrate.
- Existing production data MUST never be lost during migrations.
- Every migration SHALL include rollback considerations.
- Database changes MUST be version-controlled.

---

# Database Design Approval Checklist

Before implementation, verify:

- All tables are defined.
- Primary keys use UUID.
- Foreign keys are valid.
- Required indexes exist.
- Constraints are implemented.
- Enums match the PRD.
- Cascade rules are implemented.
- Naming conventions are followed.
- No duplicated business data exists.

---
