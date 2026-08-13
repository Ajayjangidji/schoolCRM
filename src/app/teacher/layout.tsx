'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import TeacherSidebar from '@/components/teacher/TeacherSidebar';
import Header from '@/components/layout/Header';
import { TEACHER_NAV_ITEMS } from '@/lib/teacher-constants';
import styles from './layout.module.css';

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const currentNav = TEACHER_NAV_ITEMS.find((item) => item.href === pathname);
  const pageTitle = currentNav?.label || 'Dashboard';

  return (
    <div className={styles.layout}>
      <TeacherSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
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
