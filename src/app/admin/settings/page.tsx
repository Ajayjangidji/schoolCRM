'use client';

import React, { useState } from 'react';
import { getSchoolSettings } from '@/hooks/use-admin-data';
import type { SchoolSetting } from '@/hooks/use-admin-data';
import styles from './settings.module.css';

type Category = SchoolSetting['category'];

const CATEGORY_META: { value: Category; label: string; description: string }[] = [
  { value: 'general', label: 'General', description: 'School information and contact details' },
  { value: 'academic', label: 'Academic', description: 'Academic year, grading, and scheduling settings' },
  { value: 'fees', label: 'Fees', description: 'Fee collection and payment configuration' },
  { value: 'communication', label: 'Communication', description: 'Notification and messaging preferences' },
  { value: 'security', label: 'Security', description: 'Authentication and access control' },
  { value: 'system', label: 'System', description: 'Backup, maintenance, and system configuration' },
];

const CATEGORY_ICONS: Record<Category, React.ReactNode> = {
  general: <svg className={styles.sidebarIcon} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3h14v14H3z" /><path d="M7 7h6M7 10h4" /></svg>,
  academic: <svg className={styles.sidebarIcon} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 7l8-4 8 4-8 4-8-4z" /><path d="M4 8v5c0 2 2.7 3 6 3s6-1 6-3V8" /></svg>,
  fees: <svg className={styles.sidebarIcon} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="16" height="12" rx="2" /><path d="M2 8h16M6 12h3" /></svg>,
  communication: <svg className={styles.sidebarIcon} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 4h14a1 1 0 011 1v8a1 1 0 01-1 1H6l-3 3V5a1 1 0 011-1z" /></svg>,
  security: <svg className={styles.sidebarIcon} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="9" width="10" height="8" rx="1" /><path d="M7 9V6a3 3 0 016 0v3" /></svg>,
  system: <svg className={styles.sidebarIcon} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="10" cy="10" r="3" /><path d="M10 1v3M10 16v3M1 10h3M16 10h3M3.5 3.5l2 2M14.5 14.5l2 2M3.5 16.5l2-2M14.5 5.5l2-2" /></svg>,
};

export default function AdminSettingsPage() {
  const allSettings = getSchoolSettings();
  const [activeCategory, setActiveCategory] = useState<Category>('general');
  const [values, setValues] = useState<Record<string, string>>(
    Object.fromEntries(allSettings.map((s) => [s.id, s.value]))
  );

  const categorySettings = allSettings.filter((s) => s.category === activeCategory);
  const meta = CATEGORY_META.find((c) => c.value === activeCategory);

  function updateValue(id: string, value: string) {
    setValues((prev) => ({ ...prev, [id]: value }));
  }

  function renderControl(setting: SchoolSetting) {
    const val = values[setting.id] ?? setting.value;
    switch (setting.type) {
      case 'text':
        return (
          <input
            className={styles.textInput}
            type="text"
            value={val}
            onChange={(e) => updateValue(setting.id, e.target.value)}
          />
        );
      case 'number':
        return (
          <input
            className={styles.numberInput}
            type="number"
            value={val}
            onChange={(e) => updateValue(setting.id, e.target.value)}
          />
        );
      case 'select':
        return (
          <select
            className={styles.selectInput}
            value={val}
            onChange={(e) => updateValue(setting.id, e.target.value)}
          >
            {setting.options?.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        );
      case 'toggle':
        return (
          <label className={styles.toggle}>
            <input
              className={styles.toggleInput}
              type="checkbox"
              checked={val === 'true'}
              onChange={(e) => updateValue(setting.id, e.target.checked ? 'true' : 'false')}
            />
            <span className={styles.toggleSlider} />
          </label>
        );
      default:
        return null;
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>School Settings</h1>
        <button className={styles.saveBtn} onClick={() => alert('Settings saved successfully!')}>
          <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 10l2.5 2.5L14 7" /></svg>
          Save Changes
        </button>
      </div>

      <div className={styles.layout}>
        <div className={styles.sidebar}>
          {CATEGORY_META.map((cat) => (
            <button
              key={cat.value}
              className={`${styles.sidebarItem} ${activeCategory === cat.value ? styles.sidebarItemActive : ''}`}
              onClick={() => setActiveCategory(cat.value)}
            >
              {CATEGORY_ICONS[cat.value]}
              {cat.label}
            </button>
          ))}
        </div>

        <div className={styles.content}>
          <div className={styles.sectionCard}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionTitle}>{meta?.label} Settings</div>
              <div className={styles.sectionDesc}>{meta?.description}</div>
            </div>
            <div className={styles.settingsList}>
              {categorySettings.map((setting) => (
                <div key={setting.id} className={styles.settingRow}>
                  <div className={styles.settingInfo}>
                    <div className={styles.settingLabel}>{setting.label}</div>
                    <div className={styles.settingDesc}>{setting.description}</div>
                  </div>
                  <div className={styles.settingControl}>
                    {renderControl(setting)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {activeCategory === 'system' && (
            <div className={`${styles.sectionCard} ${styles.dangerZone}`} style={{ marginTop: 'var(--space-4)' }}>
              <div className={styles.sectionHeader}>
                <div className={`${styles.sectionTitle} ${styles.dangerTitle}`}>Danger Zone</div>
                <div className={styles.sectionDesc}>Irreversible and destructive actions</div>
              </div>
              <div className={styles.settingsList}>
                <div className={`${styles.settingRow} ${styles.dangerRow}`}>
                  <div className={styles.settingInfo}>
                    <div className={styles.settingLabel}>Reset All Settings</div>
                    <div className={styles.settingDesc}>Reset all settings to their default values</div>
                  </div>
                  <div className={styles.settingControl}>
                    <button className={styles.dangerBtn} onClick={() => { if(confirm('Are you sure you want to reset all settings?')) alert('Settings reset to defaults.'); }}>Reset</button>
                  </div>
                </div>
                <div className={`${styles.settingRow} ${styles.dangerRow}`}>
                  <div className={styles.settingInfo}>
                    <div className={styles.settingLabel}>Clear Activity Logs</div>
                    <div className={styles.settingDesc}>Permanently delete all system activity logs</div>
                  </div>
                  <div className={styles.settingControl}>
                    <button className={styles.dangerBtn} onClick={() => { if(confirm('Are you sure you want to clear all logs?')) alert('Activity logs cleared.'); }}>Clear Logs</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
