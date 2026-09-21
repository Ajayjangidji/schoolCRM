export interface Student {
  id: string;
  name: string;
  rollNumber: string;
  class: string;
  section: string;
  photo?: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  bloodGroup?: string;
  parentId: string;
}

export interface Parent {
  id: string;
  name: string;
  email: string;
  phone: string;
  relation: 'father' | 'mother' | 'guardian';
  children: Student[];
  photo?: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  date: string;
  status: 'present' | 'absent' | 'late' | 'half-day' | 'holiday' | 'leave';
  checkInTime?: string;
  markedBy?: string;
}

export interface AttendanceStats {
  totalDays: number;
  present: number;
  absent: number;
  late: number;
  percentage: number;
}

export interface Homework {
  id: string;
  title: string;
  description: string;
  subject: string;
  class: string;
  section: string;
  assignedBy: string;
  assignedDate: string;
  dueDate: string;
  status: 'pending' | 'submitted' | 'evaluated' | 'overdue';
  maxMarks?: number;
  obtainedMarks?: number;
  grade?: string;
  remarks?: string;
  attachments?: Attachment[];
  submissionAttachments?: Attachment[];
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: 'pdf' | 'image' | 'doc' | 'video';
  size: number;
}

export interface SubjectMarks {
  subject: string;
  theory: number;
  practical?: number;
  internal?: number;
  total: number;
  maxMarks: number;
  percentage: number;
  grade: string;
}

export interface ExamResult {
  id: string;
  examName: string;
  examType: 'unit-test' | 'mid-term' | 'final' | 'quarterly';
  class: string;
  section: string;
  subjects: SubjectMarks[];
  totalPercentage: number;
  overallGrade: string;
  rank?: number;
  remarks?: string;
  examDate?: string;
  classAverage?: number;
  classSize?: number;
}

export interface FeeHead {
  id: string;
  name: string;
  amount: number;
  frequency: 'monthly' | 'quarterly' | 'half-yearly' | 'annual' | 'one-time';
}

export interface FeeInstallment {
  id: string;
  label: string;
  amount: number;
  dueDate: string;
  status: 'paid' | 'pending' | 'overdue' | 'partial';
  paidAmount: number;
  paidDate?: string;
  transactionId?: string;
  paymentMode?: 'upi' | 'card' | 'netbanking' | 'cash' | 'cheque';
  lateFee: number;
}

export interface FeeDetails {
  totalAnnualFee: number;
  totalPaid: number;
  totalBalance: number;
  installments: FeeInstallment[];
  feeHeads: FeeHead[];
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  category: 'holiday' | 'exam' | 'event' | 'circular' | 'fee' | 'general';
  priority: 'normal' | 'high' | 'urgent';
  postedDate: string;
  expiryDate?: string;
  isPinned: boolean;
  isRead: boolean;
  attachments?: Attachment[];
  requiresAcknowledgement: boolean;
  isAcknowledged?: boolean;
}

export interface LeaveRequest {
  id: string;
  studentId: string;
  type: 'sick' | 'personal' | 'family-emergency' | 'religious' | 'other';
  fromDate: string;
  toDate: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  appliedDate: string;
  approvedBy?: string;
  approverRemarks?: string;
  attachment?: Attachment;
}

export interface TimetablePeriod {
  period: number;
  startTime: string;
  endTime: string;
  subject: string;
  teacher: string;
  type: 'class' | 'break' | 'lunch' | 'assembly';
  room?: string;
  isSubstitution?: boolean;
  originalTeacher?: string;
}

export interface DayTimetable {
  day: string;
  periods: TimetablePeriod[];
}

export interface ExamScheduleItem {
  id: string;
  subject: string;
  date: string;
  startTime: string;
  endTime: string;
  examType: string;
  syllabus?: string;
}

export interface TransportInfo {
  busNumber: string;
  routeName: string;
  driverName: string;
  driverPhone: string;
  attendantName?: string;
  attendantPhone?: string;
  pickupStop: string;
  pickupTime: string;
  dropStop: string;
  dropTime: string;
  vehicleNumber: string;
  vehicleModel: string;
  vehicleCapacity: number;
  driverAddress: string;
  driverLicenseNo: string;
  driverExperienceYears: number;
  attendantAddress?: string;
}

