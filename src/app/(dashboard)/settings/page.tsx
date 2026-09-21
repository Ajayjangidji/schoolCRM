'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getParent, getStudent, getNotificationPreferences } from '@/hooks/use-data';
import { formatDate, getInitials } from '@/lib/utils';
import { useToast } from '@/components/common/Toast';
import type { NotificationPreferences } from '@/types';
import styles from './settings.module.css';

type ToggleKey = 'attendanceAlerts' | 'homeworkReminders' | 'feeReminders' | 'noticeUpdates' | 'transportAlerts' | 'chatMessages' | 'dailySummary';
type ProfileErrors = Partial<Record<'name' | 'email' | 'phone', string>>;

const TOGGLES: Array<{ key: ToggleKey; label: string; description: string }> = [
  { key: 'attendanceAlerts', label: 'Attendance alerts', description: 'Instant alert if your child is marked absent or late.' },
  { key: 'homeworkReminders', label: 'Homework reminders', description: 'New homework, due-date reminders and evaluation results.' },
  { key: 'feeReminders', label: 'Fee reminders', description: 'Upcoming due dates and payment confirmations.' },
  { key: 'noticeUpdates', label: 'Notices & events', description: 'Circulars, holidays, exam schedules and events.' },
  { key: 'transportAlerts', label: 'Transport alerts', description: 'Bus pickup / drop alerts and route delays.' },
  { key: 'chatMessages', label: 'Teacher messages', description: 'New messages from your child\'s teachers.' },
  { key: 'dailySummary', label: 'Daily summary', description: 'One evening notification with attendance, homework and announcements.' },
];

const SUMMARY_TIMES = ['05:00 PM', '06:00 PM', '06:30 PM', '07:00 PM', '08:00 PM', '09:00 PM'];

