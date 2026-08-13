'use client';

import { useState } from 'react';
import { getLeaveRequests, getStudent } from '@/hooks/use-data';
import { formatDate } from '@/lib/utils';
import { LEAVE_TYPE_LABELS } from '@/lib/constants';
import styles from './leave.module.css';

type StatusFilter = 'all' | 'pending' | 'approved' | 'rejected' | 'cancelled';

function getStatusStyle(status: string): { bg: string; text: string } {
  const map: Record<string, { bg: string; text: string }> = {
    pending: { bg: 'var(--warning-light)', text: 'var(--warning-dark)' },
    approved: { bg: 'var(--success-light)', text: 'var(--success-dark)' },
    rejected: { bg: 'var(--danger-light)', text: 'var(--danger-dark)' },
    cancelled: { bg: 'var(--gray-100)', text: 'var(--gray-500)' },
  };
  return map[status] || map.pending;
}

function getLeaveTypeStyle(type: string): { bg: string; text: string } {
  const map: Record<string, { bg: string; text: string }> = {
    sick: { bg: 'var(--danger-light)', text: 'var(--danger-dark)' },
    personal: { bg: 'var(--primary-light)', text: 'var(--primary-dark)' },
    'family-emergency': { bg: 'var(--warning-light)', text: 'var(--warning-dark)' },
    religious: { bg: 'var(--info-light)', text: 'var(--info-dark)' },
    other: { bg: 'var(--gray-100)', text: 'var(--gray-600)' },
  };
  return map[type] || map.other;
}

function getDayCount(from: string, to: string): number {
  const diff = new Date(to).getTime() - new Date(from).getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24)) + 1;
}

const STATUS_LABELS: Record<string, string> = {
  pending: 'Pending',
  approved: 'Approved',
  rejected: 'Rejected',
  cancelled: 'Cancelled',
};

