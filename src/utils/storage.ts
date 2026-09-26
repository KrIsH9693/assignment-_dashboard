import type { User, Assignment } from '../types';
import { INITIAL_USERS, INITIAL_ASSIGNMENTS } from '../data/mockData';

const USERS_KEY = 'portal_users';
const ASSIGNMENTS_KEY = 'portal_assignments';
const CURRENT_USER_KEY = 'portal_current_user';

export const getStoredUsers = (): User[] => {
  const data = localStorage.getItem(USERS_KEY);
  if (!data) {
    localStorage.setItem(USERS_KEY, JSON.stringify(INITIAL_USERS));
    return INITIAL_USERS;
  }
  return JSON.parse(data);
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