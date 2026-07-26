# CareerOS

# Deployment Guide

---

# Document Metadata

| Field | Value |
|-------|-------|
| Document ID | DOC-014 |
| Document Name | Deployment Guide |
| File Name | 14_DEPLOYMENT_GUIDE.md |
| Version | 1.0.0 |
| Status | Approved |
| Audience | AI Coding Agent, Developers, DevOps |

---

# Purpose

This document defines the deployment process for the CareerOS MVP.

The MVP SHALL be simple to deploy, maintain, and update.

---

# Deployment Goals

The deployment MUST be:

- Secure
- Reliable
- Repeatable
- Low cost
- Production-ready

---

# Production Stack

## Frontend

```text
Vercel
```

---

## Backend

```text
Next.js API Routes
```

Hosted on

```text
Vercel
```

---

## Database

```text
PostgreSQL
```

Recommended providers

- Neon
- Supabase
- Railway

---

## File Storage

MVP

```text
Supabase Storage
```

Future

```text
AWS S3
Cloudflare R2
```

---

# Environment Variables

Production environment MUST define:

```text
DATABASE_URL

JWT_SECRET

JWT_EXPIRES_IN

BCRYPT_ROUNDS

NEXT_PUBLIC_APP_URL

NODE_ENV=production
```

Secrets SHALL NEVER be committed to Git.

---

# Build Process

```text
Install Dependencies

↓

Generate Prisma Client

↓

Run Database Migrations

↓

Build Application

↓

Deploy
```

---

# Database Migration

Before deployment

```text
prisma migrate deploy
```

After deployment

```text
Verify database schema.
```

---

# Deployment Checklist

Before deployment, verify:

- Environment variables are configured.
- Database is reachable.
- Prisma migrations are applied.
- Build completes successfully.
- No TypeScript errors.
- No ESLint errors.
- Authentication works.
- File uploads work.
- API endpoints respond correctly.

---

# Production Security

Production MUST:

- Use HTTPS.
- Enable secure cookies.
- Hide stack traces.
- Disable debug logging.
- Protect environment variables.

---

# Monitoring

Monitor:

- Application availability
- API response time
- Database health
- Server errors
- Authentication failures

---

# Backup Strategy

Database

- Daily automatic backups

Uploaded files

- Provider-managed backups

---

# Rollback Strategy

If deployment fails:

1. Roll back to the previous successful deployment.
2. Restore database only if a migration caused corruption.
3. Verify application health.

---

# Release Process

```text
Push Code

↓

Run CI Checks

↓

Deploy

↓

Run Smoke Tests

↓

Production Ready
```

---

# Smoke Tests

After deployment, verify:

- Registration
- Login
- Dashboard
- Resume upload
- Application CRUD
- Interview CRUD
- Reminder CRUD
- Feedback submission
- Logout

---

# Performance Targets

Home page

- Initial load < 3 seconds

API responses

- Typical response < 500 ms

Dashboard

- Load < 2 seconds

---

# MVP Deployment Checklist

- Frontend deployed
- Backend deployed
- Database connected
- Storage connected
- Environment variables configured
- HTTPS enabled
- Authentication verified
- File uploads verified
- CRUD operations verified
- Deployment successful

---
