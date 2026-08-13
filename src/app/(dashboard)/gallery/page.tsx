'use client';

import { useState } from 'react';
import { getEventAlbums } from '@/hooks/use-data';
import { formatDate } from '@/lib/utils';
import styles from './gallery.module.css';

export default function GalleryPage() {
  const albums = getEventAlbums();
  const [selectedAlbum, setSelectedAlbum] = useState<string | null>(null);

  const totalPhotos = albums.reduce((sum, a) => sum + a.photoCount, 0);
  const totalVideos = albums.reduce((sum, a) => sum + a.videoCount, 0);

  return (
    <div className={styles.page}>
      {/* Stats */}
      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="3" width="20" height="18" rx="2" /><circle cx="8" cy="10" r="2" /><path d="M2 17l5-5 4 4 5-6 6 7" /></svg>
          </div>
          <div>
            <div className={styles.statNum}>{albums.length}</div>
            <div className={styles.statLabel}>Albums</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: 'var(--success-light)', color: 'var(--success)' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" /></svg>
          </div>
          <div>
            <div className={styles.statNum}>{totalPhotos}</div>
            <div className={styles.statLabel}>Total Photos</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: 'var(--danger-light)', color: 'var(--danger)' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polygon points="5,3 19,3 19,21 5,21" /><polygon points="10,8 16,12 10,16" /></svg>
          </div>
          <div>
            <div className={styles.statNum}>{totalVideos}</div>
            <div className={styles.statLabel}>Total Videos</div>
          </div>
        </div>
      </div>

      {/* Album Grid */}
      <div className={styles.albumGrid}>
        {albums.map((album) => (
          <div
            key={album.id}
            className={styles.albumCard}
            onClick={() => setSelectedAlbum(selectedAlbum === album.id ? null : album.id)}
          >
            <div className={styles.albumCover}>
              <div className={styles.albumPlaceholder}>
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="4" y="6" width="40" height="36" rx="4" />
                  <circle cx="16" cy="18" r="4" />
                  <path d="M4 34l10-10 8 8 10-12 12 14" />
                </svg>
              </div>
              <div className={styles.albumOverlay}>
                <div className={styles.albumCounts}>
                  <span className={styles.albumCountItem}>
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="2" width="12" height="12" rx="1.5" /><circle cx="5.5" cy="5.5" r="1" /><path d="M14 10l-3.5-3.5L3 14" /></svg>
                    {album.photoCount}
                  </span>
                  {album.videoCount > 0 && (
                    <span className={styles.albumCountItem}>
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><polygon points="6,3 13,8 6,13" /></svg>
                      {album.videoCount}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className={styles.albumInfo}>
              <div className={styles.albumTitle}>{album.title}</div>
              <div className={styles.albumDate}>{formatDate(album.date)}</div>
            </div>

            {selectedAlbum === album.id && (
              <div className={styles.albumExpanded}>
                <div className={styles.photoGrid}>
                  {Array.from({ length: Math.min(album.photoCount, 6) }).map((_, i) => (
                    <div key={i} className={styles.photoThumb}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round">
                        <rect x="2" y="2" width="20" height="20" rx="2" />
                        <circle cx="8" cy="8" r="2" />
                        <path d="M22 16l-6-6-8 8" />
                      </svg>
                    </div>
                  ))}
                </div>
                {album.photoCount > 6 && (
                  <div className={styles.viewAllBtn}>
                    View all {album.photoCount} photos &rarr;
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
