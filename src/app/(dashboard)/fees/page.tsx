'use client';

import { useState } from 'react';
import { getFeeDetails } from '@/hooks/use-data';
import { formatCurrency, formatDate } from '@/lib/utils';
import { FEE_STATUS_LABELS } from '@/lib/constants';
import styles from './fees.module.css';

function getStatusStyle(status: string): { bg: string; text: string } {
  const map: Record<string, { bg: string; text: string }> = {
    paid: { bg: 'var(--success-light)', text: 'var(--success-dark)' },
    pending: { bg: 'var(--warning-light)', text: 'var(--warning-dark)' },
    overdue: { bg: 'var(--danger-light)', text: 'var(--danger-dark)' },
    partial: { bg: 'var(--info-light)', text: 'var(--info-dark)' },
  };
  return map[status] || map.pending;
}

const PAYMENT_MODE_LABELS: Record<string, string> = {
  upi: 'UPI',
  card: 'Card',
  netbanking: 'Net Banking',
  cash: 'Cash',
  cheque: 'Cheque',
};

const FREQUENCY_LABELS: Record<string, string> = {
  monthly: 'Monthly',
  quarterly: 'Quarterly',
  'half-yearly': 'Half-Yearly',
  annual: 'Annual',
  'one-time': 'One-Time',
};

