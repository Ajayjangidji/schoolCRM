'use client';

import { useState, useEffect } from 'react';
import { getEventAlbums, getAlbumMedia } from '@/hooks/use-data';
import { formatDate } from '@/lib/utils';
import Modal from '@/components/common/Modal';
import styles from './gallery.module.css';

type MediaFilter = 'all' | 'photo' | 'video';

const PAGE_SIZE = 20;

function durationToSeconds(duration: string | undefined): number {
  if (!duration) return 30;
  const [minutes, seconds] = duration.split(':').map(Number);
  return minutes * 60 + seconds;
}

export default function GalleryPage() {
  const albums = getEventAlbums();
  const [openAlbumId, setOpenAlbumId] = useState<string | null>(null);
  const [mediaFilter, setMediaFilter] = useState<MediaFilter>('all');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);
  const [playing, setPlaying] = useState(false);

  const openAlbum = albums.find((a) => a.id === openAlbumId) || null;
  const allMedia = openAlbum ? getAlbumMedia(openAlbum.id) : [];
  const filteredMedia = allMedia.filter((m) => mediaFilter === 'all' || m.type === mediaFilter);
  const viewerItem = viewerIndex !== null ? filteredMedia[viewerIndex] : null;

  function openAlbumById(id: string) {
    setOpenAlbumId(id);
    setMediaFilter('all');
    setVisibleCount(PAGE_SIZE);
    setViewerIndex(null);
  }

  function closeAlbum() {
    setOpenAlbumId(null);
    setViewerIndex(null);
    setPlaying(false);
  }

  function showMedia(index: number) {
    setViewerIndex(index);
    setPlaying(false);
  }

  function stepViewer(delta: number) {
    if (viewerIndex === null) return;
    const next = viewerIndex + delta;
    if (next >= 0 && next < filteredMedia.length) showMedia(next);
  }

  useEffect(() => {
    if (viewerIndex === null) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'ArrowLeft') stepViewer(-1);
      if (e.key === 'ArrowRight') stepViewer(1);
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  });

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
        {albums.map((album, albumIndex) => (
          <button
            key={album.id}
            className={styles.albumCard}
            onClick={() => openAlbumById(album.id)}
            aria-label={`Open album ${album.title}`}
          >
            <div className={styles.albumCover} style={{ background: `linear-gradient(135deg, hsl(${(albumIndex * 90) % 360} 70% 60%), hsl(${(albumIndex * 90 + 40) % 360} 70% 45%))` }}>
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
          </button>
        ))}
      </div>

      {openAlbum && viewerItem === null && (
        <Modal
          title={openAlbum.title}
          subtitle={`${formatDate(openAlbum.date)} · ${openAlbum.photoCount} photos, ${openAlbum.videoCount} videos`}
          onClose={closeAlbum}
          size="xl"
        >
          <div className={styles.mediaFilters} role="tablist" aria-label="Media type">
            {(['all', 'photo', 'video'] as MediaFilter[]).map((f) => (
              <button
                key={f}
                role="tab"
                aria-selected={mediaFilter === f}
                className={`${styles.mediaFilter} ${mediaFilter === f ? styles.mediaFilterActive : ''}`}
                onClick={() => { setMediaFilter(f); setVisibleCount(PAGE_SIZE); }}
              >
                {f === 'all' ? 'All' : f === 'photo' ? 'Photos' : 'Videos'}
              </button>
            ))}
          </div>
          <div className={styles.mediaGrid}>
            {filteredMedia.slice(0, visibleCount).map((item, i) => (
              <button
                key={item.id}
                className={styles.mediaThumb}
                style={{ background: `linear-gradient(135deg, hsl(${item.hue} 65% 62%), hsl(${(item.hue + 35) % 360} 65% 42%))` }}
                onClick={() => showMedia(i)}
                aria-label={`Open ${item.caption}`}
              >
                {item.type === 'video' ? (
                  <>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><polygon points="8,5 19,12 8,19" /></svg>
                    <span className={styles.mediaBadge}>{item.duration}</span>
                  </>
                ) : (
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" /></svg>
                )}
              </button>
            ))}
          </div>
          <div className={styles.mediaCount}>Showing {Math.min(visibleCount, filteredMedia.length)} of {filteredMedia.length}</div>
          {visibleCount < filteredMedia.length && (
            <button className={styles.loadMoreBtn} onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}>
              Load more
            </button>
          )}
        </Modal>
      )}

      {openAlbum && viewerItem && viewerIndex !== null && (
        <Modal
          title={openAlbum.title}
          onClose={() => setViewerIndex(null)}
          size="lg"
          footer={<button className={styles.backBtn} onClick={() => setViewerIndex(null)}>Back to album</button>}
        >
          <div
            className={styles.viewerStage}
            style={{ background: `linear-gradient(135deg, hsl(${viewerItem.hue} 65% 60%), hsl(${(viewerItem.hue + 35) % 360} 65% 38%))` }}
          >
            <button className={`${styles.viewerNav} ${styles.viewerPrev}`} onClick={() => stepViewer(-1)} disabled={viewerIndex === 0} aria-label="Previous">
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 4l-6 6 6 6" /></svg>
            </button>
            {viewerItem.type === 'video' ? (
              <button className={styles.playBtn} onClick={() => setPlaying((p) => !p)} aria-label={playing ? 'Pause video' : 'Play video'}>
                {playing ? (
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14" /><rect x="14" y="5" width="4" height="14" /></svg>
                ) : (
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor"><polygon points="8,5 19,12 8,19" /></svg>
                )}
              </button>
            ) : (
              <svg width="72" height="72" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" /></svg>
            )}
            <button className={`${styles.viewerNav} ${styles.viewerNext}`} onClick={() => stepViewer(1)} disabled={viewerIndex === filteredMedia.length - 1} aria-label="Next">
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M8 4l6 6-6 6" /></svg>
            </button>
            {viewerItem.type === 'video' && (
              <div className={styles.progressTrack}>
                <div
                  key={viewerItem.id}
                  className={styles.progressFill}
                  style={{ animationDuration: `${durationToSeconds(viewerItem.duration)}s`, animationPlayState: playing ? 'running' : 'paused' }}
                />
              </div>
            )}
          </div>
          <div className={styles.viewerCaption}>
            <span>{viewerItem.caption}{viewerItem.duration ? ` (${viewerItem.duration})` : ''}</span>
            <span className={styles.viewerPosition}>{viewerIndex + 1} / {filteredMedia.length}</span>
          </div>
        </Modal>
      )}
    </div>
  );
}
