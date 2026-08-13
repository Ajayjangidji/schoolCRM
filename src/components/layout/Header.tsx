'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getParent, getNotifications } from '@/hooks/use-data';
import { getInitials } from '@/lib/utils';
import styles from './Header.module.css';

interface HeaderProps {
  title: string;
  onMenuClick: () => void;
}

export default function Header({ title, onMenuClick }: HeaderProps) {
  const router = useRouter();
  const parent = getParent();
  const notifications = getNotifications();
  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleLogout() {
    setShowDropdown(false);
    router.push('/login');
  }

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <button className={styles.menuButton} onClick={onMenuClick}>
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M3 6h16M3 11h16M3 16h16" />
          </svg>
        </button>
        <h1 className={styles.pageTitle}>{title}</h1>
      </div>

      <div className={styles.right}>
        <button className={styles.iconButton} title="Search">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <circle cx="9" cy="9" r="6" />
            <path d="M14 14l4 4" />
          </svg>
        </button>

        <button className={styles.iconButton} title="Notifications">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 2a6 6 0 016 6c0 3.5 1 5.5 2 7H2c1-1.5 2-3.5 2-7a6 6 0 016-6z" />
            <path d="M8 15a2 2 0 004 0" />
          </svg>
          {unreadCount > 0 && <span className={styles.badge}>{unreadCount}</span>}
        </button>

        <div className={styles.userWrap} ref={dropdownRef}>
          <button className={styles.userButton} onClick={() => setShowDropdown(!showDropdown)}>
            <div className={styles.userAvatar}>
              {getInitials(parent.name)}
            </div>
            <span className={styles.userName}>{parent.name}</span>
            <svg className={styles.chevron} width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M4 5.5l3 3 3-3"/></svg>
          </button>

          {showDropdown && (
            <div className={styles.dropdown}>
              <div className={styles.dropdownHeader}>
                <div className={styles.dropdownAvatar}>{getInitials(parent.name)}</div>
                <div>
                  <div className={styles.dropdownName}>{parent.name}</div>
                  <div className={styles.dropdownEmail}>{parent.email}</div>
                </div>
              </div>
              <div className={styles.dropdownDivider} />
              <button className={styles.dropdownItem} onClick={() => { setShowDropdown(false); router.push('/settings'); }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="8" cy="8" r="2.5"/><path d="M13.5 8a5.5 5.5 0 01-.3 1.3l1.2 1-.8 1.4-1.5-.5a5.6 5.6 0 01-1.1.7l-.2 1.6h-1.6l-.2-1.6a5.6 5.6 0 01-1.1-.7l-1.5.5-.8-1.4 1.2-1A5.5 5.5 0 016.5 8c0-.4 0-.9.2-1.3l-1.2-1 .8-1.4 1.5.5a5.6 5.6 0 011.1-.7L9.1 2.5h1.6l.2 1.6c.4.2.8.4 1.1.7l1.5-.5.8 1.4-1.2 1c.2.4.3.9.3 1.3z"/></svg>
                Settings
              </button>
              <button className={styles.dropdownItem} onClick={() => setShowDropdown(false)}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="8" cy="8" r="7"/><path d="M8 5v3M8 10h.01"/></svg>
                Help & Support
              </button>
              <div className={styles.dropdownDivider} />
              <button className={`${styles.dropdownItem} ${styles.dropdownLogout}`} onClick={handleLogout}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 14H3a1 1 0 01-1-1V3a1 1 0 011-1h3"/><path d="M10 11l3-3-3-3"/><path d="M13 8H6"/></svg>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
