'use client';

import React, { useState, useMemo } from 'react';
import { getTeacherAttendanceRecords, getAdminTeachers } from '@/hooks/use-admin-data';
import type { TeacherAttendanceRecord } from '@/hooks/use-admin-data';
import styles from './teacher-attendance.module.css';

type Status = TeacherAttendanceRecord['status'];

const STATUS_LABELS: Record<Status, string> = {
  present: 'Present',
  absent: 'Absent',
  'half-day': 'Half-Day',
  'on-leave': 'On Leave',
  late: 'Late',
};

const STATUS_BADGE: Record<Status, string> = {
  present: 'badgePresent',
  absent: 'badgeAbsent',
  'half-day': 'badgeHalfDay',
  'on-leave': 'badgeOnLeave',
  late: 'badgeLate',
};

const CALENDAR_CLS: Record<Status, string> = {
  present: 'calendarPresent',
  absent: 'calendarAbsent',
  'half-day': 'calendarHalfDay',
  'on-leave': 'calendarOnLeave',
  late: 'calendarLate',
};

function formatDisplayDate(dateStr: string) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function TeacherAttendancePage() {
  const allRecords = getTeacherAttendanceRecords();
  const allTeachers = getAdminTeachers().filter((t) => t.role === 'teacher');

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [selectedTeacherId, setSelectedTeacherId] = useState<string | null>(null);

  const today = '2026-09-20';

  // Today's records for the default overview
  const todayRecords = useMemo(() => allRecords.filter((r) => r.date === today), [allRecords]);

  // Stats from today
  const stats = useMemo(() => {
    const totalTeachers = allTeachers.length;
    const presentToday = todayRecords.filter((r) => r.status === 'present').length;
    const absentToday = todayRecords.filter((r) => r.status === 'absent').length;
    const onLeaveToday = todayRecords.filter((r) => r.status === 'on-leave').length;
    const halfDayToday = todayRecords.filter((r) => r.status === 'half-day').length;
    return { totalTeachers, presentToday, absentToday, onLeaveToday, halfDayToday };
  }, [allTeachers, todayRecords]);

  // Selected teacher info
  const selectedTeacher = useMemo(
    () => (selectedTeacherId ? allTeachers.find((t) => t.id === selectedTeacherId) : null),
    [selectedTeacherId, allTeachers]
  );

  // Records for selected teacher
  const teacherRecords = useMemo(() => {
    if (!selectedTeacherId) return [];
    let recs = allRecords.filter((r) => r.teacherId === selectedTeacherId);
    if (dateFrom) recs = recs.filter((r) => r.date >= dateFrom);
    if (dateTo) recs = recs.filter((r) => r.date <= dateTo);
    if (statusFilter !== 'all') recs = recs.filter((r) => r.status === statusFilter);
    return recs.sort((a, b) => b.date.localeCompare(a.date));
  }, [selectedTeacherId, allRecords, dateFrom, dateTo, statusFilter]);

  // Filtered table for default (all teachers today) view
  const filteredToday = useMemo(() => {
    let recs = todayRecords;
    if (search) {
      const q = search.toLowerCase();
      recs = recs.filter((r) => {
        const teacher = allTeachers.find((t) => t.id === r.teacherId);
        return (
          r.teacherName.toLowerCase().includes(q) ||
          (teacher?.employeeId || '').toLowerCase().includes(q)
        );
      });
    }
    if (statusFilter !== 'all') recs = recs.filter((r) => r.status === statusFilter);
    return recs;
  }, [todayRecords, search, statusFilter, allTeachers]);

  // Teacher search suggestions (when typing in search and no teacher selected)
  const searchSuggestions = useMemo(() => {
    if (!search || selectedTeacherId) return [];
    const q = search.toLowerCase();
    return allTeachers.filter(
      (t) => t.name.toLowerCase().includes(q) || t.employeeId.toLowerCase().includes(q)
    ).slice(0, 5);
  }, [search, selectedTeacherId, allTeachers]);

  // Summary for selected teacher
  const summary = useMemo(() => {
    if (!selectedTeacherId) return null;
    const recs = allRecords.filter((r) => r.teacherId === selectedTeacherId);
    const total = recs.length;
    const present = recs.filter((r) => r.status === 'present').length;
    const absent = recs.filter((r) => r.status === 'absent').length;
    const halfDay = recs.filter((r) => r.status === 'half-day').length;
    const onLeave = recs.filter((r) => r.status === 'on-leave').length;
    const late = recs.filter((r) => r.status === 'late').length;
    // Half-day counts as 0.5 for attendance rate
    const effectivePresent = present + late + halfDay * 0.5;
    const rate = total > 0 ? Math.round((effectivePresent / total) * 100) : 0;
    return { total, present, absent, halfDay, onLeave, late, rate };
  }, [selectedTeacherId, allRecords]);

  // Monthly data for bar chart
  const monthlyData = useMemo(() => {
    if (!selectedTeacherId) return [];
    const recs = allRecords.filter((r) => r.teacherId === selectedTeacherId);
    const months: Record<string, { present: number; absent: number; halfDay: number; late: number; onLeave: number; label: string }> = {};
    recs.forEach((r) => {
      const key = r.date.slice(0, 7);
      if (!months[key]) {
        const d = new Date(r.date + 'T00:00:00');
        months[key] = { present: 0, absent: 0, halfDay: 0, late: 0, onLeave: 0, label: d.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) };
      }
      if (r.status === 'present') months[key].present++;
      else if (r.status === 'absent') months[key].absent++;
      else if (r.status === 'half-day') months[key].halfDay++;
      else if (r.status === 'late') months[key].late++;
      else if (r.status === 'on-leave') months[key].onLeave++;
    });
    return Object.entries(months).sort(([a], [b]) => a.localeCompare(b)).map(([, v]) => v);
  }, [selectedTeacherId, allRecords]);

  // Calendar data
  const calendarData = useMemo(() => {
    if (!selectedTeacherId) return { aug: new Map<number, Status>(), sep: new Map<number, Status>() };
    const recs = allRecords.filter((r) => r.teacherId === selectedTeacherId);
    const aug = new Map<number, Status>();
    const sep = new Map<number, Status>();
    recs.forEach((r) => {
      const d = new Date(r.date + 'T00:00:00');
      if (d.getMonth() === 7) aug.set(d.getDate(), r.status);
      else if (d.getMonth() === 8) sep.set(d.getDate(), r.status);
    });
    return { aug, sep };
  }, [selectedTeacherId, allRecords]);

  function handleExport() {
    const data = selectedTeacherId ? teacherRecords : filteredToday;
    const headers = ['Date', 'Teacher', 'Status', 'Check-in', 'Check-out', 'Remarks'];
    const rows = data.map((r) => [r.date, r.teacherName, STATUS_LABELS[r.status], r.checkIn || '-', r.checkOut || '-', r.remarks || '-']);
    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `teacher-attendance-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function selectTeacher(teacherId: string) {
    setSelectedTeacherId(teacherId);
    setSearch('');
    setStatusFilter('all');
    setDateFrom('');
    setDateTo('');
  }

  function renderBarChart() {
    if (monthlyData.length === 0) return null;
    const maxVal = Math.max(...monthlyData.map((m) => m.present + m.absent + m.halfDay + m.late + m.onLeave));
    const chartH = 180;
    const barW = 60;
    const gap = 20;
    const totalW = monthlyData.length * (barW + gap);

    return (
      <svg width="100%" viewBox={`0 0 ${Math.max(totalW, 300)} ${chartH + 40}`} style={{ overflow: 'visible' }}>
        {monthlyData.map((m, i) => {
          const x = i * (barW + gap) + 10;
          const total = m.present + m.absent + m.halfDay + m.late + m.onLeave;
          const scale = maxVal > 0 ? chartH / maxVal : 0;

          const presentH = m.present * scale;
          const lateH = m.late * scale;
          const halfDayH = m.halfDay * scale;
          const absentH = m.absent * scale;
          const onLeaveH = m.onLeave * scale;

          let y = chartH;

          const bars = [];
          // Present
          y -= presentH;
          if (presentH > 0) bars.push(<rect key="p" x={x} y={y} width={barW} height={presentH} fill="#4caf50" rx="2" />);
          // Late
          y -= lateH;
          if (lateH > 0) bars.push(<rect key="l" x={x} y={y} width={barW} height={lateH} fill="#fdd835" rx="2" />);
          // Half-day
          y -= halfDayH;
          if (halfDayH > 0) bars.push(<rect key="h" x={x} y={y} width={barW} height={halfDayH} fill="#ff9800" rx="2" />);
          // Absent
          y -= absentH;
          if (absentH > 0) bars.push(<rect key="a" x={x} y={y} width={barW} height={absentH} fill="#ef5350" rx="2" />);
          // On leave
          y -= onLeaveH;
          if (onLeaveH > 0) bars.push(<rect key="o" x={x} y={y} width={barW} height={onLeaveH} fill="#42a5f5" rx="2" />);

          return (
            <g key={i}>
              {bars}
              <text x={x + barW / 2} y={chartH + 16} textAnchor="middle" fontSize="11" fill="var(--text-secondary)">{m.label}</text>
              <text x={x + barW / 2} y={chartH + 30} textAnchor="middle" fontSize="10" fill="var(--text-tertiary)">{total} days</text>
            </g>
          );
        })}
        {/* Y-axis guide lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((frac) => (
          <line key={frac} x1="0" y1={chartH * (1 - frac)} x2={totalW} y2={chartH * (1 - frac)} stroke="var(--border-light)" strokeDasharray="4" />
        ))}
      </svg>
    );
  }

  function renderCalendarMonth(year: number, month: number, data: Map<number, Status>, label: string) {
    const firstDay = new Date(year, month, 1).getDay(); // 0=Sun
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days: React.JSX.Element[] = [];

    // Empty cells for offset
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`e${i}`} className={`${styles.calendarCell} ${styles.calendarEmpty}`} />);
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const dayOfWeek = new Date(year, month, d).getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const status = data.get(d);
      let cls = styles.calendarEmpty;
      let tooltipText = `${d} ${label}`;

      if (isWeekend) {
        cls = styles.calendarWeekend;
        tooltipText += ' (Weekend)';
      } else if (status) {
        cls = styles[CALENDAR_CLS[status]] || styles.calendarEmpty;
        tooltipText += ` - ${STATUS_LABELS[status]}`;
      }

      days.push(
        <div key={d} className={`${styles.calendarCell} ${cls}`}>
          {d}
          <span className={styles.tooltip}>{tooltipText}</span>
        </div>
      );
    }

    return (
      <div>
        <div className={styles.calendarMonthLabel}>{label}</div>
        <div className={styles.calendarGrid}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className={styles.calendarHeader}>{day}</div>
          ))}
          {days}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>
          {selectedTeacherId ? 'Teacher Attendance Detail' : 'Teacher Attendance'}
        </h1>
        <div className={styles.headerActions}>
          {selectedTeacherId && (
            <button className={styles.backBtn} onClick={() => { setSelectedTeacherId(null); setSearch(''); setStatusFilter('all'); setDateFrom(''); setDateTo(''); }}>
              <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M15 10H5M5 10l5-5M5 10l5 5" /></svg>
              Back to All Teachers
            </button>
          )}
          <button className={styles.exportBtn} onClick={handleExport}>
            <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 14v3h14v-3M10 3v10M6 7l4-4 4 4" /></svg>
            Export CSV
          </button>
        </div>
      </div>

      {/* Stats (shown in default view) */}
      {!selectedTeacherId && (
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: '#ede9fe', color: '#7c3aed' }}>
              <svg width="22" height="22" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="7" cy="5" r="3" /><circle cx="14" cy="6" r="2.5" /><path d="M1 17c0-3 2-5.5 6-5.5s6 2.5 6 5.5" /><path d="M14 9c2.5 0 4.5 1.5 4.5 4" /></svg>
            </div>
            <div className={styles.statContent}>
              <div className={styles.statLabel}>Total Teachers</div>
              <div className={styles.statValue}>{stats.totalTeachers}</div>
              <div className={styles.statSub}>Active faculty</div>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: '#e8f5e9', color: '#2e7d32' }}>
              <svg width="22" height="22" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 10l2.5 2.5L14 7" /><circle cx="10" cy="10" r="8" /></svg>
            </div>
            <div className={styles.statContent}>
              <div className={styles.statLabel}>Present Today</div>
              <div className={styles.statValue}>{stats.presentToday}</div>
              <div className={styles.statSub}>Checked in</div>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: '#ffebee', color: '#c62828' }}>
              <svg width="22" height="22" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 6l8 8M14 6l-8 8" /><circle cx="10" cy="10" r="8" /></svg>
            </div>
            <div className={styles.statContent}>
              <div className={styles.statLabel}>Absent Today</div>
              <div className={styles.statValue}>{stats.absentToday}</div>
              <div className={styles.statSub}>Not present</div>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: '#e3f2fd', color: '#1565c0' }}>
              <svg width="22" height="22" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="4" width="14" height="12" rx="2" /><path d="M3 8h14M7 2v4M13 2v4" /></svg>
            </div>
            <div className={styles.statContent}>
              <div className={styles.statLabel}>On Leave</div>
              <div className={styles.statValue}>{stats.onLeaveToday}</div>
              <div className={styles.statSub}>Approved leave</div>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: '#fff3e0', color: '#e65100' }}>
              <svg width="22" height="22" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="10" cy="10" r="8" /><path d="M10 6v4l2.5 1.5" /></svg>
            </div>
            <div className={styles.statContent}>
              <div className={styles.statLabel}>Half Day</div>
              <div className={styles.statValue}>{stats.halfDayToday}</div>
              <div className={styles.statSub}>Partial attendance</div>
            </div>
          </div>
        </div>
      )}

      {/* Search & Filters */}
      <div className={styles.filtersBar}>
        <div className={styles.searchBox}>
          <svg className={styles.searchIcon} width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="9" cy="9" r="6" /><path d="M13.5 13.5L17 17" /></svg>
          <input
            className={styles.searchInput}
            type="text"
            placeholder="Search by teacher name or employee ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {/* Dropdown suggestions */}
          {searchSuggestions.length > 0 && !selectedTeacherId && (
            <div style={{
              position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 20,
              background: 'var(--bg-secondary)', border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-lg)',
              marginTop: '4px', overflow: 'hidden',
            }}>
              {searchSuggestions.map((t) => (
                <div
                  key={t.id}
                  style={{
                    padding: 'var(--space-2) var(--space-3)', cursor: 'pointer',
                    fontSize: 'var(--text-sm)', color: 'var(--text-primary)',
                    borderBottom: '1px solid var(--border-light)',
                    transition: 'background var(--transition-fast)',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--gray-50)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  onClick={() => selectTeacher(t.id)}
                >
                  <span style={{ fontWeight: 600 }}>{t.name}</span>
                  <span style={{ marginLeft: 8, color: 'var(--text-tertiary)', fontSize: 'var(--text-xs)' }}>{t.employeeId} | {t.department}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        {selectedTeacherId && (
          <>
            <input className={styles.dateInput} type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} title="From date" />
            <input className={styles.dateInput} type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} title="To date" />
          </>
        )}
        <select className={styles.filterSelect} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="all">All Status</option>
          <option value="present">Present</option>
          <option value="absent">Absent</option>
          <option value="half-day">Half-Day</option>
          <option value="on-leave">On Leave</option>
          <option value="late">Late</option>
        </select>
      </div>

      {/* ── DEFAULT VIEW: All teachers today ── */}
      {!selectedTeacherId && (
        <>
          {filteredToday.length === 0 && <div className={styles.emptyState}>No attendance records found for today.</div>}
          {filteredToday.length > 0 && (
            <div className={styles.tableCard}>
              <div className={styles.tableScroll}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Teacher</th>
                      <th>Employee ID</th>
                      <th>Department</th>
                      <th>Status</th>
                      <th>Check-in</th>
                      <th>Check-out</th>
                      <th>Remarks</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredToday.map((r) => {
                      const teacher = allTeachers.find((t) => t.id === r.teacherId);
                      return (
                        <tr key={r.id} onClick={() => selectTeacher(r.teacherId)}>
                          <td>
                            <div className={styles.teacherName}>{r.teacherName}</div>
                          </td>
                          <td><span className={styles.teacherEmpId}>{teacher?.employeeId || '-'}</span></td>
                          <td>{teacher?.department || '-'}</td>
                          <td><span className={`${styles.badge} ${styles[STATUS_BADGE[r.status]]}`}>{STATUS_LABELS[r.status]}</span></td>
                          <td>{r.checkIn || '-'}</td>
                          <td>{r.checkOut || '-'}</td>
                          <td style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-xs)' }}>{r.remarks || '-'}</td>
                          <td>
                            <button className={styles.viewBtn} onClick={(e) => { e.stopPropagation(); selectTeacher(r.teacherId); }}>
                              View Details
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {/* ── DETAIL VIEW: Selected teacher ── */}
      {selectedTeacherId && selectedTeacher && summary && (
        <>
          {/* Profile Card */}
          <div className={styles.profileCard}>
            <div className={styles.profileAvatar}>
              {selectedTeacher.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
            </div>
            <div className={styles.profileInfo}>
              <div className={styles.profileName}>{selectedTeacher.name}</div>
              <div className={styles.profileMetaRow}>
                <span className={styles.profileMeta}>{selectedTeacher.employeeId}</span>
                <span className={styles.profileMeta}>{selectedTeacher.department}</span>
                <span className={styles.profileMeta}>{selectedTeacher.designation}</span>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className={styles.summaryGrid}>
            <div className={styles.summaryCard}>
              <div className={styles.summaryValue}>{summary.total}</div>
              <div className={styles.summaryLabel}>Working Days</div>
            </div>
            <div className={styles.summaryCard}>
              <div className={styles.summaryValue} style={{ color: '#2e7d32' }}>{summary.present}</div>
              <div className={styles.summaryLabel}>Present</div>
            </div>
            <div className={styles.summaryCard}>
              <div className={styles.summaryValue} style={{ color: '#c62828' }}>{summary.absent}</div>
              <div className={styles.summaryLabel}>Absent</div>
            </div>
            <div className={styles.summaryCard}>
              <div className={styles.summaryValue} style={{ color: '#e65100' }}>{summary.halfDay}</div>
              <div className={styles.summaryLabel}>Half-Day</div>
            </div>
            <div className={styles.summaryCard}>
              <div className={styles.summaryValue} style={{ color: '#1565c0' }}>{summary.onLeave}</div>
              <div className={styles.summaryLabel}>On Leave</div>
            </div>
            <div className={styles.summaryCard}>
              <div className={styles.summaryValue} style={{ color: '#f57f17' }}>{summary.late}</div>
              <div className={styles.summaryLabel}>Late</div>
            </div>
            <div className={styles.summaryCard}>
              <div className={styles.summaryValue} style={{ color: summary.rate >= 80 ? '#2e7d32' : summary.rate >= 60 ? '#e65100' : '#c62828' }}>{summary.rate}%</div>
              <div className={styles.summaryLabel}>Attendance Rate</div>
            </div>
          </div>

          {/* Charts Row */}
          <div className={styles.twoCol}>
            {/* Bar Chart */}
            <div className={styles.chartCard}>
              <div className={styles.chartTitle}>Monthly Attendance Overview</div>
              {renderBarChart()}
              <div className={styles.calendarLegend} style={{ marginTop: 'var(--space-3)' }}>
                <div className={styles.legendItem}><span className={styles.legendDot} style={{ background: '#4caf50' }} /> Present</div>
                <div className={styles.legendItem}><span className={styles.legendDot} style={{ background: '#fdd835' }} /> Late</div>
                <div className={styles.legendItem}><span className={styles.legendDot} style={{ background: '#ff9800' }} /> Half-Day</div>
                <div className={styles.legendItem}><span className={styles.legendDot} style={{ background: '#ef5350' }} /> Absent</div>
                <div className={styles.legendItem}><span className={styles.legendDot} style={{ background: '#42a5f5' }} /> On Leave</div>
              </div>
            </div>

            {/* Calendar Heatmap */}
            <div className={styles.chartCard}>
              <div className={styles.chartTitle}>Attendance Calendar</div>
              {renderCalendarMonth(2026, 7, calendarData.aug, 'August 2026')}
              {renderCalendarMonth(2026, 8, calendarData.sep, 'September 2026')}
              <div className={styles.calendarLegend}>
                <div className={styles.legendItem}><span className={styles.legendDot} style={{ background: '#c8e6c9' }} /> Present</div>
                <div className={styles.legendItem}><span className={styles.legendDot} style={{ background: '#ffcdd2' }} /> Absent</div>
                <div className={styles.legendItem}><span className={styles.legendDot} style={{ background: '#ffe0b2' }} /> Half-Day</div>
                <div className={styles.legendItem}><span className={styles.legendDot} style={{ background: '#bbdefb' }} /> On Leave</div>
                <div className={styles.legendItem}><span className={styles.legendDot} style={{ background: '#fff9c4' }} /> Late</div>
                <div className={styles.legendItem}><span className={styles.legendDot} style={{ background: 'var(--gray-100)' }} /> Weekend</div>
              </div>
            </div>
          </div>

          {/* Detailed Records Table */}
          <div className={styles.sectionLabel}>Attendance Records</div>
          {teacherRecords.length === 0 && <div className={styles.emptyState}>No records match the current filters.</div>}
          {teacherRecords.length > 0 && (
            <div className={styles.tableCard}>
              <div className={styles.tableScroll}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Check-in</th>
                      <th>Check-out</th>
                      <th>Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teacherRecords.map((r) => (
                      <tr key={r.id} style={{ cursor: 'default' }}>
                        <td>{formatDisplayDate(r.date)}</td>
                        <td><span className={`${styles.badge} ${styles[STATUS_BADGE[r.status]]}`}>{STATUS_LABELS[r.status]}</span></td>
                        <td>{r.checkIn || '-'}</td>
                        <td>{r.checkOut || '-'}</td>
                        <td style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-xs)' }}>{r.remarks || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
