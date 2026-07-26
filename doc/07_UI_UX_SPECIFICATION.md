# CareerOS

# UI/UX Specification

---

# Document Metadata

| Field | Value |
|-------|-------|
| Document ID | DOC-006 |
| Document Name | UI/UX Specification |
| File Name | 06_UI_UX_SPECIFICATION.md |
| Version | 1.0.0 |
| Status | Approved |
| Audience | AI Coding Agent, UI Developers, Frontend Developers |

---

# Purpose

This document defines the user interface and user experience for every screen in the CareerOS MVP.

It specifies:

- Navigation flow
- Screen layouts
- UI components
- User interactions
- Empty states
- Loading states
- Responsive behavior

All screens MUST follow this specification.

---

# Design Principles

The interface SHALL be:

- Clean
- Fast
- Simple
- Mobile-first
- Accessible
- Consistent

Primary user goal:

Help students track job applications with the fewest possible clicks.

---

# Global Navigation

Authenticated users SHALL always have access to:

```
Dashboard

Applications

Resume Library

Interviews

Reminders

Analytics

Feedback

Profile

Settings

Logout
```

Desktop:

- Left Sidebar
- Top Navigation

Mobile:

- Bottom Navigation
- Slide-out Menu

---

# User Journey

```
Landing Page

↓

Register

↓

Login

↓

Dashboard

↓

Add Resume

↓

Add Application

↓

Track Status

↓

Schedule Interview

↓

Create Reminder

↓

View Analytics

↓

Submit Feedback
```

---

# Screen 1

# Landing Page

## Purpose

Introduce CareerOS and encourage registration.

---

## Sections

- Hero Section
- Features
- Benefits
- Call-to-Action
- Footer

---

## Primary Actions

- Get Started
- Login

---

# Screen 2

# Login

---

## Components

- Email Input
- Password Input
- Login Button
- Forgot Password
- Register Link

---

## Validation

- Required fields
- Email format
- Password required

---

## Success

Redirect to Dashboard.

---

# Screen 3

# Register

---

## Components

- Full Name
- Email
- Password
- Confirm Password
- Register Button

---

## Validation

- All fields required
- Password minimum length
- Password confirmation must match

---

## Success

Create account.

Redirect to Dashboard.

---

# Screen 4

# Dashboard

---

## Purpose

Provide a quick overview of the user's job search.

---

## Layout

Top Navigation

↓

Statistics Cards

↓

Upcoming Interviews

↓

Upcoming Reminders

↓

Recent Applications

---

## Statistics Cards

Display:

- Total Applications
- Active Applications
- Interviews
- Offers
- Rejections

---

## Quick Actions

Buttons

- Add Application
- Upload Resume
- Schedule Interview
- Create Reminder

---

## Empty State

Display:

```
Welcome to CareerOS.

Start by uploading your first resume.
```

---

# Screen 5

# Profile

---

## Components

- Profile Image
- Full Name
- Phone
- College
- Degree
- Specialization
- Graduation Year
- Preferred Role
- Preferred Location
- Bio

---

## Actions

- Save Changes
- Cancel

---

## Validation

Client and Server validation required.

---
---

# Screen 6

# Resume Library

---

## Purpose

Manage all resumes uploaded by the user.

Each resume represents a version tailored for a specific job role.

---

## Layout

```
Page Header

↓

Search Bar

↓

Filter (Future)

↓

Resume Cards

↓

Pagination

↓

Floating "Upload Resume" Button
```

---

## Resume Card

Each card SHALL display:

- Resume Name
- Target Role
- Version
- Upload Date
- Default Resume Badge
- File Size

---

## Available Actions

- View
- Download
- Edit
- Set as Default
- Delete

---

## Upload Resume Dialog

Fields

- Resume Name
- Target Role
- Version
- Notes
- PDF Upload

---

## Validation

Resume File

- PDF only
- Maximum 5 MB

Resume Name

- Required

Target Role

- Required

---

## Empty State

```
No resumes uploaded.

Upload your first resume to begin applying for jobs.
```

---

# Screen 7

# Applications

---

## Purpose

Track every job application.

This is the core screen of CareerOS.

---

## Layout

```
Page Header

↓

Search

↓

Status Filter

↓

Job Type Filter

↓

Sort

↓

Application Table

↓

Pagination

↓

Floating "Add Application" Button
```

