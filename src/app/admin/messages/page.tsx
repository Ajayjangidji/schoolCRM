'use client';

import { useState } from 'react';
import { getMessages } from '@/hooks/use-admin-data';
import { formatDate } from '@/lib/utils';
import styles from './messages.module.css';

type FilterType = 'all' | 'announcement' | 'circular' | 'sms' | 'email' | 'push';

const TYPE_STYLES: Record<string, { cardCls: string; badgeCls: string; label: string; bg: string; color: string }> = {
  announcement: { cardCls: styles.typeAnnouncement, badgeCls: styles.badgeAnnouncement, label: 'Announcement', bg: '#ede9fe', color: '#7c3aed' },
  circular: { cardCls: styles.typeCircular, badgeCls: styles.badgeCircular, label: 'Circular', bg: '#e3f2fd', color: '#1565c0' },
  sms: { cardCls: styles.typeSms, badgeCls: styles.badgeSms, label: 'SMS', bg: '#e8f5e9', color: '#2e7d32' },
  email: { cardCls: styles.typeEmail, badgeCls: styles.badgeEmail, label: 'Email', bg: '#fff3e0', color: '#e65100' },
  push: { cardCls: styles.typePush, badgeCls: styles.badgePush, label: 'Push', bg: '#e0f2f1', color: '#00897b' },
};

const STATUS_STYLES: Record<string, { cls: string; label: string }> = {
  sent: { cls: styles.statusSent, label: 'Sent' },
  draft: { cls: styles.statusDraft, label: 'Draft' },
  scheduled: { cls: styles.statusScheduled, label: 'Scheduled' },
  failed: { cls: styles.statusFailed, label: 'Failed' },
};

