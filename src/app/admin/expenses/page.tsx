'use client';

import { useState, useMemo } from 'react';
import { getDailyExpenses, getExpenseCategories } from '@/hooks/use-admin-data';
import { formatDate } from '@/lib/utils';
import type { DailyExpense } from '@/hooks/use-admin-data';
import styles from './expenses.module.css';

type StatusFilter = 'all' | 'approved' | 'pending' | 'rejected';

function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
}

export default function AdminExpensesPage() {
  const allExpenses = getDailyExpenses();
  const categories = getExpenseCategories();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [viewExpense, setViewExpense] = useState<DailyExpense | null>(null);
  const [expenses, setExpenses] = useState<DailyExpense[]>(allExpenses);
  const perPage = 10;

  // ── Form state ──
  const [formDate, setFormDate] = useState('2026-09-20');
  const [formCategory, setFormCategory] = useState(categories[0]?.name || '');
  const [formDescription, setFormDescription] = useState('');
  const [formAmount, setFormAmount] = useState('');
  const [formPaidTo, setFormPaidTo] = useState('');
  const [formPaymentMode, setFormPaymentMode] = useState<'cash' | 'upi' | 'bank'>('cash');
  const [formReceiptNo, setFormReceiptNo] = useState('');

  const filtered = useMemo(() => {
    let result = expenses;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((e) => e.description.toLowerCase().includes(q) || e.paidTo.toLowerCase().includes(q) || e.receiptNo.toLowerCase().includes(q));
    }
    if (statusFilter !== 'all') result = result.filter((e) => e.status === statusFilter);
    if (categoryFilter !== 'All') result = result.filter((e) => e.category === categoryFilter);
    if (dateFrom) result = result.filter((e) => e.date >= dateFrom);
    if (dateTo) result = result.filter((e) => e.date <= dateTo);
    return result;
  }, [expenses, search, statusFilter, categoryFilter, dateFrom, dateTo]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  // ── Stats ──
  const thisMonth = expenses.filter((e) => e.date.startsWith('2026-09'));
  const totalThisMonth = thisMonth.reduce((s, e) => s + e.amount, 0);
  const todayExpenses = expenses.filter((e) => e.date === '2026-09-20');
  const todayTotal = todayExpenses.reduce((s, e) => s + e.amount, 0);
  const pendingCount = thisMonth.filter((e) => e.status === 'pending').length;

  const categorySums = useMemo(() => {
    const map: Record<string, number> = {};
    thisMonth.forEach((e) => { map[e.category] = (map[e.category] || 0) + e.amount; });
    return map;
  }, [thisMonth]);

  const topCategory = Object.entries(categorySums).sort((a, b) => b[1] - a[1])[0];
  const maxCategoryTotal = Math.max(...Object.values(categorySums), 1);

  // ── Summary ──
  const approvedTotal = thisMonth.filter((e) => e.status === 'approved').reduce((s, e) => s + e.amount, 0);
  const pendingTotal = thisMonth.filter((e) => e.status === 'pending').reduce((s, e) => s + e.amount, 0);
  const rejectedTotal = thisMonth.filter((e) => e.status === 'rejected').reduce((s, e) => s + e.amount, 0);

  function getCategoryInfo(name: string) {
    return categories.find((c) => c.name === name);
  }

  function getStatusClass(status: string) {
    switch (status) {
      case 'approved': return styles.statusApproved;
      case 'pending': return styles.statusPending;
      case 'rejected': return styles.statusRejected;
      default: return '';
    }
  }

  function handleApprove(id: string) {
    setExpenses((prev) => prev.map((e) => e.id === id ? { ...e, status: 'approved' as const } : e));
  }

  function handleReject(id: string) {
    setExpenses((prev) => prev.map((e) => e.id === id ? { ...e, status: 'rejected' as const } : e));
  }

  function handleAddExpense() {
    if (!formDescription || !formAmount || !formPaidTo) return;
    const newExpense: DailyExpense = {
      id: `EXP${String(expenses.length + 1).padStart(3, '0')}`,
      date: formDate,
      category: formCategory,
      description: formDescription,
      amount: Number(formAmount),
      paidTo: formPaidTo,
      paymentMode: formPaymentMode,
      receiptNo: formReceiptNo || `REC-${formDate.slice(5).replace('-', '')}-${String(expenses.length + 1).padStart(2, '0')}`,
      addedBy: 'Dr. Rathore',
      status: 'pending',
    };
    setExpenses((prev) => [newExpense, ...prev]);
    setShowAddModal(false);
    resetForm();
  }

  function resetForm() {
    setFormDate('2026-09-20');
    setFormCategory(categories[0]?.name || '');
    setFormDescription('');
    setFormAmount('');
    setFormPaidTo('');
    setFormPaymentMode('cash');
    setFormReceiptNo('');
  }

  return (
    <div className={styles.page}>
      {/* ── Header ── */}
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Daily Expenses</h1>
        <div className={styles.headerActions}>
          <button className={styles.outlineBtn} onClick={() => alert('Expense report downloaded!')}>
            <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M10 3v10M6 9l4 4 4-4" />
              <path d="M3 15v2h14v-2" />
            </svg>
            Export
          </button>
          <button className={styles.primaryBtn} onClick={() => setShowAddModal(true)}>
            <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M10 4v12M4 10h12" />
            </svg>
            Add Expense
          </button>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: '#ede9fe', color: '#7c3aed' }}>
            <svg width="22" height="22" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="3" width="16" height="14" rx="2" />
              <path d="M2 7h16" />
              <path d="M6 11h3M6 14h5" />
            </svg>
          </div>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>Total (This Month)</div>
            <div className={styles.statValue}>{formatINR(totalThisMonth)}</div>
            <div className={styles.statSub}>{thisMonth.length} expenses in Sep</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: '#e8f5e9', color: '#2e7d32' }}>
            <svg width="22" height="22" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="10" cy="10" r="8" />
              <path d="M10 6v4l2.5 2.5" />
            </svg>
          </div>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>Today&apos;s Expenses</div>
            <div className={styles.statValue}>{formatINR(todayTotal)}</div>
            <div className={styles.statSub}>{todayExpenses.length} entries today</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: '#fff3e0', color: '#e65100' }}>
            <svg width="22" height="22" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="10" cy="10" r="8" />
              <path d="M10 6v5M10 13.5v.5" />
            </svg>
          </div>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>Pending Approvals</div>
            <div className={styles.statValue}>{pendingCount}</div>
            <div className={styles.statSub}>{formatINR(pendingTotal)} pending</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: '#e3f2fd', color: '#1565c0' }}>
            <svg width="22" height="22" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 17V5l4-2v14M7 3l6 2v14l-6-2z" />
              <path d="M13 5l4-2v14l-4 2" />
            </svg>
          </div>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>Top Category</div>
            <div className={styles.statValue}>{topCategory ? topCategory[0] : '—'}</div>
            <div className={styles.statSub}>{topCategory ? formatINR(topCategory[1]) : '—'}</div>
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
            placeholder="Search by description, vendor, receipt..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
          />
        </div>
        <input className={styles.dateInput} type="date" value={dateFrom} onChange={(e) => { setDateFrom(e.target.value); setCurrentPage(1); }} title="From date" />
        <input className={styles.dateInput} type="date" value={dateTo} onChange={(e) => { setDateTo(e.target.value); setCurrentPage(1); }} title="To date" />
        <select className={styles.filterSelect} value={categoryFilter} onChange={(e) => { setCategoryFilter(e.target.value); setCurrentPage(1); }}>
          <option value="All">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.name}>{c.icon} {c.name}</option>
          ))}
        </select>
        <select className={styles.filterSelect} value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value as StatusFilter); setCurrentPage(1); }}>
          <option value="all">All Status</option>
          <option value="approved">Approved</option>
          <option value="pending">Pending</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* ── Expense Table ── */}
      <div className={styles.tableCard}>
        <div className={styles.tableScroll}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Date</th>
                <th>Category</th>
                <th>Description</th>
                <th>Paid To</th>
                <th>Amount</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((exp) => {
                const catInfo = getCategoryInfo(exp.category);
                return (
                  <tr key={exp.id}>
                    <td>{formatDate(exp.date)}</td>
                    <td>
                      <span
                        className={styles.categoryBadge}
                        style={{
                          background: catInfo ? `${catInfo.color}18` : '#f3e8ff',
                          color: catInfo?.color || '#7c3aed',
                        }}
                      >
                        {catInfo?.icon} {exp.category}
                      </span>
                    </td>
                    <td style={{ maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis' }}>{exp.description}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{exp.paidTo}</td>
                    <td style={{ fontWeight: 'var(--font-semibold)' as unknown as number }}>{formatINR(exp.amount)}</td>
                    <td><span className={styles.paymentBadge}>{exp.paymentMode}</span></td>
                    <td><span className={`${styles.statusBadge} ${getStatusClass(exp.status)}`}>{exp.status}</span></td>
                    <td>
                      <div className={styles.actionRow}>
                        {/* View */}
                        <button className={styles.actionBtn} onClick={() => setViewExpense(exp)} title="View details">
                          <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                            <circle cx="10" cy="10" r="3" />
                            <path d="M2 10s3-6 8-6 8 6 8 6-3 6-8 6-8-6-8-6z" />
                          </svg>
                        </button>
                        {/* Approve */}
                        {exp.status === 'pending' && (
                          <button className={`${styles.actionBtn} ${styles.actionBtnApprove}`} onClick={() => handleApprove(exp.id)} title="Approve">
                            <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M5 10l3 3 7-7" />
                            </svg>
                          </button>
                        )}
                        {/* Reject */}
                        {exp.status === 'pending' && (
                          <button className={`${styles.actionBtn} ${styles.actionBtnReject}`} onClick={() => handleReject(exp.id)} title="Reject">
                            <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                              <path d="M5 5l10 10M15 5L5 15" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className={styles.tableFooter}>
          <span>Showing {filtered.length === 0 ? 0 : ((currentPage - 1) * perPage) + 1}-{Math.min(currentPage * perPage, filtered.length)} of {filtered.length} expenses</span>
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

      {/* ── Category-wise Summary ── */}
      <div>
        <h2 className={styles.sectionTitle}>Category-wise Summary (September)</h2>
      </div>
      <div className={styles.categoryGrid}>
        {categories
          .filter((c) => categorySums[c.name])
          .sort((a, b) => (categorySums[b.name] || 0) - (categorySums[a.name] || 0))
          .map((cat) => {
            const total = categorySums[cat.name] || 0;
            const count = thisMonth.filter((e) => e.category === cat.name).length;
            const pct = (total / maxCategoryTotal) * 100;
            return (
              <div key={cat.id} className={styles.categoryCard}>
                <div className={styles.categoryCardHeader}>
                  <div className={styles.categoryCardName}>
                    <span className={styles.categoryCardIcon}>{cat.icon}</span>
                    {cat.name}
                  </div>
                  <span className={styles.categoryCardCount}>{count} entries</span>
                </div>
                <div className={styles.categoryCardAmount}>{formatINR(total)}</div>
                <div className={styles.categoryBar}>
                  <div className={styles.categoryBarFill} style={{ width: `${pct}%`, background: cat.color }} />
                </div>
              </div>
            );
          })}
      </div>

      {/* ── Month Summary ── */}
      <div>
        <h2 className={styles.sectionTitle}>September Summary</h2>
      </div>
      <div className={styles.summaryRow}>
        <div className={styles.summaryCard}>
          <div className={styles.summaryLabel}>Total Approved</div>
          <div className={styles.summaryValue} style={{ color: '#2e7d32' }}>{formatINR(approvedTotal)}</div>
          <div className={styles.summaryCount}>{thisMonth.filter((e) => e.status === 'approved').length} expenses</div>
        </div>
        <div className={styles.summaryCard}>
          <div className={styles.summaryLabel}>Total Pending</div>
          <div className={styles.summaryValue} style={{ color: '#e65100' }}>{formatINR(pendingTotal)}</div>
          <div className={styles.summaryCount}>{thisMonth.filter((e) => e.status === 'pending').length} expenses</div>
        </div>
        <div className={styles.summaryCard}>
          <div className={styles.summaryLabel}>Total Rejected</div>
          <div className={styles.summaryValue} style={{ color: '#c62828' }}>{formatINR(rejectedTotal)}</div>
          <div className={styles.summaryCount}>{thisMonth.filter((e) => e.status === 'rejected').length} expenses</div>
        </div>
      </div>

      {/* ── Add Expense Modal ── */}
      {showAddModal && (
        <div className={styles.modalOverlay} onClick={() => setShowAddModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Add Expense</h2>
              <button className={styles.modalClose} onClick={() => setShowAddModal(false)}>
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 5l10 10M15 5L5 15" /></svg>
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Date</label>
                  <input className={styles.formInput} type="date" value={formDate} onChange={(e) => setFormDate(e.target.value)} />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Category</label>
                  <select className={styles.formSelect} value={formCategory} onChange={(e) => setFormCategory(e.target.value)}>
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>{c.icon} {c.name}</option>
                    ))}
                  </select>
                </div>
                <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
                  <label className={styles.formLabel}>Description</label>
                  <input className={styles.formInput} type="text" placeholder="What was this expense for?" value={formDescription} onChange={(e) => setFormDescription(e.target.value)} />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Amount</label>
                  <input className={styles.formInput} type="number" placeholder="0" value={formAmount} onChange={(e) => setFormAmount(e.target.value)} />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Paid To</label>
                  <input className={styles.formInput} type="text" placeholder="Vendor / person name" value={formPaidTo} onChange={(e) => setFormPaidTo(e.target.value)} />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Payment Mode</label>
                  <select className={styles.formSelect} value={formPaymentMode} onChange={(e) => setFormPaymentMode(e.target.value as 'cash' | 'upi' | 'bank')}>
                    <option value="cash">Cash</option>
                    <option value="upi">UPI</option>
                    <option value="bank">Bank Transfer</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Receipt No. (Optional)</label>
                  <input className={styles.formInput} type="text" placeholder="Auto-generated if empty" value={formReceiptNo} onChange={(e) => setFormReceiptNo(e.target.value)} />
                </div>
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.cancelBtn} onClick={() => { setShowAddModal(false); resetForm(); }}>Cancel</button>
              <button className={styles.submitBtn} onClick={handleAddExpense}>Add Expense</button>
            </div>
          </div>
        </div>
      )}

      {/* ── View Detail Modal ── */}
      {viewExpense && (
        <div className={styles.modalOverlay} onClick={() => setViewExpense(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Expense Details</h2>
              <button className={styles.modalClose} onClick={() => setViewExpense(null)}>
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 5l10 10M15 5L5 15" /></svg>
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.detailGrid}>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Date</span>
                  <span className={styles.detailValue}>{formatDate(viewExpense.date)}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Category</span>
                  <span className={styles.detailValue}>{getCategoryInfo(viewExpense.category)?.icon} {viewExpense.category}</span>
                </div>
                <div className={`${styles.detailItem} ${styles.detailItemFull}`}>
                  <span className={styles.detailLabel}>Description</span>
                  <span className={styles.detailValue}>{viewExpense.description}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Amount</span>
                  <span className={styles.detailValue} style={{ color: '#7c3aed', fontSize: '18px' }}>{formatINR(viewExpense.amount)}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Paid To</span>
                  <span className={styles.detailValue}>{viewExpense.paidTo}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Payment Mode</span>
                  <span className={styles.detailValue} style={{ textTransform: 'uppercase' }}>{viewExpense.paymentMode}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Receipt No.</span>
                  <span className={styles.detailValue}>{viewExpense.receiptNo}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Added By</span>
                  <span className={styles.detailValue}>{viewExpense.addedBy}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Status</span>
                  <span className={`${styles.statusBadge} ${getStatusClass(viewExpense.status)}`}>{viewExpense.status}</span>
                </div>
              </div>
            </div>
            <div className={styles.modalFooter}>
              {viewExpense.status === 'pending' && (
                <>
                  <button className={styles.cancelBtn} onClick={() => { handleReject(viewExpense.id); setViewExpense(null); }}>Reject</button>
                  <button className={styles.submitBtn} onClick={() => { handleApprove(viewExpense.id); setViewExpense(null); }}>Approve</button>
                </>
              )}
              {viewExpense.status !== 'pending' && (
                <button className={styles.cancelBtn} onClick={() => setViewExpense(null)}>Close</button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
