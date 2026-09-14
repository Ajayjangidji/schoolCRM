// ── Admin Mock Data ──

export interface SchoolStats {
  totalStudents: number;
  totalTeachers: number;
  totalClasses: number;
  totalRevenue: number;
  monthlyFeeCollection: number;
  pendingFees: number;
  avgAttendance: number;
  newAdmissions: number;
}

export interface ClassWiseData {
  class: string;
  section: string;
  totalStudents: number;
  avgAttendance: number;
  avgMarks: number;
  classTeacher: string;
}

export interface RecentActivity {
  id: string;
  type: 'admission' | 'fee' | 'attendance' | 'notice' | 'exam' | 'leave';
  title: string;
  description: string;
  timestamp: string;
}

export interface FeeOverview {
  month: string;
  collected: number;
  pending: number;
  total: number;
}

export interface AdminStudent {
  id: string;
  name: string;
  rollNumber: string;
  class: string;
  section: string;
  gender: 'Male' | 'Female';
  dob: string;
  admissionDate: string;
  fatherName: string;
  motherName: string;
  phone: string;
  email: string;
  address: string;
  bloodGroup: string;
  attendance: number;
  avgMarks: number;
  feeStatus: 'paid' | 'pending' | 'overdue';
  lastFeeDate: string;
  status: 'active' | 'inactive';
}

export interface EnrollmentTrend {
  year: string;
  students: number;
}

export const mockSchoolStats: SchoolStats = {
  totalStudents: 2847,
  totalTeachers: 128,
  totalClasses: 64,
  totalRevenue: 4250000,
  monthlyFeeCollection: 1850000,
  pendingFees: 620000,
  avgAttendance: 91.3,
  newAdmissions: 342,
};

export const mockClassWiseData: ClassWiseData[] = [
  { class: '1', section: 'A', totalStudents: 42, avgAttendance: 94, avgMarks: 82, classTeacher: 'Mrs. Priya Sharma' },
  { class: '1', section: 'B', totalStudents: 40, avgAttendance: 92, avgMarks: 79, classTeacher: 'Mrs. Sunita Verma' },
  { class: '2', section: 'A', totalStudents: 44, avgAttendance: 91, avgMarks: 81, classTeacher: 'Mr. Rajesh Kumar' },
  { class: '2', section: 'B', totalStudents: 43, avgAttendance: 93, avgMarks: 80, classTeacher: 'Mrs. Neha Gupta' },
  { class: '3', section: 'A', totalStudents: 45, avgAttendance: 90, avgMarks: 78, classTeacher: 'Mr. Amit Singh' },
  { class: '3', section: 'B', totalStudents: 44, avgAttendance: 89, avgMarks: 77, classTeacher: 'Mrs. Kavita Joshi' },
  { class: '4', section: 'A', totalStudents: 46, avgAttendance: 92, avgMarks: 76, classTeacher: 'Mr. Vikram Patel' },
  { class: '4', section: 'B', totalStudents: 45, avgAttendance: 90, avgMarks: 75, classTeacher: 'Mrs. Anita Reddy' },
  { class: '5', section: 'A', totalStudents: 47, avgAttendance: 91, avgMarks: 74, classTeacher: 'Mr. Suresh Yadav' },
  { class: '5', section: 'B', totalStudents: 46, avgAttendance: 88, avgMarks: 73, classTeacher: 'Mrs. Deepa Nair' },
  { class: '6', section: 'A', totalStudents: 44, avgAttendance: 90, avgMarks: 72, classTeacher: 'Mr. Manoj Tiwari' },
  { class: '6', section: 'B', totalStudents: 43, avgAttendance: 91, avgMarks: 71, classTeacher: 'Mrs. Rekha Das' },
  { class: '7', section: 'A', totalStudents: 45, avgAttendance: 89, avgMarks: 70, classTeacher: 'Mr. Arun Mehta' },
  { class: '7', section: 'B', totalStudents: 44, avgAttendance: 90, avgMarks: 69, classTeacher: 'Mrs. Seema Iyer' },
  { class: '8', section: 'A', totalStudents: 46, avgAttendance: 92, avgMarks: 73, classTeacher: 'Mr. Ramesh Chauhan' },
  { class: '8', section: 'B', totalStudents: 45, avgAttendance: 91, avgMarks: 72, classTeacher: 'Mrs. Pooja Saxena' },
  { class: '9', section: 'A', totalStudents: 44, avgAttendance: 93, avgMarks: 75, classTeacher: 'Mr. Dinesh Jha' },
  { class: '9', section: 'B', totalStudents: 43, avgAttendance: 90, avgMarks: 74, classTeacher: 'Mrs. Rashmi Bhat' },
  { class: '10', section: 'A', totalStudents: 45, avgAttendance: 94, avgMarks: 78, classTeacher: 'Mr. Gopal Mishra' },
  { class: '10', section: 'B', totalStudents: 44, avgAttendance: 93, avgMarks: 77, classTeacher: 'Mrs. Meera Kapoor' },
  { class: '11', section: 'A', totalStudents: 42, avgAttendance: 91, avgMarks: 72, classTeacher: 'Mr. Sanjay Dubey' },
  { class: '11', section: 'B', totalStudents: 41, avgAttendance: 89, avgMarks: 70, classTeacher: 'Mrs. Lata Pillai' },
  { class: '12', section: 'A', totalStudents: 40, avgAttendance: 95, avgMarks: 76, classTeacher: 'Mr. Prakash Rao' },
  { class: '12', section: 'B', totalStudents: 39, avgAttendance: 94, avgMarks: 75, classTeacher: 'Mrs. Gayatri Menon' },
];

export const mockRecentActivities: RecentActivity[] = [
  { id: 'RA001', type: 'admission', title: 'New Admission', description: 'Arjun Malhotra admitted to Class 5-A', timestamp: '2026-09-11T09:30:00' },
  { id: 'RA002', type: 'fee', title: 'Fee Collected', description: 'September fee collected from Class 8-B (38 students)', timestamp: '2026-09-11T09:15:00' },
  { id: 'RA003', type: 'notice', title: 'Notice Published', description: 'Annual Sports Day schedule published for all classes', timestamp: '2026-09-11T08:45:00' },
  { id: 'RA004', type: 'attendance', title: 'Low Attendance Alert', description: 'Class 6-B attendance below 80% today', timestamp: '2026-09-11T08:30:00' },
  { id: 'RA005', type: 'exam', title: 'Results Published', description: 'Mid-term exam results published for Class 10', timestamp: '2026-09-10T16:00:00' },
  { id: 'RA006', type: 'leave', title: 'Leave Approved', description: 'Mrs. Kavita Joshi sick leave approved (3 days)', timestamp: '2026-09-10T14:30:00' },
  { id: 'RA007', type: 'admission', title: 'Transfer Request', description: 'Riya Patel transfer certificate requested for Class 7-A', timestamp: '2026-09-10T11:00:00' },
  { id: 'RA008', type: 'fee', title: 'Fee Reminder Sent', description: 'Payment reminder sent to 45 parents with pending fees', timestamp: '2026-09-10T10:00:00' },
  { id: 'RA009', type: 'notice', title: 'Holiday Declared', description: 'School closed on September 15 for Ganesh Chaturthi', timestamp: '2026-09-09T15:00:00' },
  { id: 'RA010', type: 'exam', title: 'Exam Scheduled', description: 'Pre-board exams scheduled for Class 12 from Oct 15', timestamp: '2026-09-09T12:00:00' },
];

export const mockFeeOverview: FeeOverview[] = [
  { month: 'Apr', collected: 1720000, pending: 480000, total: 2200000 },
  { month: 'May', collected: 1850000, pending: 350000, total: 2200000 },
  { month: 'Jun', collected: 1680000, pending: 520000, total: 2200000 },
  { month: 'Jul', collected: 1920000, pending: 280000, total: 2200000 },
  { month: 'Aug', collected: 1800000, pending: 400000, total: 2200000 },
  { month: 'Sep', collected: 1850000, pending: 620000, total: 2200000 },
];

export const mockEnrollmentTrend: EnrollmentTrend[] = [
  { year: '2021-22', students: 2210 },
  { year: '2022-23', students: 2385 },
  { year: '2023-24', students: 2540 },
  { year: '2024-25', students: 2690 },
  { year: '2025-26', students: 2847 },
];

