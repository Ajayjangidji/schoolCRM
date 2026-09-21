import {
  Student,
  Parent,
  AttendanceRecord,
  AttendanceStats,
  Homework,
  SubjectMarks,
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
  Document,
  EventAlbum,
  DailySummary,
  Notification,
  EmergencyAlert,
  EmergencyContact,
  ChatMessage,
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

export const MOCK_TODAY = '2026-08-06';

export const mockStudent: Student = {
  id: 'STU001',
  name: 'Aarav Sharma',
  rollNumber: '15',
  class: '8',
  section: 'A',
  photo: '/images/student-placeholder.png',
  dateOfBirth: '2013-05-12',
  gender: 'male',
  bloodGroup: 'B+',
  parentId: 'PAR001',
};

export const mockParent: Parent = {
  id: 'PAR001',
  name: 'Rajesh Sharma',
  email: 'rajesh.sharma@email.com',
  phone: '+91 98765 43210',
  relation: 'father',
  children: [mockStudent],
};

export const mockTodayAttendance: AttendanceRecord = {
  id: 'ATT001',
  studentId: 'STU001',
  date: '2026-08-06',
  status: 'present',
  checkInTime: '07:52 AM',
  markedBy: 'Mrs. Priya Singh',
};

type AttendanceStatus = AttendanceRecord['status'];

function buildAttendanceMonth(
  year: number,
  month: number,
  overrides: Record<number, AttendanceStatus>,
  lastDay?: number,
): Record<number, AttendanceStatus> {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const result: Record<number, AttendanceStatus> = {};
  for (let d = 1; d <= daysInMonth; d++) {
    const isSunday = new Date(year, month, d).getDay() === 0;
    const isFuture = lastDay !== undefined && d > lastDay;
    if (isFuture) {
      if (isSunday || overrides[d] === 'holiday') result[d] = 'holiday';
      continue;
    }
    result[d] = overrides[d] ?? (isSunday ? 'holiday' : 'present');
  }
  return result;
}

export const mockAttendanceCalendar: Record<string, Record<number, AttendanceStatus>> = {
  '2026-04': buildAttendanceMonth(2026, 3, { 8: 'absent', 14: 'holiday', 21: 'late' }),
  '2026-05': buildAttendanceMonth(2026, 4, { 1: 'holiday', 6: 'absent', 7: 'absent', 8: 'absent', 20: 'late' }),
  '2026-06': buildAttendanceMonth(2026, 5, { 15: 'absent', 23: 'late' }),
  '2026-07': buildAttendanceMonth(2026, 6, { 10: 'leave', 22: 'leave', 23: 'leave', 30: 'absent' }),
  '2026-08': buildAttendanceMonth(2026, 7, { 5: 'late', 14: 'holiday' }, 6),
};

function deriveAttendanceStats(): AttendanceStats {
  let present = 0;
  let absent = 0;
  let late = 0;
  let leave = 0;
  Object.entries(mockAttendanceCalendar).forEach(([monthKey, days]) => {
    Object.entries(days).forEach(([day, status]) => {
      if (`${monthKey}-${day.padStart(2, '0')}` > MOCK_TODAY) return;
      if (status === 'present') present++;
      else if (status === 'absent') absent++;
      else if (status === 'late') late++;
      else if (status === 'leave') leave++;
    });
  });
  const totalDays = present + absent + late + leave;
  return {
    totalDays,
    present: present + late,
    absent,
    late,
    percentage: Number((((present + late) / totalDays) * 100).toFixed(1)),
  };
}

export const mockAttendanceStats: AttendanceStats = deriveAttendanceStats();

export const mockMonthlyAttendance: AttendanceRecord[] = [
  { id: 'A01', studentId: 'STU001', date: '2026-08-01', status: 'present', checkInTime: '07:50 AM' },
  { id: 'A02', studentId: 'STU001', date: '2026-08-02', status: 'holiday' },
  { id: 'A03', studentId: 'STU001', date: '2026-08-03', status: 'present', checkInTime: '07:49 AM' },
  { id: 'A04', studentId: 'STU001', date: '2026-08-04', status: 'present', checkInTime: '07:55 AM' },
  { id: 'A05', studentId: 'STU001', date: '2026-08-05', status: 'late', checkInTime: '08:20 AM' },
  { id: 'A06', studentId: 'STU001', date: '2026-08-06', status: 'present', checkInTime: '07:52 AM' },
];

export const mockAttendanceAlerts: AttendanceAlert[] = [
  { id: 'AL1', date: '2026-08-05', message: 'Aarav was marked LATE today (arrived 08:20 AM).', channels: ['push'], sentAt: '08:21 AM' },
  { id: 'AL2', date: '2026-07-30', message: 'Aarav is ABSENT today. If this is unexpected, please contact the class teacher.', channels: ['push', 'sms'], sentAt: '09:05 AM' },
  { id: 'AL3', date: '2026-06-15', message: 'Aarav is ABSENT today. If this is unexpected, please contact the class teacher.', channels: ['push', 'sms'], sentAt: '09:02 AM' },
  { id: 'AL4', date: '2026-05-08', message: 'Aarav is ABSENT today (3rd consecutive day). Please submit a leave application.', channels: ['push', 'sms', 'email'], sentAt: '09:04 AM' },
  { id: 'AL5', date: '2026-05-07', message: 'Aarav is ABSENT today (2nd consecutive day).', channels: ['push', 'sms'], sentAt: '09:03 AM' },
];

export const mockHomework: Homework[] = [
  {
    id: 'HW001',
    title: 'Chapter 5 - Quadratic Equations Practice Set',
    description: 'Solve exercises 5.1 and 5.2 from the textbook. Show all steps clearly.',
    subject: 'Mathematics',
    class: '8',
    section: 'A',
    assignedBy: 'Mr. Rakesh Kumar',
    assignedDate: '2026-08-05',
    dueDate: '2026-08-07',
    status: 'pending',
    maxMarks: 20,
    attachments: [{ id: 'HWA1', name: 'Quadratic Practice Set.pdf', url: '#', type: 'pdf', size: 184000 }],
  },
  {
    id: 'HW002',
    title: 'Essay on Water Conservation',
    description: 'Write an essay of 300-500 words on the importance of water conservation in daily life.',
    subject: 'English',
    class: '8',
    section: 'A',
    assignedBy: 'Mrs. Anita Verma',
    assignedDate: '2026-08-04',
    dueDate: '2026-08-08',
    status: 'pending',
    maxMarks: 15,
    attachments: [{ id: 'HWA2', name: 'Essay Writing Guidelines.pdf', url: '#', type: 'pdf', size: 96000 }],
  },
  {
    id: 'HW003',
    title: 'Cell Structure Diagram',
    description: 'Draw and label the structure of a plant cell and an animal cell. Use colors.',
    subject: 'Science',
    class: '8',
    section: 'A',
    assignedBy: 'Dr. Meena Gupta',
    assignedDate: '2026-08-02',
    dueDate: '2026-08-05',
    status: 'overdue',
    maxMarks: 10,
    attachments: [{ id: 'HWA3', name: 'Cell Diagram Reference.pdf', url: '#', type: 'pdf', size: 312000 }],
  },
  {
    id: 'HW004',
    title: 'Hindi Vyakaran - Samas Exercise',
    description: 'Complete the samas practice worksheet from page 45-47.',
    subject: 'Hindi',
    class: '8',
    section: 'A',
    assignedBy: 'Mrs. Kavita Joshi',
    assignedDate: '2026-08-01',
    dueDate: '2026-08-04',
    status: 'evaluated',
    maxMarks: 10,
    obtainedMarks: 8,
    grade: 'A',
    remarks: 'Good work! Neat handwriting. Review compound samas once more.',
  },
  {
    id: 'HW005',
    title: 'Map Work - Indian Rivers',
    description: 'Mark all major rivers of India on the outline map provided.',
    subject: 'Social Science',
    class: '8',
    section: 'A',
    assignedBy: 'Mr. Suresh Patel',
    assignedDate: '2026-07-30',
    dueDate: '2026-08-02',
    status: 'evaluated',
    maxMarks: 10,
    obtainedMarks: 9,
    grade: 'A+',
    remarks: 'Excellent map work!',
  },
];

export const mockSubjectMarks: SubjectMarks[] = [
  { subject: 'Mathematics', theory: 72, practical: undefined, internal: 18, total: 90, maxMarks: 100, percentage: 90, grade: 'A+' },
  { subject: 'Science', theory: 65, practical: 18, internal: 15, total: 98, maxMarks: 100, percentage: 98, grade: 'A+' },
  { subject: 'English', theory: 70, internal: 12, total: 82, maxMarks: 100, percentage: 82, grade: 'A' },
  { subject: 'Hindi', theory: 58, internal: 14, total: 72, maxMarks: 100, percentage: 72, grade: 'B+' },
  { subject: 'Social Science', theory: 68, internal: 17, total: 85, maxMarks: 100, percentage: 85, grade: 'A' },
  { subject: 'Computer Science', theory: 40, practical: 22, internal: 14, total: 76, maxMarks: 100, percentage: 76, grade: 'A' },
];

export const mockExamResult: ExamResult = {
  id: 'EXM001',
  examName: 'Mid-Term Examination 2026',
  examType: 'mid-term',
  class: '8',
  section: 'A',
  subjects: mockSubjectMarks,
  totalPercentage: 83.8,
  overallGrade: 'A',
  rank: 5,
  examDate: '2026-07-20',
  classAverage: 74,
  classSize: 38,
  remarks: 'Aarav has shown consistent improvement across subjects. Strong in Science and Mathematics. Should practice Hindi grammar more regularly.',
};

function markRow(subject: string, theory: number, internal: number, practical?: number): SubjectMarks {
  const total = theory + internal + (practical ?? 0);
  const grade = total >= 90 ? 'A+' : total >= 75 ? 'A' : total >= 65 ? 'B+' : total >= 55 ? 'B' : 'C';
  return { subject, theory, practical, internal, total, maxMarks: 100, percentage: total, grade };
}

const mockUnitTest1Result: ExamResult = {
  id: 'EXM-UT1',
  examName: 'Unit Test 1 2026',
  examType: 'unit-test',
  class: '8',
  section: 'A',
  subjects: [
    markRow('Mathematics', 65, 15),
    markRow('Science', 55, 15, 18),
    markRow('English', 64, 12),
    markRow('Hindi', 52, 13),
    markRow('Social Science', 63, 15),
    markRow('Computer Science', 38, 16, 20),
  ],
  totalPercentage: 76.8,
  overallGrade: 'A',
  rank: 8,
  examDate: '2026-05-18',
  classAverage: 71.2,
  classSize: 38,
  remarks: 'Good start to the session. Needs more practice in Hindi writing.',
};

const mockFinal25Result: ExamResult = {
  id: 'EXM-FINAL-25',
  examName: 'Final Examination 2025-26',
  examType: 'final',
  class: '7',
  section: 'A',
  subjects: [
    markRow('Mathematics', 58, 14),
    markRow('Science', 50, 14, 16),
    markRow('English', 62, 12),
    markRow('Hindi', 50, 12),
    markRow('Social Science', 57, 13),
    markRow('Computer Science', 34, 16, 18),
  ],
  totalPercentage: 71,
  overallGrade: 'B+',
  rank: 11,
  examDate: '2026-03-16',
  classAverage: 68.5,
  classSize: 40,
  remarks: 'Steady performance through the year. Promoted to Class 8.',
};

export const mockAllExamResults: ExamResult[] = [mockExamResult, mockUnitTest1Result, mockFinal25Result];

export const mockHolidays: Holiday[] = [
  { id: 'H01', name: 'Dr. Ambedkar Jayanti', date: '2026-04-14', type: 'national' },
  { id: 'H02', name: 'Buddha Purnima', date: '2026-05-01', type: 'festival' },
  { id: 'H03', name: 'Summer Vacation', date: '2026-05-25', endDate: '2026-06-30', type: 'vacation', description: 'School reopens on 1 July 2026.' },
  { id: 'H04', name: 'Janmashtami', date: '2026-08-14', type: 'festival' },
  { id: 'H05', name: 'Independence Day', date: '2026-08-15', type: 'national', description: 'Flag hoisting at 8:00 AM. Attendance is optional for Class 8 and above.' },
  { id: 'H06', name: 'Ganesh Chaturthi', date: '2026-09-15', type: 'festival' },
  { id: 'H07', name: 'Gandhi Jayanti', date: '2026-10-02', type: 'national' },
  { id: 'H08', name: 'Dussehra', date: '2026-10-20', type: 'festival' },
  { id: 'H09', name: 'Diwali Break', date: '2026-11-07', endDate: '2026-11-11', type: 'festival', description: 'Diwali on 8 November. School reopens on 12 November.' },
  { id: 'H10', name: 'Guru Nanak Jayanti', date: '2026-11-24', type: 'festival' },
  { id: 'H11', name: 'Annual Day Preparation Holiday', date: '2026-12-11', type: 'school', description: 'No regular classes. Only students in the annual day programme attend.' },
  { id: 'H12', name: 'Winter Break', date: '2026-12-25', endDate: '2027-01-05', type: 'vacation', description: 'School reopens on 6 January 2027.' },
  { id: 'H13', name: 'Republic Day', date: '2027-01-26', type: 'national' },
  { id: 'H14', name: 'Holi', date: '2027-03-22', type: 'festival' },
];

export const mockExamHistory: ExamTrendPoint[] = [
  {
    id: 'EXM-FINAL-25',
    examName: 'Final Examination 2025-26',
    shortLabel: 'Final 25-26',
    totalPercentage: 71,
    classAverage: 68.5,
    subjects: [
      { subject: 'Mathematics', percentage: 72 },
      { subject: 'Science', percentage: 80 },
      { subject: 'English', percentage: 74 },
      { subject: 'Hindi', percentage: 62 },
      { subject: 'Social Science', percentage: 70 },
      { subject: 'Computer Science', percentage: 68 },
    ],
  },
  {
    id: 'EXM-UT1',
    examName: 'Unit Test 1 2026',
    shortLabel: 'Unit Test 1',
    totalPercentage: 76.8,
    classAverage: 71.2,
    subjects: [
      { subject: 'Mathematics', percentage: 80 },
      { subject: 'Science', percentage: 88 },
      { subject: 'English', percentage: 76 },
      { subject: 'Hindi', percentage: 65 },
      { subject: 'Social Science', percentage: 78 },
      { subject: 'Computer Science', percentage: 74 },
    ],
  },
  {
    id: 'EXM001',
    examName: 'Mid-Term Examination 2026',
    shortLabel: 'Mid-Term',
    totalPercentage: 83.8,
    classAverage: 74,
    subjects: mockSubjectMarks.map((m) => ({ subject: m.subject, percentage: m.percentage })),
  },
];

export const mockFeeDetails: FeeDetails = {
  totalAnnualFee: 84000,
  totalPaid: 42000,
  totalBalance: 42000,
  feeHeads: [
    { id: 'FH1', name: 'Tuition Fee', amount: 5000, frequency: 'monthly' },
    { id: 'FH2', name: 'Transport Fee', amount: 1500, frequency: 'monthly' },
    { id: 'FH3', name: 'Lab Fee', amount: 2000, frequency: 'annual' },
    { id: 'FH4', name: 'Library Fee', amount: 1000, frequency: 'annual' },
    { id: 'FH5', name: 'Annual Charges', amount: 3000, frequency: 'annual' },
  ],
  installments: [
    { id: 'INS1', label: 'Q1 (Apr-Jun)', amount: 21000, dueDate: '2026-04-15', status: 'paid', paidAmount: 21000, paidDate: '2026-04-10', transactionId: 'TXN20260410001', paymentMode: 'upi', lateFee: 0 },
    { id: 'INS2', label: 'Q2 (Jul-Sep)', amount: 21000, dueDate: '2026-07-15', status: 'paid', paidAmount: 21000, paidDate: '2026-07-12', transactionId: 'TXN20260712002', paymentMode: 'card', lateFee: 0 },
    { id: 'INS3', label: 'Q3 (Oct-Dec)', amount: 21000, dueDate: '2026-10-15', status: 'pending', paidAmount: 0, lateFee: 0 },
    { id: 'INS4', label: 'Q4 (Jan-Mar)', amount: 21000, dueDate: '2027-01-15', status: 'pending', paidAmount: 0, lateFee: 0 },
  ],
};

export function mockPayInstallment(
  installment: FeeInstallment,
  mode: NonNullable<FeeInstallment['paymentMode']>,
): Promise<FeeInstallment> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        ...installment,
        status: 'paid',
        paidAmount: installment.amount,
        paidDate: MOCK_TODAY,
        paymentMode: mode,
        transactionId: `TXN${MOCK_TODAY.replace(/-/g, '')}${Math.floor(100 + Math.random() * 900)}`,
      });
    }, 1600);
  });
}

