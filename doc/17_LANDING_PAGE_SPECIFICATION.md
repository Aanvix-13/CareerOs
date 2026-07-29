# 17_LANDING_PAGE_SPECIFICATION.md

Version: 1.0 (MVP)
Project: CareerOS
Document Type: Level 3 Technical & UX/UI Specification
Status: Approved
Target Audience: Developers, UI/UX Designers, AI Coding Agents
Technology Stack: Next.js, React, Tailwind CSS, TypeScript, Framer Motion, Clerk Authentication, Supabase PostgreSQL, Prisma ORM

---

# 1. Document Purpose

## 1.1 Objective

This document defines the complete specification for the CareerOS public landing page.

The landing page is not merely a marketing website. It is a conversion-focused experience designed to transform anonymous visitors into registered CareerOS users.

Every section, interaction, animation, layout decision, visual hierarchy, and call-to-action must serve this primary objective.

The landing page should communicate:

- What CareerOS is.
- Who it is for.
- Why it is different.
- Why users should trust it.
- Why users should create an account today.

This document serves as the single source of truth for the implementation of the public-facing website.

---

## 1.2 Scope

This specification covers:

- Landing page UX
- Visual Design
- Layout System
- Component Design
- Responsive Design
- Motion Design
- Conversion Optimization
- Accessibility
- SEO
- Performance
- Copy Structure
- Information Hierarchy
- Design System
- Implementation Guidelines

It does NOT define:

- User Dashboard
- Admin Dashboard
- Backend APIs
- Database Architecture
- Business Logic
- Authentication Logic

Those are documented separately.

---

## 1.3 Target Users

Primary Audience

- College Students
- Final-Year Students
- Fresh Graduates
- Entry-Level Professionals
- Internship Seekers

Secondary Audience

- Career Switchers
- Placement Cell Students
- Bootcamp Students
- Self-Learners
- Early Career Professionals

---

## 1.4 Landing Page Goal

The landing page must achieve the following objectives:

Primary Goal

Convert visitors into registered users.

Secondary Goals

Increase trust.

Explain the product.

Reduce confusion.

Demonstrate product value.

Create excitement.

Increase conversion rate.

---

# 2. Design Philosophy

CareerOS should not feel like another ordinary SaaS product.

It should feel like the operating system every student wishes they had during their job search.

Every design decision must communicate:

Professional

Minimal

Modern

Premium

Trustworthy

Productive

Focused

Confident

Simple

Fast

---

## 2.1 User Emotion

When a visitor opens CareerOS, they should immediately think:

"I finally found one place to manage my entire job search."

Not:

"What does this website actually do?"

The value proposition must become obvious within the first five seconds.

---

## 2.2 Product Positioning

CareerOS IS NOT

❌ Job Portal

❌ Resume Builder

❌ AI Chatbot

❌ Interview Platform

CareerOS IS

✅ Career Workspace

✅ Career Operating System

✅ Job Search Dashboard

✅ Personal Career Manager

The landing page must reinforce this positioning consistently.

---

## 2.3 Communication Style

Writing style should be:

Simple

Clear

Direct

Confident

Friendly

Professional

Avoid:

Buzzwords

Corporate jargon

Over-promising

Complex technical explanations

---

## 2.4 Core Brand Message

Primary Message

> Organize your entire job search in one place.

Supporting Message

> Stop managing resumes, interviews, applications, reminders and notes across multiple apps.

CareerOS brings everything together into one organized workspace.

---

# 3. Design Inspiration

The following references were selected as inspiration.

These references define quality expectations only.

Do NOT copy layouts, graphics, or branding directly.

The final CareerOS design must be original.

---

## Reference A

Strengths

- Large Hero
- Floating UI Cards
- Premium SaaS Design
- Rounded Layout
- Soft Shadows
- Excellent White Space

Borrow

Large typography.

Dashboard preview.

Floating product cards.

Clean navigation.

Avoid

AI meeting graphics.

Human portraits.

---

## Reference B

Strengths

- Minimal Design
- Clean Grid
- Excellent Typography
- Spacious Layout
- High Readability

Borrow

Whitespace.

Simple hero.

Centered content.

Large headlines.

Avoid

Oversized decorative elements.

---

## Reference C

Strengths

Split Hero Layout.

Large product image.

Premium SaaS feel.

Trust section.

Borrow

Product-first presentation.

CTA placement.

Clean spacing.

Avoid

Lifestyle photography.

CareerOS should showcase the product, not people.

---

## Reference D

Strengths

Storytelling.

Alternating layouts.

Large feature cards.

Editorial presentation.

Strong visual hierarchy.

Borrow

Narrative flow.

Feature storytelling.

Alternating layouts.

Premium spacing.

Avoid

Copying color palette directly.

---

## Final Design Direction

The CareerOS landing page shall combine:

30% Minimal SaaS

30% Product Showcase

20% Editorial Storytelling

20% Modern Productivity UI

The final result must be unique to CareerOS.

---

# 4. Brand Identity

## Brand Personality

CareerOS should be perceived as:

Reliable

Modern

Professional

Friendly

Smart

Minimal

Efficient

Trustworthy

---

## Brand Promise

CareerOS helps students stay organized throughout their entire job search journey.

---

## Brand Values

Simplicity

Organization

Productivity

Confidence

Growth

Reliability

Student Success

---

## Brand Voice

Speak like an experienced mentor.

Never speak like a corporate enterprise software company.

Never sound robotic.

---

# 5. Visual Language

The visual language defines how users perceive CareerOS.

Every element should reinforce clarity.

---

## Overall Appearance

Minimal

Bright

Clean

Modern

Premium

Rounded

Soft

Elegant

---

## Design Style

Use

Large white surfaces.

Rounded containers.

Soft shadows.

Thin borders.

