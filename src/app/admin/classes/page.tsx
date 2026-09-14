'use client';

import { useState, useMemo } from 'react';
import { getAdminClasses } from '@/hooks/use-admin-data';
import type { AdminClass } from '@/hooks/use-admin-data';
import styles from './classes.module.css';

const CLASS_COLORS: Record<string, { bg: string; color: string }> = {
  '1': { bg: '#ede9fe', color: '#7c3aed' },
  '2': { bg: '#e3f2fd', color: '#1565c0' },
  '3': { bg: '#e8f5e9', color: '#2e7d32' },
  '4': { bg: '#fff3e0', color: '#e65100' },
  '5': { bg: '#fce4ec', color: '#c62828' },
  '6': { bg: '#e0f2f1', color: '#00695c' },
  '7': { bg: '#f3e5f5', color: '#7b1fa2' },
  '8': { bg: '#e1f5fe', color: '#0277bd' },
  '9': { bg: '#fff8e1', color: '#f57f17' },
  '10': { bg: '#efebe9', color: '#4e342e' },
  '11': { bg: '#e8eaf6', color: '#283593' },
  '12': { bg: '#fbe9e7', color: '#bf360c' },
};

const CLASSES_LIST = ['All', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
const ALL_SUBJECTS = ['English', 'Hindi', 'Mathematics', 'Science', 'Social Studies', 'Computer Science', 'EVS', 'Art', 'Physical Education', 'Music', 'Sanskrit', 'Physics', 'Chemistry', 'Biology', 'Economics', 'Accounts', 'Business Studies'];

type ViewMode = 'grid' | 'table';

export default function AdminClassesPage() {
  const allClasses = getAdminClasses();

  const [search, setSearch] = useState('');
  const [classFilter, setClassFilter] = useState('All');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [selectedClass, setSelectedClass] = useState<AdminClass | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);

  const filtered = useMemo(() => {
    let result = allClasses;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((c) =>
        c.classTeacher.toLowerCase().includes(q) ||
        c.room.toLowerCase().includes(q) ||
        `${c.class}-${c.section}`.toLowerCase().includes(q)
      );
    }
    if (classFilter !== 'All') result = result.filter((c) => c.class === classFilter);
    return result;
  }, [allClasses, search, classFilter]);

  const totalStudents = allClasses.reduce((s, c) => s + c.totalStudents, 0);
  const totalCapacity = allClasses.reduce((s, c) => s + c.maxCapacity, 0);
  const avgAttendance = Math.round(allClasses.reduce((s, c) => s + c.avgAttendance, 0) / allClasses.length);
  const avgMarks = Math.round(allClasses.reduce((s, c) => s + c.avgMarks, 0) / allClasses.length);

  function getCapacityStyle(students: number, max: number) {
    const pct = (students / max) * 100;
    if (pct >= 98) return { badge: styles.capacityFull, label: 'Full', color: '#c62828' };
    if (pct >= 90) return { badge: styles.capacityWarn, label: `${students}/${max}`, color: '#e65100' };
    return { badge: styles.capacityOk, label: `${students}/${max}`, color: '#2e7d32' };
  }

  return (
    <div className={styles.page}>
      {/* ── Header ── */}
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Class & Section Management</h1>
        <div className={styles.headerActions}>
          <button className={styles.addBtn} onClick={() => setShowAddModal(true)}>
            <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M10 4v12M4 10h12" />
            </svg>
            Add Class
          </button>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: '#ede9fe', color: '#7c3aed' }}>
            <svg width="22" height="22" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="3" width="16" height="12" rx="1" />
              <path d="M2 7h16M7 7v8M13 7v8" />
            </svg>
          </div>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>Total Classes</div>
            <div className={styles.statValue}>{allClasses.length}</div>
            <div className={styles.statSub}>12 grades, 2 sections each</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: '#e3f2fd', color: '#1565c0' }}>
            <svg width="22" height="22" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="7" cy="6" r="3" />
              <path d="M2 16c0-3 2.5-5 5-5s5 2 5 5" />
              <circle cx="14" cy="7" r="2" />
              <path d="M14 11c2 0 4 1.5 4 4" />
            </svg>
          </div>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>Total Enrolled</div>
            <div className={styles.statValue}>{totalStudents.toLocaleString('en-IN')}</div>
            <div className={styles.statSub}>Capacity: {totalCapacity}</div>
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
            <div className={styles.statLabel}>Avg Attendance</div>
            <div className={styles.statValue}>{avgAttendance}%</div>
            <div className={styles.statSub}>Across all classes</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: '#fff3e0', color: '#e65100' }}>
            <svg width="22" height="22" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 2h12v16H4z" />
              <path d="M7 6h6M7 9h6M7 12h4" />
            </svg>
          </div>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>Avg Marks</div>
            <div className={styles.statValue}>{avgMarks}%</div>
            <div className={styles.statSub}>School average</div>
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
            placeholder="Search by class, teacher, or room..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select className={styles.filterSelect} value={classFilter} onChange={(e) => setClassFilter(e.target.value)}>
          {CLASSES_LIST.map((c) => (
            <option key={c} value={c}>{c === 'All' ? 'All Classes' : `Class ${c}`}</option>
          ))}
        </select>
        <div className={styles.viewToggle}>
          <button className={`${styles.viewBtn} ${viewMode === 'grid' ? styles.viewBtnActive : ''}`} onClick={() => setViewMode('grid')} title="Grid View">
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <rect x="2" y="2" width="7" height="7" rx="1" />
              <rect x="11" y="2" width="7" height="7" rx="1" />
              <rect x="2" y="11" width="7" height="7" rx="1" />
              <rect x="11" y="11" width="7" height="7" rx="1" />
            </svg>
          </button>
          <button className={`${styles.viewBtn} ${viewMode === 'table' ? styles.viewBtnActive : ''}`} onClick={() => setViewMode('table')} title="Table View">
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M3 5h14M3 10h14M3 15h14" />
            </svg>
          </button>
        </div>
      </div>

      {/* ── Grid View ── */}
      {viewMode === 'grid' && (
        <div className={styles.classGrid}>
          {filtered.map((cls) => {
            const colors = CLASS_COLORS[cls.class] || CLASS_COLORS['1'];
            const cap = getCapacityStyle(cls.totalStudents, cls.maxCapacity);
            return (
              <div key={cls.id} className={styles.classCard} onClick={() => setSelectedClass(cls)}>
                <div className={styles.classCardTop}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <div className={styles.classLabel} style={{ background: colors.bg, color: colors.color }}>
                      {cls.class}{cls.section}
                    </div>
                    <div className={styles.classInfo}>
                      <div className={styles.className}>Class {cls.class} - Section {cls.section}</div>
                      <div className={styles.classRoom}>{cls.room}</div>
                      <div className={styles.classTeacher}>
                        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="10" cy="5" r="3" />
                          <path d="M4 17c0-3.5 2.7-6 6-6s6 2.5 6 6" />
                        </svg>
                        {cls.classTeacher}
                      </div>
                    </div>
                  </div>
                  <span className={`${styles.capacityBadge} ${cap.badge}`}>{cap.label}</span>
                </div>

                <div className={styles.classCardBody}>
                  <div className={styles.classMetrics}>
                    <div className={styles.classMetric}>
                      <div className={styles.classMetricValue}>{cls.totalStudents}</div>
                      <div className={styles.classMetricLabel}>Students</div>
                    </div>
                    <div className={styles.classMetric}>
                      <div className={styles.classMetricValue}>{cls.avgAttendance}%</div>
                      <div className={styles.classMetricLabel}>Attendance</div>
                    </div>
                    <div className={styles.classMetric}>
                      <div className={styles.classMetricValue}>{cls.avgMarks}%</div>
                      <div className={styles.classMetricLabel}>Avg Marks</div>
                    </div>
                  </div>
                </div>

                <div className={styles.classCardFooter}>
                  {cls.subjects.slice(0, 5).map((sub) => (
                    <span key={sub} className={styles.subjectTag}>{sub}</span>
                  ))}
                  {cls.subjects.length > 5 && (
                    <span className={styles.subjectTag}>+{cls.subjects.length - 5}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Table View ── */}
      {viewMode === 'table' && (
        <div className={styles.tableCard}>
          <div className={styles.tableScroll}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Class</th>
                  <th>Room</th>
                  <th>Class Teacher</th>
                  <th>Students</th>
                  <th>Capacity</th>
                  <th>Attendance</th>
                  <th>Avg Marks</th>
                  <th>Subjects</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((cls) => {
                  const cap = getCapacityStyle(cls.totalStudents, cls.maxCapacity);
                  const capPct = (cls.totalStudents / cls.maxCapacity) * 100;
                  const attColor = cls.avgAttendance >= 92 ? '#2e7d32' : cls.avgAttendance >= 88 ? '#e65100' : '#c62828';
                  const marksColor = cls.avgMarks >= 78 ? '#2e7d32' : cls.avgMarks >= 72 ? '#e65100' : '#c62828';
                  return (
                    <tr key={cls.id} onClick={() => setSelectedClass(cls)}>
                      <td style={{ fontWeight: 600 }}>{cls.class}-{cls.section}</td>
                      <td>{cls.room}</td>
                      <td style={{ color: 'var(--text-secondary)' }}>{cls.classTeacher}</td>
                      <td>{cls.totalStudents}</td>
                      <td>
                        <span className={styles.capacityBar}>
                          <span className={styles.capacityFill} style={{ width: `${capPct}%`, background: cap.color }} />
                        </span>
                        <span style={{ color: cap.color, fontWeight: 600, fontSize: '12px' }}>{cap.label}</span>
                      </td>
                      <td>
                        <span className={styles.progressBar}>
                          <span className={styles.progressFill} style={{ width: `${cls.avgAttendance}%`, background: attColor }} />
                        </span>
                        {cls.avgAttendance}%
                      </td>
                      <td>
                        <span className={styles.progressBar}>
                          <span className={styles.progressFill} style={{ width: `${cls.avgMarks}%`, background: marksColor }} />
                        </span>
                        {cls.avgMarks}%
                      </td>
                      <td>{cls.subjects.length} subjects</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Class Detail Modal ── */}
      {selectedClass && (
        <div className={styles.modalOverlay} onClick={() => setSelectedClass(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Class Details</h2>
              <button className={styles.modalClose} onClick={() => setSelectedClass(null)}>
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 5l10 10M15 5L5 15" /></svg>
              </button>
            </div>
            <div className={styles.modalBody}>
              {(() => {
                const cls = selectedClass;
                const colors = CLASS_COLORS[cls.class] || CLASS_COLORS['1'];
                const capPct = Math.round((cls.totalStudents / cls.maxCapacity) * 100);
                return (
                  <>
                    <div className={styles.detailTop}>
                      <div className={styles.detailClassLabel} style={{ background: colors.bg, color: colors.color }}>
                        {cls.class}{cls.section}
                      </div>
                      <div>
                        <div className={styles.detailClassName}>Class {cls.class} - Section {cls.section}</div>
                        <div className={styles.detailClassRoom}>{cls.room}</div>
                      </div>
                    </div>

                    <div className={styles.metricsRow}>
                      <div className={styles.metricCard}>
                        <div className={styles.metricValue}>{cls.totalStudents}/{cls.maxCapacity}</div>
                        <div className={styles.metricLabel}>Capacity ({capPct}%)</div>
                      </div>
                      <div className={styles.metricCard}>
                        <div className={styles.metricValue}>{cls.avgAttendance}%</div>
                        <div className={styles.metricLabel}>Attendance</div>
                      </div>
                      <div className={styles.metricCard}>
                        <div className={styles.metricValue}>{cls.avgMarks}%</div>
                        <div className={styles.metricLabel}>Avg Marks</div>
                      </div>
                    </div>

                    <hr className={styles.detailDivider} />

                    <div className={styles.detailGrid}>
                      <div className={styles.detailField}>
                        <span className={styles.detailLabel}>Class Teacher</span>
                        <span className={styles.detailValue}>{cls.classTeacher}</span>
                      </div>
                      <div className={styles.detailField}>
                        <span className={styles.detailLabel}>Room</span>
                        <span className={styles.detailValue}>{cls.room}</span>
                      </div>
                      <div className={styles.detailField}>
                        <span className={styles.detailLabel}>Total Students</span>
                        <span className={styles.detailValue}>{cls.totalStudents}</span>
                      </div>
                      <div className={styles.detailField}>
                        <span className={styles.detailLabel}>Max Capacity</span>
                        <span className={styles.detailValue}>{cls.maxCapacity}</span>
                      </div>
                      <div className={styles.detailField}>
                        <span className={styles.detailLabel}>Status</span>
                        <span className={styles.detailValue} style={{ textTransform: 'capitalize' }}>{cls.status}</span>
                      </div>
                    </div>

                    <hr className={styles.detailDivider} />

                    <div className={styles.detailField}>
                      <span className={styles.detailLabel}>Subjects ({cls.subjects.length})</span>
                      <div className={styles.subjectsWrap} style={{ marginTop: '6px' }}>
                        {cls.subjects.map((sub) => (
                          <span key={sub} className={styles.subjectTag}>{sub}</span>
                        ))}
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.cancelBtn} onClick={() => setSelectedClass(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Add Class Modal ── */}
      {showAddModal && (
        <div className={styles.modalOverlay} onClick={() => setShowAddModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Add New Class</h2>
              <button className={styles.modalClose} onClick={() => setShowAddModal(false)}>
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 5l10 10M15 5L5 15" /></svg>
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Class</label>
                  <select className={styles.formSelect}>
                    {CLASSES_LIST.filter(c => c !== 'All').map((c) => (
                      <option key={c} value={c}>Class {c}</option>
                    ))}
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Section</label>
                  <select className={styles.formSelect}>
                    <option value="A">Section A</option>
                    <option value="B">Section B</option>
                    <option value="C">Section C</option>
                    <option value="D">Section D</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Room</label>
                  <input className={styles.formInput} type="text" placeholder="e.g. Room 105" />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Max Capacity</label>
                  <input className={styles.formInput} type="number" placeholder="e.g. 45" />
                </div>
                <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
                  <label className={styles.formLabel}>Class Teacher</label>
                  <select className={styles.formSelect}>
                    <option value="">Select teacher...</option>
                    <option>Mrs. Priya Sharma</option>
                    <option>Mr. Rajesh Kumar</option>
                    <option>Mrs. Sunita Verma</option>
                    <option>Mr. Amit Singh</option>
                    <option>Mrs. Neha Gupta</option>
                    <option>Mr. Vikram Patel</option>
                  </select>
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
              <button className={styles.submitBtn} onClick={() => { setShowAddModal(false); setSelectedSubjects([]); }}>Add Class</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
