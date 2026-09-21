'use client';

import { useState } from 'react';
import Modal from '@/components/common/Modal';
import { payInstallment } from '@/hooks/use-data';
import { formatCurrency, formatDate } from '@/lib/utils';
import type { FeeInstallment } from '@/types';
import styles from './PayModal.module.css';

type Method = 'upi' | 'card' | 'netbanking';
type Step = 'form' | 'processing' | 'success';

const METHOD_LABELS: Record<Method, string> = { upi: 'UPI', card: 'Card', netbanking: 'Net Banking' };
const BANKS = ['State Bank of India', 'HDFC Bank', 'ICICI Bank', 'Axis Bank', 'Punjab National Bank', 'Kotak Mahindra Bank'];

interface PayModalProps {
  installment: FeeInstallment;
  studentName: string;
  onClose: () => void;
  onPaid: (paid: FeeInstallment) => void;
  onDownloadReceipt: (paid: FeeInstallment) => void;
}

function formatCardNumber(value: string): string {
  return value.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
}

function formatExpiry(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 4);
  return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
}

export default function PayModal({ installment, studentName, onClose, onPaid, onDownloadReceipt }: PayModalProps) {
  const [step, setStep] = useState<Step>('form');
  const [method, setMethod] = useState<Method>('upi');
  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [bank, setBank] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [paid, setPaid] = useState<FeeInstallment | null>(null);
  const [failure, setFailure] = useState('');

  const total = installment.amount + installment.lateFee;

  function validate(): Record<string, string> {
    const found: Record<string, string> = {};
    if (method === 'upi' && !/^[\w.-]{2,}@[a-zA-Z]{2,}$/.test(upiId.trim())) {
      found.upiId = 'Enter a valid UPI ID, e.g. name@okhdfcbank';
    }
    if (method === 'card') {
      if (cardNumber.replace(/\s/g, '').length !== 16) found.cardNumber = 'Enter the 16-digit card number';
      if (!cardName.trim()) found.cardName = 'Enter the name on the card';
      if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry)) found.expiry = 'Use MM/YY';
      if (!/^\d{3}$/.test(cvv)) found.cvv = '3-digit CVV';
    }
    if (method === 'netbanking' && !bank) found.bank = 'Select your bank';
    return found;
  }

  async function handlePay() {
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) return;
    setFailure('');
    setStep('processing');
    try {
      const result = await payInstallment(installment, method);
      setPaid(result);
      onPaid(result);
      setStep('success');
    } catch {
      setFailure('Payment could not be completed. No money was deducted. Please try again.');
      setStep('form');
    }
  }

  function guardedClose() {
    if (step !== 'processing') onClose();
  }

  return (
    <Modal
      title={step === 'success' ? 'Payment Successful' : 'Pay Fees'}
      subtitle={step === 'success' ? undefined : `${studentName} · ${installment.label}`}
      onClose={guardedClose}
      size="md"
      footer={
        step === 'form' ? (
          <>
            <button className={styles.cancelBtn} onClick={onClose}>Cancel</button>
            <button className={styles.payBtn} onClick={handlePay}>Pay {formatCurrency(total)}</button>
          </>
        ) : step === 'success' && paid ? (
          <>
            <button className={styles.cancelBtn} onClick={onClose}>Done</button>
            <button className={styles.payBtn} onClick={() => onDownloadReceipt(paid)}>Download Receipt</button>
          </>
        ) : undefined
      }
    >
      {step === 'form' && (
        <>
          <div className={styles.summary}>
            <div>
              <div className={styles.summaryLabel}>{installment.label}</div>
              <div className={styles.summaryDue}>Due {formatDate(installment.dueDate)}{installment.lateFee > 0 ? ` · includes ${formatCurrency(installment.lateFee)} late fee` : ''}</div>
            </div>
            <div className={styles.summaryAmount}>{formatCurrency(total)}</div>
          </div>

          <div className={styles.methods} role="tablist" aria-label="Payment method">
            {(Object.keys(METHOD_LABELS) as Method[]).map((m) => (
              <button
                key={m}
                role="tab"
                aria-selected={method === m}
                className={`${styles.method} ${method === m ? styles.methodActive : ''}`}
                onClick={() => { setMethod(m); setErrors({}); }}
              >
                {METHOD_LABELS[m]}
              </button>
            ))}
          </div>

          <div className={styles.fields}>
            {method === 'upi' && (
              <div className={`${styles.field} ${styles.fieldFull}`}>
                <label className={styles.label} htmlFor="upi">UPI ID</label>
                <input id="upi" className={`${styles.input} ${errors.upiId ? styles.inputError : ''}`} value={upiId} onChange={(e) => setUpiId(e.target.value)} placeholder="name@okhdfcbank" autoComplete="off" />
                {errors.upiId && <span className={styles.error}>{errors.upiId}</span>}
              </div>
            )}

            {method === 'card' && (
              <>
                <div className={`${styles.field} ${styles.fieldFull}`}>
                  <label className={styles.label} htmlFor="card-number">Card number</label>
                  <input id="card-number" className={`${styles.input} ${errors.cardNumber ? styles.inputError : ''}`} value={cardNumber} onChange={(e) => setCardNumber(formatCardNumber(e.target.value))} placeholder="1234 5678 9012 3456" inputMode="numeric" autoComplete="off" />
                  {errors.cardNumber && <span className={styles.error}>{errors.cardNumber}</span>}
                </div>
                <div className={`${styles.field} ${styles.fieldFull}`}>
                  <label className={styles.label} htmlFor="card-name">Name on card</label>
                  <input id="card-name" className={`${styles.input} ${errors.cardName ? styles.inputError : ''}`} value={cardName} onChange={(e) => setCardName(e.target.value)} placeholder="As printed on the card" autoComplete="off" />
                  {errors.cardName && <span className={styles.error}>{errors.cardName}</span>}
                </div>
                <div className={styles.field}>
                  <label className={styles.label} htmlFor="card-expiry">Expiry</label>
                  <input id="card-expiry" className={`${styles.input} ${errors.expiry ? styles.inputError : ''}`} value={expiry} onChange={(e) => setExpiry(formatExpiry(e.target.value))} placeholder="MM/YY" inputMode="numeric" autoComplete="off" />
                  {errors.expiry && <span className={styles.error}>{errors.expiry}</span>}
                </div>
                <div className={styles.field}>
                  <label className={styles.label} htmlFor="card-cvv">CVV</label>
                  <input id="card-cvv" className={`${styles.input} ${errors.cvv ? styles.inputError : ''}`} type="password" value={cvv} onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 3))} placeholder="123" inputMode="numeric" autoComplete="off" />
                  {errors.cvv && <span className={styles.error}>{errors.cvv}</span>}
                </div>
              </>
            )}

            {method === 'netbanking' && (
              <div className={`${styles.field} ${styles.fieldFull}`}>
                <label className={styles.label} htmlFor="bank">Select bank</label>
                <select id="bank" className={`${styles.input} ${errors.bank ? styles.inputError : ''}`} value={bank} onChange={(e) => setBank(e.target.value)}>
                  <option value="">Choose your bank...</option>
                  {BANKS.map((b) => <option key={b} value={b}>{b}</option>)}
                </select>
                {errors.bank && <span className={styles.error}>{errors.bank}</span>}
              </div>
            )}
          </div>

          {failure && <div className={styles.error} style={{ marginTop: 'var(--space-3)' }}>{failure}</div>}
          <div className={styles.secureNote}>Payments are processed over a secure connection. Card details are never stored.</div>
        </>
      )}

      {step === 'processing' && (
        <div className={styles.processing} role="status">
          <div className={styles.spinner} />
          Processing your payment. Please do not close this window...
        </div>
      )}

      {step === 'success' && paid && (
        <div className={styles.success}>
          <div className={styles.successIcon}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5L20 7" /></svg>
          </div>
          <div className={styles.successTitle}>{installment.label} paid</div>
          <div className={styles.successAmount}>{formatCurrency(paid.paidAmount + paid.lateFee)}</div>
          <div className={styles.receiptRows}>
            <div className={styles.receiptRow}><span>Transaction ID</span><strong>{paid.transactionId}</strong></div>
            <div className={styles.receiptRow}><span>Paid on</span><strong>{paid.paidDate && formatDate(paid.paidDate)}</strong></div>
            <div className={styles.receiptRow}><span>Mode</span><strong>{paid.paymentMode && METHOD_LABELS[paid.paymentMode as Method]}</strong></div>
          </div>
        </div>
      )}
    </Modal>
  );
}
