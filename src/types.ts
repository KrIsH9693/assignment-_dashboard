export type Role = 'student' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface Course {
  id: string;
  code: string;
  title: string;
  semester: string;
  instructorId: string;
  studentIds: string[];
}

export interface StudentGroup {
  id: string;
  name: string;
  leaderId: string;
  memberIds: string[];
  submitted: boolean;
  submittedAt?: string;
  submissionNote?: string;
}

export interface StudentProgressItem {
  studentId: string;
  studentName: string;
  submitted: boolean;
  submittedAt?: string;
  note?: string;
}

export interface Assignment {
  id: string;
  courseId: string;
  title: string;
  description: string;
  deadline: string; // Date + Time
  driveLink: string; // OneDrive link
  createdBy: string;
  submissionType: 'individual' | 'group';
  students: StudentProgressItem[];
  groups?: StudentGroup[];
}