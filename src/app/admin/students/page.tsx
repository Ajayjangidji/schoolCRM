'use client';

import { useState, useMemo } from 'react';
import { getAdminStudents, getSchoolStats } from '@/hooks/use-admin-data';
import { getInitials, formatDate } from '@/lib/utils';
import type { AdminStudent } from '@/hooks/use-admin-data';
import styles from './students.module.css';

const AVATAR_COLORS = ['#7c3aed', '#1565c0', '#2e7d32', '#e65100', '#c62828', '#00695c', '#4527a0', '#ef6c00', '#0277bd', '#6a1b9a'];

const CLASSES = ['All', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
const SECTIONS = ['All', 'A', 'B'];
const FEE_FILTERS = ['All', 'Paid', 'Pending', 'Overdue'];

export default function AdminStudentsPage() {
  const allStudents = getAdminStudents();
  const stats = getSchoolStats();

  const [search, setSearch] = useState('');
  const [classFilter, setClassFilter] = useState('All');
  const [sectionFilter, setSectionFilter] = useState('All');
  const [feeFilter, setFeeFilter] = useState('All');
  const [selectedStudent, setSelectedStudent] = useState<AdminStudent | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 10;

  const filtered = useMemo(() => {
    let result = allStudents;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (s) => s.name.toLowerCase().includes(q) || s.rollNumber.includes(q) || s.fatherName.toLowerCase().includes(q)
      );
    }
    if (classFilter !== 'All') result = result.filter((s) => s.class === classFilter);
    if (sectionFilter !== 'All') result = result.filter((s) => s.section === sectionFilter);
    if (feeFilter !== 'All') result = result.filter((s) => s.feeStatus === feeFilter.toLowerCase());
    return result;
  }, [allStudents, search, classFilter, sectionFilter, feeFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  const paidCount = allStudents.filter((s) => s.feeStatus === 'paid').length;
  const pendingCount = allStudents.filter((s) => s.feeStatus === 'pending').length;
  const overdueCount = allStudents.filter((s) => s.feeStatus === 'overdue').length;

  function getFeeBadge(status: string) {
    switch (status) {
      case 'paid': return styles.feePaid;
      case 'pending': return styles.feePending;
      case 'overdue': return styles.feeOverdue;
      default: return '';
    }
  }

  return (
    <div className={styles.page}>
      {/* ── Header ── */}
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Student Management</h1>
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
            Add Student
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
            <div className={styles.statLabel}>Total Students</div>
            <div className={styles.statValue}>{stats.totalStudents.toLocaleString('en-IN')}</div>
            <div className={styles.statSub}>Active enrollment</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: '#e8f5e9', color: '#2e7d32' }}>
            <svg width="22" height="22" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 10l2.5 2.5L14 7" />
              <circle cx="10" cy="10" r="8" />
            </svg>
          </div>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>Fee Paid</div>
            <div className={styles.statValue}>{paidCount}</div>
            <div className={styles.statSub}>Up to date</div>
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
            <div className={styles.statLabel}>Fee Pending</div>
            <div className={styles.statValue}>{pendingCount}</div>
            <div className={styles.statSub}>Awaiting payment</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: '#ffebee', color: '#c62828' }}>
            <svg width="22" height="22" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="10" cy="10" r="8" />
              <path d="M7 7l6 6M13 7l-6 6" />
            </svg>
          </div>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>Fee Overdue</div>
            <div className={styles.statValue}>{overdueCount}</div>
            <div className={styles.statSub}>Need follow-up</div>
          </div>
        </div>
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
            placeholder="Search by name, roll number, or parent name..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
          />
        </div>
        <select className={styles.filterSelect} value={classFilter} onChange={(e) => { setClassFilter(e.target.value); setCurrentPage(1); }}>
          {CLASSES.map((c) => (
            <option key={c} value={c}>{c === 'All' ? 'All Classes' : `Class ${c}`}</option>
          ))}
        </select>
        <select className={styles.filterSelect} value={sectionFilter} onChange={(e) => { setSectionFilter(e.target.value); setCurrentPage(1); }}>
          {SECTIONS.map((s) => (
            <option key={s} value={s}>{s === 'All' ? 'All Sections' : `Section ${s}`}</option>
          ))}
        </select>
        <select className={styles.filterSelect} value={feeFilter} onChange={(e) => { setFeeFilter(e.target.value); setCurrentPage(1); }}>
          {FEE_FILTERS.map((f) => (
            <option key={f} value={f}>{f === 'All' ? 'Fee Status' : f}</option>
          ))}
        </select>
      </div>

      {/* ── Table ── */}
      <div className={styles.tableCard}>
        <div className={styles.tableScroll}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Student</th>
                <th>Roll No</th>
                <th>Class</th>
                <th>Gender</th>
                <th>Attendance</th>
                <th>Avg Marks</th>
                <th>Fee Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((student, idx) => {
                const bgColor = AVATAR_COLORS[(idx + (currentPage - 1) * perPage) % AVATAR_COLORS.length];
                const attColor = student.attendance >= 93 ? '#2e7d32' : student.attendance >= 88 ? '#e65100' : '#c62828';
                const marksColor = student.avgMarks >= 85 ? '#2e7d32' : student.avgMarks >= 70 ? '#e65100' : '#c62828';
                return (
                  <tr key={student.id} onClick={() => setSelectedStudent(student)}>
                    <td>
                      <div className={styles.studentCell}>
                        <div className={styles.studentAvatar} style={{ background: bgColor + '18', color: bgColor }}>
                          {getInitials(student.name)}
                        </div>
                        <div>
                          <div className={styles.studentName}>{student.name}</div>
                          <div className={styles.studentSub}>{student.fatherName}</div>
                        </div>
                      </div>
                    </td>
                    <td>{student.rollNumber}</td>
                    <td>{student.class}-{student.section}</td>
                    <td>{student.gender}</td>
                    <td>
                      <span className={styles.progressBar}>
                        <span className={styles.progressFill} style={{ width: `${student.attendance}%`, background: attColor }} />
                      </span>
                      {student.attendance}%
                    </td>
                    <td>
                      <span className={styles.progressBar}>
                        <span className={styles.progressFill} style={{ width: `${student.avgMarks}%`, background: marksColor }} />
                      </span>
                      {student.avgMarks}%
                    </td>
                    <td>
                      <span className={`${styles.feeBadge} ${getFeeBadge(student.feeStatus)}`}>
                        {student.feeStatus}
                      </span>
                    </td>
                    <td>
                      <button
                        className={styles.actionBtn}
                        onClick={(e) => { e.stopPropagation(); setSelectedStudent(student); }}
                        title="View Details"
                      >
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

        {/* ── Pagination ── */}
        <div className={styles.tableFooter}>
          <span>Showing {((currentPage - 1) * perPage) + 1}-{Math.min(currentPage * perPage, filtered.length)} of {filtered.length} students</span>
          <div className={styles.pagination}>
            <button
              className={`${styles.pageBtn} ${currentPage === 1 ? styles.pageBtnDisabled : ''}`}
              onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
            >
              <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M12 4l-6 6 6 6" />
              </svg>
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                className={`${styles.pageBtn} ${p === currentPage ? styles.pageBtnActive : ''}`}
                onClick={() => setCurrentPage(p)}
              >
                {p}
              </button>
            ))}
            <button
              className={`${styles.pageBtn} ${currentPage === totalPages ? styles.pageBtnDisabled : ''}`}
              onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
            >
              <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M8 4l6 6-6 6" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* ── Student Detail Modal ── */}
      {selectedStudent && (
        <div className={styles.modalOverlay} onClick={() => setSelectedStudent(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Student Details</h2>
              <button className={styles.modalClose} onClick={() => setSelectedStudent(null)}>
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M5 5l10 10M15 5L5 15" />
                </svg>
              </button>
            </div>
            <div className={styles.modalBody}>
              {(() => {
                const s = selectedStudent;
                const bgColor = AVATAR_COLORS[allStudents.indexOf(s) % AVATAR_COLORS.length];
                return (
                  <>
                    <div className={styles.detailTop}>
                      <div className={styles.detailAvatar} style={{ background: bgColor + '18', color: bgColor }}>
                        {getInitials(s.name)}
                      </div>
                      <div>
                        <div className={styles.detailName}>{s.name}</div>
                        <div className={styles.detailClass}>Class {s.class}-{s.section} | Roll No: {s.rollNumber}</div>
                      </div>
                    </div>

                    <div className={styles.metricsRow}>
                      <div className={styles.metricCard}>
                        <div className={styles.metricValue}>{s.attendance}%</div>
                        <div className={styles.metricLabel}>Attendance</div>
                      </div>
                      <div className={styles.metricCard}>
                        <div className={styles.metricValue}>{s.avgMarks}%</div>
                        <div className={styles.metricLabel}>Avg Marks</div>
                      </div>
                      <div className={styles.metricCard}>
                        <div className={styles.metricValue}>
                          <span className={`${styles.feeBadge} ${getFeeBadge(s.feeStatus)}`}>{s.feeStatus}</span>
                        </div>
                        <div className={styles.metricLabel}>Fee Status</div>
                      </div>
                    </div>

                    <hr className={styles.detailDivider} />

                    <div className={styles.detailGrid}>
                      <div className={styles.detailField}>
                        <span className={styles.detailLabel}>Father&apos;s Name</span>
                        <span className={styles.detailValue}>{s.fatherName}</span>
                      </div>
                      <div className={styles.detailField}>
                        <span className={styles.detailLabel}>Mother&apos;s Name</span>
                        <span className={styles.detailValue}>{s.motherName}</span>
                      </div>
                      <div className={styles.detailField}>
                        <span className={styles.detailLabel}>Date of Birth</span>
                        <span className={styles.detailValue}>{formatDate(s.dob)}</span>
                      </div>
                      <div className={styles.detailField}>
                        <span className={styles.detailLabel}>Gender</span>
                        <span className={styles.detailValue}>{s.gender}</span>
                      </div>
                      <div className={styles.detailField}>
                        <span className={styles.detailLabel}>Blood Group</span>
                        <span className={styles.detailValue}>{s.bloodGroup}</span>
                      </div>
                      <div className={styles.detailField}>
                        <span className={styles.detailLabel}>Admission Date</span>
                        <span className={styles.detailValue}>{formatDate(s.admissionDate)}</span>
                      </div>
                      <div className={styles.detailField}>
                        <span className={styles.detailLabel}>Phone</span>
                        <span className={styles.detailValue}>{s.phone}</span>
                      </div>
                      <div className={styles.detailField}>
                        <span className={styles.detailLabel}>Email</span>
                        <span className={styles.detailValue}>{s.email}</span>
                      </div>
                      <div className={`${styles.detailField}`} style={{ gridColumn: '1 / -1' }}>
                        <span className={styles.detailLabel}>Address</span>
                        <span className={styles.detailValue}>{s.address}</span>
                      </div>
                      <div className={styles.detailField}>
                        <span className={styles.detailLabel}>Last Fee Date</span>
                        <span className={styles.detailValue}>{formatDate(s.lastFeeDate)}</span>
                      </div>
                      <div className={styles.detailField}>
                        <span className={styles.detailLabel}>Status</span>
                        <span className={styles.detailValue} style={{ textTransform: 'capitalize' }}>{s.status}</span>
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.cancelBtn} onClick={() => setSelectedStudent(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Add Student Modal ── */}
      {showAddModal && (
        <div className={styles.modalOverlay} onClick={() => setShowAddModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Add New Student</h2>
              <button className={styles.modalClose} onClick={() => setShowAddModal(false)}>
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M5 5l10 10M15 5L5 15" />
                </svg>
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Full Name</label>
                  <input className={styles.formInput} type="text" placeholder="Student full name" />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Roll Number</label>
                  <input className={styles.formInput} type="text" placeholder="e.g. 1001" />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Class</label>
                  <select className={styles.formSelect}>
                    {CLASSES.filter(c => c !== 'All').map((c) => (
                      <option key={c} value={c}>Class {c}</option>
                    ))}
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Section</label>
                  <select className={styles.formSelect}>
                    {SECTIONS.filter(s => s !== 'All').map((s) => (
                      <option key={s} value={s}>Section {s}</option>
                    ))}
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
                  <label className={styles.formLabel}>Date of Birth</label>
                  <input className={styles.formInput} type="date" />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Father&apos;s Name</label>
                  <input className={styles.formInput} type="text" placeholder="Father's name" />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Mother&apos;s Name</label>
                  <input className={styles.formInput} type="text" placeholder="Mother's name" />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Phone</label>
                  <input className={styles.formInput} type="tel" placeholder="+91 98765 43210" />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Email</label>
                  <input className={styles.formInput} type="email" placeholder="parent@email.com" />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Blood Group</label>
                  <select className={styles.formSelect}>
                    <option>A+</option><option>A-</option><option>B+</option><option>B-</option>
                    <option>O+</option><option>O-</option><option>AB+</option><option>AB-</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Admission Date</label>
                  <input className={styles.formInput} type="date" />
                </div>
                <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
                  <label className={styles.formLabel}>Address</label>
                  <input className={styles.formInput} type="text" placeholder="Full address" />
                </div>
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.cancelBtn} onClick={() => setShowAddModal(false)}>Cancel</button>
              <button className={styles.submitBtn} onClick={() => setShowAddModal(false)}>Add Student</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