export const mockAdminStudents: AdminStudent[] = [
  { id: 'AS001', name: 'Aarav Sharma', rollNumber: '1001', class: '10', section: 'A', gender: 'Male', dob: '2011-03-15', admissionDate: '2021-04-01', fatherName: 'Rajesh Sharma', motherName: 'Sunita Sharma', phone: '+91 98765 43210', email: 'rajesh.sharma@email.com', address: '45, MG Road, Jaipur', bloodGroup: 'B+', attendance: 96, avgMarks: 89, feeStatus: 'paid', lastFeeDate: '2026-09-05', status: 'active' },
  { id: 'AS002', name: 'Priya Singh', rollNumber: '1002', class: '10', section: 'A', gender: 'Female', dob: '2011-07-22', admissionDate: '2021-04-01', fatherName: 'Manoj Singh', motherName: 'Rani Singh', phone: '+91 98765 43211', email: 'manoj.singh@email.com', address: '12, Civil Lines, Jaipur', bloodGroup: 'A+', attendance: 94, avgMarks: 92, feeStatus: 'paid', lastFeeDate: '2026-09-03', status: 'active' },
  { id: 'AS003', name: 'Rohan Patel', rollNumber: '1003', class: '10', section: 'B', gender: 'Male', dob: '2011-01-10', admissionDate: '2021-04-01', fatherName: 'Suresh Patel', motherName: 'Meena Patel', phone: '+91 98765 43212', email: 'suresh.patel@email.com', address: '78, Station Road, Jaipur', bloodGroup: 'O+', attendance: 88, avgMarks: 72, feeStatus: 'pending', lastFeeDate: '2026-08-02', status: 'active' },
  { id: 'AS004', name: 'Ananya Gupta', rollNumber: '2001', class: '9', section: 'A', gender: 'Female', dob: '2012-05-18', admissionDate: '2022-04-01', fatherName: 'Vivek Gupta', motherName: 'Nisha Gupta', phone: '+91 98765 43213', email: 'vivek.gupta@email.com', address: '33, Tonk Road, Jaipur', bloodGroup: 'AB+', attendance: 97, avgMarks: 95, feeStatus: 'paid', lastFeeDate: '2026-09-01', status: 'active' },
  { id: 'AS005', name: 'Arjun Kumar', rollNumber: '2002', class: '9', section: 'A', gender: 'Male', dob: '2012-11-30', admissionDate: '2022-04-01', fatherName: 'Ramesh Kumar', motherName: 'Geeta Kumar', phone: '+91 98765 43214', email: 'ramesh.kumar@email.com', address: '56, Malviya Nagar, Jaipur', bloodGroup: 'B-', attendance: 91, avgMarks: 78, feeStatus: 'paid', lastFeeDate: '2026-09-04', status: 'active' },
  { id: 'AS006', name: 'Shreya Joshi', rollNumber: '2003', class: '9', section: 'B', gender: 'Female', dob: '2012-09-12', admissionDate: '2022-04-01', fatherName: 'Deepak Joshi', motherName: 'Ritu Joshi', phone: '+91 98765 43215', email: 'deepak.joshi@email.com', address: '21, Vaishali Nagar, Jaipur', bloodGroup: 'A-', attendance: 93, avgMarks: 85, feeStatus: 'overdue', lastFeeDate: '2026-07-05', status: 'active' },
  { id: 'AS007', name: 'Kabir Malhotra', rollNumber: '3001', class: '8', section: 'A', gender: 'Male', dob: '2013-02-28', admissionDate: '2021-04-01', fatherName: 'Amit Malhotra', motherName: 'Shikha Malhotra', phone: '+91 98765 43216', email: 'amit.malhotra@email.com', address: '9, C-Scheme, Jaipur', bloodGroup: 'O-', attendance: 90, avgMarks: 81, feeStatus: 'paid', lastFeeDate: '2026-09-02', status: 'active' },
  { id: 'AS008', name: 'Diya Reddy', rollNumber: '3002', class: '8', section: 'A', gender: 'Female', dob: '2013-06-05', admissionDate: '2021-04-01', fatherName: 'Krishna Reddy', motherName: 'Lakshmi Reddy', phone: '+91 98765 43217', email: 'krishna.reddy@email.com', address: '67, Bani Park, Jaipur', bloodGroup: 'B+', attendance: 95, avgMarks: 88, feeStatus: 'paid', lastFeeDate: '2026-09-06', status: 'active' },
  { id: 'AS009', name: 'Vihaan Tiwari', rollNumber: '3003', class: '8', section: 'B', gender: 'Male', dob: '2013-10-20', admissionDate: '2022-04-01', fatherName: 'Sanjay Tiwari', motherName: 'Poonam Tiwari', phone: '+91 98765 43218', email: 'sanjay.tiwari@email.com', address: '88, Mansarovar, Jaipur', bloodGroup: 'A+', attendance: 87, avgMarks: 68, feeStatus: 'pending', lastFeeDate: '2026-08-01', status: 'active' },
  { id: 'AS010', name: 'Ishita Nair', rollNumber: '4001', class: '7', section: 'A', gender: 'Female', dob: '2014-04-14', admissionDate: '2022-04-01', fatherName: 'Mohan Nair', motherName: 'Anjali Nair', phone: '+91 98765 43219', email: 'mohan.nair@email.com', address: '14, Shyam Nagar, Jaipur', bloodGroup: 'AB-', attendance: 98, avgMarks: 91, feeStatus: 'paid', lastFeeDate: '2026-09-07', status: 'active' },
  { id: 'AS011', name: 'Aditya Chauhan', rollNumber: '4002', class: '7', section: 'A', gender: 'Male', dob: '2014-08-09', admissionDate: '2023-04-01', fatherName: 'Harish Chauhan', motherName: 'Savita Chauhan', phone: '+91 98765 43220', email: 'harish.chauhan@email.com', address: '52, Adarsh Nagar, Jaipur', bloodGroup: 'O+', attendance: 92, avgMarks: 76, feeStatus: 'paid', lastFeeDate: '2026-09-03', status: 'active' },
  { id: 'AS012', name: 'Myra Saxena', rollNumber: '4003', class: '7', section: 'B', gender: 'Female', dob: '2014-12-25', admissionDate: '2023-04-01', fatherName: 'Alok Saxena', motherName: 'Swati Saxena', phone: '+91 98765 43221', email: 'alok.saxena@email.com', address: '30, Raja Park, Jaipur', bloodGroup: 'B+', attendance: 89, avgMarks: 83, feeStatus: 'overdue', lastFeeDate: '2026-06-30', status: 'active' },
  { id: 'AS013', name: 'Reyansh Dubey', rollNumber: '5001', class: '6', section: 'A', gender: 'Male', dob: '2015-03-08', admissionDate: '2023-04-01', fatherName: 'Nitin Dubey', motherName: 'Priyanka Dubey', phone: '+91 98765 43222', email: 'nitin.dubey@email.com', address: '71, Jagatpura, Jaipur', bloodGroup: 'A+', attendance: 94, avgMarks: 79, feeStatus: 'paid', lastFeeDate: '2026-09-08', status: 'active' },
  { id: 'AS014', name: 'Saanvi Pillai', rollNumber: '5002', class: '6', section: 'B', gender: 'Female', dob: '2015-07-19', admissionDate: '2024-04-01', fatherName: 'Gopal Pillai', motherName: 'Rekha Pillai', phone: '+91 98765 43223', email: 'gopal.pillai@email.com', address: '43, Sodala, Jaipur', bloodGroup: 'O+', attendance: 96, avgMarks: 87, feeStatus: 'paid', lastFeeDate: '2026-09-04', status: 'active' },
  { id: 'AS015', name: 'Arnav Mehta', rollNumber: '5003', class: '5', section: 'A', gender: 'Male', dob: '2016-01-03', admissionDate: '2024-04-01', fatherName: 'Pranav Mehta', motherName: 'Komal Mehta', phone: '+91 98765 43224', email: 'pranav.mehta@email.com', address: '19, Vidhyadhar Nagar, Jaipur', bloodGroup: 'B-', attendance: 93, avgMarks: 84, feeStatus: 'pending', lastFeeDate: '2026-08-05', status: 'active' },
  { id: 'AS016', name: 'Kiara Iyer', rollNumber: '6001', class: '5', section: 'B', gender: 'Female', dob: '2016-05-27', admissionDate: '2024-04-01', fatherName: 'Sunil Iyer', motherName: 'Padma Iyer', phone: '+91 98765 43225', email: 'sunil.iyer@email.com', address: '62, Lal Kothi, Jaipur', bloodGroup: 'AB+', attendance: 91, avgMarks: 80, feeStatus: 'paid', lastFeeDate: '2026-09-02', status: 'active' },
  { id: 'AS017', name: 'Vivaan Rao', rollNumber: '6002', class: '4', section: 'A', gender: 'Male', dob: '2017-09-14', admissionDate: '2024-04-01', fatherName: 'Venkat Rao', motherName: 'Sarala Rao', phone: '+91 98765 43226', email: 'venkat.rao@email.com', address: '85, Sitapura, Jaipur', bloodGroup: 'A-', attendance: 88, avgMarks: 71, feeStatus: 'paid', lastFeeDate: '2026-09-06', status: 'active' },
  { id: 'AS018', name: 'Anika Kapoor', rollNumber: '6003', class: '3', section: 'A', gender: 'Female', dob: '2018-02-11', admissionDate: '2025-04-01', fatherName: 'Rohit Kapoor', motherName: 'Simran Kapoor', phone: '+91 98765 43227', email: 'rohit.kapoor@email.com', address: '36, Sanganer, Jaipur', bloodGroup: 'O-', attendance: 95, avgMarks: 90, feeStatus: 'paid', lastFeeDate: '2026-09-09', status: 'active' },
  { id: 'AS019', name: 'Dhruv Mishra', rollNumber: '7001', class: '2', section: 'A', gender: 'Male', dob: '2019-06-30', admissionDate: '2025-04-01', fatherName: 'Pankaj Mishra', motherName: 'Neelam Mishra', phone: '+91 98765 43228', email: 'pankaj.mishra@email.com', address: '54, Pratap Nagar, Jaipur', bloodGroup: 'B+', attendance: 97, avgMarks: 86, feeStatus: 'paid', lastFeeDate: '2026-09-10', status: 'active' },
  { id: 'AS020', name: 'Navya Bhat', rollNumber: '7002', class: '1', section: 'A', gender: 'Female', dob: '2020-11-08', admissionDate: '2026-04-01', fatherName: 'Kiran Bhat', motherName: 'Divya Bhat', phone: '+91 98765 43229', email: 'kiran.bhat@email.com', address: '27, Gopalpura, Jaipur', bloodGroup: 'A+', attendance: 99, avgMarks: 93, feeStatus: 'paid', lastFeeDate: '2026-09-11', status: 'active' },
];

// ── Teacher & Staff ──

export interface AdminTeacher {
  id: string;
  name: string;
  employeeId: string;
  gender: 'Male' | 'Female';
  dob: string;
  phone: string;
  email: string;
  address: string;
  department: string;
  designation: string;
  subjects: string[];
  classTeacherOf: string | null;
  qualification: string;
  experience: number;
  joiningDate: string;
  salary: number;
  status: 'active' | 'on-leave' | 'resigned';
  role: 'teacher' | 'staff';
}

