'use client';

import { useState } from 'react';
import { getNotices } from '@/hooks/use-data';
import { formatDate, getRelativeTime } from '@/lib/utils';
import { NOTICE_CATEGORY_LABELS } from '@/lib/constants';
import styles from './notices.module.css';

type CategoryFilter = 'all' | 'holiday' | 'exam' | 'event' | 'circular' | 'fee' | 'general';

function getCategoryStyle(category: string): { bg: string; text: string } {
  const map: Record<string, { bg: string; text: string }> = {
    holiday: { bg: 'var(--success-light)', text: 'var(--success-dark)' },
    exam: { bg: 'var(--danger-light)', text: 'var(--danger-dark)' },
    event: { bg: 'var(--primary-light)', text: 'var(--primary-dark)' },
    circular: { bg: 'var(--info-light)', text: 'var(--info-dark)' },
    fee: { bg: 'var(--warning-light)', text: 'var(--warning-dark)' },
    general: { bg: 'var(--gray-100)', text: 'var(--gray-600)' },
  };
  return map[category] || map.general;
}

function getPriorityStyle(priority: string): { bg: string; text: string } {
  const map: Record<string, { bg: string; text: string }> = {
    urgent: { bg: 'var(--danger-light)', text: 'var(--danger)' },
    high: { bg: 'var(--warning-light)', text: 'var(--warning-dark)' },
    normal: { bg: 'var(--gray-100)', text: 'var(--gray-500)' },
  };
  return map[priority] || map.normal;
}