export interface Holiday {
  id: string;
  name: string;
  date: string;
  endDate?: string;
  type: 'national' | 'festival' | 'school' | 'vacation';
  description?: string;
}

export interface BusLocation {
  latitude: number;
  longitude: number;
  speed: number;
  lastUpdated: string;
  status: 'moving' | 'stopped' | 'offline';
  currentStop?: string;
  eta?: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'parent' | 'teacher';
  content: string;
  timestamp: string;
  type: 'text' | 'image' | 'file' | 'voice';
  attachment?: Attachment;
  isRead: boolean;
}

export interface ChatThread {
  id: string;
  teacherName: string;
  teacherSubject: string;
  teacherPhoto?: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isOnline: boolean;
}

export interface Document {
  id: string;
  name: string;
  category: 'report-card' | 'fee-receipt' | 'certificate' | 'tc' | 'id-card' | 'medical';
  uploadDate: string;
  fileType: 'pdf' | 'image';
  fileSize: number;
  downloadUrl: string;
}

export interface EventAlbum {
  id: string;
  title: string;
  date: string;
  coverPhoto: string;
  photoCount: number;
  videoCount: number;
}

export interface DailySummary {
  date: string;
  attendance: {
    status: 'present' | 'absent' | 'late';
    checkInTime?: string;
  };
  homework: {
    newCount: number;
    pendingCount: number;
    subjects: string[];
  };
  announcements: {
    count: number;
    titles: string[];
  };
  upcomingExam?: {
    subject: string;
    date: string;
    daysLeft: number;
  };
  feeDue?: {
    amount: number;
    dueDate: string;
  };
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'attendance' | 'homework' | 'fee' | 'notice' | 'leave' | 'exam' | 'transport' | 'chat' | 'emergency';
  priority: 'low' | 'normal' | 'important' | 'critical';
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
}

export interface EmergencyAlert {
  id: string;
  title: string;
  message: string;
  type: 'weather' | 'security' | 'health' | 'transport' | 'infrastructure' | 'general';
  severity: 'low' | 'medium' | 'high' | 'critical';
  issuedAt: string;
  expiresAt?: string;
  isActive: boolean;
  actionRequired?: string;
  issuedBy: string;
}

export interface EmergencyContact {
  id: string;
  name: string;
  role: string;
  phone: string;
  isAvailable: boolean;
  type: 'school' | 'medical' | 'transport' | 'admin';
}

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  category?: string;
}

export type SubjectColor =
  | 'math'
  | 'science'
  | 'english'
  | 'hindi'
  | 'social'
  | 'computer'
  | 'art'
  | 'sports';

export interface AttendanceAlert {
  id: string;
  date: string;
  message: string;
  channels: Array<'push' | 'sms' | 'email'>;
  sentAt: string;
}

export interface ExamTrendPoint {
  id: string;
  examName: string;
  shortLabel: string;
  totalPercentage: number;
  classAverage: number;
  subjects: Array<{ subject: string; percentage: number }>;
}

export interface BusStop {
  id: string;
  name: string;
  x: number;
  y: number;
  pickupTime: string;
  dropTime: string;
  isChildStop?: boolean;
  isSchool?: boolean;
}

export type BusTripKey = 'morning' | 'afternoon';

export interface BusLiveState {
  progress: number;
  speedKmph: number;
  status: 'moving' | 'stopped' | 'offline';
  lastUpdated: string;
}

export interface UpcomingEvent {
  id: string;
  title: string;
  date: string;
  time?: string;
  type: 'exam' | 'holiday' | 'event' | 'ptm';
}

export interface MediaItem {
  id: string;
  albumId: string;
  type: 'photo' | 'video';
  caption: string;
  duration?: string;
  hue: number;
}

export interface NotificationPreferences {
  attendanceAlerts: boolean;
  homeworkReminders: boolean;
  feeReminders: boolean;
  noticeUpdates: boolean;
  transportAlerts: boolean;
  chatMessages: boolean;
  dailySummary: boolean;
  dailySummaryTime: string;
  channels: { push: boolean; sms: boolean; email: boolean };
}

export interface SupportInfo {
  phone: string;
  email: string;
  hours: string;
  faqs: Array<{ id: string; question: string; answer: string }>;
}