export const mockAdminTeachers: AdminTeacher[] = [
  { id: 'AT001', name: 'Mrs. Priya Sharma', employeeId: 'EMP001', gender: 'Female', dob: '1985-06-15', phone: '+91 97001 10001', email: 'priya.sharma@schoolai.in', address: '12, Malviya Nagar, Jaipur', department: 'Mathematics', designation: 'Senior Teacher', subjects: ['Mathematics'], classTeacherOf: '1-A', qualification: 'M.Sc Mathematics, B.Ed', experience: 12, joiningDate: '2014-07-01', salary: 55000, status: 'active', role: 'teacher' },
  { id: 'AT002', name: 'Mr. Rajesh Kumar', employeeId: 'EMP002', gender: 'Male', dob: '1982-03-22', phone: '+91 97001 10002', email: 'rajesh.kumar@schoolai.in', address: '45, C-Scheme, Jaipur', department: 'Science', designation: 'HOD Science', subjects: ['Physics', 'Science'], classTeacherOf: '2-A', qualification: 'M.Sc Physics, B.Ed', experience: 15, joiningDate: '2011-04-01', salary: 68000, status: 'active', role: 'teacher' },
  { id: 'AT003', name: 'Mrs. Sunita Verma', employeeId: 'EMP003', gender: 'Female', dob: '1988-11-08', phone: '+91 97001 10003', email: 'sunita.verma@schoolai.in', address: '78, Vaishali Nagar, Jaipur', department: 'English', designation: 'Teacher', subjects: ['English', 'Literature'], classTeacherOf: '1-B', qualification: 'M.A English, B.Ed', experience: 9, joiningDate: '2017-07-01', salary: 45000, status: 'active', role: 'teacher' },
  { id: 'AT004', name: 'Mr. Amit Singh', employeeId: 'EMP004', gender: 'Male', dob: '1980-01-30', phone: '+91 97001 10004', email: 'amit.singh@schoolai.in', address: '33, Raja Park, Jaipur', department: 'Hindi', designation: 'Senior Teacher', subjects: ['Hindi', 'Sanskrit'], classTeacherOf: '3-A', qualification: 'M.A Hindi, B.Ed', experience: 18, joiningDate: '2008-04-01', salary: 62000, status: 'active', role: 'teacher' },
  { id: 'AT005', name: 'Mrs. Neha Gupta', employeeId: 'EMP005', gender: 'Female', dob: '1990-07-14', phone: '+91 97001 10005', email: 'neha.gupta@schoolai.in', address: '56, Tonk Road, Jaipur', department: 'Science', designation: 'Teacher', subjects: ['Chemistry', 'Biology'], classTeacherOf: '2-B', qualification: 'M.Sc Chemistry, B.Ed', experience: 7, joiningDate: '2019-07-01', salary: 42000, status: 'active', role: 'teacher' },
  { id: 'AT006', name: 'Mr. Vikram Patel', employeeId: 'EMP006', gender: 'Male', dob: '1984-09-25', phone: '+91 97001 10006', email: 'vikram.patel@schoolai.in', address: '21, Shyam Nagar, Jaipur', department: 'Mathematics', designation: 'Teacher', subjects: ['Mathematics'], classTeacherOf: '4-A', qualification: 'M.Sc Mathematics, B.Ed', experience: 13, joiningDate: '2013-04-01', salary: 52000, status: 'active', role: 'teacher' },
  { id: 'AT007', name: 'Mrs. Kavita Joshi', employeeId: 'EMP007', gender: 'Female', dob: '1987-04-18', phone: '+91 97001 10007', email: 'kavita.joshi@schoolai.in', address: '14, Adarsh Nagar, Jaipur', department: 'Social Studies', designation: 'Teacher', subjects: ['History', 'Geography'], classTeacherOf: '3-B', qualification: 'M.A History, B.Ed', experience: 10, joiningDate: '2016-07-01', salary: 48000, status: 'on-leave', role: 'teacher' },
  { id: 'AT008', name: 'Mr. Suresh Yadav', employeeId: 'EMP008', gender: 'Male', dob: '1979-12-03', phone: '+91 97001 10008', email: 'suresh.yadav@schoolai.in', address: '62, Mansarovar, Jaipur', department: 'Physical Education', designation: 'Sports Teacher', subjects: ['Physical Education'], classTeacherOf: '5-A', qualification: 'B.P.Ed, M.P.Ed', experience: 20, joiningDate: '2006-04-01', salary: 58000, status: 'active', role: 'teacher' },
  { id: 'AT009', name: 'Mrs. Deepa Nair', employeeId: 'EMP009', gender: 'Female', dob: '1991-02-28', phone: '+91 97001 10009', email: 'deepa.nair@schoolai.in', address: '30, Sodala, Jaipur', department: 'Computer Science', designation: 'Teacher', subjects: ['Computer Science', 'IT'], classTeacherOf: '5-B', qualification: 'MCA, B.Ed', experience: 6, joiningDate: '2020-07-01', salary: 40000, status: 'active', role: 'teacher' },
  { id: 'AT010', name: 'Mr. Manoj Tiwari', employeeId: 'EMP010', gender: 'Male', dob: '1983-08-12', phone: '+91 97001 10010', email: 'manoj.tiwari@schoolai.in', address: '85, Jagatpura, Jaipur', department: 'English', designation: 'HOD English', subjects: ['English'], classTeacherOf: '6-A', qualification: 'M.A English, M.Phil, B.Ed', experience: 16, joiningDate: '2010-04-01', salary: 65000, status: 'active', role: 'teacher' },
  { id: 'AT011', name: 'Mrs. Rekha Das', employeeId: 'EMP011', gender: 'Female', dob: '1986-05-07', phone: '+91 97001 10011', email: 'rekha.das@schoolai.in', address: '43, Pratap Nagar, Jaipur', department: 'Mathematics', designation: 'Teacher', subjects: ['Mathematics'], classTeacherOf: '6-B', qualification: 'M.Sc Mathematics, B.Ed', experience: 11, joiningDate: '2015-07-01', salary: 50000, status: 'active', role: 'teacher' },
  { id: 'AT012', name: 'Mr. Arun Mehta', employeeId: 'EMP012', gender: 'Male', dob: '1981-10-20', phone: '+91 97001 10012', email: 'arun.mehta@schoolai.in', address: '19, Gopalpura, Jaipur', department: 'Science', designation: 'Senior Teacher', subjects: ['Physics'], classTeacherOf: '7-A', qualification: 'M.Sc Physics, B.Ed', experience: 17, joiningDate: '2009-04-01', salary: 64000, status: 'active', role: 'teacher' },
  { id: 'AS101', name: 'Mr. Ravi Shankar', employeeId: 'EMP050', gender: 'Male', dob: '1975-03-10', phone: '+91 97001 20001', email: 'ravi.shankar@schoolai.in', address: '22, Bani Park, Jaipur', department: 'Administration', designation: 'Office Manager', subjects: [], classTeacherOf: null, qualification: 'MBA', experience: 22, joiningDate: '2004-04-01', salary: 45000, status: 'active', role: 'staff' },
  { id: 'AS102', name: 'Mrs. Suman Devi', employeeId: 'EMP051', gender: 'Female', dob: '1980-08-22', phone: '+91 97001 20002', email: 'suman.devi@schoolai.in', address: '55, Sanganer, Jaipur', department: 'Accounts', designation: 'Accountant', subjects: [], classTeacherOf: null, qualification: 'M.Com', experience: 18, joiningDate: '2008-07-01', salary: 40000, status: 'active', role: 'staff' },
  { id: 'AS103', name: 'Mr. Dinesh Verma', employeeId: 'EMP052', gender: 'Male', dob: '1978-11-05', phone: '+91 97001 20003', email: 'dinesh.verma@schoolai.in', address: '71, Sitapura, Jaipur', department: 'IT Support', designation: 'System Administrator', subjects: [], classTeacherOf: null, qualification: 'BCA, CCNA', experience: 15, joiningDate: '2011-04-01', salary: 38000, status: 'active', role: 'staff' },
  { id: 'AS104', name: 'Mrs. Padma Iyer', employeeId: 'EMP053', gender: 'Female', dob: '1985-04-17', phone: '+91 97001 20004', email: 'padma.iyer@schoolai.in', address: '36, Lal Kothi, Jaipur', department: 'Library', designation: 'Librarian', subjects: [], classTeacherOf: null, qualification: 'M.Lib.Sc', experience: 12, joiningDate: '2014-07-01', salary: 35000, status: 'active', role: 'staff' },
  { id: 'AS105', name: 'Mr. Gopal Sharma', employeeId: 'EMP054', gender: 'Male', dob: '1972-07-30', phone: '+91 97001 20005', email: 'gopal.sharma@schoolai.in', address: '88, Vidhyadhar Nagar, Jaipur', department: 'Maintenance', designation: 'Facility Manager', subjects: [], classTeacherOf: null, qualification: 'B.A', experience: 25, joiningDate: '2001-04-01', salary: 32000, status: 'active', role: 'staff' },
];

// ── Classes & Sections ──

export interface AdminClass {
  id: string;
  class: string;
  section: string;
  classTeacher: string;
  classTeacherId: string;
  totalStudents: number;
  maxCapacity: number;
  room: string;
  subjects: string[];
  avgAttendance: number;
  avgMarks: number;
  status: 'active' | 'inactive';
}

export const mockAdminClasses: AdminClass[] = [
  { id: 'CL001', class: '1', section: 'A', classTeacher: 'Mrs. Priya Sharma', classTeacherId: 'AT001', totalStudents: 42, maxCapacity: 45, room: 'Room 101', subjects: ['English', 'Hindi', 'Mathematics', 'EVS', 'Art'], avgAttendance: 94, avgMarks: 82, status: 'active' },
  { id: 'CL002', class: '1', section: 'B', classTeacher: 'Mrs. Sunita Verma', classTeacherId: 'AT003', totalStudents: 40, maxCapacity: 45, room: 'Room 102', subjects: ['English', 'Hindi', 'Mathematics', 'EVS', 'Art'], avgAttendance: 92, avgMarks: 79, status: 'active' },
  { id: 'CL003', class: '2', section: 'A', classTeacher: 'Mr. Rajesh Kumar', classTeacherId: 'AT002', totalStudents: 44, maxCapacity: 45, room: 'Room 103', subjects: ['English', 'Hindi', 'Mathematics', 'EVS', 'Art'], avgAttendance: 91, avgMarks: 81, status: 'active' },
  { id: 'CL004', class: '2', section: 'B', classTeacher: 'Mrs. Neha Gupta', classTeacherId: 'AT005', totalStudents: 43, maxCapacity: 45, room: 'Room 104', subjects: ['English', 'Hindi', 'Mathematics', 'EVS', 'Art'], avgAttendance: 93, avgMarks: 80, status: 'active' },
  { id: 'CL005', class: '3', section: 'A', classTeacher: 'Mr. Amit Singh', classTeacherId: 'AT004', totalStudents: 45, maxCapacity: 45, room: 'Room 201', subjects: ['English', 'Hindi', 'Mathematics', 'Science', 'Social Studies', 'Computer'], avgAttendance: 90, avgMarks: 78, status: 'active' },
  { id: 'CL006', class: '3', section: 'B', classTeacher: 'Mrs. Kavita Joshi', classTeacherId: 'AT007', totalStudents: 44, maxCapacity: 45, room: 'Room 202', subjects: ['English', 'Hindi', 'Mathematics', 'Science', 'Social Studies', 'Computer'], avgAttendance: 89, avgMarks: 77, status: 'active' },
  { id: 'CL007', class: '4', section: 'A', classTeacher: 'Mr. Vikram Patel', classTeacherId: 'AT006', totalStudents: 46, maxCapacity: 48, room: 'Room 203', subjects: ['English', 'Hindi', 'Mathematics', 'Science', 'Social Studies', 'Computer'], avgAttendance: 92, avgMarks: 76, status: 'active' },
  { id: 'CL008', class: '4', section: 'B', classTeacher: 'Mrs. Anita Reddy', classTeacherId: 'AT008', totalStudents: 45, maxCapacity: 48, room: 'Room 204', subjects: ['English', 'Hindi', 'Mathematics', 'Science', 'Social Studies', 'Computer'], avgAttendance: 90, avgMarks: 75, status: 'active' },
  { id: 'CL009', class: '5', section: 'A', classTeacher: 'Mr. Suresh Yadav', classTeacherId: 'AT008', totalStudents: 47, maxCapacity: 48, room: 'Room 301', subjects: ['English', 'Hindi', 'Mathematics', 'Science', 'Social Studies', 'Computer'], avgAttendance: 91, avgMarks: 74, status: 'active' },
  { id: 'CL010', class: '5', section: 'B', classTeacher: 'Mrs. Deepa Nair', classTeacherId: 'AT009', totalStudents: 46, maxCapacity: 48, room: 'Room 302', subjects: ['English', 'Hindi', 'Mathematics', 'Science', 'Social Studies', 'Computer'], avgAttendance: 88, avgMarks: 73, status: 'active' },
  { id: 'CL011', class: '6', section: 'A', classTeacher: 'Mr. Manoj Tiwari', classTeacherId: 'AT010', totalStudents: 44, maxCapacity: 48, room: 'Room 303', subjects: ['English', 'Hindi', 'Mathematics', 'Science', 'Social Studies', 'Computer', 'Sanskrit'], avgAttendance: 90, avgMarks: 72, status: 'active' },
  { id: 'CL012', class: '6', section: 'B', classTeacher: 'Mrs. Rekha Das', classTeacherId: 'AT011', totalStudents: 43, maxCapacity: 48, room: 'Room 304', subjects: ['English', 'Hindi', 'Mathematics', 'Science', 'Social Studies', 'Computer', 'Sanskrit'], avgAttendance: 91, avgMarks: 71, status: 'active' },
  { id: 'CL013', class: '7', section: 'A', classTeacher: 'Mr. Arun Mehta', classTeacherId: 'AT012', totalStudents: 45, maxCapacity: 48, room: 'Room 401', subjects: ['English', 'Hindi', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'History', 'Geography', 'Computer'], avgAttendance: 89, avgMarks: 70, status: 'active' },
  { id: 'CL014', class: '7', section: 'B', classTeacher: 'Mrs. Seema Iyer', classTeacherId: 'AT003', totalStudents: 44, maxCapacity: 48, room: 'Room 402', subjects: ['English', 'Hindi', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'History', 'Geography', 'Computer'], avgAttendance: 90, avgMarks: 69, status: 'active' },
  { id: 'CL015', class: '8', section: 'A', classTeacher: 'Mr. Ramesh Chauhan', classTeacherId: 'AT004', totalStudents: 46, maxCapacity: 48, room: 'Room 403', subjects: ['English', 'Hindi', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'History', 'Geography', 'Computer'], avgAttendance: 92, avgMarks: 73, status: 'active' },
  { id: 'CL016', class: '8', section: 'B', classTeacher: 'Mrs. Pooja Saxena', classTeacherId: 'AT005', totalStudents: 45, maxCapacity: 48, room: 'Room 404', subjects: ['English', 'Hindi', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'History', 'Geography', 'Computer'], avgAttendance: 91, avgMarks: 72, status: 'active' },
  { id: 'CL017', class: '9', section: 'A', classTeacher: 'Mr. Dinesh Jha', classTeacherId: 'AT002', totalStudents: 44, maxCapacity: 48, room: 'Room 501', subjects: ['English', 'Hindi', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'History', 'Geography', 'Computer', 'Physical Education'], avgAttendance: 93, avgMarks: 75, status: 'active' },
  { id: 'CL018', class: '9', section: 'B', classTeacher: 'Mrs. Rashmi Bhat', classTeacherId: 'AT007', totalStudents: 43, maxCapacity: 48, room: 'Room 502', subjects: ['English', 'Hindi', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'History', 'Geography', 'Computer', 'Physical Education'], avgAttendance: 90, avgMarks: 74, status: 'active' },
  { id: 'CL019', class: '10', section: 'A', classTeacher: 'Mr. Gopal Mishra', classTeacherId: 'AT006', totalStudents: 45, maxCapacity: 48, room: 'Room 503', subjects: ['English', 'Hindi', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'History', 'Geography', 'Computer', 'Physical Education'], avgAttendance: 94, avgMarks: 78, status: 'active' },
  { id: 'CL020', class: '10', section: 'B', classTeacher: 'Mrs. Meera Kapoor', classTeacherId: 'AT011', totalStudents: 44, maxCapacity: 48, room: 'Room 504', subjects: ['English', 'Hindi', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'History', 'Geography', 'Computer', 'Physical Education'], avgAttendance: 93, avgMarks: 77, status: 'active' },
  { id: 'CL021', class: '11', section: 'A', classTeacher: 'Mr. Sanjay Dubey', classTeacherId: 'AT012', totalStudents: 42, maxCapacity: 45, room: 'Room 601', subjects: ['English', 'Physics', 'Chemistry', 'Mathematics', 'Computer Science', 'Physical Education'], avgAttendance: 91, avgMarks: 72, status: 'active' },
  { id: 'CL022', class: '11', section: 'B', classTeacher: 'Mrs. Lata Pillai', classTeacherId: 'AT010', totalStudents: 41, maxCapacity: 45, room: 'Room 602', subjects: ['English', 'Physics', 'Chemistry', 'Biology', 'Mathematics', 'Physical Education'], avgAttendance: 89, avgMarks: 70, status: 'active' },
  { id: 'CL023', class: '12', section: 'A', classTeacher: 'Mr. Prakash Rao', classTeacherId: 'AT002', totalStudents: 40, maxCapacity: 45, room: 'Room 603', subjects: ['English', 'Physics', 'Chemistry', 'Mathematics', 'Computer Science', 'Physical Education'], avgAttendance: 95, avgMarks: 76, status: 'active' },
  { id: 'CL024', class: '12', section: 'B', classTeacher: 'Mrs. Gayatri Menon', classTeacherId: 'AT009', totalStudents: 39, maxCapacity: 45, room: 'Room 604', subjects: ['English', 'Physics', 'Chemistry', 'Biology', 'Mathematics', 'Physical Education'], avgAttendance: 94, avgMarks: 75, status: 'active' },
];

