# UCL Distance Learning LMS

A Vercel-ready student learning environment built around one demonstration profile:

- Student: Muhammad Ahmad
- Student ID: L-PK-625900
- Password: 1621111
- Programme: BSc Computer Science

The supplied UCL logo is used throughout the interface. This repository is an independent learning-system prototype and does not claim to be an official UCL service.

## Learning content

### Retained Module 1 record

- Introduction to Python — 50%
- Finance 101 — 29%
- Machine Learning CP-1.1 — 16%
- English Literature — 45%

### Latest Module 2

Module 2 — Software Development and Commercialization runs for 16 weeks with four parallel courses:

1. COMP2001 — Agile Software Projects
2. COMP2002 — Software Design and Development
3. COMP2003 — Object-Oriented Programming
4. COMP2004 — Software Commercialization and Market Strategy

All 64 weekly lessons use the detailed lesson titles from the supplied Module 2 syllabus. Each lesson presents learning materials, lecture, slides, knowledge check, practical work, discussion and integrated-project activity.

## Profile persistence

Interactive activity is stored under the versioned browser key for L-PK-625900:

- completed Module 2 lessons
- submission receipts and file metadata
- discussion topics
- sent-message history
- support tickets
- accessibility and time-zone preferences

The data survives page reloads and Vercel redeployments when the same browser and deployment domain are used. Settings also provides profile backup download and restore. Use the backup before moving to another browser, device or domain.

This standalone demonstration does not include a remote university database. A production university deployment should replace the browser store with authenticated server-side storage and audited role-based access.

## Live sessions

Every Join meeting button opens https://zoom.us/join in a new tab. The connection test opens https://zoom.us/test.

## Run locally

Requirements: Node.js 22.13 or newer and pnpm.

~~~bash
pnpm install
pnpm dev
~~~

Open http://localhost:3000.

## Build

~~~bash
pnpm build
pnpm start
~~~

## Deploy with GitHub and Vercel

1. Extract the supplied ZIP.
2. Upload the extracted project contents to the root of a GitHub repository.
3. In Vercel choose Add New, then Project, and import that repository.
4. Select Deploy. The checked-in vercel.json uses the correct Next.js build.
5. Keep the GitHub integration enabled for automatic production and preview deployments.

No environment variables are required. NEXT_PUBLIC_SITE_URL may optionally be set to a custom HTTPS domain for metadata.

## Main source files

~~~text
app/layout.tsx                 Site metadata
app/globals.css                UCL-aligned interface theme
components/lms-app.tsx         Sign-in, application shell and dashboard
components/lms-views.tsx       All student pages and workflows
components/student-provider.tsx Versioned profile persistence and backup
lib/module-two.ts              Module 1 history and all Module 2 lessons
public/ucl-logo.png            Supplied logo
vercel.json                    Vercel configuration
~~~