export default function NoticesPage() {
  const allNotices = getNotices();
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [acknowledged, setAcknowledged] = useState<Set<string>>(
    new Set(allNotices.filter((n) => n.isAcknowledged).map((n) => n.id))
  );

  const categories: { key: CategoryFilter; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'holiday', label: 'Holiday' },
    { key: 'exam', label: 'Exam' },
    { key: 'event', label: 'Event' },
    { key: 'circular', label: 'Circular' },
    { key: 'fee', label: 'Fee' },
    { key: 'general', label: 'General' },
  ];

  const filtered = activeCategory === 'all'
    ? allNotices
    : allNotices.filter((n) => n.category === activeCategory);

  const pinnedNotices = filtered.filter((n) => n.isPinned);
  const regularNotices = filtered.filter((n) => !n.isPinned);

  const unreadCount = allNotices.filter((n) => !n.isRead).length;
  const pendingAck = allNotices.filter((n) => n.requiresAcknowledgement && !acknowledged.has(n.id)).length;

  return (
    <div className={styles.page}>
      {/* Stats */}
      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <div className={styles.statNum}>{allNotices.length}</div>
          <div className={styles.statLabel}>Total Notices</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statNum} style={{ color: 'var(--primary)' }}>{unreadCount}</div>
          <div className={styles.statLabel}>Unread</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statNum} style={{ color: 'var(--warning)' }}>{pendingAck}</div>
          <div className={styles.statLabel}>Pending Acknowledgement</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statNum} style={{ color: 'var(--success)' }}>{pinnedNotices.length}</div>
          <div className={styles.statLabel}>Pinned</div>
        </div>
      </div>

      {/* Category Filter */}
      <div className={styles.filterBar}>
        <div className={styles.tabs}>
          {categories.map((cat) => (
            <button
              key={cat.key}
              className={`${styles.tab} ${activeCategory === cat.key ? styles.tabActive : ''}`}
              onClick={() => setActiveCategory(cat.key)}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Pinned Section */}
      {pinnedNotices.length > 0 && (
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9.5 2L13 5.5 8.5 10H5V6.5L9.5 2z" />
              <path d="M5 10L2 13" />
            </svg>
            Pinned Notices
          </div>
          <div className={styles.noticeList}>
            {pinnedNotices.map((notice) => {
              const catStyle = getCategoryStyle(notice.category);
              const prioStyle = getPriorityStyle(notice.priority);
              const isExpanded = expandedId === notice.id;
              const isAcked = acknowledged.has(notice.id);

              return (
                <div
                  key={notice.id}
                  className={`${styles.noticeCard} ${!notice.isRead ? styles.noticeUnread : ''} ${styles.noticePinned}`}
                >
                  <div
                    className={styles.noticeMain}
                    onClick={() => setExpandedId(isExpanded ? null : notice.id)}
                  >
                    <div className={styles.noticeTop}>
                      <div className={styles.noticeTags}>
                        <span className={styles.categoryBadge} style={{ background: catStyle.bg, color: catStyle.text }}>
                          {NOTICE_CATEGORY_LABELS[notice.category]}
                        </span>
                        {notice.priority !== 'normal' && (
                          <span className={styles.priorityBadge} style={{ background: prioStyle.bg, color: prioStyle.text }}>
                            {notice.priority === 'urgent' ? 'Urgent' : 'Important'}
                          </span>
                        )}
                        {!notice.isRead && <span className={styles.unreadDot} />}
                      </div>
                      <span className={styles.noticeDate}>{getRelativeTime(notice.postedDate)}</span>
                    </div>
                    <div className={styles.noticeTitle}>{notice.title}</div>
                    {!isExpanded && (
                      <div className={styles.noticePreview}>
                        {notice.content.length > 120 ? notice.content.slice(0, 120) + '...' : notice.content}
                      </div>
                    )}
                    <div className={styles.expandHint}>
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d={isExpanded ? 'M2 8l4-4 4 4' : 'M2 4l4 4 4-4'} />
                      </svg>
                      {isExpanded ? 'Show less' : 'Read more'}
                    </div>
                  </div>

                  {isExpanded && (
                    <div className={styles.noticeExpanded}>
                      <div className={styles.noticeContent}>{notice.content}</div>
                      <div className={styles.noticeMeta}>
                        <span>Posted: {formatDate(notice.postedDate)}</span>
                        {notice.expiryDate && <span>Expires: {formatDate(notice.expiryDate)}</span>}
                      </div>
                      {notice.requiresAcknowledgement && (
                        <div className={styles.ackSection}>
                          {isAcked ? (
                            <div className={styles.ackDone}>
                              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 8l3.5 3.5L13 4.5" /></svg>
                              Acknowledged
                            </div>
                          ) : (
                            <button
                              className={styles.ackBtn}
                              onClick={(e) => {
                                e.stopPropagation();
                                setAcknowledged((prev) => new Set(prev).add(notice.id));
                              }}
                            >
                              Acknowledge
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Regular Notices */}
      {regularNotices.length > 0 && (
        <div className={styles.section}>
          {pinnedNotices.length > 0 && (
            <div className={styles.sectionHeader}>All Notices</div>
          )}
          <div className={styles.noticeList}>
            {regularNotices.map((notice) => {
              const catStyle = getCategoryStyle(notice.category);
              const prioStyle = getPriorityStyle(notice.priority);
              const isExpanded = expandedId === notice.id;
              const isAcked = acknowledged.has(notice.id);

              return (
                <div
                  key={notice.id}
                  className={`${styles.noticeCard} ${!notice.isRead ? styles.noticeUnread : ''}`}
                >
                  <div
                    className={styles.noticeMain}
                    onClick={() => setExpandedId(isExpanded ? null : notice.id)}
                  >
                    <div className={styles.noticeTop}>
                      <div className={styles.noticeTags}>
                        <span className={styles.categoryBadge} style={{ background: catStyle.bg, color: catStyle.text }}>
                          {NOTICE_CATEGORY_LABELS[notice.category]}
                        </span>
                        {notice.priority !== 'normal' && (
                          <span className={styles.priorityBadge} style={{ background: prioStyle.bg, color: prioStyle.text }}>
                            {notice.priority === 'urgent' ? 'Urgent' : 'Important'}
                          </span>
                        )}
                        {!notice.isRead && <span className={styles.unreadDot} />}
                      </div>
                      <span className={styles.noticeDate}>{getRelativeTime(notice.postedDate)}</span>
                    </div>
                    <div className={styles.noticeTitle}>{notice.title}</div>
                    {!isExpanded && (
                      <div className={styles.noticePreview}>
                        {notice.content.length > 120 ? notice.content.slice(0, 120) + '...' : notice.content}
                      </div>
                    )}
                    <div className={styles.expandHint}>
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d={isExpanded ? 'M2 8l4-4 4 4' : 'M2 4l4 4 4-4'} />
                      </svg>
                      {isExpanded ? 'Show less' : 'Read more'}
                    </div>
                  </div>

                  {isExpanded && (
                    <div className={styles.noticeExpanded}>
                      <div className={styles.noticeContent}>{notice.content}</div>
                      <div className={styles.noticeMeta}>
                        <span>Posted: {formatDate(notice.postedDate)}</span>
                        {notice.expiryDate && <span>Expires: {formatDate(notice.expiryDate)}</span>}
                      </div>
                      {notice.requiresAcknowledgement && (
                        <div className={styles.ackSection}>
                          {isAcked ? (
                            <div className={styles.ackDone}>
                              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 8l3.5 3.5L13 4.5" /></svg>
                              Acknowledged
                            </div>
                          ) : (
                            <button
                              className={styles.ackBtn}
                              onClick={(e) => {
                                e.stopPropagation();
                                setAcknowledged((prev) => new Set(prev).add(notice.id));
                              }}
                            >
                              Acknowledge
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {filtered.length === 0 && (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M24 6a12 12 0 0112 12c0 7-2 11-4 14H16c-2-3-4-7-4-14a12 12 0 0112-12z" />
              <path d="M18 32a6 6 0 0012 0" />
            </svg>
          </div>
          <div className={styles.emptyTitle}>No notices found</div>
          <div className={styles.emptyDesc}>There are no notices in this category.</div>
        </div>
      )}
    </div>
  );
}