export const mockNotices: Notice[] = [
  {
    id: 'NOT001',
    title: 'Independence Day Celebration',
    content: 'School will celebrate Independence Day on 15th August. Students must come in white uniform. Flag hoisting at 8:00 AM followed by cultural program. Parents are welcome to attend.',
    category: 'event',
    priority: 'high',
    postedDate: '2026-08-05',
    isPinned: true,
    isRead: false,
    requiresAcknowledgement: true,
    isAcknowledged: false,
  },
  {
    id: 'NOT002',
    title: 'Parent-Teacher Meeting',
    content: 'PTM for Class 8 will be held on 20th August (Thursday) from 9:00 AM to 1:00 PM. Please bring your child\'s homework diary. Attendance is mandatory.',
    category: 'circular',
    priority: 'high',
    postedDate: '2026-08-04',
    isPinned: true,
    isRead: true,
    requiresAcknowledgement: true,
    isAcknowledged: true,
  },
  {
    id: 'NOT003',
    title: 'Holiday on account of Janmashtami',
    content: 'School will remain closed on 14th August on account of Janmashtami. Regular classes will resume on 16th August.',
    category: 'holiday',
    priority: 'normal',
    postedDate: '2026-08-03',
    isPinned: false,
    isRead: true,
    requiresAcknowledgement: false,
  },
  {
    id: 'NOT004',
    title: 'Unit Test 2 Schedule Released',
    content: 'Unit Test 2 will be conducted from 25th August to 30th August. Detailed schedule and syllabus have been attached.',
    attachments: [{ id: 'NA1', name: 'Unit Test 2 Schedule and Syllabus.pdf', url: '#', type: 'pdf', size: 210000 }],
    category: 'exam',
    priority: 'normal',
    postedDate: '2026-08-02',
    isPinned: false,
    isRead: false,
    requiresAcknowledgement: false,
  },
  {
    id: 'NOT005',
    title: 'Fee Payment Reminder - Q3',
    content: 'This is a reminder that Q3 fee (Oct-Dec) of Rs. 21,000 is due by 15th October. Please pay on time to avoid late fee charges.',
    category: 'fee',
    priority: 'normal',
    postedDate: '2026-08-01',
    isPinned: false,
    isRead: true,
    requiresAcknowledgement: false,
  },
];

