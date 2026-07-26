# CareerOS

# AI Development Rules

---

# Document Metadata

| Field | Value |
|-------|-------|
| Document ID | DOC-016 |
| Document Name | AI Development Rules |
| File Name | 16_AI_DEVELOPMENT_RULES.md |
| Version | 1.0.0 |
| Status | Approved |
| Audience | AI Coding Agents |

---

# Purpose

This document defines the mandatory development rules that every AI coding agent MUST follow while building the CareerOS MVP.

These rules override any assumptions made by the AI.

---

# Primary Objective

Build a production-ready MVP exactly as defined by the project documentation.

The AI SHALL prioritize:

- Correctness
- Simplicity
- Maintainability
- Consistency

The AI SHALL NOT add features outside the documented MVP scope.

---

# Source of Truth

The AI MUST follow the documents in this priority order:

```text
1. 01_MASTER_SPECIFICATION.md

2. 02_PRODUCT_REQUIREMENTS_DOCUMENT.md

3. 03_DATABASE_DESIGN.md

4. 04_SYSTEM_ARCHITECTURE.md

5. All remaining project documents
```

If a conflict exists, the higher-priority document SHALL take precedence.

---

# MVP Scope

The AI SHALL implement only the following modules:

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

The AI SHALL NOT implement any feature that is marked as "Future", "Post-MVP", or "Not in MVP".

---

# Architecture Rules

The AI SHALL follow the documented architecture exactly.

Required layers:

```text
API Route

↓

Middleware

↓

Validation

↓

Service

↓

Repository

↓

Prisma

↓

PostgreSQL
```

The AI SHALL NOT bypass any layer.

---

# Frontend Rules

The frontend SHALL:

- Use Next.js App Router.
- Use TypeScript.
- Use Tailwind CSS.
- Use Zustand for global state.
- Use React Hook Form.
- Use Zod validation.
- Use reusable components.
- Be mobile-first.
- Be responsive.

---

# Backend Rules

The backend SHALL:

- Use Route Handlers.
- Keep business logic inside Services.
- Keep database queries inside Repositories.
- Validate every request.
- Protect private routes.
- Return standardized API responses.

---

# Database Rules

The AI SHALL:

- Use Prisma ORM.
- Use PostgreSQL.
- Use UUID primary keys.
- Define relationships exactly as documented.
- Create indexes where specified.
- Enforce foreign key constraints.

---

# Authentication Rules

The AI SHALL:

- Use JWT authentication.
- Store JWT in HTTP-only cookies.
- Hash passwords using bcrypt.
- Verify authentication before protected requests.
- Verify resource ownership before data access.

---

# API Rules

Every endpoint SHALL:

- Validate input.
- Return consistent responses.
- Use correct HTTP status codes.
- Handle errors gracefully.

---

# Coding Standards

The AI SHALL:

- Write clean code.
- Avoid duplicate logic.
- Use descriptive names.
- Keep functions focused on one responsibility.
- Remove unused code.
- Use strict TypeScript typing.

---

# Performance Rules

The AI SHALL:

- Use pagination for lists.
- Load only required data.
- Avoid unnecessary database queries.
- Minimize API response size.
- Reuse components where possible.

---

# Security Rules

The AI SHALL:

- Validate all input.
- Sanitize user input.
- Never expose secrets.
- Never expose stack traces.
- Never log passwords or tokens.
- Validate uploaded files.
- Enforce HTTPS in production.

---

# Error Handling Rules

The AI SHALL:

- Use standardized error responses.
- Return user-friendly messages.
- Log unexpected server errors.
- Never expose internal implementation details.

---

# Documentation Rules

The AI SHALL:

- Follow all project documentation.
- Avoid undocumented assumptions.
- Keep naming consistent across the project.
- Update documentation only when explicitly requested.

---

# Prohibited Actions

The AI SHALL NOT:

- Add extra features.
- Change the database schema without documentation.
- Ignore validation rules.
- Skip authentication checks.
- Access the database directly from API routes.
- Write business logic inside controllers or route handlers.
- Introduce unnecessary dependencies.
- Replace documented technologies without approval.

---

# Code Quality Checklist

Before considering any feature complete, verify:

- Code compiles successfully.
- No TypeScript errors.
- No ESLint errors.
- Validation is implemented.
- Authentication is enforced.
- Authorization is enforced.
- Error handling follows project standards.
- API responses are standardized.
- Database operations are correct.
- Responsive UI works correctly.

---

# Definition of Done

A feature is complete only when:

- Functional requirements are implemented.
- Validation passes.
- Errors are handled.
- Security requirements are met.
- Documentation is followed.
- Code is production-ready.

---
