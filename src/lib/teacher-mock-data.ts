export interface TeacherProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  employeeId: string;
  designation: string;
  department: string;
  photo?: string;
  joiningDate: string;
}

export interface ClassSection {
  id: string;
  class: string;
  section: string;
  totalStudents: number;
  isClassTeacher: boolean;
}

export interface TeacherTimetablePeriod {
  period: number;
  startTime: string;
  endTime: string;
  class: string;
  section: string;
  subject: string;
  room: string;
  type: 'class' | 'free' | 'break' | 'lunch';
}

export interface ClassAttendanceSummary {
  classSection: string;
  date: string;
  totalStudents: number;
  present: number;
  absent: number;
  late: number;
  isMarked: boolean;
}

export interface StudentBrief {
  id: string;
  name: string;
  rollNumber: string;
  class: string;
  section: string;
  photo?: string;
  parentPhone: string;
}

export interface HomeworkAssigned {
  id: string;
  title: string;
  subject: string;
  class: string;
  section: string;
  assignedDate: string;
  dueDate: string;
  totalStudents: number;
  submitted: number;
  evaluated: number;
  status: 'active' | 'past-due' | 'completed';
}

export interface SubmissionToReview {
  id: string;
  studentName: string;
  studentRoll: string;
  homeworkTitle: string;
  subject: string;
  classSection: string;
  submittedAt: string;
  status: 'pending-review' | 'reviewed';
}

export interface ClassPerformance {
  classSection: string;
  subject: string;
  avgPercentage: number;
  topperName: string;
  topperMarks: number;
  totalStudents: number;
  passCount: number;
  failCount: number;
}

export interface TeacherNotice {
  id: string;
  title: string;
  content: string;
  date: string;
  priority: 'normal' | 'high' | 'urgent';
  isRead: boolean;
}

export interface LeaveRequestToApprove {
  id: string;
  studentName: string;
  studentRoll: string;
  classSection: string;
  type: string;
  fromDate: string;
  toDate: string;
  reason: string;
  appliedDate: string;
  status: 'pending' | 'approved' | 'rejected';
  parentName: string;
  parentPhone: string;
}

export interface TeacherExam {
  id: string;
  name: string;
  subject: string;
  class: string;
  section: string;
  date: string;
  startTime: string;
  endTime: string;
  totalMarks: number;
  passingMarks: number;
  status: 'upcoming' | 'ongoing' | 'completed' | 'marks-entry';
  marksEntered: number;
  totalStudents: number;
}

export interface StudentMark {
  studentId: string;
  studentName: string;
  rollNumber: string;
  marksObtained: number | null;
  isAbsent: boolean;
  grade: string;
  remarks: string;
}

export interface StudyMaterial {
  id: string;
  title: string;
  subject: string;
  class: string;
  section: string;
  type: 'notes' | 'worksheet' | 'pdf' | 'video' | 'presentation' | 'question-bank';
  description: string;
  uploadDate: string;
  fileSize: string;
  downloads: number;
  chapter: string;
}

export interface StudentDetail {
  id: string;
  name: string;
  rollNumber: string;
  class: string;
  section: string;
  parentPhone: string;
  attendance: number;
  avgMarks: number;
  grade: string;
  homeworkCompletion: number;
  behaviorRating: 'excellent' | 'good' | 'average' | 'needs-improvement';
  recentExams: { examName: string; marks: number; total: number }[];
}

export interface LessonPlan {
  id: string;
  title: string;
  subject: string;
  class: string;
  section: string;
  date: string;
  period: number;
  chapter: string;
  topics: string[];
  objectives: string;
  methodology: string;
  materials: string;
  status: 'planned' | 'in-progress' | 'completed' | 'rescheduled';
}

export interface TeacherTask {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in-progress' | 'completed';
  category: 'academic' | 'administrative' | 'exam' | 'event';
}

export interface ParentMessage {
  id: string;
  parentName: string;
  studentName: string;
  classSection: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isOnline: boolean;
}

// ─── Mock Data ───

export const mockTeacher: TeacherProfile = {
  id: 'T001',
  name: 'Mrs. Priya Singh',
  email: 'priya.singh@school.edu',
  phone: '+91 98765 11111',
  subject: 'English',
  employeeId: 'EMP-2019-042',
  designation: 'Senior Teacher',
  department: 'Languages',
  joiningDate: '2019-07-15',
};

