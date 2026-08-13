'use client';

import { useState } from 'react';
import { getDocuments } from '@/hooks/use-data';
import { formatDate, formatFileSize } from '@/lib/utils';
import styles from './documents.module.css';

type CategoryFilter = 'all' | 'report-card' | 'fee-receipt' | 'certificate' | 'tc' | 'id-card' | 'medical';

const CATEGORY_LABELS: Record<string, string> = {
  'report-card': 'Report Card',
  'fee-receipt': 'Fee Receipt',
  certificate: 'Certificate',
  tc: 'Transfer Certificate',
  'id-card': 'ID Card',
  medical: 'Medical',
};

const CATEGORY_ICONS: Record<string, { bg: string; color: string }> = {
  'report-card': { bg: 'var(--primary-light)', color: 'var(--primary)' },
  'fee-receipt': { bg: 'var(--success-light)', color: 'var(--success)' },
  certificate: { bg: 'var(--warning-light)', color: 'var(--warning)' },
  tc: { bg: 'var(--info-light)', color: 'var(--info)' },
  'id-card': { bg: 'var(--danger-light)', color: 'var(--danger)' },
  medical: { bg: 'var(--gray-100)', color: 'var(--gray-600)' },
};

function getFileIcon(fileType: string) {
  if (fileType === 'pdf') {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2h9l5 5v13a2 2 0 01-2 2H6a2 2 0 01-2-2V4a2 2 0 012-2z" />
        <path d="M14 2v5h5" />
        <path d="M9 13h2a1 1 0 010 2H9v2" />
        <path d="M13 13h1.5a1.5 1.5 0 010 3H13" />
      </svg>
    );
  }
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <path d="M21 15l-5-5L5 21" />
    </svg>
  );
}

export default function DocumentsPage() {
  const allDocs = getDocuments();
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const categories: { key: CategoryFilter; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'report-card', label: 'Report Cards' },
    { key: 'fee-receipt', label: 'Fee Receipts' },
    { key: 'certificate', label: 'Certificates' },
    { key: 'id-card', label: 'ID Card' },
  ];

  let filtered = activeCategory === 'all'
    ? allDocs
    : allDocs.filter((d) => d.category === activeCategory);

  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    filtered = filtered.filter((d) => d.name.toLowerCase().includes(term));
  }

  const categoryCounts = allDocs.reduce((acc, d) => {
    acc[d.category] = (acc[d.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className={styles.page}>
      {/* Stats */}
      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 2h9l5 5v13a2 2 0 01-2 2H6a2 2 0 01-2-2V4a2 2 0 012-2z" /><path d="M14 2v5h5" /></svg>
          </div>
          <div>
            <div className={styles.statNum}>{allDocs.length}</div>
            <div className={styles.statLabel}>Total Documents</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 4h12v14H4z" /><path d="M7 8h6M7 11h6M7 14h3" /></svg>
          </div>
          <div>
            <div className={styles.statNum}>{categoryCounts['report-card'] || 0}</div>
            <div className={styles.statLabel}>Report Cards</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: 'var(--success-light)', color: 'var(--success)' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M10 2v16M6 6h5.5a2.5 2.5 0 010 5H6M6 11h6.5a2.5 2.5 0 010 5H6" /></svg>
          </div>
          <div>
            <div className={styles.statNum}>{categoryCounts['fee-receipt'] || 0}</div>
            <div className={styles.statLabel}>Fee Receipts</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: 'var(--warning-light)', color: 'var(--warning)' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="8" r="6" /><path d="M6 20l2-4h8l2 4" /><path d="M12 2v2" /></svg>
          </div>
          <div>
            <div className={styles.statNum}>{categoryCounts['certificate'] || 0}</div>
            <div className={styles.statLabel}>Certificates</div>
          </div>
        </div>
      </div>

      {/* Filter + Search */}
      <div className={styles.filterBar}>
        <div className={styles.tabs}>
          {categories.map((cat) => (
            <button
              key={cat.key}
              className={`${styles.tab} ${activeCategory === cat.key ? styles.tabActive : ''}`}
              onClick={() => setActiveCategory(cat.key)}
            >
              {cat.label}
            </button>
          ))}
        </div>
        <div className={styles.searchWrap}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="7" cy="7" r="5" /><path d="M11 11l3 3" /></svg>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Document List */}
      {filtered.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 4h18l10 10v26a4 4 0 01-4 4H12a4 4 0 01-4-4V8a4 4 0 014-4z" /><path d="M28 4v10h10" /></svg>
          </div>
          <div className={styles.emptyTitle}>No documents found</div>
          <div className={styles.emptyDesc}>No documents match your search or filter.</div>
        </div>
      ) : (
        <div className={styles.docGrid}>
          {filtered.map((doc) => {
            const catIcon = CATEGORY_ICONS[doc.category] || CATEGORY_ICONS.medical;
            return (
              <div key={doc.id} className={styles.docCard}>
                <div className={styles.docIconWrap} style={{ background: catIcon.bg, color: catIcon.color }}>
                  {getFileIcon(doc.fileType)}
                </div>
                <div className={styles.docInfo}>
                  <div className={styles.docName}>{doc.name}</div>
                  <div className={styles.docMeta}>
                    <span className={styles.docCategory}>{CATEGORY_LABELS[doc.category]}</span>
                    <span className={styles.docDot}>&middot;</span>
                    <span>{formatDate(doc.uploadDate)}</span>
                    <span className={styles.docDot}>&middot;</span>
                    <span>{formatFileSize(doc.fileSize)}</span>
                  </div>
                </div>
                <div className={styles.docActions}>
                  <button className={styles.viewBtn} title="View">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="9" cy="9" r="3" /><path d="M1 9s3-6 8-6 8 6 8 6-3 6-8 6-8-6-8-6z" /></svg>
                  </button>
                  <button className={styles.downloadBtn} title="Download">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 2v10m0 0l-3.5-3.5M9 12l3.5-3.5" /><path d="M2 13v2a1.5 1.5 0 001.5 1.5h11A1.5 1.5 0 0016 15v-2" /></svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
