# CareerOS

# Project Overview

---

# Document Metadata

| Field | Value |
|-------|-------|
| Document ID | DOC-000 |
| Document Name | Project Overview |
| File Name | 00_PROJECT_OVERVIEW.md |
| Version | 1.0.0 |
| Status | Approved |
| Audience | AI Coding Agents, Developers, Contributors |

---

# Purpose

This document provides a high-level overview of the CareerOS MVP.

It is the first document an AI coding agent or developer should read after the `README.md`.

It explains:

- What CareerOS is
- Why it exists
- Who it is built for
- MVP scope
- Core modules
- Technology stack
- Architecture overview
- Development principles
- Documentation structure

This document is an overview only. Detailed implementation is defined in the remaining project documents.

---

# Project Summary

CareerOS is a modern web application that helps students and job seekers manage their complete job search from a single dashboard.

Instead of using spreadsheets, notes, emails, and calendars separately, CareerOS centralizes everything into one organized platform.

The MVP focuses on solving one primary problem:

> Help students efficiently organize and track their job search.

---

# Target Users

Primary Users

- College Students
- Fresh Graduates
- Intern Applicants
- Entry-Level Job Seekers

The MVP is optimized for individual users.

Team collaboration and recruiter features are outside the MVP scope.

---

# Problem Statement

Job seekers often struggle to manage:

- Multiple resumes
- Numerous job applications
- Interview schedules
- Follow-up reminders
- Application status tracking

Information becomes scattered across different tools, increasing the chance of missed opportunities.

CareerOS provides a single platform to manage the entire process.

---

# Solution

CareerOS enables users to:

- Store multiple resumes.
- Track every application.
- Schedule interviews.
- Create reminders.
- View job search progress.
- Receive important notifications.
- Submit product feedback.

---

# MVP Scope

The MVP includes only the following modules:

- Authentication
- User Profile
- Resume Library
- Job Applications
- Interview Tracker
- Reminders
- Dashboard
- Analytics
- Feedback
- Notifications
- Settings

Any feature not listed above is outside the MVP scope.

---

# Core User Journey

```text
Register

↓

Login

↓

Complete Profile

↓

Upload Resume

↓

Create Job Application

↓

Track Status

↓

Schedule Interview

↓

Create Reminder

↓

View Dashboard & Analytics
```

---

# Technology Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Backend | Next.js Route Handlers |
| Database | PostgreSQL |
| ORM | Prisma |
| Authentication | JWT + HTTP-Only Cookies |
| Validation | Zod |
| State Management | Zustand |
| Deployment | Vercel |
| File Storage | Supabase Storage |

---

# Architecture Overview

CareerOS follows a layered architecture.

```text
Frontend

↓

API Routes

↓

Middleware

↓

Validation

↓

Services

↓

Repositories

↓

Prisma ORM

↓

PostgreSQL
```

Each layer has a single responsibility.

---

# Development Principles

The project SHALL prioritize:

- Simplicity
- Security
- Performance
- Scalability
- Maintainability
- Type Safety
- Mobile-First Design
- Reusable Components
- AI-Friendly Architecture

---

# Documentation Structure

The project documentation consists of:

```text
README.md

00_PROJECT_OVERVIEW.md

01_MASTER_SPECIFICATION.md

02_PRODUCT_REQUIREMENTS_DOCUMENT.md

03_DATABASE_DESIGN.md

04_SYSTEM_ARCHITECTURE.md

05_API_SPECIFICATION.md

06_FRONTEND_ARCHITECTURE.md

07_UI_UX_SPECIFICATION.md

08_BACKEND_ARCHITECTURE.md

09_AUTHENTICATION_AUTHORIZATION.md

10_DATABASE_SCHEMA_PRISMA.md

11_BUSINESS_RULES.md

12_VALIDATION_RULES.md

13_ERROR_HANDLING.md

14_DEPLOYMENT_GUIDE.md

15_ENVIRONMENT_CONFIGURATION.md

16_AI_DEVELOPMENT_RULES.md
```

---

# Success Criteria

The MVP is considered successful when users can:

- Register and log in securely.
- Manage their profile.
- Upload and manage resumes.
- Track job applications.
- Schedule interviews.
- Create reminders.
- View dashboard statistics.
- Monitor analytics.
- Submit feedback.
- Manage account settings.

---

# Out of Scope

The following features are intentionally excluded from the MVP:

- AI Resume Review
- AI Interview Preparation
- Email Notifications
- Calendar Integrations
- Team Collaboration
- Recruiter Portal
- Admin Dashboard
- Company CRM
- Multi-user Organizations
- Subscription & Payments

These features may be implemented in future versions.

---

# Project Status

```text
Version: 1.0.0 (MVP)

Documentation Status: Complete

Development Status: Ready for Implementation
```

---

# END OF PROJECT OVERVIEW DOCUMENT