export const mockClasses: ClassSection[] = [
  { id: 'CS001', class: '8', section: 'A', totalStudents: 45, isClassTeacher: true },
  { id: 'CS002', class: '8', section: 'B', totalStudents: 42, isClassTeacher: false },
  { id: 'CS003', class: '9', section: 'A', totalStudents: 40, isClassTeacher: false },
  { id: 'CS004', class: '7', section: 'A', totalStudents: 44, isClassTeacher: false },
];

export const mockTeacherTimetable: TeacherTimetablePeriod[] = [
  { period: 1, startTime: '08:00', endTime: '08:40', class: '8', section: 'A', subject: 'English', room: 'Room 204', type: 'class' },
  { period: 2, startTime: '08:40', endTime: '09:20', class: '9', section: 'A', subject: 'English', room: 'Room 301', type: 'class' },
  { period: 3, startTime: '09:20', endTime: '10:00', class: '', section: '', subject: '', room: '', type: 'free' },
  { period: 0, startTime: '10:00', endTime: '10:20', class: '', section: '', subject: 'Break', room: '', type: 'break' },
  { period: 4, startTime: '10:20', endTime: '11:00', class: '8', section: 'B', subject: 'English', room: 'Room 205', type: 'class' },
  { period: 5, startTime: '11:00', endTime: '11:40', class: '7', section: 'A', subject: 'English', room: 'Room 104', type: 'class' },
  { period: 6, startTime: '11:40', endTime: '12:20', class: '', section: '', subject: '', room: '', type: 'free' },
  { period: 0, startTime: '12:20', endTime: '13:00', class: '', section: '', subject: 'Lunch', room: '', type: 'lunch' },
  { period: 7, startTime: '13:00', endTime: '13:40', class: '8', section: 'A', subject: 'English', room: 'Room 204', type: 'class' },
  { period: 8, startTime: '13:40', endTime: '14:20', class: '', section: '', subject: '', room: '', type: 'free' },
];

export const mockClassAttendance: ClassAttendanceSummary[] = [
  { classSection: '8-A', date: '2026-08-09', totalStudents: 45, present: 41, absent: 3, late: 1, isMarked: true },
  { classSection: '8-B', date: '2026-08-09', totalStudents: 42, present: 0, absent: 0, late: 0, isMarked: false },
  { classSection: '9-A', date: '2026-08-09', totalStudents: 40, present: 37, absent: 2, late: 1, isMarked: true },
  { classSection: '7-A', date: '2026-08-09', totalStudents: 44, present: 0, absent: 0, late: 0, isMarked: false },
];

export const mockStudentsBrief: StudentBrief[] = [
  { id: 'STU001', name: 'Aarav Sharma', rollNumber: '1', class: '8', section: 'A', parentPhone: '+91 98765 43210' },
  { id: 'STU002', name: 'Priya Patel', rollNumber: '2', class: '8', section: 'A', parentPhone: '+91 98765 43211' },
  { id: 'STU003', name: 'Rohan Gupta', rollNumber: '3', class: '8', section: 'A', parentPhone: '+91 98765 43212' },
  { id: 'STU004', name: 'Ananya Reddy', rollNumber: '4', class: '8', section: 'A', parentPhone: '+91 98765 43213' },
  { id: 'STU005', name: 'Vikram Singh', rollNumber: '5', class: '8', section: 'A', parentPhone: '+91 98765 43214' },
  { id: 'STU006', name: 'Sneha Joshi', rollNumber: '6', class: '8', section: 'A', parentPhone: '+91 98765 43215' },
  { id: 'STU007', name: 'Arjun Kumar', rollNumber: '7', class: '8', section: 'A', parentPhone: '+91 98765 43216' },
  { id: 'STU008', name: 'Meera Nair', rollNumber: '8', class: '8', section: 'A', parentPhone: '+91 98765 43217' },
];

