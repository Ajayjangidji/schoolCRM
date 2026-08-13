'use client';

import {
  getTodayAttendance,
  getAttendanceStats,
  getMonthlyAttendance,
} from '@/hooks/use-data';
import { formatDate } from '@/lib/utils';
import { ATTENDANCE_STATUS_LABELS } from '@/lib/constants';
import styles from './attendance.module.css';

function getStatusBg(status: string) {
  const map: Record<string, { bg: string; color: string }> = {
    present: { bg: 'var(--success-light)', color: 'var(--success)' },
    absent: { bg: 'var(--danger-light)', color: 'var(--danger)' },
    late: { bg: 'var(--warning-light)', color: 'var(--warning)' },
    'half-day': { bg: 'var(--info-light)', color: 'var(--info)' },
    holiday: { bg: 'var(--gray-100)', color: 'var(--gray-500)' },
    leave: { bg: 'var(--info-light)', color: 'var(--info)' },
  };
  return map[status] || map.present;
}

function generateCalendarDays() {
  const year = 2026;
  const month = 7; // August (0-indexed)
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = 9;

  const statusMap: Record<number, string> = {
    1: 'present', 2: 'present', 3: 'holiday', 4: 'present',
    5: 'late', 6: 'present', 7: 'present', 8: 'present', 9: 'present',
    10: 'holiday', 11: 'absent', 12: 'present', 13: 'present',
    14: 'holiday', 15: 'present',
  };

  const days: Array<{ day: number; status: string }> = [];

  for (let i = 0; i < firstDay; i++) {
    days.push({ day: 0, status: 'empty' });
  }

  for (let d = 1; d <= daysInMonth; d++) {
    if (d > today) {
      days.push({ day: d, status: 'future' });
    } else {
      days.push({ day: d, status: statusMap[d] || 'present' });
    }
  }

  return days;
}

const monthlyTrend = [
  { month: 'Apr', percentage: 95 },
  { month: 'May', percentage: 88 },
  { month: 'Jun', percentage: 92 },
  { month: 'Jul', percentage: 90 },
  { month: 'Aug', percentage: 93 },
];

