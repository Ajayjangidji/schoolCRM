/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  TEACHER MODULE — CENTRALIZED DATA PROVIDER                     ║
 * ║                                                                  ║
 * ║  Same pattern as parent hooks (use-data.ts).                    ║
 * ║  Flip USE_MOCK_DATA to false → implement API calls.             ║
 * ╚══════════════════════════════════════════════════════════════════╝
 */

import * as mock from '@/lib/teacher-mock-data';
import type {
  TeacherProfile,
  ClassSection,
  TeacherTimetablePeriod,
  ClassAttendanceSummary,
  StudentBrief,
  HomeworkAssigned,
  SubmissionToReview,
  ClassPerformance,
  TeacherNotice,
  LeaveRequestToApprove,
  ParentMessage,
  TeacherExam,
  StudentMark,
  StudyMaterial,
  StudentDetail,
  LessonPlan,
  TeacherTask,
} from '@/lib/teacher-mock-data';

const USE_MOCK_DATA = true;

export function getTeacher(): TeacherProfile {
  if (USE_MOCK_DATA) return mock.mockTeacher;
  throw new Error('API not implemented');
}

export function getTeacherClasses(): ClassSection[] {
  if (USE_MOCK_DATA) return mock.mockClasses;
  throw new Error('API not implemented');
}

export function getTeacherTimetable(): TeacherTimetablePeriod[] {
  if (USE_MOCK_DATA) return mock.mockTeacherTimetable;
  throw new Error('API not implemented');
}

export function getClassAttendance(): ClassAttendanceSummary[] {
  if (USE_MOCK_DATA) return mock.mockClassAttendance;
  throw new Error('API not implemented');
}

export function getStudentsBrief(classId?: string): StudentBrief[] {
  if (USE_MOCK_DATA) return mock.mockStudentsBrief;
  throw new Error('API not implemented');
}

export function getHomeworkAssigned(): HomeworkAssigned[] {
  if (USE_MOCK_DATA) return mock.mockHomeworkAssigned;
  throw new Error('API not implemented');
}

export function getSubmissionsToReview(): SubmissionToReview[] {
  if (USE_MOCK_DATA) return mock.mockSubmissions;
  throw new Error('API not implemented');
}

export function getClassPerformance(): ClassPerformance[] {
  if (USE_MOCK_DATA) return mock.mockClassPerformance;
  throw new Error('API not implemented');
}

export function getTeacherNotices(): TeacherNotice[] {
  if (USE_MOCK_DATA) return mock.mockTeacherNotices;
  throw new Error('API not implemented');
}

export function getLeaveToApprove(): LeaveRequestToApprove[] {
  if (USE_MOCK_DATA) return mock.mockLeaveToApprove;
  throw new Error('API not implemented');
}

export function getParentMessages(): ParentMessage[] {
  if (USE_MOCK_DATA) return mock.mockParentMessages;
  throw new Error('API not implemented');
}

export function getTeacherExams(): TeacherExam[] {
  if (USE_MOCK_DATA) return mock.mockTeacherExams;
  throw new Error('API not implemented');
}

export function getStudentMarks(): StudentMark[] {
  if (USE_MOCK_DATA) return mock.mockStudentMarks;
  throw new Error('API not implemented');
}

export function getStudyMaterials(): StudyMaterial[] {
  if (USE_MOCK_DATA) return mock.mockStudyMaterials;
  throw new Error('API not implemented');
}

export function getStudentDetails(): StudentDetail[] {
  if (USE_MOCK_DATA) return mock.mockStudentDetails;
  throw new Error('API not implemented');
}

export function getLessonPlans(): LessonPlan[] {
  if (USE_MOCK_DATA) return mock.mockLessonPlans;
  throw new Error('API not implemented');
}

export function getTeacherTasks(): TeacherTask[] {
  if (USE_MOCK_DATA) return mock.mockTeacherTasks;
  throw new Error('API not implemented');
}

export type {
  TeacherProfile,
  ClassSection,
  TeacherTimetablePeriod,
  ClassAttendanceSummary,
  StudentBrief,
  HomeworkAssigned,
  SubmissionToReview,
  ClassPerformance,
  TeacherNotice,
  LeaveRequestToApprove,
  ParentMessage,
  TeacherExam,
  StudentMark,
  StudyMaterial,
  StudentDetail,
  LessonPlan,
  TeacherTask,
};
