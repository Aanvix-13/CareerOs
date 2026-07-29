# CareerOS

# Admin Dashboard Specification

---

# Document Metadata

| Field | Value |
|-------|-------|
| Document ID | DOC-017 |
| Document Name | Admin Dashboard Specification |
| File Name | 17_ADMIN_DASHBOARD_SPECIFICATION.md |
| Version | 2.0.0 |
| Status | Approved |
| Audience | AI Coding Agent, Frontend Developers, Backend Developers |

---

# Purpose

This document defines the complete Level 3 specification for the CareerOS Admin Dashboard.

The Admin Dashboard is an internal platform used exclusively by administrators to monitor, manage, and maintain the CareerOS application.

This document SHALL be considered the single source of truth for all admin-related implementation.

The implementation MUST follow this specification exactly.

---

# Goals

The Admin Dashboard SHALL enable administrators to:

- Monitor platform health.
- Manage registered users.
- Review user feedback.
- Publish announcements.
- Monitor platform analytics.
- Configure application settings.
- Maintain platform security.

The dashboard SHALL NOT include end-user functionality.

---

# Technology Stack

The Admin Dashboard SHALL use the same technology stack as the main application.

## Frontend

- Next.js App Router
- TypeScript
- Tailwind CSS
- React
- Zustand
- React Hook Form
- Zod

---

## Backend

- Next.js Route Handlers

---

## Database

- Supabase PostgreSQL

Database access SHALL be performed through Prisma ORM.

Direct SQL queries SHALL NOT be used unless explicitly required.

---

## ORM

- Prisma ORM

---

## Authentication

The application SHALL use Clerk Authentication.

Authentication responsibilities:

- Sign In
- Sign Out
- Session Management
- User Identity
- Protected Routes

The application SHALL NOT implement custom authentication.

---

## Authorization

Administrator authorization SHALL use Clerk Public Metadata.

Example

```json
{
  "role": "admin"
}
```

Only users whose metadata contains

```text
role = admin
```

SHALL access the Admin Dashboard.

---

## File Storage

Uploaded files SHALL use

Supabase Storage

---

## Deployment

Frontend

Vercel

Backend

Vercel

Database

Supabase PostgreSQL

Storage

Supabase Storage

---

# Administrator Roles

The MVP SHALL support only one administrator role.

```text
Administrator
```

No role hierarchy exists in the MVP.

Future versions MAY introduce:

- Super Admin
- Moderator
- Support Agent

These roles SHALL NOT be implemented during MVP.

---

# Authentication Flow

```text
Administrator

↓

Clerk Sign In

↓

Clerk Authentication

↓

Session Created

↓

Check Public Metadata

↓

role == admin ?

↓

YES

↓

Admin Dashboard

↓

NO

↓

403 Forbidden
```

---

# Route Protection

Every admin route SHALL verify:

1. Clerk session exists.

2. User is authenticated.

3. Public metadata contains:

```text
role = admin
```

If authentication fails

Return

```text
401 Unauthorized
```

If authorization fails

Return

```text
403 Forbidden
```

---

# Admin Application Structure

```text
Admin Dashboard

│

├── Dashboard

├── Users

├── Feedback

├── Notifications

├── Analytics

├── Settings

├── Profile

└── Logout
```

Every module SHALL have its own route.

Example

```text
/admin

/admin/users

/admin/feedback

/admin/notifications

/admin/analytics

/admin/settings

/admin/profile
```

---

# Admin Layout

The layout SHALL contain

```text
Top Navigation

↓

Left Sidebar

↓

Main Content Area

↓

Footer
```

---

# Top Navigation

The Top Navigation SHALL display

- CareerOS Logo
- Page Title
- Search Button
- Notifications Icon
- Administrator Avatar
- Profile Menu

---

# Sidebar

The sidebar SHALL remain visible on desktop.

Tablet

Collapsible

Mobile

Drawer Navigation

---

# Sidebar Menu

```text
Dashboard

Users

Feedback

Notifications

Analytics

Settings

Profile

Logout
```

The currently active page SHALL be highlighted.

---

# Dashboard Overview

Purpose

Provide administrators with a real-time overview of platform activity.

The Dashboard SHALL load immediately after successful authentication.

---

# Dashboard Layout

