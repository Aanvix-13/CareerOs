# CareerOS

# Validation Rules

---

# Document Metadata

| Field | Value |
|-------|-------|
| Document ID | DOC-012 |
| Document Name | Validation Rules |
| File Name | 12_VALIDATION_RULES.md |
| Version | 1.0.0 |
| Status | Approved |
| Audience | AI Coding Agent, Backend Developers, Frontend Developers |

---

# Purpose

This document defines all validation rules for the CareerOS MVP.

Validation SHALL occur on both:

- Client Side
- Server Side

Server-side validation is the final source of truth.

---

# General Validation Rules

The system SHALL:

- Trim leading and trailing whitespace.
- Reject empty required fields.
- Validate data types.
- Reject invalid enum values.
- Reject malformed UUIDs.
- Reject unexpected request fields.
- Sanitize user input before processing.

---

# User Registration

## Full Name

- Required
- Minimum: 2 characters
- Maximum: 100 characters

---

## Email

- Required
- Valid email format
- Maximum: 255 characters
- Must be unique

---

## Password

- Required
- Minimum: 8 characters
- Maximum: 128 characters

Recommended:

- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character

---

## Confirm Password

- Required
- Must match Password

---

# Login

## Email

- Required
- Valid email format

---

## Password

- Required

---

# Profile

## Full Name

- Required
- 2–100 characters

---

## Phone

- Optional
- Maximum: 20 characters

---

## College

- Optional
- Maximum: 150 characters

---

## Degree

- Optional
- Maximum: 100 characters

---

## Specialization

- Optional
- Maximum: 100 characters

---

## Graduation Year

- Optional
- Four-digit year

---

## Preferred Role

- Optional
- Maximum: 100 characters

---

## Preferred Location

- Optional
- Maximum: 100 characters

---

## Bio

- Optional
- Maximum: 1000 characters

---

# Resume

## Resume Name

- Required
- 2–100 characters

---

## Target Role

- Required
- Maximum: 100 characters

---

## Version

- Optional
- Maximum: 50 characters

---

## Notes

- Optional
- Maximum: 1000 characters

---

## Resume File

- Required
- PDF only
- Maximum size: 5 MB

---

# Job Application

## Company Name

- Required
- 2–150 characters

---

## Job Title

- Required
- 2–150 characters

---

## Department

- Optional
- Maximum: 100 characters

---

## Job Type

- Required
- Valid enum

---

## Work Mode

- Required
- Valid enum

---

## Location

- Optional
- Maximum: 150 characters

---

## Source

- Required
- Maximum: 100 characters

---

## Application Date

- Required
- Valid date

---

## Resume ID

- Required
- Valid UUID

---

## Recruiter Name

- Optional
- Maximum: 100 characters

---

## Recruiter Email

- Optional
- Valid email format

---

## Salary

- Optional
- Positive number

---

## Job URL

- Optional
- Valid HTTPS URL

---

## Notes

- Optional
- Maximum: 5000 characters

---

# Interview

## Interview Round

- Required
- Maximum: 100 characters

---

## Interview Type

- Required
- Valid enum

---

## Scheduled Date

- Required
- Valid date

---

## Scheduled Time

- Required
- Valid time

---

## Time Zone

- Required

---

## Meeting Platform

- Optional
- Maximum: 100 characters

---

## Meeting Link

- Optional
- Valid HTTPS URL

---

## Interviewer Name

- Optional
- Maximum: 100 characters

---

## Interviewer Email

- Optional
- Valid email format

---

## Preparation Notes

- Optional
- Maximum: 5000 characters

---

## Interview Feedback

- Optional
- Maximum: 5000 characters

---

## Questions Asked

- Optional
- Maximum: 5000 characters

---

## Personal Notes

- Optional
- Maximum: 5000 characters

---

# Reminder

## Title

- Required
- 2–150 characters

---

## Description

- Optional
- Maximum: 1000 characters

---

## Priority

- Required
- Valid enum

---

## Reminder Type

- Required
- Valid enum

---

## Due Date

- Required
- Valid date

---

## Due Time

- Optional
- Valid time

---

# Feedback

## Category

- Required
- Valid enum

---

## Title

- Required
- 2–150 characters

---

## Description

- Required
- Minimum: 10 characters
- Maximum: 5000 characters

---

# File Validation

## Resume

- PDF only
- Maximum: 5 MB

---

## Profile Image

- JPG
- JPEG
- PNG
- Maximum: 2 MB

---

# Validation Error Response

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed.",
    "details": [
      {
        "field": "companyName",
        "message": "Company name is required."
      }
    ]
  }
}
```

---

# Validation Checklist

Before implementation, verify:

- Required fields are enforced.
- String lengths are validated.
- UUIDs are validated.
- Email addresses are validated.
- URLs use HTTPS.
- Enum values are validated.
- File size and type restrictions are enforced.
- Validation is implemented on both client and server.

---
