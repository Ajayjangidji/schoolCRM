'use client';

import { useState, useMemo } from 'react';
import { getTeacherClasses, getStudyMaterials } from '@/hooks/use-teacher-data';
import { formatDate } from '@/lib/utils';
import type { StudyMaterial } from '@/hooks/use-teacher-data';
import styles from './classes.module.css';

const TYPE_COLORS: Record<string, { bg: string; color: string }> = {
  notes: { bg: '#e8f5e9', color: '#2e7d32' },
  pdf: { bg: '#ffebee', color: '#c62828' },
  worksheet: { bg: '#e3f2fd', color: '#1565c0' },
  'question-bank': { bg: '#fff3e0', color: '#e65100' },
  presentation: { bg: '#f3e5f5', color: '#7b1fa2' },
  video: { bg: '#fce4ec', color: '#ad1457' },
};

const TYPE_ICONS: Record<string, string> = {
  notes: 'TXT',
  pdf: 'PDF',
  worksheet: 'WS',
  'question-bank': 'QB',
  presentation: 'PPT',
  video: 'VID',
};

const FILTER_TYPES = ['All', 'notes', 'pdf', 'worksheet', 'question-bank', 'presentation', 'video'];

export default function TeacherClassesPage() {
  const classes = getTeacherClasses();
  const materials = getStudyMaterials();
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);

  const filteredMaterials = useMemo(() => {
    let result = materials;

    if (selectedClass) {
      const cls = classes.find((c) => c.id === selectedClass);
      if (cls) {
        result = result.filter((m) => m.class === cls.class && m.section === cls.section);
      }
    }

    if (activeFilter !== 'All') {
      result = result.filter((m) => m.type === activeFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (m) =>
          m.title.toLowerCase().includes(q) ||
          m.chapter.toLowerCase().includes(q) ||
          m.description.toLowerCase().includes(q)
      );
    }

    return result;
  }, [materials, classes, selectedClass, activeFilter, searchQuery]);

  const totalDownloads = materials.reduce((s, m) => s + m.downloads, 0);

  function getFilterCount(type: string): number {
    let base = materials;
    if (selectedClass) {
      const cls = classes.find((c) => c.id === selectedClass);
      if (cls) base = base.filter((m) => m.class === cls.class && m.section === cls.section);
    }
    if (type === 'All') return base.length;
    return base.filter((m) => m.type === type).length;
  }

  return (
    <div className={styles.page}>
      {/* ── Header ── */}
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Study Material</h1>
        <button className={styles.uploadBtn} onClick={() => setShowModal(true)}>
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M10 4v12M4 10h12" />
          </svg>
          Upload Material
        </button>
      </div>

      {/* ── Class Cards ── */}
      <div className={styles.classGrid}>
        {classes.map((cls) => {
          const matCount = materials.filter((m) => m.class === cls.class && m.section === cls.section).length;
          const clsColor = cls.class === '7' ? '#e91e63' : cls.class === '8' ? '#1976d2' : '#388e3c';
          return (
            <div
              key={cls.id}
              className={`${styles.classCard} ${selectedClass === cls.id ? styles.classCardActive : ''}`}
              onClick={() => setSelectedClass(selectedClass === cls.id ? null : cls.id)}
            >
              <div className={styles.classCardBg} style={{ background: clsColor }} />
              <div className={styles.classCardHeader}>
                <span className={styles.className}>Class {cls.class}-{cls.section}</span>
                {cls.isClassTeacher && <span className={styles.ctBadge}>CT</span>}
              </div>
              <div className={styles.classStats}>
                <div className={styles.classStat}>
                  <span className={styles.classStatValue}>{cls.totalStudents}</span>
                  <span className={styles.classStatLabel}>Students</span>
                </div>
                <div className={styles.classStat}>
                  <span className={styles.classStatValue}>{matCount}</span>
                  <span className={styles.classStatLabel}>Materials</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Filters ── */}
      <div className={styles.filterRow}>
        <div className={styles.filterTabs}>
          {FILTER_TYPES.map((type) => {
            const count = getFilterCount(type);
            if (type !== 'All' && count === 0) return null;
            return (
              <button
                key={type}
                className={`${styles.filterTab} ${activeFilter === type ? styles.filterTabActive : ''}`}
                onClick={() => setActiveFilter(type)}
              >
                {type === 'All' ? 'All' : type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ')} ({count})
              </button>
            );
          })}
        </div>
        <div className={styles.searchBox}>
          <svg className={styles.searchIcon} width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="9" cy="9" r="6" />
            <path d="M14 14l4 4" />
          </svg>
          <input
            className={styles.searchInput}
            type="text"
            placeholder="Search materials..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* ── Materials List ── */}
      <div>
        <div className={styles.sectionTitle}>
          {selectedClass
            ? `Class ${classes.find((c) => c.id === selectedClass)?.class}-${classes.find((c) => c.id === selectedClass)?.section} Materials`
            : 'All Materials'}
        </div>
        <div className={styles.sectionSub}>{filteredMaterials.length} files &middot; {totalDownloads} total downloads</div>
      </div>

      {filteredMaterials.length > 0 ? (
        <div className={styles.materialsList}>
          {filteredMaterials.map((mat) => {
            const tc = TYPE_COLORS[mat.type] || { bg: '#f5f5f5', color: '#616161' };
            return (
              <div key={mat.id} className={styles.materialCard}>
                <div className={styles.materialIcon} style={{ background: tc.bg, color: tc.color }}>
                  {TYPE_ICONS[mat.type] || 'FILE'}
                </div>
                <div className={styles.materialInfo}>
                  <div className={styles.materialTitle}>{mat.title}</div>
                  <div className={styles.materialDesc}>{mat.description}</div>
                  <div className={styles.materialMeta}>
                    <span className={styles.metaItem}>
                      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="4" width="14" height="12" rx="1" />
                        <path d="M7 2v4M13 2v4M3 8h14" />
                      </svg>
                      {formatDate(mat.uploadDate)}
                    </span>
                    <span className={styles.metaItem}>
                      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="4" y="3" width="12" height="14" rx="1" />
                        <path d="M8 7h4M8 10h4M8 13h2" />
                      </svg>
                      {mat.fileSize}
                    </span>
                    <span className={styles.metaItem}>
                      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M10 3v10M6 9l4 4 4-4" />
                        <path d="M4 15h12" />
                      </svg>
                      {mat.downloads} downloads
                    </span>
                    <span>Class {mat.class}-{mat.section}</span>
                  </div>
                </div>
                <div className={styles.materialTags}>
                  <span className={styles.typeBadge} style={{ background: tc.bg, color: tc.color }}>
                    {mat.type.replace('-', ' ')}
                  </span>
                  <span className={styles.chapterBadge}>{mat.chapter}</span>
                </div>
                <div className={styles.materialActions}>
                  <button className={styles.downloadBtn}>
                    <svg width="12" height="12" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M10 3v10M6 9l4 4 4-4" />
                      <path d="M4 15h12" />
                    </svg>
                    Download
                  </button>
                  <button className={styles.deleteBtn}>Delete</button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className={styles.emptyState}>No materials found matching your filters.</div>
      )}

      {/* ── Upload Modal ── */}
      {showModal && (
        <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Upload Study Material</h2>
              <button className={styles.modalClose} onClick={() => setShowModal(false)}>
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M5 5l10 10M15 5L5 15" />
                </svg>
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Title</label>
                <input className={styles.formInput} type="text" placeholder="Enter material title" />
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Class</label>
                  <select className={styles.formSelect}>
                    <option value="">Select Class</option>
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>Class {c.class}-{c.section}</option>
                    ))}
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Type</label>
                  <select className={styles.formSelect}>
                    <option value="">Select Type</option>
                    <option value="notes">Notes</option>
                    <option value="pdf">PDF</option>
                    <option value="worksheet">Worksheet</option>
                    <option value="question-bank">Question Bank</option>
                    <option value="presentation">Presentation</option>
                    <option value="video">Video</option>
                  </select>
                </div>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Chapter / Topic</label>
                <input className={styles.formInput} type="text" placeholder="e.g. Grammar, Poetry, Unit 3" />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Description</label>
                <textarea className={styles.formTextarea} placeholder="Brief description of the material" rows={3} />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Upload File</label>
                <div className={styles.uploadZone}>
                  <svg width="32" height="32" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10 14V3" />
                    <path d="M6 7l4-4 4 4" />
                    <path d="M3 14v2a1 1 0 001 1h12a1 1 0 001-1v-2" />
                  </svg>
                  <div className={styles.uploadZoneText}>Click to upload or drag & drop</div>
                  <div className={styles.uploadZoneSub}>PDF, DOC, PPT, MP4 up to 50MB</div>
                </div>
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.cancelBtn} onClick={() => setShowModal(false)}>Cancel</button>
              <button className={styles.submitBtn} onClick={() => setShowModal(false)}>Upload Material</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
