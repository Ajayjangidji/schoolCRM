'use client';

import { useState, useMemo } from 'react';
import { getClassAttendance, getStudentsBrief, getTeacherClasses } from '@/hooks/use-teacher-data';
import { getInitials, formatDate } from '@/lib/utils';
import styles from './attendance.module.css';

type AttendanceStatus = 'present' | 'absent' | 'late' | 'unmarked';

const AVATAR_COLORS = ['#1976d2', '#388e3c', '#e65100', '#7b1fa2', '#c62828', '#00695c', '#4527a0', '#ef6c00'];

export default function TeacherAttendancePage() {
  const classAttendance = getClassAttendance();
  const students = getStudentsBrief();
  const classes = getTeacherClasses();
  const [selectedClass, setSelectedClass] = useState<string | null>('CS001');
  const [selectedDate, setSelectedDate] = useState('2026-08-13');

  const [studentStatuses, setStudentStatuses] = useState<Record<string, AttendanceStatus>>(() => {
    const initial: Record<string, AttendanceStatus> = {};
    students.forEach((s, i) => {
      if (i < 5) initial[s.id] = 'present';
      else if (i === 5) initial[s.id] = 'absent';
      else if (i === 6) initial[s.id] = 'late';
      else initial[s.id] = 'present';
    });
    return initial;
  });

  const selectedCls = classes.find((c) => c.id === selectedClass);
  const classStudents = useMemo(() => {
    if (!selectedCls) return [];
    return students.filter((s) => s.class === selectedCls.class && s.section === selectedCls.section);
  }, [students, selectedCls]);

  const totalMarked = classAttendance.filter((a) => a.isMarked).length;
  const totalPresent = classAttendance.reduce((s, a) => s + a.present, 0);
  const totalAbsent = classAttendance.reduce((s, a) => s + a.absent, 0);
  const totalLate = classAttendance.reduce((s, a) => s + a.late, 0);
  const totalStudents = classAttendance.reduce((s, a) => s + a.totalStudents, 0);

  const currentPresent = Object.values(studentStatuses).filter((s) => s === 'present').length;
  const currentAbsent = Object.values(studentStatuses).filter((s) => s === 'absent').length;
  const currentLate = Object.values(studentStatuses).filter((s) => s === 'late').length;

  function setStatus(studentId: string, status: AttendanceStatus) {
    setStudentStatuses((prev) => ({ ...prev, [studentId]: status }));
  }

  function markAll(status: AttendanceStatus) {
    const updated: Record<string, AttendanceStatus> = { ...studentStatuses };
    classStudents.forEach((s) => { updated[s.id] = status; });
    setStudentStatuses(updated);
  }

  return (
    <div className={styles.page}>
      {/* ── Header ── */}
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Attendance</h1>
        <div className={styles.dateSelector}>
          <input
            className={styles.dateInput}
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
      </div>

      {/* ── Stats ── */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: '#e3f2fd', color: '#1565c0' }}>
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
            <div className={styles.statSub}>{totalMarked}/{classAttendance.length} classes marked</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: '#e8f5e9', color: '#2e7d32' }}>
            <svg width="22" height="22" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 10l2.5 2.5L14 7" />
              <circle cx="10" cy="10" r="8" />
            </svg>
          </div>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>Present</div>
            <div className={styles.statValue}>{totalPresent}</div>
            <div className={styles.statSub}>{totalStudents > 0 ? Math.round((totalPresent / totalStudents) * 100) : 0}% attendance</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: '#ffebee', color: '#c62828' }}>
            <svg width="22" height="22" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="10" cy="10" r="8" />
              <path d="M7 7l6 6M13 7l-6 6" />
            </svg>
          </div>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>Absent</div>
            <div className={styles.statValue}>{totalAbsent}</div>
            <div className={styles.statSub}>Across marked classes</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: '#fff3e0', color: '#e65100' }}>
            <svg width="22" height="22" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="10" cy="10" r="8" />
              <path d="M10 6v4l2.5 2.5" />
            </svg>
          </div>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>Late</div>
            <div className={styles.statValue}>{totalLate}</div>
            <div className={styles.statSub}>Arrived late today</div>
          </div>
        </div>
      </div>

      {/* ── Class Cards ── */}
      <div className={styles.classGrid}>
        {classAttendance.map((ca) => {
          const cls = classes.find((c) => `${c.class}-${c.section}` === ca.classSection);
          const pPct = ca.totalStudents > 0 && ca.isMarked ? (ca.present / ca.totalStudents) * 100 : 0;
          const lPct = ca.totalStudents > 0 && ca.isMarked ? (ca.late / ca.totalStudents) * 100 : 0;
          const aPct = ca.totalStudents > 0 && ca.isMarked ? (ca.absent / ca.totalStudents) * 100 : 0;
          return (
            <div
              key={ca.classSection}
              className={`${styles.classCard} ${cls && selectedClass === cls.id ? styles.classCardActive : ''}`}
              onClick={() => cls && setSelectedClass(cls.id)}
            >
              <div className={styles.classCardHeader}>
                <span className={styles.className}>Class {ca.classSection}</span>
                <span className={`${styles.markedBadge} ${ca.isMarked ? styles.markedDone : styles.markedPending}`}>
                  {ca.isMarked ? 'Marked' : 'Pending'}
                </span>
              </div>
              <div className={styles.classStats}>
                <div className={styles.classStatItem}>
                  <span className={styles.classStatValue}>{ca.totalStudents}</span>
                  <span>Total</span>
                </div>
                {ca.isMarked && (
                  <>
                    <div className={styles.classStatItem}>
                      <span className={styles.classStatValue} style={{ color: '#2e7d32' }}>{ca.present}</span>
                      <span>Present</span>
                    </div>
                    <div className={styles.classStatItem}>
                      <span className={styles.classStatValue} style={{ color: '#c62828' }}>{ca.absent}</span>
                      <span>Absent</span>
                    </div>
                    <div className={styles.classStatItem}>
                      <span className={styles.classStatValue} style={{ color: '#e65100' }}>{ca.late}</span>
                      <span>Late</span>
                    </div>
                  </>
                )}
              </div>
              {ca.isMarked && (
                <div className={styles.attendanceBar}>
                  <div className={styles.barPresent} style={{ width: `${pPct}%` }} />
                  <div className={styles.barLate} style={{ width: `${lPct}%` }} />
                  <div className={styles.barAbsent} style={{ width: `${aPct}%` }} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Attendance Marking Table ── */}
      {selectedCls && (
        <div className={styles.attendanceSection}>
          <div className={styles.attendanceHeader}>
            <div>
              <div className={styles.attendanceTitle}>Class {selectedCls.class}-{selectedCls.section} — Mark Attendance</div>
              <div className={styles.attendanceSub}>{formatDate(selectedDate)} &middot; {classStudents.length} students</div>
            </div>
            <div className={styles.quickActions}>
              <button className={`${styles.markAllBtn} ${styles.markAllPresent}`} onClick={() => markAll('present')}>
                Mark All Present
              </button>
              <button className={`${styles.markAllBtn} ${styles.markAllAbsent}`} onClick={() => markAll('absent')}>
                Mark All Absent
              </button>
            </div>
          </div>

          <div className={styles.tableScroll}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Roll</th>
                  <th>Student</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {classStudents.map((student, idx) => {
                  const status = studentStatuses[student.id] || 'unmarked';
                  const bgColor = AVATAR_COLORS[idx % AVATAR_COLORS.length];
                  return (
                    <tr key={student.id}>
                      <td>{student.rollNumber}</td>
                      <td>
                        <div className={styles.studentCell}>
                          <div className={styles.studentAvatar} style={{ background: bgColor + '18', color: bgColor }}>
                            {getInitials(student.name)}
                          </div>
                          <span className={styles.studentName}>{student.name}</span>
                        </div>
                      </td>
                      <td>
                        <div className={styles.statusBtns}>
                          <button
                            className={`${styles.statusBtn} ${status === 'present' ? styles.statusPresent : ''}`}
                            onClick={() => setStatus(student.id, 'present')}
                          >
                            Present
                          </button>
                          <button
                            className={`${styles.statusBtn} ${status === 'absent' ? styles.statusAbsent : ''}`}
                            onClick={() => setStatus(student.id, 'absent')}
                          >
                            Absent
                          </button>
                          <button
                            className={`${styles.statusBtn} ${status === 'late' ? styles.statusLate : ''}`}
                            onClick={() => setStatus(student.id, 'late')}
                          >
                            Late
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className={styles.submitBar}>
            <div className={styles.submitStats}>
              <div className={styles.submitStatItem}>
                <span className={styles.submitDot} style={{ background: '#2e7d32' }} />
                Present: {currentPresent}
              </div>
              <div className={styles.submitStatItem}>
                <span className={styles.submitDot} style={{ background: '#c62828' }} />
                Absent: {currentAbsent}
              </div>
              <div className={styles.submitStatItem}>
                <span className={styles.submitDot} style={{ background: '#e65100' }} />
                Late: {currentLate}
              </div>
            </div>
            <button className={styles.submitBtn}>Submit Attendance</button>
          </div>
        </div>
      )}
    </div>
  );
}
