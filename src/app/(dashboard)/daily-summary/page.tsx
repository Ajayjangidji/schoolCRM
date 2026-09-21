'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  getDailySummary,
  getNotificationPreferences,
  getStudent,
  getHomeworkList,
  getAttendanceStats,
  getExamSchedule,
  getFeeDetails,
  getNotices,
  getTodayTimetable,
  getCurrentHour,
} from '@/hooks/use-data';
import { formatCurrency, formatDate, getSubjectColor } from '@/lib/utils';
import { useToast } from '@/components/common/Toast';
import styles from './daily-summary.module.css';

const SUMMARY_TIMES = ['05:00 PM', '06:00 PM', '06:30 PM', '07:00 PM', '08:00 PM', '09:00 PM'];
const CHANNEL_LABELS = { push: 'Push notification', sms: 'SMS', email: 'Email' } as const;

export default function DailySummaryPage() {
  const summary = getDailySummary();
  const student = getStudent();
  const homework = getHomeworkList();
  const attendance = getAttendanceStats();
  const examSchedule = getExamSchedule();
  const fees = getFeeDetails();
  const notices = getNotices();
  const timetable = getTodayTimetable();

  const pendingHW = homework.filter(h => h.status === 'pending');
  const overdueHW = homework.filter(h => h.status === 'overdue');
  const unreadNotices = notices.filter(n => !n.isRead);
  const classPeriods = timetable.filter(p => p.type === 'class');
  const currentHour = getCurrentHour();
  const completedPeriods = classPeriods.filter(p => {
    const h = parseInt(p.endTime.split(':')[0]);
    return h <= currentHour;
  });

  const initialPrefs = getNotificationPreferences();
  const [deliveryEnabled, setDeliveryEnabled] = useState(initialPrefs.dailySummary);
  const [deliveryTime, setDeliveryTime] = useState(initialPrefs.dailySummaryTime);
  const [channels, setChannels] = useState(initialPrefs.channels);
  const { showToast, toastNode } = useToast();

  function buildSummaryText(): string {
    const lines = [
      `${student.name} - Daily Summary (${formatDate(summary.date)})`,
      `Attendance: ${summary.attendance.status}${summary.attendance.checkInTime ? ` (check-in ${summary.attendance.checkInTime})` : ''}`,
      `Homework: ${overdueHW.length} overdue, ${pendingHW.length} pending`,
      `Notices: ${unreadNotices.length} unread`,
    ];
    if (summary.upcomingExam) lines.push(`Next exam: ${summary.upcomingExam.subject} on ${formatDate(summary.upcomingExam.date)}`);
    if (fees.totalBalance > 0) lines.push(`Fees due: ${formatCurrency(fees.totalBalance)}`);
    return lines.join('\n');
  }

  async function shareSummary() {
    const text = buildSummaryText();
    try {
      if (navigator.share) {
        await navigator.share({ title: 'Daily Summary', text });
      } else {
        await navigator.clipboard.writeText(text);
        showToast('Summary copied to clipboard');
      }
    } catch {
      // The user dismissed the share sheet; nothing to do.
    }
  }

  function saveDelivery() {
    if (deliveryEnabled && !channels.push && !channels.sms && !channels.email) {
      showToast('Select at least one delivery channel', 'error');
      return;
    }
    // TODO: PUT /api/parents/:id/notification-preferences when backend is connected
    showToast(deliveryEnabled ? `Daily summary will be sent at ${deliveryTime}` : 'Daily summary notification turned off', 'info');
  }

  const greeting = currentHour < 12 ? 'Good Morning' : currentHour < 17 ? 'Good Afternoon' : 'Good Evening';

  return (
    <div className={styles.page}>
      {/* Date & Greeting Header */}
      <div className={styles.header}>
        <div>
          <div className={styles.greeting}>{greeting}!</div>
          <div className={styles.dateText}>{formatDate(summary.date)} &middot; {student.name} &middot; Class {student.class}-{student.section}</div>
        </div>
        <div className={styles.headerRight}>
        <button className={styles.shareBtn} onClick={shareSummary}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="4" cy="8" r="2" /><circle cx="12" cy="3.5" r="2" /><circle cx="12" cy="12.5" r="2" /><path d="M5.8 7l4.4-2.5M5.8 9l4.4 2.5" /></svg>
          Share
        </button>
        <div className={styles.dayProgress}>
          <div className={styles.dayLabel}>{completedPeriods.length}/{classPeriods.length} periods done</div>
          <div className={styles.dayBar}>
            <div className={styles.dayBarFill} style={{ width: `${(completedPeriods.length / classPeriods.length) * 100}%` }} />
          </div>
        </div>
        </div>
      </div>

      {/* Quick Status Cards */}
      <div className={styles.statusGrid}>
        {/* Attendance */}
        <div className={`${styles.statusCard} ${summary.attendance.status === 'present' ? styles.cardGreen : styles.cardRed}`}>
          <div className={styles.statusIcon}>
            {summary.attendance.status === 'present' ? (
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="14" cy="14" r="11"/><path d="M9 14l3 3 7-7"/></svg>
            ) : (
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="14" cy="14" r="11"/><path d="M10 10l8 8M18 10l-8 8"/></svg>
            )}
          </div>
          <div className={styles.statusInfo}>
            <div className={styles.statusLabel}>Attendance</div>
            <div className={styles.statusValue}>
              {summary.attendance.status === 'present' ? 'Present' : summary.attendance.status === 'absent' ? 'Absent' : 'Late'}
            </div>
            {summary.attendance.checkInTime && (
              <div className={styles.statusMeta}>Check-in: {summary.attendance.checkInTime}</div>
            )}
          </div>
          <div className={styles.statusBadge}>{attendance.percentage}%</div>
        </div>

        {/* Homework */}
        <div className={`${styles.statusCard} ${overdueHW.length > 0 ? styles.cardRed : pendingHW.length > 0 ? styles.cardYellow : styles.cardGreen}`}>
          <div className={styles.statusIcon}>
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 6h16v18H6z"/><path d="M10 11h8M10 15h8M10 19h4"/></svg>
          </div>
          <div className={styles.statusInfo}>
            <div className={styles.statusLabel}>Homework</div>
            <div className={styles.statusValue}>
              {overdueHW.length > 0 ? `${overdueHW.length} Overdue` : `${pendingHW.length} Pending`}
            </div>
            <div className={styles.statusMeta}>
              {summary.homework.subjects.join(', ')}
            </div>
          </div>
          <div className={styles.statusBadge}>{pendingHW.length + overdueHW.length}</div>
        </div>

        {/* Notices */}
        <div className={`${styles.statusCard} ${unreadNotices.length > 0 ? styles.cardBlue : styles.cardGray}`}>
          <div className={styles.statusIcon}>
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 4a7 7 0 017 7c0 4 1.5 6.5 2.5 8H4.5c1-1.5 2.5-4 2.5-8a7 7 0 017-7z"/><path d="M11 19a3 3 0 006 0"/></svg>
          </div>
          <div className={styles.statusInfo}>
            <div className={styles.statusLabel}>Notices</div>
            <div className={styles.statusValue}>{unreadNotices.length} Unread</div>
            <div className={styles.statusMeta}>{notices.length} total</div>
          </div>
          <div className={styles.statusBadge}>{unreadNotices.length}</div>
        </div>

        {/* Fee */}
        <div className={`${styles.statusCard} ${fees.totalBalance > 0 ? styles.cardYellow : styles.cardGreen}`}>
          <div className={styles.statusIcon}>
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 4v20M9 9h7a3 3 0 010 6H9M9 15h8a3 3 0 010 6H9"/></svg>
          </div>
          <div className={styles.statusInfo}>
            <div className={styles.statusLabel}>Fees Due</div>
            <div className={styles.statusValue}>{formatCurrency(fees.totalBalance)}</div>
            <div className={styles.statusMeta}>
              {fees.totalBalance > 0 ? `Due: ${formatDate(fees.installments.find(i => i.status === 'pending')?.dueDate || '')}` : 'All clear!'}
            </div>
          </div>
          <div className={styles.statusBadge}>{Math.round((fees.totalPaid / fees.totalAnnualFee) * 100)}%</div>
        </div>
      </div>

      {/* Two-Column Detail */}
      <div className={styles.detailGrid}>
        {/* Today's Timetable */}
        <div className={styles.detailCard}>
          <div className={styles.detailHeader}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="9" cy="9" r="7"/><path d="M9 5v4l2.5 2.5"/></svg>
            Today&#39;s Classes
          </div>
          <div className={styles.timetableList}>
            {timetable.map((period, i) => {
              if (period.type === 'break' || period.type === 'lunch') {
                return (
                  <div key={i} className={styles.breakRow}>
                    <span className={styles.breakLine} />
                    <span className={styles.breakLabel}>{period.subject}</span>
                    <span className={styles.breakLine} />
                  </div>
                );
              }
              const isDone = parseInt(period.endTime.split(':')[0]) <= currentHour;
              const subjectColor = getSubjectColor(period.subject);
              return (
                <div key={i} className={`${styles.periodRow} ${isDone ? styles.periodDone : ''}`}>
                  <div className={styles.periodTime}>{period.startTime}</div>
                  <div className={styles.periodDot} style={{ background: subjectColor }} />
                  <div className={styles.periodInfo}>
                    <div className={styles.periodSubject}>{period.subject}</div>
                    <div className={styles.periodTeacher}>{period.teacher}</div>
                  </div>
                  {isDone && <span className={styles.doneCheck}>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 7l3 3 5-5"/></svg>
                  </span>}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column */}
        <div className={styles.rightCol}>
          {/* Upcoming Exam */}
          {summary.upcomingExam && (
            <div className={styles.detailCard}>
              <div className={styles.detailHeader}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 2v2M12 2v2M3 7h12M3 4h12a1 1 0 011 1v10a1 1 0 01-1 1H3a1 1 0 01-1-1V5a1 1 0 011-1z"/></svg>
                Upcoming Exam
              </div>
              <div className={styles.examPreview}>
                <div className={styles.examDaysLeft}>
                  <div className={styles.examDaysNum}>{summary.upcomingExam.daysLeft}</div>
                  <div className={styles.examDaysLabel}>days left</div>
                </div>
                <div className={styles.examInfo}>
                  <div className={styles.examSubject}>{summary.upcomingExam.subject}</div>
                  <div className={styles.examDate}>{formatDate(summary.upcomingExam.date)}</div>
                  {examSchedule.length > 1 && (
                    <div className={styles.examMore}>+{examSchedule.length - 1} more exams this week</div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Announcements */}
          <div className={styles.detailCard}>
            <div className={styles.detailHeader}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M15 4l-6 3H4a1 1 0 00-1 1v2a1 1 0 001 1h5l6 3V4z"/><path d="M15 4a4 4 0 010 10"/></svg>
              Announcements
            </div>
            <div className={styles.announcementsList}>
              {summary.announcements.titles.map((title, i) => (
                <div key={i} className={styles.announcementItem}>
                  <div className={styles.announcementDot} />
                  <span>{title}</span>
                </div>
              ))}
              {unreadNotices.filter(n => !summary.announcements.titles.includes(n.title)).slice(0, 2).map((n) => (
                <div key={n.id} className={styles.announcementItem}>
                  <div className={styles.announcementDot} />
                  <span>{n.title}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Homework List */}
          <div className={styles.detailCard}>
            <div className={styles.detailHeader}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 5h10v11H5z"/><path d="M7 8h6M7 11h6M7 14h3"/></svg>
              Homework Due
            </div>
            <div className={styles.hwList}>
              {[...overdueHW, ...pendingHW].map((h) => (
                <div key={h.id} className={styles.hwItem}>
                  <div
                    className={styles.hwDot}
                    style={{
                      background: h.status === 'overdue' ? 'var(--danger)' : 'var(--warning)',
                    }}
                  />
                  <div className={styles.hwInfo}>
                    <div className={styles.hwSubject}>{h.subject}</div>
                    <div className={styles.hwTitle}>{h.title}</div>
                  </div>
                  <div className={`${styles.hwBadge} ${h.status === 'overdue' ? styles.hwOverdue : styles.hwPending}`}>
                    {h.status === 'overdue' ? 'Overdue' : formatDate(h.dueDate)}
                  </div>
                </div>
              ))}
              {overdueHW.length === 0 && pendingHW.length === 0 && (
                <div className={styles.emptyHW}>All homework completed!</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delivery preferences */}
      <div className={styles.detailCard}>
        <div className={styles.detailHeader}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 2a5 5 0 015 5c0 3 1 4.5 1.5 5.5h-13C3 11.5 4 10 4 7a5 5 0 015-5z" /><path d="M7.5 14a1.5 1.5 0 003 0" /></svg>
          Get this summary every day
        </div>
        <div className={styles.deliveryBody}>
          <label className={styles.deliveryRow}>
            <span>Send me a daily summary notification</span>
            <input type="checkbox" checked={deliveryEnabled} onChange={(e) => setDeliveryEnabled(e.target.checked)} />
          </label>
          <div className={`${styles.deliveryRow} ${deliveryEnabled ? '' : styles.deliveryDisabled}`}>
            <label htmlFor="summary-time">Delivery time</label>
            <select id="summary-time" className={styles.deliverySelect} value={deliveryTime} onChange={(e) => setDeliveryTime(e.target.value)} disabled={!deliveryEnabled}>
              {SUMMARY_TIMES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className={`${styles.deliveryChannels} ${deliveryEnabled ? '' : styles.deliveryDisabled}`}>
            {(Object.keys(CHANNEL_LABELS) as Array<keyof typeof CHANNEL_LABELS>).map((key) => (
              <label key={key} className={styles.channelOption}>
                <input
                  type="checkbox"
                  checked={channels[key]}
                  disabled={!deliveryEnabled}
                  onChange={(e) => setChannels({ ...channels, [key]: e.target.checked })}
                />
                {CHANNEL_LABELS[key]}
              </label>
            ))}
          </div>
          <div className={styles.deliveryFooter}>
            <Link href="/settings" className={styles.deliveryLink}>More notification settings</Link>
            <button className={styles.deliverySave} onClick={saveDelivery}>Save</button>
          </div>
        </div>
      </div>
      {toastNode}
    </div>
  );
}
