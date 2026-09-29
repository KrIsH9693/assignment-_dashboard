import React, { useState } from 'react';
import type { User, Role } from '../types';
import { createMockJWT, setAuthToken, saveUsers } from '../utils/storage';

interface LoginProps {
  users: User[];
  onSelectUser: (user: User) => void;
  onUserRegister?: (newUser: User) => void;
}

export const Login: React.FC<LoginProps> = ({ users, onSelectUser, onUserRegister }) => {
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [activeTab, setActiveTab] = useState<Role>('student');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('rahul@student.edu');
  const [password, setPassword] = useState('password123');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const filteredUsers = users.filter((u) => u.role === activeTab);

  const handleTabChange = (role: Role) => {
    setActiveTab(role);
    setErrorMsg('');
    setSuccessMsg('');
    if (role === 'student') {
      setEmail('rahul@student.edu');
    } else {
      setEmail('sharma@college.edu');
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    // Form Validations
    if (!email.includes('@') || !email.includes('.')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      if (authMode === 'login') {
        const matchedUser = users.find(
          (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.role === activeTab
        );

        if (matchedUser) {
          // Generate & Save simulated JWT Token
          const token = createMockJWT(matchedUser);
          setAuthToken(token);
          setIsLoading(false);
          onSelectUser(matchedUser);
        } else {
          setIsLoading(false);
          setErrorMsg(`Invalid credentials. No ${activeTab} found with ${email}`);
        }
      } else {
        // Registration Flow
        if (!name.trim()) {
          setIsLoading(false);
          setErrorMsg('Full name is required to create an account.');
          return;
        }

        const existing = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
        if (existing) {
          setIsLoading(false);
          setErrorMsg('An account with this email already exists.');
          return;
        }

        const newUser: User = {
          id: `${activeTab}-${Date.now()}`,
          name: name.trim(),
          email: email.trim().toLowerCase(),
          role: activeTab,
        };

        const updatedUsersList = [...users, newUser];
        saveUsers(updatedUsersList);
        if (onUserRegister) onUserRegister(newUser);

        // JWT token setup for new user
        const token = createMockJWT(newUser);
        setAuthToken(token);

        setIsLoading(false);
        setSuccessMsg('Account created successfully! Redirecting...');
        setTimeout(() => {
          onSelectUser(newUser);
        }, 600);
      }
    }, 600); // 600ms realistic network simulation
  };

  const handleQuickLogin = (user: User) => {
    const token = createMockJWT(user);
    setAuthToken(token);
    onSelectUser(user);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center items-center p-4">
      {/* Brand Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-11 h-11 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-extrabold text-2xl shadow-lg shadow-indigo-200">
          A
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 leading-tight">
            Academic Portal
          </h1>
          <p className="text-[11px] text-slate-500 font-medium tracking-wide uppercase">
            JWT Role-Based Auth Flow
          </p>
        </div>
      </div>

      {/* Main Card */}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-200/80 overflow-hidden transition-all duration-300">
        {/* Role Switcher Tabs */}
        <div className="grid grid-cols-2 p-1.5 bg-slate-50 border-b border-slate-200/80 gap-1">
          <button
            type="button"
            onClick={() => handleTabChange('student')}
            className={`py-2.5 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'student'
                ? 'bg-white text-indigo-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🎓 Student Portal
          </button>
          <button
            type="button"
            onClick={() => handleTabChange('admin')}
            className={`py-2.5 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'admin'
                ? 'bg-white text-indigo-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            👨‍🏫 Professor / Admin
          </button>
        </div>

        <div className="p-6 sm:p-8">
          {/* Auth Mode Toggle (Login vs Register) */}
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {authMode === 'login' ? 'Sign In' : 'Create Account'}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {authMode === 'login'
                  ? `Access your ${activeTab} workspace`
                  : `Register as a new ${activeTab}`}
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setAuthMode(authMode === 'login' ? 'register' : 'login');
                setErrorMsg('');
                setSuccessMsg('');
              }}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 underline"
            >
              {authMode === 'login' ? 'Need an account?' : 'Already have one?'}
            </button>
          </div>

          {/* Alerts */}
          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-600 font-medium">
              {errorMsg}
            </div>
          )}
          {successMsg && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-700 font-medium">
              {successMsg}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleFormSubmit} className="space-y-4">
            {authMode === 'register' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@college.edu"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold text-sm transition shadow-lg shadow-indigo-100 flex items-center justify-center gap-2 active:scale-98"
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>Verifying JWT Session...</span>
                </>
              ) : (
                <span>
                  {authMode === 'login' ? `Authenticate as ${activeTab}` : 'Register & Log In'}
                </span>
              )}
            </button>
          </form>

          {/* Quick Demo Access Switcher */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Instant Demo Access
              </span>
              <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                JWT Auto-Sign
              </span>
            </div>

            <div className="space-y-2">
              {filteredUsers.map((u) => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => handleQuickLogin(u)}
                  className="w-full text-left px-3 py-2 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/60 transition flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 group-hover:bg-indigo-600 group-hover:text-white flex items-center justify-center font-bold text-xs transition">
                      {u.name.charAt(0)}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-800 group-hover:text-indigo-600 block">
                        {u.name}
                      </span>
                      <span className="text-[11px] text-slate-400 block">{u.email}</span>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-indigo-600 group-hover:translate-x-0.5 transition-transform">
                    Enter →
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};