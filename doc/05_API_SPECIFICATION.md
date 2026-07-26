# CareerOS

# API Specification

---

# Document Metadata

| Field | Value |
|-------|-------|
| Document ID | DOC-004 |
| Document Name | API Specification |
| File Name | 04_API_SPECIFICATION.md |
| Version | 1.0.0 |
| Status | Approved |
| Audience | AI Coding Agent, Backend Developers, Frontend Developers |

---

# Purpose

This document defines every REST API endpoint required for the CareerOS MVP.

It specifies:

- Endpoint URLs
- HTTP Methods
- Authentication Requirements
- Request Body
- Response Body
- Validation Rules
- Status Codes
- Error Responses

All APIs MUST follow this specification.

---

# Base URL

Development

```
http://localhost:3000/api/v1
```

Production

```
https://your-domain.com/api/v1
```

---

# API Standards

## Request Format

Request body SHALL use JSON.

Example

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

---

## Response Format

Every successful request SHALL return

```json
{
  "success": true,
  "data": {}
}
```

---

Every failed request SHALL return

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message"
  }
}
```

---

## Authentication

Protected endpoints require a valid JWT stored in an HTTP-Only cookie.

Public endpoints:

- Register
- Login
- Forgot Password

All other endpoints require authentication.

---

# HTTP Status Codes

| Code | Meaning |
|-------|----------|
| 200 | Success |
| 201 | Created |
| 204 | No Content |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 422 | Validation Error |
| 429 | Too Many Requests |
| 500 | Internal Server Error |

---

# Common Query Parameters

Pagination

```
?page=1
&limit=20
```

Sorting

```
?sort=created_at
&order=desc
```

Search

```
?search=Google
```

Filtering

```
?status=Applied
```

Multiple query parameters may be combined.

---

# Authentication APIs

---

## POST

/api/v1/auth/register

### Description

Create a new user account.

---

### Authentication

Not Required

---

### Request Body

```json
{
  "email": "john@example.com",
  "password": "password123",
  "fullName": "John Doe"
}
```

---

### Validation

Email

- Required
- Valid email
- Unique

Password

- Minimum 8 characters

Full Name

- Required
- Maximum 100 characters

---

### Success Response

201 Created

```json
{
  "success": true,
  "data": {
    "userId": "uuid",
    "email": "john@example.com"
  }
}
```

---

### Error Responses

400 Invalid request

409 Email already exists

500 Internal server error

---

# POST

/api/v1/auth/login

---

## Description

Authenticate a user and create a session.

---

### Authentication

Not Required

---

### Request Body

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

---

### Success Response

200 OK

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "john@example.com",
      "fullName": "John Doe"
    }
  }
}
```

JWT SHALL be stored in an HTTP-Only cookie.

---

### Error Responses

401 Invalid credentials

404 User not found

500 Internal server error

---

# POST

/api/v1/auth/logout

---

## Description

Logout the authenticated user.

---

### Authentication

Required

---

### Request Body

None

---

### Success Response

200 OK

```json
{
  "success": true
}
```

The server SHALL clear the authentication cookie.

---

# POST

/api/v1/auth/forgot-password

---

## Description

Request a password reset.

(MVP implementation may return a placeholder success response if email reset is not yet implemented.)

---

### Authentication

Not Required

---

### Request Body

```json
{
  "email": "john@example.com"
}
```

---

### Success Response

200 OK

```json
{
  "success": true,
  "message": "If the account exists, password reset instructions will be sent."
}
```

---

# GET

/api/v1/auth/me

---

## Description

Return the currently authenticated user's basic information.

---

### Authentication

Required

---

### Success Response

200 OK

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "john@example.com",
    "fullName": "John Doe"
  }
}
```

---

### Error Responses

401 Unauthorized

---
---

# Profile APIs

---

# GET

/api/v1/profile

---

## Description

Retrieve the authenticated user's profile.

---

### Authentication

Required

---

### Request Body

None

---

### Success Response

200 OK

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "fullName": "John Doe",
    "profileImage": "https://...",
    "phone": "+91XXXXXXXXXX",
    "college": "ABC University",
    "degree": "B.Tech",
    "specialization": "Computer Science",
    "graduationYear": 2027,
    "preferredRole": "Software Engineer",
    "preferredLocation": "Remote",
    "bio": "Aspiring Software Engineer"
  }
}
```

---

### Error Responses

401 Unauthorized

404 Profile not found

---

# PUT

/api/v1/profile

---

## Description

Update the authenticated user's profile.

---

### Authentication

Required

---

### Request Body