export default function LeaveRequestPage() {
  const allLeaves = getLeaveRequests();
  const student = getStudent();
  const [activeFilter, setActiveFilter] = useState<StatusFilter>('all');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    type: 'sick',
    fromDate: '',
    toDate: '',
    reason: '',
  });

  const filtered = activeFilter === 'all'
    ? allLeaves
    : allLeaves.filter((l) => l.status === activeFilter);

  const counts = {
    all: allLeaves.length,
    pending: allLeaves.filter((l) => l.status === 'pending').length,
    approved: allLeaves.filter((l) => l.status === 'approved').length,
    rejected: allLeaves.filter((l) => l.status === 'rejected').length,
    cancelled: allLeaves.filter((l) => l.status === 'cancelled').length,
  };

  const totalDaysLeave = allLeaves
    .filter((l) => l.status === 'approved')
    .reduce((sum, l) => sum + getDayCount(l.fromDate, l.toDate), 0);

  const filters: { key: StatusFilter; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'pending', label: 'Pending' },
    { key: 'approved', label: 'Approved' },
    { key: 'rejected', label: 'Rejected' },
  ];

  return (
    <div className={styles.page}>
      {/* Stats */}
      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <div className={styles.statNum}>{allLeaves.length}</div>
          <div className={styles.statLabel}>Total Requests</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statNum} style={{ color: 'var(--success)' }}>{counts.approved}</div>
          <div className={styles.statLabel}>Approved</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statNum} style={{ color: 'var(--warning)' }}>{counts.pending}</div>
          <div className={styles.statLabel}>Pending</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statNum} style={{ color: 'var(--primary)' }}>{totalDaysLeave}</div>
          <div className={styles.statLabel}>Total Days Leave</div>
        </div>
      </div>

      {/* Apply Button + Filter */}
      <div className={styles.filterBar}>
        <div className={styles.tabs}>
          {filters.map((f) => (
            <button
              key={f.key}
              className={`${styles.tab} ${activeFilter === f.key ? styles.tabActive : ''}`}
              onClick={() => setActiveFilter(f.key)}
            >
              {f.label}
              {counts[f.key] > 0 && (
                <span
                  className={styles.tabCount}
                  style={{
                    background: activeFilter === f.key ? 'var(--primary-light)' : 'var(--gray-200)',
                    color: activeFilter === f.key ? 'var(--primary)' : 'var(--text-tertiary)',
                  }}
                >
                  {counts[f.key]}
                </span>
              )}
            </button>
          ))}
        </div>
        <button className={styles.applyBtn} onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Apply Leave'}
        </button>
      </div>

      {/* Apply Form */}
      {showForm && (
        <div className={styles.formCard}>
          <div className={styles.formTitle}>Apply for Leave</div>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Student</label>
              <div className={styles.formStatic}>{student.name} — Class {student.class}-{student.section}</div>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Leave Type</label>
              <select
                className={styles.formSelect}
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              >
                <option value="sick">Sick Leave</option>
                <option value="personal">Personal</option>
                <option value="family-emergency">Family Emergency</option>
                <option value="religious">Religious</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>From Date</label>
              <input
                type="date"
                className={styles.formInput}
                value={formData.fromDate}
                onChange={(e) => setFormData({ ...formData, fromDate: e.target.value })}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>To Date</label>
              <input
                type="date"
                className={styles.formInput}
                value={formData.toDate}
                onChange={(e) => setFormData({ ...formData, toDate: e.target.value })}
              />
            </div>
            <div className={styles.formGroupFull}>
              <label className={styles.formLabel}>Reason</label>
              <textarea
                className={styles.formTextarea}
                rows={3}
                placeholder="Please provide the reason for leave..."
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              />
            </div>
            <div className={styles.formGroupFull}>
              <label className={styles.formLabel}>Attachment (optional)</label>
              <div className={styles.uploadArea}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 16V6M12 6l-4 4M12 6l4 4" />
                  <path d="M4 18v2a1 1 0 001 1h14a1 1 0 001-1v-2" />
                </svg>
                <span>Upload medical certificate or supporting document</span>
              </div>
            </div>
          </div>
          <div className={styles.formActions}>
            <button className={styles.cancelBtn} onClick={() => setShowForm(false)}>Cancel</button>
            <button className={styles.submitBtn}>Submit Application</button>
          </div>
        </div>
      )}

      {/* Leave List */}
      {filtered.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="8" y="8" width="32" height="32" rx="4" />
              <path d="M8 16h32" />
              <path d="M16 4v6M32 4v6" />
              <path d="M18 26h12M18 32h6" />
            </svg>
          </div>
          <div className={styles.emptyTitle}>No leave requests</div>
          <div className={styles.emptyDesc}>You haven&apos;t applied for any leave yet.</div>
        </div>
      ) : (
        <div className={styles.leaveList}>
          {filtered.map((leave) => {
            const statusStyle = getStatusStyle(leave.status);
            const typeStyle = getLeaveTypeStyle(leave.type);
            const days = getDayCount(leave.fromDate, leave.toDate);

            return (
              <div key={leave.id} className={styles.leaveCard}>
                <div className={styles.leaveCardLeft}>
                  <div className={styles.leaveDateBlock}>
                    <div className={styles.leaveDateNum}>
                      {new Date(leave.fromDate).getDate()}
                    </div>
                    <div className={styles.leaveDateMonth}>
                      {new Date(leave.fromDate).toLocaleDateString('en-IN', { month: 'short' })}
                    </div>
                  </div>
                </div>

                <div className={styles.leaveCardContent}>
                  <div className={styles.leaveCardTop}>
                    <div className={styles.leaveTags}>
                      <span className={styles.leaveTypeBadge} style={{ background: typeStyle.bg, color: typeStyle.text }}>
                        {LEAVE_TYPE_LABELS[leave.type]}
                      </span>
                      <span className={styles.leaveStatusBadge} style={{ background: statusStyle.bg, color: statusStyle.text }}>
                        {STATUS_LABELS[leave.status]}
                      </span>
                    </div>
                    <span className={styles.leaveDays}>{days} {days === 1 ? 'day' : 'days'}</span>
                  </div>

                  <div className={styles.leaveReason}>{leave.reason}</div>

                  <div className={styles.leaveMeta}>
                    <span>
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="3" width="12" height="11" rx="1.5" /><path d="M2 6h12" /><path d="M5 1.5v2M11 1.5v2" /></svg>
                      {formatDate(leave.fromDate)} — {formatDate(leave.toDate)}
                    </span>
                    <span>
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="8" cy="8" r="6" /><path d="M8 5v3l2 1" /></svg>
                      Applied: {formatDate(leave.appliedDate)}
                    </span>
                  </div>

                  {leave.approvedBy && (
                    <div className={styles.leaveApprover}>
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="8" cy="5" r="3" /><path d="M2 14c0-3.3 2.7-6 6-6s6 2.7 6 6" /></svg>
                      <span>Approved by {leave.approvedBy}</span>
                      {leave.approverRemarks && (
                        <span className={styles.approverRemarks}>&mdash; &ldquo;{leave.approverRemarks}&rdquo;</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
