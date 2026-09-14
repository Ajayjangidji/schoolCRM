'use client';

import { useState } from 'react';
import { getDocuments } from '@/hooks/use-admin-data';
import type { SchoolDocument } from '@/hooks/use-admin-data';
import { formatDate } from '@/lib/utils';
import styles from './documents.module.css';

type CategoryFilter = 'all' | SchoolDocument['category'];
type ViewMode = 'table' | 'grid';

const CATEGORIES: { value: CategoryFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'circular', label: 'Circulars' },
  { value: 'policy', label: 'Policies' },
  { value: 'form', label: 'Forms' },
  { value: 'report', label: 'Reports' },
  { value: 'certificate', label: 'Certificates' },
  { value: 'syllabus', label: 'Syllabus' },
  { value: 'timetable', label: 'Timetables' },
];

const CATEGORY_STYLES: Record<string, { cls: string; label: string }> = {
  circular: { cls: styles.catCircular, label: 'Circular' },
  policy: { cls: styles.catPolicy, label: 'Policy' },
  form: { cls: styles.catForm, label: 'Form' },
  report: { cls: styles.catReport, label: 'Report' },
  certificate: { cls: styles.catCertificate, label: 'Certificate' },
  syllabus: { cls: styles.catSyllabus, label: 'Syllabus' },
  timetable: { cls: styles.catTimetable, label: 'Timetable' },
};

const FILE_ICON_STYLES: Record<string, string> = {
  pdf: styles.filePdf,
  doc: styles.fileDoc,
  xls: styles.fileXls,
  img: styles.fileImg,
  ppt: styles.filePpt,
};

