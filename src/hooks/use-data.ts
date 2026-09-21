/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  CENTRALIZED DATA PROVIDER HOOKS                                ║
 * ║                                                                  ║
 * ║  TO SWITCH FROM MOCK TO REAL API:                               ║
 * ║  1. Set USE_MOCK_DATA = false below                             ║
 * ║  2. Implement the API calls in each hook's `else` branch        ║
 * ║  3. That's it — all pages/components auto-update                ║
 * ║                                                                  ║
 * ║  Every page/component uses these hooks instead of importing     ║
 * ║  mock-data directly. This is the ONLY file that imports from    ║
 * ║  mock-data.ts — so mock data removal is a single-file change.  ║
 * ╚══════════════════════════════════════════════════════════════════╝
 */

import * as mock from '@/lib/mock-data';
import type {
  Student,
  Parent,
  AttendanceRecord,
  AttendanceStats,
  Homework,
  ExamResult,
  FeeDetails,
  FeeInstallment,
  Notice,
  LeaveRequest,
  TimetablePeriod,
  DayTimetable,
  ExamScheduleItem,
  TransportInfo,
  ChatThread,
  ChatMessage,
  Document,
  EventAlbum,
  DailySummary,
  Notification,
  EmergencyAlert,
  EmergencyContact,
  AttendanceAlert,
  ExamTrendPoint,
  Holiday,
  BusStop,
  BusTripKey,
  BusLiveState,
  UpcomingEvent,
  MediaItem,
  NotificationPreferences,
  SupportInfo,
} from '@/types';

// ┌──────────────────────────────────────────────────┐
// │  FLIP THIS TO `false` TO USE REAL API DATA       │
// └──────────────────────────────────────────────────┘
const USE_MOCK_DATA = true;

// ── App clock ──

export function getToday(): string {
  if (USE_MOCK_DATA) return mock.MOCK_TODAY;
  return new Date().toISOString().slice(0, 10);
}

export function getCurrentHour(): number {
  if (USE_MOCK_DATA) return mock.MOCK_CURRENT_HOUR;
  return new Date().getHours();
}

// ── Student & Parent ──

export function getStudent(): Student {
  if (USE_MOCK_DATA) return mock.mockStudent;
  // TODO: Replace with API call → GET /api/students/:id
  throw new Error('API not implemented');
}

export function getParent(): Parent {
  if (USE_MOCK_DATA) return mock.mockParent;
  // TODO: Replace with API call → GET /api/parents/:id
  throw new Error('API not implemented');
}

// ── Attendance ──

export function getTodayAttendance(): AttendanceRecord {
  if (USE_MOCK_DATA) return mock.mockTodayAttendance;
  // TODO: Replace with API call → GET /api/attendance/today?studentId=:id
  throw new Error('API not implemented');
}

export function getAttendanceStats(): AttendanceStats {
  if (USE_MOCK_DATA) return mock.mockAttendanceStats;
  // TODO: Replace with API call → GET /api/attendance/stats?studentId=:id
  throw new Error('API not implemented');
}

export function getMonthlyAttendance(month?: string): AttendanceRecord[] {
  if (USE_MOCK_DATA) return mock.mockMonthlyAttendance;
  // TODO: Replace with API call → GET /api/attendance/monthly?studentId=:id&month=:month
  throw new Error('API not implemented');
}

export function getAttendanceCalendarMonths(): string[] {
  if (USE_MOCK_DATA) return Object.keys(mock.mockAttendanceCalendar).sort();
  // TODO: Replace with API call → GET /api/attendance/months?studentId=:id
  throw new Error('API not implemented');
}

export function getAttendanceCalendar(monthKey: string): Record<number, AttendanceRecord['status']> {
  if (USE_MOCK_DATA) return mock.mockAttendanceCalendar[monthKey] || {};
  // TODO: Replace with API call → GET /api/attendance/calendar?studentId=:id&month=:monthKey (YYYY-MM)
  throw new Error('API not implemented');
}