// ── Fee Management ──

export interface FeeRecord {
  id: string;
  studentId: string;
  studentName: string;
  class: string;
  section: string;
  rollNumber: string;
  fatherName: string;
  phone: string;
  feeType: 'tuition' | 'transport' | 'exam' | 'lab' | 'library' | 'sports' | 'annual';
  amount: number;
  dueDate: string;
  paidDate: string | null;
  status: 'paid' | 'pending' | 'overdue' | 'partial';
  paidAmount: number;
  paymentMode: string | null;
  receiptNo: string | null;
  month: string;
}

export interface FeeStructure {
  id: string;
  feeType: string;
  classRange: string;
  amount: number;
  frequency: 'monthly' | 'quarterly' | 'annually' | 'one-time';
}

export const mockFeeStructure: FeeStructure[] = [
  { id: 'FS01', feeType: 'Tuition Fee', classRange: '1-5', amount: 3500, frequency: 'monthly' },
  { id: 'FS02', feeType: 'Tuition Fee', classRange: '6-8', amount: 4500, frequency: 'monthly' },
  { id: 'FS03', feeType: 'Tuition Fee', classRange: '9-10', amount: 5500, frequency: 'monthly' },
  { id: 'FS04', feeType: 'Tuition Fee', classRange: '11-12', amount: 6500, frequency: 'monthly' },
  { id: 'FS05', feeType: 'Exam Fee', classRange: '1-12', amount: 2000, frequency: 'quarterly' },
  { id: 'FS06', feeType: 'Lab Fee', classRange: '6-12', amount: 1500, frequency: 'quarterly' },
  { id: 'FS07', feeType: 'Library Fee', classRange: '1-12', amount: 500, frequency: 'annually' },
  { id: 'FS08', feeType: 'Sports Fee', classRange: '1-12', amount: 1000, frequency: 'annually' },
  { id: 'FS09', feeType: 'Annual Development', classRange: '1-12', amount: 5000, frequency: 'annually' },
];

export const mockFeeRecords: FeeRecord[] = [
  { id: 'FR001', studentId: 'AS001', studentName: 'Aarav Sharma', class: '10', section: 'A', rollNumber: '1001', fatherName: 'Rajesh Sharma', phone: '+91 98765 43210', feeType: 'tuition', amount: 5500, dueDate: '2026-09-10', paidDate: '2026-09-05', status: 'paid', paidAmount: 5500, paymentMode: 'UPI', receiptNo: 'RCP-2609-001', month: 'Sep 2026' },
  { id: 'FR002', studentId: 'AS002', studentName: 'Priya Singh', class: '10', section: 'A', rollNumber: '1002', fatherName: 'Manoj Singh', phone: '+91 98765 43211', feeType: 'tuition', amount: 5500, dueDate: '2026-09-10', paidDate: '2026-09-03', status: 'paid', paidAmount: 5500, paymentMode: 'Cash', receiptNo: 'RCP-2609-002', month: 'Sep 2026' },
  { id: 'FR003', studentId: 'AS003', studentName: 'Rohan Patel', class: '10', section: 'B', rollNumber: '1003', fatherName: 'Suresh Patel', phone: '+91 98765 43212', feeType: 'tuition', amount: 5500, dueDate: '2026-09-10', paidDate: null, status: 'pending', paidAmount: 0, paymentMode: null, receiptNo: null, month: 'Sep 2026' },
  { id: 'FR004', studentId: 'AS004', studentName: 'Ananya Gupta', class: '9', section: 'A', rollNumber: '2001', fatherName: 'Vivek Gupta', phone: '+91 98765 43213', feeType: 'tuition', amount: 5500, dueDate: '2026-09-10', paidDate: '2026-09-01', status: 'paid', paidAmount: 5500, paymentMode: 'Bank Transfer', receiptNo: 'RCP-2609-003', month: 'Sep 2026' },
  { id: 'FR005', studentId: 'AS005', studentName: 'Arjun Kumar', class: '9', section: 'A', rollNumber: '2002', fatherName: 'Ramesh Kumar', phone: '+91 98765 43214', feeType: 'tuition', amount: 5500, dueDate: '2026-09-10', paidDate: '2026-09-04', status: 'paid', paidAmount: 5500, paymentMode: 'UPI', receiptNo: 'RCP-2609-004', month: 'Sep 2026' },
  { id: 'FR006', studentId: 'AS006', studentName: 'Shreya Joshi', class: '9', section: 'B', rollNumber: '2003', fatherName: 'Deepak Joshi', phone: '+91 98765 43215', feeType: 'tuition', amount: 5500, dueDate: '2026-08-10', paidDate: null, status: 'overdue', paidAmount: 0, paymentMode: null, receiptNo: null, month: 'Aug 2026' },
  { id: 'FR007', studentId: 'AS007', studentName: 'Kabir Malhotra', class: '8', section: 'A', rollNumber: '3001', fatherName: 'Amit Malhotra', phone: '+91 98765 43216', feeType: 'tuition', amount: 4500, dueDate: '2026-09-10', paidDate: '2026-09-02', status: 'paid', paidAmount: 4500, paymentMode: 'Cheque', receiptNo: 'RCP-2609-005', month: 'Sep 2026' },
  { id: 'FR008', studentId: 'AS008', studentName: 'Diya Reddy', class: '8', section: 'A', rollNumber: '3002', fatherName: 'Krishna Reddy', phone: '+91 98765 43217', feeType: 'tuition', amount: 4500, dueDate: '2026-09-10', paidDate: '2026-09-06', status: 'paid', paidAmount: 4500, paymentMode: 'UPI', receiptNo: 'RCP-2609-006', month: 'Sep 2026' },
  { id: 'FR009', studentId: 'AS009', studentName: 'Vihaan Tiwari', class: '8', section: 'B', rollNumber: '3003', fatherName: 'Sanjay Tiwari', phone: '+91 98765 43218', feeType: 'tuition', amount: 4500, dueDate: '2026-09-10', paidDate: null, status: 'pending', paidAmount: 0, paymentMode: null, receiptNo: null, month: 'Sep 2026' },
  { id: 'FR010', studentId: 'AS010', studentName: 'Ishita Nair', class: '7', section: 'A', rollNumber: '4001', fatherName: 'Mohan Nair', phone: '+91 98765 43219', feeType: 'tuition', amount: 4500, dueDate: '2026-09-10', paidDate: '2026-09-07', status: 'paid', paidAmount: 4500, paymentMode: 'Cash', receiptNo: 'RCP-2609-007', month: 'Sep 2026' },
  { id: 'FR011', studentId: 'AS012', studentName: 'Myra Saxena', class: '7', section: 'B', rollNumber: '4003', fatherName: 'Alok Saxena', phone: '+91 98765 43221', feeType: 'tuition', amount: 4500, dueDate: '2026-07-10', paidDate: null, status: 'overdue', paidAmount: 0, paymentMode: null, receiptNo: null, month: 'Jul 2026' },
  { id: 'FR012', studentId: 'AS015', studentName: 'Arnav Mehta', class: '5', section: 'A', rollNumber: '5003', fatherName: 'Pranav Mehta', phone: '+91 98765 43224', feeType: 'tuition', amount: 3500, dueDate: '2026-09-10', paidDate: null, status: 'pending', paidAmount: 0, paymentMode: null, receiptNo: null, month: 'Sep 2026' },
  { id: 'FR013', studentId: 'AS013', studentName: 'Reyansh Dubey', class: '6', section: 'A', rollNumber: '5001', fatherName: 'Nitin Dubey', phone: '+91 98765 43222', feeType: 'exam', amount: 2000, dueDate: '2026-09-15', paidDate: '2026-09-08', status: 'paid', paidAmount: 2000, paymentMode: 'UPI', receiptNo: 'RCP-2609-008', month: 'Sep 2026' },
  { id: 'FR014', studentId: 'AS018', studentName: 'Anika Kapoor', class: '3', section: 'A', rollNumber: '6003', fatherName: 'Rohit Kapoor', phone: '+91 98765 43227', feeType: 'tuition', amount: 3500, dueDate: '2026-09-10', paidDate: '2026-09-09', status: 'paid', paidAmount: 3500, paymentMode: 'Bank Transfer', receiptNo: 'RCP-2609-009', month: 'Sep 2026' },
  { id: 'FR015', studentId: 'AS011', studentName: 'Aditya Chauhan', class: '7', section: 'A', rollNumber: '4002', fatherName: 'Harish Chauhan', phone: '+91 98765 43220', feeType: 'tuition', amount: 4500, dueDate: '2026-09-10', paidDate: null, status: 'partial', paidAmount: 2000, paymentMode: 'Cash', receiptNo: 'RCP-2609-010', month: 'Sep 2026' },
];

// ── Academic / Exam Management ──

export interface Exam {
  id: string;
  name: string;
  type: 'unit-test' | 'mid-term' | 'final' | 'pre-board' | 'practical';
  classRange: string;
  startDate: string;
  endDate: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'results-published';
  totalSubjects: number;
  totalStudents: number;
}

export interface ExamResult {
  id: string;
  examId: string;
  examName: string;
  class: string;
  section: string;
  subject: string;
  totalStudents: number;
  appeared: number;
  passed: number;
  failed: number;
  avgMarks: number;
  highestMarks: number;
  lowestMarks: number;
}

