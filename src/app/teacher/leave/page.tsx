'use client';

import { useState, useMemo } from 'react';
import { getLeaveToApprove } from '@/hooks/use-teacher-data';
import { getInitials, formatDate } from '@/lib/utils';
import styles from './leave.module.css';

type FilterStatus = 'all' | 'pending' | 'approved' | 'rejected';

const FILTERS: { key: FilterStatus; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'approved', label: 'Approved' },
  { key: 'rejected', label: 'Rejected' },
];

function getDayCount(from: string, to: string): number {
  const d1 = new Date(from);
  const d2 = new Date(to);
  return Math.max(1, Math.round((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24)) + 1);
}

export default function TeacherLeavePage() {
  const allLeaves = getLeaveToApprove();
  const [activeFilter, setActiveFilter] = useState<FilterStatus>('all');

  const filtered = useMemo(() => {
    if (activeFilter === 'all') return allLeaves;
    return allLeaves.filter((l) => l.status === activeFilter);
  }, [allLeaves, activeFilter]);

  const pendingCount = allLeaves.filter((l) => l.status === 'pending').length;
  const approvedCount = allLeaves.filter((l) => l.status === 'approved').length;
  const rejectedCount = allLeaves.filter((l) => l.status === 'rejected').length;
  const totalDays = allLeaves
    .filter((l) => l.status === 'approved')
    .reduce((s, l) => s + getDayCount(l.fromDate, l.toDate), 0);

  function getFilterCount(key: FilterStatus): number {
    if (key === 'all') return allLeaves.length;
    return allLeaves.filter((l) => l.status === key).length;
  }

  const avatarColors = ['#1976d2', '#388e3c', '#e65100', '#7b1fa2', '#c62828', '#00695c', '#4527a0'];

  return (
    <div className={styles.page}>
      {/* ── Header ── */}
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Leave Requests</h1>
      </div>

      {/* ── Stats ── */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: '#fff3e0', color: '#e65100' }}>
            <svg width="22" height="22" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="10" cy="10" r="8" />
              <path d="M10 6v4l2.5 2.5" />
            </svg>
          </div>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>Pending</div>
            <div className={styles.statValue}>{pendingCount}</div>
            <div className={styles.statSub}>Awaiting decision</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: '#e8f5e9', color: '#2e7d32' }}>
            <svg width="22" height="22" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 10l3 3 5-6" />
              <circle cx="10" cy="10" r="8" />
            </svg>
          </div>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>Approved</div>
            <div className={styles.statValue}>{approvedCount}</div>
            <div className={styles.statSub}>{totalDays} days total</div>
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
            <div className={styles.statLabel}>Rejected</div>
            <div className={styles.statValue}>{rejectedCount}</div>
            <div className={styles.statSub}>This month</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: '#e3f2fd', color: '#1565c0' }}>
            <svg width="22" height="22" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="14" height="12" rx="1" />
              <path d="M7 2v4M13 2v4M3 8h14" />
            </svg>
          </div>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>Total Requests</div>
            <div className={styles.statValue}>{allLeaves.length}</div>
            <div className={styles.statSub}>All time</div>
          </div>
        </div>
      </div>

      {/* ── Filters ── */}
      <div className={styles.filterTabs}>
        {FILTERS.map((f) => (
          <button
            key={f.key}
            className={`${styles.filterTab} ${activeFilter === f.key ? styles.filterTabActive : ''}`}
            onClick={() => setActiveFilter(f.key)}
          >
            {f.label} ({getFilterCount(f.key)})
          </button>
        ))}
      </div>

      {/* ── Leave Cards ── */}
      {filtered.length > 0 ? (
        <div className={styles.leaveList}>
          {filtered.map((leave, idx) => {
            const days = getDayCount(leave.fromDate, leave.toDate);
            const bgColor = avatarColors[idx % avatarColors.length];
            return (
              <div key={leave.id} className={styles.leaveCard}>
                <div className={styles.leaveCardHeader}>
                  <div className={styles.studentRow}>
                    <div className={styles.studentAvatar} style={{ background: bgColor + '18', color: bgColor }}>
                      {getInitials(leave.studentName)}
                    </div>
                    <div className={styles.studentDetails}>
                      <div className={styles.studentName}>{leave.studentName}</div>
                      <div className={styles.studentMeta}>
                        Roll #{leave.studentRoll} &middot; Class {leave.classSection}
                      </div>
                    </div>
                  </div>
                  <span className={`${styles.statusBadge} ${
                    leave.status === 'pending' ? styles.statusPending :
                    leave.status === 'approved' ? styles.statusApproved :
                    styles.statusRejected
                  }`}>
                    {leave.status}
                  </span>
                </div>

                <div className={styles.leaveCardBody}>
                  <div className={styles.leaveInfoGrid}>
                    <div className={styles.leaveInfoItem}>
                      <span className={styles.leaveInfoLabel}>Type</span>
                      <span className={styles.leaveInfoValue} style={{ textTransform: 'capitalize' }}>{leave.type}</span>
                    </div>
                    <div className={styles.leaveInfoItem}>
                      <span className={styles.leaveInfoLabel}>From</span>
                      <span className={styles.leaveInfoValue}>{formatDate(leave.fromDate)}</span>
                    </div>
                    <div className={styles.leaveInfoItem}>
                      <span className={styles.leaveInfoLabel}>To</span>
                      <span className={styles.leaveInfoValue}>{formatDate(leave.toDate)}</span>
                    </div>
                    <div className={styles.leaveInfoItem}>
                      <span className={styles.leaveInfoLabel}>Duration</span>
                      <span className={styles.leaveInfoValue}>{days} day{days > 1 ? 's' : ''}</span>
                    </div>
                  </div>

                  <div className={styles.reasonSection}>
                    <div className={styles.reasonLabel}>Reason</div>
                    <div className={styles.reasonText}>{leave.reason}</div>
                  </div>

                  <div className={styles.parentSection}>
                    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="10" cy="7" r="4" />
                      <path d="M3 17c0-3.3 3.1-6 7-6s7 2.7 7 6" />
                    </svg>
                    <span>Applied by: <strong style={{ color: 'var(--text-primary)' }}>{leave.parentName}</strong></span>
                    <span>&middot;</span>
                    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 5h2l1.5 9h7L16 7H5.5" />
                      <circle cx="8" cy="17" r="1" />
                      <circle cx="14" cy="17" r="1" />
                    </svg>
                    <span>{leave.parentPhone}</span>
                  </div>
                </div>

                <div className={styles.leaveCardFooter}>
                  <span className={styles.appliedDate}>Applied: {formatDate(leave.appliedDate)}</span>
                  {leave.status === 'pending' ? (
                    <div className={styles.actionBtns}>
                      <button className={styles.approveBtn}>
                        <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                          <path d="M5 10l4 4 6-8" />
                        </svg>
                        Approve
                      </button>
                      <button className={styles.rejectBtn}>
                        <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                          <path d="M6 6l8 8M14 6l-8 8" />
                        </svg>
                        Reject
                      </button>
                    </div>
                  ) : (
                    <span className={styles.doneLabel}>
                      {leave.status === 'approved' ? 'Approved' : 'Rejected'}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className={styles.emptyState}>No leave requests found for this filter.</div>
      )}
    </div>
  );
}