export default function FeesPage() {
  const fees = getFeeDetails();
  const [payingId, setPayingId] = useState<string | null>(null);

  const paidPercentage = Math.round((fees.totalPaid / fees.totalAnnualFee) * 100);
  const paidInstallments = fees.installments.filter((i) => i.status === 'paid');
  const nextDue = fees.installments.find((i) => i.status === 'pending' || i.status === 'overdue');

  return (
    <div className={styles.page}>
      {/* Summary Cards */}
      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
            <svg width="22" height="22" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M10 2v16M6 6h5.5a2.5 2.5 0 010 5H6M6 11h6.5a2.5 2.5 0 010 5H6" /></svg>
          </div>
          <div>
            <div className={styles.statLabel}>Total Annual Fee</div>
            <div className={styles.statValue}>{formatCurrency(fees.totalAnnualFee)}</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: 'var(--success-light)', color: 'var(--success)' }}>
            <svg width="22" height="22" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 10l4 4 8-9" /></svg>
          </div>
          <div>
            <div className={styles.statLabel}>Total Paid</div>
            <div className={styles.statValue} style={{ color: 'var(--success)' }}>{formatCurrency(fees.totalPaid)}</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: fees.totalBalance > 0 ? 'var(--danger-light)' : 'var(--success-light)', color: fees.totalBalance > 0 ? 'var(--danger)' : 'var(--success)' }}>
            <svg width="22" height="22" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="10" cy="10" r="8" /><path d="M10 6v5M10 14h.01" /></svg>
          </div>
          <div>
            <div className={styles.statLabel}>Balance Due</div>
            <div className={styles.statValue} style={{ color: fees.totalBalance > 0 ? 'var(--danger)' : 'var(--success)' }}>{formatCurrency(fees.totalBalance)}</div>
          </div>
        </div>
      </div>

      {/* Progress Overview */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <span className={styles.cardTitle}>Payment Progress</span>
          <span className={styles.progressPercent}>{paidPercentage}% Paid</span>
        </div>
        <div className={styles.cardBody}>
          <div className={styles.progressTrack}>
            <div className={styles.progressFill} style={{ width: `${paidPercentage}%` }} />
          </div>
          <div className={styles.progressLabels}>
            <span>{formatCurrency(fees.totalPaid)} paid</span>
            <span>{formatCurrency(fees.totalAnnualFee)} total</span>
          </div>

          {nextDue && (
            <div className={styles.nextDueBanner}>
              <div>
                <div className={styles.nextDueLabel}>Next Payment Due</div>
                <div className={styles.nextDueSub}>{nextDue.label} &middot; Due {formatDate(nextDue.dueDate)}</div>
              </div>
              <div className={styles.nextDueRight}>
                <span className={styles.nextDueAmount}>{formatCurrency(nextDue.amount)}</span>
                <button className={styles.payNowBtn} onClick={() => setPayingId(nextDue.id)}>Pay Now</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Installments */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <span className={styles.cardTitle}>Installment Schedule</span>
        </div>
        <div className={styles.cardBody}>
          <div className={styles.installmentGrid}>
            {fees.installments.map((inst) => {
              const statusStyle = getStatusStyle(inst.status);
              const isPayable = inst.status === 'pending' || inst.status === 'overdue';
              return (
                <div
                  key={inst.id}
                  className={styles.installmentCard}
                  style={inst.status === 'overdue' ? { borderColor: 'var(--danger)' } : undefined}
                >
                  <div className={styles.installmentTop}>
                    <span className={styles.installmentLabel}>{inst.label}</span>
                    <span className={styles.statusBadge} style={{ background: statusStyle.bg, color: statusStyle.text }}>
                      {FEE_STATUS_LABELS[inst.status]}
                    </span>
                  </div>
                  <div className={styles.installmentAmount}>{formatCurrency(inst.amount)}</div>
                  <div className={styles.installmentDue}>Due: {formatDate(inst.dueDate)}</div>

                  {inst.status === 'paid' && (
                    <div className={styles.installmentPaidInfo}>
                      <div className={styles.installmentPaidRow}>
                        <span>Paid on</span>
                        <span>{inst.paidDate && formatDate(inst.paidDate)}</span>
                      </div>
                      <div className={styles.installmentPaidRow}>
                        <span>Mode</span>
                        <span>{inst.paymentMode && PAYMENT_MODE_LABELS[inst.paymentMode]}</span>
                      </div>
                      <div className={styles.installmentPaidRow}>
                        <span>Txn ID</span>
                        <span className={styles.txnId}>{inst.transactionId}</span>
                      </div>
                      <button className={styles.receiptBtn}>
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M8 2v9m0 0l-3-3m3 3l3-3" /><path d="M2 12v1.5A1.5 1.5 0 003.5 15h9a1.5 1.5 0 001.5-1.5V12" /></svg>
                        Download Receipt
                      </button>
                    </div>
                  )}

                  {isPayable && (
                    <button className={styles.installmentPayBtn} onClick={() => setPayingId(inst.id)}>
                      Pay Now
                    </button>
                  )}

                  {payingId === inst.id && (
                    <div className={styles.payingNote}>
                      Payment gateway will open here once backend is connected.
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className={styles.contentRow}>
        {/* Fee Structure */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={styles.cardTitle}>Fee Structure</span>
          </div>
          <div className={styles.cardBody}>
            <div className={styles.feeHeadList}>
              {fees.feeHeads.map((head) => (
                <div key={head.id} className={styles.feeHeadItem}>
                  <div className={styles.feeHeadInfo}>
                    <span className={styles.feeHeadName}>{head.name}</span>
                    <span className={styles.freqBadge}>{FREQUENCY_LABELS[head.frequency]}</span>
                  </div>
                  <span className={styles.feeHeadAmount}>{formatCurrency(head.amount)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Payment History */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={styles.cardTitle}>Payment History</span>
          </div>
          <div className={styles.cardBody}>
            {paidInstallments.length === 0 ? (
              <div className={styles.emptyHistory}>No payments made yet.</div>
            ) : (
              <div className={styles.historyList}>
                {paidInstallments.map((inst) => (
                  <div key={inst.id} className={styles.historyItem}>
                    <div className={styles.historyIcon}>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 8l3.5 3.5L13 4.5" /></svg>
                    </div>
                    <div className={styles.historyInfo}>
                      <div className={styles.historyLabel}>{inst.label}</div>
                      <div className={styles.historyMeta}>{inst.paidDate && formatDate(inst.paidDate)} &middot; {inst.paymentMode && PAYMENT_MODE_LABELS[inst.paymentMode]}</div>
                    </div>
                    <span className={styles.historyAmount}>{formatCurrency(inst.paidAmount)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