```text
Statistics Cards

↓

Analytics Charts

↓

Recent Activity

↓

Quick Actions
```

---

# Statistics Cards

The Dashboard SHALL display:

- Total Users
- Active Users
- New Users Today
- Total Applications
- Total Resumes
- Total Interviews
- Total Feedback
- Pending Feedback

Each card SHALL include:

- Icon
- Title
- Numeric Value
- Percentage Change
- Last Updated Timestamp

Statistics SHALL be calculated using live data from Supabase PostgreSQL.

Values SHALL NOT be manually stored.

---

# Data Source

Dashboard statistics SHALL retrieve data from:

Users Table

Applications Table

Resumes Table

Interviews Table

Feedback Table

Notification Table

Queries SHALL use Prisma ORM.

---

# Dashboard Charts

The Dashboard SHALL display visual analytics using live data from Supabase PostgreSQL.

Charts SHALL automatically refresh when the page is refreshed.

The MVP SHALL include the following charts:

- User Growth
- Application Growth
- Interview Activity
- Feedback Distribution

---

## User Growth Chart

Purpose

Display new user registrations over time.

Supported time ranges

- Last 7 Days
- Last 30 Days
- Last 12 Months

Data Source

```text
User Table
```

Chart Type

```text
Line Chart
```

---

## Application Growth Chart

Purpose

Display job applications created over time.

Chart Type

```text
Bar Chart
```

Data Source

```text
Application Table
```

---

## Interview Activity

Purpose

Display interviews scheduled over time.

Chart Type

```text
Line Chart
```

Data Source

```text
Interview Table
```

---

## Feedback Distribution

Purpose

Display submitted feedback by category.

Categories

- Bug Report
- Feature Request
- Improvement Suggestion
- General Feedback

Chart Type

```text
Pie Chart
```

Data Source

```text
Feedback Table
```

---

# Recent Activity

Purpose

Provide administrators with recent platform events.

The activity feed SHALL display the latest 20 events.

Each activity SHALL include:

- User Name
- Event Type
- Description
- Timestamp

Examples

```text
Aayush uploaded Resume v3

↓

Rahul created a Job Application

↓

Priya submitted Bug Report

↓

Ankit scheduled Interview
```

Activities SHALL be ordered from newest to oldest.

---

# Quick Actions

The dashboard SHALL include shortcut buttons.

Available actions

- View Users
- Review Feedback
- Send Notification
- Open Settings

---

# Users Module

Purpose

Manage all registered users.

---

# Users Page Layout

```text
Page Header

↓

Statistics

↓

Search

↓

Filters

↓

User Table

↓

Pagination
```

---

# User Statistics

Display

- Total Users
- Active Users
- Suspended Users
- New Users This Week

Statistics SHALL be calculated dynamically.

---

# User Search

Search SHALL support

- Full Name
- Email Address
- College Name

Search SHALL ignore letter case.

Search SHALL update results instantly.

---

# User Filters

Available filters

Account Status

- Active
- Suspended

Registration

- Today
- This Week
- This Month

Sorting

- Newest
- Oldest
- A-Z
- Z-A

Multiple filters SHALL work together.

---

# User Table

Each row SHALL display

- Profile Image
- Full Name
- Email
- College
- Applications
- Resumes
- Registration Date
- Status
- Actions

---

# Pagination

Default page size

```text
20 Users
```

Administrator MAY choose

- 20
- 50
- 100

Pagination SHALL be server-side.

---

# User Actions

Each user SHALL support

- View
- Suspend
- Activate
- Delete

Delete SHALL require confirmation.

---

# View User

Selecting "View" SHALL open the User Details page.

Route

```text
/admin/users/[userId]
```

---

# User Details Layout

```text
Profile Card

↓

Statistics

↓

Tabs
```

---

# Profile Card

Display

- Profile Photo
- Full Name
- Email
- Phone
- College
- Degree
- Preferred Role
- Registration Date

Information SHALL be retrieved from Supabase using Prisma.

---

# User Statistics

Display

- Total Applications
- Total Resumes
- Total Interviews
- Total Reminders
- Total Notifications

Statistics SHALL use live database queries.

---

# User Detail Tabs

The following tabs SHALL be available.

```text
Profile

Applications

Resumes

Interviews

Reminders

Feedback
```

Each tab SHALL load independently.

---

# Applications Tab

