import React, { useState } from 'react';
import type { User, Assignment } from '../types';
import { ConfirmationModal } from '../components/ConfirmationModal';
import { AssignmentCard } from '../components/AssignmentCard';
import { ProgressBar } from '../components/ProgressBar';

interface StudentDashboardProps {
  currentUser: User;
  assignments: Assignment[];
  onUpdateAssignment: (updatedAssignments: Assignment[]) => void;
  activeFilter?: string;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  currentUser,
  assignments,
  onUpdateAssignment,
  activeFilter = 'all',
}) => {
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);

  const myAssignments = assignments.filter((asg) =>
    asg.students.some((s) => s.studentId === currentUser.id)
  );

  const completedCount = myAssignments.filter((asg) => {
    const studentRecord = asg.students.find((s) => s.studentId === currentUser.id);
    return studentRecord?.submitted;
  }).length;

  const totalCount = myAssignments.length;
  const progressPercentage = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  // Filter based on sidebar selection
  const filteredAssignments = myAssignments.filter((asg) => {
    const studentRecord = asg.students.find((s) => s.studentId === currentUser.id);
    if (activeFilter === 'pending') return !studentRecord?.submitted;
    if (activeFilter === 'completed') return studentRecord?.submitted;
    return true;
  });

  const handleConfirmSubmission = (data: { fileOrUrl: string; note: string }) => {
    if (!selectedAssignment) return;

    const now = new Date();
    const formattedDate = `${now.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })} at ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    const nextAssignments = assignments.map((asg) => {
      if (asg.id !== selectedAssignment.id) return asg;

      const updatedStudents = asg.students.map((stu) => {
        if (stu.studentId === currentUser.id) {
          return {
            ...stu,
            submitted: true,
            submittedAt: formattedDate,
            note: `${data.fileOrUrl}${data.note ? ` | Note: ${data.note}` : ''}`,
          };
        }
        return stu;
      });

      return { ...asg, students: updatedStudents };
    });

    onUpdateAssignment(nextAssignments);
    setSelectedAssignment(null);
  };

  return (
    <div className="space-y-6">
      {/* Greeting Banner */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Good morning, {currentUser.name} 👋</h1>
        <p className="text-sm text-slate-500 mt-0.5">Keep track of your academic deadlines and submissions</p>
      </div>

      {/* Overall Progress Widget with Reusable ProgressBar */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-slate-800">Your Progress</span>
          <span className="text-sm font-bold text-indigo-600">{progressPercentage}%</span>
        </div>
        <ProgressBar progress={progressPercentage} size="lg" color="indigo" />
        <p className="text-xs text-slate-500 mt-2">
          {completedCount} of {totalCount} assignments completed
        </p>
      </div>

      {/* Assignment List using Modular AssignmentCard */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900">My Assignments</h2>
          <span className="text-xs text-slate-500">Showing: {filteredAssignments.length} item(s)</span>
        </div>

        {filteredAssignments.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center border border-slate-200">
            <p className="text-sm text-slate-500 font-medium">No assignments match your filter.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {filteredAssignments.map((asg) => {
              const studentRecord = asg.students.find((s) => s.studentId === currentUser.id);
              return (
                <AssignmentCard
                  key={asg.id}
                  assignment={asg}
                  studentRecord={studentRecord}
                  onOpenSubmitModal={(target) => setSelectedAssignment(target)}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!selectedAssignment}
        assignmentTitle={selectedAssignment?.title || ''}
        driveLink={selectedAssignment?.driveLink || ''}
        onClose={() => setSelectedAssignment(null)}
        onConfirm={handleConfirmSubmission}
      />
    </div>
  );
};