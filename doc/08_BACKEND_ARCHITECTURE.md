# CareerOS

# Backend Architecture

---

# Document Metadata

| Field | Value |
|-------|-------|
| Document ID | DOC-008 |
| Document Name | Backend Architecture |
| File Name | 08_BACKEND_ARCHITECTURE.md |
| Version | 1.0.0 |
| Status | Approved |
| Audience | AI Coding Agent, Backend Developers |

---

# Purpose

This document defines the backend architecture for the CareerOS MVP.

It specifies:

- Project structure
- Layered architecture
- Request lifecycle
- Service layer
- Repository layer
- Middleware
- Validation
- Authentication
- Authorization
- File uploads
- Logging
- Error handling
- Security
- Deployment guidelines

The backend implementation MUST follow this specification.

---

# Backend Goals

The backend SHALL be:

- Modular
- Secure
- Maintainable
- Scalable
- AI-friendly
- RESTful
- Type-safe

---

# Technology Stack

## Framework

Next.js App Router (Route Handlers)

---

## Language

TypeScript

---

## ORM

Prisma ORM

---

## Database

PostgreSQL

---

## Authentication

JWT

HTTP-Only Cookies

---

## Validation

Zod

---

## Password Hashing

bcrypt

---

# Backend Folder Structure

```text
src/

├── app/
│   └── api/
│       └── v1/
│
├── middleware/
│
├── services/
│
├── repositories/
│
├── validators/
│
├── lib/
│
├── utils/
│
├── types/
│
├── constants/
│
├── prisma/
│
└── config/
```

---

# Architecture Pattern

CareerOS uses a layered architecture.

```text
Client

↓

API Route

↓

Middleware

↓

Validator

↓

Service

↓

Repository

↓

Prisma

↓

PostgreSQL
```

Every request MUST follow this flow.

---

# API Routes

Responsibilities

- Receive HTTP request
- Parse request
- Call validator
- Call service
- Return response

API routes SHALL NOT contain:

- Business logic
- Database queries

---

# Middleware Layer

Responsibilities

- Authenticate user
- Authorize user
- Validate session
- Add user context
- Apply security headers

Middleware SHALL execute before protected routes.

---

# Validation Layer

Validation SHALL occur before business logic.

Validation includes:

- Required fields
- String length
- Email format
- UUID format
- Date format
- URL format
- Enum values
- File validation

Invalid requests SHALL return HTTP 422.

---

# Service Layer

The Service Layer contains all business logic.

Example services

```text
AuthService

ProfileService

ResumeService

ApplicationService

InterviewService

ReminderService

DashboardService

AnalyticsService

FeedbackService

NotificationService
```

Responsibilities

- Business rules
- Data transformation
- Permission checks
- Workflow execution

Services SHALL NOT access Prisma directly.

---

# Repository Layer

Repositories are responsible only for database access.

Example repositories

```text
UserRepository

ProfileRepository

ResumeRepository

ApplicationRepository

InterviewRepository

ReminderRepository

FeedbackRepository

NotificationRepository
```

Responsibilities

- Create
- Read
- Update
- Delete
- Search
- Pagination
- Filtering

Repositories SHALL NOT contain business rules.

---

# Request Lifecycle

```text
HTTP Request

↓

Authentication Middleware

↓

Validation

↓

Route Handler

↓

Service

↓

Repository

↓

Database

↓

Repository

↓

Service

↓

API Response
```

---

# Dependency Rules

Allowed

```text
Route

↓

Service

↓

Repository

↓

Prisma

↓

Database
```

Not Allowed

```text
Route

↓

Prisma
```

Not Allowed

```text
Service

↓

Database
```

Not Allowed

```text
Component

↓

Database
```

---

# API Response Standard

Success

```json
{
  "success": true,
  "data": {}
}
```

Failure

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Company name is required."
  }
}
```

All endpoints SHALL follow this format.

---

# File Upload Flow

```text
Client

↓

Validate File

↓

Authentication

↓

Upload Handler

↓

Store File

↓

Save Metadata

↓

Return File URL
```

Supported files

Resume

- PDF

Profile Image

- JPG
- JPEG
- PNG

Maximum size

Resume

- 5 MB

Profile Image

- 2 MB

---

# Logging

The backend SHALL log:

- User registration
- Login
- Logout
- Resume upload
- Application creation
- Interview creation
- Reminder creation
- Server errors

The backend SHALL NOT log:

- Passwords
- JWT tokens
- Password hashes
- Sensitive personal data

---

# Error Handling

Every unexpected error SHALL:

- Be logged
- Return a generic message
- Never expose stack traces
- Never expose SQL queries

Example

```json
{
  "success": false,
  "error": {
    "code": "INTERNAL_SERVER_ERROR",
    "message": "An unexpected error occurred."
  }
}
```

---

# Security Requirements

The backend SHALL:

- Hash passwords using bcrypt
- Store JWT in HTTP-Only cookies
- Validate every protected request
- Verify resource ownership
- Sanitize user input
- Validate uploaded files
- Enforce HTTPS in production

---

# Environment Variables

Required variables

```text
DATABASE_URL

JWT_SECRET

JWT_EXPIRES_IN

BCRYPT_ROUNDS

NEXT_PUBLIC_APP_URL

NODE_ENV
```

Secrets SHALL NEVER be committed to Git.

---

# Performance Guidelines

The backend SHALL:

- Use pagination for list endpoints
- Select only required columns
- Avoid duplicate queries
- Use indexes defined in the database design
- Keep API responses lightweight

---

# Backend Implementation Checklist

Before implementation, verify:

- Layered architecture is followed.
- Routes contain no business logic.
- Services contain all business rules.
- Repositories contain all database queries.
- Validation is applied to every request.
- Authentication protects private endpoints.
- Authorization verifies resource ownership.
- Errors follow the standard response format.
- File uploads are validated.
- Logging excludes sensitive information.
- Environment variables are configured.
- Security requirements are implemented.

---