export const mockHomeworkAssigned: HomeworkAssigned[] = [
  { id: 'THW001', title: 'Essay on Water Conservation', subject: 'English', class: '8', section: 'A', assignedDate: '2026-08-04', dueDate: '2026-08-08', totalStudents: 45, submitted: 38, evaluated: 30, status: 'past-due' },
  { id: 'THW002', title: 'Letter Writing Practice', subject: 'English', class: '8', section: 'B', assignedDate: '2026-08-06', dueDate: '2026-08-10', totalStudents: 42, submitted: 28, evaluated: 0, status: 'active' },
  { id: 'THW003', title: 'Comprehension Passage - Unit 5', subject: 'English', class: '9', section: 'A', assignedDate: '2026-08-07', dueDate: '2026-08-11', totalStudents: 40, submitted: 15, evaluated: 0, status: 'active' },
  { id: 'THW004', title: 'Grammar Worksheet - Tenses', subject: 'English', class: '7', section: 'A', assignedDate: '2026-08-05', dueDate: '2026-08-09', totalStudents: 44, submitted: 44, evaluated: 44, status: 'completed' },
  { id: 'THW005', title: 'Poetry Analysis - The Road Not Taken', subject: 'English', class: '8', section: 'A', assignedDate: '2026-08-08', dueDate: '2026-08-12', totalStudents: 45, submitted: 10, evaluated: 0, status: 'active' },
];

export const mockSubmissions: SubmissionToReview[] = [
  { id: 'SUB001', studentName: 'Aarav Sharma', studentRoll: '1', homeworkTitle: 'Letter Writing Practice', subject: 'English', classSection: '8-B', submittedAt: '2026-08-09 08:30 AM', status: 'pending-review' },
  { id: 'SUB002', studentName: 'Priya Patel', studentRoll: '2', homeworkTitle: 'Letter Writing Practice', subject: 'English', classSection: '8-B', submittedAt: '2026-08-09 07:45 AM', status: 'pending-review' },
  { id: 'SUB003', studentName: 'Rohan Gupta', studentRoll: '3', homeworkTitle: 'Comprehension Passage - Unit 5', subject: 'English', classSection: '9-A', submittedAt: '2026-08-08 09:00 PM', status: 'pending-review' },
  { id: 'SUB004', studentName: 'Ananya Reddy', studentRoll: '4', homeworkTitle: 'Essay on Water Conservation', subject: 'English', classSection: '8-A', submittedAt: '2026-08-08 06:30 PM', status: 'pending-review' },
  { id: 'SUB005', studentName: 'Vikram Singh', studentRoll: '5', homeworkTitle: 'Poetry Analysis - The Road Not Taken', subject: 'English', classSection: '8-A', submittedAt: '2026-08-09 09:15 AM', status: 'pending-review' },
];

export const mockClassPerformance: ClassPerformance[] = [
  { classSection: '8-A', subject: 'English', avgPercentage: 74.2, topperName: 'Priya Patel', topperMarks: 95, totalStudents: 45, passCount: 42, failCount: 3 },
  { classSection: '8-B', subject: 'English', avgPercentage: 68.5, topperName: 'Riya Kapoor', topperMarks: 91, totalStudents: 42, passCount: 38, failCount: 4 },
  { classSection: '9-A', subject: 'English', avgPercentage: 71.8, topperName: 'Aditya Mehta', topperMarks: 93, totalStudents: 40, passCount: 37, failCount: 3 },
  { classSection: '7-A', subject: 'English', avgPercentage: 76.1, topperName: 'Kavya Iyer', topperMarks: 97, totalStudents: 44, passCount: 43, failCount: 1 },
];

export const mockTeacherNotices: TeacherNotice[] = [
  { id: 'TN001', title: 'Staff Meeting — Monday 11th Aug', content: 'All teachers must attend the staff meeting in the conference room at 3 PM.', date: '2026-08-09', priority: 'high', isRead: false },
  { id: 'TN002', title: 'Submit Mid-Term Question Papers', content: 'Please submit mid-term question papers for review by 18th August.', date: '2026-08-08', priority: 'urgent', isRead: false },
  { id: 'TN003', title: 'Independence Day Rehearsal Schedule', content: 'Teachers assigned for cultural program must attend rehearsal on 12th Aug at 2 PM.', date: '2026-08-07', priority: 'normal', isRead: true },
  { id: 'TN004', title: 'PTM Scheduled — 20th August', content: 'Parent-Teacher Meeting is scheduled for 20th August from 10 AM to 1 PM. All class teachers must prepare student progress reports. Subject teachers should be available for discussion.', date: '2026-08-10', priority: 'high', isRead: false },
  { id: 'TN005', title: 'Annual Sports Day Committee', content: 'Teachers interested in being part of the Annual Sports Day committee, please register with the PE department by 15th August. We need volunteers for various events.', date: '2026-08-06', priority: 'normal', isRead: true },
  { id: 'TN006', title: 'Library Book Return Reminder', content: 'All faculty members must return overdue library books by 12th August. Late fees will be deducted from salary after the deadline.', date: '2026-08-05', priority: 'normal', isRead: true },
  { id: 'TN007', title: 'Salary Slip — July 2026 Available', content: 'July 2026 salary slips are now available on the HR portal. Please verify your details and report any discrepancies to the accounts department within 5 working days.', date: '2026-08-04', priority: 'normal', isRead: true },
  { id: 'TN008', title: 'Emergency Drill — 13th August', content: 'An emergency evacuation drill will be conducted on 13th August at 11:30 AM. All teachers must ensure orderly evacuation of students to the assembly ground. Fire safety marshals must be at their designated positions.', date: '2026-08-11', priority: 'urgent', isRead: false },
];

