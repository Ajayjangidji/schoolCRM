'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  getTodayAttendance,
  getAttendanceStats,
  getMonthlyAttendance,
  getAttendanceCalendar,
  getAttendanceCalendarMonths,
  getAttendanceAlerts,
  getToday,
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

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function parseMonthKey(monthKey: string) {
  const [year, month] = monthKey.split('-').map(Number);
  return { year, monthIndex: month - 1 };
}

function buildCalendarDays(monthKey: string, today: string) {
  const { year, monthIndex } = parseMonthKey(monthKey);
  const statuses = getAttendanceCalendar(monthKey);
  const firstDay = new Date(year, monthIndex, 1).getDay();
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

  const days: Array<{ day: number; status: string }> = [];
  for (let i = 0; i < firstDay; i++) days.push({ day: 0, status: 'empty' });

  for (let d = 1; d <= daysInMonth; d++) {
    const date = `${monthKey}-${String(d).padStart(2, '0')}`;
    const status = statuses[d];
    if (!status || (date > today && status !== 'holiday')) days.push({ day: d, status: 'future' });
    else days.push({ day: d, status });
  }
  return days;
}

function summarizeMonth(days: Array<{ day: number; status: string }>) {
  const count = (status: string) => days.filter((d) => d.status === status).length;
  const present = count('present');
  const late = count('late');
  const absent = count('absent');
  const leave = count('leave');
  const working = present + late + absent + leave;
  return { present, late, absent, leave, percentage: working > 0 ? Math.round(((present + late) / working) * 100) : 0 };
}

const CHANNEL_LABELS: Record<string, string> = { push: 'Push', sms: 'SMS', email: 'Email' };

export default function AttendancePage() {
  const todayAttendance = getTodayAttendance();
  const stats = getAttendanceStats();
  const recentRecords = getMonthlyAttendance();
  const alerts = getAttendanceAlerts();
  const today = getToday();
  const months = getAttendanceCalendarMonths();

  const [monthKey, setMonthKey] = useState(today.slice(0, 7));
  const monthIndexInList = months.indexOf(monthKey);
  const { year, monthIndex } = parseMonthKey(monthKey);
  const calendarDays = buildCalendarDays(monthKey, today);
  const monthSummary = summarizeMonth(calendarDays);
  const monthlyTrend = months.map((key) => {
    const summary = summarizeMonth(buildCalendarDays(key, today));
    return { key, month: MONTH_NAMES[parseMonthKey(key).monthIndex].slice(0, 3), percentage: summary.percentage };
  });
  const todayStatus = getStatusBg(todayAttendance.status);
  const isAbsentToday = todayAttendance.status === 'absent';

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
            {isAbsentToday
              ? `Marked by ${todayAttendance.markedBy} · Parent alert sent instantly`
              : `Check-in at ${todayAttendance.checkInTime} · Marked by ${todayAttendance.markedBy}`}
          </div>
        </div>
        {isAbsentToday && (
          <Link href="/leave" className={styles.bannerAction}>Apply Leave</Link>
        )}
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
            <span className={styles.cardTitle}>Attendance Calendar</span>
            <div className={styles.monthSelector}>
              <button
                className={styles.monthBtn}
                aria-label="Previous month"
                disabled={monthIndexInList <= 0}
                onClick={() => setMonthKey(months[monthIndexInList - 1])}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M10 4l-4 4 4 4" /></svg>
              </button>
              <span className={styles.monthLabel}>{MONTH_NAMES[monthIndex]} {year}</span>
              <button
                className={styles.monthBtn}
                aria-label="Next month"
                disabled={monthIndexInList === -1 || monthIndexInList >= months.length - 1}
                onClick={() => setMonthKey(months[monthIndexInList + 1])}
              >
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
                  <div key={i} className={dayClass} title={day.status !== 'empty' ? `${day.day} ${MONTH_NAMES[monthIndex].slice(0, 3)} — ${day.status}` : ''}>
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
            <div className={styles.monthSummary}>
              <span><strong>{monthSummary.present}</strong> present</span>
              <span><strong>{monthSummary.late}</strong> late</span>
              <span><strong>{monthSummary.absent}</strong> absent</span>
              <span><strong>{monthSummary.leave}</strong> leave</span>
              <span className={styles.monthSummaryRate}>{monthSummary.percentage}% this month</span>
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
                <button
                  key={m.key}
                  className={`${styles.trendBar} ${m.key === monthKey ? styles.trendBarActive : ''}`}
                  onClick={() => setMonthKey(m.key)}
                  title={`View ${m.month} calendar`}
                >
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
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Alerts sent to parent */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <span className={styles.cardTitle}>Absence &amp; Late Alerts</span>
          <Link href="/settings" className={styles.cardLink}>Alert settings</Link>
        </div>
        <div className={styles.cardBody}>
          <div className={styles.alertList}>
            {alerts.map((alert) => (
              <div key={alert.id} className={styles.alertItem}>
                <span className={styles.alertDot} />
                <div className={styles.alertContent}>
                  <div className={styles.alertMessage}>{alert.message}</div>
                  <div className={styles.alertMeta}>
                    {formatDate(alert.date)} · sent {alert.sentAt} via{' '}
                    {alert.channels.map((c) => CHANNEL_LABELS[c]).join(', ')}
                  </div>
                </div>
              </div>
            ))}
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
