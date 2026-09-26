# Student Assignment Management Dashboard

A role-based academic management portal built with **React**, **TypeScript**, and **Tailwind CSS (via CDN)**. The application simulates a full-stack client workflow with role-specific views for Students and Instructors, double-confirmation submission validation, and persistence through browser `localStorage` without requiring a backend.

---

## 🔗 Live Demo & Repository

- **Live Application:** : https://assignment-dashboard-brown.vercel.app/
- **GitHub Repository:** : (https://github.com/KrIsH9693/assignment-_dashboard.git)

---

## 👥 Demo Credentials & Role Access

Click the **One-Click Demo Access** buttons on the login screen or sign in manually:

| Role | Demo Name | Email | Default Password | Access & Permissions |
|---|---|---|---|---|
| **Admin / Instructor** | Dr. Sharma | `sharma@college.edu` | `password123` | Create, edit, and delete coursework; track student submissions and timestamps |
| **Student** | Rahul Verma | `rahul@student.edu` | `password123` | View assigned tasks, verify drive folder links, submit proof, track progress |
| **Student** | Aman Singh | `aman@student.edu` | `password123` | Student portal view with isolated progress tracking |
| **Student** | Priya Patel | `priya@student.edu` | `password123` | Student portal view with isolated progress tracking |

---

## 🏛️ Application Architecture & Data Flow

```text
               User Authentication / Role Switcher
                              │
               ┌──────────────┴──────────────┐
               ▼                             ▼
       Student Session                Instructor Session
               │                             │
    ┌──────────┴──────────┐       ┌──────────┴──────────┐
    ▼                     ▼       ▼                     ▼
Personal Coursework   Progress    Coursework CRUD    Student Matrix
     List             Analytics   & Assignments      & Live Status
        │                            │
        ▼                            ▼
  Two-Step Modal                     Manual Overrides
  Verification Flow                  & Inspections
        │                            │
        └──────────────┬─────────────┘
                       ▼
             localStorage Persistence

##Core Features
🎓 Student Portal
Progress Tracking: Dynamic calculation of overall progress based strictly on tasks mapped to the student.

##Assignment Cards: Displays deadline, completion status badge (Submitted vs Pending), and instructor material links.

##Two-Step Double Confirmation:

Step 1: Verifies the Google Drive submission folder and lets the student attach their Drive/GitHub link or upload a local file preview.

Step 2: Final confirmation prompt saving the timestamped record and submission remarks.

Role-Based Isolation: Students only see assignments assigned to them.

##👨‍🏫 Instructor / Admin Portal
Key Metrics: Real-time active assignment count, enrolled students, and global submission rate.

##Coursework Management: Create, edit, and delete coursework with title, description, deadline, folder links, and custom student assignments.

##Student Progress Breakdown: Per-assignment student list showing submission status (0% vs 100%), exact submission timestamps, and attached notes/URLs.

##Manual Overrides: Quick status toggle for offline evaluations.

##🛠️ Tech Stack & Decisions
Framework: React 18+ with Vite

Type Safety: TypeScript (verbatimModuleSyntax compliant)

Styling: Tailwind CSS loaded via CDN (<script src="https://cdn.tailwindcss.com"></script>)

State Management: React Hooks (useState, useEffect)

Storage: Browser localStorage for offline persistence and simulated backend behavior

Design System: Responsive multi-panel layout with modular cards, progress bars, and accessible modals

##📂 Project Structure
assignment-dashboard/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── AssignmentCard.tsx      # Modular assignment card with deadline alerts
│   │   ├── AssignmentModal.tsx     # Coursework creation and edit modal
│   │   ├── ConfirmationModal.tsx   # Two-step submission confirmation modal
│   │   ├── Navbar.tsx              # Brand header and current user info
│   │   ├── ProgressBar.tsx         # Reusable animated completion bar
│   │   ├── Sidebar.tsx             # Responsive navigation and view filters
│   │   └── StudentProgress.tsx     # Instructor row view for individual student tracking
│   ├── data/
│   │   └── mockData.ts             # Initial student and instructor dataset
│   ├── pages/
│   │   ├── AdminDashboard.tsx      # Instructor control panel
│   │   ├── Login.tsx               # Role-tabbed login screen with quick demo accounts
│   │   └── StudentDashboard.tsx    # Student submission view
│   ├── utils/
│   │   └── storage.ts              # localStorage sync helpers
│   ├── types.ts                    # Strong TypeScript models
│   ├── App.tsx                     # Main layout and role-based view routing
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