Subtle gradients.

Generous whitespace.

Consistent spacing.

Avoid

Heavy gradients.

Dark backgrounds (for MVP landing page).

Glassmorphism overload.

Neumorphism.

Excessive decoration.

---

## Product Showcase First

The product is the hero.

The landing page should showcase the actual CareerOS interface.

Avoid stock photography.

Avoid random illustrations.

Visitors should immediately see what they are signing up for.

---

## UI Inspiration

The dashboard should appear as floating interface cards.

Examples:

Resume Card

Application Card

Interview Timeline

Reminder Widget

Analytics Widget

Calendar Preview

Notification Card

These elements should create depth without clutter.

---

# 6. Information Architecture

The landing page should guide visitors through a logical story.

Each section answers one important question.

---

Visitor arrives

↓

What is CareerOS?

↓

Why should I care?

↓

How does it solve my problem?

↓

What features does it offer?

↓

Can I trust it?

↓

How much does it cost?

↓

How do I start?

---

## Final Section Order

1. Navigation

2. Hero

3. Trusted By

4. Problem

5. Solution

6. Dashboard Showcase

7. Feature Showcase

8. How CareerOS Works

9. Why CareerOS

10. Testimonials

11. Pricing

12. FAQ

13. Final CTA

14. Footer

No section should interrupt this storytelling flow.

---

# 7. User Journey

The landing page must guide users naturally toward registration.

## Step 1

User lands on homepage.

↓

Reads hero.

↓

Understands CareerOS within five seconds.

---

## Step 2

User scrolls.

↓

Learns common job search problems.

↓

Recognizes their own frustrations.

---

## Step 3

CareerOS introduces the solution.

↓

Shows dashboard.

↓

Demonstrates organization.

---

## Step 4

User explores key features.

↓

Feels confident.

↓

Builds trust.

---

## Step 5

User reads FAQ.

↓

Remaining objections are answered.

---

## Step 6

User clicks:

Get Started Free

↓

Clerk Sign Up

↓

Account Created

↓

Onboarding

↓

User Dashboard (/app/dashboard)

---

# 8. Landing Page Principles

The landing page SHALL:

✓ Be product-first.

✓ Tell a story.

✓ Focus on solving user problems.

✓ Showcase the actual dashboard.

✓ Build trust progressively.

✓ Encourage registration.

✓ Avoid unnecessary complexity.

✓ Maintain premium visual quality.

✓ Be responsive on all devices.

✓ Prioritize performance.

✓ Meet accessibility standards.

---

# 9. Navigation Bar Specification

## 9.1 Purpose

The navigation bar is the primary entry point for visitors.

Its purpose is to:

- Introduce the CareerOS brand.
- Help visitors explore important sections.
- Encourage account creation.
- Provide quick access to authentication.
- Maintain visibility while scrolling.

The navigation must remain simple, uncluttered and conversion-focused.

---

## 9.2 Behaviour

Desktop

- Sticky navigation.
- Transparent at page top.
- Converts to solid white background after scrolling.
- Smooth transition (200ms–300ms).
- Soft bottom border appears on scroll.
- Slight backdrop blur.

Tablet

- Same behaviour.
- Reduced spacing.

Mobile

- Logo.
- Hamburger menu.
- Login.
- Get Started button.

---

## 9.3 Navigation Layout

Desktop Layout

---------------------------------------------------

CareerOS Logo

Features

How It Works

Pricing

FAQ

About

Login

Get Started

---------------------------------------------------

Maximum width

1280px

Centered horizontally.

---

## 9.4 Logo

Logo Position

Top Left

Logo Components

CareerOS Icon

CareerOS Text

Click Behaviour

Redirect to

/

Logo must remain visible while scrolling.

---

## 9.5 Navigation Links

Visible Links

Features

How It Works

Pricing

FAQ

About

Each item smoothly scrolls to its corresponding section.

Avoid page reloads whenever possible.

---

## 9.6 Authentication Buttons

Secondary Button

Login

Destination

/login

Primary Button

Get Started Free

Destination

/register

Primary CTA should always be visually stronger.

---

## 9.7 Mobile Navigation

Mobile breakpoint

Below 1024px

Replace navigation links with hamburger menu.

Menu opens from right side.

Overlay should darken background.

Menu Animation

Slide from right.

Fade overlay.

Close when:

Outside click.

Escape key.

Navigation item click.

---

## 9.8 Accessibility

Keyboard navigation required.

ARIA labels required.

Visible focus ring.

Escape closes menu.

Tab navigation supported.

---

# 10. Hero Section Specification

## 10.1 Purpose

The Hero Section determines whether a visitor continues scrolling.

Within five seconds the visitor must understand:

- What CareerOS is.
- Who it is for.
- Why it is valuable.
- What action to take next.

This is the highest priority section of the landing page.

---

## 10.2 Hero Layout

Desktop

----------------------------------------------------

Left Side

Headline

Subheadline

CTA Buttons

Trust Indicators

Right Side

Interactive Dashboard Preview

Floating UI Cards

Analytics

Applications

Resume

Interview Timeline

Calendar

----------------------------------------------------

Content Ratio

Left

45%

Right

55%

---

## 10.3 Hero Headline

Primary Headline

# Organize Your Entire Job Search In One Place.

Alternative

# One Dashboard For Every Resume, Application & Interview.

The headline must be concise, memorable and outcome-focused.

---

## 10.4 Supporting Text

Example

CareerOS helps students manage resumes, job applications, interviews, reminders and career progress from one organized workspace.

Maximum width

600px

Maximum length

2–3 lines.

---

## 10.5 Primary CTA

Button Text

Get Started Free

Destination

/register

Style

Filled.

Brand Primary Colour.

Rounded.

Large.

Hover Elevation.

---

