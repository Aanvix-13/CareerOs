# CareerOS

# Frontend Architecture

---

# Document Metadata

| Field | Value |
|-------|-------|
| Document ID | DOC-005 |
| Document Name | Frontend Architecture |
| File Name | 05_FRONTEND_ARCHITECTURE.md |
| Version | 1.0.0 |
| Status | Approved |
| Audience | AI Coding Agent, Frontend Developers |

---

# Purpose

This document defines the complete frontend architecture for the CareerOS MVP.

It specifies:

- Folder structure
- Routing
- Page architecture
- Component architecture
- State management
- Form handling
- UI standards
- Reusable components
- Frontend coding conventions

The frontend implementation MUST follow this document.

---

# Frontend Goals

The frontend SHALL be:

- Fast
- Responsive
- Accessible
- Modular
- Reusable
- Maintainable
- AI-friendly
- Mobile-first

---

# Technology Stack

## Framework

Next.js (App Router)

---

## Language

TypeScript

---

## UI Library

React

---

## Styling

Tailwind CSS

---

## Icons

Lucide React

---

## Forms

React Hook Form

---

## Validation

Zod

---

## State Management

Zustand

---

## Data Fetching

Native Fetch API

---

# Folder Structure

```
app/
│
├── (public)/
│   ├── login/
│   ├── register/
│   └── forgot-password/
│
├── (protected)/
│   ├── dashboard/
│   ├── profile/
│   ├── resumes/
│   ├── applications/
│   ├── interviews/
│   ├── reminders/
│   ├── analytics/
│   ├── feedback/
│   └── settings/
│
├── api/
│
├── layout.tsx
├── page.tsx
└── globals.css
```

---

# Components Folder

```
components/

ui/

layout/

navigation/

forms/

cards/

tables/

dialogs/

modals/

empty-state/

loaders/

charts/

icons/
```

Every reusable component SHALL live inside the components directory.

---

# Features Folder

```
features/

auth/

dashboard/

profile/

resume/

application/

interview/

reminder/

analytics/

feedback/

notification/
```

Each feature SHALL own:

- Components
- Hooks
- Services
- Validation
- Types

---

# Route Structure

## Public Routes

```
/

/login

/register

/forgot-password
```

---

## Protected Routes

```
/dashboard

/profile

/resumes

/applications

/interviews

/reminders

/analytics

/feedback

/settings
```

All protected routes require authentication.

---

# Layout Structure

```
Root Layout

↓

Authentication Layout

↓

Dashboard Layout

↓

Feature Page

↓

Feature Components

↓

UI Components
```

---

# Dashboard Layout

Every authenticated page SHALL include:

- Sidebar Navigation
- Top Navigation
- Page Header
- Main Content
- Footer (Optional)

---

# Navigation Items

- Dashboard
- Applications
- Resume Library
- Interviews
- Reminders
- Analytics
- Feedback
- Profile
- Settings
- Logout

---

# Component Architecture

Components SHALL follow this hierarchy.

```
Page

↓

Feature Component

↓

Business Component

↓

Reusable UI Component
```

Example

```
Dashboard Page

↓

Statistics Cards

↓

Stat Card

↓

Card
```

---

# Component Rules

Components SHALL:

- Be reusable
- Be typed
- Receive props
- Avoid business logic
- Avoid database access

Business logic belongs to feature services.

---

# Page Responsibilities

Pages SHALL:

- Load feature data
- Render layouts
- Handle navigation

Pages SHALL NOT:

- Access the database
- Contain business logic
- Perform complex calculations

---
---

# UI Architecture

## Design Philosophy

CareerOS SHALL follow a clean, modern, and productivity-focused interface.

The UI should help users focus on managing their job search with minimal distractions.

---

# Design Principles

- Simple
- Consistent
- Responsive
- Accessible
- Mobile-first
- Fast loading
- Minimal clicks
- Clear navigation

---

# Responsive Breakpoints

| Device | Width |
|----------|--------|
| Mobile | < 640px |
| Tablet | 640px – 1023px |
| Laptop | 1024px – 1439px |
| Desktop | ≥ 1440px |