export const mockLeaveRequests: LeaveRequest[] = [
  {
    id: 'LR001',
    studentId: 'STU001',
    type: 'sick',
    fromDate: '2026-07-22',
    toDate: '2026-07-23',
    reason: 'Child is having fever and doctor has advised rest for 2 days.',
    status: 'approved',
    appliedDate: '2026-07-22',
    approvedBy: 'Mrs. Priya Singh',
    approverRemarks: 'Approved. Get well soon.',
  },
  {
    id: 'LR002',
    studentId: 'STU001',
    type: 'family-emergency',
    fromDate: '2026-07-10',
    toDate: '2026-07-10',
    reason: 'Family function - grandmother\'s 80th birthday celebration.',
    status: 'approved',
    appliedDate: '2026-07-08',
    approvedBy: 'Mrs. Priya Singh',
  },
];

const mondayTimetable: TimetablePeriod[] = [
  { period: 1, startTime: '08:00', endTime: '08:40', subject: 'Mathematics', teacher: 'Mr. Rakesh Kumar', type: 'class', room: 'Room 204' },
  { period: 2, startTime: '08:40', endTime: '09:20', subject: 'Science', teacher: 'Dr. Meena Gupta', type: 'class', room: 'Lab 2' },
  { period: 3, startTime: '09:20', endTime: '10:00', subject: 'English', teacher: 'Mrs. Anita Verma', type: 'class', room: 'Room 204' },
  { period: 0, startTime: '10:00', endTime: '10:20', subject: 'Break', teacher: '', type: 'break' },
  { period: 4, startTime: '10:20', endTime: '11:00', subject: 'Hindi', teacher: 'Mrs. Kavita Joshi', type: 'class', room: 'Room 204' },
  { period: 5, startTime: '11:00', endTime: '11:40', subject: 'Social Science', teacher: 'Mr. Suresh Patel', type: 'class', room: 'Room 204' },
  { period: 6, startTime: '11:40', endTime: '12:20', subject: 'Computer Science', teacher: 'Mr. Amit Saxena', type: 'class', room: 'Computer Lab', isSubstitution: true, originalTeacher: 'Ms. Neha Kapoor' },
  { period: 0, startTime: '12:20', endTime: '13:00', subject: 'Lunch', teacher: '', type: 'lunch' },
  { period: 7, startTime: '13:00', endTime: '13:40', subject: 'Physical Education', teacher: 'Mr. Vikas Yadav', type: 'class', room: 'Playground' },
  { period: 8, startTime: '13:40', endTime: '14:20', subject: 'Art', teacher: 'Mrs. Sunita Rao', type: 'class', room: 'Art Room' },
];