Display

- Company
- Job Title
- Status
- Application Date

Actions

- View

No editing SHALL be available from the Admin Dashboard.

---

# Resume Tab

Display

- Resume Name
- Version
- Uploaded Date
- Default Resume

Actions

- Download

Resume editing SHALL NOT be supported.

---

# Interview Tab

Display

- Company
- Round
- Interview Date
- Result

Actions

- View

---

# Reminder Tab

Display

- Title
- Due Date
- Priority
- Status

Administrators SHALL have read-only access.

---

# Feedback Tab

Display all feedback submitted by the selected user.

Columns

- Category
- Title
- Status
- Created Date

Actions

- View

---

# Suspend User

Suspending a user SHALL

- Block Clerk authentication access through role/status checks in the application.
- Prevent access to protected routes.
- Preserve all user data.

The user's records SHALL NOT be deleted.

---

# Activate User

Activating a user SHALL

- Restore application access.
- Keep all previous data unchanged.

---

# Delete User

Deleting a user SHALL require confirmation.

Confirmation Dialog

```text
Delete User?

This action cannot be undone.

[Cancel]

[Delete]
```

Deleting a user SHALL remove

- Profile
- Applications
- Interviews
- Reminders
- Feedback
- Notifications
- Resume metadata

Associated files stored in Supabase Storage SHALL also be deleted.

Database deletion SHALL be executed using Prisma with the documented relationship rules.

---

# Empty States

Users

```text
No users found.
```

Search

```text
No matching users found.
```

Applications

```text
No applications available.
```

Resumes

```text
No resumes uploaded.
```

Feedback

```text
No feedback submitted.
```

---

# Loading States

Every Users page SHALL display skeleton loaders while data is loading.

Tables SHALL NOT appear empty while requests are in progress.

---

# Success Messages

Examples

```text
User suspended successfully.

User activated successfully.

User deleted successfully.
```

---

# Error Messages

Examples

```text
Unable to load users.

Unable to suspend user.

Unable to delete user.

Please try again later.
```

---

# Feedback Module

## Purpose

The Feedback module enables administrators to review, categorize, manage, and resolve user-submitted feedback.

Feedback is read-only for users after submission. Administrators are responsible for updating its status.

---

# Feedback Page Layout

```text
Page Header

↓

Statistics Cards

↓

Search

↓

Filters

↓

Feedback Table

↓

Pagination
```

---

# Statistics Cards

Display:

- Total Feedback
- Bug Reports
- Feature Requests
- Improvement Suggestions
- General Feedback
- Pending Feedback
- Resolved Feedback

Statistics SHALL be calculated using live data from Supabase PostgreSQL through Prisma.

---

# Search

Administrators SHALL be able to search feedback by:

- Title
- Description
- User Name
- User Email

Search SHALL be case-insensitive.

---

# Filters

Category

- Bug Report
- Feature Request
- Improvement Suggestion
- General Feedback

Status

- Submitted
- In Progress
- Completed
- Closed

Date

- Today
- Last 7 Days
- Last 30 Days
- Custom Range

Multiple filters SHALL work together.

---

# Feedback Table

Columns

- Category
- Title
- Submitted By
- Status
- Created Date
- Last Updated
- Actions

---

# Actions

Each feedback SHALL support:

- View
- Change Status
- Delete

Deleting feedback SHALL require confirmation.

---

# Feedback Detail

Route

```text
/admin/feedback/[feedbackId]
```

Display:

## User Information

- Name
- Email

---

## Feedback Information

- Category
- Title
- Description
- Current Status
- Submitted Date
- Last Updated

---

## Administrator Notes

Administrators MAY add internal notes.

These notes SHALL NOT be visible to users.

---

## Status Workflow

Allowed transitions

```text
Submitted

↓

In Progress

↓

Completed

↓

Closed
```

The system SHALL reject invalid transitions.

---

# Business Rules

Users SHALL NOT edit feedback after submission.

Only administrators MAY update feedback status.

Deleting feedback SHALL permanently remove it from the database.

---

# Notifications Module

## Purpose

Allow administrators to send announcements to platform users.

---

# Notification Layout

```text
Notification List

↓

Create Notification

↓

History
```

---

# Notification List

Display

- Title
- Audience
- Created By
- Sent Date
- Status

---

# Create Notification

