import React, { useState } from 'react';
import type { User, Assignment, Course } from '../types';
import { ConfirmationModal } from '../components/ConfirmationModal';
import { ProgressBar } from '../components/ProgressBar';

interface StudentDashboardProps {
  currentUser: User;
  courses: Course[];
  assignments: Assignment[];
  onUpdateAssignment: (updatedAssignments: Assignment[]) => void;
  activeFilter?: string;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  currentUser,
  courses,
  assignments,
  onUpdateAssignment,
  activeFilter = 'all',
}) => {
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  // Student ke enrolled courses
  const enrolledCourses = courses.filter((c) => c.studentIds.includes(currentUser.id));
  const activeCourse = courses.find((c) => c.id === selectedCourseId);

  // Course-wise base assignments
  const courseBaseAssignments = selectedCourseId
    ? assignments.filter((a) => a.courseId === selectedCourseId)
    : assignments.filter((a) => enrolledCourses.some((c) => c.id === a.courseId));

  // Helper: Assignment status check
  const checkIsCompleted = (asg: Assignment): boolean => {
    if (asg.submissionType === 'group') {
      const myGroup = asg.groups?.find((g) => g.memberIds.includes(currentUser.id));
      return !!myGroup?.submitted;
    }
    const myRecord = asg.students.find((s) => s.studentId === currentUser.id);
    return !!myRecord?.submitted;
  };

  // Metrics
  const totalTasks = courseBaseAssignments.length;
  const completedTasks = courseBaseAssignments.filter(checkIsCompleted).length;
  const progressPercent = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  // Sidebar Filter Logic ('all' | 'pending' | 'completed')
  const visibleAssignments = courseBaseAssignments.filter((asg) => {
    const isCompleted = checkIsCompleted(asg);
    if (activeFilter === 'pending') return !isCompleted;
    if (activeFilter === 'completed') return isCompleted;
    return true;
  });

  const showToast = (msg: string) => {
    setFeedbackToast(msg);
    setTimeout(() => setFeedbackToast(null), 3500);
  };

  const handleConfirmSubmission = (data: { fileOrUrl: string; note: string }) => {
    if (!selectedAssignment) return;

    const now = new Date();
    const formattedTimestamp = `${now.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })} at ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    const nextAssignments = assignments.map((asg) => {
      if (asg.id !== selectedAssignment.id) return asg;

      // Group Submission Logic: Update group and members
      if (asg.submissionType === 'group') {
        const myGroup = asg.groups?.find((g) => g.memberIds.includes(currentUser.id));
        if (!myGroup) return asg;

        const updatedGroups = asg.groups?.map((grp) => {
          if (grp.id === myGroup.id) {
            return {
              ...grp,
              submitted: true,
              submittedAt: formattedTimestamp,
              submissionNote: `${data.fileOrUrl}${data.note ? ` | Note: ${data.note}` : ''}`,
            };
          }
          return grp;
        });

        const updatedStudents = asg.students.map((stu) => {
          if (myGroup.memberIds.includes(stu.studentId)) {
            return {
              ...stu,
              submitted: true,
              submittedAt: formattedTimestamp,
              note: `Group [${myGroup.name}] Submission by Leader ${currentUser.name}`,
            };
          }
          return stu;
        });

        return { ...asg, groups: updatedGroups, students: updatedStudents };
      }

      // Individual Submission
      const updatedStudents = asg.students.map((stu) => {
        if (stu.studentId === currentUser.id) {
          return {
            ...stu,
            submitted: true,
            submittedAt: formattedTimestamp,
            note: `${data.fileOrUrl}${data.note ? ` | Note: ${data.note}` : ''}`,
          };
        }
        return stu;
      });

      return { ...asg, students: updatedStudents };
    });

    onUpdateAssignment(nextAssignments);
    setSelectedAssignment(null);
    showToast('✓ Submission acknowledged and logged successfully!');
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {feedbackToast && (
        <div className="fixed top-5 right-5 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 text-xs font-semibold animate-bounce">
          <span>{feedbackToast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Academic Workspace 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Logged in as <span className="font-semibold text-slate-800">{currentUser.name}</span> • Semester 5
          </p>
        </div>

        {selectedCourseId && (
          <button
            onClick={() => setSelectedCourseId(null)}
            className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition shadow-sm"
          >
            ← Back to All Courses
          </button>
        )}
      </div>

      {/* Hero Overview */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-700 via-indigo-600 to-blue-700 p-6 sm:p-8 text-white shadow-xl shadow-indigo-100">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-[11px] font-bold tracking-wider uppercase bg-white/20 px-3 py-1 rounded-full text-indigo-100 inline-block">
              {activeCourse ? activeCourse.code : 'All Enrolled Courses'}
            </span>
            <h2 className="text-xl sm:text-2xl font-bold">
              {activeCourse ? activeCourse.title : 'Overall Coursework Progress'}
            </h2>
            <p className="text-xs text-indigo-100 max-w-md">
              {completedTasks} of {totalTasks} deliverables completed.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-5 w-full sm:w-64 border border-white/20">
            <div className="flex justify-between items-center text-xs font-semibold text-indigo-100 mb-2">
              <span>Semester Metric</span>
              <span className="text-white text-base font-bold">{progressPercent}%</span>
            </div>
            <ProgressBar progress={progressPercent} size="md" color="emerald" />
          </div>
        </div>
      </div>

      {/* Course List */}
      {!selectedCourseId && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">Enrolled Courses ({enrolledCourses.length})</h3>
            <span className="text-xs text-slate-400">Click a course to view assignments</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {enrolledCourses.map((crs) => {
              const courseAsgs = assignments.filter((a) => a.courseId === crs.id);
              const courseSubmissions = courseAsgs.filter(checkIsCompleted).length;
              const crsProgress = courseAsgs.length === 0 ? 0 : Math.round((courseSubmissions / courseAsgs.length) * 100);

              return (
                <div
                  key={crs.id}
                  onClick={() => setSelectedCourseId(crs.id)}
                  className="group bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm hover:shadow-md hover:border-indigo-400 transition cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700">
                        {crs.code}
                      </span>
                      <span className="text-xs text-slate-400">{crs.semester}</span>
                    </div>

                    <h4 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition">
                      {crs.title}
                    </h4>
                    <p className="text-xs text-slate-500 mt-1">
                      {courseAsgs.length} Coursework Assignments Assigned
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100">
                    <ProgressBar progress={crsProgress} size="sm" color="indigo" showLabel />
                    <span className="mt-3 inline-block text-xs font-semibold text-indigo-600 group-hover:underline">
                      Open Assignments →
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Assignment List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900">
            {selectedCourseId ? `${activeCourse?.code} Coursework` : 'All Course Deliverables'}
          </h3>
          <span className="text-xs text-slate-400">
            Filter: <span className="font-semibold uppercase text-slate-700">{activeFilter}</span> ({visibleAssignments.length})
          </span>
        </div>

        {visibleAssignments.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center border border-slate-200 shadow-sm">
            <p className="text-sm text-slate-500 font-medium">
              {activeFilter === 'completed'
                ? 'No completed assignments yet.'
                : activeFilter === 'pending'
                ? 'All caught up! No pending assignments.'
                : 'No assignments found.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {visibleAssignments.map((asg) => {
              const isGroup = asg.submissionType === 'group';
              const myGroup = isGroup
                ? asg.groups?.find((g) => g.memberIds.includes(currentUser.id))
                : undefined;
              const isLeader = myGroup?.leaderId === currentUser.id;

              let isAcknowledged = false;
              let acknowledgmentTimestamp = '';
              let acknowledgmentNote = '';

              if (isGroup) {
                if (myGroup) {
                  isAcknowledged = !!myGroup.submitted;
                  acknowledgmentTimestamp = myGroup.submittedAt || '';
                  acknowledgmentNote = myGroup.submissionNote || '';
                }
              } else {
                const myRecord = asg.students.find((s) => s.studentId === currentUser.id);
                isAcknowledged = !!myRecord?.submitted;
                acknowledgmentTimestamp = myRecord?.submittedAt || '';
                acknowledgmentNote = myRecord?.note || '';
              }

              return (
                <div
                  key={asg.id}
                  className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between overflow-hidden"
                >
                  <div className="p-5">
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700">
                        {isGroup ? '👥 Group Project' : '👤 Individual'}
                      </span>

                      {isAcknowledged ? (
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          Acknowledged
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                          Pending Submission
                        </span>
                      )}
                    </div>

                    <h4 className="font-bold text-slate-900 text-base">{asg.title}</h4>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{asg.description}</p>

                    <div className="mt-3.5 space-y-1 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <p className="flex items-center gap-1 text-[11px]">
                        <span className="font-semibold text-slate-800">Deadline:</span> {asg.deadline}
                      </p>
                      {isGroup && (
                        <p className="flex items-center gap-1 text-[11px]">
                          <span className="font-semibold text-slate-800">Team:</span>{' '}
                          {myGroup ? (
                            <span className="text-indigo-600 font-medium">
                              {myGroup.name} {isLeader ? '(You are Leader)' : '(Member)'}
                            </span>
                          ) : (
                            <span className="text-rose-600 font-semibold">Unassigned</span>
                          )}
                        </p>
                      )}
                      {isAcknowledged && acknowledgmentTimestamp && (
                        <p className="text-[11px] text-emerald-700 font-medium pt-1 border-t border-slate-200">
                          Acknowledged on: {acknowledgmentTimestamp}
                        </p>
                      )}
                      {acknowledgmentNote && (
                        <p className="text-[11px] text-slate-500 truncate">{acknowledgmentNote}</p>
                      )}
                    </div>

                    {isGroup && !myGroup && (
                      <div className="mt-3 p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 font-medium flex items-start gap-2">
                        <span>⚠️</span>
                        <span>You are not part of any group. Form or join one to submit this assignment.</span>
                      </div>
                    )}
                  </div>

                  <div className="p-5 pt-0">
                    <div className="mb-4">
                      <ProgressBar
                        progress={isAcknowledged ? 100 : 0}
                        size="sm"
                        color={isAcknowledged ? 'emerald' : 'indigo'}
                        showLabel
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={asg.driveLink}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 text-center py-2 px-3 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
                      >
                        OneDrive Folder ↗
                      </a>

                      {!isAcknowledged && (
                        <>
                          {isGroup ? (
                            isLeader ? (
                              <button
                                type="button"
                                onClick={() => setSelectedAssignment(asg)}
                                className="flex-1 py-2 px-3 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition shadow-sm active:scale-95"
                              >
                                Submit (Leader)
                              </button>
                            ) : myGroup ? (
                              <button
                                disabled
                                className="flex-1 py-2 px-3 text-xs font-semibold text-slate-400 bg-slate-100 rounded-xl cursor-not-allowed"
                              >
                                Leader Only
                              </button>
                            ) : null
                          ) : (
                            <button
                              type="button"
                              onClick={() => setSelectedAssignment(asg)}
                              className="flex-1 py-2 px-3 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition shadow-sm active:scale-95"
                            >
                              Yes, I Submitted
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
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