export function getAttendanceAlerts(): AttendanceAlert[] {
  if (USE_MOCK_DATA) return mock.mockAttendanceAlerts;
  // TODO: Replace with API call → GET /api/attendance/alerts?studentId=:id
  throw new Error('API not implemented');
}

// ── Homework ──

export function getHomeworkList(filter?: string): Homework[] {
  if (USE_MOCK_DATA) {
    if (!filter || filter === 'all') return mock.mockHomework;
    return mock.mockHomework.filter((h) => h.status === filter);
  }
  // TODO: Replace with API call → GET /api/homework?studentId=:id&status=:filter
  throw new Error('API not implemented');
}

export function getHomeworkById(id: string): Homework | undefined {
  if (USE_MOCK_DATA) return mock.mockHomework.find((h) => h.id === id);
  // TODO: Replace with API call → GET /api/homework/:id
  throw new Error('API not implemented');
}

// ── Academic ──

export function getExamResult(examId?: string): ExamResult {
  if (USE_MOCK_DATA) return mock.mockExamResult;
  // TODO: Replace with API call → GET /api/exams/results?studentId=:id&examId=:examId
  throw new Error('API not implemented');
}

export function getAllExamResults(): ExamResult[] {
  if (USE_MOCK_DATA) return mock.mockAllExamResults;
  // TODO: Replace with API call → GET /api/exams/results?studentId=:id
  throw new Error('API not implemented');
}

export function getHolidays(): Holiday[] {
  if (USE_MOCK_DATA) return mock.mockHolidays;
  // TODO: Replace with API call → GET /api/calendar/holidays?year=:academicYear
  throw new Error('API not implemented');
}

export function getExamHistory(): ExamTrendPoint[] {
  if (USE_MOCK_DATA) return mock.mockExamHistory;
  // TODO: Replace with API call → GET /api/exams/history?studentId=:id
  throw new Error('API not implemented');
}

// ── Fees ──

export function getFeeDetails(): FeeDetails {
  if (USE_MOCK_DATA) return mock.mockFeeDetails;
  // TODO: Replace with API call → GET /api/fees?studentId=:id
  throw new Error('API not implemented');
}

export function payInstallment(
  installment: FeeInstallment,
  mode: NonNullable<FeeInstallment['paymentMode']>,
): Promise<FeeInstallment> {
  if (USE_MOCK_DATA) return mock.mockPayInstallment(installment, mode);
  // TODO: Replace with payment gateway → POST /api/fees/:installmentId/pay
  throw new Error('API not implemented');
}

// ── Notices ──

export function getNotices(): Notice[] {
  if (USE_MOCK_DATA) return mock.mockNotices;
  // TODO: Replace with API call → GET /api/notices?classId=:classId
  throw new Error('API not implemented');
}

// ── Leave ──

export function getLeaveRequests(): LeaveRequest[] {
  if (USE_MOCK_DATA) return mock.mockLeaveRequests;
  // TODO: Replace with API call → GET /api/leave?studentId=:id
  throw new Error('API not implemented');
}

// ── Timetable ──

export function getTodayTimetable(): TimetablePeriod[] {
  if (USE_MOCK_DATA) return mock.mockTodayTimetable;
  // TODO: Replace with API call → GET /api/timetable/today?classId=:classId
  throw new Error('API not implemented');
}

export function getWeekTimetable(): DayTimetable[] {
  if (USE_MOCK_DATA) return mock.mockWeekTimetable;
  // TODO: Replace with API call → GET /api/timetable/week?classId=:classId
  throw new Error('API not implemented');
}

export function getExamSchedule(): ExamScheduleItem[] {
  if (USE_MOCK_DATA) return mock.mockExamSchedule;
  // TODO: Replace with API call → GET /api/exams/schedule?classId=:classId
  throw new Error('API not implemented');
}

// ── Transport ──

export function getTransportInfo(): TransportInfo {
  if (USE_MOCK_DATA) return mock.mockTransportInfo;
  // TODO: Replace with API call → GET /api/transport?studentId=:id
  throw new Error('API not implemented');
}

