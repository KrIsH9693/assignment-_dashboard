import React, { useState } from 'react';
import type { Assignment, User, Course } from '../types';

interface AssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (assignmentData: Omit<Assignment, 'id' | 'createdBy'>) => void;
  studentsList: User[];
  courses: Course[];
  initialData?: Assignment | null;
}

export const AssignmentModal: React.FC<AssignmentModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  studentsList,
  courses,
  initialData,
}) => {
  const [courseId, setCourseId] = useState(initialData?.courseId || courses[0]?.id || 'cs-301');
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [deadline, setDeadline] = useState(initialData?.deadline || '');
  const [driveLink, setDriveLink] = useState(initialData?.driveLink || '');
  const [submissionType, setSubmissionType] = useState<'individual' | 'group'>(
    initialData?.submissionType || 'individual'
  );
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !deadline || !driveLink.trim()) {
      setErrorMsg('Please complete all required fields.');
      return;
    }

    const studentsPayload = studentsList.map((stu) => {
      const existing = initialData?.students.find((s) => s.studentId === stu.id);
      return {
        studentId: stu.id,
        studentName: stu.name,
        submitted: existing ? existing.submitted : false,
        submittedAt: existing?.submittedAt,
        note: existing?.note,
      };
    });

    onSubmit({
      courseId,
      title: title.trim(),
      description: description.trim(),
      deadline,
      driveLink: driveLink.trim(),
      submissionType,
      students: studentsPayload,
      groups: initialData?.groups || [
        {
          id: `grp-${Date.now()}`,
          name: 'Project Team 1',
          leaderId: 'student-1',
          memberIds: ['student-1', 'student-2'],
          submitted: false,
        },
      ],
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 my-8 transition-all">
        <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-xl font-bold text-slate-900">
              {initialData ? 'Edit Coursework' : 'Create Coursework'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Define deliverables, OneDrive link, and team parameters</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            ✕
          </button>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-600 font-medium">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Target Course
              </label>
              <select
                value={courseId}
                onChange={(e) => setCourseId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
              >
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.code} - {c.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Submission Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setSubmissionType('individual')}
                  className={`py-2 text-xs font-semibold rounded-xl border transition ${
                    submissionType === 'individual'
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  👤 Individual
                </button>
                <button
                  type="button"
                  onClick={() => setSubmissionType('group')}
                  className={`py-2 text-xs font-semibold rounded-xl border transition ${
                    submissionType === 'group'
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  👥 Group Project
                </button>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Assignment Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Distributed Microservices Architecture"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Description & Objectives
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide assignment expectations, evaluation rubrics, and submission specifications..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Deadline (Date & Time)
              </label>
              <input
                type="text"
                required
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                placeholder="2026-10-15 23:59"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                OneDrive Submission Link
              </label>
              <input
                type="url"
                required
                value={driveLink}
                onChange={(e) => setDriveLink(e.target.value)}
                placeholder="https://onedrive.live.com/..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition shadow-lg shadow-indigo-100 active:scale-95"
            >
              {initialData ? 'Update Coursework' : 'Publish Coursework'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};