export interface AcademicCalendarEvent {
  id: string;
  title: string;
  date: string;
  endDate?: string;
  type: 'exam' | 'holiday' | 'event' | 'ptm' | 'deadline';
  description: string;
}

export const mockExams: Exam[] = [
  { id: 'EX001', name: 'Unit Test 1', type: 'unit-test', classRange: '1-12', startDate: '2026-05-05', endDate: '2026-05-10', status: 'completed', totalSubjects: 5, totalStudents: 2847 },
  { id: 'EX002', name: 'Mid-Term Examination', type: 'mid-term', classRange: '1-12', startDate: '2026-07-15', endDate: '2026-07-25', status: 'results-published', totalSubjects: 8, totalStudents: 2847 },
  { id: 'EX003', name: 'Unit Test 2', type: 'unit-test', classRange: '1-12', startDate: '2026-09-08', endDate: '2026-09-12', status: 'completed', totalSubjects: 5, totalStudents: 2847 },
  { id: 'EX004', name: 'Pre-Board Examination', type: 'pre-board', classRange: '10,12', startDate: '2026-10-15', endDate: '2026-10-28', status: 'upcoming', totalSubjects: 6, totalStudents: 168 },
  { id: 'EX005', name: 'Practical Exams', type: 'practical', classRange: '9-12', startDate: '2026-11-01', endDate: '2026-11-10', status: 'upcoming', totalSubjects: 4, totalStudents: 340 },
  { id: 'EX006', name: 'Final Examination', type: 'final', classRange: '1-12', startDate: '2027-02-15', endDate: '2027-03-05', status: 'upcoming', totalSubjects: 8, totalStudents: 2847 },
];

export const mockExamResults: ExamResult[] = [
  { id: 'ER001', examId: 'EX002', examName: 'Mid-Term Examination', class: '10', section: 'A', subject: 'Mathematics', totalStudents: 45, appeared: 44, passed: 40, failed: 4, avgMarks: 72, highestMarks: 98, lowestMarks: 28 },
  { id: 'ER002', examId: 'EX002', examName: 'Mid-Term Examination', class: '10', section: 'A', subject: 'Science', totalStudents: 45, appeared: 45, passed: 42, failed: 3, avgMarks: 76, highestMarks: 96, lowestMarks: 32 },
  { id: 'ER003', examId: 'EX002', examName: 'Mid-Term Examination', class: '10', section: 'A', subject: 'English', totalStudents: 45, appeared: 44, passed: 43, failed: 1, avgMarks: 78, highestMarks: 95, lowestMarks: 40 },
  { id: 'ER004', examId: 'EX002', examName: 'Mid-Term Examination', class: '10', section: 'B', subject: 'Mathematics', totalStudents: 44, appeared: 43, passed: 38, failed: 5, avgMarks: 68, highestMarks: 95, lowestMarks: 22 },
  { id: 'ER005', examId: 'EX002', examName: 'Mid-Term Examination', class: '10', section: 'B', subject: 'Science', totalStudents: 44, appeared: 44, passed: 40, failed: 4, avgMarks: 71, highestMarks: 92, lowestMarks: 30 },
  { id: 'ER006', examId: 'EX002', examName: 'Mid-Term Examination', class: '9', section: 'A', subject: 'Mathematics', totalStudents: 44, appeared: 44, passed: 41, failed: 3, avgMarks: 75, highestMarks: 99, lowestMarks: 35 },
  { id: 'ER007', examId: 'EX002', examName: 'Mid-Term Examination', class: '9', section: 'A', subject: 'English', totalStudents: 44, appeared: 43, passed: 42, failed: 1, avgMarks: 80, highestMarks: 97, lowestMarks: 42 },
  { id: 'ER008', examId: 'EX002', examName: 'Mid-Term Examination', class: '8', section: 'A', subject: 'Mathematics', totalStudents: 46, appeared: 45, passed: 42, failed: 3, avgMarks: 74, highestMarks: 96, lowestMarks: 30 },
];

export const mockAcademicCalendar: AcademicCalendarEvent[] = [
  { id: 'AC001', title: 'Unit Test 2 Results', date: '2026-09-15', type: 'deadline', description: 'Results to be published for all classes' },
  { id: 'AC002', title: 'Ganesh Chaturthi', date: '2026-09-15', type: 'holiday', description: 'School closed for Ganesh Chaturthi' },
  { id: 'AC003', title: 'Parent-Teacher Meeting', date: '2026-09-20', type: 'ptm', description: 'PTM for Classes 9-12' },
  { id: 'AC004', title: 'Annual Sports Day', date: '2026-09-25', endDate: '2026-09-27', type: 'event', description: 'Inter-house sports competition' },
  { id: 'AC005', title: 'Gandhi Jayanti', date: '2026-10-02', type: 'holiday', description: 'School closed' },
  { id: 'AC006', title: 'Pre-Board Exams Begin', date: '2026-10-15', endDate: '2026-10-28', type: 'exam', description: 'Pre-board exams for Class 10 & 12' },
  { id: 'AC007', title: 'Diwali Break', date: '2026-10-18', endDate: '2026-10-25', type: 'holiday', description: 'Diwali vacation for all classes' },
  { id: 'AC008', title: 'Practical Exams', date: '2026-11-01', endDate: '2026-11-10', type: 'exam', description: 'Practical exams for Classes 9-12' },
  { id: 'AC009', title: 'Children\'s Day Celebration', date: '2026-11-14', type: 'event', description: 'Cultural programs and activities' },
  { id: 'AC010', title: 'Winter Break Begins', date: '2026-12-24', endDate: '2027-01-02', type: 'holiday', description: 'Christmas & New Year break' },
  { id: 'AC011', title: 'Republic Day', date: '2027-01-26', type: 'holiday', description: 'School closed — flag hoisting ceremony in the morning' },
  { id: 'AC012', title: 'Final Exam Begins', date: '2027-02-15', endDate: '2027-03-05', type: 'exam', description: 'Annual final examinations for all classes' },
];

// ── Announcements ──

export interface AdminNotice {
  id: string;
  title: string;
  content: string;
  priority: 'urgent' | 'high' | 'normal';
  audience: string;
  createdBy: string;
  createdAt: string;
  isPublished: boolean;
  views: number;
  attachments: number;
}

export const mockAdminNotices: AdminNotice[] = [
  { id: 'AN001', title: 'School Closed — Ganesh Chaturthi', content: 'School will remain closed on September 15, 2026 on account of Ganesh Chaturthi. Regular classes will resume on September 16.', priority: 'urgent', audience: 'All Students & Parents', createdBy: 'Dr. Vikram Rathore', createdAt: '2026-09-10T10:00:00', isPublished: true, views: 2340, attachments: 0 },
  { id: 'AN002', title: 'Annual Sports Day — Schedule Released', content: 'The Annual Sports Day will be held from September 25-27. All students are required to participate in at least one event. Registration forms available at the sports office.', priority: 'high', audience: 'All Students', createdBy: 'Mr. Suresh Yadav', createdAt: '2026-09-09T14:30:00', isPublished: true, views: 1850, attachments: 1 },
  { id: 'AN003', title: 'Parent-Teacher Meeting — Class 9-12', content: 'PTM for classes 9-12 is scheduled on September 20, 2026 from 9:00 AM to 1:00 PM. Parents are requested to attend without fail.', priority: 'high', audience: 'Class 9-12 Parents', createdBy: 'Dr. Vikram Rathore', createdAt: '2026-09-08T11:00:00', isPublished: true, views: 980, attachments: 0 },
  { id: 'AN004', title: 'Fee Payment Reminder — September', content: 'Parents are kindly reminded to pay the September tuition fee before September 10. Late fee of ₹200 will be charged after the due date.', priority: 'normal', audience: 'All Parents', createdBy: 'Mrs. Suman Devi', createdAt: '2026-09-05T09:00:00', isPublished: true, views: 2100, attachments: 0 },
  { id: 'AN005', title: 'Unit Test 2 — Results Published', content: 'Unit Test 2 results have been published. Students can check their marks through the student portal. Report cards will be distributed during PTM.', priority: 'normal', audience: 'All Students & Parents', createdBy: 'Mr. Rajesh Kumar', createdAt: '2026-09-12T08:00:00', isPublished: true, views: 1560, attachments: 2 },
  { id: 'AN006', title: 'Library Book Return Reminder', content: 'All students who have borrowed library books are requested to return them by September 18. Overdue fines will be applicable.', priority: 'normal', audience: 'All Students', createdBy: 'Mrs. Padma Iyer', createdAt: '2026-09-07T10:30:00', isPublished: true, views: 890, attachments: 0 },
  { id: 'AN007', title: 'Emergency Drill — Fire Safety', content: 'A fire safety drill will be conducted on September 16 at 11:00 AM. All teachers and students must participate. Assembly point: Main Ground.', priority: 'urgent', audience: 'All Staff & Students', createdBy: 'Mr. Gopal Sharma', createdAt: '2026-09-11T15:00:00', isPublished: true, views: 1200, attachments: 1 },
  { id: 'AN008', title: 'Science Exhibition — Registration Open', content: 'Inter-school Science Exhibition registration is now open. Interested students from classes 6-12 can register with their science teachers by September 22.', priority: 'normal', audience: 'Class 6-12 Students', createdBy: 'Mr. Rajesh Kumar', createdAt: '2026-09-06T12:00:00', isPublished: true, views: 650, attachments: 0 },
  { id: 'AN009', title: 'Salary Disbursement — September', content: 'September salary will be credited by September 30. Any discrepancies in previous month salary should be reported to accounts office by September 20.', priority: 'normal', audience: 'All Staff', createdBy: 'Mrs. Suman Devi', createdAt: '2026-09-10T16:00:00', isPublished: false, views: 0, attachments: 0 },
  { id: 'AN010', title: 'New Computer Lab — Inauguration', content: 'The new computer lab with 40 workstations will be inaugurated on September 18. Classes 6-12 will have updated computer lab schedules from September 21.', priority: 'high', audience: 'All Students & Staff', createdBy: 'Mr. Dinesh Verma', createdAt: '2026-09-11T09:00:00', isPublished: true, views: 1100, attachments: 1 },
];

// ── Reports & Analytics ──

export interface MonthlyAttendance {
  month: string;
  present: number;
  absent: number;
  late: number;
  total: number;
}

export interface SubjectPerformance {
  subject: string;
  avgMarks: number;
  passRate: number;
  topScore: number;
  students: number;
}

export interface ClassPerformanceTrend {
  class: string;
  unitTest1: number;
  midTerm: number;
  unitTest2: number;
}

export const mockMonthlyAttendance: MonthlyAttendance[] = [
  { month: 'Apr', present: 2620, absent: 142, late: 85, total: 2847 },
  { month: 'May', present: 2580, absent: 180, late: 87, total: 2847 },
  { month: 'Jun', present: 2550, absent: 210, late: 87, total: 2847 },
  { month: 'Jul', present: 2640, absent: 128, late: 79, total: 2847 },
  { month: 'Aug', present: 2600, absent: 160, late: 87, total: 2847 },
  { month: 'Sep', present: 2610, absent: 150, late: 87, total: 2847 },
];

export const mockSubjectPerformance: SubjectPerformance[] = [
  { subject: 'Mathematics', avgMarks: 72, passRate: 89, topScore: 99, students: 2847 },
  { subject: 'Science', avgMarks: 75, passRate: 92, topScore: 98, students: 2847 },
  { subject: 'English', avgMarks: 78, passRate: 95, topScore: 97, students: 2847 },
  { subject: 'Hindi', avgMarks: 80, passRate: 96, topScore: 98, students: 2847 },
  { subject: 'Social Studies', avgMarks: 74, passRate: 91, topScore: 96, students: 1760 },
  { subject: 'Computer Science', avgMarks: 82, passRate: 97, topScore: 100, students: 1760 },
  { subject: 'Physical Education', avgMarks: 85, passRate: 99, topScore: 100, students: 680 },
];

