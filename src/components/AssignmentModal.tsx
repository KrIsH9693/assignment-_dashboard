import React, { useState } from 'react';
import type { Assignment, User } from '../types';

interface AssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (assignmentData: Omit<Assignment, 'id' | 'createdBy'>) => void;
  studentsList: User[];
  initialData?: Assignment | null;
}

export const AssignmentModal: React.FC<AssignmentModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  studentsList,
  initialData,
}) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [deadline, setDeadline] = useState(initialData?.deadline || '');
  const [driveLink, setDriveLink] = useState(initialData?.driveLink || '');
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>(
    initialData
      ? initialData.students.map((s) => s.studentId)
      : studentsList.map((s) => s.id)
  );
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleStudentToggle = (id: string) => {
    if (selectedStudentIds.includes(id)) {
      setSelectedStudentIds(selectedStudentIds.filter((sId) => sId !== id));
    } else {
      setSelectedStudentIds([...selectedStudentIds, id]);
    }
  };

  const handleSelectAll = () => {
    if (selectedStudentIds.length === studentsList.length) {
      setSelectedStudentIds([]);
    } else {
      setSelectedStudentIds(studentsList.map((s) => s.id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !deadline || !driveLink.trim()) {
      setErrorMsg('Please fill in title, deadline, and drive link.');
      return;
    }
    if (selectedStudentIds.length === 0) {
      setErrorMsg('Please select at least one student for this assignment.');
      return;
    }

    const studentsPayload = selectedStudentIds.map((sId) => {
      const existing = initialData?.students.find((s) => s.studentId === sId);
      const studentObj = studentsList.find((s) => s.id === sId);
      return {
        studentId: sId,
        studentName: studentObj?.name || existing?.studentName || 'Student',
        submitted: existing ? existing.submitted : false,
        submittedAt: existing?.submittedAt,
        note: existing?.note,
      };
    });

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      deadline,
      driveLink: driveLink.trim(),
      students: studentsPayload,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-lg bg-white rounded-2xl p-6 shadow-xl border border-slate-100 my-8">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-slate-900">
            {initialData ? 'Edit Assignment' : 'Create New Assignment'}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          >
            ✕
          </button>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600 font-medium">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Redux Toolkit State Management"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief guidelines, deliverables, and expectations..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Deadline
              </label>
              <input
                type="date"
                required
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Google Drive Folder Link
              </label>
              <input
                type="url"
                required
                value={driveLink}
                onChange={(e) => setDriveLink(e.target.value)}
                placeholder="https://drive.google.com/..."
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Student Assignment Assignment Selector */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Assign To Students ({selectedStudentIds.length})
              </label>
              <button
                type="button"
                onClick={handleSelectAll}
                className="text-xs text-indigo-600 font-semibold hover:underline"
              >
                {selectedStudentIds.length === studentsList.length ? 'Deselect All' : 'Select All'}
              </button>
            </div>

            <div className="max-h-36 overflow-y-auto space-y-1.5 border border-slate-200 rounded-xl p-2.5 bg-slate-50">
              {studentsList.map((stu) => {
                const checked = selectedStudentIds.includes(stu.id);
                return (
                  <label
                    key={stu.id}
                    className={`flex items-center gap-2.5 p-2 rounded-lg cursor-pointer text-xs font-medium transition ${
                      checked ? 'bg-indigo-50 text-indigo-900' : 'hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => handleStudentToggle(stu.id)}
                      className="rounded text-indigo-600 focus:ring-indigo-500"
                    />
                    <span>{stu.name} ({stu.email})</span>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition shadow-sm"
            >
              {initialData ? 'Save Changes' : 'Create Assignment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};