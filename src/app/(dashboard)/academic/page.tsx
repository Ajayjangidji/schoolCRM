'use client';

import { useState } from 'react';
import { getExamResult, getExamHistory, getStudent } from '@/hooks/use-data';
import { getSubjectColor } from '@/lib/utils';
import { buildReportCardHtml, openPrintable } from '@/lib/print';
import { useToast } from '@/components/common/Toast';
import styles from './academic.module.css';

const CHART_WIDTH = 600;
const CHART_HEIGHT = 220;
const CHART_MIN = 50;
const CHART_MAX = 100;
const CHART_PAD = { left: 40, right: 24, top: 16, bottom: 32 };

function chartX(index: number, count: number): number {
  const inner = CHART_WIDTH - CHART_PAD.left - CHART_PAD.right;
  return CHART_PAD.left + (count === 1 ? inner / 2 : (inner * index) / (count - 1));
}

function chartY(value: number): number {
  const inner = CHART_HEIGHT - CHART_PAD.top - CHART_PAD.bottom;
  return CHART_PAD.top + inner * (1 - (value - CHART_MIN) / (CHART_MAX - CHART_MIN));
}

function getGradeColor(grade: string): { bg: string; text: string } {
  if (grade.startsWith('A')) return { bg: 'var(--success-light)', text: 'var(--success-dark)' };
  if (grade.startsWith('B')) return { bg: 'var(--info-light)', text: 'var(--info-dark)' };
  if (grade.startsWith('C')) return { bg: 'var(--warning-light)', text: 'var(--warning-dark)' };
  return { bg: 'var(--danger-light)', text: 'var(--danger-dark)' };
}

function getBarColor(percentage: number): string {
  if (percentage >= 90) return 'var(--success)';
  if (percentage >= 75) return 'var(--primary)';
  if (percentage >= 60) return 'var(--warning)';
  return 'var(--danger)';
}

