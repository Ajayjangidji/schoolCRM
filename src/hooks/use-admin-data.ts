import {
  mockSchoolStats,
  mockClassWiseData,
  mockRecentActivities,
  mockFeeOverview,
  mockEnrollmentTrend,
  mockAdminStudents,
  mockAdminTeachers,
  mockAdminClasses,
  mockFeeRecords,
  mockFeeStructure,
  mockExams,
  mockExamResults,
  mockAcademicCalendar,
  mockAdminNotices,
  mockMonthlyAttendance,
  mockSubjectPerformance,
  mockClassPerformanceTrend,
  mockDocuments,
  mockRoles,
  mockClassAttendance,
  mockInventory,
  mockMessages,
  mockAIInsights,
  mockSchoolSettings,
} from '@/lib/admin-mock-data';

import type {
  SchoolStats,
  ClassWiseData,
  RecentActivity,
  FeeOverview,
  EnrollmentTrend,
  AdminStudent,
  AdminTeacher,
  AdminClass,
  FeeRecord,
  FeeStructure,
  Exam,
  ExamResult,
  AcademicCalendarEvent,
  AdminNotice,
  MonthlyAttendance,
  SubjectPerformance,
  ClassPerformanceTrend,
  SchoolDocument,
  Permission,
  Role,
  ClassAttendance,
  InventoryItem,
  Message,
  AIInsight,
  SchoolSetting,
} from '@/lib/admin-mock-data';

export type { SchoolStats, ClassWiseData, RecentActivity, FeeOverview, EnrollmentTrend, AdminStudent, AdminTeacher, AdminClass, FeeRecord, FeeStructure, Exam, ExamResult, AcademicCalendarEvent, AdminNotice, MonthlyAttendance, SubjectPerformance, ClassPerformanceTrend, SchoolDocument, Permission, Role, ClassAttendance, InventoryItem, Message, AIInsight, SchoolSetting };

const USE_MOCK_DATA = true;

export function getSchoolStats(): SchoolStats {
  if (USE_MOCK_DATA) return mockSchoolStats;
  throw new Error('API not implemented');
}

export function getClassWiseData(): ClassWiseData[] {
  if (USE_MOCK_DATA) return mockClassWiseData;
  throw new Error('API not implemented');
}

export function getRecentActivities(): RecentActivity[] {
  if (USE_MOCK_DATA) return mockRecentActivities;
  throw new Error('API not implemented');
}

export function getFeeOverview(): FeeOverview[] {
  if (USE_MOCK_DATA) return mockFeeOverview;
  throw new Error('API not implemented');
}

export function getEnrollmentTrend(): EnrollmentTrend[] {
  if (USE_MOCK_DATA) return mockEnrollmentTrend;
  throw new Error('API not implemented');
}

export function getAdminStudents(): AdminStudent[] {
  if (USE_MOCK_DATA) return mockAdminStudents;
  throw new Error('API not implemented');
}

export function getAdminTeachers(): AdminTeacher[] {
  if (USE_MOCK_DATA) return mockAdminTeachers;
  throw new Error('API not implemented');
}

export function getAdminClasses(): AdminClass[] {
  if (USE_MOCK_DATA) return mockAdminClasses;
  throw new Error('API not implemented');
}

export function getFeeRecords(): FeeRecord[] {
  if (USE_MOCK_DATA) return mockFeeRecords;
  throw new Error('API not implemented');
}

export function getFeeStructure(): FeeStructure[] {
  if (USE_MOCK_DATA) return mockFeeStructure;
  throw new Error('API not implemented');
}

export function getExams(): Exam[] {
  if (USE_MOCK_DATA) return mockExams;
  throw new Error('API not implemented');
}

export function getExamResults(): ExamResult[] {
  if (USE_MOCK_DATA) return mockExamResults;
  throw new Error('API not implemented');
}

export function getAcademicCalendar(): AcademicCalendarEvent[] {
  if (USE_MOCK_DATA) return mockAcademicCalendar;
  throw new Error('API not implemented');
}

export function getAdminNotices(): AdminNotice[] {
  if (USE_MOCK_DATA) return mockAdminNotices;
  throw new Error('API not implemented');
}

export function getMonthlyAttendance(): MonthlyAttendance[] {
  if (USE_MOCK_DATA) return mockMonthlyAttendance;
  throw new Error('API not implemented');
}

export function getSubjectPerformance(): SubjectPerformance[] {
  if (USE_MOCK_DATA) return mockSubjectPerformance;
  throw new Error('API not implemented');
}

export function getClassPerformanceTrend(): ClassPerformanceTrend[] {
  if (USE_MOCK_DATA) return mockClassPerformanceTrend;
  throw new Error('API not implemented');
}

export function getClassAttendance(): ClassAttendance[] {
  if (USE_MOCK_DATA) return mockClassAttendance;
  throw new Error('API not implemented');
}

export function getDocuments(): SchoolDocument[] {
  if (USE_MOCK_DATA) return mockDocuments;
  throw new Error('API not implemented');
}

export function getRoles(): Role[] {
  if (USE_MOCK_DATA) return mockRoles;
  throw new Error('API not implemented');
}

export function getInventory(): InventoryItem[] {
  if (USE_MOCK_DATA) return mockInventory;
  throw new Error('API not implemented');
}

export function getMessages(): Message[] {
  if (USE_MOCK_DATA) return mockMessages;
  throw new Error('API not implemented');
}

export function getAIInsights(): AIInsight[] {
  if (USE_MOCK_DATA) return mockAIInsights;
  throw new Error('API not implemented');
}

export function getSchoolSettings(): SchoolSetting[] {
  if (USE_MOCK_DATA) return mockSchoolSettings;
  throw new Error('API not implemented');
}

export function getAdmin() {
  if (USE_MOCK_DATA) {
    return {
      name: 'Dr. Vikram Rathore',
      role: 'Super Admin',
      email: 'admin@schoolai.in',
      school: 'SchoolAI International Academy',
    };
  }
  throw new Error('API not implemented');
}
