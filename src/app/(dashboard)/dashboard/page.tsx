import Link from 'next/link';
import {
  getTodayAttendance,
  getAttendanceStats,
  getHomeworkList,
  getFeeDetails,
  getNotices,
  getTodayTimetable,
  getUpcomingEvents,
  getToday,
  getStudent,
  getCurrentHour,
} from '@/hooks/use-data';
import { formatCurrency, getSubjectColor, formatDate, getDaysUntil } from '@/lib/utils';
import { NOTICE_CATEGORY_LABELS } from '@/lib/constants';
import styles from './dashboard.module.css';

function getCategoryColor(category: string): { bg: string; text: string } {
  const map: Record<string, { bg: string; text: string }> = {
    holiday: { bg: 'var(--success-light)', text: 'var(--success-dark)' },
    exam: { bg: 'var(--danger-light)', text: 'var(--danger-dark)' },
    event: { bg: 'var(--primary-light)', text: 'var(--primary-dark)' },
    circular: { bg: 'var(--info-light)', text: 'var(--info-dark)' },
    fee: { bg: 'var(--warning-light)', text: 'var(--warning-dark)' },
    general: { bg: 'var(--gray-100)', text: 'var(--gray-600)' },
  };
  return map[category] || map.general;
}

function getStatusStyle(status: string): { bg: string; text: string } {
  const map: Record<string, { bg: string; text: string }> = {
    pending: { bg: 'var(--warning-light)', text: 'var(--warning-dark)' },
    submitted: { bg: 'var(--primary-light)', text: 'var(--primary-dark)' },
    evaluated: { bg: 'var(--success-light)', text: 'var(--success-dark)' },
    overdue: { bg: 'var(--danger-light)', text: 'var(--danger-dark)' },
  };
  return map[status] || map.pending;
}

const EVENT_TYPE_STYLE: Record<string, { bg: string; text: string; label: string }> = {
  exam: { bg: 'var(--danger-light)', text: 'var(--danger-dark)', label: 'Exam' },
  holiday: { bg: 'var(--success-light)', text: 'var(--success-dark)', label: 'Holiday' },
  event: { bg: 'var(--primary-light)', text: 'var(--primary-dark)', label: 'Event' },
  ptm: { bg: 'var(--warning-light)', text: 'var(--warning-dark)', label: 'PTM' },
};

