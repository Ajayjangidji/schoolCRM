'use client';

import { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { usePathname } from 'next/navigation';
import { NAV_ITEMS } from '@/lib/constants';
import styles from './layout.module.css';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const currentNav = NAV_ITEMS.find((item) => item.href === pathname);
  const pageTitle = currentNav?.label || 'Dashboard';

  return (
    <div className={styles.layout}>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className={styles.content}>
        <Header
          title={pageTitle}
          onMenuClick={() => setSidebarOpen(true)}
        />
        <main className={styles.main}>{children}</main>
      </div>
    </div>
  );
}
