export const NAV_ITEMS = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: 'dashboard',
  },
  {
    label: 'Attendance',
    href: '/attendance',
    icon: 'attendance',
  },
  {
    label: 'Homework',
    href: '/homework',
    icon: 'homework',
  },
  {
    label: 'Academic Progress',
    href: '/academic',
    icon: 'academic',
  },
  {
    label: 'Exams & Results',
    href: '/results',
    icon: 'results',
  },
  {
    label: 'Fees',
    href: '/fees',
    icon: 'fees',
  },
  {
    label: 'Notices',
    href: '/notices',
    icon: 'notices',
  },
  {
    label: 'Holiday Calendar',
    href: '/holidays',
    icon: 'holidays',
  },
  {
    label: 'Leave Request',
    href: '/leave',
    icon: 'leave',
  },
  {
    label: 'Timetable',
    href: '/timetable',
    icon: 'timetable',
  },
  {
    label: 'Transport',
    href: '/transport',
    icon: 'transport',
  },
  {
    label: 'Chat',
    href: '/chat',
    icon: 'chat',
  },
  {
    label: 'Documents',
    href: '/documents',
    icon: 'documents',
  },
  {
    label: 'Gallery',
    href: '/gallery',
    icon: 'gallery',
  },
  {
    label: 'AI Assistant',
    href: '/ai-assistant',
    icon: 'ai',
  },
  {
    label: 'Daily Summary',
    href: '/daily-summary',
    icon: 'summary',
  },
  {
    label: 'Emergency',
    href: '/emergency',
    icon: 'emergency',
  },
] as const;

export const HOMEWORK_STATUS_LABELS: Record<string, string> = {
  pending: 'Pending',
  submitted: 'Submitted',
  evaluated: 'Evaluated',
  overdue: 'Overdue',
};

export const LEAVE_TYPE_LABELS: Record<string, string> = {
  sick: 'Sick Leave',
  personal: 'Personal',
  'family-emergency': 'Family Emergency',
  religious: 'Religious',
  other: 'Other',
};

export const FEE_STATUS_LABELS: Record<string, string> = {
  paid: 'Paid',
  pending: 'Pending',
  overdue: 'Overdue',
  partial: 'Partial',
};

export const NOTICE_CATEGORY_LABELS: Record<string, string> = {
  holiday: 'Holiday',
  exam: 'Exam',
  event: 'Event',
  circular: 'Circular',
  fee: 'Fee',
  general: 'General',
};

export const ATTENDANCE_STATUS_LABELS: Record<string, string> = {
  present: 'Present',
  absent: 'Absent',
  late: 'Late',
  'half-day': 'Half Day',
  holiday: 'Holiday',
  leave: 'On Leave',
};
