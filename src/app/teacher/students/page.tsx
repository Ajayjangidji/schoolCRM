'use client';

import { useState, useMemo } from 'react';
import { getStudentDetails, getTeacherClasses } from '@/hooks/use-teacher-data';
import { getInitials } from '@/lib/utils';
import type { StudentDetail } from '@/hooks/use-teacher-data';
import styles from './students.module.css';

const AVATAR_COLORS = ['#1976d2', '#388e3c', '#e65100', '#7b1fa2', '#c62828', '#00695c', '#4527a0', '#ef6c00', '#1565c0', '#2e7d32', '#ad1457', '#00838f'];

function getGradeClass(grade: string): string {
  if (grade.startsWith('A')) return styles.gradeA;
  if (grade.startsWith('B')) return styles.gradeB;
  if (grade.startsWith('C')) return styles.gradeC;
  return styles.gradeD;
}

function getBehaviorClass(rating: string): string {
  switch (rating) {
    case 'excellent': return styles.behaviorExcellent;
    case 'good': return styles.behaviorGood;
    case 'average': return styles.behaviorAverage;
    default: return styles.behaviorNeeds;
  }
}

function getBarColor(value: number): string {
  if (value >= 85) return '#2e7d32';
  if (value >= 70) return '#1565c0';
  if (value >= 55) return '#e65100';
  return '#c62828';
}