## 10.6 Secondary CTA

Button Text

Watch Demo

Opens product demo modal.

No autoplay.

---

## 10.7 Trust Indicators

Display below CTA buttons.

Examples

✓ Free Forever (MVP)

✓ No Credit Card Required

✓ Setup in Under 2 Minutes

Future

Trusted by 10,000+ students

(Only after real adoption.)

Never fabricate statistics.

---

# 11. Hero Product Showcase

## Philosophy

The product itself is the hero.

Do NOT use:

- Stock photos.
- Generic business people.
- AI-generated characters.
- Abstract illustrations.

Instead display:

CareerOS Dashboard.

---

## Dashboard Preview

Should include realistic UI showing:

Resume Library

Job Applications

Interview Timeline

Upcoming Reminders

Application Analytics

Profile Completion

Notifications

Recent Activity

The preview should look functional.

Not decorative.

---

## Floating Cards

Around the dashboard place floating widgets.

Examples

Resume Uploaded

Application Submitted

Interview Tomorrow

Reminder Created

Analytics Growth

Offer Received (Future)

Cards should overlap slightly.

Each card uses:

Rounded corners.

Soft shadow.

Thin border.

White background.

---

## Card Motion

Floating Animation

Duration

6–8 seconds.

Infinite.

Ease In Out.

Movement

8–15px vertically.

Cards should never distract from the dashboard.

---

## Mouse Interaction

Desktop Only

Slight parallax effect.

Maximum movement

10px.

Should feel premium.

Not playful.

---

# 12. Hero Background

Background Colour

Near White

Subtle radial gradient.

Very light.

No heavy colours.

Optional

Very faint grid pattern.

Opacity below 5%.

---

## Decorative Elements

Allowed

Small gradient blur.

Soft glowing circle.

Tiny abstract shapes.

Not allowed

Large illustrations.

Random geometric clutter.

Animated particles.

Heavy backgrounds.

---

# 13. Hero Statistics

Below dashboard.

Display 3–4 statistics.

Examples

Applications Tracked

Interviews Scheduled

Reminders Managed

Career Progress

For MVP

Use placeholders labelled

"Demo Data"

Never imply fake user metrics.

---

# 14. Hero Responsive Behaviour

Desktop

Two-column layout.

Tablet

Dashboard moves below text.

Mobile

Single column.

Order

Headline

Subheadline

CTA

Trust Indicators

Dashboard Preview

Cards reposition automatically.

No horizontal scrolling.

---

# 15. Hero Performance

Dashboard preview image

Use Next.js Image.

Lazy load lower-priority assets.

Compress screenshots.

Prefer SVG icons.

Avoid unnecessary videos.

LCP target

Below 2.5 seconds.

---

# 16. Hero Animations

Animate on page load.

Sequence

Navigation

↓

Headline

↓

Description

↓

CTA

↓

Trust Indicators

↓

Dashboard

↓

Floating Cards

Use Framer Motion.

Animation duration

300–600ms.

Avoid excessive motion.

Respect prefers-reduced-motion.

---

# 17. Hero Acceptance Criteria

The Hero section is complete when:

✓ Product purpose is understandable within five seconds.

✓ Dashboard preview is the primary visual.

✓ No stock photos are used.

✓ CTA is clearly visible above the fold.

✓ Responsive on Desktop, Tablet and Mobile.

✓ Lighthouse Performance ≥ 90.

✓ Lighthouse Accessibility ≥ 95.

✓ Smooth animations without affecting performance.

✓ Dashboard screenshot remains readable on all screen sizes.

---

# 18. Trusted By Section

## 18.1 Purpose

The Trusted By section builds credibility immediately after the Hero section.

For MVP, CareerOS does not yet have enterprise customers or large adoption numbers.

Therefore, this section SHALL focus on trust without making misleading claims.

No fake statistics or fabricated company logos shall be displayed.

---

## 18.2 Section Position

Hero

↓

Trusted By

↓

Problem

This section shall act as a visual transition between the Hero and the storytelling sections.

---

## 18.3 Layout

Desktop

--------------------------------------------------------

Trusted by students preparing for careers at

Google   Microsoft   Amazon   TCS   Infosys   Accenture

--------------------------------------------------------

The wording must clearly indicate these are companies users aspire to work for, NOT CareerOS customers.

---

## 18.4 Future Update

Once CareerOS gains real users, replace the placeholder with:

Trusted by 10,000+ Students

or

Used by students from 200+ Colleges

Only after those metrics are verified.

---

# 19. Problem Section

## 19.1 Purpose

The visitor must emotionally recognise their own frustrations.

Do NOT immediately introduce CareerOS.

Instead, describe the current reality.

The visitor should think:

"That's exactly me."

---

## 19.2 Headline

Example

Stop Managing Your Job Search Across Five Different Apps.

---

## 19.3 Supporting Copy

Most students use spreadsheets for applications,
Google Drive for resumes,
Calendar for interviews,
Notes for reminders,
and email for offer letters.

This creates confusion, missed deadlines and unnecessary stress.

---

## 19.4 Layout

Two Column Layout

----------------------------------------------------

Left

Illustration of scattered tools

Spreadsheet

Notes

Calendar

Email

Drive

Sticky Notes

Right

Problem Cards

----------------------------------------------------

---

## 19.5 Problem Cards

Card 1

Lost Track of Applications

Description

Forgot where you applied.

Forgot application status.

---

Card 2

Multiple Resume Versions

Description

Resume_Final.pdf

Resume_Final_v2.pdf

Resume_Final_Final.pdf

No organisation.

---

Card 3

Missed Interview Dates

Description

Interview reminders are scattered across different apps.

---

Card 4

No Career Progress Visibility

Description

No idea how many applications you've submitted or interviews you've completed.

---

## 19.6 Design