export default function AcademicProgressPage() {
  const result = getExamResult();
  const student = getStudent();
  const history = getExamHistory();
  const { showToast, toastNode } = useToast();
  const [sortBy, setSortBy] = useState<'default' | 'high' | 'low'>('default');

  const bestSubject = [...result.subjects].sort((a, b) => b.percentage - a.percentage)[0];
  const weakestSubject = [...result.subjects].sort((a, b) => a.percentage - b.percentage)[0];

  let subjects = [...result.subjects];
  if (sortBy === 'high') subjects.sort((a, b) => b.percentage - a.percentage);
  if (sortBy === 'low') subjects.sort((a, b) => a.percentage - b.percentage);

  const overallGradeStyle = getGradeColor(result.overallGrade);

  const historySubjects = history[history.length - 1]?.subjects.map((s) => s.subject) ?? [];
  const studentPoints = history.map((h, i) => `${chartX(i, history.length)},${chartY(h.totalPercentage)}`).join(' ');
  const averagePoints = history.map((h, i) => `${chartX(i, history.length)},${chartY(h.classAverage)}`).join(' ');

  function downloadReportCard() {
    const opened = openPrintable(`Report Card - ${result.examName}`, buildReportCardHtml(student, result));
    if (opened) showToast('Choose "Save as PDF" in the print dialog to download');
    else showToast('Pop-up blocked. Please allow pop-ups to download.', 'error');
  }

  return (
    <div className={styles.page}>
      {/* Exam Summary Banner */}
      <div className={styles.examBanner}>
        <div className={styles.examBannerLeft}>
          <div className={styles.examType}>{result.examType.replace('-', ' ')}</div>
          <div className={styles.examName}>{result.examName}</div>
          <div className={styles.examMeta}>Class {result.class}-{result.section} &middot; {result.subjects.length} Subjects</div>
          <button className={styles.downloadBtn} onClick={downloadReportCard}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M8 2v9m0 0l-3-3m3 3l3-3" /><path d="M2 12v1.5A1.5 1.5 0 003.5 15h9a1.5 1.5 0 001.5-1.5V12" /></svg>
            Download Report Card
          </button>
        </div>
        <div className={styles.examBannerRight}>
          <div className={styles.scoreCircleWrap}>
            <svg viewBox="0 0 100 100" className={styles.scoreCircle}>
              <circle cx="50" cy="50" r="42" fill="none" stroke="var(--gray-100)" strokeWidth="10" />
              <circle
                cx="50" cy="50" r="42" fill="none"
                stroke="var(--primary)"
                strokeWidth="10"
                strokeDasharray={`${2 * Math.PI * 42}`}
                strokeDashoffset={`${2 * Math.PI * 42 * (1 - result.totalPercentage / 100)}`}
                strokeLinecap="round"
                transform="rotate(-90 50 50)"
              />
            </svg>
            <div className={styles.scoreCircleText}>
              <span className={styles.scoreCircleNum}>{result.totalPercentage}%</span>
              <span className={styles.scoreCircleLabel}>Overall</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <div className={styles.statIconBadge} style={{ background: overallGradeStyle.bg, color: overallGradeStyle.text }}>
            {result.overallGrade}
          </div>
          <div>
            <div className={styles.statValue}>{result.overallGrade}</div>
            <div className={styles.statLabel}>Overall Grade</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIconBadge} style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 17l5-5 3 3 6-7" /><path d="M13 8h4v4" /></svg>
          </div>
          <div>
            <div className={styles.statValue}>#{result.rank}</div>
            <div className={styles.statLabel}>Class Rank</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIconBadge} style={{ background: 'var(--success-light)', color: 'var(--success)' }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M10 3v14M3 10h14" /></svg>
          </div>
          <div>
            <div className={styles.statValue}>{bestSubject.subject}</div>
            <div className={styles.statLabel}>Best Subject ({bestSubject.percentage}%)</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIconBadge} style={{ background: 'var(--warning-light)', color: 'var(--warning)' }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M10 6v5l3 2" /><circle cx="10" cy="10" r="8" /></svg>
          </div>
          <div>
            <div className={styles.statValue}>{weakestSubject.subject}</div>
            <div className={styles.statLabel}>Needs Focus ({weakestSubject.percentage}%)</div>
          </div>
        </div>
      </div>

      {/* Performance Chart */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <span className={styles.cardTitle}>Subject-wise Performance</span>
        </div>
        <div className={styles.cardBody}>
          <div className={styles.chartWrap}>
            {result.subjects.map((s) => (
              <div key={s.subject} className={styles.chartRow}>
                <span className={styles.chartLabel}>{s.subject}</span>
                <div className={styles.chartTrack}>
                  <div
                    className={styles.chartFill}
                    style={{ width: `${s.percentage}%`, background: getSubjectColor(s.subject) }}
                  />
                </div>
                <span className={styles.chartValue}>{s.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Progress across exams */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <span className={styles.cardTitle}>Progress Across Exams</span>
          <div className={styles.trendLegend}>
            <span className={styles.trendLegendItem}><span className={styles.trendSwatch} style={{ background: 'var(--primary)' }} /> {student.name.split(' ')[0]}</span>
            <span className={styles.trendLegendItem}><span className={styles.trendSwatch} style={{ background: 'var(--gray-400)' }} /> Class average</span>
          </div>
        </div>
        <div className={styles.cardBody}>
          <svg viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`} className={styles.trendSvg} role="img" aria-label="Overall percentage across exams">
            {[50, 60, 70, 80, 90, 100].map((tick) => (
              <g key={tick}>
                <line x1={CHART_PAD.left} x2={CHART_WIDTH - CHART_PAD.right} y1={chartY(tick)} y2={chartY(tick)} stroke="var(--gray-200)" strokeWidth="1" />
                <text x={CHART_PAD.left - 8} y={chartY(tick) + 4} textAnchor="end" fontSize="11" fill="var(--text-tertiary)">{tick}</text>
              </g>
            ))}
            <polyline points={averagePoints} fill="none" stroke="var(--gray-400)" strokeWidth="2" strokeDasharray="5 4" />
            <polyline points={studentPoints} fill="none" stroke="var(--primary)" strokeWidth="3" strokeLinejoin="round" />
            {history.map((h, i) => (
              <g key={h.id}>
                <circle cx={chartX(i, history.length)} cy={chartY(h.classAverage)} r="4" fill="var(--gray-400)"><title>{`${h.examName} - class average ${h.classAverage}%`}</title></circle>
                <circle cx={chartX(i, history.length)} cy={chartY(h.totalPercentage)} r="6" fill="var(--primary)" stroke="var(--white)" strokeWidth="2"><title>{`${h.examName} - ${h.totalPercentage}%`}</title></circle>
                <text x={chartX(i, history.length)} y={chartY(h.totalPercentage) - 12} textAnchor="middle" fontSize="12" fontWeight="700" fill="var(--primary-dark)">{h.totalPercentage}%</text>
                <text x={chartX(i, history.length)} y={CHART_HEIGHT - 8} textAnchor="middle" fontSize="12" fill="var(--text-secondary)">{h.shortLabel}</text>
              </g>
            ))}
          </svg>
        </div>
      </div>

      {/* Subject-wise comparison across exams */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <span className={styles.cardTitle}>Subject-wise Comparison</span>
        </div>
        <div className={styles.trendTableWrap}>
          <table className={styles.trendTable}>
            <thead>
              <tr>
                <th>Subject</th>
                {history.map((h) => <th key={h.id}>{h.shortLabel}</th>)}
                <th>Change</th>
              </tr>
            </thead>
            <tbody>
              {historySubjects.map((subject) => {
                const values = history.map((h) => h.subjects.find((s) => s.subject === subject)?.percentage ?? 0);
                const change = values[values.length - 1] - (values[values.length - 2] ?? values[values.length - 1]);
                return (
                  <tr key={subject}>
                    <td><span className={styles.trendDot} style={{ background: getSubjectColor(subject) }} />{subject}</td>
                    {values.map((v, i) => <td key={history[i].id} style={{ fontWeight: 600, color: getBarColor(v) }}>{v}%</td>)}
                    <td style={{ fontWeight: 700, color: change > 0 ? 'var(--success)' : change < 0 ? 'var(--danger)' : 'var(--text-tertiary)' }}>
                      {change > 0 ? `▲ +${change}` : change < 0 ? `▼ ${change}` : '—'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Subject Marks Cards */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <span className={styles.cardTitle}>Detailed Marksheet</span>
          <div className={styles.sortTabs}>
            <button className={`${styles.sortTab} ${sortBy === 'default' ? styles.sortTabActive : ''}`} onClick={() => setSortBy('default')}>Default</button>
            <button className={`${styles.sortTab} ${sortBy === 'high' ? styles.sortTabActive : ''}`} onClick={() => setSortBy('high')}>Highest First</button>
            <button className={`${styles.sortTab} ${sortBy === 'low' ? styles.sortTabActive : ''}`} onClick={() => setSortBy('low')}>Lowest First</button>
          </div>
        </div>
        <div className={styles.cardBody}>
          <div className={styles.subjectGrid}>
            {subjects.map((s) => {
              const gradeStyle = getGradeColor(s.grade);
              return (
                <div key={s.subject} className={styles.subjectCard}>
                  <div className={styles.subjectBar} style={{ background: getSubjectColor(s.subject) }} />
                  <div className={styles.subjectCardContent}>
                    <div className={styles.subjectCardTop}>
                      <span className={styles.subjectCardName}>{s.subject}</span>
                      <span className={styles.gradeBadge} style={{ background: gradeStyle.bg, color: gradeStyle.text }}>
                        {s.grade}
                      </span>
                    </div>

                    <div className={styles.marksBreakdown}>
                      {s.theory !== undefined && (
                        <div className={styles.marksItem}>
                          <span className={styles.marksItemLabel}>Theory</span>
                          <span className={styles.marksItemValue}>{s.theory}</span>
                        </div>
                      )}
                      {s.practical !== undefined && (
                        <div className={styles.marksItem}>
                          <span className={styles.marksItemLabel}>Practical</span>
                          <span className={styles.marksItemValue}>{s.practical}</span>
                        </div>
                      )}
                      {s.internal !== undefined && (
                        <div className={styles.marksItem}>
                          <span className={styles.marksItemLabel}>Internal</span>
                          <span className={styles.marksItemValue}>{s.internal}</span>
                        </div>
                      )}
                      <div className={styles.marksItem}>
                        <span className={styles.marksItemLabel}>Total</span>
                        <span className={styles.marksItemValueBold}>{s.total}/{s.maxMarks}</span>
                      </div>
                    </div>

                    <div className={styles.subjectProgressTrack}>
                      <div
                        className={styles.subjectProgressFill}
                        style={{ width: `${s.percentage}%`, background: getBarColor(s.percentage) }}
                      />
                    </div>
                    <div className={styles.subjectPercentage}>{s.percentage}%</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Teacher Remarks */}
      {result.remarks && (
        <div className={styles.remarksCard}>
          <div className={styles.remarksIcon}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 4h14a1 1 0 011 1v8a1 1 0 01-1 1h-4l-3 3-3-3H3a1 1 0 01-1-1V5a1 1 0 011-1z" />
            </svg>
          </div>
          <div>
            <div className={styles.remarksTitle}>Class Teacher&apos;s Remarks</div>
            <div className={styles.remarksText}>{result.remarks}</div>
          </div>
        </div>
      )}
      {toastNode}
    </div>
  );
}