```json
{
  "fullName": "John Doe",
  "phone": "+91XXXXXXXXXX",
  "college": "ABC University",
  "degree": "B.Tech",
  "specialization": "Computer Science",
  "graduationYear": 2027,
  "preferredRole": "Software Engineer",
  "preferredLocation": "Remote",
  "bio": "Aspiring Software Engineer"
}
```

---

### Validation

Full Name

- Required
- Maximum 100 characters

Phone

- Optional
- Maximum 20 characters

Graduation Year

- Optional
- Four-digit year

Bio

- Optional
- Maximum 1000 characters

---

### Success Response

200 OK

```json
{
  "success": true,
  "data": {
    "message": "Profile updated successfully."
  }
}
```

---

### Error Responses

400 Invalid request

401 Unauthorized

422 Validation error

---

# Resume APIs

---

# GET

/api/v1/resumes

---

## Description

Retrieve all resumes belonging to the authenticated user.

---

### Authentication

Required

---

### Query Parameters

```
?page=1
&limit=20
&search=Frontend
&sort=created_at
&order=desc
```

---

### Success Response

200 OK

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Frontend Resume",
      "targetRole": "Frontend Developer",
      "version": "v2",
      "isDefault": true,
      "createdAt": "2026-07-23T10:30:00Z"
    }
  ]
}
```

---

# GET

/api/v1/resumes/:id

---

## Description

Retrieve a single resume.

---

### Authentication

Required

---

### Success Response

200 OK

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Frontend Resume",
    "targetRole": "Frontend Developer",
    "version": "v2",
    "notes": "Used for frontend roles.",
    "fileUrl": "https://storage.example.com/resume.pdf",
    "isDefault": true
  }
}
```

---

### Error Responses

404 Resume not found

401 Unauthorized

---

# POST

/api/v1/resumes

---

## Description

Create a new resume.

---

### Authentication

Required

---

### Request

Multipart Form Data

Fields

- name
- targetRole
- version
- notes
- resumeFile (PDF)

---

### Validation

Resume File

- Required
- PDF only
- Maximum 5 MB

Name

- Required
- Maximum 100 characters

---

### Success Response