export default function AdminDocumentsPage() {
  const documents = getDocuments();

  const [category, setCategory] = useState<CategoryFilter>('all');
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [showUploadModal, setShowUploadModal] = useState(false);

  const publicCount = documents.filter((d) => d.isPublic).length;
  const uniqueCategories = new Set(documents.map((d) => d.category)).size;
  const totalSize = documents.reduce((s, d) => s + d.sizeBytes, 0);

  function formatSize(bytes: number) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(0)} KB`;
    if (bytes < 1073741824) return `${(bytes / 1048576).toFixed(1)} MB`;
    return `${(bytes / 1073741824).toFixed(1)} GB`;
  }

  const filtered = documents.filter((d) => {
    if (category !== 'all' && d.category !== category) return false;
    if (typeFilter !== 'all' && d.type !== typeFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return d.name.toLowerCase().includes(q) || d.description.toLowerCase().includes(q) || d.tags.some((t) => t.includes(q));
    }
    return true;
  });

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Document Management</h1>
        <div className={styles.headerActions}>
          <button className={styles.uploadBtn} onClick={() => setShowUploadModal(true)}>
            <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M10 14V3M6 7l4-4 4 4M3 17h14" />
            </svg>
            Upload Document
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: '#ede9fe', color: '#7c3aed' }}>
            <svg width="22" height="22" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 3h5l2 2h7v12H3V3z" />
            </svg>
          </div>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>Total Documents</div>
            <div className={styles.statValue}>{documents.length}</div>
            <div className={styles.statSub}>{publicCount} public</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: '#e3f2fd', color: '#1565c0' }}>
            <svg width="22" height="22" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 3H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2z" />
              <path d="M8 7h4M8 10h4M8 13h2" />
            </svg>
          </div>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>Categories</div>
            <div className={styles.statValue}>{uniqueCategories}</div>
            <div className={styles.statSub}>Document types</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: '#e8f5e9', color: '#2e7d32' }}>
            <svg width="22" height="22" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 10l4 4 4-4M10 3v11M3 17h14" />
            </svg>
          </div>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>Total Downloads</div>
            <div className={styles.statValue}>{documents.reduce((s, d) => s + d.downloads, 0).toLocaleString('en-IN')}</div>
            <div className={styles.statSub}>All documents</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: '#fff3e0', color: '#e65100' }}>
            <svg width="22" height="22" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 17V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v12" />
              <path d="M2 17h16" />
              <path d="M8 7h4" />
            </svg>
          </div>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>Storage Used</div>
            <div className={styles.statValue}>{formatSize(totalSize)}</div>
            <div className={styles.statSub}>Across all files</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className={styles.filtersBar}>
        <div className={styles.filterTabs}>
          {CATEGORIES.map((c) => (
            <button key={c.value} className={`${styles.filterTab} ${category === c.value ? styles.filterTabActive : ''}`} onClick={() => setCategory(c.value)}>
              {c.label}
            </button>
          ))}
        </div>
        <div className={styles.searchBox}>
          <svg className={styles.searchIcon} width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="9" cy="9" r="6" />
            <path d="M13.5 13.5L17 17" />
          </svg>
          <input className={styles.searchInput} type="text" placeholder="Search documents..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select className={styles.filterSelect} value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
          <option value="all">All Types</option>
          <option value="pdf">PDF</option>
          <option value="doc">DOC</option>
          <option value="xls">XLS</option>
          <option value="img">Image</option>
          <option value="ppt">PPT</option>
        </select>
        <div className={styles.viewToggle}>
          <button className={`${styles.viewBtn} ${viewMode === 'table' ? styles.viewBtnActive : ''}`} onClick={() => setViewMode('table')}>
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 5h14M3 10h14M3 15h14" /></svg>
          </button>
          <button className={`${styles.viewBtn} ${viewMode === 'grid' ? styles.viewBtnActive : ''}`} onClick={() => setViewMode('grid')}>
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="5" height="5" rx="1" /><rect x="12" y="3" width="5" height="5" rx="1" /><rect x="3" y="12" width="5" height="5" rx="1" /><rect x="12" y="12" width="5" height="5" rx="1" /></svg>
          </button>
        </div>
      </div>

      {/* Content */}
      {filtered.length === 0 && <div className={styles.emptyState}>No documents found.</div>}

      {/* Table View */}
      {viewMode === 'table' && filtered.length > 0 && (
        <div className={styles.tableCard}>
          <div className={styles.tableScroll}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Document</th>
                  <th>Category</th>
                  <th>Type</th>
                  <th>Uploaded By</th>
                  <th>Date</th>
                  <th>Size</th>
                  <th>Shared</th>
                  <th>Downloads</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((doc) => {
                  const catStyle = CATEGORY_STYLES[doc.category];
                  return (
                    <tr key={doc.id}>
                      <td>
                        <div className={styles.fileNameCell}>
                          <div className={`${styles.fileIcon} ${FILE_ICON_STYLES[doc.type] || ''}`}>{doc.type}</div>
                          <div className={styles.fileInfo}>
                            <div className={styles.fileName}>{doc.name}</div>
                            <div className={styles.fileDesc}>{doc.description}</div>
                          </div>
                        </div>
                      </td>
                      <td><span className={`${styles.categoryBadge} ${catStyle?.cls || ''}`}>{catStyle?.label || doc.category}</span></td>
                      <td style={{ textTransform: 'uppercase', fontWeight: 600, fontSize: '11px' }}>{doc.type}</td>
                      <td>{doc.uploadedBy}</td>
                      <td>{formatDate(doc.uploadedAt)}</td>
                      <td>{doc.size}</td>
                      <td><span className={styles.sharedBadge}>{doc.sharedWith}</span></td>
                      <td>{doc.downloads}</td>
                      <td>
                        <div className={styles.actionBtns}>
                          <button className={styles.actionBtn} title="Download" onClick={(e) => { e.stopPropagation(); alert('Document downloaded!'); }}>
                            <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 10l4 4 4-4M10 3v11M3 17h14" /></svg>
                          </button>
                          <button className={styles.actionBtn} title="Delete" onClick={(e) => { e.stopPropagation(); alert('Document deleted.'); }}>
                            <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 5l10 10M15 5L5 15" /></svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Grid View */}
      {viewMode === 'grid' && filtered.length > 0 && (
        <div className={styles.docGrid}>
          {filtered.map((doc) => {
            const catStyle = CATEGORY_STYLES[doc.category];
            return (
              <div key={doc.id} className={styles.docCard}>
                <div className={styles.docCardTop}>
                  <div className={`${styles.docCardIcon} ${FILE_ICON_STYLES[doc.type] || ''}`}>{doc.type}</div>
                  <div className={styles.docCardInfo}>
                    <div className={styles.docCardName}>{doc.name}</div>
                    <div className={styles.docCardMeta}>
                      <span className={`${styles.categoryBadge} ${catStyle?.cls || ''}`}>{catStyle?.label || doc.category}</span>
                      {' '}{doc.size}
                    </div>
                  </div>
                </div>
                <div className={styles.docCardDesc}>{doc.description}</div>
                <div className={styles.tagList}>
                  {doc.tags.map((tag) => <span key={tag} className={styles.tag}>{tag}</span>)}
                </div>
                <div className={styles.docCardFooter}>
                  <div className={styles.docCardFooterLeft}>
                    <span className={styles.footerItem}>
                      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 10l4 4 4-4M10 3v11" /></svg>
                      {doc.downloads}
                    </span>
                    <span className={styles.footerItem}>
                      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="4" width="14" height="12" rx="1" /><path d="M7 2v4M13 2v4M3 8h14" /></svg>
                      {formatDate(doc.uploadedAt)}
                    </span>
                  </div>
                  <span className={styles.sharedBadge}>{doc.sharedWith}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className={styles.modalOverlay} onClick={() => setShowUploadModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Upload Document</h2>
              <button className={styles.modalClose} onClick={() => setShowUploadModal(false)}>
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 5l10 10M15 5L5 15" /></svg>
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.uploadZone}>
                <div className={styles.uploadZoneIcon}>
                  <svg width="32" height="32" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                    <path d="M10 14V3M6 7l4-4 4 4M3 17h14" />
                  </svg>
                </div>
                <div className={styles.uploadZoneText}>Click to upload or drag and drop</div>
                <div className={styles.uploadZoneSub}>PDF, DOC, XLS, PPT, JPG, PNG (max 10MB)</div>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Document Name</label>
                <input className={styles.formInput} type="text" placeholder="e.g. Annual Fee Structure" />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Description</label>
                <textarea className={styles.formTextarea} placeholder="Brief description of this document..." />
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Category</label>
                  <select className={styles.formSelect}>
                    <option value="">Select category</option>
                    <option value="circular">Circular</option>
                    <option value="policy">Policy</option>
                    <option value="form">Form</option>
                    <option value="report">Report</option>
                    <option value="certificate">Certificate</option>
                    <option value="syllabus">Syllabus</option>
                    <option value="timetable">Timetable</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Share With</label>
                  <select className={styles.formSelect}>
                    <option value="all">Everyone</option>
                    <option value="teachers">Teachers</option>
                    <option value="parents">Parents</option>
                    <option value="staff">Staff Only</option>
                  </select>
                </div>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Tags</label>
                <input className={styles.formInput} type="text" placeholder="Comma-separated tags, e.g. fees, annual" />
              </div>
              <div className={styles.checkboxRow}>
                <input type="checkbox" className={styles.checkbox} id="isPublic" />
                <label htmlFor="isPublic" className={styles.checkLabel}>Make this document publicly accessible</label>
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.cancelBtn} onClick={() => setShowUploadModal(false)}>Cancel</button>
              <button className={styles.submitBtn} onClick={() => setShowUploadModal(false)}>Upload</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