export const mockWeekTimetable: DayTimetable[] = [
  { day: 'Monday', periods: mondayTimetable },
  { day: 'Tuesday', periods: [
    { period: 1, startTime: '08:00', endTime: '08:40', subject: 'Science', teacher: 'Dr. Meena Gupta', type: 'class', room: 'Room 204' },
    { period: 2, startTime: '08:40', endTime: '09:20', subject: 'Mathematics', teacher: 'Mr. Rakesh Kumar', type: 'class', room: 'Room 204' },
    { period: 3, startTime: '09:20', endTime: '10:00', subject: 'Hindi', teacher: 'Mrs. Kavita Joshi', type: 'class', room: 'Room 204' },
    { period: 0, startTime: '10:00', endTime: '10:20', subject: 'Break', teacher: '', type: 'break' },
    { period: 4, startTime: '10:20', endTime: '11:00', subject: 'English', teacher: 'Mrs. Anita Verma', type: 'class', room: 'Room 204' },
    { period: 5, startTime: '11:00', endTime: '11:40', subject: 'Computer Science', teacher: 'Ms. Neha Kapoor', type: 'class', room: 'Computer Lab' },
    { period: 6, startTime: '11:40', endTime: '12:20', subject: 'Social Science', teacher: 'Mr. Suresh Patel', type: 'class', room: 'Room 204' },
    { period: 0, startTime: '12:20', endTime: '13:00', subject: 'Lunch', teacher: '', type: 'lunch' },
    { period: 7, startTime: '13:00', endTime: '13:40', subject: 'Mathematics', teacher: 'Mr. Rakesh Kumar', type: 'class', room: 'Room 204' },
    { period: 8, startTime: '13:40', endTime: '14:20', subject: 'Physical Education', teacher: 'Mr. Vikas Yadav', type: 'class', room: 'Playground' },
  ]},
  { day: 'Wednesday', periods: [
    { period: 1, startTime: '08:00', endTime: '08:40', subject: 'English', teacher: 'Mrs. Anita Verma', type: 'class', room: 'Room 204' },
    { period: 2, startTime: '08:40', endTime: '09:20', subject: 'Social Science', teacher: 'Mr. Suresh Patel', type: 'class', room: 'Room 204' },
    { period: 3, startTime: '09:20', endTime: '10:00', subject: 'Mathematics', teacher: 'Mr. Rakesh Kumar', type: 'class', room: 'Room 204' },
    { period: 0, startTime: '10:00', endTime: '10:20', subject: 'Break', teacher: '', type: 'break' },
    { period: 4, startTime: '10:20', endTime: '11:00', subject: 'Science', teacher: 'Dr. Meena Gupta', type: 'class', room: 'Lab 2' },
    { period: 5, startTime: '11:00', endTime: '11:40', subject: 'Hindi', teacher: 'Mrs. Kavita Joshi', type: 'class', room: 'Room 204' },
    { period: 6, startTime: '11:40', endTime: '12:20', subject: 'Art', teacher: 'Mrs. Sunita Rao', type: 'class', room: 'Art Room' },
    { period: 0, startTime: '12:20', endTime: '13:00', subject: 'Lunch', teacher: '', type: 'lunch' },
    { period: 7, startTime: '13:00', endTime: '13:40', subject: 'Computer Science', teacher: 'Ms. Neha Kapoor', type: 'class', room: 'Computer Lab' },
    { period: 8, startTime: '13:40', endTime: '14:20', subject: 'Science', teacher: 'Dr. Meena Gupta', type: 'class', room: 'Lab 2' },
  ]},
  { day: 'Thursday', periods: [
    { period: 1, startTime: '08:00', endTime: '08:40', subject: 'Hindi', teacher: 'Mrs. Kavita Joshi', type: 'class', room: 'Room 204' },
    { period: 2, startTime: '08:40', endTime: '09:20', subject: 'English', teacher: 'Mrs. Anita Verma', type: 'class', room: 'Room 204' },
    { period: 3, startTime: '09:20', endTime: '10:00', subject: 'Science', teacher: 'Dr. Meena Gupta', type: 'class', room: 'Lab 2' },
    { period: 0, startTime: '10:00', endTime: '10:20', subject: 'Break', teacher: '', type: 'break' },
    { period: 4, startTime: '10:20', endTime: '11:00', subject: 'Mathematics', teacher: 'Mr. Rakesh Kumar', type: 'class', room: 'Room 204' },
    { period: 5, startTime: '11:00', endTime: '11:40', subject: 'Social Science', teacher: 'Mr. Suresh Patel', type: 'class', room: 'Room 204' },
    { period: 6, startTime: '11:40', endTime: '12:20', subject: 'Physical Education', teacher: 'Mr. Vikas Yadav', type: 'class', room: 'Playground' },
    { period: 0, startTime: '12:20', endTime: '13:00', subject: 'Lunch', teacher: '', type: 'lunch' },
    { period: 7, startTime: '13:00', endTime: '13:40', subject: 'Computer Science', teacher: 'Ms. Neha Kapoor', type: 'class', room: 'Computer Lab' },
    { period: 8, startTime: '13:40', endTime: '14:20', subject: 'Mathematics', teacher: 'Mr. Rakesh Kumar', type: 'class', room: 'Room 204' },
  ]},
  { day: 'Friday', periods: [
    { period: 1, startTime: '08:00', endTime: '08:40', subject: 'Social Science', teacher: 'Mr. Suresh Patel', type: 'class', room: 'Room 204' },
    { period: 2, startTime: '08:40', endTime: '09:20', subject: 'Hindi', teacher: 'Mrs. Kavita Joshi', type: 'class', room: 'Room 204' },
    { period: 3, startTime: '09:20', endTime: '10:00', subject: 'English', teacher: 'Mrs. Anita Verma', type: 'class', room: 'Room 204' },
    { period: 0, startTime: '10:00', endTime: '10:20', subject: 'Break', teacher: '', type: 'break' },
    { period: 4, startTime: '10:20', endTime: '11:00', subject: 'Mathematics', teacher: 'Mr. Rakesh Kumar', type: 'class', room: 'Room 204' },
    { period: 5, startTime: '11:00', endTime: '11:40', subject: 'Science', teacher: 'Dr. Meena Gupta', type: 'class', room: 'Lab 2' },
    { period: 6, startTime: '11:40', endTime: '12:20', subject: 'Art', teacher: 'Mrs. Sunita Rao', type: 'class', room: 'Art Room' },
    { period: 0, startTime: '12:20', endTime: '13:00', subject: 'Lunch', teacher: '', type: 'lunch' },
    { period: 7, startTime: '13:00', endTime: '13:40', subject: 'Physical Education', teacher: 'Mr. Vikas Yadav', type: 'class', room: 'Playground' },
    { period: 8, startTime: '13:40', endTime: '14:20', subject: 'Computer Science', teacher: 'Ms. Neha Kapoor', type: 'class', room: 'Computer Lab' },
  ]},
];

