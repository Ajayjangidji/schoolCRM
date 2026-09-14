'use client';

import Link from 'next/link';
import {
  getSchoolStats,
  getClassWiseData,
  getRecentActivities,
  getFeeOverview,
  getEnrollmentTrend,
} from '@/hooks/use-admin-data';
import styles from './dashboard.module.css';

const ACTIVITY_ICONS: Record<string, { bg: string; color: string; emoji: string }> = {
  admission: { bg: '#e8f5e9', color: '#2e7d32', emoji: '🎓' },
  fee: { bg: '#e3f2fd', color: '#1565c0', emoji: '💰' },
  attendance: { bg: '#fff3e0', color: '#e65100', emoji: '📋' },
  notice: { bg: '#f3e5f5', color: '#7b1fa2', emoji: '📢' },
  exam: { bg: '#fce4ec', color: '#c62828', emoji: '📝' },
  leave: { bg: '#e0f2f1', color: '#00695c', emoji: '🏖️' },
};

function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
}

function formatLakh(amount: number): string {
  return `₹${(amount / 100000).toFixed(1)}L`;
}

function timeAgo(timestamp: string): string {
  const diff = Date.now() - new Date(timestamp).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function AdminDashboardPage() {
  const stats = getSchoolStats();
  const classData = getClassWiseData();
  const activities = getRecentActivities();
  const feeData = getFeeOverview();
  const enrollment = getEnrollmentTrend();

  const maxEnrollment = Math.max(...enrollment.map((e) => e.students));
  const maxFee = Math.max(...feeData.map((f) => f.total));

  return (
    <div className={styles.page}>
      {/* ── Header ── */}
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>School Dashboard</h1>
        <div className={styles.headerActions}>
          <Link href="/admin/reports" className={styles.downloadBtn}>
            <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 3v10M6 9l4 4 4-4" />
              <path d="M3 15v2h14v-2" />
            </svg>
            Export Report
          </Link>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: '#ede9fe', color: '#7c3aed' }}>
            <svg width="24" height="24" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="7" cy="6" r="3" />
              <path d="M2 16c0-3 2.5-5 5-5s5 2 5 5" />
              <circle cx="14" cy="7" r="2" />
              <path d="M14 11c2 0 4 1.5 4 4" />
            </svg>
          </div>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>Total Students</div>
            <div className={styles.statValue}>{stats.totalStudents.toLocaleString('en-IN')}</div>
            <div className={`${styles.statSub} ${styles.statUp}`}>
              <svg width="12" height="12" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M10 15V5M6 9l4-4 4 4" />
              </svg>
              +{stats.newAdmissions} new this year
            </div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: '#e3f2fd', color: '#1565c0' }}>
            <svg width="24" height="24" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="10" cy="5" r="3" />
              <path d="M4 17c0-3.5 2.7-6 6-6s6 2.5 6 6" />
            </svg>
          </div>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>Total Teachers</div>
            <div className={styles.statValue}>{stats.totalTeachers}</div>
            <div className={styles.statSub}>{stats.totalClasses} classes managed</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: '#e8f5e9', color: '#2e7d32' }}>
            <svg width="24" height="24" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="4" width="16" height="12" rx="2" />
              <path d="M2 8h16" />
              <path d="M6 12h3" />
            </svg>
          </div>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>Fee Collected</div>
            <div className={styles.statValue}>{formatINR(stats.monthlyFeeCollection)}</div>
            <div className={`${styles.statSub} ${styles.statDown}`}>
              {formatINR(stats.pendingFees)} pending
            </div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: '#fff3e0', color: '#e65100' }}>
            <svg width="24" height="24" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="14" height="14" rx="1" />
              <path d="M3 7h14M7 3v4M13 3v4" />
              <path d="M7 11l2 2 4-4" />
            </svg>
          </div>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>Avg Attendance</div>
            <div className={styles.statValue}>{stats.avgAttendance}%</div>
            <div className={`${styles.statSub} ${styles.statUp}`}>
              <svg width="12" height="12" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M10 15V5M6 9l4-4 4 4" />
              </svg>
              +1.2% from last month
            </div>
          </div>
        </div>
      </div>

      {/* ── Charts Row ── */}
      <div className={styles.twoCol}>
        {/* Fee Collection Chart */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={styles.cardTitle}>Fee Collection (2026-27)</span>
            <Link href="/admin/fees" className={styles.cardAction}>View Details</Link>
          </div>
          <div className={styles.cardBody}>
            <div className={styles.chartArea}>
              <div className={styles.chartBars}>
                {feeData.map((m) => {
                  const cPct = (m.collected / maxFee) * 100;
                  const pPct = (m.pending / maxFee) * 100;
                  return (
                    <div key={m.month} className={styles.chartBarGroup}>
                      <div className={styles.chartBarStack}>
                        <div className={styles.chartBarPending} style={{ height: `${pPct}%` }} />
                        <div className={styles.chartBarCollected} style={{ height: `${cPct}%` }} />
                      </div>
                      <span className={styles.chartBarLabel}>{m.month}</span>
                    </div>
                  );
                })}
              </div>
              <div className={styles.chartLegend}>
                <span className={styles.legendItem}>
                  <span className={styles.legendDot} style={{ background: '#7c3aed' }} />
                  Collected
                </span>
                <span className={styles.legendItem}>
                  <span className={styles.legendDot} style={{ background: '#e0d4f7' }} />
                  Pending
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Enrollment Trend */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={styles.cardTitle}>Enrollment Trend</span>
            <Link href="/admin/reports" className={styles.cardAction}>Full Report</Link>
          </div>
          <div className={styles.cardBody}>
            <div className={styles.trendList}>
              {enrollment.map((e) => {
                const pct = (e.students / maxEnrollment) * 100;
                return (
                  <div key={e.year} className={styles.trendRow}>
                    <span className={styles.trendYear}>{e.year}</span>
                    <div className={styles.trendBarWrap}>
                      <div className={styles.trendBar} style={{ width: `${pct}%` }}>
                        <span className={styles.trendValue}>{e.students.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ── Quick Actions ── */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <span className={styles.cardTitle}>Quick Actions</span>
        </div>
        <div className={styles.cardBody}>
          <div className={styles.quickActions}>
            <Link href="/admin/students" className={styles.quickAction}>
              <div className={styles.quickActionIcon} style={{ background: '#ede9fe', color: '#7c3aed' }}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <circle cx="10" cy="6" r="4" />
                  <path d="M3 18c0-4 3-7 7-7s7 3 7 7" />
                  <path d="M14 2l2 2-2 2" />
                </svg>
              </div>
              <span className={styles.quickActionLabel}>New Admission</span>
            </Link>
            <Link href="/admin/fees" className={styles.quickAction}>
              <div className={styles.quickActionIcon} style={{ background: '#e8f5e9', color: '#2e7d32' }}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <rect x="2" y="4" width="16" height="12" rx="2" />
                  <path d="M2 8h16M6 12h3" />
                </svg>
              </div>
              <span className={styles.quickActionLabel}>Collect Fee</span>
            </Link>
            <Link href="/admin/notices" className={styles.quickAction}>
              <div className={styles.quickActionIcon} style={{ background: '#fce4ec', color: '#c62828' }}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M10 2a6 6 0 016 6c0 3.5 1 5.5 2 7H2c1-1.5 2-3.5 2-7a6 6 0 016-6z" />
                  <path d="M8 15a2 2 0 004 0" />
                </svg>
              </div>
              <span className={styles.quickActionLabel}>Send Notice</span>
            </Link>
            <Link href="/admin/reports" className={styles.quickAction}>
              <div className={styles.quickActionIcon} style={{ background: '#e3f2fd', color: '#1565c0' }}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M4 17V7l4-4h8v14H4z" />
                  <path d="M8 3v4H4" />
                  <path d="M7 10h6M7 13h4" />
                </svg>
              </div>
              <span className={styles.quickActionLabel}>Generate Report</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ── Activity + Class Overview ── */}
      <div className={styles.twoCol}>
        {/* Recent Activity */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={styles.cardTitle}>Recent Activity</span>
            <Link href="/admin/notices" className={styles.cardAction}>View All</Link>
          </div>
          <div className={styles.activityList}>
            {activities.slice(0, 8).map((a) => {
              const iconStyle = ACTIVITY_ICONS[a.type] || ACTIVITY_ICONS.notice;
              return (
                <div key={a.id} className={styles.activityItem}>
                  <div className={styles.activityIcon} style={{ background: iconStyle.bg }}>
                    {iconStyle.emoji}
                  </div>
                  <div className={styles.activityInfo}>
                    <div className={styles.activityTitle}>{a.title}</div>
                    <div className={styles.activityDesc}>{a.description}</div>
                  </div>
                  <span className={styles.activityTime}>{timeAgo(a.timestamp)}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Class Overview */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={styles.cardTitle}>Class Overview</span>
            <Link href="/admin/classes" className={styles.cardAction}>View All Classes</Link>
          </div>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Class</th>
                  <th>Students</th>
                  <th>Attendance</th>
                  <th>Avg Marks</th>
                  <th>Teacher</th>
                </tr>
              </thead>
              <tbody>
                {classData.slice(0, 10).map((c) => {
                  const attColor = c.avgAttendance >= 92 ? '#2e7d32' : c.avgAttendance >= 88 ? '#e65100' : '#c62828';
                  const marksColor = c.avgMarks >= 80 ? '#2e7d32' : c.avgMarks >= 70 ? '#e65100' : '#c62828';
                  return (
                    <tr key={`${c.class}-${c.section}`}>
                      <td style={{ fontWeight: 600 }}>{c.class}-{c.section}</td>
                      <td>{c.totalStudents}</td>
                      <td>
                        <span className={styles.progressBar}>
                          <span className={styles.progressFill} style={{ width: `${c.avgAttendance}%`, background: attColor }} />
                        </span>
                        {c.avgAttendance}%
                      </td>
                      <td>
                        <span className={styles.progressBar}>
                          <span className={styles.progressFill} style={{ width: `${c.avgMarks}%`, background: marksColor }} />
                        </span>
                        {c.avgMarks}%
                      </td>
                      <td style={{ color: 'var(--text-secondary)' }}>{c.classTeacher}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
