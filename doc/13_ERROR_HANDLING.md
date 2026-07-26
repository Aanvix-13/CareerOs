# CareerOS

# Error Handling

---

# Document Metadata

| Field | Value |
|-------|-------|
| Document ID | DOC-013 |
| Document Name | Error Handling |
| File Name | 13_ERROR_HANDLING.md |
| Version | 1.0.0 |
| Status | Approved |
| Audience | AI Coding Agent, Backend Developers, Frontend Developers |

---

# Purpose

This document defines the standard error handling strategy for the CareerOS MVP.

All frontend and backend code SHALL follow this specification.

---

# Error Handling Principles

The system SHALL:

- Return consistent error responses.
- Never expose internal implementation details.
- Log unexpected server errors.
- Display user-friendly error messages.
- Use appropriate HTTP status codes.
- Keep error responses predictable.

---

# Standard Error Response

Every failed API request SHALL return:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message."
  }
}
```

Optional validation details:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed.",
    "details": [
      {
        "field": "email",
        "message": "Invalid email address."
      }
    ]
  }
}
```

---

# HTTP Status Codes

| Status | Meaning |
|---------|---------|
| 200 | Success |
| 201 | Resource Created |
| 204 | No Content |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 413 | Payload Too Large |
| 415 | Unsupported Media Type |
| 422 | Validation Error |
| 429 | Too Many Requests |
| 500 | Internal Server Error |

---

# Standard Error Codes

## Authentication

```text
AUTH_REQUIRED

INVALID_CREDENTIALS

TOKEN_EXPIRED

INVALID_TOKEN

ACCESS_DENIED
```

---

## User

```text
USER_NOT_FOUND

EMAIL_ALREADY_EXISTS
```

---

## Profile

```text
PROFILE_NOT_FOUND
```

---

## Resume

```text
RESUME_NOT_FOUND

INVALID_RESUME_FILE

RESUME_IN_USE
```

---

## Application

```text
APPLICATION_NOT_FOUND

INVALID_APPLICATION_STATUS
```

---

## Interview

```text
INTERVIEW_NOT_FOUND
```

---

## Reminder

```text
REMINDER_NOT_FOUND
```

---

## Feedback

```text
FEEDBACK_NOT_FOUND
```

---

## Notification

```text
NOTIFICATION_NOT_FOUND
```

---

## Validation

```text
VALIDATION_ERROR
```

---

## Files

```text
FILE_TOO_LARGE

INVALID_FILE_TYPE
```

---

## Server

```text
INTERNAL_SERVER_ERROR

DATABASE_ERROR

UNKNOWN_ERROR
```

---

# Client Error Handling

The frontend SHALL:

- Display friendly error messages.
- Preserve user input after validation errors.
- Highlight invalid fields.
- Retry only when appropriate.
- Redirect to login after authentication failures.

---

# Backend Error Handling

The backend SHALL:

- Catch unexpected exceptions.
- Log server errors.
- Return standardized responses.
- Hide stack traces from clients.
- Roll back failed database transactions where applicable.

---

# Validation Errors

Validation errors SHALL:

- Return HTTP 422.
- Include field-specific details when applicable.
- Never expose implementation details.

Example:

```json
{
  "field": "companyName",
  "message": "Company name is required."
}
```

---

# Authentication Errors

Invalid login credentials:

```text
401 Unauthorized
```

Expired session:

```text
401 Unauthorized
```

Accessing another user's resource:

```text
403 Forbidden
```

---

# File Upload Errors

Examples:

- File exceeds size limit.
- Unsupported file type.
- Corrupted file.

Return appropriate status codes and user-friendly messages.

---

# Database Errors

The backend SHALL:

- Catch Prisma/database exceptions.
- Log technical details internally.
- Return a generic message to the client.

Example:

```json
{
  "success": false,
  "error": {
    "code": "DATABASE_ERROR",
    "message": "A database error occurred."
  }
}
```

---

# Logging Rules

The backend SHALL log:

- Server exceptions
- Database failures
- Authentication failures
- Unexpected errors

The backend SHALL NOT log:

- Passwords
- JWT tokens
- Password hashes
- Sensitive personal information

---

# Frontend User Messages

Examples:

Validation:

```text
Please enter a valid email address.
```

Server:

```text
Something went wrong.

Please try again later.
```

Network:

```text
Unable to connect.

Check your internet connection.
```

Unauthorized:

```text
Your session has expired.

Please log in again.
```

---

# Error Handling Checklist

Before implementation, verify:

- Standard response format is used.
- Correct HTTP status codes are returned.
- Error codes are consistent.
- Validation errors include field details.
- Sensitive information is never exposed.
- Unexpected errors are logged.
- User-facing messages are clear and actionable.

---
