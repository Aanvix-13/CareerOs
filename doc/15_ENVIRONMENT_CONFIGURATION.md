# CareerOS

# Environment Configuration

---

# Document Metadata

| Field | Value |
|-------|-------|
| Document ID | DOC-015 |
| Document Name | Environment Configuration |
| File Name | 15_ENVIRONMENT_CONFIGURATION.md |
| Version | 1.0.0 |
| Status | Approved |
| Audience | AI Coding Agent, Backend Developers, Frontend Developers |

---

# Purpose

This document defines all environment variables required for the CareerOS MVP.

Environment variables SHALL be used for configuration and secrets.

Sensitive values MUST NOT be hardcoded.

---

# Environment Files

Development

```text
.env.local
```

Production

```text
Vercel Environment Variables
```

---

# Required Variables

## Database

```text
DATABASE_URL=
```

Description

PostgreSQL connection string.

Required

YES

---

## JWT Secret

```text
JWT_SECRET=
```

Description

Secret used to sign and verify JWT tokens.

Required

YES

---

## JWT Expiration

```text
JWT_EXPIRES_IN=
```

Example

```text
7d
```

Required

YES

---

## Password Hashing

```text
BCRYPT_ROUNDS=
```

Recommended

```text
12
```

Required

YES

---

## Application URL

```text
NEXT_PUBLIC_APP_URL=
```

Development Example

```text
http://localhost:3000
```

Production Example

```text
https://careeros.app
```

Required

YES

---

## Runtime

```text
NODE_ENV=
```

Allowed Values

```text
development

production

test
```

Required

YES

---

# Optional Variables

## File Storage

If using Supabase Storage

```text
SUPABASE_URL=

SUPABASE_ANON_KEY=

SUPABASE_SERVICE_ROLE_KEY=

SUPABASE_STORAGE_BUCKET=
```

---

# Local Development Example

```text
DATABASE_URL=postgresql://...

JWT_SECRET=your-secret

JWT_EXPIRES_IN=7d

BCRYPT_ROUNDS=12

NEXT_PUBLIC_APP_URL=http://localhost:3000

NODE_ENV=development
```

---

# Production Example

```text
DATABASE_URL=postgresql://...

JWT_SECRET=strong-production-secret

JWT_EXPIRES_IN=7d

BCRYPT_ROUNDS=12

NEXT_PUBLIC_APP_URL=https://careeros.app

NODE_ENV=production
```

---

# Security Rules

Environment variables SHALL:

- Never be committed to Git.
- Never be exposed in API responses.
- Never be logged.
- Be managed through the deployment platform.

---

# Secret Rotation

The following secrets SHOULD be rotated periodically:

- JWT_SECRET
- Database credentials
- Storage service keys

After rotation, verify that the application functions correctly.

---

# Validation Rules

On application startup, the backend SHALL verify:

- Required variables exist.
- Values are not empty.
- Invalid configuration prevents application startup.

---

# Deployment Configuration

Development

```text
.env.local
```

Production

```text
Vercel Project Settings

↓

Environment Variables
```

---

# Environment Checklist

Before deployment, verify:

- DATABASE_URL is configured.
- JWT_SECRET is configured.
- JWT_EXPIRES_IN is configured.
- BCRYPT_ROUNDS is configured.
- NEXT_PUBLIC_APP_URL is correct.
- NODE_ENV is set correctly.
- Secrets are not committed to Git.
- Optional storage variables are configured if file storage is enabled.

---
