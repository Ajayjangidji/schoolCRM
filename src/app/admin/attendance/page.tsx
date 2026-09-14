'use client';

import { useState } from 'react';
import { getClassAttendance } from '@/hooks/use-admin-data';
import { formatDate } from '@/lib/utils';
import styles from './attendance.module.css';

export default function AdminAttendancePage() {
  const allRecords = getClassAttendance();
  const [search, setSearch] = useState('');
  const [classFilter, setClassFilter] = useState('all');

  const totalStudents = allRecords.reduce((s, r) => s + r.totalStudents, 0);
  const totalPresent = allRecords.reduce((s, r) => s + r.present, 0);
  const totalAbsent = allRecords.reduce((s, r) => s + r.absent, 0);
  const totalLate = allRecords.reduce((s, r) => s + r.late, 0);
  const avgPercent = totalStudents > 0 ? Math.round((totalPresent / totalStudents) * 100) : 0;

  const classes = [...new Set(allRecords.map((r) => r.class))].sort((a, b) => Number(a) - Number(b));

  const filtered = allRecords.filter((r) => {
    if (classFilter !== 'all' && r.class !== classFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return r.classTeacher.toLowerCase().includes(q) || `class ${r.class}`.includes(q) || r.section.toLowerCase().includes(q);
    }
    return true;
  });

  function getPercentBadge(present: number, total: number) {
    const pct = Math.round((present / total) * 100);
    if (pct >= 90) return { cls: styles.badgeGood, text: `${pct}%` };
    if (pct >= 80) return { cls: styles.badgeWarn, text: `${pct}%` };
    return { cls: styles.badgeLow, text: `${pct}%` };
  }

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Attendance Overview</h1>
        <div className={styles.dateSelector}>
          <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>Date:</span>
          <input className={styles.dateInput} type="date" defaultValue={allRecords[0]?.date || '2024-09-12'} />
        </div>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: '#ede9fe', color: '#7c3aed' }}>
            <svg width="22" height="22" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="7" cy="5" r="3" /><circle cx="14" cy="6" r="2.5" /><path d="M1 17c0-3 2-5.5 6-5.5s6 2.5 6 5.5" /><path d="M14 9c2.5 0 4.5 1.5 4.5 4" /></svg>
          </div>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>Total Students</div>
            <div className={styles.statValue}>{totalStudents.toLocaleString('en-IN')}</div>
            <div className={styles.statSub}>Across {allRecords.length} sections</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: '#e8f5e9', color: '#2e7d32' }}>
            <svg width="22" height="22" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 10l2.5 2.5L14 7" /><circle cx="10" cy="10" r="8" /></svg>
          </div>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>Present Today</div>
            <div className={styles.statValue}>{totalPresent.toLocaleString('en-IN')}</div>
            <div className={styles.statSub}>{avgPercent}% attendance rate</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: '#ffebee', color: '#c62828' }}>
            <svg width="22" height="22" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 6l8 8M14 6l-8 8" /><circle cx="10" cy="10" r="8" /></svg>
          </div>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>Absent Today</div>
            <div className={styles.statValue}>{totalAbsent}</div>
            <div className={styles.statSub}>{Math.round((totalAbsent / totalStudents) * 100)}% absent rate</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: '#fff3e0', color: '#e65100' }}>
            <svg width="22" height="22" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="10" cy="10" r="8" /><path d="M10 5v5l3 2" /></svg>
          </div>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>Late Arrivals</div>
            <div className={styles.statValue}>{totalLate}</div>
            <div className={styles.statSub}>Came after assembly</div>
          </div>
        </div>
      </div>

      <div className={styles.filtersBar}>
        <div className={styles.searchBox}>
          <svg className={styles.searchIcon} width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="9" cy="9" r="6" /><path d="M13.5 13.5L17 17" /></svg>
          <input className={styles.searchInput} type="text" placeholder="Search by class teacher..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select className={styles.filterSelect} value={classFilter} onChange={(e) => setClassFilter(e.target.value)}>
          <option value="all">All Classes</option>
          {classes.map((c) => <option key={c} value={c}>Class {c}</option>)}
        </select>
      </div>

      {filtered.length === 0 && <div className={styles.emptyState}>No attendance records found.</div>}

      {filtered.length > 0 && (
        <div className={styles.tableCard}>
          <div className={styles.tableScroll}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Class</th>
                  <th>Section</th>
                  <th>Total</th>
                  <th>Present</th>
                  <th>Absent</th>
                  <th>Late</th>
                  <th>Attendance</th>
                  <th>Rate</th>
                  <th>Class Teacher</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => {
                  const pct = getPercentBadge(r.present, r.totalStudents);
                  const pW = (r.present / r.totalStudents) * 100;
                  const aW = (r.absent / r.totalStudents) * 100;
                  const lW = (r.late / r.totalStudents) * 100;
                  return (
                    <tr key={r.id}>
                      <td><span className={styles.classLabel}>Class {r.class}</span></td>
                      <td><span className={styles.section}>{r.section}</span></td>
                      <td>{r.totalStudents}</td>
                      <td style={{ color: '#2e7d32', fontWeight: 600 }}>{r.present}</td>
                      <td style={{ color: '#c62828', fontWeight: 600 }}>{r.absent}</td>
                      <td style={{ color: '#e65100', fontWeight: 600 }}>{r.late}</td>
                      <td>
                        <div className={styles.attendBar}>
                          <div className={styles.attendPresent} style={{ width: `${pW}%` }} />
                          <div className={styles.attendAbsent} style={{ width: `${aW}%` }} />
                          <div className={styles.attendLate} style={{ width: `${lW}%` }} />
                        </div>
                      </td>
                      <td><span className={`${styles.badge} ${pct.cls}`}>{pct.text}</span></td>
                      <td>{r.classTeacher}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
