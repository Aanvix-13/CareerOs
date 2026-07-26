# CareerOS

# Business Rules

---

# Document Metadata

| Field | Value |
|-------|-------|
| Document ID | DOC-011 |
| Document Name | Business Rules |
| File Name | 11_BUSINESS_RULES.md |
| Version | 1.0.0 |
| Status | Approved |
| Audience | AI Coding Agent, Backend Developers |

---

# Purpose

This document defines the business rules for the CareerOS MVP.

Business rules describe how the application SHALL behave beyond database constraints and API validation.

All backend business logic MUST follow this specification.

---

# General Rules

1. Every user SHALL own only their own data.
2. A user SHALL access only their own resources.
3. Every protected request SHALL verify resource ownership.
4. Business rules SHALL be enforced in the Service Layer.

---

# User Rules

## Registration

The system SHALL:

- Allow only one account per email address.
- Automatically create a Profile after successful registration.
- Automatically log in the user after registration.

---

## Login

The system SHALL:

- Verify email and password.
- Reject invalid credentials.
- Reject deleted or inactive accounts (future support).

---

# Profile Rules

- Every user SHALL have exactly one profile.
- A profile SHALL belong to one user only.
- Email address SHALL NOT be editable from the profile page.
- Profile updates SHALL overwrite existing values.

---

# Resume Rules

## Upload

The system SHALL:

- Accept PDF files only.
- Reject files larger than 5 MB.
- Store resume metadata in the database.
- Store the uploaded file separately from the database.

---

## Default Resume

- Every user MAY have multiple resumes.
- Every user SHALL have at most one default resume.
- Setting a new default resume SHALL automatically remove the default flag from the previous one.

---

## Delete Resume

The system SHALL NOT allow deletion of a resume that is currently linked to one or more applications.

The user SHALL be instructed to update or delete those applications first.

---

# Application Rules

## Creation

Every application SHALL:

- Belong to one user.
- Reference one resume.
- Have exactly one current status.
- Record the application date.

---

## Status History

Whenever the application status changes, the system SHALL:

- Update the current status.
- Create a new Application Status History record.
- Preserve previous history entries.

Status history SHALL NEVER be modified or deleted.

---

## Delete Application

Deleting an application SHALL also delete:

- Linked interviews.
- Linked reminders.
- Application status history.

---

# Interview Rules

Every interview SHALL:

- Belong to one application.
- Represent one interview round.

A single application MAY have multiple interviews.

Example

```text
Technical Round 1

↓

Technical Round 2

↓

HR Round

↓

Final Round
```

---

## Interview Result

Allowed values

- Pending
- Passed
- Failed

Interview results MAY be updated after completion.

---

# Reminder Rules

A reminder MAY optionally belong to an application.

Examples

Application Reminder

```text
Follow up with Google
```

General Reminder

```text
Update Resume
```

---

## Reminder Completion

When a reminder is completed, the system SHALL:

- Update its status to Completed.
- Record the completion timestamp.

---

# Feedback Rules

Users MAY submit:

- Bug Reports
- Feature Requests
- Improvement Suggestions
- General Feedback

Users MAY delete feedback only while its status is **Submitted**.

Processed feedback SHALL NOT be deletable.

---

# Notification Rules

Notifications are generated automatically.

Users SHALL NOT manually create notifications.

Notifications MAY be generated for:

- Welcome
- Resume Upload
- Application Created
- Interview Scheduled
- Reminder Due
- Reminder Overdue

Users MAY:

- Read notifications.
- Delete notifications.

---

# Dashboard Rules

Dashboard statistics SHALL be calculated from live database data.

Statistics SHALL NOT be manually edited.

Dashboard values SHALL update automatically after:

- Resume upload
- Application creation
- Application deletion
- Interview creation
- Reminder completion

---

# Analytics Rules

Analytics SHALL be calculated in real time.

The backend SHALL compute:

- Total Applications
- Active Applications
- Interviews
- Offers
- Rejections
- Interview Rate
- Offer Rate

Analytics SHALL NOT be manually stored.

---

# Authorization Rules

The backend SHALL verify ownership before allowing access to:

- Profile
- Resume
- Application
- Interview
- Reminder
- Feedback
- Notification

Access to another user's data SHALL return **403 Forbidden**.

---

# Data Integrity Rules

The system SHALL maintain referential integrity.

Examples:

- Resume must exist before creating an application.
- Application must exist before creating an interview.
- User must exist before creating a profile.

Invalid references SHALL be rejected.

---

# Audit Rules

The system SHALL preserve:

- Application Status History
- Created timestamps
- Updated timestamps

Historical records SHALL NOT be altered except where explicitly allowed.

---

# Future Rules (Not in MVP)

The following rules are reserved for future versions:

- Team workspaces
- Multiple user roles
- Admin dashboard
- Resume AI scoring
- AI interview analysis
- Email notifications
- Calendar integrations
- Company management
- Recruiter CRM

These SHALL NOT be implemented in the MVP.

---

# Business Rules Checklist

Before implementation, verify:

- Resource ownership is enforced.
- Status history is immutable.
- Default resume uniqueness is maintained.
- Resume deletion rules are enforced.
- Dashboard statistics are calculated dynamically.
- Analytics use live data.
- Notifications are system-generated only.
- Data integrity is preserved.
- Future features are excluded from the MVP.

---
