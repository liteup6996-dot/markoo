# Campus Learning

A competition-ready university distance-learning LMS demonstration. The project is designed as a serious academic environment: information-dense, accessible, time-zone aware and intentionally closer to a mature university portal than a commercial course marketplace.

## What is included

- Institutional demo sign-in and persistent local session
- Student dashboard with deadlines, live schedule, active modules, announcements and feedback
- Programme overview, credit tracking and interactive optional-module selection
- Module list, module overview and weekly learning-content completion
- Assignment detail, file selection, integrity declaration and generated submission receipt
- Practice assessment flow with autosave status and result feedback
- Gradebook, provisional status and detailed lecturer feedback
- Calendar/timetable with UK and student-local time context
- Live teaching, recordings and simulated session launch
- Academic discussion forums and topic creation
- Integrated mailbox with reading, composition and sent confirmation
- Learning Assistant with academic safeguards and cited LMS sources
- Resource library, help centre, support-ticket creation and accessibility settings
- Responsive desktop, tablet and mobile layouts
- Open Graph and X social-preview metadata

Demo data is fictional. The branding is a configurable placeholder and does not reproduce official UCL branding.

## Technology

- Next.js 16 App Router
- React 19 and TypeScript
- Tailwind CSS
- shadcn interface primitives
- Lucide icons
- pnpm lockfile

The demo intentionally requires no database, API key or external account. Interactive state is stored in the browser so a GitHub-to-Vercel deployment works immediately.

## Run locally

Requirements: Node.js 22.13 or newer and pnpm.

~~~bash
pnpm install
pnpm dev
~~~

Open http://localhost:3000.

Demo credentials:

~~~text
student.demo@example.test
DemoStudent2026!
~~~

Any non-empty values are accepted by the demonstration login form.

## Production build

~~~bash
pnpm build
pnpm start
~~~

## Deploy through GitHub and Vercel

1. Create a new GitHub repository.
2. Upload every file and folder from this project directory to the repository root.
3. In Vercel, choose **Add New → Project**, import the GitHub repository and select **Deploy**.
4. Vercel detects Next.js and uses the checked-in vercel.json settings.
5. Enable the GitHub integration when prompted. New commits to the production branch deploy automatically; pull requests receive preview deployments.

No environment variables are required. For a custom domain, optionally set NEXT_PUBLIC_SITE_URL to the full HTTPS origin so social metadata uses that canonical host. Vercel's own production URL is detected automatically otherwise.

## Project structure

~~~text
app/
  globals.css        Academic design tokens and shared table styles
  layout.tsx         Metadata and site-wide layout
  page.tsx           Application entry point
components/
  lms-app.tsx        Authentication, shell, dashboard and navigation
  lms-views.tsx      Programme, modules and all student workflows
  ui/                Reusable shadcn primitives
public/
  og.png             Social sharing card
vercel.json          Vercel build configuration
~~~

## Demo architecture and production considerations

This version is a polished front-end prototype suitable for judging, stakeholder review and workflow validation. Browser storage is used only for demo session/preferences. A production university deployment should replace it with server-side authentication, a relational database, object storage, audited academic-event services, virus-scanned uploads, role-based authorisation, rate limiting, CSRF protection, institutional SSO, verified messaging, real calendar/video integrations and UK-GDPR governance.

Recommended production domain boundaries:

- Identity and roles
- Programmes, modules, enrolments and content
- Assessments, submissions, exams and grades
- Communications, announcements and notifications
- Support tickets and student services
- AI service abstraction with permission-aware retrieval and source citations
- Immutable audit events for submissions, exams, results and enrolment changes

## Known demo limitations

- Uploaded files are represented by browser metadata and are not sent to a server.
- Live sessions, downloads and university directory search are simulated.
- The Learning Assistant uses deterministic local responses rather than an external model.
- Demo state is scoped to the current browser/device.
- Staff and administrator interfaces are represented in the architecture but the competition experience prioritises the student role.
