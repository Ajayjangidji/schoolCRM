import {
  Student,
  Parent,
  AttendanceRecord,
  AttendanceStats,
  Homework,
  SubjectMarks,
  ExamResult,
  FeeDetails,
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
} from '@/types';

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

export const mockAttendanceStats: AttendanceStats = {
  totalDays: 120,
  present: 110,
  absent: 6,
  late: 4,
  percentage: 91.7,
};

export const mockMonthlyAttendance: AttendanceRecord[] = [
  { id: 'A01', studentId: 'STU001', date: '2026-08-01', status: 'present', checkInTime: '07:50 AM' },
  { id: 'A02', studentId: 'STU001', date: '2026-08-02', status: 'present', checkInTime: '07:48 AM' },
  { id: 'A03', studentId: 'STU001', date: '2026-08-03', status: 'holiday' },
  { id: 'A04', studentId: 'STU001', date: '2026-08-04', status: 'present', checkInTime: '07:55 AM' },
  { id: 'A05', studentId: 'STU001', date: '2026-08-05', status: 'late', checkInTime: '08:20 AM' },
  { id: 'A06', studentId: 'STU001', date: '2026-08-06', status: 'present', checkInTime: '07:52 AM' },
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
  },
  {
    id: 'HW003',
    title: 'Cell Structure Diagram',
    description: 'Draw and label the structure of a plant cell and an animal cell. Use colors.',
    subject: 'Science',
    class: '8',
    section: 'A',
    assignedBy: 'Dr. Meena Gupta',
    assignedDate: '2026-08-03',
    dueDate: '2026-08-06',
    status: 'overdue',
    maxMarks: 10,
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
  remarks: 'Aarav has shown consistent improvement across subjects. Strong in Science and Mathematics. Should practice Hindi grammar more regularly.',
};

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
    content: 'PTM for Class 8 will be held on 20th August (Saturday) from 9:00 AM to 1:00 PM. Please bring your child\'s homework diary. Attendance is mandatory.',
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

export const mockTodayTimetable: TimetablePeriod[] = [
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
  { day: 'Monday', periods: mockTodayTimetable },
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
];

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
};

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
];

export const mockEventAlbums: EventAlbum[] = [
  { id: 'ALB001', title: 'Annual Sports Day 2026', date: '2026-02-15', coverPhoto: '/images/placeholder-event.png', photoCount: 45, videoCount: 3 },
  { id: 'ALB002', title: 'Republic Day Celebration', date: '2026-01-26', coverPhoto: '/images/placeholder-event.png', photoCount: 28, videoCount: 1 },
  { id: 'ALB003', title: 'Science Exhibition', date: '2026-03-10', coverPhoto: '/images/placeholder-event.png', photoCount: 62, videoCount: 5 },
];

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
    message: 'Due to IMD orange alert for heavy rainfall on 10th August, school will remain closed. Online classes will be conducted via Google Meet. Links will be shared by class teachers by 8 AM.',
    type: 'weather',
    severity: 'high',
    issuedAt: '2026-08-09 04:00 PM',
    expiresAt: '2026-08-10 06:00 PM',
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
    issuedAt: '2026-08-09 06:30 AM',
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
    issuedAt: '2026-08-08 10:00 AM',
    isActive: true,
    actionRequired: 'Send children in full-sleeve uniform. Apply mosquito repellent before school. Report fever immediately.',
    issuedBy: 'School Health Office',
  },
  {
    id: 'EA004',
    title: 'Water Supply Disruption',
    message: 'Municipal water supply will be disrupted on 7th August due to pipeline maintenance. School has arranged tanker water. Please send water bottles with children.',
    type: 'infrastructure',
    severity: 'low',
    issuedAt: '2026-08-06 02:00 PM',
    expiresAt: '2026-08-07 06:00 PM',
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
