'use client';

import { useState } from 'react';
import { getRoles } from '@/hooks/use-admin-data';
import type { Role, Permission } from '@/hooks/use-admin-data';
import { formatDate, getInitials } from '@/lib/utils';
import styles from './roles.module.css';

export default function AdminRolesPage() {
  const allRoles = getRoles();
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  const totalUsers = allRoles.reduce((s, r) => s + r.userCount, 0);
  const systemRoles = allRoles.filter((r) => r.type === 'system').length;
  const customRoles = allRoles.filter((r) => r.type === 'custom').length;
  const activeRoles = allRoles.filter((r) => r.isActive).length;

  function permSummary(perms: Permission[]) {
    const full = perms.filter((p) => p.view && p.create && p.edit && p.delete).length;
    const view = perms.filter((p) => p.view && !(p.create && p.edit && p.delete)).length;
    const none = perms.filter((p) => !p.view).length;
    return { full, view, none };
  }

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Role & Permission Management</h1>
        <button className={styles.createBtn} onClick={() => setShowCreate(true)}>
          <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M10 4v12M4 10h12" /></svg>
          Create Role
        </button>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: '#ede9fe', color: '#7c3aed' }}>
            <svg width="22" height="22" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 5h12M4 10h12M4 15h8" /></svg>
          </div>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>Total Roles</div>
            <div className={styles.statValue}>{allRoles.length}</div>
            <div className={styles.statSub}>{systemRoles} system, {customRoles} custom</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: '#e8f5e9', color: '#2e7d32' }}>
            <svg width="22" height="22" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="10" cy="5" r="3" /><path d="M4 17c0-3.5 2.7-6 6-6s6 2.5 6 6" /></svg>
          </div>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>Total Users</div>
            <div className={styles.statValue}>{totalUsers.toLocaleString('en-IN')}</div>
            <div className={styles.statSub}>Across all roles</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: '#e3f2fd', color: '#1565c0' }}>
            <svg width="22" height="22" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="14" height="14" rx="2" /><path d="M3 8h14" /><path d="M8 8v9" /></svg>
          </div>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>Active Roles</div>
            <div className={styles.statValue}>{activeRoles}</div>
            <div className={styles.statSub}>Currently in use</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: '#fff3e0', color: '#e65100' }}>
            <svg width="22" height="22" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M10 2l2.3 5h5.2l-4.1 3.4 1.5 5.1L10 12.8l-4.9 2.7 1.5-5.1L2.5 7h5.2z" /></svg>
          </div>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>Permissions</div>
            <div className={styles.statValue}>12</div>
            <div className={styles.statSub}>Modules managed</div>
          </div>
        </div>
      </div>

      <div className={styles.roleGrid}>
        {allRoles.map((role) => {
          const ps = permSummary(role.permissions);
          return (
            <div key={role.id} className={styles.roleCard} style={{ borderLeftColor: role.color }}>
              <div className={styles.roleCardHeader}>
                <div className={styles.roleLeft}>
                  <div className={styles.roleIcon} style={{ background: role.color }}>{getInitials(role.name)}</div>
                  <div className={styles.roleInfo}>
                    <div className={styles.roleName}>
                      {role.name}
                    </div>
                    <div className={styles.roleDesc}>{role.description}</div>
                  </div>
                </div>
                <div className={styles.badgeRow}>
                  <span className={`${styles.typeBadge} ${role.type === 'system' ? styles.badgeSystem : styles.badgeCustom}`}>{role.type}</span>
                  <span className={`${styles.statusDot} ${role.isActive ? styles.dotActive : styles.dotInactive}`} />
                </div>
              </div>
              <div className={styles.roleMetrics}>
                <span className={styles.metric}>
                  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="10" cy="5" r="3" /><path d="M4 17c0-3.5 2.7-6 6-6s6 2.5 6 6" /></svg>
                  <span className={styles.metricValue}>{role.userCount}</span> users
                </span>
                <span className={styles.metric}>
                  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="4" width="14" height="12" rx="1" /><path d="M7 2v4M13 2v4M3 8h14" /></svg>
                  Updated {formatDate(role.updatedAt)}
                </span>
              </div>
              <div className={styles.roleFooter}>
                <div className={styles.permSummary}>
                  {ps.full > 0 && <span className={`${styles.permChip} ${styles.permChipFull}`}>{ps.full} Full Access</span>}
                  {ps.view > 0 && <span className={`${styles.permChip} ${styles.permChipView}`}>{ps.view} View Only</span>}
                  {ps.none > 0 && <span className={`${styles.permChip} ${styles.permChipNone}`}>{ps.none} No Access</span>}
                </div>
                <div className={styles.roleActions}>
                  <button className={styles.roleActionBtn} onClick={() => setSelectedRole(role)}>View</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {selectedRole && (
        <div className={styles.modalOverlay} onClick={() => setSelectedRole(null)}>
          <div className={`${styles.modal} ${styles.modalWide}`} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div>
                <h2 className={styles.modalTitle}>{selectedRole.name} — Permissions</h2>
                <div className={styles.modalSubtitle}>{selectedRole.description}</div>
              </div>
              <button className={styles.modalClose} onClick={() => setSelectedRole(null)}>
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 5l10 10M15 5L5 15" /></svg>
              </button>
            </div>
            <div className={styles.modalBody}>
              <table className={styles.permTable}>
                <thead>
                  <tr>
                    <th>Module</th>
                    <th>View</th>
                    <th>Create</th>
                    <th>Edit</th>
                    <th>Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedRole.permissions.map((p) => (
                    <tr key={p.module}>
                      <td>{p.module}</td>
                      <td><span className={`${styles.checkIcon} ${p.view ? styles.checkYes : styles.checkNo}`}>{p.view ? '✓' : '✗'}</span></td>
                      <td><span className={`${styles.checkIcon} ${p.create ? styles.checkYes : styles.checkNo}`}>{p.create ? '✓' : '✗'}</span></td>
                      <td><span className={`${styles.checkIcon} ${p.edit ? styles.checkYes : styles.checkNo}`}>{p.edit ? '✓' : '✗'}</span></td>
                      <td><span className={`${styles.checkIcon} ${p.delete ? styles.checkYes : styles.checkNo}`}>{p.delete ? '✓' : '✗'}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {showCreate && (
        <div className={styles.modalOverlay} onClick={() => setShowCreate(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Create New Role</h2>
              <button className={styles.modalClose} onClick={() => setShowCreate(false)}>
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 5l10 10M15 5L5 15" /></svg>
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Role Name</label>
                <input className={styles.formInput} type="text" placeholder="e.g. Lab Assistant" />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Description</label>
                <textarea className={styles.formTextarea} placeholder="Describe the role responsibilities..." />
              </div>
              <div className={styles.permSection}>
                <div className={styles.permSectionTitle}>Module Permissions</div>
                {['Dashboard', 'Students', 'Teachers', 'Classes', 'Fees', 'Attendance', 'Exams', 'Notices', 'Staff & HR', 'Reports', 'Documents', 'Settings'].map((mod) => (
                  <div key={mod} className={styles.permRow}>
                    <span className={styles.permModuleName}>{mod}</span>
                    <div className={styles.permCheckboxes}>
                      {['View', 'Create', 'Edit', 'Delete'].map((action) => (
                        <label key={action} className={styles.permCheckbox}>
                          <input type="checkbox" /> {action}
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.cancelBtn} onClick={() => setShowCreate(false)}>Cancel</button>
              <button className={styles.submitBtn} onClick={() => setShowCreate(false)}>Create Role</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
