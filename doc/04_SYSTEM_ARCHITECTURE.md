# CareerOS

# System Architecture Document

---

# Document Metadata

| Field | Value |
|-------|-------|
| Document ID | DOC-003 |
| Document Name | System Architecture |
| File Name | 03_SYSTEM_ARCHITECTURE.md |
| Version | 1.0.0 |
| Status | Approved |
| Owner | Engineering |
| Audience | AI Coding Agent, Backend Developer, Frontend Developer, DevOps |

---

# Purpose

This document defines the complete technical architecture of CareerOS MVP.

It explains:

- Overall architecture
- Frontend architecture
- Backend architecture
- Authentication flow
- Data flow
- File storage
- Deployment architecture
- Security architecture
- Service boundaries

This document is the single source of truth for system implementation.

---

# Architecture Principles

CareerOS follows these principles:

- Keep architecture simple.
- Build only what MVP requires.
- Modular design.
- Separation of concerns.
- API-first architecture.
- Scalable foundation.
- Secure by default.
- AI-friendly project structure.

---

# High Level Architecture

```

+-----------------------+
\| Browser |
+-----------+-----------+
|
v
+-----------------------+
\| Next.js Frontend |
+-----------+-----------+
|
REST API
|
v
+-----------------------+
\| Backend API |
+-----------+-----------+
|
+------------------+
| |
v v

+---------------+ +------------------+
\| PostgreSQL | | File Storage |
+---------------+ +------------------+

```

---

# Technology Stack

## Frontend

Framework

Next.js

Language

TypeScript

UI

React

Styling

Tailwind CSS

Icons

Lucide Icons

State Management

Zustand

Form Validation

React Hook Form

Schema Validation

Zod

HTTP Client

Native Fetch API

---

## Backend

Framework

Next.js Route Handlers

Language

TypeScript

ORM

Prisma

Authentication

JWT + HTTP Only Cookies

Password Hashing

bcrypt

Validation

Zod

---

## Database

PostgreSQL

---

## File Storage

Local Storage (Development)

Cloud Object Storage (Production)

---

# Architecture Style

CareerOS uses a layered architecture.

```

Presentation Layer

↓

API Layer

↓

Business Logic Layer

↓

Data Access Layer

↓

Database

```

Each layer has one responsibility.

No layer may directly access another non-adjacent layer.

---

# Project Structure

```

careeros/

│

├── app/

├── components/

├── features/

├── lib/

├── services/

├── repositories/

├── prisma/

├── types/

├── hooks/

├── utils/

├── public/

├── docs/

└── middleware.ts

```

---

# Feature Modules

Each feature owns its own files.

Example

```

features/

authentication/

profile/

resume/

application/

interview/

reminder/

feedback/

dashboard/

notification/

```

No feature may directly modify another feature's internal files.

Communication occurs only through services or APIs.

---

# Frontend Architecture

Frontend is component-driven.

Hierarchy

```

Page

↓

Layout

↓

Feature

↓

Components

↓

UI Elements

```

---

# Component Rules

Components must be:

- Small
- Reusable
- Stateless whenever possible
- Typed
- Accessible

Components should not contain database logic.

Business logic belongs in services.

---

# Routing Strategy

Public Routes

- /
- /login
- /register
- /forgot-password

Protected Routes

- /dashboard
- /profile
- /resumes
- /applications
- /interviews
- /reminders
- /analytics
- /feedback
- /settings

Protected routes require authentication.

---
---

# Backend Architecture

## Overview

The backend is responsible for:

- Authentication
- Authorization
- Business Logic
- Data Validation
- Database Access
- File Upload Management
- API Responses
- Error Handling

The backend SHALL NOT contain UI-related logic.

---

# Backend Layer Structure

```

HTTP Request

↓

Middleware

↓

Route Handler

↓

Validation

↓

Service Layer

↓

Repository Layer

↓

Database

↓

Response

```

Every request MUST pass through this flow.

---

# Layer Responsibilities

## Middleware

Responsible for:

- Authentication
- Authorization
- Request Logging
- Security Headers
- Rate Limiting (Future)

Middleware MUST NOT access the database directly.