const MOCK_TODAY_WEEKDAY = new Date(MOCK_TODAY).toLocaleDateString('en-US', { weekday: 'long', timeZone: 'UTC' });

export const mockTodayTimetable: TimetablePeriod[] = (
  mockWeekTimetable.find((d) => d.day === MOCK_TODAY_WEEKDAY) ?? mockWeekTimetable[0]
).periods.map((p) =>
  p.subject === 'Computer Science'
    ? { ...p, teacher: 'Mr. Amit Saxena', isSubstitution: true, originalTeacher: p.teacher }
    : p,
);

export const MOCK_CURRENT_HOUR = 10;

export const mockExamSchedule: ExamScheduleItem[] = [
  { id: 'ES1', subject: 'Mathematics', date: '2026-08-25', startTime: '09:00', endTime: '11:00', examType: 'Unit Test 2', syllabus: 'Ch 5-7: Quadratic Equations, Triangles, Coordinate Geometry' },
  { id: 'ES2', subject: 'Science', date: '2026-08-26', startTime: '09:00', endTime: '11:00', examType: 'Unit Test 2', syllabus: 'Ch 4-6: Cell Biology, Reproduction, Light' },
  { id: 'ES3', subject: 'English', date: '2026-08-27', startTime: '09:00', endTime: '11:00', examType: 'Unit Test 2', syllabus: 'Literature: Ch 3-5, Grammar: Tenses, Voices' },
  { id: 'ES4', subject: 'Hindi', date: '2026-08-28', startTime: '09:00', endTime: '11:00', examType: 'Unit Test 2', syllabus: 'Vyakaran: Samas, Alankar. Sahitya: Lesson 4-6' },
  { id: 'ES5', subject: 'Social Science', date: '2026-08-29', startTime: '09:00', endTime: '11:00', examType: 'Unit Test 2', syllabus: 'History: Ch 3-4, Geography: Ch 3, Civics: Ch 2' },
];

