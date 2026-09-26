export type Role = 'student' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface StudentProgressItem {
  studentId: string;
  studentName: string;
  submitted: boolean;
  submittedAt?: string;
  note?: string; // Verification detail
  
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  deadline: string;
  driveLink: string;
  createdBy: string; // admin user id
  students: StudentProgressItem[];
}