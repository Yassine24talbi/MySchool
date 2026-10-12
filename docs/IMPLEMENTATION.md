# MySchool implementation guide

This document explains the work implemented from the supplied **Struction.png** architecture. That image is treated as product and architecture guidance. Its labels and sample data are not extra user instructions. The requested product has three distinct role frontends and one shared backend: students use a website, teachers use an Electron desktop app, and administrators use a separate Electron desktop app.

## What is in the project

```text
apps/
  student/              Student website entry and Vite build
  teacher/              Teacher UI entry, Vite build, Electron main process
  admin/                Admin UI entry, Vite build, Electron main process
shared/
  app.jsx               Reusable role-aware React interface and screens
  styles.css            Shared responsive visual system
server/
  index.js              Express REST API, authentication, permissions
  db.js                 SQLite schema, initial school and demo accounts
  data/myschool.sqlite  Created automatically the first time the API starts
docs/IMPLEMENTATION.md  This guide
```

Each Vite configuration compiles the same shared interface with its own fixed role. They are separate frontends: the student build is a browser website; the teacher and administrator builds are loaded by separate Electron main processes and use independent window titles and role-specific access. All three talk to the same API and database.

## Features implemented

### Student website

- Sign in as a student and see the student dashboard.
- View assigned classes and published quizzes for those classes.
- Take a multiple-choice quiz and submit answers.
- See automatically calculated quiz scores and previous results.
- Student API responses are scoped to the signed-in student and assigned classes.

### Teacher desktop app

- Sign in as a teacher and view assigned classes and students from those classes.
- Create draft quizzes for an assigned class, with a subject and up to three multiple-choice questions.
- Publish and unpublish quizzes.
- Review submitted scores for the teacher's quizzes.
- Teacher quiz access is limited to quizzes created by that teacher. Class lists and student lists are assignment-scoped.

### Administrator desktop app

- View school-wide dashboard counts and recent activity.
- Create and remove classes and subjects.
- Create teacher and student accounts, optionally assigning each to a class.
- Review and remove accounts.
- Review all quizzes and submitted results.

### Shared platform

- The Express API issues signed, expiring JWT login tokens.
- The database stores users, classes, subjects, teacher-class and teacher-subject links, student-class links, quizzes, questions, attempts, and answers.
- Quiz scores are calculated on the server from stored correct answers; the quiz API omits correct answers from student responses.
- SQLite foreign keys are enabled and dependent quiz questions and attempt answers are removed with their parent records.
- The browser layout adapts to narrower screens. Electron windows set a desktop minimum size and disable Node integration.

## Local development

Install dependencies and start the API and all three Vite servers together:

```powershell
npm install
npm run dev
```

| Component | Address |
| --- | --- |
| Student website | `http://localhost:5173` |
| Teacher UI preview | `http://localhost:5174` |
| Admin UI preview | `http://localhost:5175` |
| API health | `http://localhost:3000/api/health` |

The teacher and admin Vite previews let you work on their screens in a browser. For their Electron shells, keep the dev servers running and launch them from another PowerShell session:

```powershell
$env:VITE_DEV_SERVER_URL = 'http://localhost:5174'
npm run electron:teacher
```

For admin, set `VITE_DEV_SERVER_URL` to `http://localhost:5175` and run `npm run electron:admin`.

Create production frontend bundles with `npm run build`. Then run either Electron command without `VITE_DEV_SERVER_URL` to open that role's compiled local UI. The API still needs to be running (`npm run start:api`) for login and data operations.

## Demo login accounts

| Role | Username | Password |
| --- | --- | --- |
| Administrator | `admin` | `admin123` |
| Teacher | `maya` | `teacher123` |
| Student | `alex` | `student123` |

The API creates a school, two classes, two subjects, and initial assignments on its first start. Newly created accounts use `welcome123` as their initial password. Demo data and accounts live in `server/data/myschool.sqlite`; remove that file only when you intend to reset the local demo database.

## API overview

All application routes are under `/api`. Login is `POST /auth/login`; it returns a bearer token and a role-specific user profile. Protected requests use `Authorization: Bearer <token>`.

| Route | Purpose |
| --- | --- |
| `/health` | API readiness |
| `/auth/login`, `/auth/me` | Sign-in and current profile |
| `/dashboard` | Role-scoped dashboard data |
| `/users` | List and create school users (admin can create; teacher reads assigned students) |
| `/classes`, `/subjects` | Read school data; admin manages it |
| `/quizzes`, `/quizzes/:id` | List, create, update, publish, read a quiz |
| `/quizzes/:id/submit` | Submit a student's answers for server-side grading |
| `/results` | Role-scoped submitted results |

## Important deployment work still required

This is a local MVP foundation, not a production deployment. Before exposing it to the internet, configure a strong `JWT_SECRET`, replace the demo credentials, add password reset and password change flows, restrict CORS to the deployed frontends, serve the API over HTTPS, and define backup and restore procedures for SQLite. User deletion, class assignment editing, Excel import/export, richer quiz question types, and installer/package publishing are not included yet. Passwords are salted and derived with Node's `scrypt`, but the demo initial passwords are intentionally documented for local setup.

The API currently uses Node's built-in `node:sqlite` interface, so Node.js 22 or later is required. The Electron main processes open the Vite build output, but native Windows/macOS/Linux installer packages have not been configured.
