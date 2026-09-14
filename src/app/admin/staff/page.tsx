'use client';

import { useState, useMemo } from 'react';
import { getAdminTeachers } from '@/hooks/use-admin-data';
import { getInitials, formatDate } from '@/lib/utils';
import type { AdminTeacher } from '@/hooks/use-admin-data';
import styles from './staff.module.css';

const AVATAR_COLORS = ['#7c3aed', '#1565c0', '#2e7d32', '#e65100', '#c62828', '#00695c', '#4527a0', '#ef6c00', '#0277bd', '#6a1b9a'];

type TabType = 'all' | 'teachers' | 'staff';

const DEPARTMENTS = ['All', 'Mathematics', 'Science', 'English', 'Hindi', 'Social Studies', 'Computer Science', 'Physical Education', 'Administration', 'Accounts', 'IT Support', 'Library', 'Maintenance'];
const STATUS_FILTERS = ['All', 'Active', 'On Leave', 'Resigned'];

function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
}

export default function AdminStaffPage() {
  const allStaff = getAdminTeachers();

  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedPerson, setSelectedPerson] = useState<AdminTeacher | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 10;

  const filtered = useMemo(() => {
    let result = allStaff;
    if (activeTab === 'teachers') result = result.filter((p) => p.role === 'teacher');
    if (activeTab === 'staff') result = result.filter((p) => p.role === 'staff');
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((p) => p.name.toLowerCase().includes(q) || p.employeeId.toLowerCase().includes(q) || p.department.toLowerCase().includes(q));
    }
    if (deptFilter !== 'All') result = result.filter((p) => p.department === deptFilter);
    if (statusFilter !== 'All') {
      const statusKey = statusFilter.toLowerCase().replace(' ', '-') as AdminTeacher['status'];
      result = result.filter((p) => p.status === statusKey);
    }
    return result;
  }, [allStaff, activeTab, search, deptFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  const teacherCount = allStaff.filter((p) => p.role === 'teacher').length;
  const staffCount = allStaff.filter((p) => p.role === 'staff').length;
  const onLeaveCount = allStaff.filter((p) => p.status === 'on-leave').length;
  const totalSalary = allStaff.filter((p) => p.status !== 'resigned').reduce((s, p) => s + p.salary, 0);

  function getStatusBadge(status: string) {
    switch (status) {
      case 'active': return styles.statusActive;
      case 'on-leave': return styles.statusOnLeave;
      case 'resigned': return styles.statusResigned;
      default: return '';
    }
  }

  function getStatusLabel(status: string) {
    switch (status) {
      case 'active': return 'Active';
      case 'on-leave': return 'On Leave';
      case 'resigned': return 'Resigned';
      default: return status;
    }
  }

  return (
    <div className={styles.page}>
      {/* ── Header ── */}
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Teacher & Staff Management</h1>
        <div className={styles.headerActions}>
          <button className={styles.exportBtn} onClick={() => alert('Data exported successfully!')}>
            <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M10 3v10M6 9l4 4 4-4" />
              <path d="M3 15v2h14v-2" />
            </svg>
            Export
          </button>
          <button className={styles.addBtn} onClick={() => setShowAddModal(true)}>
            <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M10 4v12M4 10h12" />
            </svg>
            Add Employee
          </button>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: '#ede9fe', color: '#7c3aed' }}>
            <svg width="22" height="22" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="7" cy="6" r="3" />
              <path d="M2 16c0-3 2.5-5 5-5s5 2 5 5" />
              <circle cx="14" cy="7" r="2" />
              <path d="M14 11c2 0 4 1.5 4 4" />
            </svg>
          </div>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>Total Employees</div>
            <div className={styles.statValue}>{allStaff.length}</div>
            <div className={styles.statSub}>{teacherCount} teachers + {staffCount} staff</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: '#e3f2fd', color: '#1565c0' }}>
            <svg width="22" height="22" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="10" cy="5" r="3" />
              <path d="M4 17c0-3.5 2.7-6 6-6s6 2.5 6 6" />
              <path d="M10 11v3M8 13h4" />
            </svg>
          </div>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>Teachers</div>
            <div className={styles.statValue}>{teacherCount}</div>
            <div className={styles.statSub}>Teaching faculty</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: '#fff3e0', color: '#e65100' }}>
            <svg width="22" height="22" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="10" cy="10" r="8" />
              <path d="M10 6v4l2.5 2.5" />
            </svg>
          </div>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>On Leave</div>
            <div className={styles.statValue}>{onLeaveCount}</div>
            <div className={styles.statSub}>Currently away</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: '#e8f5e9', color: '#2e7d32' }}>
            <svg width="22" height="22" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="4" width="16" height="12" rx="2" />
              <path d="M2 8h16" />
              <path d="M6 12h3" />
            </svg>
          </div>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>Monthly Payroll</div>
            <div className={styles.statValue}>{formatINR(totalSalary)}</div>
            <div className={styles.statSub}>Total salary expense</div>
          </div>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className={styles.tabRow}>
        <button className={`${styles.tab} ${activeTab === 'all' ? styles.tabActive : ''}`} onClick={() => { setActiveTab('all'); setCurrentPage(1); }}>
          All ({allStaff.length})
        </button>
        <button className={`${styles.tab} ${activeTab === 'teachers' ? styles.tabActive : ''}`} onClick={() => { setActiveTab('teachers'); setCurrentPage(1); }}>
          Teachers ({teacherCount})
        </button>
        <button className={`${styles.tab} ${activeTab === 'staff' ? styles.tabActive : ''}`} onClick={() => { setActiveTab('staff'); setCurrentPage(1); }}>
          Support Staff ({staffCount})
        </button>
      </div>

      {/* ── Filters ── */}
      <div className={styles.filtersBar}>
        <div className={styles.searchBox}>
          <svg className={styles.searchIcon} width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <circle cx="9" cy="9" r="6" />
            <path d="M14 14l4 4" />
          </svg>
          <input
            className={styles.searchInput}
            type="text"
            placeholder="Search by name, employee ID, or department..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
          />
        </div>
        <select className={styles.filterSelect} value={deptFilter} onChange={(e) => { setDeptFilter(e.target.value); setCurrentPage(1); }}>
          {DEPARTMENTS.map((d) => (
            <option key={d} value={d}>{d === 'All' ? 'All Departments' : d}</option>
          ))}
        </select>
        <select className={styles.filterSelect} value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}>
          {STATUS_FILTERS.map((s) => (
            <option key={s} value={s}>{s === 'All' ? 'All Status' : s}</option>
          ))}
        </select>
      </div>

      {/* ── Table ── */}
      <div className={styles.tableCard}>
        <div className={styles.tableScroll}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Employee</th>
                <th>ID</th>
                <th>Department</th>
                <th>Designation</th>
                <th>Role</th>
                <th>Experience</th>
                <th>Salary</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((person, idx) => {
                const bgColor = AVATAR_COLORS[(idx + (currentPage - 1) * perPage) % AVATAR_COLORS.length];
                return (
                  <tr key={person.id} onClick={() => setSelectedPerson(person)}>
                    <td>
                      <div className={styles.personCell}>
                        <div className={styles.personAvatar} style={{ background: bgColor + '18', color: bgColor }}>
                          {getInitials(person.name)}
                        </div>
                        <div>
                          <div className={styles.personName}>{person.name}</div>
                          <div className={styles.personSub}>{person.phone}</div>
                        </div>
                      </div>
                    </td>
                    <td>{person.employeeId}</td>
                    <td>{person.department}</td>
                    <td>{person.designation}</td>
                    <td>
                      <span className={`${styles.roleBadge} ${person.role === 'teacher' ? styles.roleTeacher : styles.roleStaff}`}>
                        {person.role}
                      </span>
                    </td>
                    <td>{person.experience} yrs</td>
                    <td>{formatINR(person.salary)}</td>
                    <td>
                      <span className={`${styles.statusBadge} ${getStatusBadge(person.status)}`}>
                        {getStatusLabel(person.status)}
                      </span>
                    </td>
                    <td>
                      <button className={styles.actionBtn} onClick={(e) => { e.stopPropagation(); setSelectedPerson(person); }} title="View Details">
                        <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="10" cy="10" r="2" />
                          <path d="M2 10s3-6 8-6 8 6 8 6-3 6-8 6-8-6-8-6z" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className={styles.tableFooter}>
          <span>Showing {((currentPage - 1) * perPage) + 1}-{Math.min(currentPage * perPage, filtered.length)} of {filtered.length} employees</span>
          <div className={styles.pagination}>
            <button className={`${styles.pageBtn} ${currentPage === 1 ? styles.pageBtnDisabled : ''}`} onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}>
              <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 4l-6 6 6 6" /></svg>
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button key={p} className={`${styles.pageBtn} ${p === currentPage ? styles.pageBtnActive : ''}`} onClick={() => setCurrentPage(p)}>{p}</button>
            ))}
            <button className={`${styles.pageBtn} ${currentPage === totalPages ? styles.pageBtnDisabled : ''}`} onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}>
              <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M8 4l6 6-6 6" /></svg>
            </button>
          </div>
        </div>
      </div>

      {/* ── Detail Modal ── */}
      {selectedPerson && (
        <div className={styles.modalOverlay} onClick={() => setSelectedPerson(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Employee Details</h2>
              <button className={styles.modalClose} onClick={() => setSelectedPerson(null)}>
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 5l10 10M15 5L5 15" /></svg>
              </button>
            </div>
            <div className={styles.modalBody}>
              {(() => {
                const p = selectedPerson;
                const bgColor = AVATAR_COLORS[allStaff.indexOf(p) % AVATAR_COLORS.length];
                return (
                  <>
                    <div className={styles.detailTop}>
                      <div className={styles.detailAvatar} style={{ background: bgColor + '18', color: bgColor }}>
                        {getInitials(p.name)}
                      </div>
                      <div>
                        <div className={styles.detailName}>{p.name}</div>
                        <div className={styles.detailDesignation}>{p.designation} &middot; {p.department}</div>
                      </div>
                    </div>

                    <div className={styles.metricsRow}>
                      <div className={styles.metricCard}>
                        <div className={styles.metricValue}>{p.experience} yrs</div>
                        <div className={styles.metricLabel}>Experience</div>
                      </div>
                      <div className={styles.metricCard}>
                        <div className={styles.metricValue}>{formatINR(p.salary)}</div>
                        <div className={styles.metricLabel}>Monthly Salary</div>
                      </div>
                      <div className={styles.metricCard}>
                        <div className={styles.metricValue}>
                          <span className={`${styles.statusBadge} ${getStatusBadge(p.status)}`}>{getStatusLabel(p.status)}</span>
                        </div>
                        <div className={styles.metricLabel}>Status</div>
                      </div>
                    </div>

                    <hr className={styles.detailDivider} />

                    <div className={styles.detailGrid}>
                      <div className={styles.detailField}>
                        <span className={styles.detailLabel}>Employee ID</span>
                        <span className={styles.detailValue}>{p.employeeId}</span>
                      </div>
                      <div className={styles.detailField}>
                        <span className={styles.detailLabel}>Role</span>
                        <span className={styles.detailValue} style={{ textTransform: 'capitalize' }}>{p.role}</span>
                      </div>
                      <div className={styles.detailField}>
                        <span className={styles.detailLabel}>Gender</span>
                        <span className={styles.detailValue}>{p.gender}</span>
                      </div>
                      <div className={styles.detailField}>
                        <span className={styles.detailLabel}>Date of Birth</span>
                        <span className={styles.detailValue}>{formatDate(p.dob)}</span>
                      </div>
                      <div className={styles.detailField}>
                        <span className={styles.detailLabel}>Phone</span>
                        <span className={styles.detailValue}>{p.phone}</span>
                      </div>
                      <div className={styles.detailField}>
                        <span className={styles.detailLabel}>Email</span>
                        <span className={styles.detailValue}>{p.email}</span>
                      </div>
                      <div className={styles.detailField}>
                        <span className={styles.detailLabel}>Qualification</span>
                        <span className={styles.detailValue}>{p.qualification}</span>
                      </div>
                      <div className={styles.detailField}>
                        <span className={styles.detailLabel}>Joining Date</span>
                        <span className={styles.detailValue}>{formatDate(p.joiningDate)}</span>
                      </div>
                      {p.classTeacherOf && (
                        <div className={styles.detailField}>
                          <span className={styles.detailLabel}>Class Teacher Of</span>
                          <span className={styles.detailValue}>Class {p.classTeacherOf}</span>
                        </div>
                      )}
                      <div className={`${styles.detailField}`} style={{ gridColumn: '1 / -1' }}>
                        <span className={styles.detailLabel}>Address</span>
                        <span className={styles.detailValue}>{p.address}</span>
                      </div>
                      {p.subjects.length > 0 && (
                        <div className={`${styles.detailField}`} style={{ gridColumn: '1 / -1' }}>
                          <span className={styles.detailLabel}>Subjects</span>
                          <div className={styles.subjectsWrap}>
                            {p.subjects.map((sub) => (
                              <span key={sub} className={styles.subjectChip}>{sub}</span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                );
              })()}
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.cancelBtn} onClick={() => setSelectedPerson(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Add Employee Modal ── */}
      {showAddModal && (
        <div className={styles.modalOverlay} onClick={() => setShowAddModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Add New Employee</h2>
              <button className={styles.modalClose} onClick={() => setShowAddModal(false)}>
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 5l10 10M15 5L5 15" /></svg>
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Full Name</label>
                  <input className={styles.formInput} type="text" placeholder="Employee name" />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Employee ID</label>
                  <input className={styles.formInput} type="text" placeholder="e.g. EMP055" />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Role</label>
                  <select className={styles.formSelect}>
                    <option value="teacher">Teacher</option>
                    <option value="staff">Support Staff</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Gender</label>
                  <select className={styles.formSelect}>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Department</label>
                  <select className={styles.formSelect}>
                    {DEPARTMENTS.filter(d => d !== 'All').map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Designation</label>
                  <input className={styles.formInput} type="text" placeholder="e.g. Senior Teacher" />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Phone</label>
                  <input className={styles.formInput} type="tel" placeholder="+91 97001 10001" />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Email</label>
                  <input className={styles.formInput} type="email" placeholder="name@schoolai.in" />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Qualification</label>
                  <input className={styles.formInput} type="text" placeholder="e.g. M.Sc, B.Ed" />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Experience (years)</label>
                  <input className={styles.formInput} type="number" placeholder="e.g. 10" />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Date of Birth</label>
                  <input className={styles.formInput} type="date" />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Salary (Monthly)</label>
                  <input className={styles.formInput} type="number" placeholder="e.g. 45000" />
                </div>
                <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
                  <label className={styles.formLabel}>Address</label>
                  <input className={styles.formInput} type="text" placeholder="Full address" />
                </div>
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.cancelBtn} onClick={() => setShowAddModal(false)}>Cancel</button>
              <button className={styles.submitBtn} onClick={() => setShowAddModal(false)}>Add Employee</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
