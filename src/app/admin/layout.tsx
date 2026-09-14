'use client';

import { useState } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import styles from './layout.module.css';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className={styles.layoutWrapper}>
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className={styles.mainArea}>
        {/* ── Header ── */}
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <button className={styles.menuBtn} onClick={() => setSidebarOpen(true)}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <path d="M3 5h14M3 10h14M3 15h14" />
              </svg>
            </button>
            <span className={styles.headerTitle}>Admin Panel</span>
          </div>
          <div className={styles.headerRight}>
            <button className={styles.headerIcon}>
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="9" r="6" />
                <path d="M14 14l4 4" />
              </svg>
            </button>
            <button className={styles.headerIcon}>
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 2a6 6 0 016 6c0 3.5 1 5.5 2 7H2c1-1.5 2-3.5 2-7a6 6 0 016-6z" />
                <path d="M8 15a2 2 0 004 0" />
              </svg>
              <span className={styles.notifDot} />
            </button>
          </div>
        </header>

        {/* ── Content ── */}
        <main className={styles.content}>{children}</main>
      </div>
    </div>
  );
}
