import type { User, Course, Assignment } from '../types';

export const INITIAL_USERS: User[] = [
  { id: 'admin-1', name: 'Dr. Sharma', email: 'sharma@college.edu', role: 'admin' },
  { id: 'student-1', name: 'Rahul Verma', email: 'rahul@student.edu', role: 'student' },
  { id: 'student-2', name: 'Aman Singh', email: 'aman@student.edu', role: 'student' },
  { id: 'student-3', name: 'Priya Patel', email: 'priya@student.edu', role: 'student' },
  { id: 'student-4', name: 'Rohan Mehra', email: 'rohan@student.edu', role: 'student' },
];

export const INITIAL_COURSES: Course[] = [
  {
    id: 'cs-301',
    code: 'CS301',
    title: 'Advanced Web Architecture',
    semester: 'Semester 5',
    instructorId: 'admin-1',
    studentIds: ['student-1', 'student-2', 'student-3', 'student-4'],
  },
  {
    id: 'cs-302',
    code: 'CS302',
    title: 'Cloud Systems & DevOps',
    semester: 'Semester 5',
    instructorId: 'admin-1',
    studentIds: ['student-1', 'student-2'],
  },
];

export const INITIAL_ASSIGNMENTS: Assignment[] = [
  {
    id: 'asg-1',
    courseId: 'cs-301',
    title: 'React State Management Architecture',
    description: 'Implement a complete responsive dashboard with client state sync.',
    deadline: '2026-10-05 23:59',
    driveLink: 'https://onedrive.live.com',
    createdBy: 'admin-1',
    submissionType: 'individual',
    students: [
      { studentId: 'student-1', studentName: 'Rahul Verma', submitted: true, submittedAt: '2026-10-01 18:30' },
      { studentId: 'student-2', studentName: 'Aman Singh', submitted: false },
      { studentId: 'student-3', studentName: 'Priya Patel', submitted: false },
    ],
  },
  {
    id: 'asg-2',
    courseId: 'cs-301',
    title: 'Distributed Microservices Project',
    description: 'Team project: design API contract, gateway, and service registry.',
    deadline: '2026-10-12 18:00',
    driveLink: 'https://onedrive.live.com',
    createdBy: 'admin-1',
    submissionType: 'group',
    students: [
      { studentId: 'student-1', studentName: 'Rahul Verma', submitted: false },
      { studentId: 'student-2', studentName: 'Aman Singh', submitted: false },
      { studentId: 'student-3', studentName: 'Priya Patel', submitted: false },
    ],
    groups: [
      {
        id: 'grp-alpha',
        name: 'Team Alpha',
        leaderId: 'student-1', // Rahul is leader
        memberIds: ['student-1', 'student-2'], // Rahul & Aman
        submitted: false,
      },
      // Note: Priya ('student-3') aur Rohan kisi group mein nahi hain
    ],
  },
];