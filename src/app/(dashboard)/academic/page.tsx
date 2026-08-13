'use client';

import { useState } from 'react';
import { getExamResult } from '@/hooks/use-data';
import { getSubjectColor } from '@/lib/utils';
import styles from './academic.module.css';

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
  const [sortBy, setSortBy] = useState<'default' | 'high' | 'low'>('default');

  const bestSubject = [...result.subjects].sort((a, b) => b.percentage - a.percentage)[0];
  const weakestSubject = [...result.subjects].sort((a, b) => a.percentage - b.percentage)[0];

  let subjects = [...result.subjects];
  if (sortBy === 'high') subjects.sort((a, b) => b.percentage - a.percentage);
  if (sortBy === 'low') subjects.sort((a, b) => a.percentage - b.percentage);

  const overallGradeStyle = getGradeColor(result.overallGrade);

  return (
    <div className={styles.page}>
      {/* Exam Summary Banner */}
      <div className={styles.examBanner}>
        <div className={styles.examBannerLeft}>
          <div className={styles.examType}>{result.examType.replace('-', ' ')}</div>
          <div className={styles.examName}>{result.examName}</div>
          <div className={styles.examMeta}>Class {result.class}-{result.section} &middot; {result.subjects.length} Subjects</div>
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
    </div>
  );
}
