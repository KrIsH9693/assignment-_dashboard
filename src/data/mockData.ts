import type { User, Assignment } from '../types';

export const INITIAL_USERS: User[] = [
  { id: 'admin-1', name: 'Dr. Sharma', email: 'sharma@college.edu', role: 'admin' },
  { id: 'student-1', name: 'Rahul Verma', email: 'rahul@student.edu', role: 'student' },
  { id: 'student-2', name: 'Aman Singh', email: 'aman@student.edu', role: 'student' },
  { id: 'student-3', name: 'Priya Patel', email: 'priya@student.edu', role: 'student' },
];

export const INITIAL_ASSIGNMENTS: Assignment[] = [
  {
    id: 'asg-1',
    title: 'React Dashboard Implementation',
    description: 'Build a responsive role-based assignment portal with state persistence.',
    deadline: '2026-09-28',
    driveLink: 'https://drive.google.com',
    createdBy: 'admin-1',
    students: [
      { studentId: 'student-1', studentName: 'Rahul Verma', submitted: true, submittedAt: '2026-09-24' },
      { studentId: 'student-2', studentName: 'Aman Singh', submitted: false },
      { studentId: 'student-3', studentName: 'Priya Patel', submitted: false },
    ],
  },
  {
    id: 'asg-2',
    title: 'TypeScript Interface Design',
    description: 'Define strong types and utility structures for data isolation models.',
    deadline: '2026-10-02',
    driveLink: 'https://drive.google.com',
    createdBy: 'admin-1',
    students: [
      { studentId: 'student-1', studentName: 'Rahul Verma', submitted: false },
      { studentId: 'student-2', studentName: 'Aman Singh', submitted: true, submittedAt: '2026-09-25' },
      { studentId: 'student-3', studentName: 'Priya Patel', submitted: false },
    ],
  },
];