Every page MUST be responsive.

---

# Design System

## Colors

The design system SHALL define semantic colors.

Primary

- Brand Primary

Secondary

- Brand Secondary

Success

- Success

Warning

- Warning

Danger

- Error

Neutral

- Background
- Surface
- Border
- Text

The implementation SHOULD use centralized design tokens.

---

## Typography

Heading Levels

- H1
- H2
- H3
- H4

Body

- Large
- Regular
- Small

Caption

- Extra Small

Font sizes SHALL remain consistent across all pages.

---

## Spacing

Use an 8-point spacing system.

Examples

```
4px

8px

16px

24px

32px

40px

48px
```

---

# Reusable UI Components

The application SHALL provide reusable components for:

Buttons

Cards

Badges

Input Fields

Text Areas

Dropdowns

Checkboxes

Radio Buttons

Switches

Tables

Pagination

Search Box

Empty States

Loading Spinner

Skeleton Loader

Toast Notifications

Modal Dialogs

Confirmation Dialogs

Date Picker

Time Picker

File Upload

Avatar

Breadcrumb

Tooltip

Tabs

Accordion

Status Badge

Progress Indicator

---

# Button Variants

Supported button styles

- Primary
- Secondary
- Outline
- Ghost
- Danger
- Success

Supported sizes

- Small
- Medium
- Large

---

# Form Architecture

Every form SHALL use:

- React Hook Form
- Zod Validation

Forms include:

- Registration
- Login
- Profile
- Resume
- Application
- Interview
- Reminder
- Feedback

---

# Form Validation

Validation SHALL occur:

1. Client Side
2. Server Side

Client validation improves UX.

Server validation guarantees security.

---

# Form Error Display

Errors SHALL appear:

- Below the input field
- In clear language
- Without exposing technical details

Example

```
Company name is required.
```

NOT

```
Validation Error 302
```

---

# Loading States

Every asynchronous action SHALL display loading feedback.

Examples

- Login
- Save Profile
- Upload Resume
- Create Application
- Update Interview
- Save Reminder

Loading indicators MAY include:

- Spinner
- Skeleton
- Disabled Button

---

# Empty States

Every list page SHALL provide an empty state.

Example

Applications

```
No applications found.

Click "Add Application" to create your first application.
```

---

Resumes

```
No resumes uploaded.

Upload your first resume.
```

---

Interviews

```
No interviews scheduled.
```

---

Reminders

```
No reminders available.
```

---

# Success Feedback

Successful operations SHALL provide immediate feedback.

Examples

- Resume uploaded successfully.
- Application created successfully.
- Reminder completed.
- Interview updated.

Use toast notifications.

---

# Confirmation Dialogs

Confirmation SHALL be required before:

- Delete Resume
- Delete Application
- Delete Interview
- Delete Reminder
- Delete Feedback

Dialog MUST clearly explain the action.

---

# File Upload Component

Supported files

Resume

- PDF

Profile Image

- JPG
- PNG
- JPEG

Display

- Upload Progress
- File Name
- File Size

---

# Table Components

Applications Table SHALL support

- Pagination
- Search
- Filters
- Sorting
- Responsive Layout

---

Interview Table SHALL support

- Sorting
- Pagination

---

Reminder Table SHALL support

- Priority Badge
- Due Date
- Status Badge

---

# Accessibility Requirements

The frontend SHALL:

- Support keyboard navigation
- Use semantic HTML
- Include ARIA labels where needed
- Maintain sufficient color contrast
- Display visible focus indicators

---
---

# State Management

## Overview

CareerOS uses **Zustand** for global state management.

The global state SHALL contain only data shared across multiple features.

Feature-specific state SHOULD remain local.

---

# Global Stores

The application SHALL define the following stores.

```
Auth Store

User Store

Dashboard Store

Notification Store
```

Additional stores may be added only when required.

---

# Auth Store

## Responsibilities

- Authentication status
- Current session
- Login
- Logout
- Token validation
- Loading state

Example State

```typescript
isAuthenticated

user

loading
```

---

# User Store

## Responsibilities