export default function TeacherStudentsPage() {
  const students = getStudentDetails();
  const classes = getTeacherClasses();
  const [selectedClass, setSelectedClass] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<StudentDetail | null>(null);

  const filtered = useMemo(() => {
    let result = students;
    if (selectedClass !== 'all') {
      const cls = classes.find((c) => c.id === selectedClass);
      if (cls) result = result.filter((s) => s.class === cls.class && s.section === cls.section);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((s) => s.name.toLowerCase().includes(q) || s.rollNumber.includes(q));
    }
    return result;
  }, [students, classes, selectedClass, searchQuery]);

  const totalStudents = students.length;
  const avgAttendance = Math.round(students.reduce((s, st) => s + st.attendance, 0) / totalStudents);
  const avgMarks = Math.round(students.reduce((s, st) => s + st.avgMarks, 0) / totalStudents);
  const topPerformers = students.filter((s) => s.avgMarks >= 85).length;

  return (
    <div className={styles.page}>
      {/* ── Header ── */}
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Student Performance</h1>
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
            <div className={styles.statSub}>Across {classes.length} classes</div>
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
            <div className={styles.statLabel}>Avg Attendance</div>
            <div className={styles.statValue}>{avgAttendance}%</div>
            <div className={styles.statSub}>This month</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: '#fff3e0', color: '#e65100' }}>
            <svg width="22" height="22" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 17l4-8 4 5 3-4 4 7" />
              <circle cx="7" cy="9" r="1" fill="currentColor" />
            </svg>
          </div>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>Avg Marks</div>
            <div className={styles.statValue}>{avgMarks}%</div>
            <div className={styles.statSub}>Overall average</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: '#f3e5f5', color: '#7b1fa2' }}>
            <svg width="22" height="22" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 2l2.5 5.5 6 .5-4.5 4 1.5 6L10 15l-5.5 3 1.5-6L2 8l6-.5z" />
            </svg>
          </div>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>Top Performers</div>
            <div className={styles.statValue}>{topPerformers}</div>
            <div className={styles.statSub}>Above 85%</div>
          </div>
        </div>
      </div>

      {/* ── Filters ── */}
      <div className={styles.filterRow}>
        <div className={styles.filterTabs}>
          <button
            className={`${styles.filterTab} ${selectedClass === 'all' ? styles.filterTabActive : ''}`}
            onClick={() => setSelectedClass('all')}
          >
            All Classes
          </button>
          {classes.map((cls) => (
            <button
              key={cls.id}
              className={`${styles.filterTab} ${selectedClass === cls.id ? styles.filterTabActive : ''}`}
              onClick={() => setSelectedClass(cls.id)}
            >
              {cls.class}-{cls.section}
            </button>
          ))}
        </div>
        <div className={styles.searchBox}>
          <svg className={styles.searchIcon} width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="9" cy="9" r="6" />
            <path d="M14 14l4 4" />
          </svg>
          <input
            className={styles.searchInput}
            type="text"
            placeholder="Search students..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* ── Student Table ── */}
      <div className={styles.tableWrap}>
        <div className={styles.tableScroll}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Roll</th>
                <th>Student</th>
                <th>Class</th>
                <th>Attendance</th>
                <th>Avg Marks</th>
                <th>Grade</th>
                <th>HW Completion</th>
                <th>Behavior</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((student, idx) => {
                const bgColor = AVATAR_COLORS[idx % AVATAR_COLORS.length];
                return (
                  <tr key={student.id} onClick={() => setSelectedStudent(student)}>
                    <td>{student.rollNumber}</td>
                    <td>
                      <div className={styles.studentCell}>
                        <div className={styles.studentAvatar} style={{ background: bgColor + '18', color: bgColor }}>
                          {getInitials(student.name)}
                        </div>
                        <span className={styles.studentName}>{student.name}</span>
                      </div>
                    </td>
                    <td>{student.class}-{student.section}</td>
                    <td>
                      <div className={styles.progressBar}>
                        <div className={styles.progressFill} style={{ width: `${student.attendance}%`, background: getBarColor(student.attendance) }} />
                      </div>
                      <span className={styles.progressText}>{student.attendance}%</span>
                    </td>
                    <td>
                      <div className={styles.progressBar}>
                        <div className={styles.progressFill} style={{ width: `${student.avgMarks}%`, background: getBarColor(student.avgMarks) }} />
                      </div>
                      <span className={styles.progressText}>{student.avgMarks}%</span>
                    </td>
                    <td>
                      <span className={`${styles.gradeBadge} ${getGradeClass(student.grade)}`}>{student.grade}</span>
                    </td>
                    <td>
                      <div className={styles.progressBar}>
                        <div className={styles.progressFill} style={{ width: `${student.homeworkCompletion}%`, background: getBarColor(student.homeworkCompletion) }} />
                      </div>
                      <span className={styles.progressText}>{student.homeworkCompletion}%</span>
                    </td>
                    <td>
                      <span className={`${styles.behaviorBadge} ${getBehaviorClass(student.behaviorRating)}`}>
                        {student.behaviorRating.replace('-', ' ')}
                      </span>
                    </td>
                    <td>
                      <button className={styles.actionBtn} onClick={(e) => { e.stopPropagation(); setSelectedStudent(student); }}>
                        View
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <div className={styles.emptyState}>No students found.</div>}
      </div>

      {/* ── Student Detail Modal ── */}
      {selectedStudent && (
        <div className={styles.modalOverlay} onClick={() => setSelectedStudent(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Student Profile</h2>
              <button className={styles.modalClose} onClick={() => setSelectedStudent(null)}>
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M5 5l10 10M15 5L5 15" />
                </svg>
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.detailHeader}>
                <div className={styles.detailAvatar} style={{ background: '#1976d218', color: '#1976d2' }}>
                  {getInitials(selectedStudent.name)}
                </div>
                <div className={styles.detailInfo}>
                  <div className={styles.detailName}>{selectedStudent.name}</div>
                  <div className={styles.detailMeta}>
                    Roll #{selectedStudent.rollNumber} &middot; Class {selectedStudent.class}-{selectedStudent.section} &middot; {selectedStudent.parentPhone}
                  </div>
                </div>
                <span className={`${styles.gradeBadge} ${getGradeClass(selectedStudent.grade)}`} style={{ fontSize: '14px', padding: '4px 12px' }}>
                  {selectedStudent.grade}
                </span>
              </div>

              <div className={styles.metricsGrid}>
                <div className={styles.metricCard}>
                  <div className={styles.metricValue} style={{ color: getBarColor(selectedStudent.attendance) }}>{selectedStudent.attendance}%</div>
                  <div className={styles.metricLabel}>Attendance</div>
                </div>
                <div className={styles.metricCard}>
                  <div className={styles.metricValue} style={{ color: getBarColor(selectedStudent.avgMarks) }}>{selectedStudent.avgMarks}%</div>
                  <div className={styles.metricLabel}>Avg Marks</div>
                </div>
                <div className={styles.metricCard}>
                  <div className={styles.metricValue} style={{ color: getBarColor(selectedStudent.homeworkCompletion) }}>{selectedStudent.homeworkCompletion}%</div>
                  <div className={styles.metricLabel}>HW Done</div>
                </div>
                <div className={styles.metricCard}>
                  <span className={`${styles.behaviorBadge} ${getBehaviorClass(selectedStudent.behaviorRating)}`} style={{ fontSize: '13px' }}>
                    {selectedStudent.behaviorRating.replace('-', ' ')}
                  </span>
                  <div className={styles.metricLabel} style={{ marginTop: '6px' }}>Behavior</div>
                </div>
              </div>

              <div className={styles.examSection}>
                <div className={styles.examTitle}>Recent Exam Performance</div>
                {selectedStudent.recentExams.map((exam, i) => {
                  const pct = Math.round((exam.marks / exam.total) * 100);
                  return (
                    <div key={i} className={styles.examBar}>
                      <span className={styles.examName}>{exam.examName}</span>
                      <div className={styles.examProgress}>
                        <div className={styles.examProgressFill} style={{ width: `${pct}%`, background: getBarColor(pct) }} />
                      </div>
                      <span className={styles.examScore}>{exam.marks}/{exam.total}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
