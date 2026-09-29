import { useState, useEffect } from 'react';
import type { User, Assignment, Course } from './types';
import {
  getStoredUsers,
  getStoredCourses,
  saveCourses,
  getStoredAssignments,
  saveAssignments,
  setCurrentUser,
  setAuthToken,
} from './utils/storage';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { Login } from './pages/Login';
import { StudentDashboard } from './pages/StudentDashboard';
import { AdminDashboard } from './pages/AdminDashboard';

export default function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [currentUserState, setCurrentUserState] = useState<User | null>(null);
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    // Fresh mock/stored data load hoga
    setUsers(getStoredUsers());
    setCourses(getStoredCourses());
    setAssignments(getStoredAssignments());

    // Auto-restore intentionally disabled: Hamesha Login Screen pehle dikhegi
    setCurrentUserState(null);
    setCurrentUser(null);
    setAuthToken(null);
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setCurrentUserState(user);
    setActiveFilter('all');
  };

  const handleUserRegister = (newUser: User) => {
    const nextUsers = [...users, newUser];
    setUsers(nextUsers);

    if (newUser.role === 'student') {
      const updatedCourses = courses.map((course) => ({
        ...course,
        studentIds: course.studentIds.includes(newUser.id)
          ? course.studentIds
          : [...course.studentIds, newUser.id],
      }));
      setCourses(updatedCourses);
      saveCourses(updatedCourses);

      const updatedAssignments = assignments.map((asg) => ({
        ...asg,
        students: asg.students.some((s) => s.studentId === newUser.id)
          ? asg.students
          : [
              ...asg.students,
              {
                studentId: newUser.id,
                studentName: newUser.name,
                submitted: false,
              },
            ],
      }));
      setAssignments(updatedAssignments);
      saveAssignments(updatedAssignments);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentUserState(null);
    setAuthToken(null);
  };

  const updateAssignments = (nextAssignments: Assignment[]) => {
    setAssignments(nextAssignments);
    saveAssignments(nextAssignments);
  };

  const updateCourses = (nextCourses: Course[]) => {
    setCourses(nextCourses);
    saveCourses(nextCourses);
  };

  // Jab tak user login/register nahi karta, strictly Login Page render hoga
  if (!currentUserState) {
    return (
      <Login
        users={users}
        onSelectUser={handleLogin}
        onUserRegister={handleUserRegister}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
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
              courses={courses}
              assignments={assignments}
              onUpdateAssignment={updateAssignments}
              activeFilter={activeFilter}
            />
          ) : (
            <AdminDashboard
              currentUser={currentUserState}
              courses={courses}
              assignments={assignments}
              allUsers={users}
              onUpdateAssignments={updateAssignments}
              onUpdateCourses={updateCourses}
            />
          )}
        </main>
      </div>
    </div>
  );
}