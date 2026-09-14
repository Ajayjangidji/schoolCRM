'use client';

import { getMonthlyAttendance, getSubjectPerformance, getClassPerformanceTrend, getSchoolStats } from '@/hooks/use-admin-data';
import styles from './reports.module.css';

const EXAM_COLORS = ['#7c3aed', '#1565c0', '#2e7d32'];

export default function AdminReportsPage() {
  const attendance = getMonthlyAttendance();
  const subjects = getSubjectPerformance();
  const classTrends = getClassPerformanceTrend();
  const stats = getSchoolStats();

  const avgAttendance = attendance.length > 0 ? Math.round(attendance.reduce((s, a) => s + (a.present / a.total) * 100, 0) / attendance.length) : 0;
  const avgPerformance = subjects.length > 0 ? Math.round(subjects.reduce((s, sub) => s + sub.avgMarks, 0) / subjects.length) : 0;
  const topSubject = [...subjects].sort((a, b) => b.avgMarks - a.avgMarks)[0];

  const maxPresent = Math.max(...attendance.map((a) => a.present));

  function getRankClass(rank: number) {
    if (rank === 1) return styles.rank1;
    if (rank === 2) return styles.rank2;
    if (rank === 3) return styles.rank3;
    return styles.rankDefault;
  }

  function getScoreColor(score: number) {
    if (score >= 80) return '#2e7d32';
    if (score >= 65) return '#e65100';
    return '#c62828';
  }

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Reports & Analytics</h1>
        <div className={styles.headerActions}>
          <button className={styles.exportBtn} onClick={() => alert('Report exported successfully!')}>
            <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M6 10l4 4 4-4M10 3v11M3 17h14" />
            </svg>
            Export Report
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: '#ede9fe', color: '#7c3aed' }}>
            <svg width="22" height="22" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="10" cy="7" r="3" />
              <path d="M4 18c0-3.3 2.7-6 6-6s6 2.7 6 6" />
            </svg>
          </div>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>Total Students</div>
            <div className={styles.statValue}>{stats.totalStudents.toLocaleString('en-IN')}</div>
            <div className={styles.statSub}>Enrolled this year</div>
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
            <div className={styles.statSub}>Last 6 months</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: '#e3f2fd', color: '#1565c0' }}>
            <svg width="22" height="22" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 17l4-8 4 5 3-4 4 7" />
              <circle cx="7" cy="5" r="2" />
            </svg>
          </div>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>Avg Performance</div>
            <div className={styles.statValue}>{avgPerformance}%</div>
            <div className={styles.statSub}>All subjects</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: '#fff3e0', color: '#e65100' }}>
            <svg width="22" height="22" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>Top Subject</div>
            <div className={styles.statValue}>{topSubject?.subject || '-'}</div>
            <div className={styles.statSub}>{topSubject?.avgMarks || 0}% avg marks</div>
          </div>
        </div>
      </div>

      {/* Attendance Trend + Subject Performance */}
      <div className={styles.twoCol}>
        {/* Attendance Trend Bar Chart */}
        <div className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTitle}>Monthly Attendance Trend</span>
          </div>
          <div className={styles.sectionBody}>
            <div className={styles.chartContainer}>
              {attendance.map((m) => {
                const pct = Math.round((m.present / m.total) * 100);
                const height = maxPresent > 0 ? (m.present / maxPresent) * 100 : 0;
                return (
                  <div key={m.month} className={styles.chartBarGroup}>
                    <div className={styles.chartBar} style={{ height: `${height}%`, background: pct >= 90 ? '#7c3aed' : pct >= 80 ? '#1565c0' : '#e65100' }}>
                      <span className={styles.chartBarValue}>{pct}%</span>
                    </div>
                    <span className={styles.chartBarLabel}>{m.month.substring(0, 3)}</span>
                  </div>
                );
              })}
            </div>
            <div className={styles.chartLegend}>
              <span className={styles.legendItem}><span className={styles.legendDot} style={{ background: '#7c3aed' }} /> &ge;90%</span>
              <span className={styles.legendItem}><span className={styles.legendDot} style={{ background: '#1565c0' }} /> 80-89%</span>
              <span className={styles.legendItem}><span className={styles.legendDot} style={{ background: '#e65100' }} /> &lt;80%</span>
            </div>
          </div>
        </div>

        {/* Subject Performance Table */}
        <div className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTitle}>Subject-wise Performance</span>
          </div>
          <div className={styles.tableScroll}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Subject</th>
                  <th>Avg Marks</th>
                  <th>Pass %</th>
                  <th>Top Score</th>
                </tr>
              </thead>
              <tbody>
                {[...subjects].sort((a, b) => b.avgMarks - a.avgMarks).map((sub, i) => {
                  const passColor = sub.passRate >= 90 ? '#2e7d32' : sub.passRate >= 75 ? '#e65100' : '#c62828';
                  return (
                    <tr key={sub.subject}>
                      <td><span className={`${styles.rankBadge} ${getRankClass(i + 1)}`}>{i + 1}</span></td>
                      <td style={{ fontWeight: 600 }}>{sub.subject}</td>
                      <td>
                        <span className={styles.progressBar}>
                          <span className={styles.progressFill} style={{ width: `${sub.avgMarks}%`, background: getScoreColor(sub.avgMarks) }} />
                        </span>
                        {sub.avgMarks}%
                      </td>
                      <td style={{ color: passColor, fontWeight: 600 }}>{sub.passRate}%</td>
                      <td style={{ color: '#2e7d32', fontWeight: 600 }}>{sub.topScore}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Class Performance Trends */}
      <div className={styles.sectionCard}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionTitle}>Class-wise Performance Trends</span>
          <div className={styles.chartLegend} style={{ borderTop: 'none', paddingTop: 0, marginTop: 0 }}>
            {['Unit Test 1', 'Mid-Term', 'Unit Test 2'].map((label, i) => (
              <span key={label} className={styles.legendItem}>
                <span className={styles.legendDot} style={{ background: EXAM_COLORS[i] }} />
                {label}
              </span>
            ))}
          </div>
        </div>
        <div className={styles.sectionBody}>
          <div className={styles.classGrid}>
            {classTrends.map((cls) => {
              const diff = cls.unitTest2 - cls.midTerm;
              const isUp = diff >= 0;
              const scores = [
                { exam: 'UT 1', marks: cls.unitTest1 },
                { exam: 'Mid-Term', marks: cls.midTerm },
                { exam: 'UT 2', marks: cls.unitTest2 },
              ];
              return (
                <div key={cls.class} className={styles.classCard}>
                  <div className={styles.classCardHeader}>
                    <span className={styles.classLabel}>Class {cls.class}</span>
                    <span className={`${styles.trendBadge} ${isUp ? styles.trendUp : styles.trendDown}`}>
                      {isUp ? '+' : ''}{diff.toFixed(1)}%
                    </span>
                  </div>
                  <div className={styles.classScores}>
                    {scores.map((score, idx) => (
                      <div key={score.exam} className={styles.scoreRow}>
                        <span className={styles.scoreLabel}>{score.exam}</span>
                        <div className={styles.scoreMiniBar}>
                          <div className={styles.scoreMiniBarFill} style={{ width: `${score.marks}%`, background: EXAM_COLORS[idx] }} />
                        </div>
                        <span className={styles.scoreValue}>{score.marks}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