export const mockLeaveToApprove: LeaveRequestToApprove[] = [
  { id: 'TLA001', studentName: 'Sneha Joshi', studentRoll: '6', classSection: '8-A', type: 'sick', fromDate: '2026-08-11', toDate: '2026-08-12', reason: 'Child has viral fever. Doctor has advised 2 days rest.', appliedDate: '2026-08-09', status: 'pending', parentName: 'Mr. Amit Joshi', parentPhone: '+91 98765 43215' },
  { id: 'TLA002', studentName: 'Arjun Kumar', studentRoll: '7', classSection: '8-A', type: 'personal', fromDate: '2026-08-13', toDate: '2026-08-13', reason: 'Family wedding function.', appliedDate: '2026-08-08', status: 'pending', parentName: 'Mrs. Sunita Kumar', parentPhone: '+91 98765 43216' },
  { id: 'TLA003', studentName: 'Priya Patel', studentRoll: '2', classSection: '8-A', type: 'sick', fromDate: '2026-08-06', toDate: '2026-08-07', reason: 'Stomach infection. Doctor prescribed rest.', appliedDate: '2026-08-05', status: 'approved', parentName: 'Mrs. Patel', parentPhone: '+91 98765 43211' },
  { id: 'TLA004', studentName: 'Rohan Gupta', studentRoll: '3', classSection: '8-A', type: 'personal', fromDate: '2026-08-04', toDate: '2026-08-04', reason: 'Passport renewal appointment.', appliedDate: '2026-08-02', status: 'approved', parentName: 'Mr. Gupta', parentPhone: '+91 98765 43212' },
  { id: 'TLA005', studentName: 'Vikram Singh', studentRoll: '5', classSection: '8-A', type: 'sick', fromDate: '2026-08-01', toDate: '2026-08-03', reason: 'Dengue fever. Under treatment.', appliedDate: '2026-07-31', status: 'approved', parentName: 'Mr. Harpreet Singh', parentPhone: '+91 98765 43214' },
  { id: 'TLA006', studentName: 'Meera Nair', studentRoll: '8', classSection: '8-A', type: 'personal', fromDate: '2026-08-14', toDate: '2026-08-15', reason: 'Family visiting from Kerala, need to pick up from airport.', appliedDate: '2026-08-10', status: 'pending', parentName: 'Mr. Nair', parentPhone: '+91 98765 43217' },
  { id: 'TLA007', studentName: 'Ananya Reddy', studentRoll: '4', classSection: '9-A', type: 'sick', fromDate: '2026-07-28', toDate: '2026-07-28', reason: 'Severe headache and vomiting.', appliedDate: '2026-07-28', status: 'rejected', parentName: 'Mrs. Lakshmi Reddy', parentPhone: '+91 98765 43213' },
];