Fields

Title

- Required
- Maximum 100 characters

Message

- Required
- Maximum 1000 characters

Audience

Required

Options

- All Users
- New Users
- Selected Users

---

# Validation Rules

Title

- Required
- 2–100 characters

Message

- Required
- 5–1000 characters

Audience

- Required

---

# Actions

- Send
- Save Draft
- Delete Draft

---

# Send Notification

When a notification is sent:

- A notification record SHALL be stored in Supabase PostgreSQL.
- Selected users SHALL receive the notification inside the application.
- Delivery SHALL be handled by the backend.

The MVP SHALL NOT send emails or push notifications.

---

# Notification History

Display

- Title
- Audience
- Sent Date
- Total Recipients

History SHALL be read-only.

---

# Analytics Module

## Purpose

Provide administrators with insights into platform usage.

---

# Analytics Dashboard

Display

## User Analytics

- Total Users
- New Users
- Daily Active Users
- Monthly Active Users

---

## Application Analytics

- Total Applications
- Applications This Week
- Applications This Month

---

## Interview Analytics

- Total Interviews
- Upcoming Interviews
- Completed Interviews

---

## Resume Analytics

- Total Resumes
- Average Resumes Per User

---

## Feedback Analytics

- Total Feedback
- Open Feedback
- Closed Feedback
- Category Distribution

---

# Analytics Charts

Charts SHALL support

- Last 7 Days
- Last 30 Days
- Last 12 Months

Chart Types

- Line Chart
- Bar Chart
- Pie Chart

Data SHALL be queried from Supabase PostgreSQL using Prisma.

---

# Export

The MVP SHALL support:

- CSV Export

Future versions MAY support:

- PDF
- Excel

---

# Empty States

Feedback

```text
No feedback available.
```

Notifications

```text
No notifications found.
```

Analytics

```text
No analytics data available.
```

---

# Loading States

All pages SHALL display skeleton loaders while fetching data.

Charts SHALL display loading placeholders until data is available.

---

# Success Messages

Examples

```text
Feedback status updated successfully.

Notification sent successfully.

Draft saved successfully.
```

---

# Error Messages

Examples

```text
Unable to load feedback.

Unable to update feedback.

Unable to send notification.

Analytics could not be loaded.
```

---

# Settings Module

## Purpose

The Settings module allows administrators to configure platform-wide settings for the CareerOS MVP.

Only administrators SHALL have access to this module.

---

# Settings Layout

```text
General

↓

Uploads

↓

Security

↓

Application

↓

Save Changes
```

---

# General Settings

The General section SHALL include:

- Application Name
- Application Logo
- Support Email
- Contact Email
- Default Time Zone

---

## Validation

Application Name

- Required
- 2–100 characters

Support Email

- Required
- Valid email format

Contact Email

- Optional
- Valid email format

---

# Upload Settings

Administrators SHALL configure:

- Maximum Resume Size
- Allowed Resume Types
- Maximum Profile Image Size
- Allowed Image Types

---

## Default Values

Resume Size

```text
5 MB
```

Allowed Resume Types

```text
PDF
```

Profile Image Size

```text
2 MB
```

Allowed Image Types

```text
JPG

JPEG

PNG
```

---

# Security Settings

The MVP SHALL support:

- Enable Maintenance Mode
- Allow New Registrations
- Enable User Feedback

The following SHALL NOT be configurable in the MVP:

- Password Policy
- Session Timeout
- Two-Factor Authentication

These are managed by Clerk.

---

# Clerk Integration

Authentication SHALL be fully managed by Clerk.

The Admin Dashboard SHALL NOT implement:

- Custom Login
- Password Reset
- Session Storage
- Authentication Database

Authentication responsibilities belong entirely to Clerk.

---

# Supabase Configuration

The application SHALL use:

Database

```text
Supabase PostgreSQL
```

Storage

```text
Supabase Storage
```

All database operations SHALL be executed through Prisma ORM.

Direct database access SHALL NOT be implemented.

---

# Save Settings

When administrators save settings:

The backend SHALL

- Validate input
- Update the database
- Return a success response
- Refresh displayed values

---

# Validation Errors

Example

```text
Application Name is required.

Support Email is invalid.

Maximum Resume Size must be greater than zero.
```

---

# Admin Profile

## Purpose