---

## Table Columns

- Company
- Job Title
- Status
- Job Type
- Work Mode
- Application Date
- Resume
- Actions

---

## Actions

- View
- Edit
- Update Status
- Delete

---

## Add Application Dialog

Fields

- Company Name
- Job Title
- Department
- Job Type
- Work Mode
- Location
- Application Date
- Resume
- Job Source
- Recruiter Name
- Recruiter Email
- Salary
- Job URL
- Notes

---

## Status Options

- Wishlist
- Applied
- Assessment
- HR Interview
- Technical Interview
- Final Interview
- Offer
- Rejected
- Withdrawn

---

## Validation

Required

- Company Name
- Job Title
- Resume
- Status
- Application Date

---

## Empty State

```
No job applications yet.

Click "Add Application" to track your first application.
```

---

# Screen 8

# Application Details

---

## Purpose

Display complete information for one application.

---

## Sections

### Job Information

- Company
- Role
- Department
- Work Mode
- Salary
- Location

---

### Resume Information

- Resume Name
- View Resume

---

### Recruiter Information

- Recruiter Name
- Recruiter Email

---

### Notes

Free text notes.

---

### Status History

Timeline showing every status update.

Example

```
Applied

↓

Assessment

↓

Technical Interview

↓

Offer
```

---

### Available Actions

- Edit Application
- Update Status
- Delete Application
- Schedule Interview

---

# Screen 9

# Interviews

---

## Purpose

Track every interview associated with applications.

---

## Layout

```
Header

↓

Upcoming Interviews

↓

Interview Table

↓

Pagination

↓

Add Interview Button
```

---

## Table Columns

- Company
- Job Title
- Interview Round
- Date
- Time
- Status
- Result
- Actions

---

## Available Actions

- View
- Edit
- Update Status
- Delete

---

## Empty State

```
No interviews scheduled.

Create your first interview from an application.
```

---
---

# Screen 10

# Interview Details

---

## Purpose

Display complete information about a scheduled interview.

---

## Layout

```
Page Header

↓

Interview Information

↓

Interviewer Information

↓

Meeting Information

↓

Preparation Notes

↓

Interview Feedback

↓

Questions Asked

↓

Personal Notes

↓

Actions
```

---

## Interview Information

Display

- Company Name
- Job Title
- Interview Round
- Interview Type
- Status
- Result
- Date
- Time
- Time Zone

---

## Interviewer Information

Display

- Interviewer Name
- Interviewer Email

---

## Meeting Information

Display

- Meeting Platform
- Meeting Link

---

## Notes

### Preparation Notes

User writes notes before the interview.

---

### Interview Feedback

User records interview experience.

---

### Questions Asked

User stores questions asked during the interview.

---

### Personal Notes

Additional observations.

---

## Available Actions

- Edit Interview
- Update Status
- Delete Interview
- Open Meeting Link

---

# Screen 11

# Reminders

---

## Purpose

Help users remember follow-ups, interview preparation, deadlines, and career-related tasks.

---

## Layout

```
Header

↓

Search

↓

Priority Filter

↓

Status Filter

↓

Reminder List

↓

Pagination

↓

Floating "Add Reminder" Button
```

---

## Reminder Card

Each reminder SHALL display:

- Title
- Due Date
- Due Time
- Priority
- Status
- Related Application (Optional)

---

## Available Actions

- View
- Edit
- Mark Complete
- Delete

---

## Reminder Priorities

- Low
- Medium
- High

---

## Reminder Status

- Pending
- Completed
- Overdue

---

## Empty State

```
No reminders found.

Create a reminder to stay organized.
```

---

# Screen 12

# Analytics

---

## Purpose

Provide insights into the user's job search progress.

---

## Statistics Cards

Display

- Total Applications
- Active Applications
- Interviews
- Offers
- Rejections

---

## Charts

### Application Status Distribution

Display applications grouped by status.

---

### Monthly Applications

Display number of applications submitted each month.

---

### Interview Success Rate

Display

- Total Interviews
- Passed
- Rejected
- Pending

---

### Offer Rate

Display percentage of applications resulting in offers.

---

## Empty State

```
No analytics available.

Start tracking applications to view insights.
```

