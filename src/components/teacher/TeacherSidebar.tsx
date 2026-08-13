'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { TEACHER_NAV_ITEMS } from '@/lib/teacher-constants';
import { getTeacher } from '@/hooks/use-teacher-data';
import { getInitials } from '@/lib/utils';
import TeacherNavIcon from './TeacherNavIcon';
import styles from './TeacherSidebar.module.css';

interface TeacherSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TeacherSidebar({ isOpen, onClose }: TeacherSidebarProps) {
  const pathname = usePathname();
  const teacher = getTeacher();

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
            <span className={styles.brandTagline}>Teacher Portal</span>
          </div>
        </div>

        <nav className={styles.nav}>
          {TEACHER_NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
                onClick={onClose}
              >
                <TeacherNavIcon name={item.icon} className={styles.navIcon} />
                <span className={styles.navLabel}>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className={styles.teacherCard}>
          <div className={styles.teacherInfo}>
            <div className={styles.teacherAvatar}>
              {getInitials(teacher.name)}
            </div>
            <div className={styles.teacherDetails}>
              <div className={styles.teacherName}>{teacher.name}</div>
              <div className={styles.teacherSubject}>
                {teacher.subject} | {teacher.designation}
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
