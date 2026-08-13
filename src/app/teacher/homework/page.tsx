'use client';

import { useState } from 'react';
import {
  getHomeworkAssigned,
  getSubmissionsToReview,
  getTeacherClasses,
} from '@/hooks/use-teacher-data';
import { getInitials, formatDate } from '@/lib/utils';
import styles from './homework.module.css';

type FilterType = 'all' | 'active' | 'past-due' | 'completed';

function getStatusStyle(status: string): { bg: string; text: string; label: string } {
  const map: Record<string, { bg: string; text: string; label: string }> = {
    active: { bg: 'var(--primary-light)', text: 'var(--primary)', label: 'Active' },
    'past-due': { bg: 'var(--danger-light)', text: 'var(--danger)', label: 'Past Due' },
    completed: { bg: 'var(--success-light)', text: 'var(--success-dark)', label: 'Completed' },
  };
  return map[status] || map.active;
}

export default function TeacherHomeworkPage() {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [showModal, setShowModal] = useState(false);

  const allHomework = getHomeworkAssigned();
  const submissions = getSubmissionsToReview();
  const classes = getTeacherClasses();

  const pendingReviews = submissions.filter((s) => s.status === 'pending-review');
  const totalSubmitted = allHomework.reduce((s, h) => s + h.submitted, 0);
  const totalEvaluated = allHomework.reduce((s, h) => s + h.evaluated, 0);
  const totalExpected = allHomework.reduce((s, h) => s + h.totalStudents, 0);
  const submissionRate = totalExpected > 0 ? Math.round((totalSubmitted / totalExpected) * 100) : 0;

  const filtered = activeFilter === 'all'
    ? allHomework
    : allHomework.filter((h) => h.status === activeFilter);

  const counts: Record<FilterType, number> = {
    all: allHomework.length,
    active: allHomework.filter((h) => h.status === 'active').length,
    'past-due': allHomework.filter((h) => h.status === 'past-due').length,
    completed: allHomework.filter((h) => h.status === 'completed').length,
  };

  const filters: { key: FilterType; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'active', label: 'Active' },
    { key: 'past-due', label: 'Past Due' },
    { key: 'completed', label: 'Completed' },
  ];

  return (
    <div className={styles.page}>
      {/* ── Header ── */}
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Homework Management</h1>
        <button className={styles.assignBtn} onClick={() => setShowModal(true)}>
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M10 4v12M4 10h12" />
          </svg>
          Assign Homework
        </button>
      </div>

      {/* ── Stats ── */}
      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
            <svg width="22" height="22" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h12v14H4z" />
              <path d="M7 8h6M7 11h6M7 14h3" />
              <path d="M4 4l2-2h8l2 2" />
            </svg>
          </div>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>Total Assigned</div>
            <div className={styles.statValue}>{allHomework.length}</div>
            <div className={styles.statSub}>{counts.active} active</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: 'var(--warning-light)', color: 'var(--warning)' }}>
            <svg width="22" height="22" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="10" cy="10" r="8" />
              <path d="M10 6v4l2.5 2.5" />
            </svg>
          </div>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>Pending Review</div>
            <div className={styles.statValue}>{pendingReviews.length}</div>
            <div className={styles.statSub}>Submissions to check</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: 'var(--info-light)', color: 'var(--info)' }}>
            <svg width="22" height="22" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 10l8 4 8-4" />
              <path d="M10 2l8 4-8 4-8-4 8-4z" />
            </svg>
          </div>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>Submission Rate</div>
            <div className={styles.statValue}>{submissionRate}%</div>
            <div className={styles.statSub}>{totalSubmitted}/{totalExpected} submitted</div>
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
            <div className={styles.statLabel}>Evaluated</div>
            <div className={styles.statValue}>{totalEvaluated}</div>
            <div className={styles.statSub}>Out of {totalSubmitted} submitted</div>
          </div>
        </div>
      </div>

      {/* ── Filter Tabs ── */}
      <div className={styles.filterRow}>
        {filters.map((f) => (
          <button
            key={f.key}
            className={`${styles.filterTab} ${activeFilter === f.key ? styles.filterTabActive : ''}`}
            onClick={() => setActiveFilter(f.key)}
          >
            {f.label}
            <span className={`${styles.filterCount} ${activeFilter !== f.key ? styles.filterCountInactive : ''}`}>
              {counts[f.key]}
            </span>
          </button>
        ))}
      </div>

      {/* ── Homework Cards ── */}
      <div className={styles.homeworkList}>
        {filtered.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>
              <svg width="48" height="48" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h12v14H4z" />
                <path d="M7 8h6M7 11h6M7 14h3" />
              </svg>
            </div>
            <div className={styles.emptyText}>No homework found for this filter.</div>
          </div>
        ) : (
          filtered.map((hw) => {
            const statusStyle = getStatusStyle(hw.status);
            const submittedPct = hw.totalStudents > 0 ? (hw.submitted / hw.totalStudents) * 100 : 0;
            const evaluatedPct = hw.totalStudents > 0 ? (hw.evaluated / hw.totalStudents) * 100 : 0;
            const pendingEval = hw.submitted - hw.evaluated;

            return (
              <div key={hw.id} className={styles.homeworkCard}>
                <div className={styles.homeworkTop}>
                  <div className={styles.homeworkInfo}>
                    <div className={styles.homeworkTitle}>{hw.title}</div>
                    <div className={styles.homeworkMeta}>
                      <span className={styles.metaItem}>
                        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="2" y="3" width="16" height="14" rx="2" />
                          <path d="M2 7h16" />
                        </svg>
                        Class {hw.class}-{hw.section}
                      </span>
                      <span className={styles.metaItem}>
                        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="3" width="14" height="14" rx="2" />
                          <path d="M3 7h14" />
                          <path d="M7 2v2M13 2v2" />
                        </svg>
                        Assigned: {formatDate(hw.assignedDate)}
                      </span>
                      <span className={styles.metaItem}>
                        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="10" cy="10" r="8" />
                          <path d="M10 6v4l2.5 2.5" />
                        </svg>
                        Due: {formatDate(hw.dueDate)}
                      </span>
                    </div>
                  </div>
                  <span
                    className={styles.statusBadge}
                    style={{ background: statusStyle.bg, color: statusStyle.text }}
                  >
                    {statusStyle.label}
                  </span>
                </div>

                {/* Progress */}
                <div className={styles.progressSection}>
                  <div className={styles.progressHeader}>
                    <span className={styles.progressLabel}>Submission &amp; Evaluation Progress</span>
                    <span className={styles.progressValue}>
                      {hw.submitted}/{hw.totalStudents} submitted &middot; {hw.evaluated} evaluated
                    </span>
                  </div>
                  <div className={styles.progressBar}>
                    <div className={styles.progressEvaluated} style={{ width: `${evaluatedPct}%` }} />
                    <div className={styles.progressSubmitted} style={{ width: `${submittedPct - evaluatedPct}%` }} />
                  </div>
                  <div className={styles.progressLegend}>
                    <span className={styles.legendItem}>
                      <span className={styles.legendDot} style={{ background: 'var(--success)' }} />
                      Evaluated ({hw.evaluated})
                    </span>
                    <span className={styles.legendItem}>
                      <span className={styles.legendDot} style={{ background: 'var(--primary)' }} />
                      Submitted ({hw.submitted - hw.evaluated})
                    </span>
                    <span className={styles.legendItem}>
                      <span className={styles.legendDot} style={{ background: 'var(--gray-100)' }} />
                      Not Submitted ({hw.totalStudents - hw.submitted})
                    </span>
                  </div>
                </div>

                {/* Bottom */}
                <div className={styles.homeworkBottom}>
                  <div className={styles.statsChips}>
                    <span className={styles.chip} style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
                      <svg width="12" height="12" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="7" cy="6" r="3" /><path d="M2 16c0-3 2.5-5 5-5s5 2 5 5" /></svg>
                      {hw.totalStudents} students
                    </span>
                    {pendingEval > 0 && (
                      <span className={styles.chip} style={{ background: 'var(--warning-light)', color: 'var(--warning-dark)' }}>
                        {pendingEval} to evaluate
                      </span>
                    )}
                    {hw.totalStudents - hw.submitted > 0 && hw.status !== 'completed' && (
                      <span className={styles.chip} style={{ background: 'var(--danger-light)', color: 'var(--danger)' }}>
                        {hw.totalStudents - hw.submitted} not submitted
                      </span>
                    )}
                  </div>
                  <div className={styles.actionBtns}>
                    <button className={styles.viewBtn}>View Details</button>
                    {pendingEval > 0 && (
                      <button className={styles.reviewBtn}>Review ({pendingEval})</button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ── Pending Submissions ── */}
      {pendingReviews.length > 0 && (
        <div>
          <h2 className={styles.sectionTitle}>Recent Submissions to Review</h2>
          <div className={styles.submissionsGrid}>
            {pendingReviews.map((sub) => (
              <div key={sub.id} className={styles.submissionCard}>
                <div className={styles.submissionAvatar}>
                  {getInitials(sub.studentName)}
                </div>
                <div className={styles.submissionInfo}>
                  <div className={styles.submissionName}>{sub.studentName}</div>
                  <div className={styles.submissionDetail}>
                    {sub.homeworkTitle} &middot; {sub.classSection}
                  </div>
                  <div className={styles.submissionTime}>{sub.submittedAt}</div>
                </div>
                <button className={styles.submissionAction}>Review</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Assign Homework Modal ── */}
      {showModal && (
        <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Assign New Homework</h3>
              <button className={styles.modalClose} onClick={() => setShowModal(false)}>
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M5 5l10 10M15 5L5 15" />
                </svg>
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Title</label>
                <input className={styles.formInput} type="text" placeholder="e.g. Essay on Independence Day" />
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Class &amp; Section</label>
                  <select className={styles.formSelect}>
                    <option value="">Select class</option>
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>
                        Class {c.class}-{c.section} ({c.totalStudents} students)
                      </option>
                    ))}
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Subject</label>
                  <select className={styles.formSelect}>
                    <option value="">Select subject</option>
                    <option value="English">English</option>
                  </select>
                </div>
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Assigned Date</label>
                  <input className={styles.formInput} type="date" defaultValue="2026-08-09" />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Due Date</label>
                  <input className={styles.formInput} type="date" />
                </div>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Description / Instructions</label>
                <textarea className={styles.formTextarea} placeholder="Write homework instructions here..." />
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.cancelBtn} onClick={() => setShowModal(false)}>Cancel</button>
              <button className={styles.submitBtn} onClick={() => setShowModal(false)}>Assign Homework</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
