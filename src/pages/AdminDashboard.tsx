import React, { useState } from 'react';
import type { User, Assignment, Course } from '../types';
import { AssignmentModal } from '../components/AssignmentModal';
import { CourseModal } from '../components/CourseModal';
import { ProgressBar } from '../components/ProgressBar';

interface AdminDashboardProps {
  currentUser: User;
  courses: Course[];
  assignments: Assignment[];
  allUsers: User[];
  onUpdateAssignments: (assignments: Assignment[]) => void;
  onUpdateCourses: (courses: Course[]) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentUser,
  courses,
  assignments,
  allUsers,
  onUpdateAssignments,
  onUpdateCourses,
}) => {
  const [selectedCourseFilter, setSelectedCourseFilter] = useState<string>('all');
  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);

  // Professor ke mapped courses (agar koi naya registered admin hai toh wo courses claim ya add kar sake)
  const myCourses = courses.filter((c) => c.instructorId === currentUser.id);
  const studentsList = allUsers.filter((u) => u.role === 'student');

  const myAssignments = assignments.filter((asg) => asg.createdBy === currentUser.id);
  const displayedAssignments =
    selectedCourseFilter === 'all'
      ? myAssignments
      : myAssignments.filter((a) => a.courseId === selectedCourseFilter);

  // Quick Action: Link unassigned template courses to this new instructor
  const handleClaimTemplateCourses = () => {
    const updatedCourses = courses.map((crs) => ({
      ...crs,
      instructorId: currentUser.id,
    }));
    onUpdateCourses(updatedCourses);
  };

  const handleAddCourse = (newCourse: Course) => {
    const nextCourses = [newCourse, ...courses];
    onUpdateCourses(nextCourses);
  };

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
    if (window.confirm('Are you sure you want to delete this coursework assignment?')) {
      const filtered = assignments.filter((asg) => asg.id !== id);
      onUpdateAssignments(filtered);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Instructor Control Portal 👨‍🏫
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Welcome, {currentUser.name}. Orchestrate courses, deliverables, and submissions.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={() => setIsCourseModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 font-semibold text-xs sm:text-sm transition shadow-sm"
          >
            <span>+ Add Course</span>
          </button>

          <button
            type="button"
            disabled={myCourses.length === 0}
            onClick={() => {
              setEditingAssignment(null);
              setIsAssignmentModalOpen(true);
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed text-white font-semibold text-xs sm:text-sm transition shadow-lg shadow-indigo-100 active:scale-95"
          >
            <span>+ Create Assignment</span>
          </button>
        </div>
      </div>

      {/* Analytics Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
            Courses Taught
          </span>
          <p className="text-2xl font-bold text-slate-900">{myCourses.length}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
            Active Deliverables
          </span>
          <p className="text-2xl font-bold text-slate-900">{myAssignments.length}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
            Enrolled Students
          </span>
          <p className="text-2xl font-bold text-indigo-600">{studentsList.length}</p>
        </div>
      </div>

      {/* Zero Courses Warning Banner for New Instructors */}
      {myCourses.length === 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-3xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-amber-900 flex items-center gap-2">
              <span>⚠️</span> No courses assigned to your instructor profile yet
            </h4>
            <p className="text-xs text-amber-700">
              Create a custom course (e.g. CS401) or claim default semester courses to start publishing assignments.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleClaimTemplateCourses}
              className="px-3.5 py-2 text-xs font-semibold text-amber-800 bg-amber-100 hover:bg-amber-200 rounded-xl transition"
            >
              Claim Default Courses
            </button>
            <button
              onClick={() => setIsCourseModalOpen(true)}
              className="px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition shadow-sm"
            >
              + Add New Course
            </button>
          </div>
        </div>
      )}

      {/* Filter and Course Selection */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 uppercase">Filter Course:</span>
          <select
            value={selectedCourseFilter}
            onChange={(e) => setSelectedCourseFilter(e.target.value)}
            className="px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Courses ({myAssignments.length})</option>
            {myCourses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.code} - {c.title}
              </option>
            ))}
          </select>
        </div>

        <span className="text-xs text-slate-400">
          Showing {displayedAssignments.length} assignment item(s)
        </span>
      </div>

      {/* Assignments List */}
      <div className="space-y-4">
        {displayedAssignments.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center border border-slate-200 shadow-sm">
            <p className="text-sm text-slate-500 font-medium">No coursework assignments found.</p>
            {myCourses.length > 0 && (
              <button
                onClick={() => setIsAssignmentModalOpen(true)}
                className="mt-3 text-xs font-semibold text-indigo-600 hover:underline"
              >
                + Create an assignment now
              </button>
            )}
          </div>
        ) : (
          displayedAssignments.map((asg) => {
            const courseRef = courses.find((c) => c.id === asg.courseId);
            const isGroup = asg.submissionType === 'group';
            const submittedCount = isGroup
              ? asg.groups?.filter((g) => g.submitted).length || 0
              : asg.students.filter((s) => s.submitted).length;

            const totalSlots = isGroup ? asg.groups?.length || 0 : asg.students.length;
            const completionRate =
              totalSlots === 0 ? 0 : Math.round((submittedCount / totalSlots) * 100);

            return (
              <div
                key={asg.id}
                className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden"
              >
                <div className="p-5 sm:p-6 bg-slate-50/70 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-lg bg-indigo-50 text-indigo-700">
                        {courseRef ? courseRef.code : 'COURSE'}
                      </span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-200 text-slate-700">
                        {isGroup ? '👥 Group Submission' : '👤 Individual Submission'}
                      </span>
                      <span className="text-xs text-slate-500">Due: {asg.deadline}</span>
                    </div>

                    <h3 className="font-bold text-slate-900 text-lg">{asg.title}</h3>
                    <p className="text-xs text-slate-500 line-clamp-1">{asg.description}</p>

                    <a
                      href={asg.driveLink}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-indigo-600 font-semibold hover:underline inline-flex items-center gap-1"
                    >
                      OneDrive Material Folder ↗
                    </a>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingAssignment(asg);
                        setIsAssignmentModalOpen(true);
                      }}
                      className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition shadow-sm"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteAssignment(asg.id)}
                      className="px-3.5 py-1.5 text-xs font-semibold text-rose-600 bg-white border border-rose-200 hover:bg-rose-50 rounded-xl transition shadow-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <div className="px-6 py-3 bg-white border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <span className="font-semibold text-slate-700">
                    Status ({submittedCount} of {totalSlots} {isGroup ? 'groups' : 'students'} acknowledged)
                  </span>
                  <div className="flex items-center gap-3 w-full sm:w-48">
                    <div className="flex-1">
                      <ProgressBar
                        progress={completionRate}
                        size="sm"
                        color={completionRate === 100 ? 'emerald' : 'indigo'}
                      />
                    </div>
                    <span className="font-bold text-indigo-600">{completionRate}%</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Assignment Modal */}
      <AssignmentModal
        key={editingAssignment?.id || 'new'}
        isOpen={isAssignmentModalOpen}
        onClose={() => {
          setIsAssignmentModalOpen(false);
          setEditingAssignment(null);
        }}
        onSubmit={handleSaveAssignment}
        studentsList={studentsList}
        courses={myCourses}
        initialData={editingAssignment}
      />

      {/* Course Modal */}
      <CourseModal
        isOpen={isCourseModalOpen}
        onClose={() => setIsCourseModalOpen(false)}
        onSubmit={handleAddCourse}
        instructorId={currentUser.id}
        studentsList={studentsList}
      />
    </div>
  );
};