export const mockTeacherExams: TeacherExam[] = [
  { id: 'EX001', name: 'Mid-Term Examination', subject: 'English', class: '8', section: 'A', date: '2026-08-25', startTime: '09:00', endTime: '11:00', totalMarks: 100, passingMarks: 33, status: 'upcoming', marksEntered: 0, totalStudents: 45 },
  { id: 'EX002', name: 'Mid-Term Examination', subject: 'English', class: '8', section: 'B', date: '2026-08-25', startTime: '09:00', endTime: '11:00', totalMarks: 100, passingMarks: 33, status: 'upcoming', marksEntered: 0, totalStudents: 42 },
  { id: 'EX003', name: 'Mid-Term Examination', subject: 'English', class: '9', section: 'A', date: '2026-08-26', startTime: '09:00', endTime: '11:00', totalMarks: 100, passingMarks: 33, status: 'upcoming', marksEntered: 0, totalStudents: 40 },
  { id: 'EX004', name: 'Unit Test 2', subject: 'English', class: '8', section: 'A', date: '2026-08-01', startTime: '09:00', endTime: '10:00', totalMarks: 50, passingMarks: 17, status: 'marks-entry', marksEntered: 38, totalStudents: 45 },
  { id: 'EX005', name: 'Unit Test 2', subject: 'English', class: '8', section: 'B', date: '2026-08-01', startTime: '09:00', endTime: '10:00', totalMarks: 50, passingMarks: 17, status: 'completed', marksEntered: 42, totalStudents: 42 },
  { id: 'EX006', name: 'Unit Test 2', subject: 'English', class: '9', section: 'A', date: '2026-08-02', startTime: '09:00', endTime: '10:00', totalMarks: 50, passingMarks: 17, status: 'completed', marksEntered: 40, totalStudents: 40 },
  { id: 'EX007', name: 'Unit Test 1', subject: 'English', class: '8', section: 'A', date: '2026-06-15', startTime: '09:00', endTime: '10:00', totalMarks: 50, passingMarks: 17, status: 'completed', marksEntered: 45, totalStudents: 45 },
  { id: 'EX008', name: 'Mid-Term Examination', subject: 'English', class: '7', section: 'A', date: '2026-08-26', startTime: '11:00', endTime: '13:00', totalMarks: 100, passingMarks: 33, status: 'upcoming', marksEntered: 0, totalStudents: 44 },
];

export const mockStudyMaterials: StudyMaterial[] = [
  { id: 'SM001', title: 'Tenses — Complete Notes', subject: 'English', class: '8', section: 'A', type: 'notes', description: 'Comprehensive notes covering all 12 tenses with examples and exercises.', uploadDate: '2026-08-05', fileSize: '2.4 MB', downloads: 38, chapter: 'Grammar' },
  { id: 'SM002', title: 'The Road Not Taken — Analysis', subject: 'English', class: '8', section: 'A', type: 'pdf', description: 'Detailed poem analysis with literary devices, themes and question answers.', uploadDate: '2026-08-07', fileSize: '1.1 MB', downloads: 42, chapter: 'Poetry' },
  { id: 'SM003', title: 'Letter Writing Format & Samples', subject: 'English', class: '8', section: 'B', type: 'notes', description: 'Formal and informal letter writing formats with 10 sample letters.', uploadDate: '2026-08-03', fileSize: '1.8 MB', downloads: 35, chapter: 'Writing Skills' },
  { id: 'SM004', title: 'Comprehension Practice Set', subject: 'English', class: '9', section: 'A', type: 'worksheet', description: '15 unseen passages with multiple choice and short answer questions.', uploadDate: '2026-08-06', fileSize: '3.2 MB', downloads: 28, chapter: 'Reading' },
  { id: 'SM005', title: 'Mid-Term Question Bank', subject: 'English', class: '8', section: 'A', type: 'question-bank', description: 'Previous year questions and expected questions for mid-term exam.', uploadDate: '2026-08-08', fileSize: '4.5 MB', downloads: 44, chapter: 'Exam Prep' },
  { id: 'SM006', title: 'Active & Passive Voice', subject: 'English', class: '7', section: 'A', type: 'worksheet', description: 'Practice worksheet with 50 sentences for voice conversion.', uploadDate: '2026-08-04', fileSize: '890 KB', downloads: 40, chapter: 'Grammar' },
  { id: 'SM007', title: 'Story Writing Tips & Examples', subject: 'English', class: '8', section: 'A', type: 'presentation', description: 'Presentation on creative story writing with structure and examples.', uploadDate: '2026-08-02', fileSize: '5.6 MB', downloads: 33, chapter: 'Creative Writing' },
  { id: 'SM008', title: 'Unit 5 — Summary & Notes', subject: 'English', class: '9', section: 'A', type: 'notes', description: 'Chapter summary, character analysis and important Q&A.', uploadDate: '2026-08-09', fileSize: '1.5 MB', downloads: 18, chapter: 'Prose' },
];

