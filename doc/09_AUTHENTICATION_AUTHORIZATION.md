# CareerOS

# Authentication & Authorization

---

# Document Metadata

| Field | Value |
|-------|-------|
| Document ID | DOC-009 |
| Document Name | Authentication & Authorization |
| File Name | 09_AUTHENTICATION_AUTHORIZATION.md |
| Version | 1.0.0 |
| Status | Approved |
| Audience | AI Coding Agent, Backend Developers |

---

# Purpose

This document defines authentication and authorization for the CareerOS MVP.

It specifies:

- User authentication
- Session management
- Authorization rules
- Protected routes
- Password security
- JWT management
- Cookie configuration

All authentication and authorization MUST follow this specification.

---

# Authentication Method

CareerOS SHALL use:

- JWT (JSON Web Token)
- HTTP-Only Cookies

Passwords SHALL NEVER be stored in plain text.

Passwords MUST be hashed using bcrypt.

---

# Authentication Flow

```text
User

↓

Login Page

↓

Validate Input

↓

Verify Credentials

↓

Generate JWT

↓

Store JWT in HTTP-Only Cookie

↓

Return Success

↓

Redirect Dashboard
```

---

# Registration Flow

```text
Register

↓

Validate Input

↓

Check Existing Email

↓

Hash Password

↓

Create User

↓

Create Profile

↓

Generate JWT

↓

Store Cookie

↓

Dashboard
```

---

# Logout Flow

```text
Logout Request

↓

Validate Session

↓

Clear Cookie

↓

Return Success

↓

Redirect Login
```

---

# Protected Route Flow

```text
User Request

↓

Authentication Middleware

↓

JWT Valid?

↓

Yes

↓

Load User

↓

Continue Request

↓

Return Response
```

Invalid JWT

```text
↓

401 Unauthorized
```

---

# Password Requirements

Minimum length

- 8 characters

Recommended

- Uppercase letter
- Lowercase letter
- Number
- Special character

Passwords SHALL always be hashed before storage.

---

# JWT Configuration

JWT SHALL contain

```text
User ID

Email

Issued At

Expiration Time
```

JWT SHALL NOT contain

- Password
- Password Hash
- Personal Notes
- Resume Data

---

# Cookie Configuration

Authentication cookie SHALL be

- HTTP-Only
- Secure (Production)
- SameSite=Lax
- Path=/

JavaScript SHALL NOT access the authentication cookie.

---

# Authorization Rules

Every protected request SHALL verify

- User is authenticated.
- User exists.
- Resource belongs to the authenticated user.

Example

Allowed

```text
User A

↓

Own Resume

✓
```

Blocked

```text
User A

↓

User B Resume

✗
```

---

# Resource Ownership

The backend MUST verify ownership before accessing:

- Profile
- Resume
- Application
- Interview
- Reminder
- Feedback
- Notification

Access SHALL be denied if ownership verification fails.

---

# Session Validation

Every protected request SHALL:

- Read JWT
- Verify signature
- Verify expiration
- Load user
- Continue request

Expired tokens SHALL return

```text
401 Unauthorized
```

---

# Login Validation

Validate

- Email
- Password

Possible responses

- Success
- Invalid credentials
- User not found
- Validation error

---

# Registration Validation

Validate

- Full Name
- Email
- Password

Email MUST be unique.

---

# Password Hashing

Algorithm

```text
bcrypt
```

Passwords SHALL NEVER be reversible.

---

# Security Requirements

The authentication system SHALL

- Use HTTPS in production
- Protect private routes
- Validate JWT signature
- Validate JWT expiration
- Hash passwords
- Prevent unauthorized resource access

---

# Authentication Middleware

Middleware responsibilities

- Verify JWT
- Load authenticated user
- Reject invalid sessions
- Attach user context to request

Middleware SHALL execute before protected endpoints.

---

# Public Routes

The following routes SHALL NOT require authentication

```text
/

login

register

forgot-password
```

---

# Protected Routes

The following routes SHALL require authentication

```text
dashboard

profile

resumes

applications

interviews

reminders

analytics

feedback

notifications

settings
```

---

# Error Responses

Unauthorized

```json
{
  "success": false,
  "error": {
    "code": "AUTH_REQUIRED",
    "message": "Authentication required."
  }
}
```

Forbidden

```json
{
  "success": false,
  "error": {
    "code": "ACCESS_DENIED",
    "message": "Access denied."
  }
}
```

---

# Authentication Checklist

Before implementation, verify:

- Passwords use bcrypt hashing.
- JWT is signed securely.
- JWT is stored in HTTP-Only cookies.
- Middleware protects private routes.
- Resource ownership is validated.
- Public routes remain accessible.
- Invalid sessions return 401.
- Authorization failures return 403.
- Passwords are never logged.
- Secrets are stored in environment variables.

---
