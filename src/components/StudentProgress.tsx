import React from 'react';
import type { StudentProgressItem } from '../types';
import { ProgressBar } from './ProgressBar';

interface StudentProgressProps {
  student: StudentProgressItem;
  assignmentId: string;
  onToggleStatus: (assignmentId: string, studentId: string) => void;
}

export const StudentProgress: React.FC<StudentProgressProps> = ({
  student,
  assignmentId,
  onToggleStatus,
}) => {
  return (
    <div className="py-3.5 px-4 hover:bg-slate-50/70 rounded-xl transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-transparent hover:border-slate-200">
      <div className="flex items-start gap-3 min-w-0">
        <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
          {student.studentName.charAt(0)}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-slate-900 text-sm">{student.studentName}</span>
            {student.submitted ? (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
                Submitted
              </span>
            ) : (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 font-medium">
                Not Submitted
              </span>
            )}
          </div>

          {student.submitted && student.submittedAt && (
            <p className="text-[11px] text-slate-500 mt-0.5">
              Recorded at: <span className="font-medium text-slate-700">{student.submittedAt}</span>
            </p>
          )}

          {student.note && (
            <p className="text-[11px] text-indigo-600 mt-0.5 truncate max-w-sm sm:max-w-md">
              Data: {student.note}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
        <div className="w-24">
          <ProgressBar progress={student.submitted ? 100 : 0} size="sm" color={student.submitted ? 'emerald' : 'indigo'} />
        </div>
        <span className="text-xs font-semibold text-slate-700 w-9 text-right">
          {student.submitted ? '100%' : '0%'}
        </span>

        <button
          type="button"
          onClick={() => onToggleStatus(assignmentId, student.studentId)}
          className="text-xs px-2.5 py-1 rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 text-slate-600 hover:text-indigo-600 font-medium transition"
        >
          Toggle
        </button>
      </div>
    </div>
  );
};