export const mockStudentMarks: StudentMark[] = [
  { studentId: 'STU001', studentName: 'Aarav Sharma', rollNumber: '1', marksObtained: 42, isAbsent: false, grade: 'A', remarks: '' },
  { studentId: 'STU002', studentName: 'Priya Patel', rollNumber: '2', marksObtained: 48, isAbsent: false, grade: 'A+', remarks: 'Excellent' },
  { studentId: 'STU003', studentName: 'Rohan Gupta', rollNumber: '3', marksObtained: 35, isAbsent: false, grade: 'B', remarks: '' },
  { studentId: 'STU004', studentName: 'Ananya Reddy', rollNumber: '4', marksObtained: 44, isAbsent: false, grade: 'A', remarks: '' },
  { studentId: 'STU005', studentName: 'Vikram Singh', rollNumber: '5', marksObtained: 28, isAbsent: false, grade: 'C', remarks: 'Needs improvement' },
  { studentId: 'STU006', studentName: 'Sneha Joshi', rollNumber: '6', marksObtained: null, isAbsent: true, grade: 'AB', remarks: 'Absent - Medical' },
  { studentId: 'STU007', studentName: 'Arjun Kumar', rollNumber: '7', marksObtained: 39, isAbsent: false, grade: 'B+', remarks: '' },
  { studentId: 'STU008', studentName: 'Meera Nair', rollNumber: '8', marksObtained: 46, isAbsent: false, grade: 'A+', remarks: '' },
];

export const mockStudentDetails: StudentDetail[] = [
  { id: 'STU001', name: 'Aarav Sharma', rollNumber: '1', class: '8', section: 'A', parentPhone: '+91 98765 43210', attendance: 92, avgMarks: 78, grade: 'A', homeworkCompletion: 85, behaviorRating: 'good', recentExams: [{ examName: 'Unit Test 1', marks: 42, total: 50 }, { examName: 'Unit Test 2', marks: 38, total: 50 }] },
  { id: 'STU002', name: 'Priya Patel', rollNumber: '2', class: '8', section: 'A', parentPhone: '+91 98765 43211', attendance: 97, avgMarks: 94, grade: 'A+', homeworkCompletion: 100, behaviorRating: 'excellent', recentExams: [{ examName: 'Unit Test 1', marks: 48, total: 50 }, { examName: 'Unit Test 2', marks: 47, total: 50 }] },
  { id: 'STU003', name: 'Rohan Gupta', rollNumber: '3', class: '8', section: 'A', parentPhone: '+91 98765 43212', attendance: 88, avgMarks: 65, grade: 'B', homeworkCompletion: 70, behaviorRating: 'average', recentExams: [{ examName: 'Unit Test 1', marks: 35, total: 50 }, { examName: 'Unit Test 2', marks: 30, total: 50 }] },
  { id: 'STU004', name: 'Ananya Reddy', rollNumber: '4', class: '8', section: 'A', parentPhone: '+91 98765 43213', attendance: 95, avgMarks: 86, grade: 'A', homeworkCompletion: 90, behaviorRating: 'excellent', recentExams: [{ examName: 'Unit Test 1', marks: 44, total: 50 }, { examName: 'Unit Test 2', marks: 43, total: 50 }] },
  { id: 'STU005', name: 'Vikram Singh', rollNumber: '5', class: '8', section: 'A', parentPhone: '+91 98765 43214', attendance: 78, avgMarks: 52, grade: 'C', homeworkCompletion: 55, behaviorRating: 'needs-improvement', recentExams: [{ examName: 'Unit Test 1', marks: 28, total: 50 }, { examName: 'Unit Test 2', marks: 25, total: 50 }] },
  { id: 'STU006', name: 'Sneha Joshi', rollNumber: '6', class: '8', section: 'A', parentPhone: '+91 98765 43215', attendance: 85, avgMarks: 72, grade: 'B+', homeworkCompletion: 80, behaviorRating: 'good', recentExams: [{ examName: 'Unit Test 1', marks: 38, total: 50 }, { examName: 'Unit Test 2', marks: 34, total: 50 }] },
  { id: 'STU007', name: 'Arjun Kumar', rollNumber: '7', class: '8', section: 'A', parentPhone: '+91 98765 43216', attendance: 91, avgMarks: 76, grade: 'A-', homeworkCompletion: 82, behaviorRating: 'good', recentExams: [{ examName: 'Unit Test 1', marks: 39, total: 50 }, { examName: 'Unit Test 2', marks: 37, total: 50 }] },
  { id: 'STU008', name: 'Meera Nair', rollNumber: '8', class: '8', section: 'A', parentPhone: '+91 98765 43217', attendance: 96, avgMarks: 91, grade: 'A+', homeworkCompletion: 95, behaviorRating: 'excellent', recentExams: [{ examName: 'Unit Test 1', marks: 46, total: 50 }, { examName: 'Unit Test 2', marks: 45, total: 50 }] },
  { id: 'STU009', name: 'Riya Kapoor', rollNumber: '9', class: '8', section: 'B', parentPhone: '+91 98765 43218', attendance: 93, avgMarks: 88, grade: 'A', homeworkCompletion: 88, behaviorRating: 'excellent', recentExams: [{ examName: 'Unit Test 1', marks: 45, total: 50 }, { examName: 'Unit Test 2', marks: 43, total: 50 }] },
  { id: 'STU010', name: 'Aditya Mehta', rollNumber: '1', class: '9', section: 'A', parentPhone: '+91 98765 43219', attendance: 94, avgMarks: 82, grade: 'A', homeworkCompletion: 78, behaviorRating: 'good', recentExams: [{ examName: 'Unit Test 1', marks: 41, total: 50 }, { examName: 'Unit Test 2', marks: 40, total: 50 }] },
  { id: 'STU011', name: 'Kavya Iyer', rollNumber: '1', class: '7', section: 'A', parentPhone: '+91 98765 43220', attendance: 98, avgMarks: 95, grade: 'A+', homeworkCompletion: 100, behaviorRating: 'excellent', recentExams: [{ examName: 'Unit Test 1', marks: 49, total: 50 }, { examName: 'Unit Test 2', marks: 47, total: 50 }] },
  { id: 'STU012', name: 'Harsh Verma', rollNumber: '2', class: '9', section: 'A', parentPhone: '+91 98765 43221', attendance: 80, avgMarks: 48, grade: 'D', homeworkCompletion: 45, behaviorRating: 'needs-improvement', recentExams: [{ examName: 'Unit Test 1', marks: 22, total: 50 }, { examName: 'Unit Test 2', marks: 26, total: 50 }] },
];