- User profile
- Profile updates
- Preferences

Example State

```typescript
profile

loading

error
```

---

# Dashboard Store

Stores dashboard summary.

Contains

- Statistics
- Recent Applications
- Upcoming Interviews
- Upcoming Reminders

---

# Notification Store

Stores

- Notification List
- Unread Count

Updates automatically after API calls.

---

# Local State

Local component state SHALL be used for:

- Dialog visibility
- Form inputs
- Search text
- Table sorting
- Filters
- Pagination

Avoid storing temporary UI state globally.

---

# API Communication

The frontend communicates only with the REST API.

Flow

```
Component

↓

Feature Service

↓

REST API

↓

Backend

↓

Database
```

Components SHALL NEVER communicate directly with the database.

---

# Feature Services

Each feature SHALL provide a service layer.

Example

```
Auth Service

Profile Service

Resume Service

Application Service

Interview Service

Reminder Service

Analytics Service

Feedback Service

Notification Service
```

Responsibilities

- API calls
- Error handling
- Response transformation

Business logic remains on the backend.

---

# Error Handling

Every API request SHALL handle:

- Network failure
- Unauthorized access
- Validation errors
- Server errors

Unexpected errors SHALL display a generic message.

Example

```
Something went wrong.

Please try again.
```

---

# Authentication Flow

```
User Login

↓

Validate Form

↓

POST Login API

↓

Receive Cookie

↓

Update Auth Store

↓

Redirect Dashboard
```

---

# Protected Route Flow

```
Open Protected Route

↓

Check Authentication

↓

Authenticated?

↓

Yes → Load Page

↓

No → Redirect Login
```

---

# Logout Flow

```
Logout Button

↓

Logout API

↓

Clear Auth Store

↓

Redirect Login
```

---

# Dashboard Loading Flow

```
Dashboard Opens

↓

Dashboard API

↓

Update Dashboard Store

↓

Render Widgets
```

---

# Application CRUD Flow

```
Application Page

↓

Create/Edit/Delete

↓

Application Service

↓

API

↓

Refresh Application List

↓

Update Dashboard
```

---

# Resume Upload Flow

```
Select PDF

↓

Client Validation

↓

Upload API

↓

Store File

↓

Create Resume Record

↓

Refresh Resume Library
```

---

# Interview Flow

```
Create Interview

↓

Interview Service

↓

API

↓

Refresh Interview List

↓

Update Dashboard
```

---

# Reminder Flow

```
Create Reminder

↓

Reminder Service

↓

API

↓

Refresh Reminder List

↓

Update Dashboard
```

---

# Notification Flow

```
System Event

↓

Notification Created

↓

Notification API

↓

Notification Store Updated

↓

Unread Badge Refresh
```

---

# Performance Guidelines

The frontend SHALL:

- Lazy load large pages.
- Minimize unnecessary re-renders.
- Fetch only required data.
- Use pagination for lists.
- Reuse UI components.
- Optimize images.
- Keep JavaScript bundles small.

---

# Coding Standards

All frontend code SHALL:

- Use TypeScript.
- Use strict typing.
- Avoid duplicated logic.
- Use reusable components.
- Follow feature-based architecture.
- Use meaningful file names.
- Use descriptive variable names.

---

# Naming Conventions

## Components

PascalCase

Examples

```
ApplicationCard

ResumeUploader

InterviewTable
```

---

## Hooks

camelCase with "use"

Examples

```
useAuth

useDashboard

useApplications
```

---

## Files

Use kebab-case.

Examples

```
application-card.tsx

resume-form.tsx

dashboard-sidebar.tsx
```

---

## CSS

Tailwind utility classes only.

Do not create feature-specific CSS files unless absolutely necessary.

---

# Frontend Implementation Checklist

Before implementation, verify:

- Folder structure follows this document.
- Components are reusable.
- Forms use React Hook Form.
- Validation uses Zod.
- Global state uses Zustand.
- API calls go through feature services.
- Protected routes are secured.
- Loading states are implemented.
- Error states are handled.
- Empty states are implemented.
- Responsive design works.
- Accessibility requirements are met.

---