export const mockTransportInfo: TransportInfo = {
  busNumber: 'Bus 07 (DL-1C-7789)',
  routeName: 'Route 7 - Sector 22 to School',
  driverName: 'Ramesh Yadav',
  driverPhone: '+91 98100 12345',
  attendantName: 'Sunita Devi',
  attendantPhone: '+91 98100 12346',
  pickupStop: 'Sector 22 Market',
  pickupTime: '07:15 AM',
  dropStop: 'Sector 22 Market',
  dropTime: '02:45 PM',
  vehicleNumber: 'DL-1C-7789',
  vehicleModel: 'Tata Starbus 40-seater (White & Yellow)',
  vehicleCapacity: 40,
  driverAddress: 'H.No. 214, Gali No. 5, Sector 31, Noida, Uttar Pradesh 201301',
  driverLicenseNo: 'DL-0420110123456',
  driverExperienceYears: 14,
  attendantAddress: 'B-42, Sector 27, Noida, Uttar Pradesh 201301',
};

export const mockTransportOpted = true;

export const mockBusStops: BusStop[] = [
  { id: 'BS1', name: 'Sector 30 Bus Stop', x: 8, y: 48, pickupTime: '06:50 AM', dropTime: '03:05 PM' },
  { id: 'BS2', name: 'Sector 26 Chowk', x: 26, y: 34, pickupTime: '07:02 AM', dropTime: '02:55 PM' },
  { id: 'BS3', name: 'Sector 22 Market', x: 44, y: 44, pickupTime: '07:15 AM', dropTime: '02:45 PM', isChildStop: true },
  { id: 'BS4', name: 'Sector 18 Crossing', x: 62, y: 26, pickupTime: '07:28 AM', dropTime: '02:40 PM' },
  { id: 'BS5', name: 'Sector 15 Metro Station', x: 80, y: 36, pickupTime: '07:38 AM', dropTime: '02:33 PM' },
  { id: 'BS6', name: 'SchoolAI Campus (Main Gate)', x: 93, y: 16, pickupTime: '07:45 AM', dropTime: '02:25 PM', isSchool: true },
];

const mockBusTripStart: Record<BusTripKey, number> = { morning: 1.3, afternoon: 0.4 };

export function startMockBusFeed(
  trip: BusTripKey,
  stopCount: number,
  onUpdate: (state: BusLiveState) => void,
): () => void {
  const lastIndex = stopCount - 1;
  let progress = mockBusTripStart[trip];
  let tick = 0;

  const emit = () => {
    const fraction = progress - Math.floor(progress);
    const status: BusLiveState['status'] = progress >= lastIndex || fraction < 0.06 ? 'stopped' : 'moving';
    onUpdate({
      progress: Math.min(progress, lastIndex),
      speedKmph: status === 'stopped' ? 0 : Math.round(28 + 6 * Math.sin(tick / 3)),
      status,
      lastUpdated: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    });
  };

  emit();
  const timer = setInterval(() => {
    tick += 1;
    if (progress < lastIndex) progress = Math.min(progress + 0.05, lastIndex);
    emit();
  }, 1000);
  return () => clearInterval(timer);
}

export const mockChatMessages: Record<string, ChatMessage[]> = {
  CH001: [
    { id: 'MSG001', senderId: 'T001', senderName: 'Mrs. Priya Singh', senderRole: 'teacher', content: 'Good morning! I wanted to let you know that Aarav has been doing really well in class lately.', timestamp: '2026-08-06 09:15 AM', type: 'text', isRead: true },
    { id: 'MSG002', senderId: 'PAR001', senderName: 'Rajesh Sharma', senderRole: 'parent', content: 'Thank you so much! We have been encouraging him to be more attentive.', timestamp: '2026-08-06 09:30 AM', type: 'text', isRead: true },
    { id: 'MSG003', senderId: 'T001', senderName: 'Mrs. Priya Singh', senderRole: 'teacher', content: 'It shows! He participated actively in the group discussion today. Keep up the great work!', timestamp: '2026-08-06 11:00 AM', type: 'text', isRead: true },
    { id: 'MSG004', senderId: 'T001', senderName: 'Mrs. Priya Singh', senderRole: 'teacher', content: 'Aarav did very well in today\'s class activity.', timestamp: '2026-08-06 11:30 AM', type: 'text', isRead: false },
  ],
  CH002: [
    { id: 'MSG005', senderId: 'T002', senderName: 'Mr. Rakesh Kumar', senderRole: 'teacher', content: 'Aarav needs to practice more quadratic equations. He made some calculation errors in the class test.', timestamp: '2026-08-05 02:00 PM', type: 'text', isRead: true },
    { id: 'MSG006', senderId: 'PAR001', senderName: 'Rajesh Sharma', senderRole: 'parent', content: 'I will make sure he practices tonight. Can you suggest which exercises?', timestamp: '2026-08-05 02:30 PM', type: 'text', isRead: true },
    { id: 'MSG007', senderId: 'T002', senderName: 'Mr. Rakesh Kumar', senderRole: 'teacher', content: 'Please ensure Aarav completes the practice set by tomorrow.', timestamp: '2026-08-05 03:15 PM', type: 'text', isRead: true },
  ],
  CH003: [
    { id: 'MSG008', senderId: 'T003', senderName: 'Dr. Meena Gupta', senderRole: 'teacher', content: 'We are starting the science project next week. Students need to bring chart paper, colors, and reference books.', timestamp: '2026-08-04 01:30 PM', type: 'text', isRead: true },
    { id: 'MSG009', senderId: 'PAR001', senderName: 'Rajesh Sharma', senderRole: 'parent', content: 'Noted. What topic has Aarav been assigned?', timestamp: '2026-08-04 01:45 PM', type: 'text', isRead: true },
    { id: 'MSG010', senderId: 'T003', senderName: 'Dr. Meena Gupta', senderRole: 'teacher', content: 'The science project materials need to be brought by next Monday.', timestamp: '2026-08-04 02:00 PM', type: 'text', isRead: true },
  ],
};