Cards

White

Rounded

Soft Shadow

Thin Border

Hover Lift

Minimal Icons

---

## 19.7 Animation

Cards appear sequentially while scrolling.

Animation

Fade Up

Duration

300ms

Delay

100ms each

---

# 20. Solution Section

## 20.1 Purpose

Immediately after presenting the problem, introduce CareerOS as the solution.

---

## 20.2 Headline

Everything You Need.

One Dashboard.

---

## 20.3 Supporting Copy

CareerOS brings resumes, applications, interviews, reminders and analytics together into one organised workspace designed specifically for students and job seekers.

---

## 20.4 Layout

Desktop

------------------------------------------------

Left

CareerOS Dashboard Preview

Right

Benefits List

------------------------------------------------

Alternate layout from previous section to improve visual rhythm.

---

## 20.5 Benefits

✓ Manage every application

✓ Store every resume

✓ Never miss interviews

✓ Track your progress

✓ Stay organised

✓ Focus on getting hired

---

## 20.6 CTA

Button

Start Free Today

Destination

/register

---

# 21. Dashboard Showcase

## 21.1 Purpose

The product must become the centrepiece of the landing page.

Visitors should clearly understand what CareerOS looks like before signing up.

---

## 21.2 Headline

Meet Your Career Workspace.

---

## 21.3 Description

One dashboard designed to organise every stage of your job search.

---

## 21.4 Dashboard Display

Show realistic UI.

The screenshot SHALL include:

Dashboard

Recent Applications

Upcoming Interviews

Reminder Widget

Resume Library

Analytics

Notifications

Recent Activity

Use actual product UI.

Never use placeholders after MVP.

---

## 21.5 Interactive Highlights

When hovering over different dashboard areas,

small callouts appear.

Example

Resume Manager

Store unlimited resume versions.

---

Applications

Track every job application.

---

Interview Tracker

Never miss an interview.

---

Analytics

Measure your career progress.

---

## 21.6 Dashboard Specifications

Width

Maximum 1200px

Border Radius

24px

Shadow

Large Soft Shadow

Border

1px Light Gray

Background

White

---

## 21.7 Dashboard Animation

Entrance

Fade + Scale

Duration

600ms

Hover

Very subtle elevation.

No excessive movement.

---

# 22. Story Transition

After the dashboard showcase, the visitor should already understand:

✓ What CareerOS does.

✓ Why it exists.

✓ How it looks.

The remaining sections will explain individual features in greater depth.

---

# 23. Section Design Rules

Every landing page section SHALL follow these standards:

Maximum Width

1280px

Horizontal Padding

Desktop

80px

Tablet

48px

Mobile

24px

Vertical Padding

120px

Section Gap

80px

Grid

12 Columns Desktop

8 Columns Tablet

4 Columns Mobile

---

## Section Backgrounds

Alternate between:

White

and

Very Light Gray

This improves readability without adding visual clutter.

---

## Cards

Every informational card SHALL use:

Border Radius

20px

Border

1px Solid #E5E7EB

Shadow

Soft

Padding

24–32px

Hover

Translate Y -4px

Transition

250ms Ease

---

## Images

Use:

Product screenshots

Dashboard previews

UI mockups

Icons

Avoid:

Stock photography

People posing

Generic illustrations

Random decorative graphics

---

# 24. Acceptance Criteria

This portion of the landing page is complete when:

✓ Users immediately recognise common job search problems.

✓ CareerOS is introduced as the clear solution.

✓ The dashboard is showcased before individual features.

✓ The storytelling flows naturally from problem to solution.

✓ Every section remains clean, spacious and visually consistent.

---

# 25. Feature Showcase

## 25.1 Purpose

The Feature Showcase demonstrates how CareerOS solves the user's problems through practical, focused tools.

The objective is not to list every feature.

The objective is to show how each feature contributes to one complete career management system.

Every feature section SHALL answer:

- What problem does it solve?
- How does it work?
- Why is it useful?

---

# 26. Section Layout

The Feature Showcase SHALL contain six primary feature sections.

Order

Resume Manager

↓

Job Application Tracker

↓

Interview Tracker

↓

Reminder System

↓

Career Analytics

↓

Notification Center

Each feature SHALL use alternating layouts.

Example

Section 1

Image Left

Content Right

Section 2

Content Left

Image Right

Section 3

Image Left

Content Right

Continue alternating throughout the page.

---

# 27. Resume Manager

## Purpose

Help users organise multiple resume versions.

---

## Headline

Manage Every Resume Without The Confusion.

---

## Description

Store every version of your resume in one organised workspace.

Never search through folders named Resume_Final_v8.pdf again.

CareerOS keeps everything organised and instantly accessible.

---

## Dashboard Preview

The product screenshot SHALL display

Resume Library

↓

Resume Card

↓

Resume Version

↓

Upload Date

↓

Default Resume

↓

Actions

Preview

Download

Replace

---

## Benefits

✓ Multiple Resume Versions

✓ Easy Upload

✓ Quick Download

✓ Version History

✓ Clean Organisation

---

## Feature Card Design

Background

White

Radius

24px

Border

1px

Shadow

Medium

Hover

Lift 6px

---

## Animation

Fade In

+

Slide Up

Duration

400ms

---

# 28. Job Application Tracker

## Headline

Track Every Application From One Dashboard.

---

## Description

Never lose track of where you've applied.

Track every application from submission to offer.

---

## Dashboard Preview

Display

Company Logo

Job Title

Application Date

Current Status

Next Step

Priority

Actions

---

## Application Status

Applied

Interview Scheduled

Assessment

HR Round

Technical Round

Offer

Rejected

Archived

---

## Benefits

✓ Centralised Tracking

✓ Easy Filtering

✓ Status Timeline

✓ Search

