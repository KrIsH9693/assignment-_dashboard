# Student, Group & Assignment Management System (Enhanced UI/UX)

An enterprise-grade academic workflow portal engineered with **React 18**, **TypeScript**, and **Tailwind CSS**. Built to fulfill **Task 1 (Core Prototype)** and **Task 2 (Frontend UI/UX Enhancement)**, this application simulates a complete client-side LMS with role-based JWT authentication, course hierarchies, team-based submission acknowledgments, and `localStorage` persistence with zero backend dependencies.

---

## 🔗 Live Application & Source

- **Live Production App:** [Insert your Vercel Link Here]
- **GitHub Repository:** [Insert your GitHub Repository Link Here]

---

## 🔐 Authentication & Quick Access Credentials

The portal features interactive **Form Validation**, **Registration for Students & Instructors**, and **JWT Session Token Generation** stored under `portal_jwt_token`.

| Role | Name | Email | Default Password | Permissions & Scope |
|---|---|---|---|---|
| **Instructor** | Dr. Sharma | `sharma@college.edu` | `password123` | Create/Claim courses, publish coursework (Individual/Group), inspect student submissions, manual status override |
| **Student (Leader)** | Rahul Verma | `rahul@student.edu` | `password123` | CS301 & CS302 enrolled; Team Alpha Leader (submits for whole team) |
| **Student (Member)** | Aman Singh | `aman@student.edu` | `password123` | CS301 & CS302 enrolled; Team Alpha Member (status syncs with leader) |
| **Student (Unassigned)** | Priya Patel | `priya@student.edu` | `password123` | CS301 enrolled; Unassigned (sees prompt to form/join a group) |

> 💡 **Self-Registration:** You can also register a brand new Student or Instructor directly via the **Create Account** tab.

---

## 🏛️️ Application Architecture & User Flow

```text
                     Authentication Gate
                  (Login / Register / JWT)
                             │
            ┌────────────────┴────────────────┐
            ▼                                 ▼
   Student Workspace                 Instructor Control Panel
            │                                 │
     Enrolled Courses                  Courses Management
     (CS301, CS302)                   (Create, Filter, Claim)
            │                                 │
   Course Assignments View           Assignment Creator & Matrix
            │                         (Individual vs Group Config)
   ┌────────┴────────┐                        │
   ▼                 ▼                        ▼
Individual        Group Task            Live Student Roster
Task Flow         (Leader/Member)        (Analytics & Overrides)
   │                 │                        │
   └────────┬────────┘                        │
            ▼                                 ▼
      Two-Step Double                   Real-time Metric
     Confirmation Modal                   Calculations
            │                                 │
            └────────────────┬────────────────┘
                             ▼
                Local State & Storage Sync

Key Implemented Features (Task 1 & Task 2)
1. 🛡️ Authentication & JWT Flow
Tabbed role switcher (Student vs Professor) with instantaneous demo access chips.

Account Registration for students (auto-enrolled into curriculum) and instructors.

Client-side JWT session token creation (Header.Payload.Signature in Base64) with realistic verification delay and auto-clear on logout.

2. 📚 Course-Level Hierarchy
Student Dashboard: Displays enrolled semester courses with individual progress bars before drilling down into coursework.

Instructor Dashboard: Displays assigned courses, quick course filter dropdown, and a "+ Add Course" modal to create custom curriculum offerings on the fly.

3. 👥 Group vs Individual Submission Logic
Individual Assignments: Direct submission confirmation accessible to any assigned student.

Group Assignments (Leader Exclusivity):

Only the designated Group Leader can click Submit (Leader).

When acknowledged by the leader, all member accounts (e.g. Aman Singh) immediately transition to Acknowledged with leader metadata.

Unassigned Student Guard: Displays a dedicated amber banner ("You are not part of any group. Form or join one to submit this assignment.") disabling submission until a group is joined.

4. 📊 High-Fidelity UI/UX & Responsive Controls
Custom Animated Progress Bars computing real-time semester and course completion percentages.

Sidebar View Filters: Snappy one-click toggle between All Assignments, Pending Only, and Completed Only.

Double-confirmation submission modal supporting OneDrive folder verification, local file previews, and submission remarks.

Mobile-responsive layout transitioning smoothly between desktop sidebar and stacked mobile views.

🛠️ Tech Stack & Implementation Details
Core Library: React 18 (Hooks: useState, useEffect, Custom Storage Handlers)

Language: TypeScript (Strict type interfaces for Course, StudentGroup, Assignment, User)

Styling: Tailwind CSS (CDN-based utility classes with responsive breakpoints)

Build Tool: Vite

Persistence: LocalStorage API with structured schema versioning (portal_users_v2, portal_courses_v2, portal_assignments_v2)

**#Project Structure#**

assignment-dashboard/
├── public/
├── src/
│   ├── components/
│   │   ├── AssignmentCard.tsx      # Modular card with submission urgency badges
│   │   ├── AssignmentModal.tsx     # Assignment publisher (OneDrive, Group/Indiv)
│   │   ├── ConfirmationModal.tsx   # Two-step submission confirmation dialog
│   │   ├── CourseModal.tsx         # Instructor course creation modal
│   │   ├── Navbar.tsx              # Top header with user identity badge
│   │   ├── ProgressBar.tsx         # Multi-size animated completion component
│   │   ├── Sidebar.tsx             # Sidebar with filters ('all', 'pending', 'completed')
│   │   └── StudentProgress.tsx     # Instructor student inspection row
│   ├── data/
│   │   └── mockData.ts             # Initial courses, users, and assignment seeds
│   ├── pages/
│   │   ├── AdminDashboard.tsx      # Instructor curriculum & submissions console
│   │   ├── Login.tsx               # JWT Authentication and registration portal
│   │   └── StudentDashboard.tsx    # Student course cards & assignment flows
│   ├── utils/
│   │   └── storage.ts              # JWT generator & localStorage sync engine
│   ├── types.ts                    # Unified TypeScript type definitions
│   ├── App.tsx                     # Top-level view router & state synchronizer
│   ├── main.tsx
│   └── index.css
├── index.html
├── package.json
├── tsconfig.json
└── README.md


##Clone the repository:
Bash
git clone https://github.com/KrIsH9693/assignment-_dashboard.git
cd assignment-dashboard

##Install dependencies:
Bash
npm install

##Start local development server:
Bash
npm run dev
Open http://localhost:5173 in your browser.


##Run TypeScript and Production Build:
Bash
npm run build