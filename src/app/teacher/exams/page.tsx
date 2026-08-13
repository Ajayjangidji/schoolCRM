'use client';

import { useState } from 'react';
import {
  getTeacherExams,
  getStudentMarks,
  getClassPerformance,
} from '@/hooks/use-teacher-data';
import { formatDate } from '@/lib/utils';
import type { TeacherExam, StudentMark } from '@/hooks/use-teacher-data';
import styles from './exams.module.css';

type FilterType = 'all' | 'upcoming' | 'marks-entry' | 'completed';

function getExamStatusStyle(status: string): { bg: string; text: string; label: string } {
  const map: Record<string, { bg: string; text: string; label: string }> = {
    upcoming: { bg: 'var(--info-light)', text: 'var(--info-dark)', label: 'Upcoming' },
    ongoing: { bg: 'var(--warning-light)', text: 'var(--warning-dark)', label: 'Ongoing' },
    'marks-entry': { bg: 'var(--primary-light)', text: 'var(--primary)', label: 'Marks Entry' },
    completed: { bg: 'var(--success-light)', text: 'var(--success-dark)', label: 'Completed' },
  };
  return map[status] || map.upcoming;
}

function getGradeStyle(grade: string): { bg: string; text: string } {
  if (grade === 'A+' || grade === 'A') return { bg: 'var(--success-light)', text: 'var(--success-dark)' };
  if (grade === 'B+' || grade === 'B') return { bg: 'var(--primary-light)', text: 'var(--primary)' };
  if (grade === 'C' || grade === 'D') return { bg: 'var(--warning-light)', text: 'var(--warning-dark)' };
  if (grade === 'F') return { bg: 'var(--danger-light)', text: 'var(--danger)' };
  if (grade === 'AB') return { bg: 'var(--gray-100)', text: 'var(--text-tertiary)' };
  return { bg: 'var(--gray-100)', text: 'var(--text-secondary)' };
}

function getAvgColor(pct: number): string {
  if (pct >= 75) return 'var(--success)';
  if (pct >= 60) return 'var(--primary)';
  if (pct >= 40) return 'var(--warning)';
  return 'var(--danger)';
}

