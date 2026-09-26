import { useState, useEffect } from 'react';
import type { User, Assignment } from './types';
import {
  getStoredUsers,
  getStoredAssignments,
  saveAssignments,
  getCurrentUser,
  setCurrentUser,
} from './utils/storage';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { Login } from './pages/Login';
import { StudentDashboard } from './pages/StudentDashboard';
import { AdminDashboard } from './pages/AdminDashboard';

export default function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [currentUserState, setCurrentUserState] = useState<User | null>(null);
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    setUsers(getStoredUsers());
    setAssignments(getStoredAssignments());
    setCurrentUserState(getCurrentUser());
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setCurrentUserState(user);
    setActiveFilter('all');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentUserState(null);
  };

  const updateAssignments = (nextAssignments: Assignment[]) => {
    setAssignments(nextAssignments);
    saveAssignments(nextAssignments);
  };

  if (!currentUserState) {
    return <Login users={users} onSelectUser={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <Navbar user={currentUserState} onLogout={handleLogout} />

      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto">
        <Sidebar
          currentUser={currentUserState}
          onLogout={handleLogout}
          activeFilter={activeFilter}
          onSelectFilter={setActiveFilter}
        />

        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
          {currentUserState.role === 'student' ? (
            <StudentDashboard
              currentUser={currentUserState}
              assignments={assignments}
              onUpdateAssignment={updateAssignments}
              activeFilter={activeFilter}
            />
          ) : (
            <AdminDashboard
              currentUser={currentUserState}
              assignments={assignments}
              allUsers={users}
              onUpdateAssignments={updateAssignments}
            />
          )}
        </main>
      </div>
    </div>
  );
}