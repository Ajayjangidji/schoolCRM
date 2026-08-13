'use client';

import { useState, useMemo } from 'react';
import { getTeacherNotices } from '@/hooks/use-teacher-data';
import { formatDate } from '@/lib/utils';
import type { TeacherNotice } from '@/hooks/use-teacher-data';
import styles from './notices.module.css';

type FilterType = 'all' | 'unread' | 'urgent' | 'high' | 'normal';

const FILTERS: { key: FilterType; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'unread', label: 'Unread' },
  { key: 'urgent', label: 'Urgent' },
  { key: 'high', label: 'Important' },
  { key: 'normal', label: 'General' },
];

const PRIORITY_ICON_COLORS: Record<string, { bg: string; color: string }> = {
  normal: { bg: '#e3f2fd', color: '#1565c0' },
  high: { bg: '#fff3e0', color: '#e65100' },
  urgent: { bg: '#ffebee', color: '#c62828' },
};

export default function TeacherNoticesPage() {
  const allNotices = getTeacherNotices();
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [showModal, setShowModal] = useState(false);
  const [readNotices, setReadNotices] = useState<Set<string>>(() => {
    return new Set(allNotices.filter((n) => n.isRead).map((n) => n.id));
  });

  const notices = useMemo(() => {
    let result = allNotices;
    switch (activeFilter) {
      case 'unread':
        result = result.filter((n) => !readNotices.has(n.id));
        break;
      case 'urgent':
        result = result.filter((n) => n.priority === 'urgent');
        break;
      case 'high':
        result = result.filter((n) => n.priority === 'high');
        break;
      case 'normal':
        result = result.filter((n) => n.priority === 'normal');
        break;
    }
    return result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [allNotices, activeFilter, readNotices]);

  const unreadCount = allNotices.filter((n) => !readNotices.has(n.id)).length;
  const urgentCount = allNotices.filter((n) => n.priority === 'urgent').length;

  function markAsRead(id: string) {
    setReadNotices((prev) => new Set([...prev, id]));
  }

  function getFilterCount(key: FilterType): number {
    switch (key) {
      case 'all': return allNotices.length;
      case 'unread': return allNotices.filter((n) => !readNotices.has(n.id)).length;
      case 'urgent': return allNotices.filter((n) => n.priority === 'urgent').length;
      case 'high': return allNotices.filter((n) => n.priority === 'high').length;
      case 'normal': return allNotices.filter((n) => n.priority === 'normal').length;
    }
  }

  function getPriorityCard(priority: string): string {
    switch (priority) {
      case 'urgent': return styles.priorityUrgent;
      case 'high': return styles.priorityHigh;
      default: return styles.priorityNormal;
    }
  }

  function getPriorityBadge(priority: string): string {
    switch (priority) {
      case 'urgent': return styles.badgeUrgent;
      case 'high': return styles.badgeHigh;
      default: return styles.badgeNormal;
    }
  }

  return (
    <div className={styles.page}>
      {/* ── Header ── */}
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Notices & Announcements</h1>
        <button className={styles.createBtn} onClick={() => setShowModal(true)}>
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M10 4v12M4 10h12" />
          </svg>
          Create Notice
        </button>
      </div>

      {/* ── Stats ── */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: '#e3f2fd', color: '#1565c0' }}>
            <svg width="22" height="22" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 2a6 6 0 016 6c0 3.5 1 5.5 2 7H2c1-1.5 2-3.5 2-7a6 6 0 016-6z" />
              <path d="M8 15a2 2 0 004 0" />
            </svg>
          </div>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>Total Notices</div>
            <div className={styles.statValue}>{allNotices.length}</div>
            <div className={styles.statSub}>All announcements</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: unreadCount > 0 ? '#fff3e0' : '#e8f5e9', color: unreadCount > 0 ? '#e65100' : '#2e7d32' }}>
            <svg width="22" height="22" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="10" cy="10" r="8" />
              <circle cx="10" cy="10" r="3" fill="currentColor" opacity="0.3" />
            </svg>
          </div>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>Unread</div>
            <div className={styles.statValue}>{unreadCount}</div>
            <div className={styles.statSub}>{unreadCount > 0 ? 'Need your attention' : 'All caught up!'}</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: '#ffebee', color: '#c62828' }}>
            <svg width="22" height="22" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 3l7 13H3z" />
              <path d="M10 9v3M10 14.5v.5" />
            </svg>
          </div>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>Urgent</div>
            <div className={styles.statValue}>{urgentCount}</div>
            <div className={styles.statSub}>Critical notices</div>
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

      {/* ── Notice Cards ── */}
      {notices.length > 0 ? (
        <div className={styles.noticeList}>
          {notices.map((notice) => {
            const isRead = readNotices.has(notice.id);
            const iconColor = PRIORITY_ICON_COLORS[notice.priority] || PRIORITY_ICON_COLORS.normal;
            return (
              <div
                key={notice.id}
                className={`${styles.noticeCard} ${getPriorityCard(notice.priority)} ${!isRead ? styles.noticeCardUnread : ''}`}
              >
                <div className={styles.noticeHeader}>
                  <div className={styles.noticeHeaderLeft}>
                    <div className={styles.noticeIcon} style={{ background: iconColor.bg, color: iconColor.color }}>
                      {notice.priority === 'urgent' ? (
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M10 3l7 13H3z" />
                          <path d="M10 9v3M10 14.5v.5" />
                        </svg>
                      ) : notice.priority === 'high' ? (
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="10" cy="10" r="8" />
                          <path d="M10 6v5M10 13.5v.5" />
                        </svg>
                      ) : (
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M10 2a6 6 0 016 6c0 3.5 1 5.5 2 7H2c1-1.5 2-3.5 2-7a6 6 0 016-6z" />
                          <path d="M8 15a2 2 0 004 0" />
                        </svg>
                      )}
                    </div>
                    <div className={styles.noticeInfo}>
                      <div className={styles.noticeTitle}>
                        {!isRead && <span className={styles.unreadDot} />}
                        {notice.title}
                      </div>
                      <div className={styles.noticeMeta}>
                        <span className={styles.metaItem}>
                          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="4" width="14" height="12" rx="1" />
                            <path d="M7 2v4M13 2v4M3 8h14" />
                          </svg>
                          {formatDate(notice.date)}
                        </span>
                        <span className={styles.metaItem}>
                          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="10" cy="10" r="8" />
                            <path d="M10 5v5l3 3" />
                          </svg>
                          {isRead ? 'Read' : 'Unread'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <span className={`${styles.priorityBadge} ${getPriorityBadge(notice.priority)}`}>
                    {notice.priority}
                  </span>
                </div>

                <div className={styles.noticeContent}>{notice.content}</div>

                <div className={styles.noticeActions}>
                  {!isRead ? (
                    <button className={styles.readBtn} onClick={() => markAsRead(notice.id)}>
                      Mark as Read
                    </button>
                  ) : (
                    <span className={styles.readLabel}>Read</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className={styles.emptyState}>No notices found for this filter.</div>
      )}

      {/* ── Create Notice Modal ── */}
      {showModal && (
        <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Create Notice</h2>
              <button className={styles.modalClose} onClick={() => setShowModal(false)}>
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M5 5l10 10M15 5L5 15" />
                </svg>
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Title</label>
                <input className={styles.formInput} type="text" placeholder="Notice title" />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Priority</label>
                <select className={styles.formSelect}>
                  <option value="normal">Normal</option>
                  <option value="high">High / Important</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Content</label>
                <textarea className={styles.formTextarea} placeholder="Write your notice content here..." rows={5} />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Target Audience</label>
                <select className={styles.formSelect}>
                  <option value="all">All Classes</option>
                  <option value="8-A">Class 8-A</option>
                  <option value="8-B">Class 8-B</option>
                  <option value="9-A">Class 9-A</option>
                  <option value="7-A">Class 7-A</option>
                </select>
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.cancelBtn} onClick={() => setShowModal(false)}>Cancel</button>
              <button className={styles.submitBtn} onClick={() => setShowModal(false)}>Publish Notice</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