export default function AdminMessagesPage() {
  const messages = getMessages();
  const [filter, setFilter] = useState<FilterType>('all');
  const [search, setSearch] = useState('');
  const [showComposeModal, setShowComposeModal] = useState(false);

  const sentCount = messages.filter((m) => m.status === 'sent').length;
  const totalRecipients = messages.filter((m) => m.status === 'sent').reduce((s, m) => s + m.recipients, 0);
  const totalRead = messages.filter((m) => m.status === 'sent').reduce((s, m) => s + m.readCount, 0);
  const avgReadRate = totalRecipients > 0 ? Math.round((totalRead / totalRecipients) * 100) : 0;

  const filtered = messages.filter((m) => {
    if (filter !== 'all' && m.type !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      return m.subject.toLowerCase().includes(q) || m.content.toLowerCase().includes(q) || m.sentBy.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Communication Center</h1>
        <button className={styles.composeBtn} onClick={() => setShowComposeModal(true)}>
          <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M10 4v12M4 10h12" /></svg>
          Compose Message
        </button>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: '#ede9fe', color: '#7c3aed' }}>
            <svg width="22" height="22" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 4h14a1 1 0 011 1v8a1 1 0 01-1 1H6l-3 3V5a1 1 0 011-1z" /></svg>
          </div>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>Total Messages</div>
            <div className={styles.statValue}>{messages.length}</div>
            <div className={styles.statSub}>{sentCount} sent</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: '#e3f2fd', color: '#1565c0' }}>
            <svg width="22" height="22" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="10" cy="7" r="3" /><path d="M4 18c0-3.3 2.7-6 6-6s6 2.7 6 6" /></svg>
          </div>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>Recipients</div>
            <div className={styles.statValue}>{totalRecipients.toLocaleString('en-IN')}</div>
            <div className={styles.statSub}>Total reached</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: '#e8f5e9', color: '#2e7d32' }}>
            <svg width="22" height="22" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 10l2.5 2.5L14 7" /><circle cx="10" cy="10" r="8" /></svg>
          </div>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>Avg Read Rate</div>
            <div className={styles.statValue}>{avgReadRate}%</div>
            <div className={styles.statSub}>Across sent messages</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: '#fff3e0', color: '#e65100' }}>
            <svg width="22" height="22" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="4" width="14" height="12" rx="1" /><path d="M7 2v4M13 2v4M3 8h14" /></svg>
          </div>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>Scheduled</div>
            <div className={styles.statValue}>{messages.filter((m) => m.status === 'scheduled').length}</div>
            <div className={styles.statSub}>Pending delivery</div>
          </div>
        </div>
      </div>

      <div className={styles.filtersBar}>
        <div className={styles.filterTabs}>
          {(['all', 'announcement', 'circular', 'sms', 'email', 'push'] as FilterType[]).map((f) => (
            <button key={f} className={`${styles.filterTab} ${filter === f ? styles.filterTabActive : ''}`} onClick={() => setFilter(f)}>
              {f === 'all' ? `All (${messages.length})` : TYPE_STYLES[f]?.label || f}
            </button>
          ))}
        </div>
        <div className={styles.searchBox}>
          <svg className={styles.searchIcon} width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="9" cy="9" r="6" /><path d="M13.5 13.5L17 17" /></svg>
          <input className={styles.searchInput} type="text" placeholder="Search messages..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      <div className={styles.messageList}>
        {filtered.length === 0 && <div className={styles.emptyState}>No messages found.</div>}
        {filtered.map((msg) => {
          const ts = TYPE_STYLES[msg.type] || TYPE_STYLES.announcement;
          const ss = STATUS_STYLES[msg.status] || STATUS_STYLES.sent;
          const readPct = msg.recipients > 0 ? Math.round((msg.readCount / msg.recipients) * 100) : 0;
          const readCls = readPct >= 80 ? styles.readHigh : readPct >= 50 ? styles.readMed : styles.readLow;
          return (
            <div key={msg.id} className={`${styles.messageCard} ${ts.cardCls} ${msg.status === 'draft' ? styles.draftCard : ''}`}>
              <div className={styles.messageHeader}>
                <div className={styles.messageLeft}>
                  <div className={styles.messageIcon} style={{ background: ts.bg, color: ts.color }}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 4h14a1 1 0 011 1v8a1 1 0 01-1 1H6l-3 3V5a1 1 0 011-1z" /></svg>
                  </div>
                  <div className={styles.messageInfo}>
                    <div className={styles.messageSubject}>{msg.subject}</div>
                    <div className={styles.messageMeta}>
                      <span className={styles.metaItem}>
                        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="10" cy="7" r="3" /><path d="M4 18c0-3 2.7-5.5 6-5.5s6 2.5 6 5.5" /></svg>
                        {msg.sentBy}
                      </span>
                      {msg.sentAt && (
                        <span className={styles.metaItem}>
                          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="4" width="14" height="12" rx="1" /><path d="M7 2v4M13 2v4M3 8h14" /></svg>
                          {formatDate(msg.sentAt)}
                        </span>
                      )}
                      <span className={styles.metaItem}>{msg.audience}</span>
                    </div>
                  </div>
                </div>
                <div className={styles.badgeRow}>
                  <span className={`${styles.typeBadge} ${ts.badgeCls}`}>{ts.label}</span>
                  <span className={`${styles.statusBadge} ${ss.cls}`}>{ss.label}</span>
                </div>
              </div>
              <div className={styles.messageContent}>{msg.content}</div>
              <div className={styles.messageFooter}>
                <div className={styles.footerLeft}>
                  {msg.status === 'sent' && (
                    <>
                      <span className={styles.footerItem}>
                        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="10" cy="7" r="3" /><path d="M4 18c0-3 2.7-5.5 6-5.5s6 2.5 6 5.5" /></svg>
                        {msg.recipients.toLocaleString('en-IN')} recipients
                      </span>
                      <span className={styles.footerItem}>
                        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="10" cy="10" r="3" /><path d="M2 10c2-4 5-6 8-6s6 2 8 6c-2 4-5 6-8 6s-6-2-8-6" /></svg>
                        <span className={`${styles.readRate} ${readCls}`}>{readPct}% read</span>
                      </span>
                    </>
                  )}
                  {msg.status === 'scheduled' && msg.scheduledAt && (
                    <span className={styles.footerItem}>Scheduled: {formatDate(msg.scheduledAt)}</span>
                  )}
                </div>
                <div className={styles.actionBtns}>
                  {msg.status === 'draft' && <button className={styles.actionBtn} onClick={() => alert('Message sent!')}>Send</button>}
                  <button className={styles.actionBtn} onClick={() => alert('Message resent!')}>Resend</button>
                  <button className={styles.actionBtn} onClick={() => alert('Message deleted.')}>Delete</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {showComposeModal && (
        <div className={styles.modalOverlay} onClick={() => setShowComposeModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Compose Message</h2>
              <button className={styles.modalClose} onClick={() => setShowComposeModal(false)}>
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 5l10 10M15 5L5 15" /></svg>
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Type</label>
                  <select className={styles.formSelect}>
                    <option value="announcement">Announcement</option>
                    <option value="circular">Circular</option>
                    <option value="sms">SMS</option>
                    <option value="email">Email</option>
                    <option value="push">Push Notification</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Audience</label>
                  <select className={styles.formSelect}>
                    <option value="all">Everyone</option>
                    <option value="parents">All Parents</option>
                    <option value="teachers">All Teachers</option>
                    <option value="students">All Students</option>
                    <option value="staff">All Staff</option>
                  </select>
                </div>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Subject</label>
                <input className={styles.formInput} type="text" placeholder="Message subject" />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Message</label>
                <textarea className={styles.formTextarea} placeholder="Type your message here..." />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Schedule (optional)</label>
                <input className={styles.formInput} type="datetime-local" />
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.cancelBtn} onClick={() => setShowComposeModal(false)}>Cancel</button>
              <button className={styles.draftBtn} onClick={() => setShowComposeModal(false)}>Save Draft</button>
              <button className={styles.submitBtn} onClick={() => setShowComposeModal(false)}>Send Now</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
