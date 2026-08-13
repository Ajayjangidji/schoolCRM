import Link from 'next/link';
import {
  getTeacher,
  getTeacherClasses,
  getTeacherTimetable,
  getClassAttendance,
  getHomeworkAssigned,
  getSubmissionsToReview,
  getTeacherNotices,
  getLeaveToApprove,
  getParentMessages,
} from '@/hooks/use-teacher-data';
import { getInitials, formatDate } from '@/lib/utils';
import styles from './dashboard.module.css';

function getPriorityColor(priority: string): string {
  const map: Record<string, string> = {
    urgent: 'var(--danger)',
    high: 'var(--warning)',
    normal: 'var(--success)',
  };
  return map[priority] || 'var(--gray-400)';
}

export default function TeacherDashboardPage() {
  const teacher = getTeacher();
  const classes = getTeacherClasses();
  const timetable = getTeacherTimetable();
  const attendance = getClassAttendance();
  const homework = getHomeworkAssigned();
  const submissions = getSubmissionsToReview();
  const notices = getTeacherNotices();
  const leaveRequests = getLeaveToApprove();
  const messages = getParentMessages();

  const totalStudents = classes.reduce((sum, c) => sum + c.totalStudents, 0);
  const classesToday = timetable.filter((p) => p.type === 'class').length;
  const unmarkedCount = attendance.filter((a) => !a.isMarked).length;
  const pendingReviews = submissions.filter((s) => s.status === 'pending-review').length;
  const pendingHomework = homework.filter((h) => h.status === 'active' || h.status === 'past-due');
  const totalSubmitted = pendingHomework.reduce((s, h) => s + h.submitted, 0);
  const totalExpected = pendingHomework.reduce((s, h) => s + h.totalStudents, 0);
  const unreadMessages = messages.reduce((s, m) => s + m.unreadCount, 0);

  const today = new Date();
  const hour = today.getHours();
  const greetWord = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';
  const dateStr = today.toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className={styles.page}>
      {/* ── Greeting ── */}
      <div className={styles.greeting}>
        <div className={styles.greetText}>
          <h1>{greetWord}, {teacher.name.split(' ').slice(1).join(' ')}!</h1>
          <div className={styles.greetSub}>
            {teacher.subject} Teacher &middot; {teacher.designation}
          </div>
        </div>
        <div className={styles.dateBadge}>
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="14" height="14" rx="2" />
            <path d="M3 7h14" />
            <path d="M7 2v2M13 2v2" />
          </svg>
          {dateStr}
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
            <svg width="22" height="22" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="7" cy="6" r="3" />
              <path d="M2 16c0-3 2.5-5 5-5s5 2 5 5" />
              <circle cx="14" cy="7" r="2" />
              <path d="M14 11c2 0 4 1.5 4 4" />
            </svg>
          </div>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>Total Students</div>
            <div className={styles.statValue}>{totalStudents}</div>
            <div className={styles.statSub}>Across {classes.length} classes</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: 'var(--info-light)', color: 'var(--info)' }}>
            <svg width="22" height="22" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="3" width="16" height="14" rx="2" />
              <path d="M2 7h16" />
              <path d="M6 3v4M10 3v4M14 3v4" />
            </svg>
          </div>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>Classes Today</div>
            <div className={styles.statValue}>{classesToday}</div>
            <div className={styles.statSub}>{timetable.filter(p => p.type === 'free').length} free periods</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: unmarkedCount > 0 ? 'var(--warning-light)' : 'var(--success-light)', color: unmarkedCount > 0 ? 'var(--warning)' : 'var(--success)' }}>
            <svg width="22" height="22" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 10l2.5 2.5L14 7" />
              <rect x="2" y="3" width="16" height="14" rx="2" />
            </svg>
          </div>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>Attendance</div>
            <div className={styles.statValue} style={{ color: unmarkedCount > 0 ? 'var(--warning)' : 'var(--success)' }}>
              {unmarkedCount > 0 ? `${unmarkedCount} Unmarked` : 'All Done'}
            </div>
            <div className={styles.statSub}>{attendance.filter(a => a.isMarked).length}/{attendance.length} classes marked</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: pendingReviews > 0 ? 'var(--danger-light)' : 'var(--success-light)', color: pendingReviews > 0 ? 'var(--danger)' : 'var(--success)' }}>
            <svg width="22" height="22" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h12v14H4z" />
              <path d="M7 8h6M7 11h6M7 14h3" />
              <path d="M4 4l2-2h8l2 2" />
            </svg>
          </div>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>Pending Reviews</div>
            <div className={styles.statValue}>{pendingReviews}</div>
            <div className={styles.statSub}>{totalSubmitted}/{totalExpected} submitted</div>
          </div>
        </div>
      </div>

      {/* ── Quick Actions ── */}
      <div className={styles.quickActions}>
        <Link href="/teacher/attendance" className={styles.quickAction}>
          <div className={styles.quickActionIcon} style={{ background: 'var(--success-light)', color: 'var(--success)' }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 10l2.5 2.5L14 7" />
              <rect x="2" y="3" width="16" height="14" rx="2" />
            </svg>
          </div>
          <span className={styles.quickActionLabel}>Mark Attendance</span>
        </Link>
        <Link href="/teacher/homework" className={styles.quickAction}>
          <div className={styles.quickActionIcon} style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h12v14H4z" />
              <path d="M7 8h6M7 11h6M7 14h3" />
              <path d="M4 4l2-2h8l2 2" />
            </svg>
          </div>
          <span className={styles.quickActionLabel}>Assign Homework</span>
        </Link>
        <Link href="/teacher/messages" className={styles.quickAction}>
          <div className={styles.quickActionIcon} style={{ background: 'var(--warning-light)', color: 'var(--warning)' }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 4h14a1 1 0 011 1v8a1 1 0 01-1 1h-4l-3 3-3-3H3a1 1 0 01-1-1V5a1 1 0 011-1z" />
            </svg>
          </div>
          <span className={styles.quickActionLabel}>Messages{unreadMessages > 0 ? ` (${unreadMessages})` : ''}</span>
        </Link>
        <Link href="/teacher/leave" className={styles.quickAction}>
          <div className={styles.quickActionIcon} style={{ background: 'var(--info-light)', color: 'var(--info)' }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="14" height="14" rx="2" />
              <path d="M3 7h14" />
              <path d="M7 2v2M13 2v2" />
            </svg>
          </div>
          <span className={styles.quickActionLabel}>Leave Requests ({leaveRequests.length})</span>
        </Link>
      </div>

      {/* ── Content Grid ── */}
      <div className={styles.contentGrid}>
        {/* Today's Schedule */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={styles.cardTitle}>Today&apos;s Schedule</span>
            <Link href="/teacher/timetable" className={styles.cardAction}>Full Timetable</Link>
          </div>
          <div className={styles.cardBody}>
            {timetable.map((period, i) => (
              <div key={i} className={styles.timetableItem}>
                <span className={`${styles.periodBadge} ${period.type === 'class' ? '' : period.type === 'free' ? styles.periodFree : styles.periodBreak}`}>
                  {period.type === 'class' ? period.period : period.type === 'break' ? 'B' : period.type === 'lunch' ? 'L' : 'F'}
                </span>
                <div className={styles.timetableInfo}>
                  <div className={styles.timetableSubject}>
                    {period.type === 'class'
                      ? `${period.subject}`
                      : period.type === 'free'
                        ? 'Free Period'
                        : period.subject || (period.type === 'lunch' ? 'Lunch Break' : 'Break')}
                  </div>
                  <div className={styles.timetableDetail}>
                    {period.type === 'class'
                      ? `Class ${period.class}-${period.section} · ${period.room}`
                      : ' '}
                  </div>
                </div>
                <span className={styles.timetableTime}>{period.startTime} - {period.endTime}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Attendance Overview */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={styles.cardTitle}>Attendance Overview</span>
            <Link href="/teacher/attendance" className={styles.cardAction}>Mark Now</Link>
          </div>
          <div className={styles.cardBody}>
            {attendance.map((cls) => (
              <div key={cls.classSection} className={styles.attendanceRow}>
                <span className={styles.classLabel}>{cls.classSection}</span>
                {cls.isMarked ? (
                  <>
                    <div className={styles.attendanceBar}>
                      <div
                        className={styles.attendanceFill}
                        style={{ width: `${(cls.present / cls.totalStudents) * 100}%` }}
                      />
                    </div>
                    <span className={styles.attendanceStats}>
                      {cls.present}/{cls.totalStudents}
                    </span>
                    <span className={styles.markedBadge}>Done</span>
                  </>
                ) : (
                  <>
                    <div className={styles.attendanceBar} />
                    <span className={styles.attendanceStats}>{cls.totalStudents} students</span>
                    <span className={styles.unmarkedBadge}>Unmarked</span>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Submissions to Review */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={styles.cardTitle}>Submissions to Review</span>
            <Link href="/teacher/homework" className={styles.cardAction}>View All</Link>
          </div>
          <div className={styles.cardBody}>
            {submissions.slice(0, 4).map((sub) => (
              <div key={sub.id} className={styles.submissionItem}>
                <div className={styles.submissionAvatar}>
                  {getInitials(sub.studentName)}
                </div>
                <div className={styles.submissionContent}>
                  <div className={styles.submissionName}>{sub.studentName}</div>
                  <div className={styles.submissionMeta}>
                    {sub.homeworkTitle} &middot; {sub.classSection}
                  </div>
                </div>
                <span className={styles.reviewBadge}>Review</span>
              </div>
            ))}
          </div>
        </div>

        {/* Notices */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={styles.cardTitle}>Notices</span>
            <Link href="/teacher/notices" className={styles.cardAction}>View All</Link>
          </div>
          <div className={styles.cardBody}>
            {notices.map((notice) => (
              <div key={notice.id} className={styles.noticeItem}>
                <span
                  className={styles.priorityDot}
                  style={{ background: getPriorityColor(notice.priority) }}
                />
                <div className={styles.noticeContent}>
                  <div className={styles.noticeTitle}>{notice.title}</div>
                  <div className={styles.noticeDate}>{formatDate(notice.date)}</div>
                </div>
                {!notice.isRead && <span className={styles.unreadDot} />}
              </div>
            ))}
          </div>
        </div>

        {/* Leave Requests */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={styles.cardTitle}>Pending Leave Requests</span>
            <Link href="/teacher/leave" className={styles.cardAction}>View All</Link>
          </div>
          <div className={styles.cardBody}>
            {leaveRequests.filter(l => l.status === 'pending').map((leave) => (
              <div key={leave.id} className={styles.leaveItem}>
                <div className={styles.leaveInfo}>
                  <div className={styles.leaveName}>
                    {leave.studentName} ({leave.classSection})
                  </div>
                  <div className={styles.leaveMeta}>
                    {leave.type} &middot; {formatDate(leave.fromDate)}
                    {leave.fromDate !== leave.toDate && ` - ${formatDate(leave.toDate)}`}
                  </div>
                </div>
                <div className={styles.leaveActions}>
                  <button className={styles.approveBtn}>Approve</button>
                  <button className={styles.rejectBtn}>Reject</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Parent Messages */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={styles.cardTitle}>Parent Messages</span>
            <Link href="/teacher/messages" className={styles.cardAction}>View All</Link>
          </div>
          <div className={styles.cardBody}>
            {messages.map((msg) => (
              <div key={msg.id} className={styles.messageItem}>
                <div className={styles.messageAvatar}>
                  {getInitials(msg.parentName)}
                  {msg.isOnline && <span className={styles.onlineDot} />}
                </div>
                <div className={styles.messageContent}>
                  <div className={styles.messageName}>
                    {msg.parentName}
                    <span style={{ fontWeight: 'var(--font-normal)', color: 'var(--text-tertiary)', fontSize: 'var(--text-xs)' }}>
                      {' '}({msg.studentName})
                    </span>
                  </div>
                  <div className={styles.messagePreview}>{msg.lastMessage}</div>
                </div>
                {msg.unreadCount > 0 && (
                  <span className={styles.unreadCount}>{msg.unreadCount}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