export default function ParentSettingsPage() {
  const router = useRouter();
  const parent = getParent();
  const student = getStudent();
  const { showToast, toastNode } = useToast();

  const [profile, setProfile] = useState({ name: parent.name, email: parent.email, phone: parent.phone });
  const [savedProfile, setSavedProfile] = useState(profile);
  const [profileErrors, setProfileErrors] = useState<ProfileErrors>({});
  const [prefs, setPrefs] = useState<NotificationPreferences>(() => getNotificationPreferences());

  const profileDirty = JSON.stringify(profile) !== JSON.stringify(savedProfile);

  function saveProfile() {
    const found: ProfileErrors = {};
    if (profile.name.trim().length < 2) found.name = 'Enter your full name';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email.trim())) found.email = 'Enter a valid email address';
    if (!/^\+?[\d\s-]{10,15}$/.test(profile.phone.trim())) found.phone = 'Enter a valid phone number';
    setProfileErrors(found);
    if (Object.keys(found).length > 0) return;
    // TODO: PUT /api/parents/:id when backend is connected
    setSavedProfile(profile);
    showToast('Profile updated');
  }

  function savePrefs() {
    if (!prefs.channels.push && !prefs.channels.sms && !prefs.channels.email) {
      showToast('Select at least one delivery channel', 'error');
      return;
    }
    // TODO: PUT /api/parents/:id/notification-preferences when backend is connected
    showToast('Notification preferences saved');
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <span className={styles.cardTitle}>Profile</span>
        </div>
        <div className={styles.cardBody}>
          <div className={styles.profileTop}>
            <div className={styles.avatar}>{getInitials(profile.name || parent.name)}</div>
            <div>
              <div className={styles.profileName}>{profile.name || parent.name}</div>
              <div className={styles.profileRole}>{parent.relation.charAt(0).toUpperCase() + parent.relation.slice(1)} of {student.name}</div>
            </div>
          </div>
          <div className={styles.formGrid}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="p-name">Full name</label>
              <input id="p-name" className={`${styles.input} ${profileErrors.name ? styles.inputError : ''}`} value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
              {profileErrors.name && <span className={styles.error}>{profileErrors.name}</span>}
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="p-phone">Phone</label>
              <input id="p-phone" className={`${styles.input} ${profileErrors.phone ? styles.inputError : ''}`} value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} inputMode="tel" />
              {profileErrors.phone && <span className={styles.error}>{profileErrors.phone}</span>}
            </div>
            <div className={`${styles.field} ${styles.fieldFull}`}>
              <label className={styles.label} htmlFor="p-email">Email</label>
              <input id="p-email" className={`${styles.input} ${profileErrors.email ? styles.inputError : ''}`} type="email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} />
              {profileErrors.email && <span className={styles.error}>{profileErrors.email}</span>}
            </div>
          </div>
          <div className={styles.actions}>
            <button className={styles.secondaryBtn} disabled={!profileDirty} onClick={() => { setProfile(savedProfile); setProfileErrors({}); }}>Reset</button>
            <button className={styles.primaryBtn} disabled={!profileDirty} onClick={saveProfile}>Save changes</button>
          </div>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <span className={styles.cardTitle}>Child</span>
        </div>
        <div className={styles.cardBody}>
          <dl className={styles.detailGrid}>
            <div><dt>Name</dt><dd>{student.name}</dd></div>
            <div><dt>Class</dt><dd>{student.class}-{student.section}</dd></div>
            <div><dt>Roll number</dt><dd>{student.rollNumber}</dd></div>
            <div><dt>Date of birth</dt><dd>{formatDate(student.dateOfBirth)}</dd></div>
            <div><dt>Blood group</dt><dd>{student.bloodGroup ?? '—'}</dd></div>
          </dl>
          <div className={styles.hint}>To correct any of these details, please contact the school office.</div>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <span className={styles.cardTitle}>Notifications</span>
        </div>
        <div className={styles.cardBody}>
          <div className={styles.toggleList}>
            {TOGGLES.map((t) => (
              <div key={t.key} className={styles.toggleRow}>
                <div>
                  <div className={styles.toggleLabel}>{t.label}</div>
                  <div className={styles.toggleDesc}>{t.description}</div>
                </div>
                <div className={styles.toggleControls}>
                  {t.key === 'dailySummary' && prefs.dailySummary && (
                    <select className={styles.timeSelect} value={prefs.dailySummaryTime} onChange={(e) => setPrefs({ ...prefs, dailySummaryTime: e.target.value })} aria-label="Daily summary time">
                      {SUMMARY_TIMES.map((time) => <option key={time} value={time}>{time}</option>)}
                    </select>
                  )}
                  <label className={styles.switch}>
                    <input type="checkbox" checked={prefs[t.key]} onChange={(e) => setPrefs({ ...prefs, [t.key]: e.target.checked })} aria-label={t.label} />
                    <span className={styles.slider} />
                  </label>
                </div>
              </div>
            ))}
            <div className={styles.toggleRow}>
              <div>
                <div className={styles.toggleLabel}>Emergency alerts</div>
                <div className={styles.toggleDesc}>Safety and closure alerts are always delivered and cannot be turned off.</div>
              </div>
              <label className={`${styles.switch} ${styles.switchLocked}`}>
                <input type="checkbox" checked disabled aria-label="Emergency alerts (always on)" />
                <span className={styles.slider} />
              </label>
            </div>
          </div>

          <div className={styles.channelBlock}>
            <div className={styles.channelTitle}>Deliver notifications via</div>
            <div className={styles.channels}>
              {(['push', 'sms', 'email'] as const).map((c) => (
                <label key={c} className={styles.channelOption}>
                  <input type="checkbox" checked={prefs.channels[c]} onChange={(e) => setPrefs({ ...prefs, channels: { ...prefs.channels, [c]: e.target.checked } })} />
                  {c === 'push' ? 'Push notification' : c === 'sms' ? 'SMS' : 'Email'}
                </label>
              ))}
            </div>
          </div>

          <div className={styles.actions}>
            <button className={styles.primaryBtn} onClick={savePrefs}>Save preferences</button>
          </div>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <span className={styles.cardTitle}>Session</span>
        </div>
        <div className={styles.cardBody}>
          <div className={styles.sessionRow}>
            <div>
              <div className={styles.toggleLabel}>Log out</div>
              <div className={styles.toggleDesc}>Sign out of SchoolAI on this device.</div>
            </div>
            <button className={styles.dangerBtn} onClick={() => router.push('/login')}>Log out</button>
          </div>
        </div>
      </div>
      {toastNode}
    </div>
  );
}
