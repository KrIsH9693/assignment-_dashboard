import React from 'react';
import type { User } from '../types';

interface SidebarProps {
  currentUser: User;
  onLogout: () => void;
  activeFilter?: string;
  onSelectFilter?: (filter: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentUser,
  onLogout,
  activeFilter = 'all',
  onSelectFilter,
}) => {
  return (
    <aside className="w-full md:w-64 bg-white md:min-h-[calc(100vh-4rem)] border-b md:border-b-0 md:border-r border-slate-200 p-4 flex flex-col justify-between shrink-0">
      <div className="space-y-6">
        {/* User Card */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-bold flex items-center justify-center text-sm shadow-sm">
            {currentUser.name.charAt(0)}
          </div>
          <div className="min-w-0">
            <h4 className="text-sm font-bold text-slate-900 truncate">{currentUser.name}</h4>
            <span
              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase inline-block ${
                currentUser.role === 'admin'
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-indigo-100 text-indigo-800'
              }`}
            >
              {currentUser.role}
            </span>
          </div>
        </div>

        {/* Navigation Filters */}
        {onSelectFilter && (
          <nav className="space-y-1">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2 mb-2">
              Views
            </p>
            <button
              onClick={() => onSelectFilter('all')}
              className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition flex items-center justify-between ${
                activeFilter === 'all'
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span>📁 All Assignments</span>
            </button>
            <button
              onClick={() => onSelectFilter('pending')}
              className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition flex items-center justify-between ${
                activeFilter === 'pending'
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span>⏳ Pending Only</span>
            </button>
            <button
              onClick={() => onSelectFilter('completed')}
              className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition flex items-center justify-between ${
                activeFilter === 'completed'
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span>✅ Completed Only</span>
            </button>
          </nav>
        )}
      </div>

      {/* Logout */}
      <div className="pt-4 border-t border-slate-100 mt-4">
        <button
          onClick={onLogout}
          className="w-full py-2 px-3 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 transition text-left flex items-center gap-2"
        >
          <span>🚪</span> Logout
        </button>
      </div>
    </aside>
  );
};