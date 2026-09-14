'use client';

import { useState } from 'react';
import { getExams, getExamResults, getAcademicCalendar } from '@/hooks/use-admin-data';
import { formatDate } from '@/lib/utils';
import styles from './exams.module.css';

type TabType = 'exams' | 'results' | 'calendar';

const EXAM_TYPE_LABELS: Record<string, string> = {
  'unit-test': 'Unit Test', 'mid-term': 'Mid-Term', 'final': 'Final', 'pre-board': 'Pre-Board', 'practical': 'Practical',
};

const EVENT_BADGE: Record<string, { cls: string; label: string }> = {
  exam: { cls: styles.eventExam, label: 'Exam' },
  holiday: { cls: styles.eventHoliday, label: 'Holiday' },
  event: { cls: styles.eventEvent, label: 'Event' },
  ptm: { cls: styles.eventPtm, label: 'PTM' },
  deadline: { cls: styles.eventDeadline, label: 'Deadline' },
};

export default function AdminExamsPage() {
  const exams = getExams();
  const results = getExamResults();
  const calendar = getAcademicCalendar();

  const [activeTab, setActiveTab] = useState<TabType>('exams');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const upcomingCount = exams.filter((e) => e.status === 'upcoming').length;
  const completedCount = exams.filter((e) => e.status === 'completed' || e.status === 'results-published').length;
  const avgPassRate = results.length > 0 ? Math.round(results.reduce((s, r) => s + (r.passed / r.appeared) * 100, 0) / results.length) : 0;

  function getExamCardClass(status: string) {
    switch (status) {
      case 'upcoming': return styles.examUpcoming;
      case 'ongoing': return styles.examOngoing;
      case 'completed': return styles.examCompleted;
      case 'results-published': return styles.examResults;
      default: return '';
    }
  }

  function getStatusBadge(status: string) {
    switch (status) {
      case 'upcoming': return { cls: styles.badgeUpcoming, label: 'Upcoming' };
      case 'ongoing': return { cls: styles.badgeOngoing, label: 'Ongoing' };
      case 'completed': return { cls: styles.badgeCompleted, label: 'Completed' };
      case 'results-published': return { cls: styles.badgeResults, label: 'Results Out' };
      default: return { cls: '', label: status };
    }
  }

  function parseDate(dateStr: string) {
    const d = new Date(dateStr);
    return {
      day: d.getDate(),
      month: d.toLocaleString('en', { month: 'short' }),
      year: d.getFullYear(),
    };
  }

  return (
    <div className={styles.page}>
      {/* ── Header ── */}
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Academic & Exam Management</h1>
        <div className={styles.headerActions}>
          <button className={styles.primaryBtn} onClick={() => setShowCreateModal(true)}>
            <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M10 4v12M4 10h12" />
            </svg>
            Schedule Exam
          </button>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: '#ede9fe', color: '#7c3aed' }}>
            <svg width="22" height="22" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 2h12v16H4z" />
              <path d="M7 6h6M7 9h6M7 12h4" />
            </svg>
          </div>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>Total Exams</div>
            <div className={styles.statValue}>{exams.length}</div>
            <div className={styles.statSub}>This academic year</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: '#e3f2fd', color: '#1565c0' }}>
            <svg width="22" height="22" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="14" height="14" rx="1" />
              <path d="M3 7h14M7 3v4M13 3v4" />
            </svg>
          </div>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>Upcoming</div>
            <div className={styles.statValue}>{upcomingCount}</div>
            <div className={styles.statSub}>Exams scheduled</div>
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
            <div className={styles.statLabel}>Completed</div>
            <div className={styles.statValue}>{completedCount}</div>
            <div className={styles.statSub}>Results processed</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: '#fff3e0', color: '#e65100' }}>
            <svg width="22" height="22" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 17l4-8 4 5 3-4 4 7" />
              <circle cx="7" cy="5" r="2" />
            </svg>
          </div>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>Avg Pass Rate</div>
            <div className={styles.statValue}>{avgPassRate}%</div>
            <div className={styles.statSub}>Mid-term results</div>
          </div>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className={styles.tabRow}>
        <button className={`${styles.tab} ${activeTab === 'exams' ? styles.tabActive : ''}`} onClick={() => setActiveTab('exams')}>
          Exams ({exams.length})
        </button>
        <button className={`${styles.tab} ${activeTab === 'results' ? styles.tabActive : ''}`} onClick={() => setActiveTab('results')}>
          Results ({results.length})
        </button>
        <button className={`${styles.tab} ${activeTab === 'calendar' ? styles.tabActive : ''}`} onClick={() => setActiveTab('calendar')}>
          Academic Calendar ({calendar.length})
        </button>
      </div>

      {/* ── Exams Tab ── */}
      {activeTab === 'exams' && (
        <div className={styles.examGrid}>
          {exams.map((exam) => {
            const badge = getStatusBadge(exam.status);
            return (
              <div key={exam.id} className={`${styles.examCard} ${getExamCardClass(exam.status)}`}>
                <div className={styles.examCardHeader}>
                  <div className={styles.examInfo}>
                    <div className={styles.examName}>{exam.name}</div>
                    <div className={styles.examMeta}>
                      <span className={styles.examMetaItem}>
                        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="4" width="14" height="12" rx="1" />
                          <path d="M7 2v4M13 2v4M3 8h14" />
                        </svg>
                        {formatDate(exam.startDate)} — {formatDate(exam.endDate)}
                      </span>
                      <span className={styles.typeBadge}>{EXAM_TYPE_LABELS[exam.type] || exam.type}</span>
                    </div>
                  </div>
                  <span className={`${styles.statusBadge} ${badge.cls}`}>{badge.label}</span>
                </div>
                <div className={styles.examCardBody}>
                  <div className={styles.examStat}>
                    <span className={styles.examStatValue}>Class {exam.classRange}</span>
                    <span className={styles.examStatLabel}>Classes</span>
                  </div>
                  <div className={styles.examStat}>
                    <span className={styles.examStatValue}>{exam.totalSubjects}</span>
                    <span className={styles.examStatLabel}>Subjects</span>
                  </div>
                  <div className={styles.examStat}>
                    <span className={styles.examStatValue}>{exam.totalStudents.toLocaleString('en-IN')}</span>
                    <span className={styles.examStatLabel}>Students</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Results Tab ── */}
      {activeTab === 'results' && (
        <div className={styles.tableCard}>
          <div className={styles.tableHeader}>
            <span className={styles.tableTitle}>Mid-Term Examination Results</span>
          </div>
          <div className={styles.tableScroll}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Class</th>
                  <th>Subject</th>
                  <th>Appeared</th>
                  <th>Passed</th>
                  <th>Failed</th>
                  <th>Pass Rate</th>
                  <th>Avg Marks</th>
                  <th>Highest</th>
                  <th>Lowest</th>
                </tr>
              </thead>
              <tbody>
                {results.map((r) => {
                  const passRate = Math.round((r.passed / r.appeared) * 100);
                  const passColor = passRate >= 90 ? '#2e7d32' : passRate >= 75 ? '#e65100' : '#c62828';
                  const avgColor = r.avgMarks >= 75 ? '#2e7d32' : r.avgMarks >= 60 ? '#e65100' : '#c62828';
                  return (
                    <tr key={r.id}>
                      <td style={{ fontWeight: 600 }}>{r.class}-{r.section}</td>
                      <td>{r.subject}</td>
                      <td>{r.appeared}/{r.totalStudents}</td>
                      <td style={{ color: '#2e7d32' }}>{r.passed}</td>
                      <td style={{ color: '#c62828' }}>{r.failed}</td>
                      <td>
                        <span className={styles.progressBar}>
                          <span className={styles.progressFill} style={{ width: `${passRate}%`, background: passColor }} />
                        </span>
                        <span className={styles.passRate} style={{ color: passColor }}>{passRate}%</span>
                      </td>
                      <td>
                        <span className={styles.progressBar}>
                          <span className={styles.progressFill} style={{ width: `${r.avgMarks}%`, background: avgColor }} />
                        </span>
                        {r.avgMarks}%
                      </td>
                      <td style={{ color: '#2e7d32', fontWeight: 600 }}>{r.highestMarks}</td>
                      <td style={{ color: '#c62828' }}>{r.lowestMarks}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Calendar Tab ── */}
      {activeTab === 'calendar' && (
        <div className={styles.calendarList}>
          {calendar.map((event) => {
            const d = parseDate(event.date);
            const badge = EVENT_BADGE[event.type] || EVENT_BADGE.event;
            return (
              <div key={event.id} className={styles.calendarItem}>
                <div className={styles.calendarDate}>
                  <div className={styles.calendarDay}>{d.day}</div>
                  <div className={styles.calendarMonth}>{d.month}</div>
                </div>
                <div className={styles.calendarInfo}>
                  <div className={styles.calendarTitle}>
                    {event.title}
                    <span className={`${styles.eventBadge} ${badge.cls}`}>{badge.label}</span>
                  </div>
                  <div className={styles.calendarDesc}>{event.description}</div>
                  {event.endDate && (
                    <div className={styles.calendarDateRange}>
                      {formatDate(event.date)} — {formatDate(event.endDate)}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Create Exam Modal ── */}
      {showCreateModal && (
        <div className={styles.modalOverlay} onClick={() => setShowCreateModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Schedule New Exam</h2>
              <button className={styles.modalClose} onClick={() => setShowCreateModal(false)}>
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 5l10 10M15 5L5 15" /></svg>
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.formGrid}>
                <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
                  <label className={styles.formLabel}>Exam Name</label>
                  <input className={styles.formInput} type="text" placeholder="e.g. Unit Test 3" />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Exam Type</label>
                  <select className={styles.formSelect}>
                    <option value="unit-test">Unit Test</option>
                    <option value="mid-term">Mid-Term</option>
                    <option value="final">Final</option>
                    <option value="pre-board">Pre-Board</option>
                    <option value="practical">Practical</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Class Range</label>
                  <input className={styles.formInput} type="text" placeholder="e.g. 1-12 or 10,12" />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Start Date</label>
                  <input className={styles.formInput} type="date" />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>End Date</label>
                  <input className={styles.formInput} type="date" />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Total Subjects</label>
                  <input className={styles.formInput} type="number" placeholder="e.g. 5" />
                </div>
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.cancelBtn} onClick={() => setShowCreateModal(false)}>Cancel</button>
              <button className={styles.submitBtn} onClick={() => setShowCreateModal(false)}>Schedule Exam</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
