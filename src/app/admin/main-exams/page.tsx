'use client';

import { useState, useMemo } from 'react';
import { getMainExams, getMainExamResults } from '@/hooks/use-admin-data';
import type { MainExamResult } from '@/hooks/use-admin-data';
import { formatDate } from '@/lib/utils';
import { buildMarksheetHtml, openPrintable } from '@/lib/print';
import styles from './main-exams.module.css';

type TabType = 'exams' | 'results' | 'marksheet';

const SCHOOL_NAME = 'SchoolAI International Academy';

export default function AdminMainExamsPage() {
  const exams = getMainExams();
  const allResults = getMainExamResults();

  const [activeTab, setActiveTab] = useState<TabType>('exams');

  // Results tab state
  const [selectedExamId, setSelectedExamId] = useState('ME002');
  const [filterClass, setFilterClass] = useState('all');
  const [filterSection, setFilterSection] = useState('all');
  const [detailResult, setDetailResult] = useState<MainExamResult | null>(null);

  // Marksheet generator state
  const [genExamId, setGenExamId] = useState('ME002');
  const [genClass, setGenClass] = useState('all');
  const [genSection, setGenSection] = useState('all');
  const [selectedStudents, setSelectedStudents] = useState<Set<string>>(new Set());

  // ── Computed ──
  const resultsPublishedCount = exams.filter((e) => e.status === 'results-published').length;

  const filteredResults = useMemo(() => {
    let r = allResults.filter((res) => res.examId === selectedExamId);
    if (filterClass !== 'all') r = r.filter((res) => res.class === filterClass);
    if (filterSection !== 'all') r = r.filter((res) => res.section === filterSection);
    return r;
  }, [allResults, selectedExamId, filterClass, filterSection]);

  const passRate = allResults.length > 0
    ? Math.round((allResults.filter((r) => r.isPassed).length / allResults.length) * 100)
    : 0;

  const avgScore = allResults.length > 0
    ? Math.round(allResults.reduce((s, r) => s + r.percentage, 0) / allResults.length * 10) / 10
    : 0;

  const genResults = useMemo(() => {
    let r = allResults.filter((res) => res.examId === genExamId);
    if (genClass !== 'all') r = r.filter((res) => res.class === genClass);
    if (genSection !== 'all') r = r.filter((res) => res.section === genSection);
    return r;
  }, [allResults, genExamId, genClass, genSection]);

  // ── Unique classes/sections from results ──
  const uniqueClasses = [...new Set(allResults.map((r) => r.class))].sort();
  const uniqueSections = [...new Set(allResults.map((r) => r.section))].sort();

  // ── Helpers ──
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

  function handleViewResults(examId: string) {
    setSelectedExamId(examId);
    setFilterClass('all');
    setFilterSection('all');
    setActiveTab('results');
  }

  function handleGenerateMarksheet(result: MainExamResult) {
    const student = { name: result.studentName, class: result.class, section: result.section, rollNumber: result.rollNumber };
    const html = buildMarksheetHtml(SCHOOL_NAME, student, result);
    openPrintable(`Marksheet - ${result.studentName}`, html);
  }

  function handleToggleStudent(id: string) {
    setSelectedStudents((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleSelectAll() {
    if (selectedStudents.size === genResults.length) {
      setSelectedStudents(new Set());
    } else {
      setSelectedStudents(new Set(genResults.map((r) => r.id)));
    }
  }

  function handleGenerateSelected() {
    const toGenerate = genResults.filter((r) => selectedStudents.has(r.id));
    for (const result of toGenerate) {
      const student = { name: result.studentName, class: result.class, section: result.section, rollNumber: result.rollNumber };
      const html = buildMarksheetHtml(SCHOOL_NAME, student, result);
      openPrintable(`Marksheet - ${result.studentName}`, html);
    }
  }

  function handleGenerateAll() {
    for (const result of genResults) {
      const student = { name: result.studentName, class: result.class, section: result.section, rollNumber: result.rollNumber };
      const html = buildMarksheetHtml(SCHOOL_NAME, student, result);
      openPrintable(`Marksheet - ${result.studentName}`, html);
    }
  }

  return (
    <div className={styles.page}>
      {/* ── Header ── */}
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Main Examinations</h1>
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
            <div className={styles.statSub}>Academic Year 2026-27</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: '#e3f2fd', color: '#1565c0' }}>
            <svg width="22" height="22" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="10" cy="10" r="8" />
              <path d="M6 10l2.5 2.5L14 7" />
            </svg>
          </div>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>Results Published</div>
            <div className={styles.statValue}>{resultsPublishedCount}</div>
            <div className={styles.statSub}>Of {exams.length} total exams</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: '#e8f5e9', color: '#2e7d32' }}>
            <svg width="22" height="22" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 17l4-8 4 5 3-4 4 7" />
            </svg>
          </div>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>Pass Rate</div>
            <div className={styles.statValue}>{passRate}%</div>
            <div className={styles.statSub}>Overall pass percentage</div>
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
            <div className={styles.statLabel}>Average Score</div>
            <div className={styles.statValue}>{avgScore}%</div>
            <div className={styles.statSub}>Across all subjects</div>
          </div>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className={styles.tabRow}>
        <button className={`${styles.tab} ${activeTab === 'exams' ? styles.tabActive : ''}`} onClick={() => setActiveTab('exams')}>
          All Exams ({exams.length})
        </button>
        <button className={`${styles.tab} ${activeTab === 'results' ? styles.tabActive : ''}`} onClick={() => setActiveTab('results')}>
          Results ({allResults.length})
        </button>
        <button className={`${styles.tab} ${activeTab === 'marksheet' ? styles.tabActive : ''}`} onClick={() => setActiveTab('marksheet')}>
          Marksheet Generator
        </button>
      </div>

      {/* ── All Exams Tab ── */}
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
                    </div>
                  </div>
                  <span className={`${styles.statusBadge} ${badge.cls}`}>{badge.label}</span>
                </div>
                <div className={styles.examCardBody}>
                  <div className={styles.examStats}>
                    <div className={styles.examStat}>
                      <span className={styles.examStatValue}>Class {exam.classes[0]}-{exam.classes[exam.classes.length - 1]}</span>
                      <span className={styles.examStatLabel}>Classes</span>
                    </div>
                    <div className={styles.examStat}>
                      <span className={styles.examStatValue}>{exam.academicYear}</span>
                      <span className={styles.examStatLabel}>Session</span>
                    </div>
                  </div>
                  {(exam.status === 'completed' || exam.status === 'results-published') && (
                    <button className={styles.viewResultsBtn} onClick={() => handleViewResults(exam.id)}>
                      View Results
                    </button>
                  )}
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
            <span className={styles.tableTitle}>Student Results</span>
            <div className={styles.filterRow}>
              <select className={styles.filterSelect} value={selectedExamId} onChange={(e) => setSelectedExamId(e.target.value)}>
                {exams.filter((e) => e.status === 'completed' || e.status === 'results-published').map((e) => (
                  <option key={e.id} value={e.id}>{e.name}</option>
                ))}
              </select>
              <select className={styles.filterSelect} value={filterClass} onChange={(e) => setFilterClass(e.target.value)}>
                <option value="all">All Classes</option>
                {uniqueClasses.map((c) => <option key={c} value={c}>Class {c}</option>)}
              </select>
              <select className={styles.filterSelect} value={filterSection} onChange={(e) => setFilterSection(e.target.value)}>
                <option value="all">All Sections</option>
                {uniqueSections.map((s) => <option key={s} value={s}>Section {s}</option>)}
              </select>
            </div>
          </div>
          <div className={styles.tableScroll}>
            {filteredResults.length > 0 ? (
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Student</th>
                    <th>Roll No</th>
                    <th>Class</th>
                    <th>Total Marks</th>
                    <th>Percentage</th>
                    <th>Grade</th>
                    <th>Result</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredResults.map((r) => (
                    <tr key={r.id}>
                      <td style={{ fontWeight: 700 }}>#{r.rank}</td>
                      <td style={{ fontWeight: 600 }}>{r.studentName}</td>
                      <td>{r.rollNumber}</td>
                      <td>{r.class}-{r.section}</td>
                      <td>{r.totalObtained}/{r.totalMarks}</td>
                      <td style={{ fontWeight: 600 }}>{r.percentage}%</td>
                      <td><span className={`${styles.statusBadge} ${r.percentage >= 75 ? styles.badgeCompleted : r.percentage >= 50 ? styles.badgeOngoing : styles.badgeUpcoming}`}>{r.grade}</span></td>
                      <td>
                        <span className={`${styles.passBadge} ${r.isPassed ? styles.passTrue : styles.passFalse}`}>
                          {r.isPassed ? 'PASS' : 'FAIL'}
                        </span>
                      </td>
                      <td>
                        <div className={styles.actionGroup}>
                          <button className={styles.actionBtn} onClick={() => setDetailResult(r)}>View Detail</button>
                          <button className={styles.actionBtnPrimary} onClick={() => handleGenerateMarksheet(r)}>
                            <svg width="12" height="12" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ marginRight: 2 }}>
                              <path d="M6 2v4H2M14 2v4h4M6 18v-4H2M14 18v-4h4M2 10h16" />
                            </svg>
                            Marksheet
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className={styles.emptyState}>No results found for the selected filters.</div>
            )}
          </div>
        </div>
      )}

      {/* ── Marksheet Generator Tab ── */}
      {activeTab === 'marksheet' && (
        <div className={styles.generatorCard}>
          <div className={styles.generatorTitle}>Bulk Marksheet Generation</div>
          <div className={styles.generatorFilters}>
            <div className={styles.filterGroup}>
              <span className={styles.filterLabel}>Exam</span>
              <select className={styles.filterSelect} value={genExamId} onChange={(e) => { setGenExamId(e.target.value); setSelectedStudents(new Set()); }}>
                {exams.filter((e) => e.status === 'completed' || e.status === 'results-published').map((e) => (
                  <option key={e.id} value={e.id}>{e.name}</option>
                ))}
              </select>
            </div>
            <div className={styles.filterGroup}>
              <span className={styles.filterLabel}>Class</span>
              <select className={styles.filterSelect} value={genClass} onChange={(e) => { setGenClass(e.target.value); setSelectedStudents(new Set()); }}>
                <option value="all">All Classes</option>
                {uniqueClasses.map((c) => <option key={c} value={c}>Class {c}</option>)}
              </select>
            </div>
            <div className={styles.filterGroup}>
              <span className={styles.filterLabel}>Section</span>
              <select className={styles.filterSelect} value={genSection} onChange={(e) => { setGenSection(e.target.value); setSelectedStudents(new Set()); }}>
                <option value="all">All Sections</option>
                {uniqueSections.map((s) => <option key={s} value={s}>Section {s}</option>)}
              </select>
            </div>
            <button className={styles.primaryBtn} onClick={handleGenerateAll} disabled={genResults.length === 0}>
              <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M6 2v4H2M14 2v4h4M6 18v-4H2M14 18v-4h4M2 10h16" />
              </svg>
              Generate All ({genResults.length})
            </button>
          </div>

          {genResults.length > 0 ? (
            <>
              <div className={styles.selectActions}>
                <button className={styles.selectAll} onClick={handleSelectAll}>
                  <input
                    type="checkbox"
                    className={styles.studentCheckbox}
                    checked={selectedStudents.size === genResults.length && genResults.length > 0}
                    readOnly
                  />
                  Select All
                </button>
                <span className={styles.selectedCount}>{selectedStudents.size} selected</span>
                <button
                  className={styles.primaryBtn}
                  onClick={handleGenerateSelected}
                  disabled={selectedStudents.size === 0}
                >
                  Generate Selected ({selectedStudents.size})
                </button>
              </div>
              <div className={styles.studentList}>
                {genResults.map((r) => (
                  <div key={r.id} className={styles.studentRow}>
                    <input
                      type="checkbox"
                      className={styles.studentCheckbox}
                      checked={selectedStudents.has(r.id)}
                      onChange={() => handleToggleStudent(r.id)}
                    />
                    <div className={styles.studentInfo}>
                      <span className={styles.studentName}>{r.studentName}</span>
                      <span className={styles.studentMeta}>Roll: {r.rollNumber}</span>
                      <span className={styles.studentMeta}>Class {r.class}-{r.section}</span>
                      <span className={styles.studentMeta}>{r.percentage}% | {r.grade}</span>
                      <span className={`${styles.passBadge} ${r.isPassed ? styles.passTrue : styles.passFalse}`} style={{ fontSize: 10, padding: '1px 6px' }}>
                        {r.isPassed ? 'PASS' : 'FAIL'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className={styles.emptyState}>No results available for the selected exam and filters.</div>
          )}
        </div>
      )}

      {/* ── Student Detail Modal ── */}
      {detailResult && (
        <div className={styles.modalOverlay} onClick={() => setDetailResult(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Student Result Detail</h2>
              <button className={styles.modalClose} onClick={() => setDetailResult(null)}>
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 5l10 10M15 5L5 15" /></svg>
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.detailGrid}>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Student Name</span>
                  <span className={styles.detailValue}>{detailResult.studentName}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Class / Section</span>
                  <span className={styles.detailValue}>{detailResult.class}-{detailResult.section}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Roll Number</span>
                  <span className={styles.detailValue}>{detailResult.rollNumber}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Rank</span>
                  <span className={styles.detailValue}>#{detailResult.rank}</span>
                </div>
              </div>

              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Subject</th>
                    <th>Max Marks</th>
                    <th>Obtained</th>
                    <th>Grade</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {detailResult.subjects.map((s, i) => (
                    <tr key={i}>
                      <td style={{ fontWeight: 600 }}>{s.subject}</td>
                      <td>{s.maxMarks}</td>
                      <td style={{ fontWeight: 600 }}>{s.marksObtained}</td>
                      <td>{s.grade}</td>
                      <td>
                        <span className={`${styles.passBadge} ${s.isPassed ? styles.passTrue : styles.passFalse}`}>
                          {s.isPassed ? 'PASS' : 'FAIL'}
                        </span>
                      </td>
                    </tr>
                  ))}
                  <tr style={{ fontWeight: 700, background: 'var(--gray-50)' }}>
                    <td>TOTAL</td>
                    <td>{detailResult.totalMarks}</td>
                    <td>{detailResult.totalObtained}</td>
                    <td>{detailResult.grade}</td>
                    <td>
                      <span className={`${styles.resultStamp} ${detailResult.isPassed ? styles.resultPass : styles.resultFail}`}>
                        {detailResult.isPassed ? 'PASSED' : 'FAILED'}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className={styles.detailGrid} style={{ marginTop: 16 }}>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Percentage</span>
                  <span className={styles.detailValue}>{detailResult.percentage}%</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Overall Grade</span>
                  <span className={styles.detailValue}>{detailResult.grade}</span>
                </div>
              </div>

              {detailResult.remarks && (
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginTop: 8 }}>
                  <strong>Remarks:</strong> {detailResult.remarks}
                </p>
              )}
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.primaryBtn} onClick={() => { handleGenerateMarksheet(detailResult); }}>
                <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M6 2v4H2M14 2v4h4M6 18v-4H2M14 18v-4h4M2 10h16" />
                </svg>
                Generate Marksheet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
