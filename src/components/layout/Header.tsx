'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  getParent,
  getNotifications,
  getNotices,
  getHomeworkList,
  getDocuments,
  getSupportInfo,
} from '@/hooks/use-data';
import { NAV_ITEMS } from '@/lib/constants';
import { getInitials } from '@/lib/utils';
import Modal from '@/components/common/Modal';
import type { Notification } from '@/types';
import styles from './Header.module.css';

interface HeaderProps {
  title: string;
  onMenuClick: () => void;
}

interface SearchResult {
  id: string;
  label: string;
  group: 'Pages' | 'Notices' | 'Homework' | 'Documents';
  href: string;
}

const NOTIFICATION_ROUTES: Record<Notification['type'], string> = {
  attendance: '/attendance',
  homework: '/homework',
  fee: '/fees',
  notice: '/notices',
  leave: '/leave',
  exam: '/timetable',
  transport: '/transport',
  chat: '/chat',
  emergency: '/emergency',
};

export default function Header({ title, onMenuClick }: HeaderProps) {
  const router = useRouter();
  const parent = getParent();
  const notifications = getNotifications();
  const support = getSupportInfo();

  const [readIds, setReadIds] = useState<Set<string>>(
    () => new Set(notifications.filter((n) => n.isRead).map((n) => n.id)),
  );
  const unreadCount = notifications.filter((n) => !readIds.has(n.id)).length;

  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [query, setQuery] = useState('');
  const [activeResult, setActiveResult] = useState(0);
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchIndex = useMemo<SearchResult[]>(() => {
    const pages = NAV_ITEMS.map((item) => ({
      id: `page-${item.href}`,
      label: item.label,
      group: 'Pages' as const,
      href: item.href,
    }));
    const notices = getNotices().map((n) => ({ id: `notice-${n.id}`, label: n.title, group: 'Notices' as const, href: '/notices' }));
    const homework = getHomeworkList().map((h) => ({ id: `hw-${h.id}`, label: `${h.subject}: ${h.title}`, group: 'Homework' as const, href: '/homework' }));
    const documents = getDocuments().map((d) => ({ id: `doc-${d.id}`, label: d.name, group: 'Documents' as const, href: '/documents' }));
    return [...pages, ...notices, ...homework, ...documents];
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return searchIndex.filter((r) => r.group === 'Pages');
    return searchIndex.filter((r) => r.label.toLowerCase().includes(q)).slice(0, 12);
  }, [query, searchIndex]);

  function openSearch() {
    setQuery('');
    setActiveResult(0);
    setShowSearch(true);
  }

  function goTo(href: string) {
    setShowSearch(false);
    router.push(href);
  }

  function handleSearchKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveResult((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveResult((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && results[activeResult]) {
      goTo(results[activeResult].href);
    }
  }

  function openNotification(n: Notification) {
    setReadIds((prev) => new Set(prev).add(n.id));
    setShowNotifications(false);
    router.push(n.actionUrl || NOTIFICATION_ROUTES[n.type]);
  }

  function markAllRead() {
    setReadIds(new Set(notifications.map((n) => n.id)));
  }

  function handleLogout() {
    setShowDropdown(false);
    router.push('/login');
  }

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <button className={styles.menuButton} onClick={onMenuClick} aria-label="Open menu">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M3 6h16M3 11h16M3 16h16" />
          </svg>
        </button>
        <h1 className={styles.pageTitle}>{title}</h1>
      </div>

      <div className={styles.right}>
        <button className={styles.iconButton} title="Search" aria-label="Search" onClick={openSearch}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <circle cx="9" cy="9" r="6" />
            <path d="M14 14l4 4" />
          </svg>
        </button>

        <div className={styles.notifWrap} ref={notificationsRef}>
          <button
            className={styles.iconButton}
            title="Notifications"
            aria-label="Notifications"
            onClick={() => { setShowNotifications((v) => !v); setShowDropdown(false); }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 2a6 6 0 016 6c0 3.5 1 5.5 2 7H2c1-1.5 2-3.5 2-7a6 6 0 016-6z" />
              <path d="M8 15a2 2 0 004 0" />
            </svg>
            {unreadCount > 0 && <span className={styles.badge}>{unreadCount}</span>}
          </button>

          {showNotifications && (
            <div className={styles.notifPanel}>
              <div className={styles.notifHeader}>
                <span className={styles.notifTitle}>Notifications</span>
                <button className={styles.notifMarkAll} onClick={markAllRead} disabled={unreadCount === 0}>
                  Mark all as read
                </button>
              </div>
              <div className={styles.notifList}>
                {notifications.map((n) => {
                  const isRead = readIds.has(n.id);
                  return (
                    <button
                      key={n.id}
                      className={`${styles.notifItem} ${isRead ? '' : styles.notifUnread}`}
                      onClick={() => openNotification(n)}
                    >
                      <span className={`${styles.notifDot} ${n.priority === 'critical' || n.priority === 'important' ? styles.notifDotAlert : ''}`} />
                      <span className={styles.notifBody}>
                        <span className={styles.notifItemTitle}>{n.title}</span>
                        <span className={styles.notifMessage}>{n.message}</span>
                        <span className={styles.notifTime}>{n.timestamp}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className={styles.userWrap} ref={dropdownRef}>
          <button className={styles.userButton} onClick={() => { setShowDropdown(!showDropdown); setShowNotifications(false); }}>
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
              <button className={styles.dropdownItem} onClick={() => { setShowDropdown(false); setOpenFaq(null); setShowHelp(true); }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="8" cy="8" r="7"/><path d="M8 5v3M8 10h.01"/></svg>
                Help &amp; Support
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

      {showSearch && (
        <Modal title="Search" subtitle="Find pages, notices, homework and documents" onClose={() => setShowSearch(false)} size="md">
          <input
            autoFocus
            className={styles.searchInput}
            type="text"
            placeholder="Type to search..."
            value={query}
            onChange={(e) => { setQuery(e.target.value); setActiveResult(0); }}
            onKeyDown={handleSearchKey}
          />
          <div className={styles.searchResults}>
            {results.length === 0 ? (
              <div className={styles.searchEmpty}>No results for &ldquo;{query}&rdquo;</div>
            ) : (
              results.map((r, i) => (
                <button
                  key={r.id}
                  className={`${styles.searchItem} ${i === activeResult ? styles.searchItemActive : ''}`}
                  onMouseEnter={() => setActiveResult(i)}
                  onClick={() => goTo(r.href)}
                >
                  <span className={styles.searchLabel}>{r.label}</span>
                  <span className={styles.searchGroup}>{r.group}</span>
                </button>
              ))
            )}
          </div>
        </Modal>
      )}

      {showHelp && (
        <Modal title="Help & Support" subtitle={`Support hours: ${support.hours}`} onClose={() => setShowHelp(false)} size="md">
          <div className={styles.helpContact}>
            <a className={styles.helpContactBtn} href={`tel:${support.phone.replace(/\s/g, '')}`}>Call {support.phone}</a>
            <a className={styles.helpContactBtn} href={`mailto:${support.email}`}>Email {support.email}</a>
          </div>
          <div className={styles.faqTitle}>Frequently asked questions</div>
          <div className={styles.faqList}>
            {support.faqs.map((faq) => {
              const isOpen = openFaq === faq.id;
              return (
                <div key={faq.id} className={styles.faqItem}>
                  <button className={styles.faqQuestion} onClick={() => setOpenFaq(isOpen ? null : faq.id)} aria-expanded={isOpen}>
                    {faq.question}
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                      <path d={isOpen ? 'M3 9l4-4 4 4' : 'M3 5l4 4 4-4'} />
                    </svg>
                  </button>
                  {isOpen && <div className={styles.faqAnswer}>{faq.answer}</div>}
                </div>
              );
            })}
          </div>
        </Modal>
      )}
    </header>
  );
}
