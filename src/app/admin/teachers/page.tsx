'use client';

import { useState } from 'react';
import { getAdminTeachers } from '@/hooks/use-admin-data';
import type { AdminTeacher } from '@/hooks/use-admin-data';
import { getInitials, formatDate } from '@/lib/utils';
import styles from './teachers.module.css';

const INR = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });
const PER_PAGE = 10;
const DEPT_COLORS: Record<string, string> = { Mathematics: '#7c3aed', Science: '#1565c0', English: '#2e7d32', Hindi: '#e65100', 'Social Studies': '#00897b', 'Computer Science': '#6a1b9a', 'Physical Education': '#c62828' };
const ALL_DEPARTMENTS = ['Mathematics', 'Science', 'English', 'Hindi', 'Social Studies', 'Computer Science', 'Physical Education'];
const ALL_SUBJECTS = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Hindi', 'Sanskrit', 'Social Studies', 'Computer Science', 'Physical Education', 'Art', 'Music', 'Economics', 'Accounts', 'Business Studies'];
const DESIGNATIONS = ['PGT', 'TGT', 'PRT', 'Head of Department', 'Vice Principal', 'Sports Coach'];
const QUALIFICATIONS = ['B.Ed', 'M.Ed', 'M.A.', 'M.Sc.', 'M.Com.', 'Ph.D.', 'B.P.Ed', 'M.P.Ed'];