export default function TeacherExamsPage() {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [marksModal, setMarksModal] = useState<TeacherExam | null>(null);
  const [studentMarks, setStudentMarks] = useState<StudentMark[]>([]);

  const exams = getTeacherExams();
  const defaultMarks = getStudentMarks();
  const performance = getClassPerformance();

  const upcomingCount = exams.filter((e) => e.status === 'upcoming').length;
  const marksEntryCount = exams.filter((e) => e.status === 'marks-entry').length;
  const completedCount = exams.filter((e) => e.status === 'completed').length;
  const totalMarksEntered = exams.reduce((s, e) => s + e.marksEntered, 0);
  const totalStudentsAll = exams.reduce((s, e) => s + e.totalStudents, 0);

  const filtered = activeFilter === 'all'
    ? exams
    : exams.filter((e) => e.status === activeFilter);

  const counts: Record<FilterType, number> = {
    all: exams.length,
    upcoming: upcomingCount,
    'marks-entry': marksEntryCount,
    completed: completedCount,
  };

  const filters: { key: FilterType; label: string }[] = [
    { key: 'all', label: 'All Exams' },
    { key: 'upcoming', label: 'Upcoming' },
    { key: 'marks-entry', label: 'Marks Entry' },
    { key: 'completed', label: 'Completed' },
  ];

  function openMarksEntry(exam: TeacherExam) {
    setStudentMarks(defaultMarks.map((m) => ({ ...m })));
    setMarksModal(exam);
  }

  function updateMark(idx: number, field: keyof StudentMark, value: string | number | boolean | null) {
    setStudentMarks((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], [field]: value };
      if (field === 'isAbsent' && value === true) {
        next[idx].marksObtained = null;
        next[idx].grade = 'AB';
      }
      return next;
    });
  }

  return (
    <div className={styles.page}>
      {/* ── Header ── */}
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Exam &amp; Marks Entry</h1>
      </div>

      {/* ── Stats ── */}
      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
            <svg width="22" height="22" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 2L2 6l8 4 8-4-8-4z" />
              <path d="M2 6v6l8 4 8-4V6" />
            </svg>
          </div>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>Total Exams</div>
            <div className={styles.statValue}>{exams.length}</div>
            <div className={styles.statSub}>Across all classes</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: 'var(--info-light)', color: 'var(--info)' }}>
            <svg width="22" height="22" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="14" height="14" rx="2" />
              <path d="M3 7h14" />
              <path d="M7 2v2M13 2v2" />
            </svg>
          </div>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>Upcoming</div>
            <div className={styles.statValue}>{upcomingCount}</div>
            <div className={styles.statSub}>Exams scheduled</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: marksEntryCount > 0 ? 'var(--warning-light)' : 'var(--success-light)', color: marksEntryCount > 0 ? 'var(--warning)' : 'var(--success)' }}>
            <svg width="22" height="22" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h12v14H4z" />
              <path d="M7 8h6M7 11h6M7 14h3" />
            </svg>
          </div>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>Marks Entry</div>
            <div className={styles.statValue}>{marksEntryCount}</div>
            <div className={styles.statSub}>Pending entry</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: 'var(--success-light)', color: 'var(--success)' }}>
            <svg width="22" height="22" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 10l2.5 2.5L14 7" />
              <circle cx="10" cy="10" r="8" />
            </svg>
          </div>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>Completed</div>
            <div className={styles.statValue}>{completedCount}</div>
            <div className={styles.statSub}>{totalMarksEntered}/{totalStudentsAll} marks entered</div>
          </div>
        </div>
      </div>

      {/* ── Filter Tabs ── */}
      <div className={styles.tabRow}>
        {filters.map((f) => (
          <button
            key={f.key}
            className={`${styles.tab} ${activeFilter === f.key ? styles.tabActive : ''}`}
            onClick={() => setActiveFilter(f.key)}
          >
            {f.label}
            <span className={`${styles.tabCount} ${activeFilter !== f.key ? styles.tabCountInactive : ''}`}>
              {counts[f.key]}
            </span>
          </button>
        ))}
      </div>

      {/* ── Exam Cards ── */}
      <div className={styles.examList}>
        {filtered.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>
              <svg width="48" height="48" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1">
                <path d="M10 2L2 6l8 4 8-4-8-4z" />
                <path d="M2 6v6l8 4 8-4V6" />
              </svg>
            </div>
            <div className={styles.emptyText}>No exams found for this filter.</div>
          </div>
        ) : (
          filtered.map((exam) => {
            const statusStyle = getExamStatusStyle(exam.status);
            const entryPct = exam.totalStudents > 0 ? (exam.marksEntered / exam.totalStudents) * 100 : 0;
            const remaining = exam.totalStudents - exam.marksEntered;

            return (
              <div key={exam.id} className={styles.examCard}>
                <div className={styles.examTop}>
                  <div className={styles.examInfo}>
                    <div className={styles.examName}>{exam.name}</div>
                    <div className={styles.examMeta}>
                      <span className={styles.metaItem}>
                        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="2" y="3" width="16" height="14" rx="2" />
                          <path d="M2 7h16" />
                        </svg>
                        Class {exam.class}-{exam.section}
                      </span>
                      <span className={styles.metaItem}>
                        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="3" width="14" height="14" rx="2" />
                          <path d="M3 7h14" />
                          <path d="M7 2v2M13 2v2" />
                        </svg>
                        {formatDate(exam.date)}
                      </span>
                      <span className={styles.metaItem}>
                        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="10" cy="10" r="8" />
                          <path d="M10 6v4l2.5 2.5" />
                        </svg>
                        {exam.startTime} - {exam.endTime}
                      </span>
                      <span className={styles.metaItem}>
                        Total: {exam.totalMarks} marks &middot; Pass: {exam.passingMarks}
                      </span>
                    </div>
                  </div>
                  <span className={styles.statusBadge} style={{ background: statusStyle.bg, color: statusStyle.text }}>
                    {statusStyle.label}
                  </span>
                </div>

                {(exam.status === 'marks-entry' || exam.status === 'completed') && (
                  <div className={styles.progressSection}>
                    <div className={styles.progressHeader}>
                      <span className={styles.progressLabel}>Marks Entry Progress</span>
                      <span className={styles.progressValue}>
                        {exam.marksEntered}/{exam.totalStudents} entered
                      </span>
                    </div>
                    <div className={styles.progressBar}>
                      <div className={styles.progressFill} style={{ width: `${entryPct}%` }} />
                    </div>
                  </div>
                )}

                <div className={styles.examBottom}>
                  <div className={styles.examChips}>
                    <span className={styles.chip} style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
                      <svg width="12" height="12" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="7" cy="6" r="3" /><path d="M2 16c0-3 2.5-5 5-5s5 2 5 5" /></svg>
                      {exam.totalStudents} students
                    </span>
                    {exam.status === 'marks-entry' && remaining > 0 && (
                      <span className={styles.chip} style={{ background: 'var(--warning-light)', color: 'var(--warning-dark)' }}>
                        {remaining} remaining
                      </span>
                    )}
                    {exam.status === 'completed' && (
                      <span className={styles.chip} style={{ background: 'var(--success-light)', color: 'var(--success-dark)' }}>
                        All marks entered
                      </span>
                    )}
                  </div>
                  <div className={styles.examActions}>
                    {exam.status === 'marks-entry' && (
                      <button className={styles.enterMarksBtn} onClick={() => openMarksEntry(exam)}>
                        Enter Marks
                      </button>
                    )}
                    {exam.status === 'completed' && (
                      <>
                        <button className={styles.viewBtn} onClick={() => openMarksEntry(exam)}>
                          View Marks
                        </button>
                      </>
                    )}
                    {exam.status === 'upcoming' && (
                      <span className={styles.chip} style={{ background: 'var(--info-light)', color: 'var(--info-dark)' }}>
                        <svg width="12" height="12" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="10" cy="10" r="8" /><path d="M10 6v4l2.5 2.5" /></svg>
                        Scheduled
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ── Class Performance ── */}
      <div>
        <h2 className={styles.sectionTitle}>Class Performance (Last Exam)</h2>
        <div className={styles.performanceGrid}>
          {performance.map((cls) => (
            <div key={cls.classSection} className={styles.perfCard}>
              <div className={styles.perfHeader}>
                <span className={styles.perfClass}>Class {cls.classSection}</span>
                <span className={styles.perfAvg} style={{ color: getAvgColor(cls.avgPercentage) }}>
                  {cls.avgPercentage}%
                </span>
              </div>
              <div className={styles.perfStats}>
                <div className={styles.perfStatItem}>
                  <div className={styles.perfStatValue}>{cls.totalStudents}</div>
                  <div className={styles.perfStatLabel}>Total</div>
                </div>
                <div className={styles.perfStatItem}>
                  <div className={styles.perfStatValue} style={{ color: 'var(--success)' }}>{cls.passCount}</div>
                  <div className={styles.perfStatLabel}>Passed</div>
                </div>
                <div className={styles.perfStatItem}>
                  <div className={styles.perfStatValue} style={{ color: 'var(--danger)' }}>{cls.failCount}</div>
                  <div className={styles.perfStatLabel}>Failed</div>
                </div>
              </div>
              <div className={styles.perfTopper}>
                <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="10,2 12.5,7.5 18,8 14,12 15,18 10,15 5,18 6,12 2,8 7.5,7.5" />
                </svg>
                Topper: {cls.topperName} — {cls.topperMarks}/{performance[0]?.avgPercentage ? '100' : '50'} marks
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Marks Entry Modal ── */}
      {marksModal && (
        <div className={styles.modalOverlay} onClick={() => setMarksModal(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div>
                <h3 className={styles.modalTitle}>
                  {marksModal.status === 'completed' ? 'View Marks' : 'Enter Marks'} — {marksModal.name}
                </h3>
                <div className={styles.modalSubtitle}>
                  Class {marksModal.class}-{marksModal.section} &middot; {marksModal.subject} &middot; Total: {marksModal.totalMarks} &middot; Pass: {marksModal.passingMarks}
                </div>
              </div>
              <button className={styles.modalClose} onClick={() => setMarksModal(null)}>
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M5 5l10 10M15 5L5 15" />
                </svg>
              </button>
            </div>

            <div className={styles.modalBody}>
              <table className={styles.marksTable}>
                <thead>
                  <tr>
                    <th>Roll</th>
                    <th>Student Name</th>
                    <th>Absent</th>
                    <th>Marks ({marksModal.totalMarks})</th>
                    <th>Grade</th>
                    <th>Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {studentMarks.map((student, idx) => {
                    const gradeStyle = getGradeStyle(student.grade);
                    return (
                      <tr key={student.studentId}>
                        <td>
                          <span className={styles.rollBadge}>{student.rollNumber}</span>
                        </td>
                        <td>
                          <div className={styles.studentCell}>
                            {student.studentName}
                          </div>
                        </td>
                        <td>
                          <label className={styles.absentCheck}>
                            <input
                              type="checkbox"
                              checked={student.isAbsent}
                              onChange={(e) => updateMark(idx, 'isAbsent', e.target.checked)}
                            />
                            AB
                          </label>
                        </td>
                        <td>
                          <input
                            className={styles.marksInput}
                            type="number"
                            min={0}
                            max={marksModal.totalMarks}
                            value={student.marksObtained ?? ''}
                            disabled={student.isAbsent}
                            placeholder="—"
                            onChange={(e) => updateMark(idx, 'marksObtained', e.target.value ? Number(e.target.value) : null)}
                          />
                        </td>
                        <td>
                          <span className={styles.gradeBadge} style={{ background: gradeStyle.bg, color: gradeStyle.text }}>
                            {student.grade || '—'}
                          </span>
                        </td>
                        <td>
                          <input
                            className={styles.remarksInput}
                            type="text"
                            value={student.remarks}
                            placeholder="Optional"
                            onChange={(e) => updateMark(idx, 'remarks', e.target.value)}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className={styles.modalFooter}>
              <div className={styles.modalStats}>
                <span className={styles.modalStatItem}>
                  <span className={styles.modalStatDot} style={{ background: 'var(--success)' }} />
                  Entered: {studentMarks.filter((s) => s.marksObtained !== null && !s.isAbsent).length}
                </span>
                <span className={styles.modalStatItem}>
                  <span className={styles.modalStatDot} style={{ background: 'var(--gray-300)' }} />
                  Absent: {studentMarks.filter((s) => s.isAbsent).length}
                </span>
                <span className={styles.modalStatItem}>
                  <span className={styles.modalStatDot} style={{ background: 'var(--warning)' }} />
                  Remaining: {studentMarks.filter((s) => s.marksObtained === null && !s.isAbsent).length}
                </span>
              </div>
              <div className={styles.modalBtns}>
                <button className={styles.saveDraftBtn} onClick={() => setMarksModal(null)}>Save Draft</button>
                <button className={styles.submitBtn} onClick={() => setMarksModal(null)}>Submit Marks</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