✓ Sort

---

## Visual Behaviour

Rows animate while entering viewport.

Hover highlights active row.

---

# 29. Interview Tracker

## Headline

Never Miss Another Interview.

---

## Description

Manage every interview with reminders, notes and progress tracking.

---

## Dashboard Preview

Display

Company

Role

Interview Date

Time

Interview Type

Round

Status

Notes

---

## Benefits

✓ Interview Timeline

✓ Upcoming Interviews

✓ Notes

✓ Preparation Status

✓ Follow-Up Tracking

---

## Visual Style

Calendar Card

Interview Cards

Timeline Indicator

Rounded Layout

Soft Colours

---

# 30. Reminder System

## Headline

Stay Ahead Of Every Deadline.

---

## Description

Receive reminders before interviews, application deadlines and follow-up dates.

---

## Reminder Cards

Interview Tomorrow

Application Deadline

Resume Update

Follow-Up Reminder

Portfolio Review

---

## Benefits

✓ Deadline Tracking

✓ Daily Overview

✓ Calendar Integration (Future)

✓ Smart Reminders (Future)

---

## Dashboard Preview

Display

Upcoming

Today

Tomorrow

This Week

Completed

---

# 31. Career Analytics

## Headline

Measure Your Career Progress.

---

## Description

Visualise your entire job search with meaningful insights.

CareerOS helps you understand what is working and where to improve.

---

## Dashboard Preview

Charts

Applications

Interviews

Success Rate

Weekly Activity

Monthly Activity

Recent Growth

---

## Analytics Cards

Applications Submitted

Interviews Scheduled

Offers Received

Response Rate

Interview Conversion

---

## Benefits

✓ Progress Tracking

✓ Motivation

✓ Performance Visibility

✓ Better Decisions

---

# 32. Notification Center

## Headline

Stay Updated Without Missing Important Events.

---

## Description

CareerOS keeps important updates organised in one notification centre.

---

## Dashboard Preview

Display

Resume Uploaded

Interview Reminder

Application Updated

System Announcement

Reminder Completed

---

## Benefits

✓ Central Notifications

✓ Read Status

✓ Time Labels

✓ Organised Feed

---

# 33. Feature Section Design

Each feature section SHALL include

Large Screenshot

↓

Headline

↓

Description

↓

Feature Benefits

↓

Supporting UI Cards

↓

Call To Action

---

## Screenshot Requirements

Use actual CareerOS interface.

Do NOT use placeholders.

Images SHALL be exported directly from the application.

---

## Image Style

Rounded

24px Radius

Large Shadow

Thin Border

High Resolution

Responsive

---

# 34. Interactive Behaviour

Desktop

Hover

Image slightly scales

1.02

Shadow increases

Cards elevate

Tablet

Reduced animations.

Mobile

Animations simplified.

No horizontal scrolling.

---

# 35. Feature CTA

Each feature section SHALL conclude with

Button

Explore CareerOS

Destination

/register

The CTA should encourage progression without overwhelming the visitor.

---

# 36. Feature Section Accessibility

Every screenshot SHALL include descriptive alt text.

Buttons SHALL be keyboard accessible.

Hover interactions SHALL have keyboard equivalents.

Animations SHALL respect

prefers-reduced-motion.

---

# 37. Performance

Feature screenshots SHALL

Use next/image.

Lazy load below-the-fold assets.

Compress PNG/WebP files.

Avoid autoplay videos.

Maintain Lighthouse Performance Score ≥ 90.

---

# 38. Acceptance Criteria

The Feature Showcase is complete when

✓ Every core MVP feature is represented.

✓ Screenshots use the real CareerOS interface.

✓ Layout alternates for visual rhythm.

✓ Benefits are concise and user-focused.

✓ Animations remain subtle.

✓ Mobile experience is fully responsive.

✓ No stock photography or generic illustrations are used.

✓ Visitors understand how CareerOS solves their job search challenges before reaching the pricing section.

---
# 39. How CareerOS Works

## 39.1 Purpose

This section explains the complete CareerOS workflow.

The goal is to show visitors that getting started is simple.

The entire process should be understandable within 30 seconds.

---

## 39.2 Section Position

Feature Showcase

↓

How CareerOS Works

↓

Why CareerOS

---

## 39.3 Section Headline

Your Career Journey Starts In Minutes.

---

## 39.4 Supporting Description

Create your account, organise your career information, and let CareerOS help you stay focused throughout your job search.

No spreadsheets.

No sticky notes.

No confusion.

---

## 39.5 Workflow

The section SHALL display a horizontal timeline on Desktop.

Mobile SHALL display a vertical timeline.

---

### Step 1

Create Your Free Account

Description

Register using Clerk Authentication.

Complete your profile.

Estimated Time

Less than 2 minutes.

Icon

User Plus

---

### Step 2

Upload Your Resume

Description

Upload your resume and organise different versions in one secure place.

Icon

File Text

---

### Step 3

Track Applications

Description

Add every job application and monitor its progress from Applied to Offer.

Icon

Briefcase

---

### Step 4

Manage Interviews

Description

Schedule interviews, add notes and never miss important dates.

Icon

Calendar

---

### Step 5

Get Hired

Description

Stay organised and focus on preparing for interviews instead of managing spreadsheets.

Icon

Award

---

## 39.6 Timeline Design

Desktop

Step

↓

Connector Line

↓

Step

↓

Connector Line

↓

Step

↓

Connector Line

↓

Step

↓

Connector Line

↓

Step

Connector SHALL animate while scrolling.

---

# 40. Why CareerOS

## 40.1 Purpose

Differentiate CareerOS from existing productivity tools.

---

## 40.2 Headline

Why Students Choose CareerOS

---

## 40.3 Layout

Two-column layout.

Left

Reasons

Right