Allow administrators to manage their personal account information.

---

# Route

```text
/admin/profile
```

---

# Profile Information

Display

- Profile Photo
- Full Name
- Email Address
- Clerk User ID
- Administrator Role

The email SHALL be retrieved directly from Clerk.

---

# Editable Fields

Administrators MAY update

- Full Name
- Profile Photo

The following SHALL NOT be editable from CareerOS

- Email Address
- Authentication Provider
- Password

Password and email management SHALL be handled through Clerk.

---

# Change Password

Selecting

```text
Change Password
```

SHALL redirect administrators to the Clerk Account Management page.

CareerOS SHALL NOT implement password management.

---

# Logout

Logout SHALL:

- End the Clerk session.
- Redirect to the Clerk Sign-In page.
- Clear application state.

---

# Search Behavior

Global search SHALL be available in the Admin Dashboard.

Supported modules

- Users
- Feedback
- Notifications

Search SHALL:

- Ignore case
- Ignore leading/trailing spaces
- Return partial matches

---

# Pagination Rules

Every table SHALL use server-side pagination.

Default page size

```text
20
```

Available page sizes

```text
20

50

100
```

---

# Sorting Rules

Tables SHALL support sorting.

Supported order

Ascending

Descending

Sortable columns

Users

- Name
- Registration Date

Feedback

- Date
- Status

Notifications

- Sent Date

---

# Loading States

Every page SHALL display:

- Skeleton Cards
- Skeleton Tables
- Skeleton Charts

Buttons SHALL display loading indicators during actions.

---

# Empty States

Dashboard

```text
No platform activity found.
```

Users

```text
No users found.
```

Feedback

```text
No feedback submitted.
```

Notifications

```text
No notifications available.
```

Analytics

```text
No analytics available.
```

Settings

```text
No settings available.
```

---

# Success Messages

Examples

```text
Settings updated successfully.

Profile updated successfully.

Notification created successfully.

Changes saved successfully.
```

---

# Error Messages

Examples

```text
Unable to save settings.

Unable to update profile.

Unexpected server error.

Please try again later.
```

---

# Responsive Design

Desktop

- Permanent Sidebar
- Multi-column Layout
- Full Data Tables

Tablet

- Collapsible Sidebar
- Responsive Tables
- Two-column Layout

Mobile

- Drawer Navigation
- Card-based Lists
- Single-column Layout
- Bottom Action Buttons where appropriate

All admin pages SHALL be fully responsive.

---

# Accessibility

The Admin Dashboard SHALL:

- Support keyboard navigation.
- Include ARIA labels where appropriate.
- Maintain sufficient color contrast.
- Display visible focus indicators.
- Support screen readers.

---

# Performance Requirements

The Admin Dashboard SHALL:

- Load the dashboard in under 3 seconds.
- Load paginated tables efficiently.
- Use lazy loading where appropriate.
- Avoid unnecessary database queries.
- Cache static configuration when appropriate.

All analytics SHALL be generated from live Supabase PostgreSQL data.

---

# API Endpoints

The Admin Dashboard SHALL communicate with the backend using secure REST API endpoints.

All endpoints SHALL:

- Require Clerk authentication.
- Verify administrator role.
- Validate request data.
- Return standardized API responses.

---

# Dashboard APIs

## Get Dashboard Statistics

```http
GET /api/admin/dashboard
```

Response

- Total Users
- Active Users
- Total Applications
- Total Resumes
- Total Interviews
- Total Feedback
- Pending Feedback
- New Users Today

---

## Get Dashboard Activity

```http
GET /api/admin/activity
```

Returns the latest platform activity.

---

# User APIs

## List Users

```http
GET /api/admin/users
```

Supports

- Pagination
- Search
- Sorting
- Filtering

---

## Get User

```http
GET /api/admin/users/:id
```

---

## Suspend User

```http
PATCH /api/admin/users/:id/suspend
```

---

## Activate User

```http
PATCH /api/admin/users/:id/activate
```

---

## Delete User

```http
DELETE /api/admin/users/:id
```

---

# Feedback APIs

## List Feedback

```http
GET /api/admin/feedback
```

---

## Get Feedback

```http
GET /api/admin/feedback/:id
```

---

## Update Feedback Status

```http
PATCH /api/admin/feedback/:id
```

---