export default function AttendancePage() {
  const todayAttendance = getTodayAttendance();
  const stats = getAttendanceStats();
  const recentRecords = getMonthlyAttendance();
  const calendarDays = generateCalendarDays();
  const todayStatus = getStatusBg(todayAttendance.status);

  return (
    <div className={styles.page}>
      {/* Today's Banner */}
      <div className={styles.todayBanner}>
        <div className={styles.statusIcon} style={{ background: todayStatus.bg, color: todayStatus.color }}>
          {todayAttendance.status === 'present' ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 12l2 2 4-4" /><circle cx="12" cy="12" r="10" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" /><path d="M15 9l-6 6M9 9l6 6" />
            </svg>
          )}
        </div>
        <div className={styles.statusContent}>
          <div className={styles.statusLabel}>Today&apos;s Attendance — {formatDate(todayAttendance.date)}</div>
          <div className={styles.statusValue} style={{ color: todayStatus.color }}>
            {ATTENDANCE_STATUS_LABELS[todayAttendance.status]}
          </div>
          <div className={styles.statusMeta}>
            Check-in at {todayAttendance.checkInTime} &middot; Marked by {todayAttendance.markedBy}
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className={styles.statsRow}>
        <div className={styles.statItem}>
          <div className={styles.statNumber} style={{ color: 'var(--text-primary)' }}>{stats.totalDays}</div>
          <div className={styles.statLabel}>Working Days</div>
        </div>
        <div className={styles.statItem}>
          <div className={styles.statNumber} style={{ color: 'var(--success)' }}>{stats.present}</div>
          <div className={styles.statLabel}>Present</div>
        </div>
        <div className={styles.statItem}>
          <div className={styles.statNumber} style={{ color: 'var(--danger)' }}>{stats.absent}</div>
          <div className={styles.statLabel}>Absent</div>
        </div>
        <div className={styles.statItem}>
          <div className={styles.statNumber} style={{ color: 'var(--warning)' }}>{stats.late}</div>
          <div className={styles.statLabel}>Late</div>
        </div>
        <div className={styles.statItem}>
          <div className={styles.statNumber} style={{ color: 'var(--primary)' }}>{stats.percentage}%</div>
          <div className={styles.statLabel}>Attendance Rate</div>
        </div>
      </div>

      {/* Calendar + Trend */}
      <div className={styles.contentRow}>
        {/* Calendar Heatmap */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={styles.cardTitle}>August 2026</span>
            <div className={styles.monthSelector}>
              <button className={styles.monthBtn}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M10 4l-4 4 4 4" /></svg>
              </button>
              <span className={styles.monthLabel}>August</span>
              <button className={styles.monthBtn}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 4l4 4-4 4" /></svg>
              </button>
            </div>
          </div>
          <div className={styles.cardBody}>
            <div className={styles.calendarGrid}>
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                <div key={d} className={styles.calendarDayHeader}>{d}</div>
              ))}
              {calendarDays.map((day, i) => {
                let dayClass = styles.calendarDay;
                if (day.status === 'empty') dayClass += ` ${styles.dayEmpty}`;
                else if (day.status === 'future') dayClass += ` ${styles.dayFuture}`;
                else if (day.status === 'present') dayClass += ` ${styles.dayPresent}`;
                else if (day.status === 'absent') dayClass += ` ${styles.dayAbsent}`;
                else if (day.status === 'late') dayClass += ` ${styles.dayLate}`;
                else if (day.status === 'holiday') dayClass += ` ${styles.dayHoliday}`;
                else if (day.status === 'leave') dayClass += ` ${styles.dayLeave}`;
                return (
                  <div key={i} className={dayClass} title={day.status !== 'empty' ? `${day.day} Aug — ${day.status}` : ''}>
                    {day.day > 0 ? day.day : ''}
                  </div>
                );
              })}
            </div>
            <div className={styles.legend}>
              <div className={styles.legendItem}><span className={styles.legendDot} style={{ background: 'var(--success)' }} /> Present</div>
              <div className={styles.legendItem}><span className={styles.legendDot} style={{ background: 'var(--danger)' }} /> Absent</div>
              <div className={styles.legendItem}><span className={styles.legendDot} style={{ background: 'var(--warning)' }} /> Late</div>
              <div className={styles.legendItem}><span className={styles.legendDot} style={{ background: 'var(--gray-300)' }} /> Holiday</div>
              <div className={styles.legendItem}><span className={styles.legendDot} style={{ background: 'var(--info)' }} /> Leave</div>
            </div>
          </div>
        </div>

        {/* Monthly Trend */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={styles.cardTitle}>Monthly Trend</span>
          </div>
          <div className={styles.cardBody}>
            <div className={styles.trendChart}>
              {monthlyTrend.map((m) => (
                <div key={m.month} className={styles.trendBar}>
                  <div className={styles.trendBarValue}>{m.percentage}%</div>
                  <div
                    className={styles.trendBarFill}
                    style={{
                      height: `${m.percentage}%`,
                      background: m.percentage >= 90
                        ? 'var(--success)'
                        : m.percentage >= 75
                          ? 'var(--warning)'
                          : 'var(--danger)',
                    }}
                  />
                  <div className={styles.trendBarLabel}>{m.month}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Attendance Log */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <span className={styles.cardTitle}>Recent Attendance Log</span>
        </div>
        <div className={styles.cardBody}>
          <div className={styles.logList}>
            {recentRecords.map((rec) => {
              const s = getStatusBg(rec.status);
              return (
                <div key={rec.id} className={styles.logItem}>
                  <span className={styles.logDate}>{formatDate(rec.date)}</span>
                  <span className={styles.logStatus} style={{ background: s.bg, color: s.color }}>
                    {ATTENDANCE_STATUS_LABELS[rec.status]}
                  </span>
                  <span className={styles.logTime}>{rec.checkInTime || '—'}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