export const mockLessonPlans: LessonPlan[] = [
  { id: 'LP001', title: 'Introduction to Tenses', subject: 'English', class: '8', section: 'A', date: '2026-08-13', period: 1, chapter: 'Grammar', topics: ['Present Tense', 'Past Tense', 'Future Tense'], objectives: 'Students will understand and differentiate between 12 types of tenses.', methodology: 'Interactive examples, group practice, worksheets', materials: 'Whiteboard, printed worksheets, grammar textbook', status: 'planned' },
  { id: 'LP002', title: 'The Road Not Taken — Poem Analysis', subject: 'English', class: '8', section: 'A', date: '2026-08-13', period: 7, chapter: 'Poetry', topics: ['Theme', 'Literary Devices', 'Critical Analysis'], objectives: 'Students will identify metaphors and analyze the poem\'s deeper meaning.', methodology: 'Reading aloud, class discussion, annotation exercise', materials: 'Poetry textbook, annotation handout', status: 'planned' },
  { id: 'LP003', title: 'Comprehension Skills — Unseen Passages', subject: 'English', class: '9', section: 'A', date: '2026-08-13', period: 2, chapter: 'Reading', topics: ['Scanning', 'Inference', 'Vocabulary in Context'], objectives: 'Improve reading comprehension speed and accuracy.', methodology: 'Timed reading practice, MCQ solving, discussion', materials: 'Printed passages, timer, answer sheets', status: 'in-progress' },
  { id: 'LP004', title: 'Letter Writing — Formal Letters', subject: 'English', class: '8', section: 'B', date: '2026-08-14', period: 4, chapter: 'Writing Skills', topics: ['Format', 'Tone', 'Common Topics'], objectives: 'Students will write a properly formatted formal letter.', methodology: 'Demo writing on board, individual practice, peer review', materials: 'Letter format chart, sample letters', status: 'planned' },
  { id: 'LP005', title: 'Active & Passive Voice', subject: 'English', class: '7', section: 'A', date: '2026-08-14', period: 5, chapter: 'Grammar', topics: ['Rules', 'Conversion', 'Practice'], objectives: 'Convert sentences between active and passive voice accurately.', methodology: 'Rule explanation, conversion practice, quiz', materials: 'Grammar book, practice worksheet', status: 'planned' },
  { id: 'LP006', title: 'Essay Writing — Structure', subject: 'English', class: '8', section: 'A', date: '2026-08-11', period: 1, chapter: 'Writing Skills', topics: ['Introduction', 'Body Paragraphs', 'Conclusion'], objectives: 'Learn the 5-paragraph essay structure.', methodology: 'Model essay analysis, outline creation, peer feedback', materials: 'Sample essays, outline templates', status: 'completed' },
  { id: 'LP007', title: 'Unit 5 — Prose Discussion', subject: 'English', class: '9', section: 'A', date: '2026-08-12', period: 2, chapter: 'Prose', topics: ['Character Analysis', 'Plot Summary', 'Themes'], objectives: 'Deep understanding of the prose chapter with Q&A preparation.', methodology: 'Group discussion, character mapping, Q&A practice', materials: 'Textbook, character map handout', status: 'completed' },
  { id: 'LP008', title: 'Story Writing Workshop', subject: 'English', class: '8', section: 'A', date: '2026-08-15', period: 1, chapter: 'Creative Writing', topics: ['Plot Development', 'Character Creation', 'Dialogue Writing'], objectives: 'Write a creative short story with proper structure.', methodology: 'Brainstorming, individual writing, sharing & feedback', materials: 'Story starter cards, writing sheets', status: 'planned' },
];

