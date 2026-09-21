'use client';

import { useState } from 'react';
import { getLeaveRequests, getStudent, getToday } from '@/hooks/use-data';
import { formatDate, formatFileSize } from '@/lib/utils';
import { LEAVE_TYPE_LABELS } from '@/lib/constants';
import { useToast } from '@/components/common/Toast';
import Modal from '@/components/common/Modal';
import type { LeaveRequest } from '@/types';
import styles from './leave.module.css';

const MAX_ATTACHMENT_SIZE = 10 * 1024 * 1024;
const ALLOWED_ATTACHMENT = /^(image\/|application\/pdf$)/;

type TrackState = 'done' | 'active' | 'todo' | 'failed';

function getTrack(status: LeaveRequest['status']): Array<{ label: string; state: TrackState }> {
  if (status === 'pending') {
    return [{ label: 'Applied', state: 'done' }, { label: 'Under review', state: 'active' }, { label: 'Decision', state: 'todo' }];
  }
  if (status === 'approved') {
    return [{ label: 'Applied', state: 'done' }, { label: 'Reviewed', state: 'done' }, { label: 'Approved', state: 'done' }];
  }
  if (status === 'rejected') {
    return [{ label: 'Applied', state: 'done' }, { label: 'Reviewed', state: 'done' }, { label: 'Rejected', state: 'failed' }];
  }
  return [{ label: 'Applied', state: 'done' }, { label: 'Cancelled', state: 'failed' }];
}