## Delete Feedback

```http
DELETE /api/admin/feedback/:id
```

---

# Notification APIs

## List Notifications

```http
GET /api/admin/notifications
```

---

## Create Notification

```http
POST /api/admin/notifications
```

---

## Delete Notification

```http
DELETE /api/admin/notifications/:id
```

---

# Analytics APIs

## Platform Analytics

```http
GET /api/admin/analytics
```

---

## Export Analytics

```http
GET /api/admin/analytics/export
```

Supported format

```text
CSV
```

---

# Settings APIs

## Get Settings

```http
GET /api/admin/settings
```

---

## Update Settings

```http
PATCH /api/admin/settings
```

---

# Profile APIs

## Get Profile

```http
GET /api/admin/profile
```

---

## Update Profile

```http
PATCH /api/admin/profile
```

---

# Authorization Rules

Every Admin API SHALL verify:

1. Clerk session exists.
2. User is authenticated.
3. Clerk Public Metadata contains:

```text
role = admin
```

Otherwise return

```text
401 Unauthorized

or

403 Forbidden
```

---

# Database Access

The Admin Dashboard SHALL use the following architecture:

```text
Next.js Route Handler

↓

Middleware

↓

Validation

↓

Service

↓

Repository

↓

Prisma ORM

↓

Supabase PostgreSQL
```

Business logic SHALL NOT exist inside Route Handlers.

---

# Storage Access

All uploaded files SHALL be stored in

```text
Supabase Storage
```

Supported files

- Resume PDFs
- Profile Images

Deleting a record SHALL also remove associated files from Supabase Storage.

---

# Logging

The backend SHALL log:

- Admin Login
- Admin Logout
- User Suspension
- User Activation
- User Deletion
- Notification Creation
- Notification Deletion
- Feedback Status Changes
- Settings Updates

Logs SHALL include:

- Admin User ID
- Action
- Resource
- Timestamp

Sensitive information SHALL NOT be logged.

---

# Validation Rules

Every API request SHALL validate:

- Required fields
- Data types
- UUID parameters
- Enum values
- File size
- File type
- Maximum character limits

Validation SHALL occur before business logic executes.

---

# Security Requirements

The Admin Dashboard SHALL:

- Use Clerk Authentication.
- Verify admin role on every request.
- Use HTTPS in production.
- Validate every request.
- Sanitize user input.
- Prevent unauthorized access.
- Protect against invalid file uploads.
- Never expose internal errors.
- Never expose database credentials.
- Never expose Clerk secret keys.

---

# Error Handling

Standard response format

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message."
  }
}
```

Validation errors SHALL return field-level details.

Unexpected server errors SHALL return HTTP 500.

---

# Future Improvements (Post-MVP)

The following features are intentionally excluded from the MVP:

- Multiple Admin Roles
- Role & Permission Management
- Audit Log Viewer
- User Impersonation
- Email Broadcasts
- Push Notifications
- System Health Dashboard
- Queue Monitoring
- API Rate Limit Dashboard
- Backup Management
- Subscription & Billing Management
- Revenue Analytics
- Feature Flags
- Support Ticket System
- AI-powered User Insights

These features SHALL NOT be implemented during MVP development.

---

# Implementation Checklist

Before marking the Admin Dashboard as complete, verify:

- Clerk authentication is fully integrated.
- Admin role verification works correctly.
- All admin routes are protected.
- Dashboard statistics use live Supabase data.
- User management functions correctly.
- Feedback workflow is complete.
- Notifications are functional.
- Analytics are accurate.
- Settings persist successfully.
- Files are stored in Supabase Storage.
- Prisma is used for all database operations.
- Validation is implemented.
- Standardized API responses are returned.
- Loading, empty, success, and error states exist.
- Responsive design works on desktop, tablet, and mobile.
- No TypeScript or ESLint errors remain.

---

# Definition of Done

The Admin Dashboard is considered complete only when:

- All modules are implemented according to this specification.
- Authentication and authorization are enforced using Clerk.
- All data is stored in Supabase PostgreSQL through Prisma.
- File storage uses Supabase Storage.
- All documented business rules are implemented.
- Security requirements are satisfied.
- The application is production-ready.
- The implementation matches this specification without undocumented assumptions.

---

# END OF ADMIN DASHBOARD SPECIFICATION