export const mockTeacherTasks: TeacherTask[] = [
  { id: 'TT001', title: 'Submit Mid-Term Question Paper', description: 'Prepare and submit English mid-term question paper for Class 8 to HOD.', dueDate: '2026-08-18', priority: 'high', status: 'in-progress', category: 'exam' },
  { id: 'TT002', title: 'Complete Unit Test 2 Marks Entry', description: 'Enter remaining marks for Class 8-A Unit Test 2 in the system.', dueDate: '2026-08-14', priority: 'high', status: 'pending', category: 'academic' },
  { id: 'TT003', title: 'Prepare Independence Day Speech', description: 'Write and rehearse the English speech for Independence Day celebration.', dueDate: '2026-08-14', priority: 'medium', status: 'pending', category: 'event' },
  { id: 'TT004', title: 'Update Attendance Records', description: 'Verify and update August attendance records for all classes.', dueDate: '2026-08-15', priority: 'medium', status: 'pending', category: 'administrative' },
  { id: 'TT005', title: 'Review Homework Submissions', description: 'Evaluate pending essay submissions from Class 8-A.', dueDate: '2026-08-13', priority: 'high', status: 'in-progress', category: 'academic' },
  { id: 'TT006', title: 'PTM Preparation', description: 'Prepare student progress reports and talking points for upcoming PTM.', dueDate: '2026-08-19', priority: 'medium', status: 'pending', category: 'administrative' },
  { id: 'TT007', title: 'Upload Study Material — Unit 6', description: 'Create and upload notes and worksheet for Unit 6 Prose chapter.', dueDate: '2026-08-16', priority: 'low', status: 'pending', category: 'academic' },
  { id: 'TT008', title: 'Staff Meeting Notes', description: 'Prepare minutes of Monday staff meeting and share with department.', dueDate: '2026-08-12', priority: 'low', status: 'completed', category: 'administrative' },
];

export const mockParentMessages: ParentMessage[] = [
  { id: 'PM001', parentName: 'Rajesh Sharma', studentName: 'Aarav Sharma', classSection: '8-A', lastMessage: 'Thank you for the update on Aarav\'s progress.', lastMessageTime: '2026-08-09 09:30 AM', unreadCount: 1, isOnline: true },
  { id: 'PM002', parentName: 'Mrs. Patel', studentName: 'Priya Patel', classSection: '8-A', lastMessage: 'When is the PTM scheduled?', lastMessageTime: '2026-08-08 04:00 PM', unreadCount: 2, isOnline: false },
  { id: 'PM003', parentName: 'Mr. Gupta', studentName: 'Rohan Gupta', classSection: '8-A', lastMessage: 'Noted, will send the project materials.', lastMessageTime: '2026-08-08 11:00 AM', unreadCount: 0, isOnline: true },
];