---

# Screen 13

# Feedback

---

## Purpose

Allow users to report bugs, request features, and submit suggestions.

---

## Layout

```
Header

↓

Feedback Form

↓

Previous Feedback List
```

---

## Feedback Form

Fields

- Category
- Title
- Description
- Screenshot (Optional)

---

## Categories

- Bug Report
- Feature Request
- Improvement Suggestion
- General Feedback

---

## Validation

Required

- Category
- Title
- Description

---

## Success Message

```
Thank you for your feedback.

Your submission has been received.
```

---

## Previous Feedback

Display

- Title
- Category
- Status
- Submitted Date

---
---

# Screen 14

# Notifications

---

## Purpose

Display all system-generated notifications for the authenticated user.

Notifications help users stay informed about interviews, reminders, application updates, and important account events.

---

## Layout

```
Page Header

↓

Unread Count

↓

Notification List

↓

Pagination
```

---

## Notification Card

Each notification SHALL display:

- Icon
- Title
- Message
- Notification Type
- Created Date
- Read/Unread Status

---

## Available Actions

- Mark as Read
- Delete Notification
- Mark All as Read

---

## Notification Types

- Welcome
- Application Created
- Application Updated
- Interview Scheduled
- Reminder Due
- Reminder Overdue
- System Announcement

---

## Empty State

```
No notifications available.
```

---

# Screen 15

# Settings

---

## Purpose

Allow users to manage account preferences.

The MVP focuses only on essential settings.

---

## Sections

### Account

- Full Name
- Email Address (Read-only)
- Change Password

---

### Preferences

- Time Zone
- Default Resume
- Default Job Search Location

---

### Account Actions

- Logout
- Delete Account

---

## Validation

Password Change

- Current password required
- New password minimum 8 characters
- Confirm password must match

---

## Confirmation Dialogs

Confirmation SHALL be required before:

- Delete Account
- Logout

---

# Global UI Components

The following reusable components SHALL be used throughout the application.

## Navigation

- Sidebar
- Top Navigation
- Mobile Navigation
- Breadcrumb

---

## Inputs

- Text Input
- Email Input
- Password Input
- Text Area
- Select Dropdown
- Date Picker
- Time Picker
- File Upload

---

## Feedback Components

- Toast Notification
- Loading Spinner
- Skeleton Loader
- Empty State
- Error State
- Success Alert

---

## Data Display

- Cards
- Tables
- Status Badge
- Timeline
- Avatar
- Pagination
- Search Bar
- Filter Panel

---

## Dialogs

- Confirmation Dialog
- Delete Dialog
- Upload Dialog
- Edit Dialog

---

# Responsive Behavior

## Mobile

- Bottom Navigation
- Full-width Cards
- Single-column Layout
- Stacked Forms
- Swipe-friendly Buttons

---

## Tablet

- Collapsible Sidebar
- Two-column Layout where appropriate

---

## Desktop

- Permanent Sidebar
- Multi-column Dashboard
- Full Tables
- Expanded Analytics

---

# Accessibility Requirements

The UI SHALL:

- Support keyboard navigation.
- Use semantic HTML elements.
- Include descriptive labels for all form fields.
- Provide visible focus indicators.
- Meet WCAG AA color contrast where practical.
- Include alt text for meaningful images.
- Announce validation errors to assistive technologies.

---

# User Experience Guidelines

The application SHALL:

- Minimize the number of clicks required for common tasks.
- Preserve user input during validation errors.
- Display loading indicators for asynchronous actions.
- Provide clear success and error messages.
- Use consistent terminology across all screens.
- Avoid unnecessary modal dialogs.
- Confirm destructive actions before execution.

---

# MVP Screen Checklist

The MVP SHALL include the following screens:

- Landing Page
- Login
- Register
- Dashboard
- Profile
- Resume Library
- Applications
- Application Details
- Interviews
- Interview Details
- Reminders
- Analytics
- Feedback
- Notifications
- Settings

---

# UI Review Checklist

Before implementation, verify:

- All screens match this specification.
- Navigation is consistent.
- Components are reusable.
- Forms are validated.
- Responsive layouts work correctly.
- Loading, empty, success, and error states are implemented.
- Accessibility requirements are met.
- Design system is consistently applied.

---