---

## Route Handlers

Responsible for:

- Receiving HTTP Requests
- Calling Validation
- Calling Services
- Returning HTTP Responses

Route handlers MUST remain thin.

Business logic MUST NOT be written here.

---

## Service Layer

Responsible for:

- Business Logic
- Validation Rules
- Workflow Management
- Permission Checks

Services are the heart of the application.

Every feature SHOULD have its own service.

Example

```

ApplicationService

ResumeService

InterviewService

ReminderService

```

---

## Repository Layer

Responsible for:

- Database Queries
- CRUD Operations
- Prisma Access

Repositories SHALL NEVER contain business logic.

---

# Authentication Flow

Authentication uses:

- JWT Access Token
- HTTP Only Cookie

Flow

```

User Login

↓

Validate Credentials

↓

Generate JWT

↓

Store JWT in HTTP Only Cookie

↓

Return Success

↓

Protected Request

↓

Middleware Validates JWT

↓

Access Granted

```

Unauthenticated requests SHALL receive:

```

401 Unauthorized

```

---

# Authorization Rules

Every authenticated request MUST verify:

- User exists
- Session is valid
- Resource belongs to user

Example

```

User A

↓

Application A

✓ Allowed

```

```

User B

↓

Application A

❌ Forbidden

```

The backend MUST NEVER expose another user's data.

---

# Validation Strategy

All incoming data SHALL be validated using Zod.

Validation occurs BEFORE business logic.

Validation includes:

- Required Fields
- Data Types
- Length Limits
- Enum Values
- Email Format
- URL Format
- UUID Format

Invalid requests SHALL return:

```

400 Bad Request

```

---

# Business Logic Rules

Business rules belong ONLY inside the Service Layer.

Examples

✓ Create Application

✓ Update Status

✓ Prevent Resume Deletion

✓ Calculate Analytics

✓ Create Notifications

These rules SHALL NEVER exist inside:

- Components
- Route Handlers
- Repositories

---

# Error Handling Strategy

Every API response SHALL use a consistent format.

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
    "code": "APPLICATION_NOT_FOUND",
    "message": "Application not found."
  }
}
```

The backend SHALL NEVER expose:

- Stack traces
- SQL queries
- Internal errors
- Prisma errors

to the client.

---

# Logging Strategy

The backend SHALL log:

- User Registration
- Login
- Logout
- Failed Login
- Password Reset
- Resume Upload
- Application Created
- Interview Created
- Reminder Created
- Server Errors

Sensitive information SHALL NEVER be logged.

Examples:

❌ Password

❌ JWT

❌ Password Hash

---

# File Upload Flow

```

User Uploads Resume

↓

Validate File

↓

Check Type

↓

Check Size

↓

Save File

↓

Generate File URL

↓

Save URL in Database

↓

Return Success

```

Only metadata SHALL be stored in PostgreSQL.

Actual files SHALL remain in storage.

---

# Storage Strategy

Database stores:

- Metadata
- File URLs

Storage contains:

- Resume PDFs
- Profile Images

The database SHALL NEVER store binary files.

---

# Dependency Rules

Allowed

```

Route

↓

Service

↓

Repository

↓

Database

```

NOT Allowed

```

Route

↓

Database

```

NOT Allowed

```

Component

↓

Database

```

NOT Allowed

```

Component

↓

Prisma

```

Every layer communicates only with the next layer.

---
---

# Data Flow Architecture

## Overview

Every request in CareerOS SHALL follow a predictable and consistent flow.

This ensures maintainability, scalability, and easier debugging.

---

# Authentication Request Flow

```
User

↓

Login Page

↓

Form Validation

↓

POST /api/auth/login

↓

Route Handler

↓

Zod Validation

↓

Authentication Service

↓

User Repository

↓

PostgreSQL

↓

Password Verification

↓

Generate JWT

↓

Set HTTP-Only Cookie

↓

Return Success

↓

Dashboard
```

---

# Create Application Flow

```
Dashboard

↓

Application Form

↓

Client Validation

↓

POST /api/applications

↓

Authentication Middleware

↓

Route Handler

↓

Zod Validation