Supporting Illustration (Dashboard UI)

---

## 40.4 Benefit Cards

Card 1

Everything In One Place

Description

Manage resumes, interviews, reminders and applications without switching between multiple apps.

---

Card 2

Designed For Students

Description

CareerOS is built specifically for students and early-career professionals.

---

Card 3

Simple & Fast

Description

Minimal interface with zero unnecessary complexity.

---

Card 4

Secure

Description

Your data is protected using modern authentication and secure cloud infrastructure.

---

Card 5

Always Organised

Description

Know exactly where every application stands.

---

Card 6

Built To Grow

Description

CareerOS will continue evolving with powerful career tools after the MVP.

---

# 41. Student Success Stories

## 41.1 MVP Strategy

CareerOS is a new product.

Do NOT display fake testimonials.

Instead use an honest placeholder.

---

## 41.2 Headline

Be Among The First Students To Build Their Career With CareerOS.

---

## 41.3 Description

We're currently helping early users organise their careers more effectively.

Real student stories will appear here after launch.

---

## 41.4 Future Implementation

Replace placeholders with

Photo

Name

College

Role

Review

Rating

Verification Badge

Only verified users may appear.

---

# 42. Pricing Preview

## 42.1 Purpose

Provide pricing transparency without distracting from registration.

---

## 42.2 MVP Pricing

CareerOS Free

Included

✓ Dashboard

✓ Resume Manager

✓ Job Application Tracker

✓ Interview Tracker

✓ Reminder System

✓ Analytics

✓ Notifications

Button

Get Started Free

---

## 42.3 Future Plan

CareerOS Pro

Coming Soon

Potential Features

Advanced Analytics

AI Career Assistant

AI Resume Review

AI Interview Coach

Unlimited AI Features

Priority Support

This card SHALL be visually marked

Coming Soon

Users SHALL NOT be able to purchase Pro during MVP.

---

# 43. Frequently Asked Questions

## Purpose

Reduce hesitation before registration.

---

### Question 1

Is CareerOS free?

Answer

Yes.

The MVP is completely free.

---

### Question 2

Can I upload multiple resumes?

Answer

Yes.

You can organise multiple resume versions.

---

### Question 3

Does CareerOS help me find jobs?

Answer

No.

CareerOS helps you organise your job search.

It is not a job portal.

---

### Question 4

Can I access CareerOS on mobile?

Answer

Yes.

CareerOS is fully responsive.

---

### Question 5

Is my data secure?

Answer

Yes.

CareerOS uses Clerk Authentication, Prisma ORM and Supabase PostgreSQL with secure cloud infrastructure.

---

### Question 6

Do I need to install anything?

Answer

No.

CareerOS runs entirely in your browser.

---

# 44. Final Call To Action

## Purpose

Give visitors one final opportunity to register.

---

## Headline

Start Organising Your Career Today.

---

## Supporting Text

Everything you need to manage resumes, applications, interviews and reminders—all in one place.

---

## Buttons

Primary

Get Started Free

Destination

/register

Secondary

Learn More

Scroll to Features section.

---

## Design

Large rounded container.

Soft gradient background.

Centered content.

Maximum width

1100px

Large padding.

---

# 45. Footer

## Layout

Four-column layout.

---

### Column 1

CareerOS Logo

Short description

Social Links

GitHub (Future)

LinkedIn (Future)

X (Future)

---

### Column 2

Product

Features

Pricing

FAQ

Roadmap (Future)

---

### Column 3

Company

About

Contact

Privacy Policy

Terms & Conditions

---

### Column 4

Support

Help Center (Future)

Email Support

Feedback

---

## Footer Bottom

Display

© 2026 CareerOS.

All rights reserved.

Built with ❤️ for students and job seekers.

---

# 46. Acceptance Criteria

This section is complete when:

✓ The user journey is clearly explained.

✓ Pricing is transparent.

✓ No fake testimonials are displayed.

✓ FAQ addresses common concerns.

✓ The final CTA is prominent.

✓ Footer includes all essential links.

✓ The page naturally encourages visitors to create an account.

---
# 47. Design System

## 47.1 Purpose

The CareerOS Design System ensures every page, section and component follows a consistent visual language.

It serves as the foundation for all public website UI.

Primary Goals

- Consistency
- Simplicity
- Scalability
- Accessibility
- Performance
- Premium Appearance

The landing page should feel like a modern SaaS product while remaining approachable for students.

---

# 48. Color System

## 48.1 Brand Colors

Primary

HEX

#6D5EF5

Usage

Primary Buttons

Links

Highlights

Important Icons

Active Navigation

Charts

---

Primary Hover

HEX

#5A4CE6

---

Primary Light

HEX

#F3F1FF

Usage

Badges

Backgrounds

Notifications

---

Secondary

HEX

#8B5CF6

Usage

Secondary Gradients

Accent Components

---

Success

HEX

#22C55E

Usage

Success Messages

Completed Status

Positive Analytics

---

Warning

HEX

#F59E0B

Usage

Upcoming Reminder

Pending Status

---

Danger

HEX

#EF4444

Usage

Delete Actions

Validation Errors

Critical Notifications

---

Information

HEX

#3B82F6

Usage

Information Cards

Tips

Announcements

---

# 48.2 Neutral Colors

Background

#FAFAFA

Surface

#FFFFFF

Border

#E5E7EB

Divider

#F1F5F9

Primary Text

#111827

Secondary Text

#6B7280

Muted Text

#9CA3AF

Disabled

#D1D5DB

---

# 48.3 Color Usage Rules

Do

Use white backgrounds.

Use purple as primary accent.

Maintain high contrast.

Use colour only to communicate meaning.

Don't

Use more than one primary accent.

Use saturated gradients.

Use neon colours.

Overuse shadows.

---