export const mockClassPerformanceTrend: ClassPerformanceTrend[] = [
  { class: '1', unitTest1: 84, midTerm: 82, unitTest2: 85 },
  { class: '2', unitTest1: 82, midTerm: 81, unitTest2: 83 },
  { class: '3', unitTest1: 79, midTerm: 78, unitTest2: 80 },
  { class: '4', unitTest1: 77, midTerm: 76, unitTest2: 78 },
  { class: '5', unitTest1: 75, midTerm: 74, unitTest2: 76 },
  { class: '6', unitTest1: 73, midTerm: 72, unitTest2: 74 },
  { class: '7', unitTest1: 71, midTerm: 70, unitTest2: 72 },
  { class: '8', unitTest1: 74, midTerm: 73, unitTest2: 75 },
  { class: '9', unitTest1: 76, midTerm: 75, unitTest2: 77 },
  { class: '10', unitTest1: 78, midTerm: 78, unitTest2: 80 },
  { class: '11', unitTest1: 72, midTerm: 72, unitTest2: 73 },
  { class: '12', unitTest1: 76, midTerm: 76, unitTest2: 78 },
];

// ─── Document Management ───
export interface SchoolDocument {
  id: string;
  name: string;
  type: 'pdf' | 'doc' | 'xls' | 'img' | 'ppt';
  category: 'circular' | 'policy' | 'form' | 'report' | 'certificate' | 'syllabus' | 'timetable';
  description: string;
  uploadedBy: string;
  uploadedAt: string;
  size: string;
  sizeBytes: number;
  sharedWith: string;
  downloads: number;
  isPublic: boolean;
  tags: string[];
}

export const mockDocuments: SchoolDocument[] = [
  { id: 'DOC001', name: 'Annual Fee Structure 2024-25', type: 'pdf', category: 'circular', description: 'Complete fee structure for all classes including hostel and transport fees.', uploadedBy: 'Dr. Vikram Rathore', uploadedAt: '2024-03-15', size: '245 KB', sizeBytes: 250880, sharedWith: 'all', downloads: 342, isPublic: true, tags: ['fees', 'annual'] },
  { id: 'DOC002', name: 'Anti-Bullying Policy', type: 'pdf', category: 'policy', description: 'School anti-bullying policy document as per CBSE guidelines.', uploadedBy: 'Mrs. Sunita Sharma', uploadedAt: '2024-02-10', size: '180 KB', sizeBytes: 184320, sharedWith: 'teachers', downloads: 89, isPublic: false, tags: ['policy', 'safety'] },
  { id: 'DOC003', name: 'Admission Form 2024-25', type: 'doc', category: 'form', description: 'New student admission application form with required documents checklist.', uploadedBy: 'Mr. Rajesh Kumar', uploadedAt: '2024-01-20', size: '120 KB', sizeBytes: 122880, sharedWith: 'all', downloads: 1205, isPublic: true, tags: ['admission', 'form'] },
  { id: 'DOC004', name: 'Mid-Term Result Analysis', type: 'xls', category: 'report', description: 'Class-wise mid-term examination result analysis spreadsheet.', uploadedBy: 'Mrs. Priya Verma', uploadedAt: '2024-08-25', size: '1.2 MB', sizeBytes: 1258291, sharedWith: 'teachers', downloads: 56, isPublic: false, tags: ['results', 'mid-term'] },
  { id: 'DOC005', name: 'School Building Blueprint', type: 'img', category: 'report', description: 'Updated school campus building layout and emergency exit map.', uploadedBy: 'Mr. Anil Mehta', uploadedAt: '2024-04-05', size: '3.5 MB', sizeBytes: 3670016, sharedWith: 'staff', downloads: 23, isPublic: false, tags: ['building', 'safety'] },
  { id: 'DOC006', name: 'Transfer Certificate Template', type: 'doc', category: 'certificate', description: 'Standard TC format as per state education board requirements.', uploadedBy: 'Dr. Vikram Rathore', uploadedAt: '2024-01-05', size: '85 KB', sizeBytes: 87040, sharedWith: 'staff', downloads: 178, isPublic: false, tags: ['tc', 'certificate'] },
  { id: 'DOC007', name: 'Class 10 Maths Syllabus', type: 'pdf', category: 'syllabus', description: 'CBSE Class 10 Mathematics syllabus with chapter-wise weightage.', uploadedBy: 'Mrs. Priya Verma', uploadedAt: '2024-03-01', size: '320 KB', sizeBytes: 327680, sharedWith: 'all', downloads: 467, isPublic: true, tags: ['syllabus', 'class-10', 'maths'] },
  { id: 'DOC008', name: 'Weekly Timetable - Class 9', type: 'xls', category: 'timetable', description: 'Period-wise weekly timetable for Class 9 Section A & B.', uploadedBy: 'Mr. Deepak Tiwari', uploadedAt: '2024-07-10', size: '95 KB', sizeBytes: 97280, sharedWith: 'teachers', downloads: 34, isPublic: false, tags: ['timetable', 'class-9'] },
  { id: 'DOC009', name: 'Staff Leave Policy', type: 'pdf', category: 'policy', description: 'Updated leave policy for teaching and non-teaching staff members.', uploadedBy: 'Dr. Vikram Rathore', uploadedAt: '2024-05-12', size: '210 KB', sizeBytes: 215040, sharedWith: 'staff', downloads: 112, isPublic: false, tags: ['leave', 'policy', 'hr'] },
  { id: 'DOC010', name: 'Annual Day Presentation', type: 'ppt', category: 'report', description: 'Annual day function presentation with school achievements and milestones.', uploadedBy: 'Mrs. Sunita Sharma', uploadedAt: '2024-09-01', size: '8.5 MB', sizeBytes: 8912896, sharedWith: 'all', downloads: 245, isPublic: true, tags: ['annual-day', 'event'] },
  { id: 'DOC011', name: 'Parent Consent Form - Excursion', type: 'doc', category: 'form', description: 'Parental consent form for upcoming school excursion trip.', uploadedBy: 'Mr. Rajesh Kumar', uploadedAt: '2024-08-20', size: '75 KB', sizeBytes: 76800, sharedWith: 'parents', downloads: 380, isPublic: true, tags: ['consent', 'excursion'] },
  { id: 'DOC012', name: 'CBSE Exam Guidelines 2024', type: 'pdf', category: 'circular', description: 'Latest CBSE board examination guidelines and instructions for students.', uploadedBy: 'Mrs. Priya Verma', uploadedAt: '2024-06-15', size: '510 KB', sizeBytes: 522240, sharedWith: 'all', downloads: 589, isPublic: true, tags: ['cbse', 'exam', 'guidelines'] },
];

// ─── Class-wise Attendance (for Attendance Overview page) ───
export interface ClassAttendance {
  id: string;
  class: string;
  section: string;
  totalStudents: number;
  present: number;
  absent: number;
  late: number;
  date: string;
  classTeacher: string;
}

export const mockClassAttendance: ClassAttendance[] = [
  { id: 'CA01', class: '1', section: 'A', totalStudents: 42, present: 38, absent: 3, late: 1, date: '2024-09-12', classTeacher: 'Mrs. Priya Sharma' },
  { id: 'CA02', class: '1', section: 'B', totalStudents: 40, present: 37, absent: 2, late: 1, date: '2024-09-12', classTeacher: 'Mrs. Sunita Verma' },
  { id: 'CA03', class: '2', section: 'A', totalStudents: 44, present: 40, absent: 3, late: 1, date: '2024-09-12', classTeacher: 'Mr. Rajesh Kumar' },
  { id: 'CA04', class: '2', section: 'B', totalStudents: 43, present: 39, absent: 3, late: 1, date: '2024-09-12', classTeacher: 'Mrs. Neha Gupta' },
  { id: 'CA05', class: '3', section: 'A', totalStudents: 45, present: 41, absent: 3, late: 1, date: '2024-09-12', classTeacher: 'Mr. Amit Singh' },
  { id: 'CA06', class: '3', section: 'B', totalStudents: 44, present: 40, absent: 2, late: 2, date: '2024-09-12', classTeacher: 'Mrs. Kavita Joshi' },
  { id: 'CA07', class: '4', section: 'A', totalStudents: 46, present: 42, absent: 3, late: 1, date: '2024-09-12', classTeacher: 'Mr. Vikram Patel' },
  { id: 'CA08', class: '4', section: 'B', totalStudents: 44, present: 41, absent: 2, late: 1, date: '2024-09-12', classTeacher: 'Mrs. Rekha Das' },
  { id: 'CA09', class: '5', section: 'A', totalStudents: 45, present: 40, absent: 4, late: 1, date: '2024-09-12', classTeacher: 'Mr. Suresh Yadav' },
  { id: 'CA10', class: '5', section: 'B', totalStudents: 43, present: 39, absent: 3, late: 1, date: '2024-09-12', classTeacher: 'Mrs. Deepa Nair' },
  { id: 'CA11', class: '6', section: 'A', totalStudents: 44, present: 38, absent: 4, late: 2, date: '2024-09-12', classTeacher: 'Mr. Manoj Tiwari' },
  { id: 'CA12', class: '6', section: 'B', totalStudents: 42, present: 37, absent: 4, late: 1, date: '2024-09-12', classTeacher: 'Mrs. Rekha Das' },
  { id: 'CA13', class: '7', section: 'A', totalStudents: 44, present: 39, absent: 3, late: 2, date: '2024-09-12', classTeacher: 'Mr. Arun Mehta' },
  { id: 'CA14', class: '7', section: 'B', totalStudents: 43, present: 38, absent: 4, late: 1, date: '2024-09-12', classTeacher: 'Mrs. Priya Sharma' },
  { id: 'CA15', class: '8', section: 'A', totalStudents: 46, present: 40, absent: 4, late: 2, date: '2024-09-12', classTeacher: 'Mr. Rajesh Kumar' },
  { id: 'CA16', class: '8', section: 'B', totalStudents: 44, present: 39, absent: 4, late: 1, date: '2024-09-12', classTeacher: 'Mrs. Neha Gupta' },
  { id: 'CA17', class: '9', section: 'A', totalStudents: 44, present: 38, absent: 5, late: 1, date: '2024-09-12', classTeacher: 'Mr. Vikram Patel' },
  { id: 'CA18', class: '9', section: 'B', totalStudents: 43, present: 37, absent: 4, late: 2, date: '2024-09-12', classTeacher: 'Mrs. Kavita Joshi' },
  { id: 'CA19', class: '10', section: 'A', totalStudents: 45, present: 40, absent: 4, late: 1, date: '2024-09-12', classTeacher: 'Mr. Amit Singh' },
  { id: 'CA20', class: '10', section: 'B', totalStudents: 44, present: 39, absent: 3, late: 2, date: '2024-09-12', classTeacher: 'Mrs. Sunita Verma' },
  { id: 'CA21', class: '11', section: 'A', totalStudents: 38, present: 33, absent: 4, late: 1, date: '2024-09-12', classTeacher: 'Mr. Manoj Tiwari' },
  { id: 'CA22', class: '11', section: 'B', totalStudents: 36, present: 32, absent: 3, late: 1, date: '2024-09-12', classTeacher: 'Mr. Arun Mehta' },
  { id: 'CA23', class: '12', section: 'A', totalStudents: 34, present: 30, absent: 3, late: 1, date: '2024-09-12', classTeacher: 'Mr. Suresh Yadav' },
  { id: 'CA24', class: '12', section: 'B', totalStudents: 32, present: 28, absent: 3, late: 1, date: '2024-09-12', classTeacher: 'Mrs. Deepa Nair' },
];