export const mockChatThreads: ChatThread[] = [
  { id: 'CH001', teacherName: 'Mrs. Priya Singh', teacherSubject: 'Class Teacher', lastMessage: 'Aarav did very well in today\'s class activity.', lastMessageTime: '2026-08-06 11:30 AM', unreadCount: 1, isOnline: true },
  { id: 'CH002', teacherName: 'Mr. Rakesh Kumar', teacherSubject: 'Mathematics', lastMessage: 'Please ensure Aarav completes the practice set by tomorrow.', lastMessageTime: '2026-08-05 03:15 PM', unreadCount: 0, isOnline: false },
  { id: 'CH003', teacherName: 'Dr. Meena Gupta', teacherSubject: 'Science', lastMessage: 'The science project materials need to be brought by next Monday.', lastMessageTime: '2026-08-04 02:00 PM', unreadCount: 0, isOnline: true },
];

export const mockDocuments: Document[] = [
  { id: 'DOC001', name: 'Report Card - Term 1 (2025-26)', category: 'report-card', uploadDate: '2026-04-15', fileType: 'pdf', fileSize: 245000, downloadUrl: '#' },
  { id: 'DOC002', name: 'Fee Receipt - Q1 2026', category: 'fee-receipt', uploadDate: '2026-04-10', fileType: 'pdf', fileSize: 120000, downloadUrl: '#' },
  { id: 'DOC003', name: 'Fee Receipt - Q2 2026', category: 'fee-receipt', uploadDate: '2026-07-12', fileType: 'pdf', fileSize: 118000, downloadUrl: '#' },
  { id: 'DOC004', name: 'Merit Certificate - Science Olympiad', category: 'certificate', uploadDate: '2026-03-20', fileType: 'pdf', fileSize: 340000, downloadUrl: '#' },
  { id: 'DOC005', name: 'School ID Card 2026-27', category: 'id-card', uploadDate: '2026-04-01', fileType: 'image', fileSize: 520000, downloadUrl: '#' },
  { id: 'DOC006', name: 'Medical Fitness Certificate 2026', category: 'medical', uploadDate: '2026-04-05', fileType: 'pdf', fileSize: 98000, downloadUrl: '#' },
  { id: 'DOC007', name: 'Report Card - Unit Test 1 (2026-27)', category: 'report-card', uploadDate: '2026-06-28', fileType: 'pdf', fileSize: 201000, downloadUrl: '#' },
];

export const mockEventAlbums: EventAlbum[] = [
  { id: 'ALB001', title: 'Annual Sports Day 2026', date: '2026-02-15', coverPhoto: '/images/placeholder-event.png', photoCount: 45, videoCount: 3 },
  { id: 'ALB002', title: 'Republic Day Celebration', date: '2026-01-26', coverPhoto: '/images/placeholder-event.png', photoCount: 28, videoCount: 1 },
  { id: 'ALB003', title: 'Science Exhibition', date: '2026-03-10', coverPhoto: '/images/placeholder-event.png', photoCount: 62, videoCount: 5 },
];

export const mockAlbumMedia: Record<string, MediaItem[]> = Object.fromEntries(
  mockEventAlbums.map((album, albumIndex) => {
    const photos: MediaItem[] = Array.from({ length: album.photoCount }, (_, i) => ({
      id: `${album.id}-P${i + 1}`,
      albumId: album.id,
      type: 'photo',
      caption: `${album.title} - Photo ${i + 1}`,
      hue: (i * 37 + albumIndex * 90) % 360,
    }));
    const videos: MediaItem[] = Array.from({ length: album.videoCount }, (_, i) => ({
      id: `${album.id}-V${i + 1}`,
      albumId: album.id,
      type: 'video',
      caption: `${album.title} - Video ${i + 1}`,
      duration: `0${1 + (i % 3)}:${String(10 + i * 13).padStart(2, '0')}`,
      hue: (i * 53 + albumIndex * 90 + 20) % 360,
    }));
    return [album.id, [...videos, ...photos]];
  }),
);

export const mockDailySummary: DailySummary = {
  date: '2026-08-06',
  attendance: {
    status: 'present',
    checkInTime: '07:52 AM',
  },
  homework: {
    newCount: 1,
    pendingCount: 2,
    subjects: ['Mathematics', 'English'],
  },
  announcements: {
    count: 2,
    titles: ['Independence Day Celebration', 'Unit Test 2 Schedule Released'],
  },
  upcomingExam: {
    subject: 'Mathematics',
    date: '2026-08-25',
    daysLeft: 19,
  },
  feeDue: {
    amount: 21000,
    dueDate: '2026-10-15',
  },
};

export const mockNotifications: Notification[] = [
  { id: 'N001', title: 'Attendance Marked', message: 'Aarav has been marked present today at 07:52 AM.', type: 'attendance', priority: 'normal', timestamp: '2026-08-06 08:00 AM', isRead: false },
  { id: 'N002', title: 'New Homework', message: 'New Mathematics homework: Chapter 5 - Quadratic Equations. Due: Aug 7.', type: 'homework', priority: 'normal', timestamp: '2026-08-05 03:30 PM', isRead: false },
  { id: 'N003', title: 'Homework Evaluated', message: 'Hindi homework has been evaluated. Grade: A (8/10).', type: 'homework', priority: 'normal', timestamp: '2026-08-05 11:00 AM', isRead: true },
  { id: 'N004', title: 'New Notice', message: 'Independence Day Celebration on 15th August. Please acknowledge.', type: 'notice', priority: 'important', timestamp: '2026-08-05 09:00 AM', isRead: false },
  { id: 'N005', title: 'Fee Reminder', message: 'Q3 fee of Rs. 21,000 is due on 15th October.', type: 'fee', priority: 'normal', timestamp: '2026-08-01 10:00 AM', isRead: true },
  { id: 'N006', title: 'Message from Teacher', message: 'Mrs. Priya Singh: Aarav did very well in today\'s class activity.', type: 'chat', priority: 'normal', timestamp: '2026-08-06 11:30 AM', isRead: false },
];

