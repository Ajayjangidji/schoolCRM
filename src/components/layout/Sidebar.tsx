'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAV_ITEMS } from '@/lib/constants';
import { getStudent } from '@/hooks/use-data';
import { getInitials } from '@/lib/utils';
import NavIcon from './NavIcon';
import styles from './Sidebar.module.css';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const student = getStudent();

  return (
    <>
      <div
        className={`${styles.overlay} ${isOpen ? styles.overlayVisible : ''}`}
        onClick={onClose}
      />
      <aside className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.brand}>
          <div className={styles.brandIcon}>S</div>
          <div className={styles.brandText}>
            <span className={styles.brandName}>SchoolAI</span>
            <span className={styles.brandTagline}>Smart School CRM</span>
          </div>
        </div>

        <nav className={styles.nav}>
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
                onClick={onClose}
              >
                <NavIcon name={item.icon} className={styles.navIcon} />
                <span className={styles.navLabel}>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className={styles.studentCard}>
          <div className={styles.studentInfo}>
            <div className={styles.studentAvatar}>
              {getInitials(student.name)}
            </div>
            <div className={styles.studentDetails}>
              <div className={styles.studentName}>{student.name}</div>
              <div className={styles.studentClass}>
                Class {student.class}-{student.section} | Roll #{student.rollNumber}
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
