import React, { useState } from 'react';
import type { User, Assignment } from '../types';
import { AssignmentModal } from '../components/AssignmentModal';
import { StudentProgress } from '../components/StudentProgress';
import { ProgressBar } from '../components/ProgressBar';

interface AdminDashboardProps {
  currentUser: User;
  assignments: Assignment[];
  allUsers: User[];
  onUpdateAssignments: (assignments: Assignment[]) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentUser,
  assignments,
  allUsers,
  onUpdateAssignments,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);

  // Role isolation: Admin ko sirf apne create kiye hue assignments dikhenge
  const myAssignments = assignments.filter((asg) => asg.createdBy === currentUser.id);
  const studentsList = allUsers.filter((u) => u.role === 'student');

  // Stats calculation
  const totalCreated = myAssignments.length;
  let totalAssignedSlots = 0;
  let totalSubmittedSlots = 0;

  myAssignments.forEach((asg) => {
    totalAssignedSlots += asg.students.length;
    totalSubmittedSlots += asg.students.filter((s) => s.submitted).length;
  });

  const overallSubmissionRate =
    totalAssignedSlots === 0 ? 0 : Math.round((totalSubmittedSlots / totalAssignedSlots) * 100);

  // Handlers
  const handleSaveAssignment = (data: Omit<Assignment, 'id' | 'createdBy'>) => {
    if (editingAssignment) {
      const updated = assignments.map((asg) =>
        asg.id === editingAssignment.id ? { ...asg, ...data } : asg
      );
      onUpdateAssignments(updated);
    } else {
      const newAsg: Assignment = {
        id: `asg-${Date.now()}`,
        createdBy: currentUser.id,
        ...data,
      };
      onUpdateAssignments([newAsg, ...assignments]);
    }
    setEditingAssignment(null);
  };

  const handleDeleteAssignment = (id: string) => {
    if (window.confirm('Are you sure you want to delete this assignment?')) {
      const filtered = assignments.filter((asg) => asg.id !== id);
      onUpdateAssignments(filtered);
    }
  };

  const handleToggleStudentStatus = (assignmentId: string, studentId: string) => {
    const updated = assignments.map((asg) => {
      if (asg.id !== assignmentId) return asg;
      const updatedStudents = asg.students.map((stu) => {
        if (stu.studentId === studentId) {
          const nextStatus = !stu.submitted;
          return {
            ...stu,
            submitted: nextStatus,
            submittedAt: nextStatus
              ? new Date().toLocaleDateString('en-GB') + ' (Verified by Instructor)'
              : undefined,
          };
        }
        return stu;
      });
      return { ...asg, students: updatedStudents };
    });
    onUpdateAssignments(updated);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Professor Dashboard</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Welcome back, {currentUser.name}. Coursework aur student progress monitor karein.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setEditingAssignment(null);
            setIsModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition shadow-sm self-start sm:self-auto active:scale-95"
        >
          <span>+ Create Assignment</span>
        </button>
      </div>

      {/* Analytics Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
            Active Assignments
          </span>
          <p className="text-2xl font-bold text-slate-900">{totalCreated}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
            Enrolled Students
          </span>
          <p className="text-2xl font-bold text-slate-900">{studentsList.length}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
            Overall Submission Rate
          </span>
          <p className="text-2xl font-bold text-indigo-600">
            {overallSubmissionRate}%{' '}
            <span className="text-xs font-normal text-slate-500">
              ({totalSubmittedSlots}/{totalAssignedSlots})
            </span>
          </p>
        </div>
      </div>

      {/* Course Assignments List */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900">Course Assignments ({totalCreated})</h2>

        {myAssignments.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center border border-slate-200 shadow-sm">
            <p className="text-sm text-slate-500">Aapne abhi tak koi assignment create nahi kiya hai.</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-3 text-xs font-semibold text-indigo-600 hover:underline"
            >
              + Create your first assignment
            </button>
          </div>
        ) : (
          myAssignments.map((asg) => {
            const submittedCount = asg.students.filter((s) => s.submitted).length;
            const rate =
              asg.students.length === 0
                ? 0
                : Math.round((submittedCount / asg.students.length) * 100);

            return (
              <div
                key={asg.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden"
              >
                {/* Assignment Info Header */}
                <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/60">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-slate-900 text-base">{asg.title}</h3>
                      <span className="text-xs px-2.5 py-0.5 rounded-lg bg-slate-200/80 text-slate-700 font-semibold">
                        Due: {asg.deadline}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-1">{asg.description}</p>
                    <a
                      href={asg.driveLink}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-indigo-600 font-medium hover:underline inline-flex items-center gap-1 mt-0.5"
                    >
                      Folder Material ↗
                    </a>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingAssignment(asg);
                        setIsModalOpen(true);
                      }}
                      className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition shadow-sm"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteAssignment(asg.id)}
                      className="px-3.5 py-1.5 text-xs font-semibold text-red-600 bg-white border border-red-200 hover:bg-red-50 rounded-xl transition shadow-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {/* Assignment Level Progress Indicator */}
                <div className="px-5 py-3 bg-white border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <span className="font-semibold text-slate-700">
                    Student Submissions ({submittedCount} of {asg.students.length} completed)
                  </span>
                  <div className="flex items-center gap-3 w-full sm:w-48">
                    <div className="flex-1">
                      <ProgressBar
                        progress={rate}
                        size="sm"
                        color={rate === 100 ? 'emerald' : 'indigo'}
                      />
                    </div>
                    <span className="font-bold text-indigo-600 w-8 text-right">{rate}%</span>
                  </div>
                </div>

                {/* Modular Student Progress Rows */}
                <div className="p-3 divide-y divide-slate-100">
                  {asg.students.length === 0 ? (
                    <p className="text-xs text-slate-400 p-3">No students assigned to this task.</p>
                  ) : (
                    asg.students.map((stu) => (
                      <StudentProgress
                        key={stu.studentId}
                        student={stu}
                        assignmentId={asg.id}
                        onToggleStatus={handleToggleStudentStatus}
                      />
                    ))
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Assignment Modal */}
      <AssignmentModal
        key={editingAssignment?.id || 'new'}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingAssignment(null);
        }}
        onSubmit={handleSaveAssignment}
        studentsList={studentsList}
        initialData={editingAssignment}
      />
    </div>
  );
};