201 Created

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "message": "Resume uploaded successfully."
  }
}
```

---

### Error Responses

400 Invalid file

413 File too large

422 Validation error

---

# PUT

/api/v1/resumes/:id

---

## Description

Update resume information.

---

### Authentication

Required

---

### Request Body

```json
{
  "name": "Frontend Resume",
  "targetRole": "Frontend Developer",
  "version": "v3",
  "notes": "Updated skills."
}
```

---

### Success Response

200 OK

```json
{
  "success": true,
  "data": {
    "message": "Resume updated successfully."
  }
}
```

---

# DELETE

/api/v1/resumes/:id

---

## Description

Delete a resume.

---

### Authentication

Required

---

### Business Rule

A resume linked to one or more applications SHALL NOT be deleted.

---

### Success Response

200 OK

```json
{
  "success": true,
  "data": {
    "message": "Resume deleted successfully."
  }
}
```

---

### Error Responses

400 Resume is linked to existing applications

404 Resume not found

401 Unauthorized

---

# PATCH

/api/v1/resumes/:id/default

---

## Description

Set a resume as the default resume.

---

### Authentication

Required

---

### Success Response

200 OK

```json
{
  "success": true,
  "data": {
    "message": "Default resume updated."
  }
}
```

---
---

# Application APIs

---

# GET

/api/v1/applications

---

## Description

Retrieve a paginated list of job applications belonging to the authenticated user.

---

### Authentication

Required

---

### Query Parameters

```
?page=1
&limit=20
&search=Google
&status=Applied
&jobType=Internship
&workMode=Remote
&source=LinkedIn
&sort=application_date
&order=desc
```

---

### Success Response

200 OK

```json
{
  "success": true,
  "data": {
    "applications": [
      {
        "id": "uuid",
        "companyName": "Google",
        "jobTitle": "Software Engineer Intern",
        "status": "Applied",
        "applicationDate": "2026-07-20",
        "resumeId": "uuid"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 87,
      "totalPages": 5
    }
  }
}
```

---

### Error Responses

401 Unauthorized

500 Internal Server Error

---

# GET

/api/v1/applications/:id

---

## Description

Retrieve a single job application.

---

### Authentication

Required

---

### Success Response

200 OK

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "companyName": "Google",
    "jobTitle": "Software Engineer Intern",
    "department": "Engineering",
    "jobType": "Internship",
    "workMode": "Remote",
    "location": "Bangalore",
    "source": "LinkedIn",
    "applicationDate": "2026-07-20",
    "currentStatus": "Applied",
    "resumeId": "uuid",
    "recruiterName": "Jane Smith",
    "recruiterEmail": "jane@google.com",
    "salary": 1500000,
    "jobUrl": "https://careers.google.com",
    "notes": "Applied through referral."
  }
}
```

---

### Error Responses

401 Unauthorized

404 Application not found

---

# POST

/api/v1/applications

---

## Description

Create a new job application.

---

### Authentication

Required

---

### Request Body

```json
{
  "companyName": "Google",
  "jobTitle": "Software Engineer Intern",
  "department": "Engineering",
  "jobType": "Internship",
  "workMode": "Remote",
  "location": "Bangalore",
  "source": "LinkedIn",
  "applicationDate": "2026-07-20",
  "resumeId": "uuid",
  "recruiterName": "Jane Smith",
  "recruiterEmail": "jane@google.com",
  "salary": 1500000,
  "jobUrl": "https://careers.google.com",
  "notes": "Applied through referral."
}
```

---

### Validation

Required

- Company Name
- Job Title
- Job Type
- Work Mode
- Source
- Resume ID
- Application Date

---

### Success Response

201 Created

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "message": "Application created successfully."
  }
}
```

---

### Business Logic

The system SHALL automatically:

- Create the application.
- Create the first Application Status History record.
- Update Dashboard statistics.
- Generate an in-app notification.

---

### Error Responses

400 Invalid request

401 Unauthorized

422 Validation error

---

# PUT

/api/v1/applications/:id

---

## Description

Update an existing job application.

---

### Authentication

Required

---

### Request Body

Same schema as POST.

---

### Success Response

200 OK

```json
{
  "success": true,
  "data": {
    "message": "Application updated successfully."
  }
}
```

---

### Error Responses

401 Unauthorized

404 Application not found

422 Validation error

---

# PATCH

/api/v1/applications/:id/status

---

## Description

Update only the application status.

---

### Authentication

Required

---

### Request Body

```json
{
  "status": "Technical Interview",
  "notes": "Passed Online Assessment"
}
```

---

### Business Logic

The system SHALL:

- Update the current status.
- Insert a new Application Status History record.
- Update Dashboard statistics.
- Generate an in-app notification.

---

### Success Response

200 OK

```json
{
  "success": true,
  "data": {
    "message": "Application status updated successfully."
  }
}
```

---

### Error Responses

400 Invalid status

401 Unauthorized

404 Application not found

---

# GET

/api/v1/applications/:id/history

---

## Description

Retrieve the complete status history for a job application.

---

### Authentication

Required

---

### Success Response

200 OK

```json
{
  "success": true,
  "data": [
    {
      "previousStatus": null,
      "newStatus": "Applied",
      "changedAt": "2026-07-20T12:00:00Z",
      "notes": null
    },
    {
      "previousStatus": "Applied",
      "newStatus": "Technical Interview",
      "changedAt": "2026-07-24T09:30:00Z",
      "notes": "Passed OA"
    }
  ]
}
```

---

# DELETE

/api/v1/applications/:id

---

## Description

Delete a job application.

---

### Authentication

Required

---

### Business Rules

Deleting an application SHALL also delete:

- Linked interviews
- Linked reminders
- Application status history

---

### Success Response

200 OK

```json
{
  "success": true,
  "data": {
    "message": "Application deleted successfully."
  }
}
```

---

### Error Responses

401 Unauthorized

404 Application not found

---
# Interview APIs

---

## Overview

These APIs manage interview scheduling, interview progress, and interview history.

Every interview MUST belong to exactly one application.

All interview APIs require authentication.

---

# GET

`/api/v1/interviews`

---

## Description

Retrieve a paginated list of interviews.

---

### Authentication

Required

---

### Query Parameters

```text
?page=1
&limit=20
&status=Scheduled
&result=Pending
&applicationId=uuid
&sort=scheduled_date
&order=asc
```

---

### Success Response

```json
{
  "success": true,
  "data": {
    "interviews": [
      {
        "id": "uuid",
        "applicationId": "uuid",
        "companyName": "Google",
        "jobTitle": "Software Engineer Intern",
        "interviewRound": "Technical Round 1",
        "scheduledDate": "2026-08-10",
        "scheduledTime": "14:00",
        "status": "Scheduled"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 12,
      "totalPages": 1
    }
  }
}
```

---

# GET

`/api/v1/interviews/:id`

---

## Description

Retrieve a single interview.

---

### Authentication

Required

---

### Success Response

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "applicationId": "uuid",
    "interviewRound": "Technical Round 1",
    "interviewType": "Online",
    "status": "Scheduled",
    "result": "Pending",
    "interviewerName": "Jane Smith",
    "interviewerEmail": "jane@example.com",
    "meetingPlatform": "Google Meet",
    "meetingLink": "https://meet.google.com/...",
    "scheduledDate": "2026-08-10",
    "scheduledTime": "14:00",
    "timezone": "Asia/Kolkata",
    "preparationNotes": "",
    "interviewFeedback": "",
    "questionsAsked": "",
    "personalNotes": ""
  }
}
```

---

# POST

`/api/v1/interviews`

---

## Description

Create a new interview.

---

### Authentication

Required

---

### Request Body

```json
{
  "applicationId": "uuid",
  "interviewRound": "Technical Round 1",
  "interviewType": "Online",
  "scheduledDate": "2026-08-10",
  "scheduledTime": "14:00",
  "timezone": "Asia/Kolkata",
  "meetingPlatform": "Google Meet",
  "meetingLink": "https://meet.google.com/...",
  "interviewerName": "Jane Smith",
  "interviewerEmail": "jane@example.com",
  "preparationNotes": ""
}
```

---

### Business Logic

The system SHALL:

- Verify application ownership.
- Create interview.
- Update dashboard.
- Generate notification.

---

### Success Response

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "message": "Interview created successfully."
  }
}
```

---

# PUT

`/api/v1/interviews/:id`

---

## Description

Update interview details.

---

### Authentication

Required

---

### Success Response

```json
{
  "success": true,
  "data": {
    "message": "Interview updated successfully."
  }
}
```

---

# PATCH

`/api/v1/interviews/:id/status`

---

## Description

Update interview status and result.

---

### Request Body

```json
{
  "status": "Completed",
  "result": "Passed",
  "interviewFeedback": "Strong DSA questions.",
  "questionsAsked": "Trees, Graphs, Dynamic Programming"
}
```

---

### Business Logic

The system SHALL:

- Update interview status.
- Update interview result.
- Update dashboard statistics.
- Generate notification.

---

### Success Response

```json
{
  "success": true,
  "data": {
    "message": "Interview updated successfully."
  }
}
```

---

# DELETE

`/api/v1/interviews/:id`

---

## Description

Delete an interview.

---

### Authentication

Required

---

### Success Response

```json
{
  "success": true,
  "data": {
    "message": "Interview deleted successfully."
  }
}
```

---

# Reminder APIs

---

## Overview

Reminder APIs manage follow-ups, interview reminders, deadlines, and personal career tasks.

---

# GET

`/api/v1/reminders`

---

### Query Parameters

```text
?page=1
&limit=20
&status=Pending
&priority=High
&sort=due_date
&order=asc
```

---

### Success Response

```json
{
  "success": true,
  "data": {
    "reminders": [
      {
        "id": "uuid",
        "title": "Follow up with Google",
        "priority": "High",
        "status": "Pending",
        "dueDate": "2026-08-11"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 18,
      "totalPages": 1
    }
  }
}
```

---

# POST

`/api/v1/reminders`

---

### Request Body

```json
{
  "applicationId": "uuid",
  "title": "Send Follow-up Email",
  "description": "Email recruiter regarding application.",
  "priority": "High",
  "reminderType": "Follow-up",
  "dueDate": "2026-08-11",
  "dueTime": "10:00"
}
```

---

### Business Logic

The system SHALL:

- Create reminder.
- Update dashboard.
- Generate notification.

---

### Success Response

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "message": "Reminder created successfully."
  }
}
```

---

# PATCH

`/api/v1/reminders/:id/complete`

---

## Description

Mark a reminder as completed.

---

### Success Response

```json
{
  "success": true,
  "data": {
    "message": "Reminder marked as completed."
  }
}
```

---

# DELETE

`/api/v1/reminders/:id`

---

### Success Response

```json
{
  "success": true,
  "data": {
    "message": "Reminder deleted successfully."
  }
}
```

---
# Dashboard APIs

---

## Overview

Dashboard APIs provide aggregated information for the authenticated user.

These endpoints return summaries, statistics, recent activity, upcoming interviews, and reminders.

Dashboard APIs MUST NOT return another user's data.

---

# GET

`/api/v1/dashboard`

---

## Description

Retrieve all dashboard data required to render the home screen.

---

### Authentication

Required

---

### Success Response

```json
{
  "success": true,
  "data": {
    "summary": {
      "totalApplications": 42,
      "activeApplications": 18,
      "interviews": 9,
      "offers": 2,
      "rejections": 7
    },
    "upcomingInterviews": [],
    "upcomingReminders": [],
    "recentApplications": []
  }
}
```

---

## Business Logic

The system SHALL:

- Calculate statistics.
- Load upcoming interviews.
- Load upcoming reminders.
- Load recent applications.
- Return all data in a single response.

---

# GET

`/api/v1/dashboard/stats`

---

## Description

Retrieve dashboard statistics only.

---

### Success Response

```json
{
  "success": true,
  "data": {
    "totalApplications": 42,
    "activeApplications": 18,
    "interviews": 9,
    "offers": 2,
    "rejections": 7
  }
}
```

---

# Analytics APIs

---

## Overview

Analytics APIs calculate performance metrics using application and interview data.

---

# GET

`/api/v1/analytics`

---

## Description

Retrieve analytics for the authenticated user.

---

### Authentication

Required

---

### Success Response

```json
{
  "success": true,
  "data": {
    "totalApplications": 42,
    "activeApplications": 18,
    "interviews": 9,
    "offersReceived": 2,
    "offersAccepted": 1,
    "rejections": 7,
    "interviewRate": 21.4,
    "offerRate": 4.8,
    "applicationsThisMonth": 12
  }
}
```

---

## Business Logic

The backend SHALL calculate analytics in real time.

No values shall be manually stored.

---

# Feedback APIs

---

## Overview

Feedback APIs allow users to submit bugs, feature requests, and general product feedback.

---

# GET

`/api/v1/feedback`

---

## Description

Retrieve feedback submitted by the authenticated user.

---

### Authentication

Required

---

### Success Response

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "category": "Feature Request",
      "title": "Dark Mode",
      "status": "Submitted",
      "submittedAt": "2026-07-23T10:00:00Z"
    }
  ]
}
```

---

# POST

`/api/v1/feedback`

---

## Request Body

```json
{
  "category": "Bug Report",
  "title": "Application page crashes",
  "description": "The page crashes when saving an application."
}
```

---

### Business Logic

The system SHALL:

- Validate the request.
- Save feedback.
- Record browser information.
- Record device information.
- Return success.

---

### Success Response

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "message": "Feedback submitted successfully."
  }
}
```

