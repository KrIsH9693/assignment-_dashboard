import React, { useState } from 'react';
import type { User, Role } from '../types';

interface LoginProps {
  users: User[];
  onSelectUser: (user: User) => void;
}

export const Login: React.FC<LoginProps> = ({ users, onSelectUser }) => {
  const [activeTab, setActiveTab] = useState<Role>('student');
  const [email, setEmail] = useState('rahul@student.edu');
  const [password, setPassword] = useState('password123');
  const [errorMsg, setErrorMsg] = useState('');

  const filteredUsers = users.filter((u) => u.role === activeTab);

  const handleTabChange = (role: Role) => {
    setActiveTab(role);
    setErrorMsg('');
    // Switch default demo email based on selected tab
    if (role === 'student') {
      setEmail('rahul@student.edu');
    } else {
      setEmail('sharma@college.edu');
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const matchedUser = users.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.role === activeTab
    );

    if (matchedUser) {
      setErrorMsg('');
      onSelectUser(matchedUser);
    } else {
      setErrorMsg(`No ${activeTab} account found with email: ${email}`);
    }
  };

  const handleQuickLogin = (user: User) => {
    setEmail(user.email);
    onSelectUser(user);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center items-center p-4">
      {/* Brand Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-sm">
          A
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Assignment Portal
        </h1>
      </div>

      {/* Main Card */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Role Switcher Tabs */}
        <div className="grid grid-cols-2 p-1.5 bg-slate-50 border-b border-slate-200 gap-1">
          <button
            type="button"
            onClick={() => handleTabChange('student')}
            className={`py-2 text-sm font-semibold rounded-lg transition-all ${
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
            className={`py-2 text-sm font-semibold rounded-lg transition-all ${
              activeTab === 'admin'
                ? 'bg-white text-indigo-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            👨‍🏫 Professor / Admin
          </button>
        </div>

        <div className="p-6 sm:p-8">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-slate-900">
              Welcome back
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Sign in as {activeTab === 'student' ? 'a student' : 'an instructor'} to manage assignments
            </p>
          </div>

          {errorMsg && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-600 font-medium">
              {errorMsg}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleFormSubmit} className="space-y-4">
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
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
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
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition shadow-sm"
            >
              Sign In to {activeTab === 'student' ? 'Student' : 'Admin'} Dashboard
            </button>
          </form>

          {/* Quick Demo Access Switcher */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-3">
              One-Click Demo Access
            </p>
            <div className="space-y-2">
              {filteredUsers.map((u) => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => handleQuickLogin(u)}
                  className="w-full text-left px-3 py-2 rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/60 transition flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-700 group-hover:bg-indigo-600 group-hover:text-white flex items-center justify-center font-bold text-xs transition">
                      {u.name.charAt(0)}
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-slate-800 group-hover:text-indigo-600 block">
                        {u.name}
                      </span>
                      <span className="text-[11px] text-slate-400 block">{u.email}</span>
                    </div>
                  </div>
                  <span className="text-[11px] font-medium text-slate-400 group-hover:text-indigo-600">
                    Use →
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