export default function DashboardPage() {
  const todayAttendance = getTodayAttendance();
  const attendanceStats = getAttendanceStats();
  const allHomework = getHomeworkList();
  const feeDetails = getFeeDetails();
  const notices = getNotices();
  const todayTimetable = getTodayTimetable();
  const student = getStudent();
  const currentHour = getCurrentHour();
  const today = new Date(getToday());
  const upcomingEvents = getUpcomingEvents();

  const pendingHW = allHomework.filter((h) => h.status === 'pending' || h.status === 'overdue');
  const nextInstallment = feeDetails.installments.find((i) => i.status === 'pending');
  const paidPercentage = (feeDetails.totalPaid / feeDetails.totalAnnualFee) * 100;
  const classPeriods = todayTimetable.filter((p) => p.type === 'class').slice(0, 5);

  return (
    <div className={styles.page}>
      {todayAttendance.status === 'absent' && (
        <div className={styles.alertBanner} role="alert">
          <div>
            <div className={styles.alertBannerTitle}>{student.name} is marked absent today</div>
            <div className={styles.alertBannerText}>An instant alert was sent to your phone. If this is unexpected, contact the class teacher.</div>
          </div>
          <Link href="/leave" className={styles.alertBannerBtn}>Apply Leave</Link>
        </div>
      )}

      {/* ── Stat Cards ── */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: todayAttendance.status === 'present' ? 'var(--success-light)' : 'var(--danger-light)', color: todayAttendance.status === 'present' ? 'var(--success)' : 'var(--danger)' }}>
            <svg width="22" height="22" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 10l2.5 2.5L14 7" />
              <circle cx="10" cy="10" r="8" />
            </svg>
          </div>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>Today&apos;s Attendance</div>
            <div className={styles.statValue} style={{ color: todayAttendance.status === 'present' ? 'var(--success)' : 'var(--danger)', textTransform: 'capitalize' }}>
              {todayAttendance.status}
            </div>
            <div className={styles.statSub}>Check-in: {todayAttendance.checkInTime}</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
            <svg width="22" height="22" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="10" cy="10" r="8" />
              <path d="M10 6v4l2.5 2.5" />
            </svg>
          </div>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>Attendance Rate</div>
            <div className={styles.statValue}>{attendanceStats.percentage}%</div>
            <div className={styles.statSub}>{attendanceStats.present}/{attendanceStats.totalDays} days</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: pendingHW.length > 0 ? 'var(--warning-light)' : 'var(--success-light)', color: pendingHW.length > 0 ? 'var(--warning)' : 'var(--success)' }}>
            <svg width="22" height="22" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h12v14H4z" />
              <path d="M7 8h6M7 11h6M7 14h3" />
            </svg>
          </div>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>Pending Homework</div>
            <div className={styles.statValue}>{pendingHW.length}</div>
            <div className={styles.statSub}>{allHomework.filter(h => h.status === 'overdue').length} overdue</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: 'var(--success-light)', color: 'var(--success)' }}>
            <svg width="22" height="22" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 2v16M6 6h5.5a2.5 2.5 0 010 5H6M6 11h6.5a2.5 2.5 0 010 5H6" />
            </svg>
          </div>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>Fee Status</div>
            <div className={styles.statValue}>{formatCurrency(feeDetails.totalBalance)}</div>
            <div className={styles.statSub}>Balance remaining</div>
          </div>
        </div>
      </div>

      {/* ── Quick Actions ── */}
      <div className={styles.quickActions}>
        <Link href="/leave" className={styles.quickAction}>
          <div className={styles.quickActionIcon} style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="14" height="14" rx="2" /><path d="M3 7h14" /><path d="M7 2v2M13 2v2" /></svg>
          </div>
          <span className={styles.quickActionLabel}>Apply Leave</span>
        </Link>
        <Link href="/chat" className={styles.quickAction}>
          <div className={styles.quickActionIcon} style={{ background: 'var(--success-light)', color: 'var(--success)' }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 4h14a1 1 0 011 1v8a1 1 0 01-1 1h-4l-3 3-3-3H3a1 1 0 01-1-1V5a1 1 0 011-1z" /></svg>
          </div>
          <span className={styles.quickActionLabel}>Chat with Teacher</span>
        </Link>
        <Link href="/timetable" className={styles.quickAction}>
          <div className={styles.quickActionIcon} style={{ background: 'var(--warning-light)', color: 'var(--warning)' }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="10" cy="10" r="8" /><path d="M10 5v5l3 3" /></svg>
          </div>
          <span className={styles.quickActionLabel}>Timetable</span>
        </Link>
        <Link href="/fees" className={styles.quickAction}>
          <div className={styles.quickActionIcon} style={{ background: 'var(--info-light)', color: 'var(--info)' }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M10 2v16M6 6h5.5a2.5 2.5 0 010 5H6M6 11h6.5a2.5 2.5 0 010 5H6" /></svg>
          </div>
          <span className={styles.quickActionLabel}>Pay Fees</span>
        </Link>
      </div>

      {/* ── Content Grid ── */}
      <div className={styles.contentGrid}>
        {/* Homework Card */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={styles.cardTitle}>Homework</span>
            <Link href="/homework" className={styles.cardAction}>View All</Link>
          </div>
          <div className={styles.cardBody}>
            {allHomework.slice(0, 4).map((hw) => {
              const statusStyle = getStatusStyle(hw.status);
              return (
                <div key={hw.id} className={styles.homeworkItem}>
                  <span className={styles.subjectDot} style={{ background: getSubjectColor(hw.subject) }} />
                  <div className={styles.homeworkContent}>
                    <div className={styles.homeworkTitle}>{hw.title}</div>
                    <div className={styles.homeworkMeta}>{hw.subject} &middot; Due: {formatDate(hw.dueDate)}</div>
                  </div>
                  <span className={styles.statusBadge} style={{ background: statusStyle.bg, color: statusStyle.text }}>
                    {hw.status}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Announcements Card */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={styles.cardTitle}>Announcements</span>
            <Link href="/notices" className={styles.cardAction}>View All</Link>
          </div>
          <div className={styles.cardBody}>
            {notices.slice(0, 4).map((notice) => {
              const catColor = getCategoryColor(notice.category);
              return (
                <div key={notice.id} className={styles.noticeItem}>
                  <span className={styles.noticeTag} style={{ background: catColor.bg, color: catColor.text }}>
                    {NOTICE_CATEGORY_LABELS[notice.category]}
                  </span>
                  <div className={styles.noticeContent}>
                    <div className={styles.noticeTitle}>{notice.title}</div>
                    <div className={styles.noticeDate}>{formatDate(notice.postedDate)}</div>
                  </div>
                  {!notice.isRead && <span className={styles.unreadDot} />}
                </div>
              );
            })}
          </div>
        </div>

        {/* Today's Timetable */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={styles.cardTitle}>Today&apos;s Timetable</span>
            <Link href="/timetable" className={styles.cardAction}>Full Schedule</Link>
          </div>
          <div className={styles.cardBody}>
            {classPeriods.map((period) => (
              <div key={period.period} className={styles.timetableItem}>
                <span className={`${styles.periodNum} ${parseInt(period.startTime) <= currentHour && parseInt(period.endTime) > currentHour ? styles.periodCurrent : ''}`}>
                  {period.period}
                </span>
                <div className={styles.timetableInfo}>
                  <div className={styles.timetableSubject}>{period.subject}</div>
                  <div className={styles.timetableTeacher}>{period.teacher}</div>
                </div>
                <span className={styles.timetableTime}>{period.startTime} - {period.endTime}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Fee Summary */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={styles.cardTitle}>Fee Summary</span>
            <Link href="/fees" className={styles.cardAction}>Details</Link>
          </div>
          <div className={styles.cardBody}>
            <div className={styles.feeProgress}>
              <div className={styles.feeRow}>
                <span className={styles.feeLabel}>Annual Fee</span>
                <span className={styles.feeAmount}>{formatCurrency(feeDetails.totalAnnualFee)}</span>
              </div>
              <div className={styles.progressBar}>
                <div className={styles.progressFill} style={{ width: `${paidPercentage}%` }} />
              </div>
              <div className={styles.feeRow}>
                <span className={styles.feeLabel}>Paid</span>
                <span className={styles.feeAmount} style={{ color: 'var(--success)' }}>{formatCurrency(feeDetails.totalPaid)}</span>
              </div>
              {nextInstallment && (
                <div className={styles.feeDue}>
                  <div>
                    <div className={styles.feeDueLabel}>Next Due: {formatDate(nextInstallment.dueDate)}</div>
                  </div>
                  <span className={styles.feeDueAmount}>{formatCurrency(nextInstallment.amount)}</span>
                </div>
              )}
              <Link href="/fees" className={styles.payButton}>Pay Now</Link>
            </div>
          </div>
        </div>

        {/* Upcoming Events */}
        <div className={`${styles.card} ${styles.cardWide}`}>
          <div className={styles.cardHeader}>
            <span className={styles.cardTitle}>Upcoming Events</span>
            <Link href="/timetable" className={styles.cardAction}>Exam Schedule</Link>
          </div>
          <div className={styles.eventsGrid}>
            {upcomingEvents.map((event) => {
              const eventStyle = EVENT_TYPE_STYLE[event.type];
              const daysLeft = getDaysUntil(event.date, today);
              const eventDate = new Date(event.date);
              return (
                <div key={event.id} className={styles.eventItem}>
                  <div className={styles.eventDate}>
                    <span className={styles.eventDay}>{eventDate.getDate()}</span>
                    <span className={styles.eventMonth}>{eventDate.toLocaleDateString('en-IN', { month: 'short' })}</span>
                  </div>
                  <div className={styles.eventInfo}>
                    <div className={styles.eventTitle}>{event.title}</div>
                    <div className={styles.eventMeta}>
                      <span className={styles.eventTag} style={{ background: eventStyle.bg, color: eventStyle.text }}>{eventStyle.label}</span>
                      <span>{event.time ? `${event.time} · ` : ''}{daysLeft === 0 ? 'Today' : daysLeft === 1 ? 'Tomorrow' : `in ${daysLeft} days`}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