↓

Application Service

↓

Resume Validation

↓

Business Rules Validation

↓

Application Repository

↓

PostgreSQL

↓

Application Created

↓

Status History Created

↓

Notification Created

↓

Success Response

↓

Dashboard Refresh
```

---

# Update Application Status Flow

```
Application Details

↓

Select New Status

↓

PATCH /api/applications/:id/status

↓

Authentication

↓

Ownership Validation

↓

Business Validation

↓

Update Application

↓

Insert Status History

↓

Generate Notification

↓

Return Updated Application
```

---

# Resume Upload Flow

```
Resume Library

↓

Select PDF

↓

Client Validation

↓

POST /api/resumes

↓

Authentication

↓

Validate File Type

↓

Validate File Size

↓

Upload Storage

↓

Generate File URL

↓

Create Database Record

↓

Return Success

↓

Resume Library Refresh
```

---

# Reminder Flow

```
User Creates Reminder

↓

Validation

↓

Reminder Service

↓

Database

↓

Reminder Saved

↓

Dashboard Widget Updated

↓

Notification Generated (if applicable)
```

---

# Service Communication Rules

Services SHALL communicate only through defined interfaces.

Example:

```
Application Service

↓

Resume Service

↓

Repository

↓

Database
```

Services SHALL NOT bypass repositories.

---

# Repository Pattern

Each feature SHALL have its own repository.

Example

```
UserRepository

ProfileRepository

ResumeRepository

ApplicationRepository

InterviewRepository

ReminderRepository

FeedbackRepository

NotificationRepository
```

Responsibilities:

- Create
- Read
- Update
- Delete
- Search
- Filter
- Pagination

Repositories SHALL NOT contain business logic.

---

# State Management

Frontend global state SHALL include:

```
Authentication

Current User

Dashboard Summary

Notification Count

Theme (Future)
```

Feature-specific state SHALL remain local whenever possible.

Avoid unnecessary global state.

---

# Caching Strategy

MVP caching rules:

- Do not cache authenticated user data in shared caches.
- Browser may cache static assets.
- Database remains the source of truth.
- Add Redis only after scaling requires it.

---

# Background Jobs

Not included in MVP.

Future candidates:

- Email notifications
- Reminder processing
- Scheduled cleanup
- Analytics aggregation

Current MVP executes operations synchronously.

---

# Security Architecture

## Authentication

- JWT
- HTTP-Only Cookies
- Secure Cookies (Production)

---

## Authorization

Every protected request MUST verify:

- Valid session
- Valid user
- Resource ownership

---

## Input Security

Validate:

- Strings
- Numbers
- UUIDs
- Dates
- URLs
- Email
- Uploaded files

Reject invalid input immediately.

---

## Output Security

Never expose:

- Password Hash
- Internal IDs not required by client
- Server Errors
- Stack Traces
- Database Errors

---

# API Versioning

Initial version:

```
/api/v1
```

Future versions:

```
/api/v2
/api/v3
```

Breaking changes MUST use a new API version.

---

# Scalability Strategy

The architecture SHOULD support future migration to:

- Dedicated Backend Service
- Microservices
- Redis Cache
- Queue Workers
- CDN
- Cloud Object Storage
- Multi-region Deployment

No MVP code should prevent these upgrades.

---

# Architecture Decision Summary

| Decision | Status |
|----------|--------|
| Next.js Full Stack | Approved |
| PostgreSQL | Approved |
| Prisma ORM | Approved |
| JWT Authentication | Approved |
| HTTP-Only Cookies | Approved |
| Tailwind CSS | Approved |
| TypeScript | Approved |
| Layered Architecture | Approved |
| Repository Pattern | Approved |
| Service Layer | Approved |

---

# Architecture Review Checklist

Before implementation, verify:

- Layered architecture is followed.
- Route handlers contain no business logic.
- Services own all business rules.
- Repositories own all database access.
- Authentication protects private routes.
- Authorization validates ownership.
- Validation occurs before business logic.
- APIs return consistent responses.
- Logging excludes sensitive data.
- File uploads follow the defined flow.
- Database is accessed only through repositories.

---
