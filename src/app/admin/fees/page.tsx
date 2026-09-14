'use client';

import { useState, useMemo } from 'react';
import { getFeeRecords, getFeeStructure } from '@/hooks/use-admin-data';
import { formatDate } from '@/lib/utils';
import type { FeeRecord } from '@/hooks/use-admin-data';
import styles from './fees.module.css';

type TabType = 'records' | 'structure';
type StatusFilter = 'all' | 'paid' | 'pending' | 'overdue' | 'partial';

function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
}

const FEE_TYPE_LABELS: Record<string, string> = {
  tuition: 'Tuition', transport: 'Transport', exam: 'Exam', lab: 'Lab', library: 'Library', sports: 'Sports', annual: 'Annual',
};

export default function AdminFeesPage() {
  const allRecords = getFeeRecords();
  const feeStructure = getFeeStructure();

  const [activeTab, setActiveTab] = useState<TabType>('records');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [classFilter, setClassFilter] = useState('All');
  const [showCollectModal, setShowCollectModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 10;

  const filtered = useMemo(() => {
    let result = allRecords;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((r) => r.studentName.toLowerCase().includes(q) || r.rollNumber.includes(q) || r.fatherName.toLowerCase().includes(q));
    }
    if (statusFilter !== 'all') result = result.filter((r) => r.status === statusFilter);
    if (classFilter !== 'All') result = result.filter((r) => r.class === classFilter);
    return result;
  }, [allRecords, search, statusFilter, classFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  const totalCollected = allRecords.filter((r) => r.status === 'paid').reduce((s, r) => s + r.paidAmount, 0);
  const totalPending = allRecords.filter((r) => r.status === 'pending' || r.status === 'partial').reduce((s, r) => s + (r.amount - r.paidAmount), 0);
  const totalOverdue = allRecords.filter((r) => r.status === 'overdue').reduce((s, r) => s + r.amount, 0);
  const paidCount = allRecords.filter((r) => r.status === 'paid').length;

  function getStatusBadge(status: string) {
    switch (status) {
      case 'paid': return styles.feePaid;
      case 'pending': return styles.feePending;
      case 'overdue': return styles.feeOverdue;
      case 'partial': return styles.feePartial;
      default: return '';
    }
  }

  return (
    <div className={styles.page}>
      {/* ── Header ── */}
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Fee Management</h1>
        <div className={styles.headerActions}>
          <button className={styles.outlineBtn} onClick={() => alert('Report downloaded!')}>
            <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M10 3v10M6 9l4 4 4-4" />
              <path d="M3 15v2h14v-2" />
            </svg>
            Export
          </button>
          <button className={styles.primaryBtn} onClick={() => setShowCollectModal(true)}>
            <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M10 4v12M4 10h12" />
            </svg>
            Collect Fee
          </button>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: '#e8f5e9', color: '#2e7d32' }}>
            <svg width="22" height="22" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 10l2.5 2.5L14 7" />
              <circle cx="10" cy="10" r="8" />
            </svg>
          </div>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>Total Collected</div>
            <div className={styles.statValue}>{formatINR(totalCollected)}</div>
            <div className={styles.statSub}>{paidCount} payments received</div>
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
            <div className={styles.statLabel}>Pending</div>
            <div className={styles.statValue}>{formatINR(totalPending)}</div>
            <div className={styles.statSub}>{allRecords.filter((r) => r.status === 'pending' || r.status === 'partial').length} students</div>
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
            <div className={styles.statLabel}>Overdue</div>
            <div className={styles.statValue}>{formatINR(totalOverdue)}</div>
            <div className={styles.statSub}>{allRecords.filter((r) => r.status === 'overdue').length} students</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: '#ede9fe', color: '#7c3aed' }}>
            <svg width="22" height="22" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="4" width="16" height="12" rx="2" />
              <path d="M2 8h16" />
              <path d="M6 12h3" />
            </svg>
          </div>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>Total Records</div>
            <div className={styles.statValue}>{allRecords.length}</div>
            <div className={styles.statSub}>This month</div>
          </div>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className={styles.tabRow}>
        <button className={`${styles.tab} ${activeTab === 'records' ? styles.tabActive : ''}`} onClick={() => setActiveTab('records')}>
          Fee Records
        </button>
        <button className={`${styles.tab} ${activeTab === 'structure' ? styles.tabActive : ''}`} onClick={() => setActiveTab('structure')}>
          Fee Structure
        </button>
      </div>

      {/* ── Fee Records Tab ── */}
      {activeTab === 'records' && (
        <>
          <div className={styles.filtersBar}>
            <div className={styles.searchBox}>
              <svg className={styles.searchIcon} width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <circle cx="9" cy="9" r="6" />
                <path d="M14 14l4 4" />
              </svg>
              <input
                className={styles.searchInput}
                type="text"
                placeholder="Search by student name, roll number..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              />
            </div>
            <select className={styles.filterSelect} value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value as StatusFilter); setCurrentPage(1); }}>
              <option value="all">All Status</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="overdue">Overdue</option>
              <option value="partial">Partial</option>
            </select>
            <select className={styles.filterSelect} value={classFilter} onChange={(e) => { setClassFilter(e.target.value); setCurrentPage(1); }}>
              <option value="All">All Classes</option>
              {['1','2','3','4','5','6','7','8','9','10','11','12'].map((c) => (
                <option key={c} value={c}>Class {c}</option>
              ))}
            </select>
          </div>

          <div className={styles.tableCard}>
            <div className={styles.tableScroll}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Class</th>
                    <th>Fee Type</th>
                    <th>Amount</th>
                    <th>Paid</th>
                    <th>Due Date</th>
                    <th>Status</th>
                    <th>Payment Mode</th>
                    <th>Receipt</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((rec) => (
                    <tr key={rec.id}>
                      <td>
                        <div className={styles.studentCell}>
                          <div>
                            <div className={styles.studentName}>{rec.studentName}</div>
                            <div className={styles.studentSub}>Roll: {rec.rollNumber}</div>
                          </div>
                        </div>
                      </td>
                      <td>{rec.class}-{rec.section}</td>
                      <td><span className={styles.typeBadge}>{FEE_TYPE_LABELS[rec.feeType] || rec.feeType}</span></td>
                      <td>{formatINR(rec.amount)}</td>
                      <td style={{ color: rec.paidAmount > 0 ? '#2e7d32' : 'var(--text-tertiary)' }}>{rec.paidAmount > 0 ? formatINR(rec.paidAmount) : '—'}</td>
                      <td>{formatDate(rec.dueDate)}</td>
                      <td><span className={`${styles.feeBadge} ${getStatusBadge(rec.status)}`}>{rec.status}</span></td>
                      <td style={{ color: 'var(--text-secondary)' }}>{rec.paymentMode || '—'}</td>
                      <td style={{ color: 'var(--text-tertiary)', fontSize: '12px' }}>{rec.receiptNo || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className={styles.tableFooter}>
              <span>Showing {((currentPage - 1) * perPage) + 1}-{Math.min(currentPage * perPage, filtered.length)} of {filtered.length} records</span>
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
        </>
      )}

      {/* ── Fee Structure Tab ── */}
      {activeTab === 'structure' && (
        <div className={styles.structureGrid}>
          {feeStructure.map((fs) => (
            <div key={fs.id} className={styles.structureCard}>
              <div className={styles.structureHeader}>
                <span className={styles.structureName}>{fs.feeType}</span>
                <span className={styles.freqBadge}>{fs.frequency}</span>
              </div>
              <div className={styles.structureAmount}>{formatINR(fs.amount)}</div>
              <div className={styles.structureMeta}>
                <span className={styles.structureMetaItem}>
                  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="3" width="16" height="12" rx="1" />
                    <path d="M2 7h16" />
                  </svg>
                  Class {fs.classRange}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Collect Fee Modal ── */}
      {showCollectModal && (
        <div className={styles.modalOverlay} onClick={() => setShowCollectModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Collect Fee</h2>
              <button className={styles.modalClose} onClick={() => setShowCollectModal(false)}>
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 5l10 10M15 5L5 15" /></svg>
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.formGrid}>
                <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
                  <label className={styles.formLabel}>Student</label>
                  <input className={styles.formInput} type="text" placeholder="Search student by name or roll number..." />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Fee Type</label>
                  <select className={styles.formSelect}>
                    <option value="tuition">Tuition Fee</option>
                    <option value="exam">Exam Fee</option>
                    <option value="lab">Lab Fee</option>
                    <option value="library">Library Fee</option>
                    <option value="sports">Sports Fee</option>
                    <option value="annual">Annual Development</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Amount</label>
                  <input className={styles.formInput} type="number" placeholder="₹ 0" />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Payment Mode</label>
                  <select className={styles.formSelect}>
                    <option>Cash</option>
                    <option>UPI</option>
                    <option>Bank Transfer</option>
                    <option>Cheque</option>
                    <option>Card</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Payment Date</label>
                  <input className={styles.formInput} type="date" defaultValue="2026-09-12" />
                </div>
                <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
                  <label className={styles.formLabel}>Remarks (Optional)</label>
                  <input className={styles.formInput} type="text" placeholder="Any additional notes..." />
                </div>
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.cancelBtn} onClick={() => setShowCollectModal(false)}>Cancel</button>
              <button className={styles.submitBtn} onClick={() => setShowCollectModal(false)}>Collect & Generate Receipt</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
