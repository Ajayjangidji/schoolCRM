'use client';

import { useState } from 'react';
import { getAdminNotices } from '@/hooks/use-admin-data';
import type { AdminNotice } from '@/hooks/use-admin-data';
import { formatDate } from '@/lib/utils';
import styles from './notices.module.css';

type FilterType = 'all' | 'urgent' | 'high' | 'normal' | 'draft';

export default function AdminNoticesPage() {
  const notices = getAdminNotices();

  const [filter, setFilter] = useState<FilterType>('all');
  const [search, setSearch] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [scheduleEnabled, setScheduleEnabled] = useState(false);
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('09:00');

  const published = notices.filter((n) => n.isPublished);
  const drafts = notices.filter((n) => !n.isPublished);
  const urgentCount = notices.filter((n) => n.priority === 'urgent').length;
  const totalViews = published.reduce((s, n) => s + n.views, 0);

  const filtered = notices.filter((n) => {
    if (filter === 'draft') return !n.isPublished;
    if (filter !== 'all' && n.priority !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      return n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q) || n.createdBy.toLowerCase().includes(q);
    }
    return true;
  });

  function getPriorityClass(priority: string) {
    switch (priority) {
      case 'urgent': return styles.priorityUrgent;
      case 'high': return styles.priorityHigh;
      default: return styles.priorityNormal;
    }
  }

  function getPriorityBadgeClass(priority: string) {
    switch (priority) {
      case 'urgent': return styles.badgeUrgent;
      case 'high': return styles.badgeHigh;
      default: return styles.badgeNormal;
    }
  }

  function getPriorityIconBg(priority: string) {
    switch (priority) {
      case 'urgent': return { background: '#ffebee', color: '#c62828' };
      case 'high': return { background: '#fff3e0', color: '#e65100' };
      default: return { background: '#e3f2fd', color: '#1565c0' };
    }
  }

  const AUDIENCE_LABELS: Record<string, string> = {
    all: 'Everyone',
    parents: 'Parents',
    teachers: 'Teachers',
    students: 'Students',
    staff: 'Staff',
  };

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Announcements & Notices</h1>
        <button className={styles.createBtn} onClick={() => setShowCreateModal(true)}>
          <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M10 4v12M4 10h12" />
          </svg>
          Create Notice
        </button>
      </div>

      {/* Stats */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: '#ede9fe', color: '#7c3aed' }}>
            <svg width="22" height="22" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 3h12v14H4z" />
              <path d="M7 7h6M7 10h4" />
            </svg>
          </div>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>Total Notices</div>
            <div className={styles.statValue}>{notices.length}</div>
            <div className={styles.statSub}>{published.length} published</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: '#ffebee', color: '#c62828' }}>
            <svg width="22" height="22" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 2v6M10 14h.01" />
              <circle cx="10" cy="10" r="8" />
            </svg>
          </div>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>Urgent</div>
            <div className={styles.statValue}>{urgentCount}</div>
            <div className={styles.statSub}>Require attention</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: '#fff3e0', color: '#e65100' }}>
            <svg width="22" height="22" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h12v2H4zM4 9h12v2H4zM4 14h8v2H4z" />
            </svg>
          </div>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>Drafts</div>
            <div className={styles.statValue}>{drafts.length}</div>
            <div className={styles.statSub}>Unpublished</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: '#e3f2fd', color: '#1565c0' }}>
            <svg width="22" height="22" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="10" cy="8" r="3" />
              <path d="M3 18c0-3.3 3.1-6 7-6s7 2.7 7 6" />
            </svg>
          </div>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>Total Views</div>
            <div className={styles.statValue}>{totalViews.toLocaleString('en-IN')}</div>
            <div className={styles.statSub}>Across all notices</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className={styles.filtersBar}>
        <div className={styles.filterTabs}>
          {(['all', 'urgent', 'high', 'normal', 'draft'] as FilterType[]).map((f) => (
            <button key={f} className={`${styles.filterTab} ${filter === f ? styles.filterTabActive : ''}`} onClick={() => setFilter(f)}>
              {f === 'all' ? `All (${notices.length})` : f === 'draft' ? `Drafts (${drafts.length})` : `${f.charAt(0).toUpperCase() + f.slice(1)}`}
            </button>
          ))}
        </div>
        <div className={styles.searchBox}>
          <svg className={styles.searchIcon} width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="9" cy="9" r="6" />
            <path d="M13.5 13.5L17 17" />
          </svg>
          <input className={styles.searchInput} type="text" placeholder="Search notices..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      {/* Notice List */}
      <div className={styles.noticeList}>
        {filtered.length === 0 && <div className={styles.emptyState}>No notices found.</div>}
        {filtered.map((notice) => (
          <div key={notice.id} className={`${styles.noticeCard} ${getPriorityClass(notice.priority)} ${!notice.isPublished ? styles.draftCard : ''}`}>
            <div className={styles.noticeHeader}>
              <div className={styles.noticeHeaderLeft}>
                <div className={styles.noticeIcon} style={getPriorityIconBg(notice.priority)}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10 2a4 4 0 0 1 4 4c0 4 2 5 2 5H4s2-1 2-5a4 4 0 0 1 4-4" />
                    <path d="M8.5 15a1.5 1.5 0 0 0 3 0" />
                  </svg>
                </div>
                <div className={styles.noticeInfo}>
                  <div className={styles.noticeTitle}>{notice.title}</div>
                  <div className={styles.noticeMeta}>
                    <span className={styles.metaItem}>
                      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="10" cy="7" r="3" /><path d="M4 18c0-3 2.7-5.5 6-5.5s6 2.5 6 5.5" /></svg>
                      {notice.createdBy}
                    </span>
                    <span className={styles.metaItem}>
                      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="4" width="14" height="12" rx="1" /><path d="M7 2v4M13 2v4M3 8h14" /></svg>
                      {formatDate(notice.createdAt)}
                    </span>
                    <span className={styles.metaItem}>
                      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="10" cy="10" r="3" /><path d="M2 10c2-4 5-6 8-6s6 2 8 6c-2 4-5 6-8 6s-6-2-8-6" /></svg>
                      {AUDIENCE_LABELS[notice.audience] || notice.audience}
                    </span>
                  </div>
                </div>
              </div>
              <div className={styles.badgeRow}>
                <span className={`${styles.priorityBadge} ${getPriorityBadgeClass(notice.priority)}`}>{notice.priority}</span>
                {!notice.isPublished && <span className={styles.draftBadge}>Draft</span>}
              </div>
            </div>

            <div className={styles.noticeContent}>{notice.content}</div>

            <div className={styles.noticeFooter}>
              <div className={styles.footerLeft}>
                {notice.isPublished && (
                  <span className={styles.footerItem}>
                    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="10" cy="10" r="3" /><path d="M2 10c2-4 5-6 8-6s6 2 8 6c-2 4-5 6-8 6s-6-2-8-6" /></svg>
                    {notice.views} views
                  </span>
                )}
                {notice.attachments > 0 && (
                  <span className={styles.footerItem}>
                    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 5l-5.5 5.5a2 2 0 1 0 2.8 2.8L17 7.5a4 4 0 0 0-5.6-5.6L5 8.5a6 6 0 0 0 8.5 8.5l4-4" /></svg>
                    {notice.attachments} file{notice.attachments > 1 ? 's' : ''}
                  </span>
                )}
              </div>
              <div className={styles.actionBtns}>
                <button className={styles.actionBtn} onClick={() => setShowCreateModal(true)}>Edit</button>
                {!notice.isPublished && <button className={`${styles.actionBtn} ${styles.publishBtn}`} onClick={() => alert('Notice published successfully!')}>Publish</button>}
                <button className={styles.actionBtn} onClick={() => alert('Notice deleted.')}>Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Notice Modal */}
      {showCreateModal && (
        <div className={styles.modalOverlay} onClick={() => setShowCreateModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Create New Notice</h2>
              <button className={styles.modalClose} onClick={() => setShowCreateModal(false)}>
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 5l10 10M15 5L5 15" /></svg>
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Title</label>
                <input className={styles.formInput} type="text" placeholder="Notice title" />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Content</label>
                <textarea className={styles.formTextarea} placeholder="Write your notice here..." />
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Priority</label>
                  <select className={styles.formSelect}>
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Audience</label>
                  <select className={styles.formSelect}>
                    <option value="all">Everyone</option>
                    <option value="parents">Parents</option>
                    <option value="teachers">Teachers</option>
                    <option value="students">Students</option>
                    <option value="staff">Staff</option>
                  </select>
                </div>
              </div>

              {/* Schedule Section */}
              <div className={styles.scheduleSection}>
                <label className={styles.scheduleToggle}>
                  <input
                    type="checkbox"
                    checked={scheduleEnabled}
                    onChange={(e) => setScheduleEnabled(e.target.checked)}
                    className={styles.scheduleCheckbox}
                  />
                  <div className={styles.scheduleToggleTrack}>
                    <div className={styles.scheduleToggleThumb} />
                  </div>
                  <div className={styles.scheduleToggleLabel}>
                    <span className={styles.formLabel} style={{ marginBottom: 0 }}>Schedule for later</span>
                    <span className={styles.scheduleHint}>Set a future date & time to auto-publish</span>
                  </div>
                </label>
                {scheduleEnabled && (
                  <div className={styles.scheduleFields}>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>
                        <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" style={{ verticalAlign: '-2px', marginRight: '4px' }}>
                          <rect x="3" y="4" width="14" height="12" rx="1" />
                          <path d="M7 2v4M13 2v4M3 8h14" />
                        </svg>
                        Publish Date
                      </label>
                      <input
                        className={styles.formInput}
                        type="date"
                        value={scheduleDate}
                        onChange={(e) => setScheduleDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>
                        <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" style={{ verticalAlign: '-2px', marginRight: '4px' }}>
                          <circle cx="10" cy="10" r="7" />
                          <path d="M10 6v4l3 2" />
                        </svg>
                        Publish Time
                      </label>
                      <input
                        className={styles.formInput}
                        type="time"
                        value={scheduleTime}
                        onChange={(e) => setScheduleTime(e.target.value)}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.cancelBtn} onClick={() => { setShowCreateModal(false); setScheduleEnabled(false); setScheduleDate(''); setScheduleTime('09:00'); }}>Cancel</button>
              <button className={styles.draftSaveBtn} onClick={() => { setShowCreateModal(false); setScheduleEnabled(false); setScheduleDate(''); setScheduleTime('09:00'); }}>Save as Draft</button>
              {scheduleEnabled ? (
                <button className={styles.scheduleBtn} onClick={() => { alert(`Notice scheduled for ${scheduleDate} at ${scheduleTime}`); setShowCreateModal(false); setScheduleEnabled(false); setScheduleDate(''); setScheduleTime('09:00'); }}>
                  <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <circle cx="10" cy="10" r="7" />
                    <path d="M10 6v4l3 2" />
                  </svg>
                  Schedule Publish
                </button>
              ) : (
                <button className={styles.submitBtn} onClick={() => { setShowCreateModal(false); setScheduleEnabled(false); }}>Publish Now</button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