type StatusFilter = 'all' | 'pending' | 'approved' | 'rejected' | 'cancelled';
type FormErrors = Partial<Record<'fromDate' | 'toDate' | 'reason', string>>;

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
  const student = getStudent();
  const today = getToday();
  const [allLeaves, setAllLeaves] = useState<LeaveRequest[]>(() => getLeaveRequests());
  const [activeFilter, setActiveFilter] = useState<StatusFilter>('all');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    type: 'sick',
    fromDate: '',
    toDate: '',
    reason: '',
  });
  const [attachment, setAttachment] = useState<File | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [cancelTarget, setCancelTarget] = useState<LeaveRequest | null>(null);
  const { showToast, toastNode } = useToast();

  const requestedDays = formData.fromDate && formData.toDate && formData.toDate >= formData.fromDate
    ? getDayCount(formData.fromDate, formData.toDate)
    : 0;

  function resetForm() {
    setFormData({ type: 'sick', fromDate: '', toDate: '', reason: '' });
    setAttachment(null);
    setErrors({});
  }

  function closeForm() {
    setShowForm(false);
    resetForm();
  }

  function handleAttachment(file: File | undefined) {
    if (!file) return;
    if (!ALLOWED_ATTACHMENT.test(file.type)) {
      showToast('Only JPG, PNG or PDF files are allowed', 'error');
      return;
    }
    if (file.size > MAX_ATTACHMENT_SIZE) {
      showToast('Attachment must be smaller than 10 MB', 'error');
      return;
    }
    setAttachment(file);
  }

  function submitLeave() {
    const found: FormErrors = {};
    if (!formData.fromDate) found.fromDate = 'Select the first day of leave';
    else if (formData.fromDate < today) found.fromDate = 'Leave cannot start in the past';
    if (!formData.toDate) found.toDate = 'Select the last day of leave';
    else if (formData.fromDate && formData.toDate < formData.fromDate) found.toDate = 'End date must be on or after the start date';
    if (formData.reason.trim().length < 10) found.reason = 'Please describe the reason (at least 10 characters)';
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    const request: LeaveRequest = {
      id: `LR${Date.now()}`,
      studentId: student.id,
      type: formData.type as LeaveRequest['type'],
      fromDate: formData.fromDate,
      toDate: formData.toDate,
      reason: formData.reason.trim(),
      status: 'pending',
      appliedDate: today,
      attachment: attachment
        ? {
            id: `ATT${Date.now()}`,
            name: attachment.name,
            url: URL.createObjectURL(attachment),
            type: attachment.type === 'application/pdf' ? 'pdf' : 'image',
            size: attachment.size,
          }
        : undefined,
    };
    // TODO: POST /api/leave (multipart) when backend is connected
    setAllLeaves((prev) => [request, ...prev]);
    setActiveFilter('all');
    closeForm();
    showToast('Leave request submitted. Your class teacher has been notified.');
  }

  function confirmCancel() {
    if (!cancelTarget) return;
    // TODO: PATCH /api/leave/:id { status: 'cancelled' } when backend is connected
    setAllLeaves((prev) => prev.map((l) => (l.id === cancelTarget.id ? { ...l, status: 'cancelled' } : l)));
    setCancelTarget(null);
    showToast('Leave request cancelled', 'info');
  }

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
    { key: 'cancelled', label: 'Cancelled' },
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
        <button className={styles.applyBtn} onClick={() => (showForm ? closeForm() : setShowForm(true))}>
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
                className={`${styles.formInput} ${errors.fromDate ? styles.formInputError : ''}`}
                min={today}
                value={formData.fromDate}
                onChange={(e) => setFormData({ ...formData, fromDate: e.target.value, toDate: formData.toDate && e.target.value > formData.toDate ? e.target.value : formData.toDate })}
              />
              {errors.fromDate && <span className={styles.fieldError}>{errors.fromDate}</span>}
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>To Date</label>
              <input
                type="date"
                className={`${styles.formInput} ${errors.toDate ? styles.formInputError : ''}`}
                min={formData.fromDate || today}
                value={formData.toDate}
                onChange={(e) => setFormData({ ...formData, toDate: e.target.value })}
              />
              {errors.toDate && <span className={styles.fieldError}>{errors.toDate}</span>}
            </div>
            <div className={styles.formGroupFull}>
              <label className={styles.formLabel}>Reason</label>
              <textarea
                className={`${styles.formTextarea} ${errors.reason ? styles.formInputError : ''}`}
                rows={3}
                placeholder="Please provide the reason for leave..."
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              />
              {errors.reason && <span className={styles.fieldError}>{errors.reason}</span>}
            </div>
            <div className={styles.formGroupFull}>
              <label className={styles.formLabel}>Attachment (optional)</label>
              <label className={styles.uploadArea}>
                <input
                  className={styles.uploadInput}
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={(e) => { handleAttachment(e.target.files?.[0]); e.target.value = ''; }}
                />
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 16V6M12 6l-4 4M12 6l4 4" />
                  <path d="M4 18v2a1 1 0 001 1h14a1 1 0 001-1v-2" />
                </svg>
                <span>Upload medical certificate or supporting document</span>
              </label>
              {attachment && (
                <div className={styles.fileChip}>
                  {attachment.name} ({formatFileSize(attachment.size)})
                  <button className={styles.fileRemove} onClick={() => setAttachment(null)} aria-label="Remove attachment">&times;</button>
                </div>
              )}
            </div>
          </div>
          <div className={styles.formActions}>
            {requestedDays > 0 && <span className={styles.daysNote}>{requestedDays} {requestedDays === 1 ? 'day' : 'days'} requested</span>}
            <button className={styles.cancelBtn} onClick={closeForm}>Cancel</button>
            <button className={styles.submitBtn} onClick={submitLeave}>Submit Application</button>
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
          <div className={styles.emptyDesc}>{activeFilter === 'all' ? "You haven't applied for any leave yet." : 'No requests with this status.'}</div>
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

                  {leave.attachment && (
                    <div className={styles.leaveAttachment}>
                      Attachment: <a href={leave.attachment.url} target="_blank" rel="noopener noreferrer">{leave.attachment.name}</a> ({formatFileSize(leave.attachment.size)})
                    </div>
                  )}

                  <div className={styles.track} aria-label="Request status">
                    {getTrack(leave.status).map((step, i) => (
                      <span key={step.label} className={`${styles.trackStep} ${styles[`track_${step.state}`]}`}>
                        {i > 0 && <span className={styles.trackLine} />}
                        <span className={styles.trackDot} />
                        {step.label}
                      </span>
                    ))}
                  </div>

                  {leave.status === 'pending' && (
                    <div className={styles.cancelRow}>
                      <button className={styles.cancelRequestBtn} onClick={() => setCancelTarget(leave)}>Cancel request</button>
                    </div>
                  )}

                  {leave.approvedBy && (
                    <div className={`${styles.leaveApprover} ${leave.status === 'rejected' ? styles.leaveRejected : ''}`}>
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="8" cy="5" r="3" /><path d="M2 14c0-3.3 2.7-6 6-6s6 2.7 6 6" /></svg>
                      <span>{leave.status === 'rejected' ? 'Rejected' : 'Approved'} by {leave.approvedBy}</span>
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

      {cancelTarget && (
        <Modal
          title="Cancel leave request?"
          subtitle={`${formatDate(cancelTarget.fromDate)} — ${formatDate(cancelTarget.toDate)}`}
          onClose={() => setCancelTarget(null)}
          size="sm"
          footer={
            <>
              <button className={styles.cancelBtn} onClick={() => setCancelTarget(null)}>Keep request</button>
              <button className={styles.dangerBtn} onClick={confirmCancel}>Yes, cancel it</button>
            </>
          }
        >
          <p className={styles.confirmText}>Your class teacher will be told this request is withdrawn. You can apply again at any time.</p>
        </Modal>
      )}
      {toastNode}
    </div>
  );
}
