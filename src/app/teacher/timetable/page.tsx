'use client';

import { useState } from 'react';
import {
  getTeacherTimetable,
  getTeacherClasses,
} from '@/hooks/use-teacher-data';
import styles from './timetable.module.css';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as const;
const SHORT_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;

function getTodayIndex(): number {
  const d = new Date().getDay();
  return d === 0 ? -1 : d - 1;
}

export default function TeacherTimetablePage() {
  const todayIdx = getTodayIndex();
  const [activeDay, setActiveDay] = useState(todayIdx >= 0 && todayIdx < 6 ? todayIdx : 0);

  const timetable = getTeacherTimetable();
  const classes = getTeacherClasses();

  const classPeriods = timetable.filter((p) => p.type === 'class');
  const freePeriods = timetable.filter((p) => p.type === 'free');
  const totalStudents = classes.reduce((s, c) => s + c.totalStudents, 0);

  const now = new Date();
  const currentHour = now.getHours();
  const currentMin = now.getMinutes();

  function isCurrent(startTime: string, endTime: string): boolean {
    if (activeDay !== todayIdx) return false;
    const [sh, sm] = startTime.split(':').map(Number);
    const [eh, em] = endTime.split(':').map(Number);
    const nowMins = currentHour * 60 + currentMin;
    return nowMins >= sh * 60 + sm && nowMins < eh * 60 + em;
  }

  const dateStr = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className={styles.page}>
      {/* ── Header ── */}
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Class Timetable</h1>
        <div className={styles.dayBadge}>
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="14" height="14" rx="2" />
            <path d="M3 7h14" />
            <path d="M7 2v2M13 2v2" />
          </svg>
          {dateStr}
        </div>
      </div>

      {/* ── Stats ── */}
      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
            <svg width="22" height="22" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="3" width="16" height="14" rx="2" />
              <path d="M2 7h16" />
            </svg>
          </div>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>Classes Today</div>
            <div className={styles.statValue}>{classPeriods.length}</div>
            <div className={styles.statSub}>Teaching periods</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: 'var(--success-light)', color: 'var(--success)' }}>
            <svg width="22" height="22" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="10" cy="10" r="8" />
              <path d="M10 6v4l2.5 2.5" />
            </svg>
          </div>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>Free Periods</div>
            <div className={styles.statValue}>{freePeriods.length}</div>
            <div className={styles.statSub}>Available time</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: 'var(--info-light)', color: 'var(--info)' }}>
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
          <div className={styles.statIcon} style={{ background: 'var(--warning-light)', color: 'var(--warning)' }}>
            <svg width="22" height="22" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 2L2 6l8 4 8-4-8-4z" />
              <path d="M2 6v6l8 4 8-4V6" />
            </svg>
          </div>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>Subject</div>
            <div className={styles.statValue}>English</div>
            <div className={styles.statSub}>All classes</div>
          </div>
        </div>
      </div>

      {/* ── Day Tabs ── */}
      <div className={styles.dayTabs}>
        {DAYS.map((day, i) => (
          <button
            key={day}
            className={`${styles.dayTab} ${activeDay === i ? styles.dayTabActive : ''} ${todayIdx === i ? styles.dayTabToday : ''}`}
            onClick={() => setActiveDay(i)}
          >
            {day}
          </button>
        ))}
      </div>

      {/* ── Timeline ── */}
      <div className={styles.timeline}>
        {timetable.map((period, idx) => {
          const current = isCurrent(period.startTime, period.endTime);
          const isClass = period.type === 'class';
          const isFree = period.type === 'free';
          const isBreak = period.type === 'break' || period.type === 'lunch';

          return (
            <div key={idx} className={styles.periodRow}>
              <div className={styles.timeCol}>
                <span className={styles.timeStart}>{period.startTime}</span>
                <span className={styles.timeEnd}>{period.endTime}</span>
              </div>

              <div className={styles.timeLine}>
                <div className={`${styles.timeDot} ${isClass ? styles.timeDotClass : isFree ? styles.timeDotFree : styles.timeDotBreak} ${current ? styles.timeDotCurrent : ''}`} />
              </div>

              <div className={`${styles.periodCard} ${isClass ? (current ? styles.periodCardCurrent : styles.periodCardClass) : isFree ? styles.periodCardFree : styles.periodCardBreak}`}>
                <div className={`${styles.periodBadge} ${isClass ? styles.periodBadgeClass : isFree ? styles.periodBadgeFree : styles.periodBadgeBreak}`}>
                  {isClass ? `P${period.period}` : isBreak ? (period.type === 'lunch' ? 'L' : 'B') : 'F'}
                </div>

                <div className={styles.periodInfo}>
                  <div className={styles.periodSubject}>
                    {isClass ? period.subject : isFree ? 'Free Period' : (period.subject || (period.type === 'lunch' ? 'Lunch Break' : 'Break'))}
                  </div>
                  <div className={styles.periodDetail}>
                    {isClass && (
                      <>
                        <span>
                          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="3" width="16" height="14" rx="2" /><path d="M2 7h16" /></svg>
                          {' '}Class {period.class}-{period.section}
                        </span>
                        <span>
                          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 10h14M10 3v14" /></svg>
                          {' '}{period.room}
                        </span>
                      </>
                    )}
                    {isFree && <span>Planning &amp; preparation time</span>}
                    {isBreak && <span>{period.endTime === '10:20' ? '20 minutes' : '40 minutes'}</span>}
                  </div>
                </div>

                <div className={styles.periodTags}>
                  {current && <span className={`${styles.periodTag} ${styles.currentTag}`}>NOW</span>}
                  {isClass && !current && (
                    <span className={styles.periodTag} style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
                      {classes.find(c => c.class === period.class && c.section === period.section)?.totalStudents || '—'} students
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Weekly Overview ── */}
      <div className={styles.weeklySection}>
        <h2 className={styles.sectionTitle}>Weekly Overview</h2>
        <div className={styles.weeklyGrid}>
          <table className={styles.weeklyTable}>
            <thead>
              <tr>
                <th>Period</th>
                {SHORT_DAYS.map((d, i) => (
                  <th key={d} className={todayIdx === i ? styles.todayCol : ''}>
                    {d}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {timetable.map((period, idx) => {
                const isClass = period.type === 'class';
                const isFree = period.type === 'free';
                const label = isClass ? `P${period.period}` : period.type === 'lunch' ? 'Lunch' : period.type === 'break' ? 'Break' : `F`;

                return (
                  <tr key={idx}>
                    <td>{period.startTime} - {period.endTime}</td>
                    {SHORT_DAYS.map((_, di) => (
                      <td key={di} className={todayIdx === di ? styles.todayCol : ''}>
                        <div className={`${styles.weeklyCell} ${isClass ? styles.weeklyCellClass : isFree ? styles.weeklyCellFree : styles.weeklyCellBreak}`}>
                          <span className={styles.weeklyCellSubject}>
                            {isClass ? period.subject : isFree ? 'Free' : label}
                          </span>
                          {isClass && (
                            <span className={styles.weeklyCellDetail}>
                              {period.class}-{period.section}
                            </span>
                          )}
                        </div>
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