export function getTransportOpted(): boolean {
  if (USE_MOCK_DATA) return mock.mockTransportOpted;
  // TODO: Replace with API call → GET /api/transport/enrollment?studentId=:id
  throw new Error('API not implemented');
}

export function getBusStops(): BusStop[] {
  if (USE_MOCK_DATA) return mock.mockBusStops;
  // TODO: Replace with API call → GET /api/transport/route?studentId=:id
  throw new Error('API not implemented');
}

/** Live bus feed. Returns an unsubscribe function. */
export function subscribeBusLocation(
  trip: BusTripKey,
  stopCount: number,
  onUpdate: (state: BusLiveState) => void,
): () => void {
  if (USE_MOCK_DATA) return mock.startMockBusFeed(trip, stopCount, onUpdate);
  // TODO: Replace with WebSocket / SSE → /api/transport/live?studentId=:id&trip=:trip
  throw new Error('API not implemented');
}

// ── Chat ──

export function getChatThreads(): ChatThread[] {
  if (USE_MOCK_DATA) return mock.mockChatThreads;
  // TODO: Replace with API call → GET /api/chat/threads?parentId=:id
  throw new Error('API not implemented');
}

export function getChatMessages(threadId: string): ChatMessage[] {
  if (USE_MOCK_DATA) return mock.mockChatMessages[threadId] || [];
  // TODO: Replace with API call → GET /api/chat/messages?threadId=:threadId
  throw new Error('API not implemented');
}

// ── Documents ──

export function getDocuments(): Document[] {
  if (USE_MOCK_DATA) return mock.mockDocuments;
  // TODO: Replace with API call → GET /api/documents?studentId=:id
  throw new Error('API not implemented');
}

// ── Gallery ──

export function getEventAlbums(): EventAlbum[] {
  if (USE_MOCK_DATA) return mock.mockEventAlbums;
  // TODO: Replace with API call → GET /api/gallery/albums
  throw new Error('API not implemented');
}

export function getAlbumMedia(albumId: string): MediaItem[] {
  if (USE_MOCK_DATA) return mock.mockAlbumMedia[albumId] || [];
  // TODO: Replace with API call → GET /api/gallery/albums/:albumId/media
  throw new Error('API not implemented');
}

// ── Events ──

export function getUpcomingEvents(): UpcomingEvent[] {
  if (USE_MOCK_DATA) return mock.mockUpcomingEvents;
  // TODO: Replace with API call → GET /api/events/upcoming?classId=:classId
  throw new Error('API not implemented');
}

// ── Daily Summary ──

export function getDailySummary(): DailySummary {
  if (USE_MOCK_DATA) return mock.mockDailySummary;
  // TODO: Replace with API call → GET /api/summary/daily?studentId=:id
  throw new Error('API not implemented');
}

// ── Notifications ──

export function getNotifications(): Notification[] {
  if (USE_MOCK_DATA) return mock.mockNotifications;
  // TODO: Replace with API call → GET /api/notifications?userId=:id
  throw new Error('API not implemented');
}

// ── Emergency ──

export function getEmergencyAlerts(): EmergencyAlert[] {
  if (USE_MOCK_DATA) return mock.mockEmergencyAlerts;
  throw new Error('API not implemented');
}

export function getEmergencyContacts(): EmergencyContact[] {
  if (USE_MOCK_DATA) return mock.mockEmergencyContacts;
  throw new Error('API not implemented');
}

// ── Preferences & Support ──

export function getNotificationPreferences(): NotificationPreferences {
  if (USE_MOCK_DATA) return mock.mockNotificationPreferences;
  // TODO: Replace with API call → GET /api/parents/:id/notification-preferences
  throw new Error('API not implemented');
}

export function getSupportInfo(): SupportInfo {
  if (USE_MOCK_DATA) return mock.mockSupportInfo;
  // TODO: Replace with API call → GET /api/support
  throw new Error('API not implemented');
}
