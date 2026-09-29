import type { User, Course, Assignment } from '../types';
import { INITIAL_USERS, INITIAL_COURSES, INITIAL_ASSIGNMENTS } from '../data/mockData';

const USERS_KEY = 'portal_users_v2';
const COURSES_KEY = 'portal_courses_v2';
const ASSIGNMENTS_KEY = 'portal_assignments_v2';
const CURRENT_USER_KEY = 'portal_current_user_v2';
const TOKEN_KEY = 'portal_jwt_token';

// Realistic JWT simulator (Header.Payload.Signature in Base64)
export const createMockJWT = (user: User): string => {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(
    JSON.stringify({
      sub: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, // 24 hours
    })
  );
  const signature = btoa('mock_secure_signature_hash');
  return `${header}.${payload}.${signature}`;
};

export const getAuthToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const setAuthToken = (token: string | null): void => {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
};

export const getStoredUsers = (): User[] => {
  const data = localStorage.getItem(USERS_KEY);
  if (!data) {
    localStorage.setItem(USERS_KEY, JSON.stringify(INITIAL_USERS));
    return INITIAL_USERS;
  }
  return JSON.parse(data);
};

export const saveUsers = (users: User[]): void => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const getStoredCourses = (): Course[] => {
  const data = localStorage.getItem(COURSES_KEY);
  if (!data) {
    localStorage.setItem(COURSES_KEY, JSON.stringify(INITIAL_COURSES));
    return INITIAL_COURSES;
  }
  return JSON.parse(data);
};

export const saveCourses = (courses: Course[]): void => {
  localStorage.setItem(COURSES_KEY, JSON.stringify(courses));
};

export const getStoredAssignments = (): Assignment[] => {
  const data = localStorage.getItem(ASSIGNMENTS_KEY);
  if (!data) {
    localStorage.setItem(ASSIGNMENTS_KEY, JSON.stringify(INITIAL_ASSIGNMENTS));
    return INITIAL_ASSIGNMENTS;
  }
  return JSON.parse(data);
};

export const saveAssignments = (assignments: Assignment[]): void => {
  localStorage.setItem(ASSIGNMENTS_KEY, JSON.stringify(assignments));
};

export const getCurrentUser = (): User | null => {
  const data = localStorage.getItem(CURRENT_USER_KEY);
  return data ? JSON.parse(data) : null;
};

export const setCurrentUser = (user: User | null): void => {
  if (user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(CURRENT_USER_KEY);
  }
};