// ─── Role & Permission Management ───
export interface Permission {
  module: string;
  view: boolean;
  create: boolean;
  edit: boolean;
  delete: boolean;
}

export interface Role {
  id: string;
  name: string;
  slug: string;
  description: string;
  type: 'system' | 'custom';
  userCount: number;
  permissions: Permission[];
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  color: string;
}

const ALL_MODULES = ['Dashboard', 'Students', 'Teachers', 'Classes', 'Fees', 'Attendance', 'Exams', 'Notices', 'Staff & HR', 'Reports', 'Documents', 'Settings'];

function makePerms(full: string[], viewOnly: string[], none: string[]): Permission[] {
  return ALL_MODULES.map((m) => {
    if (full.includes(m)) return { module: m, view: true, create: true, edit: true, delete: true };
    if (viewOnly.includes(m)) return { module: m, view: true, create: false, edit: false, delete: false };
    return { module: m, view: none.includes(m) ? false : true, create: false, edit: false, delete: false };
  });
}

export const mockRoles: Role[] = [
  {
    id: 'ROLE001', name: 'Super Admin', slug: 'super-admin', description: 'Full access to all modules and settings. Can manage roles and permissions.', type: 'system', userCount: 2,
    permissions: ALL_MODULES.map((m) => ({ module: m, view: true, create: true, edit: true, delete: true })),
    createdAt: '2024-01-01', updatedAt: '2024-01-01', isActive: true, color: '#7c3aed',
  },
  {
    id: 'ROLE002', name: 'Admin', slug: 'admin', description: 'Administrative access to manage students, teachers, and daily operations.', type: 'system', userCount: 3,
    permissions: makePerms(['Dashboard', 'Students', 'Teachers', 'Classes', 'Fees', 'Attendance', 'Exams', 'Notices', 'Documents'], ['Staff & HR', 'Reports'], ['Settings']),
    createdAt: '2024-01-01', updatedAt: '2024-03-15', isActive: true, color: '#1565c0',
  },
  {
    id: 'ROLE003', name: 'Teacher', slug: 'teacher', description: 'Access to assigned classes, attendance, exams, and student information.', type: 'system', userCount: 45,
    permissions: makePerms(['Attendance', 'Exams'], ['Dashboard', 'Students', 'Classes', 'Notices', 'Reports'], ['Fees', 'Staff & HR', 'Documents', 'Settings']),
    createdAt: '2024-01-01', updatedAt: '2024-02-10', isActive: true, color: '#2e7d32',
  },
  {
    id: 'ROLE004', name: 'Accountant', slug: 'accountant', description: 'Manages fee collection, payments, and financial reports.', type: 'system', userCount: 2,
    permissions: makePerms(['Fees'], ['Dashboard', 'Students', 'Reports'], ['Teachers', 'Classes', 'Attendance', 'Exams', 'Notices', 'Staff & HR', 'Documents', 'Settings']),
    createdAt: '2024-01-01', updatedAt: '2024-01-01', isActive: true, color: '#e65100',
  },
  {
    id: 'ROLE005', name: 'Librarian', slug: 'librarian', description: 'Manages library resources and book inventory.', type: 'custom', userCount: 1,
    permissions: makePerms(['Documents'], ['Dashboard', 'Students'], ['Teachers', 'Classes', 'Fees', 'Attendance', 'Exams', 'Notices', 'Staff & HR', 'Reports', 'Settings']),
    createdAt: '2024-02-15', updatedAt: '2024-02-15', isActive: true, color: '#00897b',
  },
  {
    id: 'ROLE006', name: 'Receptionist', slug: 'receptionist', description: 'Front desk operations — student inquiries, visitor management, and basic info.', type: 'custom', userCount: 2,
    permissions: makePerms([], ['Dashboard', 'Students', 'Notices'], ['Teachers', 'Classes', 'Fees', 'Attendance', 'Exams', 'Staff & HR', 'Reports', 'Documents', 'Settings']),
    createdAt: '2024-03-01', updatedAt: '2024-05-20', isActive: true, color: '#c62828',
  },
  {
    id: 'ROLE007', name: 'Exam Coordinator', slug: 'exam-coordinator', description: 'Manages exam scheduling, question papers, and result processing.', type: 'custom', userCount: 1,
    permissions: makePerms(['Exams'], ['Dashboard', 'Students', 'Classes', 'Teachers', 'Reports'], ['Fees', 'Attendance', 'Notices', 'Staff & HR', 'Documents', 'Settings']),
    createdAt: '2024-04-10', updatedAt: '2024-04-10', isActive: true, color: '#6a1b9a',
  },
  {
    id: 'ROLE008', name: 'Parent', slug: 'parent', description: 'View-only access to child information, fees, attendance, and notices.', type: 'system', userCount: 850,
    permissions: makePerms([], ['Dashboard', 'Fees', 'Attendance', 'Exams', 'Notices'], ['Students', 'Teachers', 'Classes', 'Staff & HR', 'Reports', 'Documents', 'Settings']),
    createdAt: '2024-01-01', updatedAt: '2024-01-01', isActive: true, color: '#546e7a',
  },
];

// ─── Inventory Management ───
export interface InventoryItem {
  id: string;
  name: string;
  category: 'furniture' | 'electronics' | 'stationery' | 'sports' | 'lab' | 'library' | 'cleaning' | 'other';
  location: string;
  quantity: number;
  minStock: number;
  unitPrice: number;
  condition: 'good' | 'fair' | 'poor' | 'damaged';
  lastAudit: string;
  supplier: string;
  purchaseDate: string;
}

export const mockInventory: InventoryItem[] = [
  { id: 'INV001', name: 'Student Desk (Single)', category: 'furniture', location: 'Classroom Block A', quantity: 320, minStock: 280, unitPrice: 3500, condition: 'good', lastAudit: '2024-08-15', supplier: 'Godrej Interio', purchaseDate: '2023-04-10' },
  { id: 'INV002', name: 'Student Chair (Plastic)', category: 'furniture', location: 'Classroom Block A & B', quantity: 350, minStock: 300, unitPrice: 1200, condition: 'good', lastAudit: '2024-08-15', supplier: 'Nilkamal Ltd', purchaseDate: '2023-04-10' },
  { id: 'INV003', name: 'Desktop Computer', category: 'electronics', location: 'Computer Lab', quantity: 42, minStock: 40, unitPrice: 45000, condition: 'good', lastAudit: '2024-09-01', supplier: 'Dell India', purchaseDate: '2023-06-20' },
  { id: 'INV004', name: 'Projector (HD)', category: 'electronics', location: 'Various Classrooms', quantity: 12, minStock: 10, unitPrice: 35000, condition: 'fair', lastAudit: '2024-07-20', supplier: 'Epson India', purchaseDate: '2022-08-15' },
  { id: 'INV005', name: 'Whiteboard (4x6 ft)', category: 'stationery', location: 'All Classrooms', quantity: 48, minStock: 45, unitPrice: 2800, condition: 'good', lastAudit: '2024-08-15', supplier: 'Writex India', purchaseDate: '2023-03-01' },
  { id: 'INV006', name: 'Cricket Kit (Full)', category: 'sports', location: 'Sports Room', quantity: 8, minStock: 5, unitPrice: 12000, condition: 'fair', lastAudit: '2024-06-10', supplier: 'SG Sports', purchaseDate: '2023-01-15' },
  { id: 'INV007', name: 'Microscope (Binocular)', category: 'lab', location: 'Biology Lab', quantity: 15, minStock: 12, unitPrice: 18000, condition: 'good', lastAudit: '2024-09-01', supplier: 'Labman Scientific', purchaseDate: '2023-07-01' },
  { id: 'INV008', name: 'Chemistry Lab Kit', category: 'lab', location: 'Chemistry Lab', quantity: 25, minStock: 20, unitPrice: 8500, condition: 'good', lastAudit: '2024-09-01', supplier: 'Labman Scientific', purchaseDate: '2023-07-01' },
  { id: 'INV009', name: 'Library Bookshelf (Steel)', category: 'library', location: 'Library', quantity: 30, minStock: 25, unitPrice: 6500, condition: 'good', lastAudit: '2024-05-20', supplier: 'Godrej Interio', purchaseDate: '2022-06-10' },
  { id: 'INV010', name: 'CCTV Camera (IP)', category: 'electronics', location: 'Campus-wide', quantity: 32, minStock: 30, unitPrice: 5500, condition: 'good', lastAudit: '2024-08-01', supplier: 'Hikvision India', purchaseDate: '2023-02-28' },
  { id: 'INV011', name: 'Marker Pen (Whiteboard)', category: 'stationery', location: 'Staff Room Store', quantity: 85, minStock: 100, unitPrice: 45, condition: 'good', lastAudit: '2024-09-05', supplier: 'Camlin', purchaseDate: '2024-08-01' },
  { id: 'INV012', name: 'First Aid Kit', category: 'other', location: 'Medical Room', quantity: 6, minStock: 5, unitPrice: 2200, condition: 'good', lastAudit: '2024-07-15', supplier: 'SafeFirst Medical', purchaseDate: '2024-01-10' },
  { id: 'INV013', name: 'Football (Match)', category: 'sports', location: 'Sports Room', quantity: 10, minStock: 8, unitPrice: 1800, condition: 'fair', lastAudit: '2024-06-10', supplier: 'Nivia Sports', purchaseDate: '2023-09-01' },
  { id: 'INV014', name: 'Printer (Laser A4)', category: 'electronics', location: 'Admin Office', quantity: 4, minStock: 3, unitPrice: 22000, condition: 'good', lastAudit: '2024-08-01', supplier: 'HP India', purchaseDate: '2023-05-15' },
  { id: 'INV015', name: 'Floor Cleaner (5L)', category: 'cleaning', location: 'Maintenance Store', quantity: 12, minStock: 15, unitPrice: 350, condition: 'good', lastAudit: '2024-09-05', supplier: 'Harpic India', purchaseDate: '2024-08-20' },
];

// ─── Communication Center ───
export interface Message {
  id: string;
  type: 'announcement' | 'circular' | 'sms' | 'email' | 'push';
  subject: string;
  content: string;
  audience: string;
  sentBy: string;
  sentAt: string;
  status: 'sent' | 'draft' | 'scheduled' | 'failed';
  recipients: number;
  readCount: number;
  scheduledAt?: string;
}