export default function AdminTeachersPage() {
  const allTeachers = getAdminTeachers().filter((t) => t.role === 'teacher');
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<AdminTeacher | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);

  const departments = [...new Set(allTeachers.map((t) => t.department))].sort();
  const activeCount = allTeachers.filter((t) => t.status === 'active').length;
  const onLeaveCount = allTeachers.filter((t) => t.status === 'on-leave').length;
  const avgExp = allTeachers.length > 0 ? Math.round(allTeachers.reduce((s, t) => s + t.experience, 0) / allTeachers.length) : 0;

  const filtered = allTeachers.filter((t) => {
    if (deptFilter !== 'all' && t.department !== deptFilter) return false;
    if (statusFilter !== 'all' && t.status !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return t.name.toLowerCase().includes(q) || t.employeeId.toLowerCase().includes(q) || t.department.toLowerCase().includes(q) || t.subjects.some((s) => s.toLowerCase().includes(q));
    }
    return true;
  });

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  function getStatusCls(status: string) {
    switch (status) { case 'active': return styles.statusActive; case 'on-leave': return styles.statusLeave; default: return styles.statusResigned; }
  }

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Teacher Management</h1>
        <button className={styles.addBtn} onClick={() => setShowAddModal(true)}>
          <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M10 4v12M4 10h12" /></svg>
          Add Teacher
        </button>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: '#ede9fe', color: '#7c3aed' }}>
            <svg width="22" height="22" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="10" cy="5" r="3" /><path d="M4 17c0-3.5 2.7-6 6-6s6 2.5 6 6" /></svg>
          </div>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>Total Teachers</div>
            <div className={styles.statValue}>{allTeachers.length}</div>
            <div className={styles.statSub}>{departments.length} departments</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: '#e8f5e9', color: '#2e7d32' }}>
            <svg width="22" height="22" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 10l2.5 2.5L14 7" /><circle cx="10" cy="10" r="8" /></svg>
          </div>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>Active</div>
            <div className={styles.statValue}>{activeCount}</div>
            <div className={styles.statSub}>Currently working</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: '#fff3e0', color: '#e65100' }}>
            <svg width="22" height="22" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="4" width="14" height="12" rx="1" /><path d="M7 2v4M13 2v4M3 8h14" /></svg>
          </div>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>On Leave</div>
            <div className={styles.statValue}>{onLeaveCount}</div>
            <div className={styles.statSub}>Currently absent</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: '#e3f2fd', color: '#1565c0' }}>
            <svg width="22" height="22" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 17l4-8 4 5 3-4 4 7" /></svg>
          </div>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>Avg Experience</div>
            <div className={styles.statValue}>{avgExp} yrs</div>
            <div className={styles.statSub}>Teaching experience</div>
          </div>
        </div>
      </div>

      <div className={styles.filtersBar}>
        <div className={styles.searchBox}>
          <svg className={styles.searchIcon} width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="9" cy="9" r="6" /><path d="M13.5 13.5L17 17" /></svg>
          <input className={styles.searchInput} type="text" placeholder="Search teachers..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
        </div>
        <select className={styles.filterSelect} value={deptFilter} onChange={(e) => { setDeptFilter(e.target.value); setPage(1); }}>
          <option value="all">All Departments</option>
          {departments.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
        <select className={styles.filterSelect} value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}>
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="on-leave">On Leave</option>
          <option value="resigned">Resigned</option>
        </select>
      </div>

      {filtered.length === 0 && <div className={styles.emptyState}>No teachers found.</div>}

      {filtered.length > 0 && (
        <div className={styles.tableCard}>
          <div className={styles.tableScroll}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Teacher</th>
                  <th>Employee ID</th>
                  <th>Department</th>
                  <th>Subjects</th>
                  <th>Class Teacher</th>
                  <th>Experience</th>
                  <th>Salary</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((t) => (
                  <tr key={t.id} onClick={() => setSelected(t)}>
                    <td>
                      <div className={styles.nameCell}>
                        <div className={styles.avatar} style={{ background: DEPT_COLORS[t.department] || '#7c3aed' }}>{getInitials(t.name)}</div>
                        <div className={styles.nameInfo}>
                          <div className={styles.teacherName}>{t.name}</div>
                          <div className={styles.teacherEmail}>{t.email}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ fontWeight: 600 }}>{t.employeeId}</td>
                    <td><span className={styles.deptBadge}>{t.department}</span></td>
                    <td>
                      <div className={styles.subjectChips}>
                        {t.subjects.map((s) => <span key={s} className={styles.subjectChip}>{s}</span>)}
                      </div>
                    </td>
                    <td>{t.classTeacherOf ? <span className={styles.classBadge}>Class {t.classTeacherOf}</span> : '—'}</td>
                    <td>{t.experience} yrs</td>
                    <td>{INR.format(t.salary)}</td>
                    <td><span className={`${styles.statusBadge} ${getStatusCls(t.status)}`}>{t.status === 'on-leave' ? 'On Leave' : t.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div className={styles.pagination}>
              <span>Showing {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, filtered.length)} of {filtered.length}</span>
              <div className={styles.pagBtns}>
                <button className={styles.pagBtn} disabled={page === 1} onClick={() => setPage(page - 1)}>Prev</button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button key={i + 1} className={`${styles.pagBtn} ${page === i + 1 ? styles.pagBtnActive : ''}`} onClick={() => setPage(i + 1)}>{i + 1}</button>
                ))}
                <button className={styles.pagBtn} disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next</button>
              </div>
            </div>
          )}
        </div>
      )}

      {selected && (
        <div className={styles.modalOverlay} onClick={() => setSelected(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Teacher Details</h2>
              <button className={styles.modalClose} onClick={() => setSelected(null)}>
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 5l10 10M15 5L5 15" /></svg>
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.detailTop}>
                <div className={styles.detailAvatar} style={{ background: DEPT_COLORS[selected.department] || '#7c3aed' }}>{getInitials(selected.name)}</div>
                <div>
                  <div className={styles.detailName}>{selected.name}</div>
                  <div className={styles.detailDesignation}>{selected.designation} — {selected.department}</div>
                </div>
              </div>
              <div className={styles.detailGrid}>
                <div className={styles.detailItem}><span className={styles.detailLabel}>Employee ID</span><span className={styles.detailValue}>{selected.employeeId}</span></div>
                <div className={styles.detailItem}><span className={styles.detailLabel}>Phone</span><span className={styles.detailValue}>{selected.phone}</span></div>
                <div className={styles.detailItem}><span className={styles.detailLabel}>Email</span><span className={styles.detailValue}>{selected.email}</span></div>
                <div className={styles.detailItem}><span className={styles.detailLabel}>Gender</span><span className={styles.detailValue}>{selected.gender}</span></div>
                <div className={styles.detailItem}><span className={styles.detailLabel}>Date of Birth</span><span className={styles.detailValue}>{formatDate(selected.dob)}</span></div>
                <div className={styles.detailItem}><span className={styles.detailLabel}>Joining Date</span><span className={styles.detailValue}>{formatDate(selected.joiningDate)}</span></div>
                <div className={styles.detailItem}><span className={styles.detailLabel}>Qualification</span><span className={styles.detailValue}>{selected.qualification}</span></div>
                <div className={styles.detailItem}><span className={styles.detailLabel}>Experience</span><span className={styles.detailValue}>{selected.experience} years</span></div>
                <div className={styles.detailItem}><span className={styles.detailLabel}>Salary</span><span className={styles.detailValue}>{INR.format(selected.salary)}</span></div>
                <div className={styles.detailItem}><span className={styles.detailLabel}>Class Teacher Of</span><span className={styles.detailValue}>{selected.classTeacherOf || '—'}</span></div>
                <div className={styles.detailItem}><span className={styles.detailLabel}>Subjects</span><span className={styles.detailValue}>{selected.subjects.join(', ')}</span></div>
                <div className={styles.detailItem}><span className={styles.detailLabel}>Address</span><span className={styles.detailValue}>{selected.address}</span></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showAddModal && (
        <div className={styles.modalOverlay} onClick={() => { setShowAddModal(false); setSelectedSubjects([]); }}>
          <div className={`${styles.modal} ${styles.modalWide}`} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Add New Teacher</h2>
              <button className={styles.modalClose} onClick={() => { setShowAddModal(false); setSelectedSubjects([]); }}>
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 5l10 10M15 5L5 15" /></svg>
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Full Name</label>
                  <input className={styles.formInput} type="text" placeholder="e.g. Dr. Anita Sharma" />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Employee ID</label>
                  <input className={styles.formInput} type="text" placeholder="e.g. EMP013" />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Email</label>
                  <input className={styles.formInput} type="email" placeholder="e.g. anita@schoolai.in" />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Phone</label>
                  <input className={styles.formInput} type="tel" placeholder="e.g. +91 98765 43210" />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Gender</label>
                  <select className={styles.formSelect}>
                    <option value="">Select gender...</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Date of Birth</label>
                  <input className={styles.formInput} type="date" />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Department</label>
                  <select className={styles.formSelect}>
                    <option value="">Select department...</option>
                    {ALL_DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Designation</label>
                  <select className={styles.formSelect}>
                    <option value="">Select designation...</option>
                    {DESIGNATIONS.map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Qualification</label>
                  <select className={styles.formSelect}>
                    <option value="">Select qualification...</option>
                    {QUALIFICATIONS.map((q) => <option key={q} value={q}>{q}</option>)}
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Experience (years)</label>
                  <input className={styles.formInput} type="number" placeholder="e.g. 8" min="0" />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Joining Date</label>
                  <input className={styles.formInput} type="date" />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Salary (Monthly)</label>
                  <input className={styles.formInput} type="number" placeholder="e.g. 55000" />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Class Teacher Of</label>
                  <select className={styles.formSelect}>
                    <option value="">None</option>
                    {['1-A', '1-B', '2-A', '2-B', '3-A', '3-B', '4-A', '4-B', '5-A', '5-B', '6-A', '6-B', '7-A', '7-B', '8-A', '8-B', '9-A', '9-B', '10-A', '10-B', '11-A', '11-B', '12-A', '12-B'].map((c) => <option key={c} value={c}>Class {c}</option>)}
                  </select>
                </div>
                <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
                  <label className={styles.formLabel}>Address</label>
                  <textarea className={styles.formTextarea} placeholder="Full address..." />
                </div>
                <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
                  <label className={styles.formLabel}>Subjects {selectedSubjects.length > 0 && `(${selectedSubjects.length} selected)`}</label>
                  <div className={styles.subjectPicker}>
                    {ALL_SUBJECTS.map((sub) => (
                      <span
                        key={sub}
                        className={`${styles.subjectOption} ${selectedSubjects.includes(sub) ? styles.subjectOptionActive : ''}`}
                        onClick={() => setSelectedSubjects((prev) => prev.includes(sub) ? prev.filter((s) => s !== sub) : [...prev, sub])}
                      >
                        {sub}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.cancelBtn} onClick={() => { setShowAddModal(false); setSelectedSubjects([]); }}>Cancel</button>
              <button className={styles.submitBtn} onClick={() => { setShowAddModal(false); setSelectedSubjects([]); }}>Add Teacher</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