export const mockEmergencyAlerts: EmergencyAlert[] = [
  {
    id: 'EA001',
    title: 'Heavy Rainfall Warning — School Closed Tomorrow',
    message: 'Due to IMD orange alert for heavy rainfall on 7th August, school will remain closed. Online classes will be conducted via Google Meet. Links will be shared by class teachers by 8 AM.',
    type: 'weather',
    severity: 'high',
    issuedAt: '2026-08-06 04:00 PM',
    expiresAt: '2026-08-07 06:00 PM',
    isActive: true,
    actionRequired: 'Do not send children to school. Join online classes via links shared by class teacher.',
    issuedBy: 'Principal Office',
  },
  {
    id: 'EA002',
    title: 'Bus Route 7 Delayed — Road Construction',
    message: 'Bus Route 7 (Sector 22 to School) will be delayed by approximately 20 minutes due to road construction near Sector 18 crossing. Please adjust pickup timing accordingly.',
    type: 'transport',
    severity: 'medium',
    issuedAt: '2026-08-06 06:30 AM',
    isActive: true,
    actionRequired: 'Students on Route 7 should be ready 20 minutes later than usual.',
    issuedBy: 'Transport Department',
  },
  {
    id: 'EA003',
    title: 'Dengue Prevention Advisory',
    message: 'Multiple dengue cases reported in surrounding areas. School is conducting fumigation this weekend. Please ensure children wear full-sleeve uniforms and apply mosquito repellent. Report any fever symptoms immediately.',
    type: 'health',
    severity: 'medium',
    issuedAt: '2026-08-05 10:00 AM',
    isActive: true,
    actionRequired: 'Send children in full-sleeve uniform. Apply mosquito repellent before school. Report fever immediately.',
    issuedBy: 'School Health Office',
  },
  {
    id: 'EA004',
    title: 'Water Supply Disruption',
    message: 'Municipal water supply was disrupted on 3rd August due to pipeline maintenance. School has arranged tanker water. Please send water bottles with children.',
    type: 'infrastructure',
    severity: 'low',
    issuedAt: '2026-08-02 02:00 PM',
    expiresAt: '2026-08-03 06:00 PM',
    isActive: false,
    issuedBy: 'Admin Office',
  },
];

export const mockEmergencyContacts: EmergencyContact[] = [
  { id: 'EC001', name: 'School Reception', role: 'Main Reception Desk', phone: '+91 11 2345 6789', isAvailable: true, type: 'school' },
  { id: 'EC002', name: 'Mrs. Priya Singh', role: 'Class Teacher (8-A)', phone: '+91 98765 11111', isAvailable: true, type: 'school' },
  { id: 'EC003', name: 'Dr. Sunita Mehta', role: 'School Medical Officer', phone: '+91 98765 22222', isAvailable: true, type: 'medical' },
  { id: 'EC004', name: 'Mr. Ramesh Yadav', role: 'Bus Driver (Route 7)', phone: '+91 98100 12345', isAvailable: true, type: 'transport' },
  { id: 'EC005', name: 'Sunita Devi', role: 'Bus Attendant (Route 7)', phone: '+91 98100 12346', isAvailable: true, type: 'transport' },
  { id: 'EC006', name: 'Mr. R.K. Verma', role: 'Principal', phone: '+91 98765 33333', isAvailable: false, type: 'admin' },
  { id: 'EC007', name: 'Mr. Anil Kapoor', role: 'Vice Principal', phone: '+91 98765 44444', isAvailable: true, type: 'admin' },
  { id: 'EC008', name: 'Nearest Hospital', role: 'Apollo Clinic — 1.2 km', phone: '108', isAvailable: true, type: 'medical' },
];

export const mockUpcomingEvents: UpcomingEvent[] = [
  { id: 'UE1', title: 'Janmashtami - School Closed', date: '2026-08-14', type: 'holiday' },
  { id: 'UE2', title: 'Independence Day Celebration', date: '2026-08-15', time: '08:00 AM', type: 'event' },
  { id: 'UE3', title: 'Parent-Teacher Meeting (Class 8)', date: '2026-08-20', time: '09:00 AM', type: 'ptm' },
  { id: 'UE4', title: 'Unit Test 2 begins - Mathematics', date: '2026-08-25', time: '09:00 AM', type: 'exam' },
];

export const mockNotificationPreferences: NotificationPreferences = {
  attendanceAlerts: true,
  homeworkReminders: true,
  feeReminders: true,
  noticeUpdates: true,
  transportAlerts: true,
  chatMessages: true,
  dailySummary: true,
  dailySummaryTime: '06:30 PM',
  channels: { push: true, sms: true, email: false },
};

export const mockSupportInfo: SupportInfo = {
  phone: '+91 11 2345 6789',
  email: 'support@schoolai.in',
  hours: 'Mon - Sat, 8:00 AM - 4:00 PM',
  faqs: [
    { id: 'FAQ1', question: 'How do I apply for my child\'s leave?', answer: 'Open Leave Request from the sidebar, tap "+ Apply Leave", choose the dates and reason, then submit. You can track approval status on the same page.' },
    { id: 'FAQ2', question: 'How can I pay fees online and get a receipt?', answer: 'Go to Fees, tap "Pay Now" on a pending installment and choose UPI, Card or Net Banking. Receipts appear under "Download Receipt" and in Documents.' },
    { id: 'FAQ3', question: 'I did not receive an absence alert. What should I do?', answer: 'Check Settings > Notifications and make sure Attendance alerts and at least one channel (Push / SMS) are enabled. Emergency alerts are always on.' },
    { id: 'FAQ4', question: 'How do I contact a subject teacher?', answer: 'Use Chat from the sidebar. Every subject teacher of your child has a secure thread. For urgent matters call the school reception.' },
    { id: 'FAQ5', question: 'Where can I find my child\'s report card?', answer: 'Academic Progress shows marks and graphs, and the Documents Vault stores every report card as a downloadable file.' },
  ],
};
