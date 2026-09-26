import React from 'react';
import type { Assignment, StudentProgressItem } from '../types';
import { ProgressBar } from './ProgressBar';

interface AssignmentCardProps {
  assignment: Assignment;
  studentRecord?: StudentProgressItem;
  onOpenSubmitModal?: (assignment: Assignment) => void;
}

export const AssignmentCard: React.FC<AssignmentCardProps> = ({
  assignment,
  studentRecord,
  onOpenSubmitModal,
}) => {
  const isSubmitted = !!studentRecord?.submitted;

  // Deadline badge logic (urgency color)
  const isPastDue = new Date(assignment.deadline) < new Date();

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col justify-between overflow-hidden group">
      <div className="p-5">
        {/* Header Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span
            className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-lg ${
              isPastDue ? 'bg-rose-50 text-rose-700 border border-rose-100' : 'bg-slate-100 text-slate-700'
            }`}
          >
            <span>📅</span> Due: {assignment.deadline}
          </span>

          {isSubmitted ? (
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Submitted
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              Pending
            </span>
          )}
        </div>

        {/* Content */}
        <h3 className="font-bold text-slate-900 text-base group-hover:text-indigo-600 transition-colors">
          {assignment.title}
        </h3>
        <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
          {assignment.description}
        </p>

        {/* Submitted Meta details */}
        {isSubmitted && studentRecord?.submittedAt && (
          <div className="mt-3.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 text-[11px] text-slate-600 space-y-1">
            <p className="flex items-center gap-1 text-slate-700">
              <span className="font-semibold text-slate-900">Submitted:</span> {studentRecord.submittedAt}
            </p>
            {studentRecord.note && (
              <p className="truncate text-slate-500">
                <span className="font-semibold text-slate-700">Attachment:</span> {studentRecord.note}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Footer Actions & Progress */}
      <div className="p-5 pt-0">
        <div className="mb-4">
          <ProgressBar
            progress={isSubmitted ? 100 : 0}
            size="sm"
            color={isSubmitted ? 'emerald' : 'indigo'}
            showLabel
          />
        </div>

        <div className="flex items-center gap-2">
          <a
            href={assignment.driveLink}
            target="_blank"
            rel="noreferrer"
            className="flex-1 text-center py-2 px-3 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 hover:text-slate-900 rounded-xl transition"
          >
            Drive Material ↗
          </a>

          {!isSubmitted && onOpenSubmitModal && (
            <button
              type="button"
              onClick={() => onOpenSubmitModal(assignment)}
              className="flex-1 py-2 px-3 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition shadow-sm active:scale-[0.98]"
            >
              Mark as Submitted
            </button>
          )}
        </div>
      </div>
    </div>
  );
};