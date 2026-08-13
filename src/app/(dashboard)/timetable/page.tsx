'use client';

import { useState } from 'react';
import { getTodayTimetable, getWeekTimetable, getExamSchedule } from '@/hooks/use-data';
import { getSubjectColor, formatDate, getDaysUntil } from '@/lib/utils';
import styles from './timetable.module.css';

type ViewMode = 'today' | 'week' | 'exams';

export default function TimetablePage() {
  const [view, setView] = useState<ViewMode>('today');
  const todayPeriods = getTodayTimetable();
  const weekTimetable = getWeekTimetable();
  const examSchedule = getExamSchedule();

  const currentHour = 10;
  const classPeriods = todayPeriods.filter((p) => p.type === 'class');
  const totalPeriods = classPeriods.length;
  const completedPeriods = classPeriods.filter((p) => {
    const endHour = parseInt(p.endTime.split(':')[0]);
    return endHour <= currentHour;
  }).length;

  return (
    <div className={styles.page}>
      {/* Stats */}
      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <div className={styles.statNum}>{totalPeriods}</div>
          <div className={styles.statLabel}>Total Classes</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statNum} style={{ color: 'var(--success)' }}>{completedPeriods}</div>
          <div className={styles.statLabel}>Completed</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statNum} style={{ color: 'var(--primary)' }}>{totalPeriods - completedPeriods}</div>
          <div className={styles.statLabel}>Remaining</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statNum} style={{ color: 'var(--warning)' }}>{examSchedule.length}</div>
          <div className={styles.statLabel}>Upcoming Exams</div>
        </div>
      </div>

      {/* View Tabs */}
      <div className={styles.viewTabs}>
        <button className={`${styles.viewTab} ${view === 'today' ? styles.viewTabActive : ''}`} onClick={() => setView('today')}>
          Today&apos;s Schedule
        </button>
        <button className={`${styles.viewTab} ${view === 'week' ? styles.viewTabActive : ''}`} onClick={() => setView('week')}>
          Weekly View
        </button>
        <button className={`${styles.viewTab} ${view === 'exams' ? styles.viewTabActive : ''}`} onClick={() => setView('exams')}>
          Exam Schedule
        </button>
      </div>

      {/* Today's View */}
      {view === 'today' && (
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={styles.cardTitle}>Today — Monday, 9 Aug 2026</span>
            <span className={styles.periodCount}>{totalPeriods} classes</span>
          </div>
          <div className={styles.cardBody}>
            <div className={styles.timeline}>
              {todayPeriods.map((period, idx) => {
                const isBreak = period.type === 'break' || period.type === 'lunch';
                const endHour = parseInt(period.endTime.split(':')[0]);
                const startHour = parseInt(period.startTime.split(':')[0]);
                const isCurrent = startHour <= currentHour && endHour > currentHour && !isBreak;
                const isCompleted = endHour <= currentHour;

                if (isBreak) {
                  return (
                    <div key={idx} className={styles.breakRow}>
                      <div className={styles.breakLine} />
                      <span className={styles.breakLabel}>
                        {period.type === 'lunch' ? '🍽 Lunch' : '☕ Break'} — {period.startTime} - {period.endTime}
                      </span>
                      <div className={styles.breakLine} />
                    </div>
                  );
                }

                return (
                  <div
                    key={idx}
                    className={`${styles.periodCard} ${isCurrent ? styles.periodCurrent : ''} ${isCompleted ? styles.periodCompleted : ''}`}
                  >
                    <div className={styles.periodTime}>
                      <span className={styles.periodStart}>{period.startTime}</span>
                      <span className={styles.periodEnd}>{period.endTime}</span>
                    </div>
                    <div className={styles.periodBar} style={{ background: getSubjectColor(period.subject) }} />
                    <div className={styles.periodContent}>
                      <div className={styles.periodTopRow}>
                        <span className={styles.periodSubject}>{period.subject}</span>
                        {isCurrent && <span className={styles.currentBadge}>Now</span>}
                        {period.isSubstitution && <span className={styles.subBadge}>Substitution</span>}
                      </div>
                      <div className={styles.periodMeta}>
                        <span>
                          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="8" cy="5" r="3" /><path d="M2 14c0-3.3 2.7-6 6-6s6 2.7 6 6" /></svg>
                          {period.teacher}
                        </span>
                        {period.room && (
                          <span>
                            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="3" width="12" height="11" rx="1.5" /><path d="M6 14V9h4v5" /></svg>
                            {period.room}
                          </span>
                        )}
                        {period.isSubstitution && period.originalTeacher && (
                          <span className={styles.originalTeacher}>
                            (Regular: {period.originalTeacher})
                          </span>
                        )}
                      </div>
                    </div>
                    <div className={styles.periodNum}>P{period.period}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Week View */}
      {view === 'week' && (
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={styles.cardTitle}>Weekly Timetable</span>
          </div>
          <div className={styles.cardBody}>
            <div className={styles.weekGrid}>
              {weekTimetable.map((day) => (
                <div key={day.day} className={styles.dayColumn}>
                  <div className={styles.dayHeader}>{day.day}</div>
                  <div className={styles.dayPeriods}>
                    {day.periods.map((period, idx) => {
                      const isBreak = period.type === 'break' || period.type === 'lunch';
                      if (isBreak) {
                        return (
                          <div key={idx} className={styles.weekBreak}>
                            {period.type === 'lunch' ? 'Lunch' : 'Break'}
                          </div>
                        );
                      }
                      return (
                        <div key={idx} className={styles.weekPeriod}>
                          <div className={styles.weekPeriodDot} style={{ background: getSubjectColor(period.subject) }} />
                          <div className={styles.weekPeriodInfo}>
                            <span className={styles.weekPeriodSubject}>{period.subject}</span>
                            <span className={styles.weekPeriodTime}>{period.startTime}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Exam Schedule */}
      {view === 'exams' && (
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={styles.cardTitle}>Upcoming Exam Schedule</span>
            <span className={styles.examType}>{examSchedule[0]?.examType}</span>
          </div>
          <div className={styles.cardBody}>
            <div className={styles.examList}>
              {examSchedule.map((exam) => {
                const daysLeft = getDaysUntil(exam.date);
                return (
                  <div key={exam.id} className={styles.examCard}>
                    <div className={styles.examDateBlock}>
                      <div className={styles.examDateNum}>{new Date(exam.date).getDate()}</div>
                      <div className={styles.examDateMonth}>{new Date(exam.date).toLocaleDateString('en-IN', { month: 'short' })}</div>
                    </div>
                    <div className={styles.examBar} style={{ background: getSubjectColor(exam.subject) }} />
                    <div className={styles.examContent}>
                      <div className={styles.examTopRow}>
                        <span className={styles.examSubject}>{exam.subject}</span>
                        <span className={styles.examDaysLeft} style={{ color: daysLeft <= 3 ? 'var(--danger)' : 'var(--text-tertiary)' }}>
                          {daysLeft} days left
                        </span>
                      </div>
                      <div className={styles.examMeta}>
                        <span>
                          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="8" cy="8" r="6" /><path d="M8 5v3l2 1" /></svg>
                          {exam.startTime} - {exam.endTime}
                        </span>
                        <span>
                          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="3" width="12" height="11" rx="1.5" /><path d="M2 6h12" /><path d="M5 1.5v2M11 1.5v2" /></svg>
                          {formatDate(exam.date)}
                        </span>
                      </div>
                      {exam.syllabus && (
                        <div className={styles.examSyllabus}>
                          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 4h8v10H4z" /><path d="M6 7h4M6 9h4M6 11h2" /></svg>
                          {exam.syllabus}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
