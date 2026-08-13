'use client';

import { useState } from 'react';
import { getHomeworkList } from '@/hooks/use-data';
import { formatDate, getSubjectColor, getDaysUntil } from '@/lib/utils';
import { HOMEWORK_STATUS_LABELS } from '@/lib/constants';
import styles from './homework.module.css';

type TabFilter = 'all' | 'pending' | 'submitted' | 'evaluated' | 'overdue';

function getStatusStyle(status: string): { bg: string; text: string } {
  const map: Record<string, { bg: string; text: string }> = {
    pending: { bg: 'var(--warning-light)', text: 'var(--warning-dark)' },
    submitted: { bg: 'var(--primary-light)', text: 'var(--primary-dark)' },
    evaluated: { bg: 'var(--success-light)', text: 'var(--success-dark)' },
    overdue: { bg: 'var(--danger-light)', text: 'var(--danger-dark)' },
  };
  return map[status] || map.pending;
}

export default function HomeworkPage() {
  const [activeTab, setActiveTab] = useState<TabFilter>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [activeSubject, setActiveSubject] = useState<string>('All');

  const allHomework = getHomeworkList();

  const counts = {
    all: allHomework.length,
    pending: allHomework.filter((h) => h.status === 'pending').length,
    overdue: allHomework.filter((h) => h.status === 'overdue').length,
    submitted: allHomework.filter((h) => h.status === 'submitted').length,
    evaluated: allHomework.filter((h) => h.status === 'evaluated').length,
  };

  const subjects = ['All', ...Array.from(new Set(allHomework.map((h) => h.subject)))];

  let filtered = activeTab === 'all' ? allHomework : allHomework.filter((h) => h.status === activeTab);
  if (activeSubject !== 'All') {
    filtered = filtered.filter((h) => h.subject === activeSubject);
  }

  const tabs: { key: TabFilter; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'pending', label: 'Pending' },
    { key: 'overdue', label: 'Overdue' },
    { key: 'submitted', label: 'Submitted' },
    { key: 'evaluated', label: 'Evaluated' },
  ];

  return (
    <div className={styles.page}>
      {/* Stats */}
      <div className={styles.hwStats}>
        <div className={styles.hwStatCard}>
          <div className={styles.hwStatNum} style={{ color: 'var(--text-primary)' }}>{counts.all}</div>
          <div className={styles.hwStatLabel}>Total</div>
        </div>
        <div className={styles.hwStatCard}>
          <div className={styles.hwStatNum} style={{ color: 'var(--warning)' }}>{counts.pending}</div>
          <div className={styles.hwStatLabel}>Pending</div>
        </div>
        <div className={styles.hwStatCard}>
          <div className={styles.hwStatNum} style={{ color: 'var(--danger)' }}>{counts.overdue}</div>
          <div className={styles.hwStatLabel}>Overdue</div>
        </div>
        <div className={styles.hwStatCard}>
          <div className={styles.hwStatNum} style={{ color: 'var(--success)' }}>{counts.evaluated}</div>
          <div className={styles.hwStatLabel}>Evaluated</div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className={styles.filterBar}>
        <div className={styles.tabs}>
          {tabs.map((tab) => (
            <button
              key={tab.key}
              className={`${styles.tab} ${activeTab === tab.key ? styles.tabActive : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
              {counts[tab.key] > 0 && (
                <span
                  className={styles.tabCount}
                  style={{
                    background: activeTab === tab.key ? 'var(--primary-light)' : 'var(--gray-200)',
                    color: activeTab === tab.key ? 'var(--primary)' : 'var(--text-tertiary)',
                  }}
                >
                  {counts[tab.key]}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className={styles.subjectChips}>
          {subjects.map((subj) => (
            <button
              key={subj}
              className={`${styles.chip} ${activeSubject === subj ? styles.chipActive : ''}`}
              onClick={() => setActiveSubject(subj)}
            >
              {subj}
            </button>
          ))}
        </div>
      </div>

      {/* Homework List */}
      {filtered.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="8" y="6" width="32" height="36" rx="3" />
              <path d="M16 18h16M16 24h16M16 30h8" />
            </svg>
          </div>
          <div className={styles.emptyTitle}>No homework found</div>
          <div className={styles.emptyDesc}>There&apos;s no homework matching your current filters.</div>
        </div>
      ) : (
        <div className={styles.homeworkList}>
          {filtered.map((hw) => {
            const statusStyle = getStatusStyle(hw.status);
            const isExpanded = expandedId === hw.id;
            const daysLeft = getDaysUntil(hw.dueDate);
            const dueLabel = daysLeft === 0 ? 'Due today' : daysLeft === 1 ? 'Due tomorrow' : daysLeft < 0 ? `${Math.abs(daysLeft)}d overdue` : `${daysLeft}d left`;

            return (
              <div key={hw.id} className={styles.hwCard}>
                <div
                  className={styles.hwCardMain}
                  onClick={() => setExpandedId(isExpanded ? null : hw.id)}
                >
                  <div className={styles.hwSubjectBar} style={{ background: getSubjectColor(hw.subject) }} />
                  <div className={styles.hwContent}>
                    <div className={styles.hwTopRow}>
                      <div className={styles.hwTitle}>{hw.title}</div>
                      <span
                        className={styles.hwStatusBadge}
                        style={{ background: statusStyle.bg, color: statusStyle.text }}
                      >
                        {HOMEWORK_STATUS_LABELS[hw.status]}
                      </span>
                    </div>
                    <div className={styles.hwMeta}>
                      <span className={styles.hwMetaItem}>
                        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="8" cy="8" r="6" /><path d="M8 5v3l2 1" /></svg>
                        {hw.subject}
                      </span>
                      <span className={styles.hwMetaItem}>
                        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="3" width="12" height="11" rx="1.5" /><path d="M2 6h12" /><path d="M5 1.5v2M11 1.5v2" /></svg>
                        Due: {formatDate(hw.dueDate)}
                      </span>
                      <span className={styles.hwMetaItem} style={{ color: daysLeft < 0 ? 'var(--danger)' : daysLeft <= 1 ? 'var(--warning-dark)' : 'var(--text-tertiary)', fontWeight: daysLeft <= 1 ? 600 : 400 }}>
                        {dueLabel}
                      </span>
                      <span className={styles.hwMetaItem}>
                        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="8" cy="5" r="3" /><path d="M2 14c0-3.3 2.7-6 6-6s6 2.7 6 6" /></svg>
                        {hw.assignedBy}
                      </span>
                    </div>
                    <div className={styles.hwDescription}>{hw.description}</div>
                  </div>
                </div>

                {isExpanded && (
                  <div className={styles.hwDetails}>
                    <div className={styles.hwDetailsGrid}>
                      <div className={styles.hwDetailItem}>
                        <span className={styles.hwDetailLabel}>Assigned Date</span>
                        <span className={styles.hwDetailValue}>{formatDate(hw.assignedDate)}</span>
                      </div>
                      <div className={styles.hwDetailItem}>
                        <span className={styles.hwDetailLabel}>Due Date</span>
                        <span className={styles.hwDetailValue}>{formatDate(hw.dueDate)}</span>
                      </div>
                      <div className={styles.hwDetailItem}>
                        <span className={styles.hwDetailLabel}>Subject</span>
                        <span className={styles.hwDetailValue}>{hw.subject}</span>
                      </div>
                      <div className={styles.hwDetailItem}>
                        <span className={styles.hwDetailLabel}>Max Marks</span>
                        <span className={styles.hwDetailValue}>{hw.maxMarks || 'N/A'}</span>
                      </div>
                    </div>

                    {hw.status === 'evaluated' && hw.obtainedMarks !== undefined && (
                      <div className={styles.gradeCard}>
                        <div className={styles.gradeCircle}>{hw.grade}</div>
                        <div className={styles.gradeContent}>
                          <div className={styles.gradeScore}>{hw.obtainedMarks}/{hw.maxMarks} marks</div>
                          {hw.remarks && <div className={styles.gradeRemarks}>{hw.remarks}</div>}
                        </div>
                      </div>
                    )}

                    {(hw.status === 'pending' || hw.status === 'overdue') && (
                      <>
                        <div className={styles.uploadArea}>
                          <div className={styles.uploadIcon}>
                            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M16 20V8M16 8l-5 5M16 8l5 5" />
                              <path d="M4 22v4a2 2 0 002 2h20a2 2 0 002-2v-4" />
                            </svg>
                          </div>
                          <div className={styles.uploadText}>Click to upload or take a photo</div>
                          <div className={styles.uploadHint}>JPG, PNG, PDF up to 10 MB</div>
                        </div>
                        <button className={styles.submitBtn}>Submit Homework</button>
                      </>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