# 49. Typography System

## Primary Font

Plus Jakarta Sans

Fallback

Inter

System Sans

---

## Heading Scale

H1

56px

Weight

700

Desktop Only

---

H2

48px

Weight

700

---

H3

36px

Weight

700

---

H4

30px

Weight

600

---

H5

24px

Weight

600

---

H6

20px

Weight

600

---

Body Large

18px

Regular

---

Body

16px

Regular

---

Small

14px

Regular

---

Caption

12px

Medium

---

## Typography Rules

Maximum line length

75 characters.

Use sentence case.

Avoid full uppercase paragraphs.

Maintain consistent heading hierarchy.

---

# 50. Spacing System

Base Unit

8px

Spacing Scale

4

8

12

16

24

32

40

48

64

80

96

120

160

Use only values from this spacing scale.

---

## Section Padding

Desktop

Top

120px

Bottom

120px

Tablet

80px

Mobile

64px

---

# 51. Grid System

Desktop

12 Columns

Maximum Width

1280px

Gutter

24px

---

Tablet

8 Columns

---

Mobile

4 Columns

---

Content Width

Readable text

Maximum

720px

---

# 52. Border Radius

Small

8px

Medium

12px

Large

20px

Extra Large

24px

Pill

9999px

---

# 53. Shadows

Small

Cards

Buttons

---

Medium

Dashboard

Feature Cards

---

Large

Hero Dashboard

Modal

CTA Section

Avoid overly dramatic shadows.

---

# 54. Button System

## Primary Button

Background

Primary Purple

Text

White

Radius

14px

Padding

16px 28px

Hover

Darker Purple

Elevation Increase

Transition

200ms

---

## Secondary Button

Background

Transparent

Border

Gray

Text

Primary Text

Hover

Light Gray Background

---

## Ghost Button

Transparent

No Border

Purple Text

Hover

Light Purple Background

---

## Icon Button

Square

Rounded

Accessible

Minimum

44x44px

---

# 55. Card System

Cards SHALL use

White Background

Rounded Corners

Soft Shadow

Thin Border

Generous Padding

Hover Lift

Cards should never appear cluttered.

---

## Standard Card

Padding

24px

Radius

20px

Border

1px

Shadow

Medium

---

## Dashboard Card

Padding

32px

Radius

24px

Large Shadow

---

## Feature Card

Padding

32px

Image

Top

Content

Bottom

---

# 56. Form Components

Text Input

Height

48px

Radius

12px

Border

Gray

Focus

Primary Purple Border

---

Textarea

Minimum Height

120px

---

Dropdown

Rounded

Keyboard Accessible

---

Checkbox

Rounded

Accessible

---

Radio

Accessible

---

Validation Messages

Success

Green

Error

Red

Help

Gray

---

# 57. Badge System

Badge Types

Primary

Success

Warning

Danger

Info

Neutral

Radius

999px

Padding

8px 12px

Font

12px Medium

---

# 58. Iconography

Use

Lucide Icons

Only

Icons should

Be outlined

Match stroke width

Remain visually consistent

Avoid

Emoji

3D Icons

Filled Icons

Mixed icon libraries

---

# 59. Illustration Rules

Preferred

Dashboard Screenshots

UI Mockups

Minimal Abstract Shapes

Simple Patterns

Avoid

Stock Photography

Random People

Cartoons

Clip Art

Heavy Illustrations

---

# 60. Component Consistency

Every reusable component SHALL include

Hover State

Focus State

Active State

Disabled State

Loading State

Responsive Behaviour

Accessibility Labels

Keyboard Support

Error Handling (where applicable)

---

# 61. Acceptance Criteria

The Design System is complete when

✓ Every UI component follows the same spacing scale.

✓ Typography remains consistent.

✓ Colours are used consistently.

✓ Components are reusable.

✓ Accessibility requirements are satisfied.

✓ The landing page maintains a premium SaaS appearance.

---
# 62. Motion & Animation System

## 62.1 Purpose

Motion within CareerOS should improve clarity, provide feedback, and guide the user's attention.

Animations SHALL never exist solely for decoration.

Every animation must have a functional purpose.

Primary Objectives

- Improve user experience
- Guide attention
- Reinforce interactions
- Increase perceived quality
- Maintain a premium SaaS feel

Avoid excessive animations that negatively impact performance or distract users.

---

# 63. Motion Principles

Every animation SHALL be:

Fast

Natural

Subtle

Consistent

Accessible

Performance Optimized

Animations should never delay the user's ability to interact with the page.

---

## Motion Duration

Instant

100ms

Quick

200ms

Standard

300ms

Large Transition

500ms

Hero Animation

600ms

Maximum animation duration SHALL NOT exceed 800ms.

---

## Easing

Preferred

Ease Out

Ease In Out

Avoid

Bounce

Elastic

Overly playful effects

---

# 64. Scroll Animations

Animations SHALL trigger only once when entering the viewport.

Do NOT repeat animations every time the user scrolls.

---

## Hero

Fade

+

Slide Up

Duration

600ms

---

## Feature Cards

Fade

+

Translate Y

20px

Duration

350ms

Stagger

100ms

---

## Dashboard Showcase

Scale

0.98 → 1

Fade

Duration

500ms

---

## Timeline

Connector Line

Progressively fills while scrolling.

Step Cards

Appear sequentially.

---

## FAQ

Accordion

Smooth Height Transition

200ms

---

# 65. Hover Effects

Hover effects SHALL communicate interactivity.

Avoid exaggerated movement.

---

## Buttons

Scale

1 → 1.02

Shadow

Increase Slightly

Background

Darken by approximately 5%

Duration

200ms

---

## Cards

Translate

-4px

Shadow

Increase

Border

Primary Colour

Only when appropriate.

---

## Navigation Links

