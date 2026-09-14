'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ADMIN_NAV_ITEMS } from '@/lib/admin-constants';
import { getAdmin } from '@/hooks/use-admin-data';
import { getInitials } from '@/lib/utils';
import AdminNavIcon from './AdminNavIcon';
import styles from './AdminSidebar.module.css';

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const admin = getAdmin();

  return (
    <>
      {isOpen && <div className={styles.overlay} onClick={onClose} />}
      <aside className={`${styles.sidebar} ${!isOpen ? styles.sidebarHidden : ''}`}>
        {/* ── Brand ── */}
        <div className={styles.brand}>
          <div className={styles.brandRow}>
            <div className={styles.brandIcon}>S</div>
            <div>
              <div className={styles.brandName}>SchoolAI</div>
              <div className={styles.brandSub}>Admin Portal</div>
            </div>
          </div>
        </div>

        {/* ── Nav ── */}
        <nav className={styles.nav}>
          {ADMIN_NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
                onClick={onClose}
              >
                <span className={styles.navIcon}>
                  <AdminNavIcon icon={item.icon} />
                </span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* ── Admin Card ── */}
        <div className={styles.adminCard}>
          <div className={styles.adminAvatar}>{getInitials(admin.name)}</div>
          <div className={styles.adminInfo}>
            <div className={styles.adminName}>{admin.name}</div>
            <div className={styles.adminRole}>{admin.role}</div>
          </div>
        </div>
      </aside>
    </>
  );
}
