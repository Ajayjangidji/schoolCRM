'use client';

import { useState } from 'react';
import { getAllExamResults, getExamSchedule, getStudent } from '@/hooks/use-data';
import { buildStudentMarksheetHtml, openPrintable } from '@/lib/print';
import { formatDate } from '@/lib/utils';
import { useToast } from '@/components/common/Toast';
import styles from './results.module.css';

type Tab = 'subjects' | 'marksheet' | 'schedule';

const TABS: Array<{ key: Tab; label: string }> = [
  { key: 'subjects', label: 'Subject-wise Results' },
  { key: 'marksheet', label: 'Marksheet' },
  { key: 'schedule', label: 'Upcoming Exams' },
];

function gradeClass(grade: string): string {
  if (grade.startsWith('A')) return styles.gradeA;
  if (grade.startsWith('B')) return styles.gradeB;
  return styles.gradeC;
}

function barColor(pct: number): string {
  if (pct >= 90) return 'var(--success)';
  if (pct >= 75) return 'var(--primary)';
  if (pct >= 60) return 'var(--warning)';
  return 'var(--danger)';
}

export default function ResultsPage() {
  const results = getAllExamResults();
  const schedule = getExamSchedule();
  const student = getStudent();
  const { showToast, toastNode } = useToast();
  const [examId, setExamId] = useState(results[0].id);
  const [tab, setTab] = useState<Tab>('subjects');

  const result = results.find((r) => r.id === examId) ?? results[0];
  const obtained = result.subjects.reduce((s, m) => s + m.total, 0);
  const maximum = result.subjects.reduce((s, m) => s + m.maxMarks, 0);
  const passed = result.subjects.every((s) => s.percentage >= 33);
  const subjectNames = results[0].subjects.map((s) => s.subject);
  const hasPractical = result.subjects.some((s) => s.practical !== undefined);

  function download() {
    const ok = openPrintable(`Marksheet - ${result.examName}`, buildStudentMarksheetHtml(student, result));
    if (ok) showToast('Choose "Save as PDF" in the print dialog to download');
    else showToast('Pop-up blocked. Please allow pop-ups to download.', 'error');
  }

  return (
    <div className={styles.page}>
      <div className={styles.examChips} role="tablist" aria-label="Select exam">
        {results.map((r) => (
          <button
            key={r.id}
            role="tab"
            aria-selected={r.id === examId}
            className={`${styles.chip} ${r.id === examId ? styles.chipActive : ''}`}
            onClick={() => setExamId(r.id)}
          >
            {r.examName}
            {r.examDate && <span className={styles.chipSub}>{formatDate(r.examDate)}</span>}
          </button>
        ))}
      </div>

      <div className={styles.summaryGrid}>
        <div className={styles.summaryCard}>
          <div className={styles.summaryLabel}>Percentage</div>
          <div className={styles.summaryValue}>{result.totalPercentage}%</div>
          <div className={styles.summarySub}>{obtained}/{maximum} marks</div>
        </div>
        <div className={styles.summaryCard}>
          <div className={styles.summaryLabel}>Overall Grade</div>
          <div className={styles.summaryValue}>{result.overallGrade}</div>
          <div className={styles.summarySub}>{passed ? 'Passed all subjects' : 'Needs improvement'}</div>
        </div>
        <div className={styles.summaryCard}>
          <div className={styles.summaryLabel}>Class Rank</div>
          <div className={styles.summaryValue}>{result.rank !== undefined ? `#${result.rank}` : '-'}</div>
          <div className={styles.summarySub}>{result.classSize ? `of ${result.classSize} students` : ''}</div>
        </div>
        <div className={styles.summaryCard}>
          <div className={styles.summaryLabel}>Class Average</div>
          <div className={styles.summaryValue}>{result.classAverage ?? '-'}%</div>
          <div className={styles.summarySub}>
            {result.classAverage !== undefined
              ? `You are ${(result.totalPercentage - result.classAverage).toFixed(1)}% ${result.totalPercentage >= result.classAverage ? 'above' : 'below'}`
              : ''}
          </div>
        </div>
      </div>

      <div className={styles.tabs} role="tablist">
        {TABS.map((t) => (
          <button key={t.key} role="tab" aria-selected={tab === t.key} className={`${styles.tab} ${tab === t.key ? styles.tabActive : ''}`} onClick={() => setTab(t.key)}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'subjects' && (
        <>
          <div className={styles.card}>
            <div className={styles.cardHeader}><span className={styles.cardTitle}>{result.examName} - Subject-wise</span></div>
            <div className={styles.tableScroll}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Subject</th>
                    <th>Theory</th>
                    {hasPractical && <th>Practical</th>}
                    <th>Internal</th>
                    <th>Total</th>
                    <th>Performance</th>
                    <th>Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {result.subjects.map((s) => (
                    <tr key={s.subject}>
                      <td className={styles.subjectCell}>{s.subject}</td>
                      <td>{s.theory}</td>
                      {hasPractical && <td>{s.practical ?? '-'}</td>}
                      <td>{s.internal ?? '-'}</td>
                      <td><strong>{s.total}/{s.maxMarks}</strong></td>
                      <td>
                        <div className={styles.barTrack}><div className={styles.barFill} style={{ width: `${s.percentage}%`, background: barColor(s.percentage) }} /></div>
                        <span className={styles.barPct}>{s.percentage}%</span>
                      </td>
                      <td><span className={`${styles.grade} ${gradeClass(s.grade)}`}>{s.grade}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {result.remarks && <div className={styles.remarks}><strong>Teacher&apos;s remarks:</strong> {result.remarks}</div>}
          </div>

          <div className={styles.card}>
            <div className={styles.cardHeader}><span className={styles.cardTitle}>Exam-by-Exam Comparison (%)</span></div>
            <div className={styles.tableScroll}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Subject</th>
                    {results.map((r) => <th key={r.id}>{r.examName.replace(' Examination', '').replace(' 2026', '')}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {subjectNames.map((name) => (
                    <tr key={name}>
                      <td className={styles.subjectCell}>{name}</td>
                      {results.map((r) => {
                        const m = r.subjects.find((s) => s.subject === name);
                        return <td key={r.id}>{m ? `${m.percentage}%` : '-'}</td>;
                      })}
                    </tr>
                  ))}
                  <tr className={styles.totalRow}>
                    <td>Overall</td>
                    {results.map((r) => <td key={r.id}>{r.totalPercentage}%</td>)}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {tab === 'marksheet' && (
        <div className={styles.marksheetWrap}>
          <div className={styles.marksheetActions}>
            <button className={styles.primaryBtn} onClick={download}>Download Marksheet (PDF)</button>
          </div>
          <div className={styles.marksheet}>
            <div className={styles.msBrand}>
              <div className={styles.msSchool}>SchoolAI International Academy</div>
              <div className={styles.msSub}>Statement of Marks</div>
            </div>
            <div className={styles.msTitle}>{result.examName}</div>
            <div className={styles.msInfo}>
              <div><span>Student Name</span><strong>{student.name}</strong></div>
              <div><span>Class / Section</span><strong>{result.class}-{result.section}</strong></div>
              <div><span>Roll Number</span><strong>{student.rollNumber}</strong></div>
              <div><span>Date of Birth</span><strong>{formatDate(student.dateOfBirth)}</strong></div>
            </div>
            <div className={styles.tableScroll}>
              <table className={styles.msTable}>
                <thead>
                  <tr><th>Subject</th><th>Max</th><th>Theory</th><th>Practical</th><th>Internal</th><th>Obtained</th><th>Grade</th></tr>
                </thead>
                <tbody>
                  {result.subjects.map((s) => (
                    <tr key={s.subject}>
                      <td>{s.subject}</td>
                      <td>{s.maxMarks}</td>
                      <td>{s.theory}</td>
                      <td>{s.practical ?? '-'}</td>
                      <td>{s.internal ?? '-'}</td>
                      <td><strong>{s.total}</strong></td>
                      <td><strong>{s.grade}</strong></td>
                    </tr>
                  ))}
                  <tr className={styles.msTotal}>
                    <td>Grand Total</td><td>{maximum}</td><td colSpan={3} /><td>{obtained}</td><td>{result.overallGrade}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className={styles.msFooterRow}>
              <div><span>Percentage</span><strong>{result.totalPercentage}%</strong></div>
              <div><span>Rank</span><strong>{result.rank !== undefined ? `#${result.rank}${result.classSize ? ` of ${result.classSize}` : ''}` : '-'}</strong></div>
              <div><span>Result</span><strong className={passed ? styles.pass : styles.fail}>{passed ? 'PASS' : 'FAIL'}</strong></div>
            </div>
            <div className={styles.msScale}>Grading scale: A+ 90-100 | A 75-89 | B+ 65-74 | B 55-64 | C 33-54</div>
            <div className={styles.msSign}><span>Class Teacher</span><span>Parent / Guardian</span><span>Principal</span></div>
          </div>
        </div>
      )}

      {tab === 'schedule' && (
        <div className={styles.card}>
          <div className={styles.cardHeader}><span className={styles.cardTitle}>Upcoming Exam Schedule</span></div>
          {schedule.length === 0 ? (
            <div className={styles.empty}>No upcoming exams scheduled.</div>
          ) : (
            <div className={styles.scheduleList}>
              {schedule.map((e) => (
                <div key={e.id} className={styles.scheduleItem}>
                  <div className={styles.scheduleDate}>
                    <strong>{new Date(`${e.date}T00:00:00`).getDate()}</strong>
                    <span>{new Date(`${e.date}T00:00:00`).toLocaleDateString('en-IN', { month: 'short' })}</span>
                  </div>
                  <div className={styles.scheduleBody}>
                    <div className={styles.scheduleSubject}>{e.subject} <span className={styles.scheduleType}>{e.examType}</span></div>
                    <div className={styles.scheduleMeta}>{e.startTime} - {e.endTime}</div>
                    {e.syllabus && <div className={styles.scheduleSyllabus}>Syllabus: {e.syllabus}</div>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      {toastNode}
    </div>
  );
}