Underline Animation

or

Colour Transition

Duration

200ms

---

## Dashboard Screenshot

Hover

Scale

1.01

Maximum

1.02

No aggressive zooming.

---

# 66. Loading States

Every asynchronous component SHALL include a loading state.

---

## Skeleton Loaders

Use

Gray placeholders

Rounded rectangles

Animated shimmer

Examples

Dashboard Preview

Cards

Testimonials

Pricing

Feature Images

---

## Buttons

Loading Spinner

Disable Interaction

Maintain Width

Avoid layout shift.

---

## Images

Lazy Load

Placeholder Blur

Cross Fade

---

# 67. Responsive Design Rules

## Breakpoints

Mobile

0px–639px

Tablet

640px–1023px

Desktop

1024px–1279px

Large Desktop

1280px+

---

## Mobile Rules

Single-column layout.

Minimum touch target

44×44px

Navigation becomes drawer.

Reduce animation complexity.

Stack content vertically.

Avoid horizontal scrolling.

---

## Tablet Rules

Two-column layouts where appropriate.

Reduce spacing slightly.

Optimise dashboard previews.

---

## Desktop Rules

Maximum Content Width

1280px

Maintain generous whitespace.

Preserve alternating layouts.

Enable subtle hover interactions.

---

# 68. Accessibility Standards

CareerOS SHALL comply with WCAG 2.1 AA wherever practical.

---

## Colour Contrast

Text contrast ratio

Minimum

4.5:1

Large Text

Minimum

3:1

---

## Keyboard Navigation

All interactive elements SHALL support keyboard navigation.

Tab Order

Logical

Visible Focus Indicators

Required

Escape closes menus and dialogs.

---

## Screen Readers

All buttons SHALL include accessible labels.

Decorative images

aria-hidden

Dashboard screenshots

Descriptive alt text

Navigation landmarks

Required

---

## Forms

Every input SHALL include:

Label

Placeholder (optional)

Error Message

Helper Text (where applicable)

Validation feedback SHALL be announced to assistive technologies.

---

## Motion Accessibility

Respect

prefers-reduced-motion

When enabled

Disable:

Floating animations

Parallax

Large transitions

Keep only essential feedback animations.

---

# 69. SEO Requirements

## Metadata

Every page SHALL define:

Title

Description

Canonical URL

Open Graph Metadata

Twitter Card Metadata

Favicon

---

## Structured Data

Use Schema.org where applicable.

Include

WebSite

Organization

FAQPage

BreadcrumbList (Future)

---

## Semantic HTML

Use proper heading hierarchy.

One H1 per page.

Sections SHALL use semantic elements.

Examples

header

main

section

article

footer

nav

---

## URL Structure

/

/features

/pricing

/about

/contact

/privacy

/terms

Readable URLs only.

Avoid query parameters for static pages.

---

# 70. Performance Requirements

Target Lighthouse Scores

Performance

95+

Accessibility

95+

Best Practices

95+

SEO

100

---

## Optimisation Rules

Use

Next.js Image

Dynamic Imports

Code Splitting

Lazy Loading

Font Optimisation

Image Compression

Tree Shaking

Avoid

Large JavaScript bundles

Autoplay videos

Heavy third-party scripts

Blocking resources

---

## Core Web Vitals

LCP

Below 2.5 seconds

CLS

Below 0.1

INP

Below 200ms

---

# 71. Image & Asset Guidelines

Preferred Formats

SVG

Icons

Logos

---

WebP

Screenshots

Illustrations

---

PNG

Only when transparency is required.

---

Image Rules

Use real CareerOS screenshots.

Maintain consistent aspect ratios.

Optimise every image.

Use descriptive filenames.

Provide alt text.

---

# 72. Implementation Guidelines

Framework

Next.js App Router

Language

TypeScript

Styling

Tailwind CSS

Animation

Framer Motion

Icons

Lucide React

Authentication

Clerk

Database

Supabase PostgreSQL

ORM

Prisma

Image Handling

next/image

Fonts

next/font

---

## Code Standards

Components SHALL be:

Reusable

Modular

Accessible

Strongly Typed

Server Components by default.

Use Client Components only when necessary.

Business logic SHALL NOT exist inside UI components.

---

# 73. Browser Support

Support latest two versions of:

Chrome

Edge

Firefox

Safari

Responsive support for:

Android Chrome

Safari on iOS

Desktop browsers

---

# 74. Testing Checklist

Visual Testing

✓ Hero displays correctly.

✓ Navigation remains sticky.

✓ Dashboard screenshots scale properly.

✓ Cards align consistently.

✓ Responsive layouts work.

Interaction Testing

✓ Buttons function correctly.

✓ FAQ expands smoothly.

✓ Navigation menu works.

✓ Animations perform correctly.

Accessibility Testing

✓ Keyboard navigation.

✓ Screen reader compatibility.

✓ Colour contrast.

✓ Focus states.

Performance Testing

✓ Lighthouse ≥ 95

✓ No layout shift.

✓ Optimised images.

✓ Fast page load.

---

# 75. Acceptance Criteria

The CareerOS Landing Page Specification is considered complete when:

✓ Every section has a clearly defined purpose.

✓ The page follows a logical storytelling structure.

✓ The product dashboard is the primary visual focus.

✓ All UI components conform to the design system.

✓ Motion enhances usability without distraction.

✓ Responsive behaviour is fully specified.

✓ Accessibility requirements are documented.

✓ SEO and performance standards are defined.

✓ Implementation guidance aligns with the CareerOS technology stack (Next.js, Tailwind CSS, Framer Motion, Clerk, Prisma and Supabase PostgreSQL).

✓ The document is detailed enough for developers or AI coding agents to implement the MVP landing page without requiring additional UX or design clarification.

---

# End of Document