export const mockMessages: Message[] = [
  { id: 'MSG001', type: 'announcement', subject: 'Winter Vacation Notice', content: 'School will remain closed from 25th December to 5th January for winter vacation.', audience: 'All', sentBy: 'Dr. Vikram Rathore', sentAt: '2024-12-15', status: 'sent', recipients: 3500, readCount: 2890 },
  { id: 'MSG002', type: 'sms', subject: 'Fee Reminder - December', content: 'Dear Parent, kindly clear pending fee for Dec 2024 by 20th Dec. Late fee applicable after due date.', audience: 'Parents (Pending Fees)', sentBy: 'Accounts Dept', sentAt: '2024-12-10', status: 'sent', recipients: 420, readCount: 380 },
  { id: 'MSG003', type: 'email', subject: 'PTM Schedule - Class 10', content: 'Parent-Teacher Meeting for Class 10 is scheduled on 18th December from 9 AM to 1 PM.', audience: 'Parents (Class 10)', sentBy: 'Mrs. Sunita Sharma', sentAt: '2024-12-08', status: 'sent', recipients: 88, readCount: 76 },
  { id: 'MSG004', type: 'circular', subject: 'Annual Sports Day Preparation', content: 'All students must report in white PT uniform on 22nd Dec. Events list and schedule attached.', audience: 'Students & Teachers', sentBy: 'Mr. Rahul Joshi', sentAt: '2024-12-05', status: 'sent', recipients: 2900, readCount: 2100 },
  { id: 'MSG005', type: 'push', subject: 'Exam Results Published', content: 'Mid-term examination results for Class 6-12 have been published. Check the app for details.', audience: 'Parents', sentBy: 'System', sentAt: '2024-11-28', status: 'sent', recipients: 1800, readCount: 1650 },
  { id: 'MSG006', type: 'email', subject: 'Staff Meeting - Friday', content: 'Mandatory staff meeting on Friday 3 PM in the auditorium. Agenda: Annual plan review.', audience: 'All Staff', sentBy: 'Dr. Vikram Rathore', sentAt: '2024-12-12', status: 'sent', recipients: 65, readCount: 58 },
  { id: 'MSG007', type: 'announcement', subject: 'Republic Day Celebration', content: 'Republic Day will be celebrated on 26th January. Cultural program rehearsals start next week.', audience: 'All', sentBy: 'Mrs. Sunita Sharma', sentAt: '', status: 'draft', recipients: 0, readCount: 0 },
  { id: 'MSG008', type: 'sms', subject: 'Bus Route Change - Route 5', content: 'Route 5 bus timing changed to 7:15 AM from Monday due to road construction on MG Road.', audience: 'Parents (Route 5)', sentBy: 'Transport Dept', sentAt: '2024-12-14', status: 'sent', recipients: 45, readCount: 42 },
  { id: 'MSG009', type: 'email', subject: 'Scholarship Applications Open', content: 'Merit scholarship applications for 2025-26 are now open. Last date: 31st January 2025.', audience: 'Parents (Class 9-12)', sentBy: 'Accounts Dept', sentAt: '', status: 'scheduled', recipients: 350, readCount: 0, scheduledAt: '2025-01-05' },
  { id: 'MSG010', type: 'circular', subject: 'Lab Safety Guidelines Update', content: 'Updated lab safety guidelines must be followed by all science teachers. Training on 20th Dec.', audience: 'Science Teachers', sentBy: 'Mr. Anil Mehta', sentAt: '2024-12-11', status: 'sent', recipients: 12, readCount: 10 },
];

// ─── AI Insights ───
export interface AIInsight {
  id: string;
  title: string;
  category: 'performance' | 'attendance' | 'fee' | 'risk' | 'recommendation' | 'prediction';
  severity: 'info' | 'warning' | 'critical' | 'success';
  description: string;
  metric?: string;
  metricValue?: string;
  trend?: 'up' | 'down' | 'stable';
  actionable: boolean;
  suggestedAction?: string;
  affectedCount?: number;
  generatedAt: string;
}

export const mockAIInsights: AIInsight[] = [
  { id: 'AI001', title: 'Attendance Drop Alert - Class 8B', category: 'attendance', severity: 'warning', description: 'Class 8B attendance has dropped by 12% over the last 3 weeks. 8 students have been absent more than 5 days.', metric: 'Attendance Rate', metricValue: '78%', trend: 'down', actionable: true, suggestedAction: 'Send attendance warning to parents of frequently absent students and schedule a meeting with the class teacher.', affectedCount: 8, generatedAt: '2024-09-12' },
  { id: 'AI002', title: 'Fee Collection Below Target', category: 'fee', severity: 'critical', description: 'September fee collection is at 72% against 90% target. ₹8.4L pending from 156 students across classes 6-12.', metric: 'Collection Rate', metricValue: '72%', trend: 'down', actionable: true, suggestedAction: 'Send automated fee reminders via SMS and email. Consider scheduling parent calls for overdue amounts above ₹10,000.', affectedCount: 156, generatedAt: '2024-09-12' },
  { id: 'AI003', title: 'Top Performer Cluster - Science', category: 'performance', severity: 'success', description: 'Science department shows 15% improvement in average marks compared to last term. Class 10A leads with 82% average.', metric: 'Avg Improvement', metricValue: '+15%', trend: 'up', actionable: false, generatedAt: '2024-09-11' },
  { id: 'AI004', title: 'At-Risk Students Identified', category: 'risk', severity: 'critical', description: '23 students across Class 9 and 10 are at risk of failing based on combined attendance (<75%) and mid-term scores (<40%).', metric: 'Risk Score', metricValue: 'High', trend: 'stable', actionable: true, suggestedAction: 'Assign remedial classes and notify parents. Schedule one-on-one sessions with school counselor for top 10 at-risk students.', affectedCount: 23, generatedAt: '2024-09-12' },
  { id: 'AI005', title: 'Optimal Class Size Recommendation', category: 'recommendation', severity: 'info', description: 'Analysis shows classes with 35-40 students perform 8% better than those with 45+. Consider redistributing 3 overcrowded sections.', metric: 'Performance Gap', metricValue: '8%', actionable: true, suggestedAction: 'Review section strength for Class 6A (48), Class 7B (47), and Class 9A (46). Redistribute or create additional sections.', affectedCount: 3, generatedAt: '2024-09-10' },
  { id: 'AI006', title: 'Teacher Workload Imbalance', category: 'recommendation', severity: 'warning', description: '4 teachers have 30+ periods/week while 6 others have fewer than 20. Redistributing could improve teaching quality.', metric: 'Max Periods', metricValue: '34/week', trend: 'stable', actionable: true, suggestedAction: 'Review timetable allocation. Consider assigning additional subjects to under-utilized teachers.', affectedCount: 10, generatedAt: '2024-09-11' },
  { id: 'AI007', title: 'Predicted Enrollment Increase', category: 'prediction', severity: 'info', description: 'Based on admission inquiry trends, next academic year enrollment is projected to increase by 12% (~340 new students).', metric: 'Projected Growth', metricValue: '+12%', trend: 'up', actionable: true, suggestedAction: 'Plan additional sections for Class 1, 6, and 11. Begin infrastructure readiness assessment and teacher recruitment.', affectedCount: 340, generatedAt: '2024-09-09' },
  { id: 'AI008', title: 'Library Usage Declining', category: 'attendance', severity: 'warning', description: 'Library visits have dropped 25% this quarter. Only 18% of students borrowed books last month compared to 32% last year.', metric: 'Usage Rate', metricValue: '18%', trend: 'down', actionable: true, suggestedAction: 'Launch a reading challenge program. Consider updating the book collection based on student interest survey.', affectedCount: 0, generatedAt: '2024-09-10' },
  { id: 'AI009', title: 'Mathematics Needs Attention', category: 'performance', severity: 'warning', description: 'Mathematics pass rate has dipped to 82% in classes 8-10, down from 91% last year. Weakest topics: Algebra and Geometry.', metric: 'Pass Rate', metricValue: '82%', trend: 'down', actionable: true, suggestedAction: 'Arrange extra coaching for Algebra and Geometry. Consider peer-tutoring program pairing strong and weak students.', affectedCount: 0, generatedAt: '2024-09-11' },
  { id: 'AI010', title: 'Staff Retention Rate Excellent', category: 'recommendation', severity: 'success', description: 'Teacher retention rate is 96% over the last 2 years, well above the 85% industry average. Recognition program is working.', metric: 'Retention', metricValue: '96%', trend: 'up', actionable: false, generatedAt: '2024-09-08' },
];

// ─── School Settings ───
export interface SchoolSetting {
  id: string;
  category: 'general' | 'academic' | 'fees' | 'communication' | 'security' | 'system';
  label: string;
  description: string;
  type: 'text' | 'toggle' | 'select' | 'number';
  value: string;
  options?: string[];
}

export const mockSchoolSettings: SchoolSetting[] = [
  { id: 'SET001', category: 'general', label: 'School Name', description: 'Official name of the school', type: 'text', value: 'SchoolAI International Academy' },
  { id: 'SET002', category: 'general', label: 'School Code', description: 'CBSE/State Board affiliation code', type: 'text', value: 'CBSE-2024-MP-0456' },
  { id: 'SET003', category: 'general', label: 'Principal Name', description: 'Name of the school principal', type: 'text', value: 'Dr. Vikram Rathore' },
  { id: 'SET004', category: 'general', label: 'Contact Email', description: 'Primary school contact email', type: 'text', value: 'info@schoolai.in' },
  { id: 'SET005', category: 'general', label: 'Contact Phone', description: 'Primary school contact number', type: 'text', value: '+91 755-2456789' },
  { id: 'SET006', category: 'general', label: 'Address', description: 'School address', type: 'text', value: '123 Education Lane, Bhopal, MP 462001' },
  { id: 'SET007', category: 'academic', label: 'Academic Year', description: 'Current academic year', type: 'select', value: '2024-25', options: ['2023-24', '2024-25', '2025-26'] },
  { id: 'SET008', category: 'academic', label: 'Grading System', description: 'Student grading system', type: 'select', value: 'CBSE (9-point)', options: ['CBSE (9-point)', 'Percentage', 'GPA (10-point)', 'Letter Grade'] },
  { id: 'SET009', category: 'academic', label: 'Working Days/Week', description: 'Number of working days per week', type: 'number', value: '6' },
  { id: 'SET010', category: 'academic', label: 'Class Periods/Day', description: 'Number of periods per day', type: 'number', value: '8' },
  { id: 'SET011', category: 'academic', label: 'Period Duration (min)', description: 'Duration of each period in minutes', type: 'number', value: '40' },
  { id: 'SET012', category: 'academic', label: 'Minimum Attendance %', description: 'Minimum attendance required for promotion', type: 'number', value: '75' },
  { id: 'SET013', category: 'fees', label: 'Late Fee Penalty', description: 'Late fee penalty per month', type: 'number', value: '500' },
  { id: 'SET014', category: 'fees', label: 'Fee Due Day', description: 'Monthly fee due day', type: 'number', value: '10' },
  { id: 'SET015', category: 'fees', label: 'Auto Fee Reminder', description: 'Send automatic fee reminders', type: 'toggle', value: 'true' },
  { id: 'SET016', category: 'fees', label: 'Online Payment', description: 'Allow online fee payment', type: 'toggle', value: 'true' },
  { id: 'SET017', category: 'communication', label: 'SMS Notifications', description: 'Enable SMS notifications to parents', type: 'toggle', value: 'true' },
  { id: 'SET018', category: 'communication', label: 'Email Notifications', description: 'Enable email notifications', type: 'toggle', value: 'true' },
  { id: 'SET019', category: 'communication', label: 'Push Notifications', description: 'Enable push notifications on app', type: 'toggle', value: 'true' },
  { id: 'SET020', category: 'communication', label: 'Attendance Alert', description: 'Send daily attendance alerts to parents', type: 'toggle', value: 'true' },
  { id: 'SET021', category: 'security', label: 'Two-Factor Auth', description: 'Require 2FA for admin login', type: 'toggle', value: 'false' },
  { id: 'SET022', category: 'security', label: 'Session Timeout (min)', description: 'Auto logout after inactivity', type: 'number', value: '30' },
  { id: 'SET023', category: 'security', label: 'Password Expiry (days)', description: 'Force password change interval', type: 'number', value: '90' },
  { id: 'SET024', category: 'security', label: 'IP Restriction', description: 'Restrict admin access to specific IPs', type: 'toggle', value: 'false' },
  { id: 'SET025', category: 'system', label: 'Maintenance Mode', description: 'Put the system in maintenance mode', type: 'toggle', value: 'false' },
  { id: 'SET026', category: 'system', label: 'Data Backup', description: 'Automatic daily data backup', type: 'toggle', value: 'true' },
  { id: 'SET027', category: 'system', label: 'Backup Time', description: 'Daily backup schedule time', type: 'select', value: '02:00 AM', options: ['12:00 AM', '01:00 AM', '02:00 AM', '03:00 AM', '04:00 AM'] },
  { id: 'SET028', category: 'system', label: 'Log Retention (days)', description: 'Number of days to retain activity logs', type: 'number', value: '180' },
];