---

# DELETE

`/api/v1/feedback/:id`

---

## Description

Delete feedback if its status is still "Submitted".

---

### Success Response

```json
{
  "success": true,
  "data": {
    "message": "Feedback deleted successfully."
  }
}
```

---

# Notification APIs

---

## Overview

Notifications inform users about important events inside CareerOS.

Notifications are system-generated only.

---

# GET

`/api/v1/notifications`

---

## Description

Retrieve all notifications.

---

### Query Parameters

```text
?page=1
&limit=20
&status=Unread
```

---

### Success Response

```json
{
  "success": true,
  "data": {
    "notifications": [
      {
        "id": "uuid",
        "title": "Interview Tomorrow",
        "message": "Google interview is scheduled for tomorrow at 2:00 PM.",
        "type": "Interview Scheduled",
        "status": "Unread",
        "createdAt": "2026-07-23T10:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 8,
      "totalPages": 1
    }
  }
}
```

---

# PATCH

`/api/v1/notifications/:id/read`

---

## Description

Mark a notification as read.

---

### Success Response

```json
{
  "success": true,
  "data": {
    "message": "Notification marked as read."
  }
}
```

---

# DELETE

`/api/v1/notifications/:id`

---

## Description

Delete a notification.

---

### Success Response

```json
{
  "success": true,
  "data": {
    "message": "Notification deleted successfully."
  }
}
```

---

# Standard Error Codes

| Code | Description |
|------|-------------|
| AUTH_REQUIRED | Authentication required |
| INVALID_CREDENTIALS | Invalid email or password |
| ACCESS_DENIED | User is not authorized |
| USER_NOT_FOUND | User not found |
| PROFILE_NOT_FOUND | Profile not found |
| RESUME_NOT_FOUND | Resume not found |
| APPLICATION_NOT_FOUND | Application not found |
| INTERVIEW_NOT_FOUND | Interview not found |
| REMINDER_NOT_FOUND | Reminder not found |
| FEEDBACK_NOT_FOUND | Feedback not found |
| NOTIFICATION_NOT_FOUND | Notification not found |
| VALIDATION_ERROR | Request validation failed |
| FILE_TOO_LARGE | Uploaded file exceeds limit |
| INVALID_FILE_TYPE | Unsupported file type |
| INTERNAL_SERVER_ERROR | Unexpected server error |

---
