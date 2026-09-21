'use client';

import React, { useState } from 'react';
import { getEmergencyAlerts, getEmergencyContacts, getStudent, getToday } from '@/hooks/use-data';
import { getRelativeTime } from '@/lib/utils';
import { useToast } from '@/components/common/Toast';
import styles from './emergency.module.css';

type ContactFilter = 'all' | 'school' | 'medical' | 'transport' | 'admin';

const SEVERITY_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  critical: { label: 'CRITICAL', color: 'var(--white)', bg: 'var(--danger)' },
  high: { label: 'HIGH', color: 'var(--danger)', bg: 'var(--danger-light)' },
  medium: { label: 'MEDIUM', color: 'var(--warning)', bg: 'var(--warning-light)' },
  low: { label: 'LOW', color: 'var(--info)', bg: 'var(--info-light)' },
};

const TYPE_ICONS: Record<string, React.ReactNode> = {
  weather: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2v2M4.93 4.93l1.41 1.41M2 12h2M4.93 19.07l1.41-1.41M12 20v2M17.66 17.66l1.41 1.41M20 12h2M17.66 6.34l1.41-1.41"/><circle cx="12" cy="12" r="4"/></svg>,
  security: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2l8 4v6c0 5.25-3.5 9.74-8 11-4.5-1.26-8-5.75-8-11V6l8-4z"/><path d="M12 8v4M12 16h.01"/></svg>,
  health: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 6v12M6 12h12"/><circle cx="12" cy="12" r="10"/></svg>,
  transport: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 15V6a2 2 0 012-2h10a2 2 0 012 2v9"/><path d="M3 15h18v3a1 1 0 01-1 1H4a1 1 0 01-1-1v-3z"/><circle cx="7" cy="20" r="1"/><circle cx="17" cy="20" r="1"/></svg>,
  infrastructure: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 21h18M3 7v14M21 7v14M6 7V4a1 1 0 011-1h10a1 1 0 011 1v3M9 21v-4h6v4"/><path d="M9 10h.01M15 10h.01M9 14h.01M15 14h.01"/></svg>,
  general: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2L2 19h20L12 2z"/><path d="M12 9v4M12 16h.01"/></svg>,
};

const CONTACT_TYPE_LABELS: Record<string, string> = {
  all: 'All',
  school: 'School',
  medical: 'Medical',
  transport: 'Transport',
  admin: 'Admin',
};

export default function EmergencyPage() {
  const alerts = getEmergencyAlerts();
  const contacts = getEmergencyContacts();
  const student = getStudent();
  const [contactFilter, setContactFilter] = useState<ContactFilter>('all');
  const [acknowledged, setAcknowledged] = useState<Set<string>>(new Set());
  const { showToast, toastNode } = useToast();
  const todayDate = new Date(getToday());

  function acknowledgeAlert(id: string) {
    // TODO: POST /api/emergency/:id/acknowledge when backend is connected
    setAcknowledged((prev) => new Set(prev).add(id));
    showToast('Acknowledged. The school can see you have read this alert.');
  }

  const activeAlerts = alerts.filter(a => a.isActive);
  const pastAlerts = alerts.filter(a => !a.isActive);
  const filteredContacts = contactFilter === 'all' ? contacts : contacts.filter(c => c.type === contactFilter);

  return (
    <div className={styles.page}>
      {/* SOS Banner */}
      <div className={styles.sosBanner}>
        <div className={styles.sosLeft}>
          <div className={styles.sosIcon}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
          </div>
          <div>
            <div className={styles.sosTitle}>Emergency? Call School Now</div>
            <div className={styles.sosDesc}>For immediate help regarding {student.name}&#39;s safety</div>
          </div>
        </div>
        <a href="tel:+911123456789" className={styles.sosBtn}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16.5 12.69v2.25a1.5 1.5 0 01-1.64 1.5 14.84 14.84 0 01-6.47-2.3 14.62 14.62 0 01-4.5-4.5A14.84 14.84 0 011.6 3.14 1.5 1.5 0 013.09 1.5h2.25a1.5 1.5 0 011.5 1.29c.1.72.27 1.43.53 2.11a1.5 1.5 0 01-.34 1.58l-.95.95a12 12 0 004.5 4.5l.95-.95a1.5 1.5 0 011.58-.34c.68.26 1.39.44 2.11.53a1.5 1.5 0 011.29 1.52z"/></svg>
          Call Now
        </a>
      </div>

      {/* Stats */}
      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: 'var(--danger-light)', color: 'var(--danger)' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2L2 19h20L12 2z"/><path d="M12 9v4M12 16h.01"/></svg>
          </div>
          <div>
            <div className={styles.statNum}>{activeAlerts.length}</div>
            <div className={styles.statLabel}>Active Alerts</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: 'var(--success-light)', color: 'var(--success)' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3"/></svg>
          </div>
          <div>
            <div className={styles.statNum}>{contacts.length}</div>
            <div className={styles.statLabel}>Emergency Contacts</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2l8 4v6c0 5.25-3.5 9.74-8 11-4.5-1.26-8-5.75-8-11V6l8-4z"/></svg>
          </div>
          <div>
            <div className={styles.statNum}>{contacts.filter(c => c.isAvailable).length}</div>
            <div className={styles.statLabel}>Available Now</div>
          </div>
        </div>
      </div>

      {/* Active Alerts */}
      {activeAlerts.length > 0 && (
        <div className={styles.section}>
          <div className={styles.sectionTitle}>
            <div className={styles.activeDot} />
            Active Alerts
          </div>
          <div className={styles.alertsList}>
            {activeAlerts.map((alert) => {
              const severity = SEVERITY_CONFIG[alert.severity];
              return (
                <div key={alert.id} className={`${styles.alertCard} ${styles[`alert${alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)}`]}`}>
                  <div className={styles.alertTop}>
                    <div className={styles.alertIcon}>
                      {TYPE_ICONS[alert.type] || TYPE_ICONS.general}
                    </div>
                    <div className={styles.alertInfo}>
                      <div className={styles.alertTitle}>{alert.title}</div>
                      <div className={styles.alertMeta}>
                        <span className={styles.severityBadge} style={{ color: severity.color, background: severity.bg }}>
                          {severity.label}
                        </span>
                        <span>{getRelativeTime(alert.issuedAt, todayDate)}</span>
                        <span>&middot;</span>
                        <span>{alert.issuedBy}</span>
                      </div>
                    </div>
                  </div>
                  <div className={styles.alertMessage}>{alert.message}</div>
                  {alert.actionRequired && (
                    <div className={styles.alertAction}>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M8 3v5M8 11h.01"/><circle cx="8" cy="8" r="7"/></svg>
                      <div>
                        <div className={styles.actionLabel}>Action Required</div>
                        <div className={styles.actionText}>{alert.actionRequired}</div>
                      </div>
                    </div>
                  )}
                  <div className={styles.ackRow}>
                    {acknowledged.has(alert.id) ? (
                      <span className={styles.ackDone}>
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 8l3.5 3.5L13 4.5" /></svg>
                        Acknowledged
                      </span>
                    ) : (
                      <button className={styles.ackBtn} onClick={() => acknowledgeAlert(alert.id)}>I have read this alert</button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Emergency Contacts */}
      <div className={styles.section}>
        <div className={styles.sectionTitle}>Emergency Contacts</div>
        <div className={styles.contactTabs}>
          {(Object.keys(CONTACT_TYPE_LABELS) as ContactFilter[]).map((key) => (
            <button
              key={key}
              className={`${styles.contactTab} ${contactFilter === key ? styles.contactTabActive : ''}`}
              onClick={() => setContactFilter(key)}
            >
              {CONTACT_TYPE_LABELS[key]}
            </button>
          ))}
        </div>
        <div className={styles.contactGrid}>
          {filteredContacts.map((contact) => (
            <div key={contact.id} className={styles.contactCard}>
              <div className={styles.contactTop}>
                <div className={styles.contactAvatar}>
                  {contact.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                </div>
                <div className={styles.contactInfo}>
                  <div className={styles.contactName}>{contact.name}</div>
                  <div className={styles.contactRole}>{contact.role}</div>
                </div>
                <div className={`${styles.availDot} ${contact.isAvailable ? styles.availOnline : styles.availOffline}`} />
              </div>
              <div className={styles.contactBottom}>
                <a href={`tel:${contact.phone}`} className={styles.callBtn}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12.83 9.87v1.75a1.17 1.17 0 01-1.27 1.17 11.56 11.56 0 01-5.04-1.79 11.39 11.39 0 01-3.5-3.5A11.56 11.56 0 011.23 2.44 1.17 1.17 0 012.4 1.17h1.75a1.17 1.17 0 011.17 1c.08.56.21 1.11.41 1.64a1.17 1.17 0 01-.26 1.23l-.74.74a9.33 9.33 0 003.5 3.5l.74-.74a1.17 1.17 0 011.23-.26c.53.2 1.08.33 1.64.41a1.17 1.17 0 011 1.18z"/></svg>
                  Call
                </a>
                <span className={styles.contactPhone}>{contact.phone}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Past Alerts */}
      {pastAlerts.length > 0 && (
        <div className={styles.section}>
          <div className={styles.sectionTitle}>Past Alerts</div>
          <div className={styles.alertsList}>
            {pastAlerts.map((alert) => {
              const severity = SEVERITY_CONFIG[alert.severity];
              return (
                <div key={alert.id} className={`${styles.alertCard} ${styles.alertPast}`}>
                  <div className={styles.alertTop}>
                    <div className={styles.alertIcon}>
                      {TYPE_ICONS[alert.type] || TYPE_ICONS.general}
                    </div>
                    <div className={styles.alertInfo}>
                      <div className={styles.alertTitle}>{alert.title}</div>
                      <div className={styles.alertMeta}>
                        <span className={styles.severityBadge} style={{ color: severity.color, background: severity.bg }}>
                          {severity.label}
                        </span>
                        <span>{getRelativeTime(alert.issuedAt, todayDate)}</span>
                        <span className={styles.resolvedBadge}>Resolved</span>
                      </div>
                    </div>
                  </div>
                  <div className={styles.alertMessage}>{alert.message}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      {toastNode}
    </div>
  );
}
